var expect = require('chai').expect;
var test = require('../lib');
var join = require('path').join;
var request = require('supertest');
var fs = require('fs');

describe('index.test: index test with no assert lib', function() {
  var port = 9888,
      oldCwd = process.cwd(),
      cwd = join(__dirname, './fixtures/app');

  request = request(`http://localhost:${port}`);

  before(function(done) {
    process.chdir(cwd);
    test({
      port,
    });
    setTimeout(done, 1000);
  });

  after(function() {
    process.chdir(oldCwd);
  });

  it('GET /tests/runner.html 200 OK', function(done) {
    request
      .get('/tests/runner.html')
      .expect(200)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

  it('GET /tests/test.css 200 ok', function(done) {
    request
      .get('/tests/test.css')
      .expect(200)
      .expect(/mocha/, done);
  });

  it('GET /tests/test.js 200 OK', function(done) {
    request
      .get('/tests/test.js')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        expect(res.text.indexOf('first test')).to.be.above(-1);
        done();
      });
  });

  it('GET /tests/mocha.js 200 OK', function(done) {
    request
      .get('/tests/mocha.js')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
  });

  it('coverage ok', function(done) {
    var exist = fs.existsSync(join(cwd, './coverage'));
    expect(exist).to.be.true;
    done()
  });
});