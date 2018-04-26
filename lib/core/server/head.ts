/**
 * Server Library - Headers
 * 
 * ServerHub MVC, MIT License
 * April 25, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import { DateTime } from "../util";


const avaliable_headers_A = ['Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language', 'Accept-Ranges', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Origin', 'Access-Control-Expose-Headers', 'Access-Control-Max-Age', 'Access-Control-Request-Headers', 'Access-Control-Request-Method', 'Age', 'Allow', 'Authorization'];

const avaliable_headers_C2I = ['Cache-Control', 'Connection', 'Content-Disposition', 'Content-Encoding', 'Content-Language', 'Content-Length', 'Content-Location', 'Content-Range', 'Content-Security-Policy', 'Content-Security-Policy-Report-Only', 'Content-Type', 'Cookie', 'Cookie2', 'DNT', 'Date', 'ETag', 'Expect', 'Expect-CT', 'Expires', 'Forwarded', 'From', 'Host', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Range', 'If-Unmodified-Since'];

const avaliable_headers_K2X = ['Keep-Alive', 'Large-Allocation', 'Last-Modified', 'Location', 'Origin', 'Pragma', 'Proxy-Authenticate', 'Proxy-Authorization', 'Public-Key-Pins', 'Public-Key-Pins-Report-Only', 'Range', 'Referer', 'Referrer-Policy', 'Retry-After', 'Server', 'Set-Cookie', 'Set-Cookie2', 'SourceMap', 'Strict-Transport-Security', 'TE', 'Timing-Allow-Origin', 'Tk', 'Trailer', 'Transfer-Encoding', 'Upgrade-Insecure-Requests', 'User-Agent', 'Vary', 'Via', 'WWW-Authenticate', 'Warning', 'X-Content-Type-Options', 'X-DNS-Prefetch-Control', 'X-Forwarded-For', 'X-Forwarded-Host', 'X-Forwarded-Proto', 'X-Frame-Options', 'X-XSS-Protection'];

const lowerCaseChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const upperCaseChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const StatusCode = [
    100, // Continue
    101, // Switching Protocols
    200, // OK
    201, // Created
    202, // Accepted
    203, // Non-Authoritative Information
    204, // No Content
    205, // Reset Content
    206, // Partial Content
    300, // Multiple Choices
    301, // Moved Permanently
    302, // Found
    303, // See Other
    304, // Not Modified
    307, // Temporary Redirect
    308, // Permanent Redirect
    400, // Bad Request
    401, // Unauthorized
    403, // Forbidden
    404, // Not Found
    405, // Method Not Allowed
    406, // Not Acceptable
    407, // Proxy Authentication Required
    408, // Request Timeout
    409, // Conflict
    410, // Gone
    411, // Length Required
    412, // Precondition Failed
    413, // Payload Too Large
    414, // URI Too Long
    415, // Unsupported Media Type
    416, // Range Not Satisfiable
    417, // Expectation Failed
    418, // I'm a teapot
    426, // Upgrade Required
    428, // Precondition Required
    429, // Too Many Requests
    431, // Request Header Fields Too Large
    451, // Unavailable For Legal Reasons
    500, // Internal Server Error
    501, // Not Implemented
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
    505, // HTTP Version Not Supported
    511 // Network Authentication Required
];

const StatusCodeMessage = [
    "Continue", //100,
    "Switching Protocols", //101,
    "OK", //200,
    "Created", //201,
    "Accepted", //202,
    "Non-Authoritative Information", //203,
    "No Content", //204,
    "Reset Content", //205,
    "Partial Content", //206,
    "Multiple Choices", //300,
    "Moved Permanently", //301,
    "Found", //302,
    "See Other", //303,
    "Not Modified", //304,
    "Temporary Redirect", //307,
    "Permanent Redirect", //308,
    "Bad Request", //400,
    "Unauthorized", //401,
    "Forbidden", //403,
    "Not Found", //404,
    "Method Not Allowed", //405,
    "Not Acceptable", //406,
    "Proxy Authentication Required", //407,
    "Request Timeout", //408,
    "Conflict", //409,
    "Gone", //410,
    "Length Required", //411,
    "Precondition Failed", //412,
    "Payload Too Large", //413,
    "URI Too Long", //414,
    "Unsupported Media Type", //415,
    "Range Not Satisfiable", //416,
    "Expectation Failed", //417,
    "I'm a teapot", //418,
    "Upgrade Required", //426,
    "Precondition Required", //428,
    "Too Many Requests", //429,
    "Request Header Fields Too Large", //431,
    "Unavailable For Legal Reasons", //451,
    "Internal Server Error", //500,
    "Not Implemented", //501,
    "Bad Gateway", //502,
    "Service Unavailable", //503,
    "Gateway Timeout", //504,
    "HTTP Version Not Supported", //505,
    "Network Authentication Required" //511 
];

function GetReasonMessage(statusCode: number): string {
    if (StatusCode.includes(statusCode))
        return StatusCodeMessage[StatusCode.indexOf(statusCode)];
    else throw new Error('Undefined status code');
}

/**
 * Describes avaliable HTTP headers.
 */
