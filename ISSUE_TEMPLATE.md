### What is your issue?
eg. I cannot have my server app started.

### What is your configuration file?
eg. This is a fake example
```js
const sh = require('serverhub-mvc');
sh.Run({
  BaseDir: __dir_name,
});
```

### Please paste the execution command and your error message:
eg. This is a fake example
```bash
$ node playground/app.js
E:\Personal\repositories\serverhub-mvc\playground\app.js:4
    BaseDir: __dir_name,
             ^

ReferenceError: __dir_name is not defined
    at Object.<anonymous> (E:\Personal\repositories\serverhub-mvc\playground\app.js:4:14)
    at Module._compile (module.js:649:30)
    at Object.Module._extensions..js (module.js:660:10)
    at Module.load (module.js:561:32)
    at tryModuleLoad (module.js:501:12)
    at Function.Module._load (module.js:493:3)
    at Function.Module.runMain (module.js:690:10)
    at startup (bootstrap_node.js:194:16)
    at bootstrap_node.js:666:3
```

### What is your operating system and Node.js, ServerHub version
#### Operating System/Platform
eg. Windows 10 Pro 1709 (x64)
#### Node.js Version
eg. v9.9.0
#### ServerHub Version
eg. v1.0.3

### How you installed ServerHub MVC
- [ ] `npm install -g serverhub-cli`
 `serverhub-cli init myproject`
- [ ] `npm install --save serverhub-cli`
- [x] `npm install --save https://github.com/ServerHubOrg/serverhub-mvc.git`
