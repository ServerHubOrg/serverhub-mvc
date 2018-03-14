# `this.Runtime.DBProvider` Object Usage

If you pass the following object as the first configuration parameter to `ServerHub.Run()` method, ServerHub will automatically link MySQLProvider (`lib/core/database/mysql`). Then every time there is a request hit an action, ServerHub will attach an instance of the DBProvider to `this.Runtime.DBProvider` property. So you can access to that object in you action code.

```js
var config = {
    BaseDir: __dirname,
    WebDir: 'www/',
    Controllers: ['see.js', 'home.js'],
    MaxCacheSize: 350,
    DBConnectionString: 'host=localhost;user=zhongdongy;password=yang'
}
```

## Methods

### `DBProviderInstance.GetConnection(config?): DBConnection`

The `config` parameter is optional. If you have provided `DBConnectionString` in global configuration, then it is not required. But if not, you must specify one like:

```js
{
    Host: 'localhost',
    Username: 'zhongdongy',
    Password: 'yang'
}
```

The return value, `DBConnection` does not have a specific type definition. If you use MySQL database provider, then please read: [npm/mysql](https://www.npmjs.com/package/mysql#establishing-connections).