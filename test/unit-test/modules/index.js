const validate = require('./validate');
const error = require('./error');
const wrapper = require('./wrapper');
const route = require('./route');

module.exports = function () {
    describe('Modules', function () {
        validate();
        error();
        wrapper();
        route();
    })
}