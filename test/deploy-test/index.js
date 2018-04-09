const request = require('request');
const spawn = require('child_process').spawn;
const expect = require('chai').expect;

module.exports = function () {
    describe('Deployment Test', function () {
        let cp = spawn('node', ["test/server/app.js"]);
        before(function (done) {
            cp.stdout.on('data', d => {
                // console.log(d.toString());
                if (d.toString().indexOf('Server started on port') !== -1)
                    done();
            });
            cp.stderr.on('data', d => {
                console.error(d.toString());
            });
        });

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
        after(function () {
            cp.kill(0);
        })
    })
}