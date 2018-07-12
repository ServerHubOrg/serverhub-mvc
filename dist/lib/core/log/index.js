"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_access_1 = require("./log_access");
exports.LogAccess = log_access_1.default;
const log_runtime_1 = require("./log_runtime");
exports.LogRuntime = log_runtime_1.default;
const log_error_1 = require("./log_error");
exports.LogError = log_error_1.default;
const worker_manager_1 = require("./worker_manager");
class LogService {
    static Start() {
        let variables = global['EnvironmentVariables'];
        if (variables.LogConfig.Runtime) {
            LogServiceCallback(worker_manager_1.EWorkerType.RUNTIME, () => {
                let ports = variables.Port.map(p => {
                    if (variables.TLSOptions && variables.TLSOptions.Port.includes(p))
                        return `${p} (TLS)`;
                    else
                        return `${p}`;
                }).join(', ');
                log_runtime_1.default('system', 'ServerHub started at: ' + ports);
            });
        }
        if (variables.LogConfig.Access) {
            LogServiceCallback(worker_manager_1.EWorkerType.ACCESS, () => { });
        }
        if (variables.LogConfig.Error) {
            LogServiceCallback(worker_manager_1.EWorkerType.ERROR, () => { });
        }
    }
}
exports.LogService = LogService;
function LogServiceCallback(type, callback) {
    switch (type) {
        case worker_manager_1.EWorkerType.RUNTIME:
            worker_manager_1.WorkerManager.GetInstace().ForkWorker(worker_manager_1.EWorkerType.RUNTIME).then(() => callback());
            break;
        case worker_manager_1.EWorkerType.ACCESS:
            worker_manager_1.WorkerManager.GetInstace().ForkWorker(worker_manager_1.EWorkerType.ACCESS).then(() => callback());
            break;
        case worker_manager_1.EWorkerType.ERROR:
            worker_manager_1.WorkerManager.GetInstace().ForkWorker(worker_manager_1.EWorkerType.ERROR).then(() => callback());
            break;
    }
}
