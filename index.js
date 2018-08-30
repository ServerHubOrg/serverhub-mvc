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
const logService = require('./dist/lib/core/log/').LogService;
const ws = require('ws');
const proxy = require('./dist/lib/proxy');
const {
    LogError,
    LogRuntime
} = require('./dist/lib/core/log/');
const AutoRegister = require('./dist/lib/core/plugin/').AutoRegister;
const {
    LoadModule,
    LoadModuleFrom
} = require('./dist/lib/core/module');
const {
    CheckForUpdate
} = require('./dist/lib/update');
const colors = require('colors');
const registerMiddleware = require('./dist/lib/core/middleware/').RegisterMiddleware;

// const callsite = require('callsite'); // Will not be used.


const servers = [];
let SERVER_RUNNING = false;
/**
 * Call this method to start ServerHub service.
 * @param {object} config Initial configuration
 * @param {function} appstart Callback when ServerHub starts.
 */
exports.Run = (config, appstart) => {
    if (SERVER_RUNNING) {
        console.log(colors.red('!! One ServerHub instance is already running on your current application.'));
        return false;
    }
    SERVER_RUNNING = true;

    // let appJsPath = callsite()[1].getFileName(); // Will not be used because I want developers to feel involved in configuration process.
    CheckForUpdate(package['version']);
    if (!config['BaseDir'])
        throw new Error("Must specify server base dir at least.");
    libcore.UpdateGlobalVariable('ServerBaseDir', config['BaseDir']);

    libcore.SetGlobalVariable('PackageData', package);

    let ports = 926; // Birthday of my beloved friend, Changrui.
    if (config['Port']) {
        if (config['Port'] instanceof Array)
            ports = config['Port'].map(p => parseInt(p));
        else ports = [parseInt(config['Port'])];
        libcore.UpdateGlobalVariable('Port', ports);
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

    if (config['RedirectToTLS'] === false) {
        libcore.SetGlobalVariable("RedirectToTLS", false);
    } else config['RedirectToTLS'] = true;
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
        } else {
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

    if (config['Hostname']) {
        let host = config['Hostname'];
        if (host.length > 0 && /[a-z\d.-_]+/i.test(host))
            libcore.SetGlobalVariable('Hostname', host);
        else {
            config['Hostname'] = 'localhost';
            throw new Error('Invalid hostname:', host);
        }
    }

    if (config['LogConfig']) {
        let cfg = config['LogConfig'];
        let temp = {};
        if (cfg.Dir) temp['Dir'] = cfg.Dir;
        if (cfg.Access && cfg.Access === false) temp['Access'] = false;
        if (cfg.Runtime && cfg.Runtime === false) temp['Runtime'] = false;
        if (cfg.Error && cfg.Error === false) temp['Error'] = false;
        if (cfg.Filename) temp['Filename'] = cfg.Filename;
        if (cfg.MaxSize && cfg.MaxSize > 0) temp['MaxSize'] = cfg.MaxSize;
        libcore.SetGlobalVariable('LogConfig', temp);
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
        console.log('>>', colors.green(plugin_info.count.toString()) + ' plugins loaded with no errors');
    } else {
        console.log('>>', colors.yellow(plugin_info.count.toString()), 'plugins loaded.')
    } // load all plugins.

    libcore.RegisterRouter(libroute.Route.GetRoute());

    let sockets = [];

    try {
        if (!Array.isArray(ports))
            ports = [ports];
        let tls = config['TLSOption'] || config['TLSOptions'] || config['SSLOption'] || config['SSLOptions'];
        if (tls && tls.hasOwnProperty('Port')) {
            if (!(tls.Port instanceof Array))
                tls.Port = [parseInt(tls.Port)];
            else {
                tls.Port = tls.Port.map(p => parseInt(p));
            }
            let ps = [];
            tls.Port.map(p => {
                if (ports.indexOf(p) === -1)
                    throw new Error(`${tls.Port} is not defined in given ports: [${ports.join(', ')}]`);
                else ps.push(p);
            });
            libcore.UpdateGlobalVariable('TLSOptions', tls);
        }
        let TLSPort = (tls && tls.Port && tls.Port.length > 0) ? tls.Port[0] : -1;
        let _socketPort = [];
        if (config['SocketOptions'] && config['SocketOptions']['Port']) {
            if (config['SocketOptions']['Port'] instanceof Array && config['SocketOptions']['Port'].length > 0) {
                config['SocketOptions']['Port'].map(sp => {
                    _socketPort.push(parseInt(sp))
                })
            } else {
                let po = config['SocketOptions']['Port'];
                if (typeof po === 'string')
                    _socketPort = [parseInt(po)]
                else if (typeof po === 'number')
                    _socketPort = [po];
            }
        }
        ports.forEach(p => {
            if (tls && tls.Port.indexOf(p) !== -1) {
                let server = https.createServer({
                    cert: tls.Cert,
                    key: tls.Key,
                    ca: tls.CA || '',
                    passphrase: tls.Passphrase || ''
                }, (req, res) => {
                    if (!req.connection.encrypted) {
                        let host = '';
                        let stopRedirection = false;
                        if (config['Hostname'] !== 'localhost')
                            host = config['Hostname'];
                        else host = req.headers['host'] ? req.headers.host.match(/^[^:]+/g)[0] : () => {
                            if (req.connection.localAddress) return req.connection.localAddress;
                            stopRedirection = true;
                        };
                        if (!stopRedirection) {
                            LogRuntime('system', `Redirecting to: ${host}`);
                            res.writeHead(301, 'Moved Permanently', {
                                Location: 'https://' + host + ':' + TLSPort + req.url
                            });
                            res.end();
                            return;
                        }
                    }

                    req['secure'] = true;
                    req['protocol'] = 'https';
                    let conn = req.connection.remoteAddress;
                    try {
                        libcore.RoutePath(req.url, req, res);
                    } catch (error) {
                        LogError('runtime', error.code, ['client', conn], req.url);
                        try {
                            res.statusCode = 500;
                            res.statusMessage = "Internal Server Error";
                        } catch (e) {}
                        res.end();
                    }
                });
                server.listen(p);
                servers.push(server);

                if (_socketPort.indexOf(p) !== -1) {
                    let ss = new ws.Server({
                        server: server,
                    });
                    ss.on('connection', config['SocketOptions']['ConnectionCallback'] ? config['SocketOptions']['ConnectionCallback'] : () => {
                        throw new Error('No callback specified in your configuration.');
                    });
                    ss.on('error', (err) => {
                        console.error(err);
                    })
                    sockets.push(ss);
                }
            } else {
                let server = http.createServer((req, res) => {
                    if (TLSPort > 0 && config['RedirectToTLS']) {
                        let host = '';
                        let stopRedirection = false;
                        if (config['Hostname'] !== 'localhost')
                            host = config['Hostname'];
                        else host = req.headers['host'] ? req.headers.host.match(/^[^:]+/g)[0] : () => {
                            if (req.connection.localAddress) return req.connection.localAddress;
                            stopRedirection = true;
                        };
                        if (!stopRedirection) {
                            LogRuntime('system', `Redirecting to: ${host}`);
                            res.writeHead(301, 'Moved Permanently', {
                                Location: 'https://' + host + ':' + TLSPort + req.url
                            });
                            res.end();
                            return;
                        }
                    }
                    req['secure'] = false;
                    req['protocol'] = 'http';
                    let conn = req.connection.remoteAddress;
                    try {
                        libcore.RoutePath(req.url, req, res);
                    } catch (error) {
                        LogError('runtime', error.code, ['client', conn], req.url);
                        try {
                            res.statusCode = 500;
                            res.statusMessage = "Internal Server Error";
                        } catch (e) {}
                        res.end();
                    }
                });
                server.listen(p);
                servers.push(server);

                if (_socketPort.indexOf(p) !== -1) {
                    let ss = new ws.Server({
                        server: server,
                    });
                    ss.on('connection', config['SocketOptions']['ConnectionCallback'] ? config['SocketOptions']['ConnectionCallback'] : () => {
                        throw new Error('No callback specified in your configuration.');
                    });
                    ss.on('error', (err) => {
                        console.error(err);
                    })
                    sockets.push(ss);
                }
            }
        })
        // server.listen(ports);
        console.log('>> Server started on ports:', colors.green(ports.join(', ')));
        logService.Start();
    } catch (e) {
        console.error('!! Server cannot start and listen to', colors.red(ports.join(', ')));
        console.error('   There might be another instance process of ServerHub. Please check and attempt to start later.')
        console.error('   Detailed error information:');
        console.error(e);
        process.exit(1);
    }

    return {
        Servers: servers,
        Sockets: sockets
    }
}

exports.Middleware = (pathFilter, main) => {
    if ((pathFilter instanceof RegExp || typeof pathFilter === 'string') && main instanceof Function) {
        registerMiddleware({
            Main: main,
            Filter: pathFilter
        });
    } else throw new Error('Middleware must have string or regular expression path filter. And main entry must be a function')
}


exports.Proxy = (type, config) => {
    console.info('Proxy is an experiment feature. Do not use in production environment.')
    try {
        if (type === 'port') {
            let port = config.port || 80;
            let table = config.table || [];
            let httpsC = config.tls || void 0;
            proxy.PortProxy.default(table, port, httpsC);
        }
    } catch (e) {
        console.error('Error creating proxy.');
        console.error(e);
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
global['LogService'] = {
    Runtime: LogRuntime,
    Error: LogError
}