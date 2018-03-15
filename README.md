# ServerHub

![](doc/assets/serverhub-compact.png)

[中文版](doc/README.cn.md)

**ServerHub** is a collection of both Nodejs framework and its CLI tool.

ServerHub MVC ([serverhub-mvc](https://www.npmjs.com/package/serverhub-mvc)) is a fast and light MVC web server framework that runs on Nodejs.

For details of the CLI tool, checkout [serverhub-cli](https://www.npmjs.com/package/serverhub-cli) or serverhub-cli under my public repositories.

## Latest Update

Original ServerResponse parameter in actions has been replaced with a wrapper SHResponse.

With several weeks' development, I'm glad to announce that database support has been added to ServerHub. And with the version 0.0.5+ in npm, you can now use controller scope variables and several new features. Detailed update could be found on CHANGELOG.md.

## What Can ServerHub Do

Currently, ServerHub support custom routing, view binding and controller registering.

Here is how the example workspace directory looks like (you can use `serverhub-cli init . -d` with serverhub-cli to get such a demo.)

```plain
demo_directory/
 |- controller/
 |   |- home.js
 |- model/
 |   |- home.json
 |- view/
 |   |- home.html
 |- www/
 |   |- global.css
 |   |- global.js
 |- app.js
```

Then, run

```bash
node app.js
```

And the server started (It runs on port 926 in default, which is my BF's birthday). Go to your browser and checkout 'localhost:926', then you can see:

![](doc/assets/demo_homepage.png)

The content comes from default route rule: `/home/index/`. The word 'world' is defined in model file `home.json` and rendered by `home.js` controller. The sentence in blue is injected by script file `global.js` under `www/`.

## Install

```bash
npm i --save serverhub-mvc
```

or if you want to get a demo, run

```bash
npm i -g serverhub-cli
cd path/to/you/workspace/
npm init #ignore if you already done this
npm i --save serverhub-mvc
mkdir server && serverhub-cli init server -d #be sure to keep your files before add -h option to init command.
```

## Usage

Like the example given by serverhub-cli or under `test` directory, the file app.js has some requirements:

```js
const serverhub = require('serverhub-mvc');
const fs = require('fs');
const path = require('path');

serverhub.Run({
    BaseDir: __dirname,
    WebDir: 'www/',
    Controllers: ['home.js'],
    MaxCacheSize: 256 // unit: MB
}, (route) => {
    route.MapRoute('default', '{controller}/{action}/{id}', {
        Controller: 'home',
        Action: 'index',
        id: ''
    });
});
```

`Run()` method has two required parameters:

1. config

    The config file defines base directory of the server, which is current of `app.js`. There's a `Controller` property that specifies which controller to register. And then ServerHub will try to search and parse under controller file. When you are writing, you may check this document or search under `node_modules/serverhub-mvc/index.d.ts` file along with all your dependecies, which I've already provided the type definitions there.
1. route (callback function)

    This function will have one parameter that refers to server route object, you can register custom route rule or ignore certain matches (I've not finished developing that feature).

## Feel Free to Contact

Ask me through [yangzd1996@outlook.com](mailto:yangzd1996@outlook.com) or on [twitter](https://twitter.com/SrMoriaty).

Leave an issue if you find any bugs. But please notice, DO comment, send pull request or anythings like that IN ENGLISH. But I do have a Chinese version of README file under `doc/`, you may check it out. Thank you very much.