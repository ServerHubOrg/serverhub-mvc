const validate = require('./validate');
const error = require('./error');
const wrapper = require('./wrapper');
const route = require('./route');
const util = require('./util');
const log = require('./log');

module.exports = function () {
    describe('Modules', function () {
        validate();
        error();
        wrapper();
        route();
        util();
        log();
    })
}