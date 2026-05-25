const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboardStats = async (req, res) => {
    try {
        const sessions = await prisma.trialSession.findMany({
            include: {
                hospital: true,
                patient: true
            },
            orderBy: {
                registrationTimestamp: 'desc'
            }
        });

        // Compute stats for Admin Dashboard
        let totalRand = 0, drugArm = 0, placeboArm = 0, failInc = 0, failExc = 0, paused = 0;
        const hospStats = {};
        // Scores of interest are 4 to 9
        const scoreFreq = { 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
        const compStats = { 
            cognitiveSeverity: 0, 
            vascularRisk: 0, 
            behavioralSymptoms: 0, 
            functionalImpairment: 0, 
            familyHistory: 0 
        };

        const formattedData = sessions.map(d => {
            const hPrefix = d.hospital.prefix;
            if (!hospStats[hPrefix]) hospStats[hPrefix] = { rand: 0, fail: 0 };

            let displayStatus = 'Registered';
            
            if (d.currentStatus === 'RANDOMIZED') {
                displayStatus = 'Randomized';
                totalRand++;
                if (d.allocationResult?.includes('Drug Arm (Levetiracetam)')) drugArm++;
                else if (d.allocationResult?.includes('Placebo Arm')) placeboArm++;
                
                hospStats[hPrefix].rand++;
                if (d.totalScore >= 4 && d.totalScore <= 9) {
                    scoreFreq[d.totalScore]++;
                }

                if (d.cognitiveSeverityScore > 0) compStats.cognitiveSeverity++;
                if (d.vascularRiskScore > 0) compStats.vascularRisk++;
                if (d.behavioralSymptomsScore > 0) compStats.behavioralSymptoms++;
                if (d.functionalImpairmentScore > 0) compStats.functionalImpairment++;
                if (d.familyHistoryScore > 0) compStats.familyHistory++;

            } else if (d.currentStatus === 'DISQUALIFIED') {
                if (d.failedReason === 'Inclusion Failed') {
                    displayStatus = 'Failed Inclusion';
                    failInc++;
                } else if (d.failedReason === 'Exclusion Failed') {
                    displayStatus = 'Failed Exclusion';
                    failExc++;
                } else if (d.failedReason === 'Score Too Low') {
                    displayStatus = 'Failed Exclusion';
                    failExc++;
                }
                hospStats[hPrefix].fail++;
            } else if (d.currentStatus === 'INCLUSION_PASSED') {
                displayStatus = 'Passed Inclusion';
            } else if (d.currentStatus === 'EXCLUSION_PASSED') {
                displayStatus = 'Passed Exclusion';
            } else if (d.currentStatus === 'PAUSED') {
                displayStatus = 'Paused (Awaiting Return)';
                paused++;
            }

            // Function to format timestamp safely
            const formatTime = (ts) => {
                if (!ts) return '-';
                return new Date(ts).toLocaleTimeString('en-US', { 
                    timeZone: 'Asia/Bangkok', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            };

            const formatDate = (ts) => {
                if (!ts) return '-';
                return new Date(ts).toLocaleString('en-US', { 
                    timeZone: 'Asia/Bangkok', 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            };

            return {
                id: d.trialSystemId,
                hn: d.patient?.hn || 'N/A',
                hospital: d.hospital.prefix,
                status: displayStatus,
                anomaly: 'Normal',
                timestamps: {
                    start: formatDate(d.registrationTimestamp),
                    inc: formatTime(d.inclusionPageTimestamp),
                    exc: formatTime(d.exclusionPageTimestamp),
                    pause: formatTime(d.pauseTimestamp),
                    resume: formatTime(d.resumeTimestamp),
                    rand: formatTime(d.randomizationTimestamp)
                },
                score: d.totalScore,
                arm: d.allocationResult
            };
        });

        res.status(200).json({
            stats: {
                totalRand, drugArm, placeboArm, failInc, failExc, paused, hospStats, scoreFreq, compStats
            },
            data: formattedData
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
};
