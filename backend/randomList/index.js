const fs = require('fs');
const path = require('path');

const FILES = { SEA: 'sea.csv', NO_SEA: 'no-sea.csv' };

function readList(fileName) {
    const rows = fs.readFileSync(path.join(__dirname, fileName), 'utf8').trim().split(/\r?\n/);
    if (rows.shift() !== 'sequence,allocationCode') throw new Error(`${fileName} has an invalid header`);

    const list = rows.map((row, index) => {
        const [sequence, allocationCode] = row.split(',');
        if (Number(sequence) !== index + 1 || !['A', 'B'].includes(allocationCode)) {
            throw new Error(`${fileName} has an invalid allocation at row ${index + 2}`);
        }
        return allocationCode;
    });

    if (list.length !== 34 || list.filter((code) => code === 'A').length !== 17 || list.filter((code) => code === 'B').length !== 17) {
        throw new Error(`${fileName} must contain 34 balanced A/B allocations`);
    }
    return list;
}

const allocationLists = Object.freeze(Object.fromEntries(
    Object.entries(FILES).map(([group, fileName]) => [group, readList(fileName)])
));

function getAllocationList(eegGroup) {
    return allocationLists[eegGroup];
}

module.exports = { allocationLists, getAllocationList };
