const request = require('request');
const expect = require('chai').expect;
describe('StatusCode and Content', function () {
    describe('status', function () {
        it('/ - default route', function (done) {
            request('http://127.0.0.1:926/', function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it('home/index - route without suffix "/"', function (done) {
            request('http://127.0.0.1:926/home/index', function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it('/home/index/ - complete route use case', function (done) {
            request('http://127.0.0.1:926/home/index/', function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it('/home/random/ - nonexistent route', function (done) {
            request('http://127.0.0.1:926/home/random/', function (err, res, body) {
                expect(res.statusCode).to.equal(404);
                done();
            });
        })
    });
});