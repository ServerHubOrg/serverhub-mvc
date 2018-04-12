"use strict";

module.exports = {
    index: function (req, res, method) {
        return this.View();
    },
    primary: function (req, res, method) {
        var context = this.View();
        context.name = 'Runtime.version -> ' + this.System.Version;
        return context;
    }
};