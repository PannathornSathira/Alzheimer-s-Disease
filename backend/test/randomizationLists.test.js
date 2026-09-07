const test = require('node:test');
const assert = require('node:assert/strict');
const { allocationLists } = require('../randomList');

test('EEG allocation lists are balanced and ordered', () => {
    for (const list of Object.values(allocationLists)) {
        assert.equal(list.length, 34);
        assert.equal(list.filter((code) => code === 'A').length, 17);
        assert.equal(list.filter((code) => code === 'B').length, 17);
        assert.ok(list.every((code) => code === 'A' || code === 'B'));
    }
    assert.equal(allocationLists.SEA[0], 'B');
    assert.equal(allocationLists.NO_SEA[0], 'A');
});
