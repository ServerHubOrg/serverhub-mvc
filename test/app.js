const serverhub = require('../index');
const fs = require('fs');
const path = require('path');

serverhub.Run({
    BaseDir: __dirname,
    WebDir: 'www/',
    Controllers: ['see.js', 'home.js']
}, (route) => {
    route.MapRoute('default', '{controller}/{action}/{id}', {
        Controller: 'home',
        Action: 'index',
        id: ''
    });
});