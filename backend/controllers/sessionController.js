const prisma = require('../db/prismaClient');
const fs = require('fs');
const path = require('path');

const STATUS_PRIORITY = {
    'REGISTERED': 0,
    'INCLUSION_PASSED': 1,
    'EXCLUSION_PASSED': 2,
    'PAUSED': 3,
    'SCORED': 4,
    'RANDOMIZED': 5,
    'DISQUALIFIED': 6
};

function getNextStatus(current, target) {
    if ((STATUS_PRIORITY[target] || 0) > (STATUS_PRIORITY[current] || 0)) {
        return target;
    }
    return current;
}

// 1. POST /api/sessions/start
exports.startSession = async (req, res) => {
    try {
        const { hospitalPrefix, hospitalName, userId, uniqueId } = req.body;
        
        if (!hospitalPrefix) {
            return res.status(400).json({ error: 'hospitalPrefix is required' });
        }
        if (!uniqueId) {
            return res.status(400).json({ error: 'uniqueId is required' });
        }

        // Standardize HN by stripping /, -, spaces, and leading zeros
        const cleanUniqueId = uniqueId.trim().replace(/[\/\-\s]/g, '').replace(/^0+/, '');

        // Find or create hospital by prefix
        let hospital = await prisma.hospital.findUnique({ where: { prefix: hospitalPrefix } });
        if (!hospital) {
            hospital = await prisma.hospital.create({
                data: { prefix: hospitalPrefix, name: hospitalName || hospitalPrefix }
            });
        }
        
        // Use provided userId or a dummy user (create if needed)
        let actualUserId = userId;
        if (!actualUserId) {
            let dummyUser = await prisma.user.findFirst();
            if (!dummyUser) {
                dummyUser = await prisma.user.create({
                    data: { role: 'admin', hospitalId: hospital.id }
                });
            }
            actualUserId = dummyUser.id;
        }

        // Find or create Patient
        let patient = await prisma.patient.findUnique({
            where: {
                hospitalId_hn: {
                    hospitalId: hospital.id,
                    hn: cleanUniqueId
                }
            }
        });

        if (!patient) {
            patient = await prisma.patient.create({
                data: {
                    hn: cleanUniqueId,
                    hospitalId: hospital.id
                }
            });
        }

        // Check for existing session using Patient ID
        const existingSession = await prisma.trialSession.findFirst({
            where: {
                hospitalId: hospital.id,
                patientId: patient.id
            },
            orderBy: {
                registrationTimestamp: 'desc'
            }
        });

        if (existingSession) {
            return res.status(200).json({ 
                message: 'Existing session found', 
                session: existingSession,
                isExisting: true
            });
        }

        // Generate a sequential Trial System ID (e.g., KCMH-001, KCMH-002)
        const existingCount = await prisma.trialSession.count({
            where: { hospitalId: hospital.id }
        });

        let trialSystemId;
        let newSession;
        for (let attempt = 1; attempt <= 10; attempt++) {
            const sequentialNumber = existingCount + attempt;
            const paddedNumber = String(sequentialNumber).padStart(3, '0');
            trialSystemId = `${hospital.prefix}-${paddedNumber}`;

            // Check if already taken
            const existing = await prisma.trialSession.findUnique({ where: { trialSystemId } });
            if (existing) {
                if (attempt === 10) {
                    return res.status(500).json({ error: 'Could not generate a unique Trial ID after multiple attempts. Please try again or contact support.' });
                }
                continue;
            }

            newSession = await prisma.trialSession.create({
                data: {
                    trialSystemId,
                    patientId: patient.id,
                    hospitalId: hospital.id,
                    userId: actualUserId,
                    currentStatus: 'REGISTERED'
                }
            });
            break; // success
        }
        
        res.status(201).json({ message: 'Session started successfully', session: newSession });
    } catch (error) {
        console.error('Start session error:', error);
        res.status(500).json({ error: 'Failed to start session' });
    }
};

// 2. POST /api/sessions/:id/inclusion
exports.submitInclusion = async (req, res) => {
    try {
        const { id } = req.params;
        const { passed, failedReason } = req.body;
        
        const currentSession = await prisma.trialSession.findUnique({ where: { id } });
        if (!currentSession) return res.status(404).json({ error: 'Session not found' });
        
        const targetStatus = passed ? 'INCLUSION_PASSED' : 'DISQUALIFIED';

        const updatedSession = await prisma.trialSession.update({
            where: { id },
            data: {
                inclusionPassed: passed,
                failedReason: passed ? null : failedReason,
                inclusionPageTimestamp: new Date(),
                currentStatus: getNextStatus(currentSession.currentStatus, targetStatus)
            }
        });
        
        res.json({ message: 'Inclusion criteria updated', session: updatedSession });
    } catch (error) {
        console.error('Inclusion error:', error);
        res.status(500).json({ error: 'Failed to update inclusion criteria' });
    }
};

