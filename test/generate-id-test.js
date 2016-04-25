const assert = require('assert');
const generateId = require('../lib/generate-id.js');

describe('generateId', () => {
  it('should generate a id 20 characters long', () => {
    assert.equal(generateId().length, 20);
  });
});
