# ServerHub

![](doc/assets/serverhub-compact.png)

Project intro, docs and tutorials, see [ServerHub](https://serverhuborg.github.io/serverhub-mvc/index.html).

我们为中国大陆，中国香港、澳门和中国台湾和其他国家地区使用简体中文的开发者提供了[中文说明文档](doc/README.cn.md)。

For developers using simplified Chinese in China (including Mainland China, Hongkong and Macau Special Administrative Regions, and Taiwan, Province of China) and any other countries or regions, we provide [Simplified Chinese version of README](doc/README.cn.md) as well.

**ServerHub** is a collection of both Node.js framework and its CLI tool.

ServerHub MVC ([serverhub-mvc](https://www.npmjs.com/package/serverhub-mvc)) is a fast and light MVC web server framework that runs on Nodejs.

For details of the CLI tool, checkout [serverhub-cli](https://www.npmjs.com/package/serverhub-cli) or [serverhub-cli](https://github.com/ServerHubOrg/serverhub-cli) under my public repositories.

## Latest Update

You can now ignore specific route rules by using **ignore route rules**. They can be either string or RegExp objects.

Extra parameters added to controller actions (id and search string extracted from URL).

Detailed update could be found on CHANGELOG.md (English only).

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

In your entry script:

```js
const serverhub = require('serverhub-mvc');

serverhub.Run({
    BaseDir: __dirname // BaseDir is required.
});
```

`Run()` method has two parameters (the second one is not required since v0.0.91):

1. config

    The config file defines base directory of the server, which is current of `app.js`. There's a `Controller` property that specifies which controller to register. And then ServerHub will try to search and parse under controller file. When you are writing, you may check this document or search under `node_modules/serverhub-mvc/index.d.ts` file along with all your dependecies, which I've already provided the type definitions there.
1. route (callback function) (before v0.0.91)

    This function will have one parameter that refers to server route object, you can register custom route rule or ignore certain matches (I've not finished developing that feature).

Notice: If you are using macOS or Linux systems like Ubuntu or Debian, then port under 1024 needs privilege. So you may need `sudo` to run the `node app.js` command.

## Documents

We've provided documents/tutorials for both [English](https://devchache.github.io/serverhub-mvc/docs/docs.html) and [Chinese](https://devchache.github.io/serverhub-mvc/zh_cn/docs/docs.html)

## Feel Free to Contact

Ask me through [yangzd1996@outlook.com](mailto:yangzd1996@outlook.com) or on [twitter](https://twitter.com/SrMoriaty).

Leave an issue if you find any bugs. But please notice, DO comment, send pull request or anythings like that IN ENGLISH. But I do have a Chinese version of README file under `doc/`, you may check it out. Thank you very much.