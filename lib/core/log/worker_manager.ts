import { fork, ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { GlobalEnvironmentVariables } from "../global";

enum EWorkerType {
    ACCESS = 0,
    ERROR = 1,
    RUNTIME = 2
}

class Worker {
    private _alive = true;
    private _type: EWorkerType;
    private _cp: ChildProcess;
    get Alive () {
        return this._alive;
    }
    constructor(cp: ChildProcess, type: EWorkerType) {
        this._type = type;
        this._cp = cp;
        this._alive = true;
        cp.on('exit', (code) => {
            this._alive = false;
            WorkerManager.GetInstace().ForkWorker(this._type);
        });
        cp.on('message', (m) => {
            if (m instanceof Object && m.error) {
                this._alive = false;
                WorkerManager.GetInstace().ForkWorker(this._type);
            }
        })
    }
    public WriteLog (data: string) {
        if (!data.endsWith('\n'))
            data += '\n';
        this._cp.send(data);
    }
}

interface IWorkerCollection {
    [x: string]: Worker
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
                let childp = fork('./worker.js', [`filename=${variables.LogConfig.Filename}-${typestr}`, `maxsize=${variables.LogConfig.MaxSize}`], {
                    cwd: log_path
                });
                this._workers[typestr] = new Worker(childp, type);
                res();
            } catch (err) {
                rej(err);
            }
        })
    }

    public Use (type: EWorkerType): (data: string) => void {
        switch (type) {
            case EWorkerType.RUNTIME:
                return this._workers.runtime.WriteLog
            case EWorkerType.ACCESS:
                return this._workers.access.WriteLog
            case EWorkerType.ERROR:
                return this._workers.error.WriteLog
        }
    }
    public Status (type: EWorkerType): boolean {
        switch (type) {
            case EWorkerType.RUNTIME:
                return this._workers.runtime.Alive || false;
            case EWorkerType.ACCESS:
                return this._workers.access.Alive || false;
            case EWorkerType.ERROR:
                return this._workers.error.Alive || false;
        }
    }
}

export { EWorkerType, WorkerManager };