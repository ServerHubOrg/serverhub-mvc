const route = require('../../../../dist/lib/route/index');
const expect = require('chai').expect;

module.exports = function () {
    describe('Route Moudle', function () {
        let r = new route.Route();
        it('map route', function (done) {
            expect(() => r.MapRoute('test', 'v1/{controller}/{action}/{id}', {
                Controller: "home",
                Action: 'index',
                Id: 1
            })).not.to.throw();
            expect(() => r.MapRoute('test', '/{controller}/{action}/{id}')).not.to.throw();
            expect(() => r.MapRoute('test', void 0)).to.throw();
            expect(() => r.MapRoute('test', 'v1/{controller}/{action}/{id}')).not.to.throw();
            expect(() => r.MapRoute('test', 'v1/{action}/{id}')).to.throw();
            expect(() => r.MapRoute('test', 'v1/{controller}/{action}/{id}#^#&#&$')).to.throw();
            expect(() => r.MapRoute('test', 'v1/{controller}/{action}...')).to.throw();
            done();
        })

        it('try to check ingored before set up', function (done) {
            expect(r.Ignored('/v2')).to.equal(false);
            done();
        })

        it('ignore route', function (done) {
            expect(() => r.IgnoreRoute('/v1/home/what/')).to.not.throw();
            expect(() => r.IgnoreRoute([/v2\/.*/, '/v1/home/what'])).to.not.throw();
            expect(() => r.IgnoreRoute('v2')).not.to.throw();
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
            expect(r.Ignored(void 0)).to.equal(true);
            expect(r.Ignored('./')).to.equal(false);
            done();
        })

        it('run route succeeded', function (done) {
            expect(r.RunRoute('v1/home/index')).to.be.a('object');
            expect(r.RunRoute('v1/home/actual')).to.be.a('object');
            expect(r.RunRoute('/')).to.be.a('object');
            expect(r.RunRoute()).to.be.a('object');
            expect(r.RunRoute('v1/interest.svg/')).to.be.a('object');
            expect(r.RunRoute('v1/interest.svg/abc/1')).to.be.a('object');
            expect(r.RunRoute('v1/interest.svg/abc')).to.be.a('object');
            expect(r.RunRoute('v1/interest.svg/abc/?que=1')).to.be.a('object');
            expect(r.RunRoute('v1/interest.svg/abc/1?que=1')).to.be.a('object');
            done();
        })

        it('should match no route: lack "v1" prefix', function (done) {
            expect(r.RunRoute('/home/index')).to.be.a('undefined');
            done();
        });


        it('should match no route: invalid controller name', function (done) {
            expect(r.RunRoute('v1/..home')).to.be.a('undefined');
            done();
        });

        it('should match no route: duplicated slash', function (done) {
            expect(r.RunRoute('/home//')).to.be.a('undefined');
            done();
        });


        it('should match no route: resource-like controller name without slash as suffix', function (done) {
            expect(r.RunRoute('/home.html')).to.be.a('undefined');
            done();
        });

        it('should match no route: resource', function (done) {
            expect(r.RunRoute('v1/interest.svg')).to.be.a('object');
            done();
        });


        it('route match ignored', function (done) {
            expect(r.RunRoute('v1/home/what')).to.be.a('object');
            done();
        })

        it('get route rules', function (done) {
            expect(route.Route.GetRoute()).to.be.a('object');
            done();
        })
    })
}