interface Headers extends Object {
    'Accept'?: string;
    'Accept-Charset'?: string;
    'Accept-Encoding'?: string;
    'Accept-Language'?: string;
    'Accept-Ranges'?: string;
    'Access-Control-Allow-Credentials'?: string;
    'Access-Control-Allow-Headers'?: string;
    'Access-Control-Allow-Methods'?: string;
    'Access-Control-Allow-Origin'?: string;
    'Access-Control-Expose-Headers'?: string;
    'Access-Control-Max-Age'?: string;
    'Access-Control-Request-Headers'?: string;
    'Access-Control-Request-Method'?: string;
    'Age'?: string;
    'Allow'?: string;
    'Authorization'?: string;
    'Cache-Control'?: string;
    'Connection'?: string;
    'Content-Disposition'?: string;
    'Content-Encoding'?: string;
    'Content-Language'?: string;
    'Content-Length'?: string;
    'Content-Location'?: string;
    'Content-Range'?: string;
    'Content-Security-Policy'?: string;
    'Content-Security-Policy-Report-Only'?: string;
    'Content-Type'?: string;
    'Cookie'?: string;
    'Cookie2'?: string;
    'DNT'?: string;
    'Date'?: string;
    'ETag'?: string;
    'Expect'?: string;
    'Expect-CT'?: string;
    'Expires'?: string;
    'Forwarded'?: string;
    'From'?: string;
    'Host'?: string;
    'If-Match'?: string;
    'If-Modified-Since'?: string;
    'If-None-Match'?: string;
    'If-Range'?: string;
    'If-Unmodified-Since'?: string;
    'Keep-Alive'?: string;
    'Large-Allocation'?: string;
    'Last-Modified'?: string;
    'Location'?: string;
    'Origin'?: string;
    'Pragma'?: string;
    'Proxy-Authenticate'?: string;
    'Proxy-Authorization'?: string;
    'Public-Key-Pins'?: string;
    'Public-Key-Pins-Report-Only'?: string;
    'Range'?: string;
    'Referer'?: string;
    'Referrer-Policy'?: string;
    'Retry-After'?: string;
    'Server'?: string;
    'Set-Cookie'?: string;
    'Set-Cookie2'?: string;
    'SourceMap'?: string;
    'Strict-Transport-Security'?: string;
    'TE'?: string;
    'Timing-Allow-Origin'?: string;
    'Tk'?: string;
    'Trailer'?: string;
    'Transfer-Encoding'?: string;
    'Upgrade-Insecure-Requests'?: string;
    'User-Agent'?: string;
    'Vary'?: string;
    'Via'?: string;
    'WWW-Authenticate'?: string;
    'Warning'?: string;
    'X-Content-Type-Options'?: string;
    'X-DNS-Prefetch-Control'?: string;
    'X-Forwarded-For'?: string;
    'X-Forwarded-Host'?: string;
    'X-Forwarded-Proto'?: string;
    'X-Frame-Options'?: string;
    'X-XSS-Protection'?: string;
}

function IsValidHeader(headerStr: string): boolean {
    let firstChar = headerStr[0];
    if (firstChar === 'A') return avaliable_headers_A.includes(headerStr);
    else if (['C', 'D', 'E', 'F', 'H', 'I'].includes(firstChar)) return avaliable_headers_C2I.includes(headerStr);
    else if (['K', 'L', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X'].includes(firstChar)) return avaliable_headers_K2X.includes(headerStr);
    return false;
}

function IsValidHeaders(header: Object): boolean {
    let matched = false;
    Object.keys(header).forEach(head => {
        if (matched) return;

        let firstChar = head[0];
        if (firstChar === 'A') matched = avaliable_headers_A.includes(head);
        else if (['C', 'D', 'E', 'F', 'H', 'I'].includes(firstChar)) matched = avaliable_headers_C2I.includes(head);
        else if (['K', 'L', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X'].includes(firstChar)) matched = avaliable_headers_K2X.includes(head);
    })
    if (matched) return true;
    else return false;
}

function TransformHeader(header: string): string {
    if (header && header.length > 0 && header.match(/[a-z\d-]+/i)) {
        if (header.includes('-')) {
            let segs = header.split('-');
            segs = segs.map(seg => {
                seg = seg.trim();
                if (seg && seg.length > 0) {
                    return seg[0].toUpperCase() + seg.slice(1);
                }
                throw new Error('Wrong structure of HTTP header name.')
            });
            return segs.join('-');
        } else {
            if (lowerCaseChars.includes(header[0]))
                return header[0].toUpperCase() + header.slice(1);
            else return header;
        }
    } else throw new Error('Empty HTTP header.');
}

function FormatDate(date?: Date): string {
    if (date instanceof Date)
        return `${DateTime.GetDayName(date.getDay())}, ${DateTime.GetDay(date.getDate())} ${DateTime.GetMonth(date.getMonth())} ${DateTime.GetYear(date.getFullYear())} ${DateTime.GetHours(date.getHours())}:${DateTime.GetMinutes(date.getMinutes())}:${DateTime.GetSeconds(date.getSeconds())} GMT`;
    else return `${DateTime.GetDayName()}, ${DateTime.GetDay()} ${DateTime.GetMonth()} ${DateTime.GetYear()} ${DateTime.GetHours()}:${DateTime.GetMinutes()}:${DateTime.GetSeconds()} GMT`;
}

export { Headers, IsValidHeaders, IsValidHeader, GetReasonMessage, TransformHeader, FormatDate };