const ControllerValidation = require('../../../../dist/lib/core/validate/').ControllerValidation;
const expect = require('chai').expect;

module.exports = function () {
    describe('Controller Validate', function () {
        it('valid controller', function (done) {
            let c = new ControllerValidation();
            expect(c.Validate({
                index: function (res, req, method) { }
            })).to.equal(true)
            done();
        });

        it('invalid controller: not enough parameters', function (done) {
            let c = new ControllerValidation();
            expect(c.Validate({
                index: function (res, req) { }
            })).to.equal(false)
            done();
        })

        it('invalid controller: lack "index" action method', function (done) {
            let c = new ControllerValidation();
            expect(c.Validate({
                index: function (res, req) { }
            })).to.equal(false)
            done();
        })

        it('invalid controller: undefined content', function (done) {
            let c = new ControllerValidation();
            expect(c.Validate).to.throw();
            done();
        })

        it('invalid controller: didn\'t specify target', function (done) {
            let c = new ControllerValidation();
            c.Target = null;
            expect(() => c.PassFunction(void 0)).to.throw();
            done();
        })

        it('invalid controller: action function required but is not provided in controller', function (done) {
            let c = new ControllerValidation();
            c.Target = {
                inndex: function () { }
            };
            expect(() => {
                c.PassFunction({
                    Required: true,
                    FunctionName: 'index',
                    ParamRequirement: 1
                })
            }).to.throw();
            done();
        })

        it('invalid controller: not enough parameters in unrequired actions', function (done) {
            let c = new ControllerValidation();
            c.Target = {
                index: function () { }
            };
            expect(c.PassFunction({
                Required: false,
                FunctionName: 'index',
                ParamRequirement: 1
            })).to.equal(true);
            done();
        })
    })
}