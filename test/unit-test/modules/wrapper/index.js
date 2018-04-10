const w = require('../../../../dist/lib/core/wrapper');
const expect = require('chai').expect;

module.exports = function () {
    describe('Function String Wrapper', function () {
        it('valid function string', function (done) {
            expect(w.default('return {}')).to.be.a('object');
            done();
        });

        it('invalid function string: not returning anything', function (done) {
            expect(() => w.default('module.exports = {}')).to.throw();
            done();
        });


        it('invalid function string: return value is not an object', function (done) {
            expect(() => w.default('return 123')).to.throw();
            done();
        });


        it('contains "use strict"', function (done) {
            expect(() => w.default('"use strict";\nreturn 123')).to.throw();
            done();
        });
    })
}