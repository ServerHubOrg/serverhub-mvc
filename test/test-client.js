const test_unit = require('./unit-test/');
const test_deploy = require('./deploy-test');

describe('Tests', function () {
    global['EnvironmentVariables'] = global['EnvironmentVariables'] ? global['EnvironmentVariables'] : {
        ServerBaseDir: __dirname,
        ControllerDir: 'controller/',
        ViewDir: 'view/',
        ModelDir: 'model/',
        PageNotFound: '',
        WebDir: 'www/',
        MaxCacheSize: 350,
        DBProvider: 'mysql',
        DBConnectionString: null,
        DefaultPages: ['index.html', 'default.html', 'page.html'],
        AsyncOperationTimeout: 10000,
        PluginDir: 'plugin/',
        Verbose: true,
        TLSOptions: void 0,
        RedirectToTLS: true,
        Hostname: 'localhost',
        Port: [80],
        LogConfig: {
            Dir: 'log/',
            MaxSize: 65536,
            Access: true,
            Error: true,
            Runtime: true,
            Filename: 'serverhub'
        }
    };
    test_unit();
    // test_deploy(); // unit test first

    after(function () {
        process.exit(0);
    });
})