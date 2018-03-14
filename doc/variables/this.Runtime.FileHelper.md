# `this.Runtime.FileHelper` Object Usage

The FileHelper is a static class which provides simple file access operations for controller actions. Please remember, you should never initialize the FileHelper with calling its constructor.

## Properties


### `ServerDirectory: string`

Provide readonly access to server working directory.

### `WebRoot: string`

Provide readonly access to server web directory. eg: `www/`

### `NodeFS: Object`

This is just a reference to original Node.js 'fs' module.

### `NodePath: Object`

This is just a reference to vanilla Node.js 'path' module.

## Methods

Please notice: all methods should be used statically, if you try to call FileHelper's constructor, there will be an error thrown.

### `static ResolveWebPath(...string): string`

Resolve virtual web path to actual physical path.

### `static ResolveServerPath(...string): string`

Resolve virtual server path to actual physical path.