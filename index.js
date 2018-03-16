/**
 * ServerHub Entry
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

const libcore = require('./dist/lib/core/core');
const libroute = require('./dist/lib/route/route');
const http = require('http');
const package = require('./package.json');
const path = require('path');
const fs = require('fs');


var server;

/**
 * Call this method to start ServerHub service.
 * @param {object} config Initial configuration
 * @param {function} appstart Callback when ServerHub starts.
 */
exports.Run = (config, appstart) => {
    if (!config['BaseDir'])
        throw new Error("Must specify server base dir at least.");
    libcore.UpdateGlobalVariable('ServerBaseDir', config['BaseDir']);

    libcore.SetGlobalVariable('PackageData', package);

    let port = 926; // Birthday of my beloved friend, Changrui.
    if (config['Port'])
        port = config['Port'];

    if (config['PageNotFound'])
        // libcore.SetGlobalVariable('PageNotFound', config['PageNotFound']);
        throw new Error('Not implemented!');

    if (config['DBConnectionString']) {
        let dbs = config['DBConnectionString'];
        if (dbs.length > 0)
            libcore.SetGlobalVariable('DBConnectionString', dbs);
        else throw new Error('Unrecognized database connection string');
    }
    if (config['WebDir']) {
        libcore.SetGlobalVariable('WebDir', config['WebDir']);
    }
    if (config['ControllerDir']) {
        libcore.SetGlobalVariable('ControllerDir', config['ControllerDir']);
    }
    if (config['ViewDir']) {
        libcore.SetGlobalVariable('ViewDir', config['ViewDir']);
    }
    if (config['ModelDir']) {
        libcore.SetGlobalVariable('ModelDir', config['ModelDir']);
    }
    if (config['Controllers']) {
        config['Controllers'].forEach(ele => {
            libcore.RegisterController(ele);
        });
    } else {
        let variables = global['EnvironmentVariables'];
        let controllerPath = path.resolve(variables.ServerBaseDir, variables.ControllerDir);
        let controllers = fs.readdirSync(controllerPath);
        if (controllers) {
            controllers.forEach(con => {
                libcore.RegisterController(con);
            })
        }
    }

    if (config['MaxCacheSize']) {
        try {
            let config_size = parseInt(config['MaxCacheSize']);
            let installed_memory = parseInt(require('os').totalmem() / 1024 / 1024);
            if (config_size > 0.2 * installed_memory) {
                config_size = 0.2 * installed_memory;
                console.log('MaxCacheSize exceeded limitation, reduce to', config_size, 'MB');
            } else console.log('Maximum cache size set to', config_size, 'MB');
            libcore.SetGlobalVariable('MaxCacheSize', config_size);
        } catch (error) {
            console.error('Configuration property "MaxCacheSize" is not a valid number');
        }
    }

    if (config['DBProvider']) {
        let dbp = config['DBProvider'];
        if (['mysql'].indexOf(dbp.trim()) !== -1)
            libcore.SetGlobalVariable('DBProvider', dbp.trim());
        else throw new Error('Unsupported database provider', dbp);
    }


    if (appstart)
        appstart(libroute.Route.GetRoute());
    else {
        libroute.Route.GetRoute().MapRoute('default', '{controller}/{action}/{id}', {
            Controller: 'home',
            Action: 'index',
            id: ''
        });
    }

    libcore.RegisterRouter(libroute.Route.GetRoute());

    server = http.createServer((req, res) => {
        libcore.RoutePath(req.url, req, res);
    });

    try {
        server.listen(port);
        console.log('Server started on port:', port);
    } catch (e) {
        console.error('Server cannot start and listen to', port);
        console.error('There might be another instance process of ServerHub. Please check and attempt to start later.')
        process.exit(1);
    }
}