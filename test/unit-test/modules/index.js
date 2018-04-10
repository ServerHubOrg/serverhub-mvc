const validate = require('./validate');
const error = require('./error');

module.exports = function () {
    describe('Modules', function () {
        validate();
        error();
    })
}