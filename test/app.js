/**
 * Test example
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

const serverhub = require('../index');

serverhub.Run({
	BaseDir: __dirname, // BaseDir is required.
}, (route) => {
	route.MapRoute('default', 'v1/{controller}/{action}/{id}');
});

// Contributions:
// Yuyang Mao: Simplify this test entry.