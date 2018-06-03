import { WorkerManager, EWorkerType } from "./worker_manager";
import { DateTime } from "../util/";


export default async function (role: string, message: string) {
    // system [10/Oct/2000:13:55:36 -0700] "Service started"
    let data = `${role} [${ConvertLogDate(new Date())}] "${message}"`;

    if (!WorkerManager.GetInstace().Status(EWorkerType.RUNTIME)) {
        await WorkerManager.GetInstace().ForkWorker(EWorkerType.RUNTIME);
        WorkerManager.GetInstace().Use(EWorkerType.RUNTIME, data);
    } else
        WorkerManager.GetInstace().Use(EWorkerType.RUNTIME, data);
}

function ConvertLogDate (date: Date) {
    let offset = date.getTimezoneOffset();
    let offsetStr = '';
    if (offset < 0) {
        offsetStr = '-' + ((Math.abs(offset) > 999 ? offset.toString() : () => Math.abs(offset) > 99) ? '0' + Math.abs(offset) : '00' + Math.abs(offset));
    } else if (offset > 0) {
        offsetStr = '+' + ((offset > 999 ? offset.toString() : () => offset > 99) ? '0' + offset : '00' + offset);
    } else
        offsetStr = '0000';
    return `${DateTime.GetDay(date.getDate())}/${DateTime.GetMonth(date.getMonth())}/${DateTime.GetYear(date.getFullYear())}:${DateTime.GetHours(date.getHours())}:${DateTime.GetMinutes(date.getMinutes())}:${DateTime.GetSeconds(date.getSeconds())} ${offsetStr}`
}