const prisma = require('../db/prismaClient');
const { getAllocationList } = require('../randomList');

const STATUS_PRIORITY = {
    REGISTERED: 0,
    INCLUSION_PASSED: 1,
    EXCLUSION_PASSED: 2,
    PAUSED: 3,
    RANDOMIZED: 4,
    DISQUALIFIED: 5
};

class RequestError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

function getNextStatus(current, target) {
    return (STATUS_PRIORITY[target] || 0) > (STATUS_PRIORITY[current] || 0) ? target : current;
}

function normalizeHN(value) {
    return value.trim().replace(/[\/\-\s]/g, '').replace(/^0+/, '');
}

exports.startSession = async (req, res) => {
    try {
        const { hospitalPrefix, hospitalName, userId, uniqueId } = req.body;
        if (!hospitalPrefix || !uniqueId) return res.status(400).json({ error: 'hospitalPrefix and uniqueId are required' });

        const hn = normalizeHN(uniqueId);
        if (!hn) return res.status(400).json({ error: 'uniqueId is required' });

        let hospital = await prisma.hospital.findUnique({ where: { prefix: hospitalPrefix } });
        if (!hospital) hospital = await prisma.hospital.create({ data: { prefix: hospitalPrefix, name: hospitalName || hospitalPrefix } });

        let actualUserId = userId;
        if (!actualUserId) {
            let user = await prisma.user.findFirst({ where: { hospitalId: hospital.id } });
            if (!user) user = await prisma.user.create({ data: { role: 'doctor', hospitalId: hospital.id } });
            actualUserId = user.id;
        }

        let patient = await prisma.patient.findUnique({ where: { hospitalId_hn: { hospitalId: hospital.id, hn } } });
        if (!patient) patient = await prisma.patient.create({ data: { hn, hospitalId: hospital.id } });

        const existingSession = await prisma.trialSession.findFirst({
            where: { hospitalId: hospital.id, patientId: patient.id },
            orderBy: { registrationTimestamp: 'desc' }
        });
        if (existingSession) return res.json({ message: 'Existing session found', session: existingSession, isExisting: true });

        const existingCount = await prisma.trialSession.count({ where: { hospitalId: hospital.id } });
        const trialSystemId = `${hospital.prefix}-${String(existingCount + 1).padStart(3, '0')}`;
        const session = await prisma.trialSession.create({
            data: { trialSystemId, patientId: patient.id, hospitalId: hospital.id, userId: actualUserId }
        });
        res.status(201).json({ message: 'Session started successfully', session });
    } catch (error) {
        console.error('Start session error:', error);
        res.status(500).json({ error: 'Failed to start session' });
    }
};

exports.submitInclusion = async (req, res) => {
    try {
        const { id } = req.params;
        const { passed, failedReason } = req.body;
        if (typeof passed !== 'boolean') return res.status(400).json({ error: 'passed must be a boolean' });
        const current = await prisma.trialSession.findUnique({ where: { id } });
        if (!current) return res.status(404).json({ error: 'Session not found' });

        const session = await prisma.trialSession.update({
            where: { id },
            data: {
                inclusionPassed: passed,
                failedReason: passed ? null : (failedReason || 'Inclusion Failed'),
                inclusionPageTimestamp: new Date(),
                currentStatus: getNextStatus(current.currentStatus, passed ? 'INCLUSION_PASSED' : 'DISQUALIFIED')
            }
        });
        res.json({ message: 'Inclusion criteria updated', session });
    } catch (error) {
        console.error('Inclusion error:', error);
        res.status(500).json({ error: 'Failed to update inclusion criteria' });
    }
};

exports.submitExclusion = async (req, res) => {
    try {
        const { id } = req.params;
        const { conditions } = req.body;
        if (!conditions || typeof conditions !== 'object') return res.status(400).json({ error: 'conditions are required' });
        const current = await prisma.trialSession.findUnique({ where: { id } });
        if (!current) return res.status(404).json({ error: 'Session not found' });

        const failed = Object.values(conditions).some((value) => value === true);
        const session = await prisma.trialSession.update({
            where: { id },
            data: {
                exclusionPassed: !failed,
                failedReason: failed ? 'Exclusion Failed' : null,
                exclusionPageTimestamp: new Date(),
                currentStatus: getNextStatus(current.currentStatus, failed ? 'DISQUALIFIED' : 'EXCLUSION_PASSED')
            }
        });
        res.json({ message: 'Exclusion criteria updated', session });
    } catch (error) {
        console.error('Exclusion error:', error);
        res.status(500).json({ error: 'Failed to update exclusion criteria' });
    }
};

exports.pauseSession = async (req, res) => {
    try {
        const current = await prisma.trialSession.findUnique({ where: { id: req.params.id } });
        if (!current) return res.status(404).json({ error: 'Session not found' });
        const session = await prisma.trialSession.update({
            where: { id: current.id },
            data: { pauseTimestamp: new Date(), currentStatus: getNextStatus(current.currentStatus, 'PAUSED') }
        });
        res.json({ message: 'Session paused', session });
    } catch (error) {
        console.error('Pause error:', error);
        res.status(500).json({ error: 'Failed to pause session' });
    }
};

exports.resumeSession = async (req, res) => {
    try {
        const current = await prisma.trialSession.findUnique({ where: { id: req.params.id } });
        if (!current) return res.status(404).json({ error: 'Session not found' });
        const session = await prisma.trialSession.update({ where: { id: current.id }, data: { resumeTimestamp: new Date() } });
        res.json({ message: 'Session resumed', session });
    } catch (error) {
        console.error('Resume error:', error);
        res.status(500).json({ error: 'Failed to resume session' });
    }
};

exports.randomizeSession = async (req, res) => {
    const { id } = req.params;
    const { eegGroup } = req.body;
    const list = getAllocationList(eegGroup);
    if (!list) return res.status(400).json({ error: 'eegGroup must be SEA or NO_SEA' });

    for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
            const session = await prisma.$transaction(async (tx) => {
                const current = await tx.trialSession.findUnique({ where: { id } });
                if (!current) throw new RequestError(404, 'Session not found');
                if (current.allocationCode) return current;
                if (!current.exclusionPassed || current.currentStatus === 'DISQUALIFIED') {
                    throw new RequestError(409, 'Only patients who pass exclusion screening can be randomized');
                }

                const assignedCount = await tx.trialSession.count({ where: { eegGroup, allocationCode: { not: null } } });
                if (assignedCount >= list.length) throw new RequestError(409, `The ${eegGroup} allocation list is exhausted`);

                return tx.trialSession.update({
                    where: { id },
                    data: {
                        eegGroup,
                        allocationCode: list[assignedCount],
                        allocationSequence: assignedCount + 1,
                        eegGroupTimestamp: new Date(),
                        randomizationTimestamp: new Date(),
                        currentStatus: 'RANDOMIZED'
                    }
                });
            }, { isolationLevel: 'Serializable' });
            return res.json({ message: 'EEG group saved and patient randomized', session });
        } catch (error) {
            if (error instanceof RequestError) return res.status(error.status).json({ error: error.message });
            if ((error.code === 'P2034' || error.code === 'P2002') && attempt < 2) continue;
            console.error('Randomization error:', error);
            return res.status(500).json({ error: 'Failed to randomize session' });
        }
    }
};
