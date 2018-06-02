import * as path from 'path';
import * as fs from 'fs';

let filename = 'serverhub.log';
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
})
let logstream = fs.createWriteStream(path.resolve(process.cwd(), `${filename}_${new Date().getTime()}.log`))
process.on('message', (data) => {
    try {
        if (logstream.writable) {
            if (logstream.bytesWritten > maxsize) {
                logstream.close();
                logstream = fs.createWriteStream(path.resolve(process.cwd(), `${filename}_${new Date().getTime()}.log`))
            }
            logstream.write(data);
        }
    } catch (err) {

    }
})