"use strict";

return {
    index: function (req, res, method) {
        this.Console.log('Hello, I\'m from Home controller and index action');
        
        // You need to set up your personal database connection configuration.

        // let db = this.Runtime.DBProvider;
        // let conn = db.GetConnection();

        // conn.connect(err => {
        //     if (err) throw err;
        //     this.Console.log("Connected!");
        // });
        
        return this.View();
    },
    primary: function (req, res, method) {
        var context = this.View();
        context.name = 'Runtime.version -> ' + this.Runtime.branch;
        return context;
    }
};