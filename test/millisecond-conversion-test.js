const assert = require('assert');
const millisecondConversion = require('../lib/millisecond-conversion.js');

describe('millisecondConversion', () => {
  it('should convert minutes to milliseconds', () => {
    assert.equal(millisecondConversion(10), 600000);
  });
});
