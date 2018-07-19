![](doc/assets/serverhub-compact.png)

Project introductions, documents and tutorials, see [serverhub.io](https://serverhub.io/).

[![Build Status](https://travis-ci.org/ServerHubOrg/serverhub-mvc.svg?branch=master)](https://travis-ci.org/ServerHubOrg/serverhub-mvc) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FServerHubOrg%2Fserverhub-mvc.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FServerHubOrg%2Fserverhub-mvc?ref=badge_shield) [![Coverage Status](https://coveralls.io/repos/github/ServerHubOrg/serverhub-mvc/badge.svg?branch=master)](https://coveralls.io/github/ServerHubOrg/serverhub-mvc?branch=master)

我们为中国大陆，中国香港、澳门和中国台湾和其他国家地区使用简体中文的开发者提供了[中文说明文档](doc/README.cn.md)。

For developers using simplified Chinese in China (including Mainland China, Hongkong and Macau Special Administrative Regions, and Taiwan, Province of China) and any other countries or regions, we provide [Simplified Chinese version of README](doc/README.cn.md) as well.

**ServerHub** is the collection of a Node.js framework, a CLI tool and a template using the latest stable features.

ServerHub MVC ([serverhub-mvc](https://www.npmjs.com/package/serverhub-mvc)) is a fast and light MVC web server framework that runs on Nodejs.

For details of the CLI tool, checkout [serverhub-cli](https://www.npmjs.com/package/serverhub-cli) or [serverhub-cli](https://github.com/ServerHubOrg/serverhub-cli) under our orgnization repositories.

## What Can ServerHub Do

ServerHub can do a lot of things now. No matter you want to start a static website or build a dynamic web service, it is super convenient. Let's see some things most people would like to do with ServerHub:

1. Static website: Support downloading and caching. Your frequently used resources will be cached in memory. Once they are changed, ServerHub will automatically refresh the cache and make sure they are the lastest.
2. Dynamic website: Support MVC architecture. With custom route, all requests will be send to corresponding handlers.
3. WebAPIs: Inspired by [ASP.NET](https://www.asp.net/), ServerHub can also be used to provide WebAPI service for your applications.
4. Proxy*: (Still designing).

## Latest Updates

`v1.5.0` Adds middleware system to the master/dev branch and now ready to release, with the ability to rewrite URL of resources. `v1.4.1` Updated the runtime log and fix some unclear annotations. `v1.3.0` updated route rules and engine. `v1.2.0` supports **runtime** and **error** log service. They are available through `global` object. `v1.1.0` supports auto-redirect HTTP traffic to HTTPS. Asynchronous plugins are supported since `v1.0.8`. TLS supported since `v1.0.6`, you can use your self-signed or verified certificate to hold an HTTPS connection for your websites. Module style of ServerHub controllers now supported (since `v1.0.4`). You can import your own libraries in your controllers now. Legacy ways of scripting controllers will also be supported. But a little workaround should be taken into consideration (deprecated usage).

Detailed update information could be found on [CHANGELOG.md](CHANGELOG.md) (English only).

## Install

```bash
npm i --save serverhub-mvc
```

or install a template with `serverhub-cli`, run

```bash
npm i -g serverhub-cli
cd path/to/you/workspace/
serverhub-cli init [project-name] # This will generate a new directory for you project.
```

## Usage

In your entry script:

```js
const serverhub = require('serverhub-mvc');

serverhub.Run({
    BaseDir: __dirname // BaseDir is required.
});
```

`Run()` has 2 parameters (the 2rd one is not required since v0.0.91):

1. `config: Object`

    The config file defines base directory of the server, which is current of `app.js`. There's a `Controller` property that specifies which controller to register. And then ServerHub will try to search and parse under controller file. When you are writing, you may check this document or search under `node_modules/serverhub-mvc/index.d.ts` file along with all your dependecies, which I've already provided the type definitions there.
1. `route?: Function` (callback) (no more required since v0.0.91)

    This function will have one parameter that refers to server route object, you can register custom route rule or ignore certain matches (I've not finished developing that feature).

**Notice**: If you are using macOS or Linux systems like Ubuntu or Debian, then port under 1024 needs root privilege. So you may need `sudo` (or anything like this) to run the `node app.js` command.

## Documents

We've provided documents/tutorials for both [English](https://serverhuborg.github.io/serverhub-mvc/docs/docs.html) and [Chinese](https://serverhuborg.github.io/serverhub-mvc/zh_cn/docs/docs.html)

## Feel Free to Contact

Question us through [serverhub.contact@gmail.com](mailto:serverhub.contact@gmail.com) or tweet to DevChache on [twitter](https://twitter.com/SrMoriaty).

Leave an issue if you find any bugs. But please notice, DO comment, send pull request or anythings like that IN ENGLISH. But I do have a Chinese version of README file under `doc/`, you may check it out. Thank you very much.

If you are willing to receive more information, stories, tutorials and release information, please [subscribe our newsletter with your favorite mail address](mailto:serverhub.contact@gmail.com?subject=serverhub-news-52b3f7de&body=Hello,%20ServerHub!).

## License

MIT

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FServerHubOrg%2Fserverhub-mvc.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FServerHubOrg%2Fserverhub-mvc?ref=badge_large)