Thanks for help contributing to ServerHub MVC. This document will help us produce better code and work better together.

## During developing
### Editor
You may use your favorite editor when developing. But the suggested editor is Visual Studio Code. The `.vscode/` directory contains launch settings and suggested settings for ServerHub MVC. So do not modify/remove those settings please.

### Leading Comment Block
In all TypeScript files, please always add a basic introduction comment block as the following example:

```typescript
/**
 * ServerHub Core Module
 * 
 * Core functions and variables injection support.
 *
 * Zhongdong Yang, yangzd1996@outlook.com
 * April 10, 2018
 */
```

### Function Description
The following example shows a good function example:

```typescript
/*
 * Render error message with Error object.
 */
function RenderError(error: Error): string {
    // ...
}
```

### Indent
All TypeScript/HTML/CSS files should have **4 whitespaces** as indent instead of 1 tab or 2 spaces.

## Commit Changes
A commit change message include two parts and they are seperated by ":". Here is a list of common message types:

- `Add: new features`
- `Update: update readme.md`
- `Doc: update documents (gh-pages)`
- `Fix: issue#xxx fixed`
- `Test: update test scripts under test/`

Try to let one commit only do one single thing or a group of similar things to keep the commit message simple and readable. But if you've done several different type of things, use combined commit message:

`Add/Test: add multiple route rule support and add its test scripts`

## Pull Requests
Pull requests are expected to be have detailed descriptions so that maintainers can merge your request ASAP.

Thank you! Have a good day!
