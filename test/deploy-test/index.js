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
                it('[200] "/" should match default route', function (done) {
                    request('http://127.0.0.1:926/', function (err, res, body) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    });
                });
                it('[200] "home/index" should match default route', function (done) {
                    request('http://127.0.0.1:926/home/index', function (err, res, body) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    });
                });
                it('[200] "/home/index/" should match default route', function (done) {
                    request('http://127.0.0.1:926/home/index/', function (err, res, body) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    });
                });
                it('[404] "/home/random/" should not match any route', function (done) {
                    request('http://127.0.0.1:926/home/random/', function (err, res, body) {
                        expect(res.statusCode).to.equal(404);
                        done();
                    });
                });
                it('[404] "/hello.html/" should not match any route', function (done) {
                    request('http://127.0.0.1:926/hello.html/', function (err, res, body) {
                        expect(res.statusCode).to.equal(404);
                        done();
                    });
                });
                it('[200] "/hello.html" should match a static page at www/', function (done) {
                    request('http://127.0.0.1:926/hello.html', function (err, res, body) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.toString().indexOf('Thanks for using ServerHub')).not.to.equal(-1);
                        done();
                    });
                });
                it('[200] "/interest/special.all" should match custom controller/action', function (done) {
                    request('http://127.0.0.1:926/interest/special.all', function (err, res, body) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    });
                });

                it('[200] "/interest/special-_" should match custom controller/action', function (done) {
                    request('http://127.0.0.1:926/interest/special-_', function (err, res, body) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    });
                });
                it('[404] "/interest.svg" should not match any custom controller/action', function (done) {
                    request('http://127.0.0.1:926/interest.svg', function (err, res, body) {
                        expect(res.statusCode).to.equal(404);
                        done();
                    });
                });

                it('[200] "/interest.svg/" should match custom controller/action', function (done) {
                    request('http://127.0.0.1:926/interest.svg/', function (err, res, body) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    });
                });

                it('[404] "/interest.svg//1" should not match any custom controller/action', function (done) {
                    request('http://127.0.0.1:926/interest.svg//1', function (err, res, body) {
                        expect(res.statusCode).to.equal(404);
                        done();
                    });
                });

                
                it('[404] "/interest.svg//" should not match any custom controller/action', function (done) {
                    request('http://127.0.0.1:926/interest.svg//', function (err, res, body) {
                        expect(res.statusCode).to.equal(404);
                        done();
                    });
                });
            });
        });
        after(function () {
            cp.kill(0);
        })
    })
}