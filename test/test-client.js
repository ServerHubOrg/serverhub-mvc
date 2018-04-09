const test_unit = require('./unit-test/');
const test_deploy = require('./deploy-test');

describe('Tests', function () {
    test_unit();
    // test_deploy(); // unit test first

    after(function () {
        process.exit(0);
    });
})