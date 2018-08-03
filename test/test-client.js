const test_unit = require('./unit-test/');
const test_deploy = require('./deploy-test');
const path = require('path');
const fs = require('fs');

describe('Tests', function () {
    let p = path.resolve(__dirname, 'log');
    global['__log_path__'] = p;
    global['__clean_log__'] = () => {
        if (fs.existsSync(p)) {
            fs.readdirSync(p).forEach(file => {
                fs.unlinkSync(path.resolve(p, file));
            });
            console.log('Log files cleaned.')
        }
    };

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
        Port: [80,443],
        LogConfig: {
            Dir: 'log/',
            MaxSize: 65536,
            Access: true,
            Error: true,
            Runtime: true,
            Filename: 'serverhub'
        },
        TLSOptions: {
            Port: [443]
        }
    };
    test_unit();
    // test_deploy(); // unit test first

    after(function () {
        global.__clean_log__();
        process.exit(0);
    });
})