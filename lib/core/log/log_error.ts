import { WorkerManager, EWorkerType } from "./worker_manager";
import { DateTime } from "../util/";


export default async function (type: string, message: string, note = [], source = '') {
    // [Wed Oct 11 14:32:52 2000] [error] [client 127.0.0.1] client denied by server configuration: /export/home/live/ap/htdocs/test
    let data = "";
    // if (message.includes('\n'))
    //     data = ` [${ConvertLogDate(new Date())}] [${type}] [${note.join(' ')}] \`${message}\` ${source}]`;
    // else
    data = ` [${ConvertLogDate(new Date())}] [${type}] [${note.join(' ')}] "${message}" ${source}]`;

    if (!WorkerManager.GetInstace().Status(EWorkerType.ERROR)) {
        await WorkerManager.GetInstace().ForkWorker(EWorkerType.ERROR);
        WorkerManager.GetInstace().Use(EWorkerType.ERROR, data);
    } else
        WorkerManager.GetInstace().Use(EWorkerType.ERROR, data);
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
    return `${DateTime.GetDayName(date.getDay())} ${DateTime.GetMonth(date.getMonth())} ${DateTime.GetDay(date.getDate())} ${DateTime.GetHours(date.getHours())}:${DateTime.GetMinutes(date.getMinutes())}:${DateTime.GetSeconds(date.getSeconds())} ${offsetStr}`
}