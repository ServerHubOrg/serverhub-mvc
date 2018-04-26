"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const avaliable_headers_A = ['Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language', 'Accept-Ranges', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Origin', 'Access-Control-Expose-Headers', 'Access-Control-Max-Age', 'Access-Control-Request-Headers', 'Access-Control-Request-Method', 'Age', 'Allow', 'Authorization'];
const avaliable_headers_C2I = ['Cache-Control', 'Connection', 'Content-Disposition', 'Content-Encoding', 'Content-Language', 'Content-Length', 'Content-Location', 'Content-Range', 'Content-Security-Policy', 'Content-Security-Policy-Report-Only', 'Content-Type', 'Cookie', 'Cookie2', 'DNT', 'Date', 'ETag', 'Expect', 'Expect-CT', 'Expires', 'Forwarded', 'From', 'Host', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Range', 'If-Unmodified-Since'];
const avaliable_headers_K2X = ['Keep-Alive', 'Large-Allocation', 'Last-Modified', 'Location', 'Origin', 'Pragma', 'Proxy-Authenticate', 'Proxy-Authorization', 'Public-Key-Pins', 'Public-Key-Pins-Report-Only', 'Range', 'Referer', 'Referrer-Policy', 'Retry-After', 'Server', 'Set-Cookie', 'Set-Cookie2', 'SourceMap', 'Strict-Transport-Security', 'TE', 'Timing-Allow-Origin', 'Tk', 'Trailer', 'Transfer-Encoding', 'Upgrade-Insecure-Requests', 'User-Agent', 'Vary', 'Via', 'WWW-Authenticate', 'Warning', 'X-Content-Type-Options', 'X-DNS-Prefetch-Control', 'X-Forwarded-For', 'X-Forwarded-Host', 'X-Forwarded-Proto', 'X-Frame-Options', 'X-XSS-Protection'];
const lowerCaseChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const upperCaseChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const StatusCode = [
    100,
    101,
    200,
    201,
    202,
    203,
    204,
    205,
    206,
    300,
    301,
    302,
    303,
    304,
    307,
    308,
    400,
    401,
    403,
    404,
    405,
    406,
    407,
    408,
    409,
    410,
    411,
    412,
    413,
    414,
    415,
    416,
    417,
    418,
    426,
    428,
    429,
    431,
    451,
    500,
    501,
    502,
    503,
    504,
    505,
    511
];
const StatusCodeMessage = [
    "Continue",
    "Switching Protocols",
    "OK",
    "Created",
    "Accepted",
    "Non-Authoritative Information",
    "No Content",
    "Reset Content",
    "Partial Content",
    "Multiple Choices",
    "Moved Permanently",
    "Found",
    "See Other",
    "Not Modified",
    "Temporary Redirect",
    "Permanent Redirect",
    "Bad Request",
    "Unauthorized",
    "Forbidden",
    "Not Found",
    "Method Not Allowed",
    "Not Acceptable",
    "Proxy Authentication Required",
    "Request Timeout",
    "Conflict",
    "Gone",
    "Length Required",
    "Precondition Failed",
    "Payload Too Large",
    "URI Too Long",
    "Unsupported Media Type",
    "Range Not Satisfiable",
    "Expectation Failed",
    "I'm a teapot",
    "Upgrade Required",
    "Precondition Required",
    "Too Many Requests",
    "Request Header Fields Too Large",
    "Unavailable For Legal Reasons",
    "Internal Server Error",
    "Not Implemented",
    "Bad Gateway",
    "Service Unavailable",
    "Gateway Timeout",
    "HTTP Version Not Supported",
    "Network Authentication Required"
];
function GetReasonMessage(statusCode) {
    if (StatusCode.includes(statusCode))
        return StatusCodeMessage[StatusCode.indexOf(statusCode)];
    else
        throw new Error('Undefined status code');
}
exports.GetReasonMessage = GetReasonMessage;
function IsValidHeader(headerStr) {
    let firstChar = headerStr[0];
    if (firstChar === 'A')
        return avaliable_headers_A.includes(headerStr);
    else if (['C', 'D', 'E', 'F', 'H', 'I'].includes(firstChar))
        return avaliable_headers_C2I.includes(headerStr);
    else if (['K', 'L', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X'].includes(firstChar))
        return avaliable_headers_K2X.includes(headerStr);
    return false;
}
exports.IsValidHeader = IsValidHeader;
function IsValidHeaders(header) {
    let matched = false;
    Object.keys(header).forEach(head => {
        if (matched)
            return;
        let firstChar = head[0];
        if (firstChar === 'A')
            matched = avaliable_headers_A.includes(head);
        else if (['C', 'D', 'E', 'F', 'H', 'I'].includes(firstChar))
            matched = avaliable_headers_C2I.includes(head);
        else if (['K', 'L', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X'].includes(firstChar))
            matched = avaliable_headers_K2X.includes(head);
    });
    if (matched)
        return true;
    else
        return false;
}
exports.IsValidHeaders = IsValidHeaders;
function TransformHeader(header) {
    if (header && header.length > 0 && header.match(/[a-z\d-]+/i)) {
        if (header.includes('-')) {
            let segs = header.split('-');
            segs = segs.map(seg => {
                seg = seg.trim();
                if (seg && seg.length > 0) {
                    return seg[0].toUpperCase() + seg.slice(1);
                }
                throw new Error('Wrong structure of HTTP header name.');
            });
            return segs.join('-');
        }
        else {
            if (lowerCaseChars.includes(header[0]))
                return header[0].toUpperCase() + header.slice(1);
            else
                return header;
        }
    }
    else
        throw new Error('Empty HTTP header.');
}
exports.TransformHeader = TransformHeader;
function FormatDate(date) {
    if (date instanceof Date)
        return `${util_1.DateTime.GetDayName(date.getDay())}, ${util_1.DateTime.GetDay(date.getDate())} ${util_1.DateTime.GetMonth(date.getMonth())} ${util_1.DateTime.GetYear(date.getFullYear())} ${util_1.DateTime.GetHours(date.getHours())}:${util_1.DateTime.GetMinutes(date.getMinutes())}:${util_1.DateTime.GetSeconds(date.getSeconds())} GMT`;
    else
        return `${util_1.DateTime.GetDayName()}, ${util_1.DateTime.GetDay()} ${util_1.DateTime.GetMonth()} ${util_1.DateTime.GetYear()} ${util_1.DateTime.GetHours()}:${util_1.DateTime.GetMinutes()}:${util_1.DateTime.GetSeconds()} GMT`;
}
exports.FormatDate = FormatDate;
