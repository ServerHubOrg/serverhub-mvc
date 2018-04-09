const spawn = require('child_process').spawn;
const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

let mocha = new Mocha();

let cp = spawn('node', ["test/server/app.js"]);
cp.stdout.on('data', d => {
    console.log(d.toString());
    if (d.toString().indexOf('Server started on port') !== -1)
        testEntry();
});
cp.stderr.on('data', d => {
    console.error(d.toString());
})

function testEntry() {
    let testpath = path.resolve(__dirname, 'entries/');
    fs.readdirSync(testpath).filter(f => f.endsWith('.js')).forEach(f => {
        mocha.addFile(path.join(testpath, f));
    });
    mocha.run(failure => {
        process.on('exit', function () {
            process.exit(failure);
        });
        if (failure === 0) {
            cp.kill(0);
            process.exit(0);
        }
    });
}