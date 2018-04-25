"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const avaliable_headers_A = ['Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language', 'Accept-Ranges', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Origin', 'Access-Control-Expose-Headers', 'Access-Control-Max-Age', 'Access-Control-Request-Headers', 'Access-Control-Request-Method', 'Age', 'Allow', 'Authorization'];
const avaliable_headers_C2I = ['Cache-Control', 'Connection', 'Content-Disposition', 'Content-Encoding', 'Content-Language', 'Content-Length', 'Content-Location', 'Content-Range', 'Content-Security-Policy', 'Content-Security-Policy-Report-Only', 'Content-Type', 'Cookie', 'Cookie2', 'DNT', 'Date', 'ETag', 'Expect', 'Expect-CT', 'Expires', 'Forwarded', 'From', 'Host', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Range', 'If-Unmodified-Since'];
const avaliable_headers_K2X = ['Keep-Alive', 'Large-Allocation', 'Last-Modified', 'Location', 'Origin', 'Pragma', 'Proxy-Authenticate', 'Proxy-Authorization', 'Public-Key-Pins', 'Public-Key-Pins-Report-Only', 'Range', 'Referer', 'Referrer-Policy', 'Retry-After', 'Server', 'Set-Cookie', 'Set-Cookie2', 'SourceMap', 'Strict-Transport-Security', 'TE', 'Timing-Allow-Origin', 'Tk', 'Trailer', 'Transfer-Encoding', 'Upgrade-Insecure-Requests', 'User-Agent', 'Vary', 'Via', 'WWW-Authenticate', 'Warning', 'X-Content-Type-Options', 'X-DNS-Prefetch-Control', 'X-Forwarded-For', 'X-Forwarded-Host', 'X-Forwarded-Proto', 'X-Frame-Options', 'X-XSS-Protection'];
const codePointA = 'A'.codePointAt(0);
const codePointC = 'C'.codePointAt(0);
const codePointI = 'I'.codePointAt(0);
const codePointK = 'K'.codePointAt(0);
const codePointX = 'X'.codePointAt(0);
function ValidHeaders(header) {
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
exports.ValidHeaders = ValidHeaders;
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
            if ('abcdefghijklmnopqrstuvwxyz'.includes(header[0]))
                return header[0].toUpperCase() + header.slice(1);
            else
                return header;
        }
    }
    else
        throw new Error('Empty HTTP header.');
}
exports.TransformHeader = TransformHeader;
