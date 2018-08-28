/**
 * Update support for ServerHub users
 * 
 * Zhongdong Yang, 2018-4-26
 */
import * as http from "http";
import * as request from "request";
import * as colors from "colors";
function CheckForUpdate (current: string): void {
    let re = request('http://registry.npmjs.org/serverhub-mvc');
    re.on('response', function (res: http.IncomingMessage) {
        let response = '';

        res.on('data', data => response += data.toString());
        res.on('end', () => {
            if (response.length > 0) {
                let data = JSON.parse(response);
                let latest = data['dist-tags']['latest'];
                if (latest > current) {
                    console.info(colors.yellow('\n>> Newer version of ServerHub (' + latest + ') is avaliable on npm.js') + '\n   Install with "npm install serverhub-mvc" to get the update.\n');
                }
            }
        })
    });
    re.on('error', function (err) {
        console.error(err);
        console.error('The above error can be caused when your machine is offline.')
    })
}

export { CheckForUpdate };