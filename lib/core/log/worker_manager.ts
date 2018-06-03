import { fork, ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { GlobalEnvironmentVariables } from "../global";

enum EWorkerType {
    ACCESS = 0,
    ERROR = 1,
    RUNTIME = 2
}

interface IWorkerCollection {
    [x: string]: ChildProcess
}

class WorkerManager {
    private constructor() { }
    private static _instance = new WorkerManager();
    private _workers = {
        access: void 0,
        runtime: void 0,
        error: void 0
    } as IWorkerCollection;

    public static GetInstace (): WorkerManager {
        return WorkerManager._instance;
    }

    public async ForkWorker (type: EWorkerType) {
        return new Promise((res, rej) => {
            try {
                let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
                let log_path = path.resolve(variables.ServerBaseDir, variables.LogConfig.Dir);
                let typestr = '';
                switch (type) {
                    case EWorkerType.ACCESS: typestr = 'access'; break;
                    case EWorkerType.ERROR: typestr = 'error'; break;
                    case EWorkerType.RUNTIME: typestr = 'runtime'; break;
                }

                if (!fs.existsSync(log_path))
                    fs.mkdirSync(log_path)

                const loop_till_created = () => {
                    if (childp.connected)
                        res();
                    else process.nextTick(loop_till_created)
                };

                let childp = fork(path.resolve(__dirname, './worker.js'), [`filename=${variables.LogConfig.Filename}-${typestr}`, `maxsize=${variables.LogConfig.MaxSize}`], {
                    cwd: log_path
                });
                childp.on('exit', (code) => {
                    WorkerManager.GetInstace().ForkWorker(type);
                });
                childp.on('message', (m) => {
                    if (m instanceof Object && m.error) {
                        WorkerManager.GetInstace().ForkWorker(type);
                    } else {
                        console.log(m);
                    }
                })
                childp.on('error', e => {
                    console.error(e);
                })
                this._workers[typestr] = childp;
                process.nextTick(loop_till_created);
            } catch (err) {
                rej(err);
            }
        })
    }

    public Use (type: EWorkerType, data: string): void {
        switch (type) {
            case EWorkerType.RUNTIME:
                this._workers.runtime.send(data + '\n'); break;
            case EWorkerType.ACCESS:
                this._workers.access.send(data + '\n'); break;
            case EWorkerType.ERROR:
                this._workers.error.send(data + '\n'); break;
        }
    }
    public Status (type: EWorkerType): boolean {
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

export { EWorkerType, WorkerManager };