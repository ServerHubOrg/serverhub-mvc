const e = require('../../../../dist/lib/core/util');
const expect = require('chai').expect;

module.exports = function () {
    describe('Utils', function () {
        it('Now is a Date object', function (done) {
            expect(e.DateTime.Now instanceof Date).eq(true);
            done();
        });

        it('Auto generate Date object', function (done) {
            expect(e.DateTime.GetMilliseconds()).a('string');
            expect(e.DateTime.GetDay()).a('string');
            expect(e.DateTime.GetDayName()).a('string');
            expect(e.DateTime.GetFullYear()).a('string');
            expect(e.DateTime.GetMonth()).a('string');
            expect(e.DateTime.GetHours()).a('string');
            expect(e.DateTime.GetMinutes()).a('string');
            expect(e.DateTime.GetSeconds()).a('string');
            expect(e.DateTime.GetMilliseconds()).a('string');
            done();
        });

        it('Miliseconds: 50 -> 050', function (done) {
            expect(e.DateTime.GetMilliseconds(50)).eq('050');
            done();
        });


        it('Miliseconds: 5 -> 005', function (done) {
            expect(e.DateTime.GetMilliseconds(5)).eq('005');
            done();
        });
        it('Miliseconds: 500 -> 500', function (done) {
            expect(e.DateTime.GetMilliseconds('500')).eq('500');
            done();
        });
        it('Miliseconds: 1000 -> 000', function (done) {
            expect(e.DateTime.GetMilliseconds('1000')).eq('000');
            done();
        });

        it('Seconds: 50 -> 50', function (done) {
            expect(e.DateTime.GetSeconds(50)).eq('50');
            done();
        });
        it('Seconds: 5 -> 05', function (done) {
            expect(e.DateTime.GetSeconds('5')).eq('05');
            done();
        });
        it('Seconds: 60 -> 00', function (done) {
            expect(e.DateTime.GetSeconds('60')).eq('00');
            done();
        });

        it('Hours: 12 -> 12', function (done) {
            expect(e.DateTime.GetHours(12)).eq('12');
            done();
        });
        it('Hours: 5 -> 05', function (done) {
            expect(e.DateTime.GetHours('5')).eq('05');
            done();
        });
        it('Hours: 24 -> 00', function (done) {
            expect(e.DateTime.GetHours('24')).eq('00');
            done();
        });


        it('Minutes: 12 -> 12', function (done) {
            expect(e.DateTime.GetMinutes(12)).eq('12');
            done();
        });
        it('Minutes: 5 -> 05', function (done) {
            expect(e.DateTime.GetMinutes('5')).eq('05');
            done();
        });
        it('Minutes: 60 -> 00', function (done) {
            expect(e.DateTime.GetMinutes('60')).eq('00');
            done();
        });

        it('Years: 12 -> 1912', function (done) {
            expect(e.DateTime.GetYear(12)).eq('1912');
            done();
        });
        it('Years: 998 -> 0998', function (done) {
            expect(e.DateTime.GetYear('998')).eq('0998');
            done();
        });
        it('Years: 2012 -> 2012', function (done) {
            expect(e.DateTime.GetFullYear(2012)).eq('2012');
            done();
        });
        it('Years: 5 -> 1970', function (done) {
            expect(e.DateTime.GetFullYear('5')).eq('1970');
            done();
        });
        it('Month: 5 -> Jun', function (done) {
            expect(e.DateTime.GetMonth('5')).eq('Jun');
            done();
        });
        it('Month: 12 -> Jan', function (done) {
            expect(e.DateTime.GetMonth(12)).eq('Jan');
            done();
        });
        it('DayName: 5 -> Fri', function (done) {
            expect(e.DateTime.GetDayName('5')).eq('Fri');
            done();
        });
        it('DayName: 0 -> Mon', function (done) {
            expect(e.DateTime.GetDayName('0')).eq('Mon');
            done();
        });
        it('Day: 0 -> 01', function (done) {
            expect(e.DateTime.GetDay('0')).eq('01');
            done();
        });

        it('Day: 12 -> 12', function (done) {
            expect(e.DateTime.GetDay(12)).eq('12');
            done();
        });
    })
}