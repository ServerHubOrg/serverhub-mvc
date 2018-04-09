/**
 * Test example
 * 
 * ServerHub MVC, MIT License
 * April 9th, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

const serverhub = require('../../index');

serverhub.Run({
	BaseDir: __dirname, // BaseDir is required.
}, (route) => {
	route.MapRoute('default', '{controller}/{action}/{id}');
});