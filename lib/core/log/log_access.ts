import { WorkerManager, EWorkerType } from "./worker_manager";
import { DateTime } from "../util/";


export default async function (ip: string, path: string, length: number, user: string, identity = '-', method = 'GET', secure = true, version = '1.1', status = 200) {
    // 127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326
    // ip client_identity authenticated_user [Date/Month/Year:Hour:Minute:Seconds Zone] "HTTP_method request_path HTTP_version" status_code content_length
    let data = `${ip} ${identity} ${user} [${ConvertLogDate(new Date())}] "${method} ${path} HTTP${secure ? 'S' : ''}/${version}" ${status} ${length}`;

    if (!WorkerManager.GetInstace().Status(EWorkerType.ACCESS)) {
        await WorkerManager.GetInstace().ForkWorker(EWorkerType.ACCESS);
        WorkerManager.GetInstace().Use(EWorkerType.ACCESS, data);
    } else
        WorkerManager.GetInstace().Use(EWorkerType.ACCESS, data);
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