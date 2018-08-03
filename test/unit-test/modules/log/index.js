const e = require('../../../../dist/lib/core/log/');
const expect = require('chai').expect;
const fs = require('fs');

module.exports = function () {
    e.LogAccess('127.0.0.1', '/', 325, 'root');
    e.LogError('runtime', 'helloworld')
    e.LogRuntime('system', 'trying to log');
    e.LogService.Start();
    describe('Log Manager/Worker Test', function () {
        it('should log error successfully', function (done) {
            setTimeout(() => {
                expect(() => {
                    let has = false;
                    fs.readdirSync(global.__log_path__).forEach(file => {
                        if (!has && file.includes('error'))
                            has = true;
                    })
                    if (!has) throw new Error('No Error Log File.')
                }).not.to.throw();
                done();
            }, 300);
        });
        it('should log access successfully', function (done) {
            setTimeout(() => {
                expect(() => {
                    let has = false;
                    fs.readdirSync(global.__log_path__).forEach(file => {
                        if (!has && file.includes('access'))
                            has = true;
                    })
                    if (!has) throw new Error('No Access Log File.')
                }).not.to.throw();
                done();
            }, 300);
        });
        it('should log runtime successfully', function (done) {
            setTimeout(() => {
                expect(() => {
                    let has = false;
                    fs.readdirSync(global.__log_path__).forEach(file => {
                        if (!has && file.includes('runtime'))
                            has = true;
                    })
                    if (!has) throw new Error('No Runtime Log File.')
                }).not.to.throw();
                done();
            }, 300);
        });
    })
}