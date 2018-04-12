const route = require('../../../../dist/lib//route/index');
const expect = require('chai').expect;

module.exports = function () {
    describe('Route Moudle', function () {
        let r = new route.Route();
        it('map route', function (done) {
            expect(() => r.MapRoute('test', 'v1/{controller}/{action}/{id}', { Controller: "home", Action: 'index' })).not.to.throw();
            done();
        })

        it('ignore route', function (done) {
            expect(() => r.IgnoreRoute('/v1/home/what/')).to.not.throw();
            expect(() => r.IgnoreRoute([/v2\/.*/, '/v1/home/what'])).to.not.throw();
            done();
        })


        it('cannot ignore route: type undefined not supported', function (done) {
            expect(() => r.IgnoreRoute(void 0)).to.throw();
            done();
        })


        it('cannot ignore route: type number not supported', function (done) {
            expect(() => r.IgnoreRoute(-1)).to.throw();
            done();
        })

        it('ingored', function (done) {
            expect(r.Ignored('v1/home/what')).to.equal(true);
            expect(r.Ignored('/what/v2/home/what')).to.equal(true);
            expect(r.Ignored('/v2')).to.equal(true);
            expect(r.Ignored('/www/index.html')).to.equal(false);
            done();
        })

        it('run route succeeded', function (done) {
            expect(r.RunRoute('v1/home/index')).to.be.a('object');
            expect(r.RunRoute('v1/home/actual')).to.be.a('object');
            expect(r.RunRoute('/')).to.be.a('object');
            expect(r.RunRoute()).to.be.a('object');
            done();
        })

        it('no route', function (done) {
            expect(r.RunRoute('/home/index')).to.be.a('undefined');
            done();
        })

        it('route match ignored', function (done) {
            expect(r.RunRoute('v1/home/what')).to.be.a('undefined');
            done();
        })

        it('get route rules', function (done) {
            expect(route.Route.GetRoute()).to.be.a('object');
            done();
        })
    })
}