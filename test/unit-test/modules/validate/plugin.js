const PluginValidation = require('../../../../dist/lib/core/validate/').PluginValidation;
const expect = require('chai').expect;

module.exports = function () {
    if (global['EnvironmentVariables']) {
        global['EnvironmentVariables'].PackageData = {
            version: 'v1.0.4'
        }
    } else global['EnvironmentVariables'] = {
        PackageData: {
            version: 'v1.0.4'
        }
    }
    describe('Plugin Validate', function () {
        const target = {
            version_support: 'v1.0.3',
            version: 'v1.0.0',
            app_name: 'serverhub-plugin-test',
            phase: 'before-route',
            main: function (req, res) {}
        }
        it('valid plugin', function (done) {
            let p = new PluginValidation();
            let t = Object.assign({}, target);
            expect(p.Validate(t)).to.equal(true)
            done();
        });
        it('invalid plugin: plugin name required', function (done) {
            let p = new PluginValidation();
            let t = Object.assign({}, target);
            delete t['app_name'];
            expect(() => p.Validate(t)).to.throw();
            done();
        });
        it('invalid plugin: wrong plugin name syntax', function (done) {
            let p = new PluginValidation();
            let t = Object.assign({}, target);
            t.app_name = 'test-plugin'
            expect(() => p.Validate(t)).to.throw();
            done();
        });
        it('invalid plugin: parameters not enough (before-route)', function (done) {
            let p = new PluginValidation();
            let t = Object.assign({}, target);
            t.main = function () {};
            expect(() => p.Validate(t)).to.throw();
            done();
        });
        it('invalid plugin: parameters not enough (after-route)', function (done) {
            let p = new PluginValidation();
            let t = Object.assign({}, target);
            t.phase = 'after-route'
            t.main = function () {};
            expect(() => p.Validate(t)).to.throw();
            done();
        });
        it('invalid plugin: serverhub version out-of-date', function (done) {
            let p = new PluginValidation();
            let t = Object.assign({}, target);
            t.version_support = 'v1.5.0';
            expect(() => p.Validate(t)).to.throw();
            done();
        });
        it('invalid plugin: unsupported phase', function (done) {
            let p = new PluginValidation();
            let t = Object.assign({}, target);
            t.phase = 'afterroute'
            expect(() => p.Validate(t)).to.throw();
            done();
        });
        it('invalid plugin: version property required', function (done) {
            let p = new PluginValidation();
            let t = Object.assign({}, target);
            delete t['version'];
            expect(() => p.Validate(t)).to.throw();
            done();
        });
        it('invalid plugin: main is not a function', function (done) {
            let p = new PluginValidation();
            let t = Object.assign({}, target);
            t['main'] = true;
            expect(() => p.Validate(t)).to.throw();
            done();
        });
        it('invalid plugin: main is required', function (done) {
            let p = new PluginValidation();
            let t = Object.assign({}, target);
            delete t['main'];
            expect(() => p.Validate(t)).to.throw();
            done();
        });

        it('blank function', function (done) {
            let p = new PluginValidation();
            expect(p.PassFunction(void 0)).to.equal(false);
            done();
        });
    })
}