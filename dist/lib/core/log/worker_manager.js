"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = require("fs");
const path = require("path");
var EWorkerType;
(function (EWorkerType) {
    EWorkerType[EWorkerType["ACCESS"] = 0] = "ACCESS";
    EWorkerType[EWorkerType["ERROR"] = 1] = "ERROR";
    EWorkerType[EWorkerType["RUNTIME"] = 2] = "RUNTIME";
})(EWorkerType || (EWorkerType = {}));
exports.EWorkerType = EWorkerType;
class WorkerManager {
    constructor() {
        this._workers = {
            access: void 0,
            runtime: void 0,
            error: void 0
        };
    }
    static GetInstace() {
        return WorkerManager._instance;
    }
    ForkWorker(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                try {
                    let variables = global['EnvironmentVariables'];
                    let log_path = path.resolve(variables.ServerBaseDir, variables.LogConfig.Dir);
                    let typestr = '';
                    switch (type) {
                        case EWorkerType.ACCESS:
                            typestr = 'access';
                            break;
                        case EWorkerType.ERROR:
                            typestr = 'error';
                            break;
                        case EWorkerType.RUNTIME:
                            typestr = 'runtime';
                            break;
                    }
                    if (!fs.existsSync(log_path))
                        fs.mkdirSync(log_path);
                    const loop_till_created = () => {
                        if (childp.connected)
                            res();
                        else
                            process.nextTick(loop_till_created);
                    };
                    let childp = child_process_1.fork(path.resolve(__dirname, './worker.js'), [`filename=${variables.LogConfig.Filename}-${typestr}`, `maxsize=${variables.LogConfig.MaxSize}`], {
                        cwd: log_path
                    });
                    childp.on('exit', (code) => {
                        WorkerManager.GetInstace().ForkWorker(type);
                    });
                    childp.on('message', (m) => {
                        if (m instanceof Object && m.error) {
                            WorkerManager.GetInstace().ForkWorker(type);
                        }
                        else {
                            console.log(m);
                        }
                    });
                    childp.on('error', e => {
                        console.error(e);
                    });
                    this._workers[typestr] = childp;
                    process.nextTick(loop_till_created);
                }
                catch (err) {
                    rej(err);
                }
            });
        });
    }
    Use(type, data) {
        switch (type) {
            case EWorkerType.RUNTIME:
                this._workers.runtime.send(data + '\n');
                break;
            case EWorkerType.ACCESS:
                this._workers.access.send(data + '\n');
                break;
            case EWorkerType.ERROR:
                this._workers.error.send(data + '\n');
                break;
        }
    }
    Status(type) {
        switch (type) {
            case EWorkerType.RUNTIME:
                return this._workers.runtime && !this._workers.runtime.killed || false;
            case EWorkerType.ACCESS:
                return this._workers.access && !this._workers.access.killed || false;
            case EWorkerType.ERROR:
                return this._workers.error && !this._workers.error.killed || false;
        }
    }
}
WorkerManager._instance = new WorkerManager();
exports.WorkerManager = WorkerManager;
