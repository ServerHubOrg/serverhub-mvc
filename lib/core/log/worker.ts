import * as path from 'path';
import * as fs from 'fs';
import { WriteStream } from 'fs';

const BUFFER = Buffer.alloc(65536 * 8); // 8M buffer for each worker process.
const BUFFER_STATUS = {
    DATA_FLAG: false,
    LENGTH: 0
};
const StreamWrapper = (ws: WriteStream) => {
    ws.on('drain', () => {
        if (BUFFER_STATUS.DATA_FLAG !== false) {
            let buffer = BUFFER.toString('utf8', 0, BUFFER_STATUS.LENGTH);
            BUFFER.fill(0);
            BUFFER_STATUS.DATA_FLAG = false;
            BUFFER_STATUS.LENGTH = 0;
            ws.write(buffer);
        }
    });
}

let filename = 'serverhub';
let maxsize = 65536; //bytes


process.argv.forEach(arg => {
    if (arg.match(/^filename=[^=/\\><?!]+$/i)) {
        filename = arg.split('=')[1];
    } else if (arg.match(/^maxsize=[^=/\\><?!]+$/i)) {
        let size = arg.split('=')[1];
        try {
            maxsize = Math.abs(parseInt(size));
        } catch (error) { }
    }
});

let initialPath = path.resolve(process.cwd(), `${filename}-${new Date().getTime()}.log`);
let logstream = fs.createWriteStream(initialPath);
StreamWrapper(logstream);

process.on('message', (data: string) => {
    try {
        if (logstream.bytesWritten > maxsize) {
            const newstream = () => {
                logstream.close();
                logstream = fs.createWriteStream(path.resolve(process.cwd(), `${filename}-${new Date().getTime()}.log`))
                logstream.on('open', () => {
                    StreamWrapper(logstream);
                    logstream.write(data);
                });
            }
            if (logstream.writable) {
                newstream();
            } else logstream.on('drain', newstream);
        } else {
            if (logstream.writable) {
                logstream.write(data);
            } else {
                BUFFER.write(data, BUFFER_STATUS.LENGTH, data.length);
                BUFFER_STATUS.DATA_FLAG = true;
                BUFFER_STATUS.LENGTH += data.length;
            }
        }
    } catch (err) {
        process.send({
            error: err
        })
    }
})
