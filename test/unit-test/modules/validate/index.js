const controller = require('./controller');
const plugin = require('./plugin');

module.exports = function () {
    describe('Validators', function () {
        controller();
        plugin();
    })

}