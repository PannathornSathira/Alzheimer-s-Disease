const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const formatTime = (timestamp) => timestamp
    ? new Date(timestamp).toLocaleTimeString('en-US', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit' })
    : '-';

const formatDate = (timestamp) => timestamp
    ? new Date(timestamp).toLocaleString('en-US', { timeZone: 'Asia/Bangkok', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '-';

exports.getDashboardStats = async (req, res) => {
    try {
        const sessions = await prisma.trialSession.findMany({
            include: { hospital: true, patient: true },
            orderBy: { registrationTimestamp: 'desc' }
        });
        const stats = { totalRand: 0, armACount: 0, armBCount: 0, seaCount: 0, noSeaCount: 0, failInc: 0, failExc: 0, paused: 0, hospStats: {} };

        const data = sessions.map((session) => {
            const hospital = session.hospital.prefix;
            if (!stats.hospStats[hospital]) stats.hospStats[hospital] = { rand: 0, fail: 0 };
            let status = 'Registered';
            if (session.currentStatus === 'RANDOMIZED') {
                status = 'Randomized';
                stats.totalRand += 1;
                stats.hospStats[hospital].rand += 1;
                if (session.allocationCode === 'A') stats.armACount += 1;
                if (session.allocationCode === 'B') stats.armBCount += 1;
                if (session.eegGroup === 'SEA') stats.seaCount += 1;
                if (session.eegGroup === 'NO_SEA') stats.noSeaCount += 1;
            } else if (session.currentStatus === 'DISQUALIFIED') {
                status = session.failedReason === 'Inclusion Failed' ? 'Failed Inclusion' : 'Failed Exclusion';
                stats.hospStats[hospital].fail += 1;
                if (session.failedReason === 'Inclusion Failed') stats.failInc += 1;
                else stats.failExc += 1;
            } else if (session.currentStatus === 'INCLUSION_PASSED') status = 'Passed Inclusion';
            else if (session.currentStatus === 'EXCLUSION_PASSED') status = 'Passed Exclusion';
            else if (session.currentStatus === 'PAUSED') { status = 'Paused (Awaiting Return)'; stats.paused += 1; }

            return {
                id: session.trialSystemId,
                hn: session.patient.hn,
                hospital,
                status,
                eegGroup: session.eegGroup,
                allocationCode: session.allocationCode,
                timestamps: {
                    start: formatDate(session.registrationTimestamp),
                    inc: formatTime(session.inclusionPageTimestamp),
                    exc: formatTime(session.exclusionPageTimestamp),
                    pause: formatTime(session.pauseTimestamp),
                    resume: formatTime(session.resumeTimestamp),
                    rand: formatTime(session.randomizationTimestamp)
                }
            };
        });
        res.json({ stats, data });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
};
