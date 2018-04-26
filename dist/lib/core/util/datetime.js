"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Generate_DayName(input) {
    let value = input || new Date().getDay();
    if (typeof value === 'string')
        value = parseInt(value);
    if (value < 1 || value > 7)
        value = 1;
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][value - 1];
}
function Generate_Day(input) {
    let value = input || new Date().getDate();
    if (typeof value === 'string')
        value = parseInt(value);
    if (value < 1 || value > 31)
        value = 1;
    if (value < 10)
        return '0' + value.toString();
    return value.toString();
}
function Generate_Month(input) {
    let value = input || new Date().getMonth();
    if (typeof value === 'string')
        value = parseInt(value);
    if (value < 0 || value > 11)
        value = 0;
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][value];
}
function Generate_Year(input) {
    let value = input || new Date().getFullYear();
    if (typeof value === 'string')
        value = parseInt(value);
    if (value < 10 || value > 2999)
        value = 1970;
    if (value < 100)
        value = 1900 + value;
    if (value < 1000)
        return '0' + value.toString();
    return value.toString();
}
function Generate_Hours(input) {
    let value = input || new Date().getHours();
    if (typeof value === 'string')
        value = parseInt(value);
    if (value < 0 || value > 23)
        value = 0;
    if (value < 10)
        return '0' + value.toString();
    return value.toString();
}
function Generate_Minutes(input) {
    let value = input || new Date().getMinutes();
    if (typeof value === 'string')
        value = parseInt(value);
    if (value < 0 || value > 59)
        value = 0;
    if (value < 10)
        return '0' + value.toString();
    return value.toString();
}
function Generate_Seconds(input) {
    let value = input || new Date().getSeconds();
    if (typeof value === 'string')
        value = parseInt(value);
    if (value < 0 || value > 59)
        value = 0;
    if (value < 10)
        return '0' + value.toString();
    return value.toString();
}
function Generate_Milliseconds(input) {
    let value = input || new Date().getMilliseconds();
    if (typeof value === 'string')
        value = parseInt(value);
    if (value < 0 || value > 999)
        value = 0;
    if (value < 10)
        return '00' + value.toString();
    if (value < 100)
        return '0' + value.toString();
    return value.toString();
}
class DateTime {
    static get Now() {
        return new Date();
    }
    static GetDay(input) {
        return Generate_Day(input);
    }
    static GetDayName(input) {
        return Generate_DayName(input);
    }
    static GetMonth(input) {
        return Generate_Month(input);
    }
    static GetYear(input) {
        return Generate_Year(input);
    }
    static GetFullYear(input) {
        return Generate_Year(input);
    }
    static GetHours(input) {
        return Generate_Hours(input);
    }
    static GetMinutes(input) {
        return Generate_Minutes(input);
    }
    static GetSeconds(input) {
        return Generate_Seconds(input);
    }
    static GetMilliseconds(input) {
        return Generate_Milliseconds(input);
    }
}
exports.DateTime = DateTime;
