/**
 * Test example
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

const serverhub = require('../index');

serverhub.Run({
    BaseDir: __dirname // BaseDir is required.
});

// Contributions:
// Yuyang Mao: Simplify this test entry.