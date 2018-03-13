/**
 * Content Type Definitions
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

/**
 * Provide Content Type operations.
 */
export class ContentType {
    private static types = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        gif: 'image/gif',
        svg: 'image/svg',
        webp: 'image/webp',
        weba: 'audio/weba',
        webm: 'video/webm',
        woff: 'font/woff',
        woff2: 'font/woff2',
        ttf: 'font/ttf',
        eot: 'application/vnd.ms-fontobject',
        pdf: 'application/pdf',
        htm: 'text/html',
        html: 'text/html;charset=utf-8',
        json: 'application/json',
        xml: 'application/xml',
        js: 'application/js',
        ts: 'application/typescript',
        ico: 'image/x-icon',
        css: 'text/css',
        '7z': 'application/x-7z-compressed',
        ___: "text/plain",
        mp4: 'application/mp4'
    };

    /**
     * Return content type string with file extension type.
     * @param ext File extension
     */
    public static GetContentType(ext: string): string {
        if (ext.startsWith('.'))
            ext = ext.slice(1);
        if (ContentType.types.hasOwnProperty(ext))
            return ContentType.types[ext];
        else return ContentType.types.html;
    }
}