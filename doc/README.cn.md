# ServerHub

![](assets/serverhub-compact.png)

项目介绍、技术文档和教程，请访问 [ServerHub](https://devchache.github.io/serverhub-mvc/index.html)（GitHub Pages）。

欢迎阅读我们为所有使用中文的开发者提供的说明文档。

**ServerHub** 同时包含了 MVC 框架和一个相应的 CLI 应用程序。

ServerHub MVC ([serverhub-mvc](https://www.npmjs.com/package/serverhub-mvc)) 是一个轻量的 Nodejs MVC 框架。

其 CLI 部分的介绍，请参见 [serverhub-cli](https://www.npmjs.com/package/serverhub-cli) 或是直接查看我个人仓库列表里的 serverhub-cli。

## 最近更新

你已经可以自定义默认页了，默认页会在无路由匹配时被加载。即当你以 `hostname:926/` 的形式访问时，可以直接按照自己的默认页配置进行。此配置项具有默认值，你可以缺省（以 index.html 为默认页）。

现在，ServerHub 提供了在控制器内连接数据库和使用控制器作用域变量的方式，可以到 Database.md 和 Controller.md 一探究竟。而且 model 和 view 已经可以被自动缓存了，这将会加速你的服务器渲染进程，并有效减少磁盘 IO。所有重要更新都列举在根目录 CHANGELOG.md 内。

## 它能做这些工作

当前，ServerHub 可以配置自定义路由、注册自定义控制器、绑定视图与模型。

下面展示样例目录结构（你可以通过 serverhub-cli 命令行工具的 `serverhub-cli init . -d` 命令来得到下面的目录结构）。

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

然后运行

```bash
node app.js
```

自此，服务器启动（默认在 926 端口运行，这是我挚友的生日）在浏览器中访问“localhost:926”会出现下面的页面：

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
npm init #如果你已经完成了这个操作，就忽略这一步

npm i --save serverhub-mvc
mkdir server && serverhub-cli init server -d #在最后加上 -h 参数之前一定要确定好，因为会清空整个 server 目录
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

## 文档

我为你准备了详尽的文档，虽然目前还在完善中，但是也建议读一读：[英文版](https://devchache.github.io/serverhub-mvc/docs/docs.html和[中文版](https://devchache.github.io/serverhub-mvc/zh_cn/docs/docs.html)。

## 老铁要联系我了？

朝着 [yangzd1996@outlook.com](mailto:yangzd1996@outlook.com) 给我发邮件，或者到 [twitter](https://twitter.com/SrMoriaty) 上问我（你也可以找我要微信或者 QQ 号，LoL）。

如果你发现了任何的 bug，不要犹豫，速到 issue 中提交，我会看到的。但是请注意，虽然我这里提供了中文文档、说明，但不代表你可以用中文来提交。整个项目未来所有与开发相关的文档、代码注释我都会保持英文，因为这样节省精力也助于全球化交流。请**务必全程使用英文**，语法错了不要紧，看得懂。多谢配合！