const assert = require('node:assert/strict');
const test = require('node:test');
const { getAllowedOrigins, isAllowedOrigin } = require('../index');

test('CORS allows Vercel, localhost, and configured origins only', () => {
    const origins = getAllowedOrigins('https://preview.example, https://internal.example');

    assert.equal(isAllowedOrigin('https://alzheimer-s-disease.vercel.app', origins), true);
    assert.equal(isAllowedOrigin('http://localhost:5173', origins), true);
    assert.equal(isAllowedOrigin('https://preview.example', origins), true);
    assert.equal(isAllowedOrigin('https://blocked.example', origins), false);
});
