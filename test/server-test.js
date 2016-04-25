const assert = require('assert');
const request = require('request');
const app = require('../server');

describe('Server', () => {

  before(done => {
    this.port = 1234;
    this.server = app.listen(this.port, (error, response) => {
      if (error) { return done(error); }
      done();
    });

    this.request = request.defaults({
      baseUrl: 'http://localhost:1234/'
    });
  });

  after(() => {
    this.server.close();
  });

  it('should exist', () => {
    assert(app);
  });

  describe('GET /', () => {
    it('should return a 200', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });

  });
});
