const assert = require('chai').assert;
const request = require('request');
const app = require('../server');
const newPoll = require('./fixtures/new-poll');

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

    it('should have a form', (done) => {
      var title = app.locals.title;

      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert(response.body.includes(title),
               `"${response.body}" does not include "${title}".`);
        done();
      });
    });
  });

  describe('POST /polls', () => {
    beforeEach(() => {
      app.locals.polls = {};
    });

    it('should not return 404', (done) => {
      this.request.post('/polls', (error, response) => {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });

    it('should receive and store data', (done) => {
      var poll = { poll: newPoll.validPoll };

      this.request.post('/polls', { form: poll }, (error, response) => {
        if (error) { done(error); }
        var pollCount = Object.keys(app.locals.polls).length;
        assert.equal(pollCount, 1, `Expected 1 poll, found ${pollCount}`);
        done();
      });
    });

    it('should redirect the user to their new poll', (done) => {
      var poll = { poll: newPoll.validPoll };

      this.request.post('/polls', { form: poll }, (error, response) => {
        if (error) { done(error); }
        var newPollId = Object.keys(app.locals.polls)[0];
        var newAdminId = app.locals.polls[newPollId].adminID;
        assert.equal(response.headers.location, '/polls/' + newPollId + '/admin/' + newAdminId);
        done();
      });
    });
  });

});
