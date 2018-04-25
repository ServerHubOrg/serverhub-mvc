const validate = require('./validate');
const error = require('./error');
const wrapper = require('./wrapper');
const route = require('./route');
const cell = require('./cell');

module.exports = function () {
    describe('Modules', function () {
        validate();
        error();
        wrapper();
        route();
        cell();
    })
}