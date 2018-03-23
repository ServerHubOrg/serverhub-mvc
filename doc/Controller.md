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

### Complete list of supported controller scope variables

Usage of these variables are avaliable at `doc/variables/{VariableName}.md`. Some variables that have primitive types like `string`, `number` etc. (as well as some reference to vanilla Node.js implementation) will not be doced, FYI.

- `this.View` **_Function()_** Returns the corresponding model file.
- `this.Runtime` **_Object_** Contains bunch of other runtime features.
    1. `this.Runtime.DBProvider` **_Object_** A reference to initialized database provider instanced (default MySQL).
    1. `this.Runtime.FileHelper` **_Object_** A reference to FileHelper object.
    1. `this.Runtime.WAIT` **_boolean_** Force to hold connection until asynchronous operations done.

- `this.System` **_Object_** Provide bunch of readonly constants inside ServerHub instance.
    1. `this.System.Version` **_string_** ServerHub version.
    1. `this.System.NodeVersion` **_string_** Node.js version.
    1. `this.System.Platform` **_string_** Platform information (win32, linux, etc.).
    1. `this.System.Hardware` **_Object_** Bunch of information about hardware.
        - `this.System.Hardware.TotalMemory` **_number_** Installed memory size (byte).
        - `this.System.Hardware.FreeMemory` **_number_** Free memory size (byte).
        - `this.System.Hardware.NetworkInterfaces` **_Object_** Returns interfaces that have been assigned a network address.
    1. `this.System.Die` **_Function(exit_code)_** Exit current ServerHub process.

## Actions in Controller

Actions are methods that been invoked when the HTTP request matches a certain route path. And it handles the request and operates on the response. In this chapter, we will discuss about actions in controller and help you learn more about ServerHub controllers.

### How to compose an action

```js
index: function (request, response, method){
    // do something
    return this.View();
}
```

See, this is a very simple 'index' action. You need to declare the action as a function member of an object and return the object as the controller instance. One more thing, as we've mentioned a lot, you should always use 'this' pointer while referencing controller scope variables.

There are three parameters and they are all required. If you want to manually control server response by calling methods like `res.write()`, then ServerHub will ignore default render process, which means:

```js
index: function (request, response, method){
    response.write('Hello, XWZ');
    return this.View();
}
```

will only output 'Hello, XWZ' and the return value of 'index' action gonna be ignored.

The `request` parameter is the vanilla Node.js request (aka `IncomingMessage` object) (at version 0.0.7). But the `response` parameter is a virtual `ServerResponse` object. Several methods and properties are wrapped on that object, which are not exactly the same as the original one. Read the document before invoking. `Method` is a string that tells the current HTTP method (like GET, POST, etc).

### Action name convention

Action names are all written in lower cases. Characters from 'a' to 'z', with numbers and '_' (underscore) are allowed. There are several reserved action names that you cannot use: Runtime, System, Console, View.

The best practice are using single words as action names, and verbs are prefered. An action name with more 20 characters are pretty bad. And you should know that in later versions of ServerHub, maybe there will be an limitation of action name length, which might not run functional normally with your old-fashioned code.

## About Syntax

If you use some lint tools, ServerHub's controller file may report syntax errors. It could tell that "_return statement outside function_". But actually they are valid **partial** JavaScript files.

Controllers scripts are all **functions**, they are not independent JavaScript files. When you try to execute controller files directly, it is not gonna work.

Here is an example. We have a controller file like this (`home.js`):

```js
"use strict";

return {
    index: function(req, res, method) {
        return this.View();
    }
}
```

If you treat this `home.js` as a plain JavaScript file, there should be curly braces surrounding the return statement. Check this:

```js
"use strict";

function (){
    return {
        index: function(req, res, method) {
            return this.View();
        }
    }
}
```

Now, it is an absolute JavaScript file. 

**But, do you remember that our controllers are all _functions_**? What does this mean? Your whole controller file is a function, and it has invisible boundries which are curly braces. So, if we manually add function definition to controller file, the loaded controller will be like:

```js
function (){
    "use strict";

    function (){
        return {
            index: function(req, res, method) {
                return this.View();
            }
        };
    }
}
```

As you can see, there is a redundant pair of function braces that should be removed. And this is why we call ServerHub controllers "partial JavaScript files".
