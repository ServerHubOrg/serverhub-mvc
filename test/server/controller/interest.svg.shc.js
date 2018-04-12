"use strict";

module.exports = {
    "index": function (req, res, method) {
        return this.View();
    },
    "special.all": function (req, res, method) {
        var context = this.View();
        context.name = 'Runtime.version -> ' + this.System.Version;
        return context;
    },
    "special-_": function (req, res, method) {
        var context = this.View();
        context.name = 'Runtime.version -> ' + this.System.Version;
        return context;
    }
};