![](assets/serverhub-compact.png)

项目介绍、技术文档和教程，请访问项目主页 [serverhub.io](https://serverhub.io/)。

[![Build Status](https://travis-ci.org/ServerHubOrg/serverhub-mvc.svg?branch=master)](https://travis-ci.org/ServerHubOrg/serverhub-mvc) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FServerHubOrg%2Fserverhub-mvc.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FServerHubOrg%2Fserverhub-mvc?ref=badge_shield) [![Coverage Status](https://coveralls.io/repos/github/ServerHubOrg/serverhub-mvc/badge.svg?branch=master)](https://coveralls.io/github/ServerHubOrg/serverhub-mvc?branch=master)

欢迎阅读我们为所有使用中文的开发者提供的说明文档。

**ServerHub** 同时包含了 MVC 框架、一个相应的 CLI 应用程序和一个紧跟最新版本 ServerHub 特性的模板。

ServerHub MVC ([npm/serverhub-mvc](https://www.npmjs.com/package/serverhub-mvc)) 是一个轻量的 Node.js MVC 框架。

其 CLI 部分的介绍，请参见 [npm/serverhub-cli](https://www.npmjs.com/package/serverhub-cli) 或是直接查看 [ServerHubOrg 仓库列表](github.com/ServerHubOrg)里的 serverhub-cli。

## 它能做这些工作

当前，ServerHub 已经可以做不少事情了。不论你是想启动一个静态资源服务器还是搭建一个动态数据的 Web 服务，ServerHub 都能提供充分的支持。目前，大多数开发者会使用 ServerHub 来完成：

1. 静态服务器：支持文件下载和缓存。你最常使用的资源会被缓存在内存当中。一旦本地资源改变，ServerHub 会自动刷新缓存记录以确保处于最新状态。
2. 动态网站：原生支持 MVC 架构。有了自定义路由，所有的请求都可以被准确无误转发到相应的处理程序中。
3. WebAPI：设计灵感来自于 [ASP.NET](https://www.asp.net/)。ServerHub 可以用来为你的各种应用程序提供 WebAPI 服务。
4. Proxy*：佛曰不可说。

## 最近更新

`v1.1.0` 版本开始，默认情况下会对开启多端口监听（至少一个是 HTTPS 方式）的网站启用流量重定向。`v1.0.8` 版本引入了对异步插件的支持，但是过分耗时的异步插件会影响到整体响应时间。此版本之后，单个插件的错误不再会影响到整体的执行，增强了容错性和稳定性。自 `v1.0.6` 开始，TLS 已经被纳入支持范围，你可以使用自主签名的证书（可能被浏览器标识为不被信任的连接）或第三方颁布的证书（详情阅读文档）。近期添加了模块化的 controller 创作风格支持。此后你将可以同时使用模块法和传统的脚本法来使用。相关注意事项将会更新在 controller 的文档页面，请移步阅读。

所有重要更新都列举在根目录 CHANGELOG.md 内。

## 案例

DevChache 的个人网站 [meetdong.com](https://www.meetdong.com) 就是使用 ServerHub 架设的。首页由 Controller 来渲染，页面资源（脚本、样式表）则由无路由匹配的缓存提供（由于经过 Cloudflare 的 CDN，所以请求头部被重写过）。他会将 ServerHub 的功能逐一利用起来，用此网站进行一些展示。

## 安装

```bash
npm i --save serverhub-mvc
```

或者说如果你想要运行我们提供的 template，那就按顺序执行

```bash
npm i -g serverhub-cli
cd path/to/you/workspace/
serverhub-cli init [自定义项目名]
```

**注意**：某些系统中可能需要使用 `sudo` 命令来安装 CLI 工具。

## 调用方法

请在你的启动脚本中配置：

```js
const serverhub = require('serverhub-mvc');

serverhub.Run({
    BaseDir: __dirname // BaseDir is required.
});
```

`Run()` 方法需要两个参数（自 0.0.91 开始，第二个参数不再是必须的，详请阅读 route 相关文档）

1. `config`

    此参数中定义了一些诸如服务器根地址、Web 根目录、controller 目录等等信息的 config 配置文件。它的 `Controller` 属性指定了服务器需要解析和加载的控制器文件。当你写这个 config 的时候，请参照文档或者到你的依赖项中找到 `node_modules/serverhub-mvc/index.d.ts` 文件，其中已经用 TypeScript 类型声明做好了使用的准备，非常方便你使用 IntelliSense。
1. `route` （运行时执行回调）（0.0.9 及以前的版本必须加上此参数，否则无法启动）

    这个函数接受一个参数（必须），此参数指向服务器所使用的 route 对象，你可以在此回调中写注册路由或者忽略特定路由的一些语句（特定路由仍在开发中）。

**特别提醒**：如果你使用的是 macOS 或 Ubuntu、Debian 一类的操作系统，那么对于小于（等于）1024 的端口号，需要通过 `sudo` 提权后再执行 `node app.js` 命令。

## 文档

我们计划为开发者提供详尽的文档，虽然目前还在完善中，但是也建议读一读：[英文版](https://ServerHubOrg.github.io/serverhub-mvc/docs/docs.html)和[中文版](https://ServerHubOrg.github.io/serverhub-mvc/zh_cn/docs/docs.html)。

## 老铁要联系我们了？

朝着 [serverhub.contact@gmail.com](mailto:serverhub.contact@gmail.com) 给我们发邮件，或者到 [twitter](https://twitter.com/SrMoriaty) 上问 DevChache。

如果你发现了任何的 bug，不要犹豫，速到 issue 中提交，我们会看到的。但是请注意，虽然这里提供了中文文档、说明，但不代表你可以用中文来提交。整个项目未来所有与开发相关的文档、代码注释我都会保持英文，因为这样节省精力也助于全球化交流。请**务必全程使用英文**，语法错了不要紧，看得懂。多谢配合！

为了向所有人提供更及时和迅速的 ServerHub 资讯，我们开通了邮件订阅功能，点击[这个链接](mailto:serverhub.contact@gmail.com?subject=serverhub-news-52b3f7de&body=你好啊，ServerHub！)并发送邮件之后，你将会第一时间收到 ServerHub 的相关内容。包括教程、文档、博客甚至未来的视频资源！

## 开源许可
MIT

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FServerHubOrg%2Fserverhub-mvc.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FServerHubOrg%2Fserverhub-mvc?ref=badge_large)