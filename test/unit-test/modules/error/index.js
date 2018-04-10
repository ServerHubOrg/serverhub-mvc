const e = require('../../../../dist/lib/core/error/error');
const expect = require('chai').expect;

module.exports = function () {
    describe('ErrorManager', function () {
        it('rendered/controller', function (done) {
            expect(e.ErrorManager.RenderError(e.CompileTimeError.SH010101, 'hello', 'go', 'mocha')).to.be.a('string');
            done();
        });
        it('rendered/runtime', function (done) {
            expect(e.ErrorManager.RenderError(e.RuntimeError.SH020101, 'hello', 'go', 'mocha')).to.be.a('string');
            done();
        });
        it('cannot render error: all parameter missing', function (done) {
            expect(() => e.ErrorManager.RenderError()).to.throw();
            done();
        });
        it('cannot render error: undetermined error', function (done) {
            expect(() => e.ErrorManager.RenderError(1)).to.throw();
            done();
        });
        it('HTML rendered', function (done) {
            expect(e.ErrorManager.RenderErrorAsHTML(new Error())).to.be.a('string');
            done();
        });
        it('cannot render HTML: error not specified', function (done) {
            expect(() => e.ErrorManager.RenderErrorAsHTML()).to.throw();
            done();
        });
    })
}