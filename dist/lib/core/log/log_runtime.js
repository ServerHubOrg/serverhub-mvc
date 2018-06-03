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
const worker_manager_1 = require("./worker_manager");
const _1 = require("../util/");
function default_1(role, message) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = `${role} [${ConvertLogDate(new Date())}] "${message}"`;
        if (!worker_manager_1.WorkerManager.GetInstace().Status(worker_manager_1.EWorkerType.RUNTIME)) {
            yield worker_manager_1.WorkerManager.GetInstace().ForkWorker(worker_manager_1.EWorkerType.RUNTIME);
            worker_manager_1.WorkerManager.GetInstace().Use(worker_manager_1.EWorkerType.RUNTIME, data);
        }
        else
            worker_manager_1.WorkerManager.GetInstace().Use(worker_manager_1.EWorkerType.RUNTIME, data);
    });
}
exports.default = default_1;
function ConvertLogDate(date) {
    let offset = date.getTimezoneOffset();
    let offsetStr = '';
    if (offset < 0) {
        offsetStr = '-' + ((Math.abs(offset) > 999 ? offset.toString() : () => Math.abs(offset) > 99) ? '0' + Math.abs(offset) : '00' + Math.abs(offset));
    }
    else if (offset > 0) {
        offsetStr = '+' + ((offset > 999 ? offset.toString() : () => offset > 99) ? '0' + offset : '00' + offset);
    }
    else
        offsetStr = '0000';
    return `${_1.DateTime.GetDay(date.getDate())}/${_1.DateTime.GetMonth(date.getMonth())}/${_1.DateTime.GetYear(date.getFullYear())}:${_1.DateTime.GetHours(date.getHours())}:${_1.DateTime.GetMinutes(date.getMinutes())}:${_1.DateTime.GetSeconds(date.getSeconds())} ${offsetStr}`;
}
