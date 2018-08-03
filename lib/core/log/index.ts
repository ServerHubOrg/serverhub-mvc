import Access from "./log_access";
import Runtime from "./log_runtime";
import Error from "./log_error";
import { EWorkerType, WorkerManager } from "./worker_manager";
import { GlobalEnvironmentVariables } from "../global";

class LogService {
    static Start () {
        let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
        if (variables.LogConfig.Runtime) {
            LogServiceCallback(EWorkerType.RUNTIME, () => {
                let ports = variables.Port.map(p => (variables.TLSOptions && variables.TLSOptions.Port.includes(p)) ? `${p} (TLS)` : `${p}`).join(', ');
                Runtime('system', 'ServerHub started at: ' + ports);
            })
        }
        if (variables.LogConfig.Access) {
            LogServiceCallback(EWorkerType.ACCESS, () => { })
        }

        if (variables.LogConfig.Error) {
            LogServiceCallback(EWorkerType.ERROR, () => { })
        }
    }
}

function LogServiceCallback (type: EWorkerType, callback: Function) {
    switch (type) {
        case EWorkerType.RUNTIME: WorkerManager.GetInstace().ForkWorker(EWorkerType.RUNTIME).then(() => callback()); break;
        case EWorkerType.ACCESS: WorkerManager.GetInstace().ForkWorker(EWorkerType.ACCESS).then(() => callback()); break;
        case EWorkerType.ERROR: WorkerManager.GetInstace().ForkWorker(EWorkerType.ERROR).then(() => callback()); break;
    }
}


export { Access as LogAccess, Runtime as LogRuntime, Error as LogError, LogService };