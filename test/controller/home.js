"use strict";

return {
    index: function (req, res, method) {
        // res.setHeader('Content-Type', 'text/html')
        // res.write('<p>Hello ServerHub</p>');
        // res.write('This is another string sending to browsers.');

        return this.View();
    },
    primary: function (req, res, method) {
        var context = this.View();
        context.name = 'Runtime.version -> ' + this.Runtime.branch;
        return context;
    }
};