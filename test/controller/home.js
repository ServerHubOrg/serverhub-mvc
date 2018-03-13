"use strict";

return {
    index: function (req, res, method) {
        this.Console.log('Hello, I\'m from Home controller and index action');
        return this.View();
    },
    primary: function (req, res, method) {
        var context = this.View();
        context.name = 'Runtime.version -> ' + this.Runtime.branch;
        return context;
    }
};