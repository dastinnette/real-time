const assert = require('assert');
const millisecondConversion = require('../lib/millisecond-conversion.js');

describe('minutesToMilliseconds', () => {
  it('should convert minutes to milliseconds', () => {
    assert.equal(millisecondConversion(5), 300000);
  });
});
