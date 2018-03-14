# `this.View` Function Usage

`this.View` function returns the model of the corresponding controller model.

```js
let context = this.View();
```

If you want to make some changes on the controller model, use:

```js
context.foo = 'ServerHub';
return context;
```

ServerHub controller actions return an Object as context model and will render views with data contained in the context.

So, if you made any changes, do remember to return it.