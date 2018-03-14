# Controller

Controllers are very important and extremely basic. Routed path will dispatch actions defined in each controller. In this article, we will discuss about controller composing and other essential parts you need to notice.

## Controller Composing

Here is a good example of `home.js` custom controller:

```js
"use strict";

return {
    index: function (req, res, method) {
        return this.View();
    },
    primary: function (req, res, method) {
        var context = this.View();
        context.name = 'Ziyuan';
        return context;
    }
};
```

Controller files are plain but special JavaScript files. you must return an object providing **action functions** to ServerHub. So when ServerHub dispatching after routing, your custom controller actions can be invoked.

There are three primary paramters of a controller action method: _request_, _response_ and _method_. They are all required.

- **_request_** refers to the *IncomingMessage* of Node.js.
- **_response_** refers to the *ServerResponse* object of the request.
- **_method_** is a string and can be the following: GET, POST, PATCH, UPDATE, DELETE and PUT.

## Compile-time and Static Controllers

If you modify any controller files while ServerHub running, check if your browser will show you the latest modifications. There will be no effect when you refresh the web pages. ServerHub loads and registers controllers when the application first starts. And it will never automatically update these files. Not like views and models, ServerHub always cache and renew cached content for them. So that ServerHub can be both fast and stable.

So, never try to change controller files during ServerHub running.

## Controller Scope Variables

There are several variables that can be accessed inside controller actions. In order to use them, you must explicitly use pointer **_this_** as a reference to the controller instance. Or, there will be an error message displayed.

You are suggested to use **arrow functions** that accessible since ECMAScript 2015. Or, you may use some workaround to access to those variables (closure or something else).