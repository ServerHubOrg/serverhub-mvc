![](assets/serverhub-compact.png)

项目介绍、技术文档和教程，请访问 [ServerHub](https://serverhuborg.github.io/serverhub-mvc/index.html)（GitHub Pages）。

[![Build Status](https://travis-ci.org/ServerHubOrg/serverhub-mvc.svg?branch=master)](https://travis-ci.org/ServerHubOrg/serverhub-mvc) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FServerHubOrg%2Fserverhub-mvc.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FServerHubOrg%2Fserverhub-mvc?ref=badge_shield) [![Coverage Status](https://coveralls.io/repos/github/ServerHubOrg/serverhub-mvc/badge.svg?branch=master)](https://coveralls.io/github/ServerHubOrg/serverhub-mvc?branch=master)

欢迎阅读我们为所有使用中文的开发者提供的说明文档。

**ServerHub** 同时包含了 MVC 框架和一个相应的 CLI 应用程序。

ServerHub MVC ([serverhub-mvc](https://www.npmjs.com/package/serverhub-mvc)) 是一个轻量的 Nodejs MVC 框架。

其 CLI 部分的介绍，请参见 [serverhub-cli](https://www.npmjs.com/package/serverhub-cli) 或是直接查看我个人仓库列表里的 serverhub-cli。

## 例子

我的个人网站 [meetdong.com](https://www.meetdong.com) 就是使用 ServerHub 架设的。首页由 Controller 来渲染，页面资源（脚本、样式表）则由无路由匹配的缓存提供（由于经过 Cloudflare 的 CDN，所以请求头部被重写过）。我会将 ServerHub 的功能逐一利用起来，用此网站进行一些展示。

## 最近更新

最新版本添加了模块化的 controller 创作风格支持。此后你将可以同时使用模块法和传统的脚本法来使用。相关注意事项将会更新在 controller 的文档页面，请移步阅读。

所有重要更新都列举在根目录 CHANGELOG.md 内。

## 它能做这些工作

当前，ServerHub 可以配置自定义路由、注册自定义控制器、绑定视图与模型。

下面展示样例目录结构（你可以通过 serverhub-cli 命令行工具的 `serverhub-cli init [自定义项目名]` 命令来得到下面的目录结构）。

```plain
demo_directory/
 |- controller/
 |   |- home.shc.js // 如果你要使用 v1.0.3 之后的新控制器语法，则需要加上“.shc”
 |- model/
 |   |- home.json
 |- view/
 |   |- home.html
 |- www/
 |   |- global.css
 |   |- global.js
 |- app.js
```

然后运行

```bash
node app.js
```

自此，服务器启动（默认在 926 端口运行）在浏览器中访问“localhost:926”会出现下面的页面：

![](assets/demo_homepage.png)

这些内容被默认路由 `/home/index/` 所匹配，第一行的“world”一词由 `home.json` 模型定义，并由 `home.js` 注册的控制器来渲染。下面那行蓝色的句子是由 `www/` 目录下的 `global.js` 注入页面的。

## 安装

```bash
npm i --save serverhub-mvc
```

或者说如果你想要运行我给的 demo，那就按顺序执行

```bash
npm i -g serverhub-cli
cd path/to/you/workspace/
serverhub-cli init [自定义项目名]
```

## 调用方法

请在你的启动脚本中配置：

```js
const serverhub = require('serverhub-mvc');

serverhub.Run({
    BaseDir: __dirname // BaseDir is required.
});
```

`Run()` 方法需要两个参数（自 0.0.91 开始，第二个参数不再是必须的，请阅读 route 相关文档）

1. config

    此参数中定义了一些诸如服务器根地址、Web 根目录、controller 目录等等信息的 config 配置文件。它的 `Controller` 属性指定了服务器需要解析和加载的控制器文件。当你写这个 config 的时候，请参照我给出的文档或者到你的依赖项中找到 `node_modules/serverhub-mvc/index.d.ts` 文件，其中我已经用 TypeScript 类型声明做好了使用的准备，非常方便你使用 IntelliSense。
1. route （运行时回调）（0.0.9 及以前的版本必须加上此参数，否则无法启动）

    这个函数接受一个参数（必须），此参数指向服务器所使用的 route 对象，你可以在此回调中写注册路由或者忽略特定路由的一些语句（特定路由仍在开发中）。

特别提醒：如果你使用的是 macOS或 Ubuntu、Debian 一类的操作系统，那么对于小于（等于）1024 的端口号，需要通过 `sudo` 提权后再执行 `node app.js` 命令。

## 文档

我计划为开发者提供详尽的文档，虽然目前还在完善中，但是也建议读一读：[英文版](https://ServerHubOrg.github.io/serverhub-mvc/docs/docs.html)和[中文版](https://ServerHubOrg.github.io/serverhub-mvc/zh_cn/docs/docs.html)。

## 老铁要联系我了？

朝着 [yangzd1996@outlook.com](mailto:yangzd1996@outlook.com) 给我发邮件，或者到 [twitter](https://twitter.com/SrMoriaty) 上问我（你也可以找我要微信或者 QQ 号，LoL）。

如果你发现了任何的 bug，不要犹豫，速到 issue 中提交，我会看到的。但是请注意，虽然我这里提供了中文文档、说明，但不代表你可以用中文来提交。整个项目未来所有与开发相关的文档、代码注释我都会保持英文，因为这样节省精力也助于全球化交流。请**务必全程使用英文**，语法错了不要紧，看得懂。多谢配合！

## 开源许可
MIT

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FServerHubOrg%2Fserverhub-mvc.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FServerHubOrg%2Fserverhub-mvc?ref=badge_large)