const validate = require('./validate');
const error = require('./error');
const wrapper = require('./wrapper');

module.exports = function () {
    describe('Modules', function () {
        validate();
        error();
        wrapper();
    })
}