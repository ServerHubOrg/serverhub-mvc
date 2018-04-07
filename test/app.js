/**
 * Test example
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

const serverhub = require('../index');
// const load = require('../index').loadFrom;

serverhub.Run({
	BaseDir: __dirname, // BaseDir is required.
}, (route) => {
	route.MapRoute('default', 'v1/{controller}/{action}/{id}');
});

var hhh = importModuleFrom('index.js', '../');
console.log(hhh);
// Contributions:
// Yuyang Mao: Simplify this test entry.