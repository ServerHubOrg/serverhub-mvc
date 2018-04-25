const { isValidHeaders, TransformHeader } = require('../../../../dist/lib/core/cell');
const expect = require('chai').expect;

module.exports = function () {
    describe('Mock Node.js request and response, including header validation', function () {
        it('should be a valid HTTP header', function (done) {
            expect(isValidHeaders({ 'Age': 10 })).to.true;
            expect(isValidHeaders({ 'Cache-Control': 10, 'Expires': true })).to.true;
            done();
        });

        it('should be an invalid HTTP header', function (done) {
            expect(isValidHeaders({ 'max-Age': 10 })).to.false;
            expect(isValidHeaders({ 'Aax-Age': 10 })).to.false;
            expect(isValidHeaders({ 'XuWangzhe': 10 })).to.false;
            done();
        });

        it('should get "Cache-Control"', function (done) {
            expect(TransformHeader('cache-control')).to.equal('Cache-Control');
            done();
        });

        it('should get "Cache"', function (done) {
            expect(TransformHeader('cache')).to.equal('Cache');
            done();
        });


        it('should get "DNT"', function (done) {
            expect(TransformHeader('DNT')).to.equal('DNT');
            done();
        });


        it('should should an error', function (done) {
            expect(() => TransformHeader('')).to.throw();
            expect(() => TransformHeader('A--B')).to.throw();
            done();
        });
    })
}