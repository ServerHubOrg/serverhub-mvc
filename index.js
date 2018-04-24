/**
 * ServerHub Entry
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */


/**
 * Notice, although packages like callsite can help to get the BaseDir parameter property.
 * But we will not use it. Because it is better to let users feel involved in configuring ServerHub
 * start up function. And it reminds them to customize ServerHub as they wanted.
 */
const libcore = require('./dist/lib/core/core');
const libroute = require('./dist/lib/route/route');
const http = require('http');
const https = require('https');
const package = require('./package.json');
const path = require('path');
const fs = require('fs');
const AutoRegister = require('./dist/lib/core/plugin/').AutoRegister;
const { LoadModule, LoadModuleFrom } = require('./dist/lib/core/module');
// const callsite = require('callsite'); // Will not be used.


const servers = [];

/**
 * Call this method to start ServerHub service.
 * @param {object} config Initial configuration
 * @param {function} appstart Callback when ServerHub starts.
 */
exports.Run = (config, appstart) => {
    // let appJsPath = callsite()[1].getFileName(); // Will not be used because I want developers to feel involved in configuration process.
    if (!config['BaseDir'])
        throw new Error("Must specify server base dir at least.");
    libcore.UpdateGlobalVariable('ServerBaseDir', config['BaseDir']);

    libcore.SetGlobalVariable('PackageData', package);

    let port = 926; // Birthday of my beloved friend, Changrui.
    if (config['Port']) {
        if (config['Port'] instanceof Array)
            port = config['Port'].map(p => parseInt(p));
        else port = [parseInt(config['Port'])];
    }

    if (config['PageNotFound']) {
        let pageNotFound = config['PageNotFound'];
        let variables = global['EnvironmentVariables'];
        let paths = path.resolve(variables.ServerBaseDir, pageNotFound);
        if (pageNotFound && pageNotFound.length > 0) {
            if (fs.existsSync(paths)) {
                libcore.SetGlobalVariable('PageNotFound', config['PageNotFound']);
            } else new Error('File not exist');
        } else throw new Error('Not a valid path. PageNotFound should be relative to BaseDir.');
    }

    if (config['DefaultPages']) {
        let defaultpages = config['DefaultPages'];
        if (typeof (defaultpages) === 'string')
            defaultpages = [defaultpages];
        else if (defaultpages instanceof Array)
            libcore.UpdateGlobalVariable('DefaultPages', defaultpages);
        else console.error(`'DefaultPages' in your configuration parameter is not a valid array.`);
    }

    if (config['AsyncOperationTimeout']) {
        libcore.UpdateGlobalVariable('AsyncOperationTimeout', parseInt(config['AsyncOperationTimeout']));
    }

    if (config['DBConnectionString']) {
        let dbs = config['DBConnectionString'];
        if (dbs.length > 0)
            libcore.SetGlobalVariable('DBConnectionString', dbs);
        else throw new Error('Unrecognized database connection string');
    }
    if (config['WebDir']) {
        libcore.SetGlobalVariable('WebDir', config['WebDir']);
    }
    if (config['PluginDir']) {
        libcore.SetGlobalVariable('PluginDir', config['PluginDir']);
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
            if (ele.endsWith('.shc.js'))
                libcore.RegisterControllerM(ele);
            else libcore.RegisterController(ele);
        });
    } else {
        let variables = global['EnvironmentVariables'];
        let controllerPath = path.resolve(variables.ServerBaseDir, variables.ControllerDir);
        let controllerDirExist = fs.existsSync(controllerPath);
        if (!controllerDirExist) {
            console.error(`Controller directory ${controllerPath} does not exist, ServerHub will not register any controller and your route rules will not take effect.`);
        }
        else {
            let controllers = fs.readdirSync(controllerPath);
            if (controllers) {
                // moduled controllers has higher priority.
                let hasControllerM = false;
                controllers.map(c => {
                    if (c.endsWith('.shc.js'))
                        hasControllerM = true;
                })
                controllers.forEach(con => {
                    if (!hasControllerM) {
                        if (con.endsWith('.js') && !con.endsWith('.shc.js'))
                            libcore.RegisterController(con);
                    } else {
                        if (con.endsWith('.shc.js'))
                            libcore.RegisterControllerM(con);
                    }
                })
            }
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

    plugin_info = AutoRegister();
    if (plugin_info.done) {
        console.log(plugin_info.count, 'plugins loaded with no errors');
    } else {
        console.log('Only', plugin_info.count, 'plugins loaded.')
    } // load all plugins.

    libcore.RegisterRouter(libroute.Route.GetRoute());



    try {
        if (!Array.isArray(port))
            port = [port];
        let tls = config['TLSOption'] || config['SSLOption'];
        if (tls && tls.hasOwnProperty('Port') && tls.hasOwnProperty('Cert') && tls.hasOwnProperty('Key') && tls.hasOwnProperty('CA')) {
            if (!(tls.Port instanceof Array))
                tls.Port = [parseInt(tls.Port)];
            else {
                tls.Port = tls.Port.map(p => parseInt(p));
            }
            tls.Port.map(p => {
                if (port.indexOf(p) === -1)
                    throw new Error(`${tls.Port} is not defined in given ports: [${port.join(', ')}]`);
            })
        }
        port.forEach(p => {
            if (tls && tls.Port.indexOf(p) !== -1) {
                let server = https.createServer({
                    cert: tls.Cert,
                    key: tls.Key,
                    ca: tsl.CA
                }, (req, res) => {
                    try {
                        libcore.RoutePath(req.url, req, res);
                    } catch (error) {
                        console.error(error);
                    }
                });
                server.listen(p);
                servers.push(server);
            } else {
                let server = http.createServer((req, res) => {
                    try {
                        libcore.RoutePath(req.url, req, res);
                    } catch (error) {
                        console.error(error);
                    }
                });
                server.listen(p);
                servers.push(server);
            }
        })
        // server.listen(port);
        console.log('Server started on port:', ...port);
    } catch (e) {
        console.error('Server cannot start and listen to', ...port);
        console.error('There might be another instance process of ServerHub. Please check and attempt to start later.')
        process.exit(1);
    }
}

exports.Module = exports.module = exports.Load = exports.load = LoadModule;
exports.ModuleFrom = exports.moduleFrom = exports.LoadFrom = exports.loadFrom = LoadModuleFrom;
const global_load_properties = ['shmodule', 'shload', 'importModule', 'loadModule'];
const global_load_from_properties = ['shmoduleFrom', 'shloadFrom', 'loadModuleFrom', 'importModuleFrom'];

global_load_from_properties.map(p => {
    global[p] = LoadModuleFrom;
})
global_load_properties.map(p => {
    global[p] = LoadModule;
})