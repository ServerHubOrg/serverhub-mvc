# Database

Database is probably the next thing you really want to handle with after you set up the basic of the website. And ServerHub supports some of the most popular databases.

In this very first beta version of ServerHub, you can interact with MySQL (default) extremely easily with the controller scope variable: `this.Runtime.DBProvider`.

## Get Database Connection

Let's begin with an example (MySQL):

```js
"use strict";

return {
    index: function (req, res, method) {
        let db = this.Runtime.DBProvider;
        let conn = db.GetConnection({
            Host: "localhost",
            Username: "devchache",
            Password: "ziyuan"
        });

        conn.connect(err => {
            if (err) throw err;
            this.Console.log("Connected!");
        });

        return this.View();
    }
};
```

This is a classic controller script file with 'index' action. Inside the action method, you can see how easily you can interact with MySQL. Basically, there are two steps:

1. Get database provider object from `this.Runtime.DBProvider`. Don't forget to use `this`.
1. Get database connection with `db.GetConnection()` method. If you have already set up the configuration for database connection strings, there is no required parameters. But if not, you must provide three parameters: `Host`, `Username` and `Password` (No need to explain more, hah?).

Now, you can handle with MySQL database.