// 3. POST /api/sessions/:id/exclusion
exports.submitExclusion = async (req, res) => {
    try {
        const { id } = req.params;
        const { conditions } = req.body;
        
        // 11 criteria check. All must be false/absent to pass.
        const anyFailed = Object.values(conditions).some(val => val === true);
        
        const currentSession = await prisma.trialSession.findUnique({ where: { id } });
        if (!currentSession) return res.status(404).json({ error: 'Session not found' });

        const targetStatus = anyFailed ? 'DISQUALIFIED' : 'EXCLUSION_PASSED';
        
        const updatedSession = await prisma.trialSession.update({
            where: { id },
            data: {
                exclusionPassed: !anyFailed,
                failedReason: anyFailed ? 'Exclusion Failed' : null,
                exclusionPageTimestamp: new Date(),
                currentStatus: getNextStatus(currentSession.currentStatus, targetStatus)
            }
        });
        
        res.json({ message: 'Exclusion criteria updated', session: updatedSession });
    } catch (error) {
        console.error('Exclusion error:', error);
        res.status(500).json({ error: 'Failed to update exclusion criteria' });
    }
};

// 4. POST /api/sessions/:id/pause
exports.pauseSession = async (req, res) => {
    try {
        const { id } = req.params;
        
        const currentSession = await prisma.trialSession.findUnique({ where: { id } });
        if (!currentSession) return res.status(404).json({ error: 'Session not found' });
        
        const updatedSession = await prisma.trialSession.update({
            where: { id },
            data: {
                pauseTimestamp: new Date(),
                currentStatus: getNextStatus(currentSession.currentStatus, 'PAUSED')
            }
        });
        
        res.json({ message: 'Session paused', session: updatedSession });
    } catch (error) {
        console.error('Pause error:', error);
        res.status(500).json({ error: 'Failed to pause session' });
    }
};

// 5. POST /api/sessions/:id/resume
exports.resumeSession = async (req, res) => {
    try {
        const { id } = req.params;
        
        const currentSession = await prisma.trialSession.findUnique({ where: { id } });
        if (!currentSession) return res.status(404).json({ error: 'Session not found' });
        
        const updatedSession = await prisma.trialSession.update({
            where: { id },
            data: {
                resumeTimestamp: new Date()
            }
        });
        
        res.json({ message: 'Session resumed', session: updatedSession });
    } catch (error) {
        console.error('Resume error:', error);
        res.status(500).json({ error: 'Failed to resume session' });
    }
};

// 6. POST /api/sessions/:id/score (or select-score)
exports.submitScore = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            cognitiveSeverityScore,
            vascularRiskScore,
            behavioralSymptomsScore,
            functionalImpairmentScore,
            familyHistoryScore
        } = req.body;
        
        const currentSession = await prisma.trialSession.findUnique({ where: { id } });
        if (!currentSession) return res.status(404).json({ error: 'Session not found' });

        // Calculate the score sum automatically
        const totalScore = (cognitiveSeverityScore || 0) + 
                           (vascularRiskScore || 0) + 
                           (behavioralSymptomsScore || 0) + 
                           (functionalImpairmentScore || 0) + 
                           (familyHistoryScore || 0);
        
        // Strata selection based on config thresholds:
        // Score < 4 -> Low Risk (Ineligible)
        // Score 4-5 -> Moderate Risk
        // Score 6-9 -> High/Very High Risk
        let strata = 'Low Risk (Ineligible)';
        let eligible = false;
        
        if (totalScore >= 6) {
            strata = 'High/Very High Risk';
            eligible = true;
        } else if (totalScore >= 4) {
            strata = 'Moderate Risk';
            eligible = true;
        }

        const targetStatus = eligible ? 'RANDOMIZED' : 'DISQUALIFIED';
        let finalAssignedArm = null;

        if (targetStatus === 'RANDOMIZED') {
            if (currentSession.allocationResult && currentSession.strata === strata) {
                // Keep the same arm if already randomized in this stratum
                finalAssignedArm = currentSession.allocationResult;
            } else {
                // Count how many prior sessions were randomized into this stratum
                const existingCount = await prisma.trialSession.count({
                    where: {
                        strata: strata,
                        allocationResult: { not: null }
                    }
                });

                let fileName = null;
                if (strata === 'Moderate Risk') {
                    fileName = 'DrugArmBased.csv';
                } else if (strata === 'High/Very High Risk') {
                    fileName = 'PlaceboArmBased.csv';
                }

                if (fileName) {
                    const filePath = path.join(__dirname, '../randomList', fileName);
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    const lines = fileContent.trim().split('\n').filter(line => line.trim().length > 0).slice(1);
                    
                    if (lines.length > 0) {
                        const idx = existingCount % lines.length;
                        const cols = lines[idx].split(',');
                        if (cols.length >= 2) {
                            finalAssignedArm = cols[1].replace('\r', '').trim();
                        }
                    }
                }
            }
        }
        
        const updatedSession = await prisma.trialSession.update({
            where: { id },
            data: {
                cognitiveSeverityScore,
                vascularRiskScore,
                behavioralSymptomsScore,
                functionalImpairmentScore,
                familyHistoryScore,
                totalScore,
                strata,
                failedReason: eligible ? null : 'Score Too Low',
                allocationResult: finalAssignedArm,
                scoreTimestamp: new Date(),
                ...(targetStatus === 'RANDOMIZED' && !currentSession.randomizationTimestamp ? { randomizationTimestamp: new Date() } : {}),
                currentStatus: getNextStatus(currentSession.currentStatus, targetStatus)
            }
        });
        
        res.json({ message: 'Score saved and randomized', session: updatedSession });
    } catch (error) {
        console.error('Score selection error:', error);
        res.status(500).json({ error: 'Failed to submit score' });
    }
};
