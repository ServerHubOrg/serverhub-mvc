declare enum EWorkerType {
    ACCESS = 0,
    ERROR = 1,
    RUNTIME = 2,
}
declare class WorkerManager {
    private constructor();
    private static _instance;
    private _workers;
    static GetInstace(): WorkerManager;
    ForkWorker(type: EWorkerType): Promise<{}>;
    Use(type: EWorkerType, data: string): void;
    Status(type: EWorkerType): boolean;
}
export { EWorkerType, WorkerManager };
