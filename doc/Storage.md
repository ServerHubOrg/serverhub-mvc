# Storage

Storage is a service.

When we consider file system, it is something really complecated and platform related. Windows has a different way of handling files on the disk, comparing with Linux and other operating systems.

When we talk about scalable web architecture, we always talk about distribed systems. The server, storage and even database are provided by different computers and servers, which is physical distributed.

In order to virtualize file system for ServerHub, storage is designed to be a service layer.

## HTTP Method API

Storage provide several API allowing upper layers to access to files. Avaliable APIs are:

- GET API
- PUT API
- DELETE API
- UPDATE API
- INFO API

### Types

```ts
declare class FileStorage {
    set Value(val: string);
    get Value(): string;
    set ContentType(val: string);
    get ContentType(): string;
    constructor(val: string, type = 'text/plain');
}

declare class URI{
    set Value(val: string);
    get Value(): string;
}
```

### GET API

```typescript
declare function Get(uri: URI, contentType: string): FileStorage;
```

### PUT API

// TODO: HTTP Method API is not well designed yet. Use Service API instead.

## Service API

```ts
declare interface FileChunk{
    From: number; // must be greater or equal to 0
    Length?: number; // must be positive, not required
}
```

### `GetFile()`

```typescript
declare function GetFile(path: string): string; // "controller/index.js"
declare function GetFile(path: string, basedir: string): string; // "index.js" "controller"
declare function GetFileChunk(path: string, chunk: FileChunk): string;
declare function GetFileChunk(path: string, chunk: FileChunk, basedir: string): string;
```

`Service.GetFile()` provides reading accessibility to local files. It is strongly suggested to check for file size before directly fetching file content on `GetFileChunk()` API call.

1. GetFile()

    `GetFile(...)` methods return complete file content if the file is correct and avaliable. And they return "" as empty content if the file is empty. When the target file does not exists, there will not be an error thrown. But the methods will return `null` to the calling function instead.
1. GetFileChunk()

    `GetFileChunk(...)` methods return partial file content if the file is avaliable. Else they returns `null`.

    According to the `FileChunk` interface definition, if both `From` and `Length` are passed in, storage service will read the file from the index specified by `From` and stop when pointer equals to `From + Length - 1`. When `Length` is missing, storage service will return content from index specified by `From`.

    If the `From` as well as `From + Length - 1` exceeded the file length, there will be an error thrown.

**Note**: All `GetFile()` functions are synchronized function call.

### `PutFile()`

```typescript
declare function PutFile(path: string, content: string, fill: boolean):void;
declare function PutFile(path: string, content: string, fill: boolean, basedir: string): void;
declare function PutFileAsync(path: string, content: string, fill: boolean, callback: (error: Error) => void): void;
declare function PutFileAsync(path: string, content: string, fill: boolean, callback: (error: Error) => void, basedir: string): void;
```

`Service.PutFile()` provides writing accessibility to local files. It is better to check for avaliablility of target file before directly writing file content on `PutFileAsync()` API call.

1. PutFile()

    The method parameter `fill` is a flag that tells storage service whether to create all path directories to the target file or not.

    If writing to storage failed, there will be an error. This usually happens when there is already a file exist.

1. PutFileAsync()

    These two methods runs asynchronously. There will also be an error when file already exists (before invoking callback function).

### `PatchFile()`

```typescript
declare function PatchFile(path: string, content: string, after: number):void;
declare function PatchFile(path: string, content: string, after: number, basedir: string): void;
declare function PatchFileAsync(path: string, content: string, after: number, callback: (error: Error) => void): void;
declare function PatchFileAsync(path: string, content: string, after: number, callback: (error: Error) => void, basedir: string): void;
```

`Service.PatchFile()` provides writing accessibility to local files. It is better to check for avaliablility of target file before directly updating file content on `PatchFileAsync()` API call.

If there is no such a path (file), there will be an error thrown.

1. PatchFile()

    If updating files failed, there will be an error, eg. file is been occupying by other process. If you specify an `after` parameter, the value must be smaller than current file length - 1. `After` parameter let storage service to append content after specified index.

1. PatchFileAsync()

    These two methods runs asynchronously.

### `DeleteFile()`

```typescript
declare function DeleteFile(path: string):void;
declare function DeleteFile(path: string, basedir: string): void;
```

`Service.DeleteFile()` allows you to delete local files.

If there is no such a path (file), there will be an error thrown.

If deleting file failed, eg. file been using by other process, there will be an error.

### `FileInfo()`

```typescript
declare function FileInfo(path: string): FileInfo;
declare function FileInfo(path: string, basedir: string): FileInfo;
```

`Service.FileInfo()` let you get basic information of the target file.

If there is no such a path (file), there will be an error thrown.

The file info is defined in the interface below:

```ts
declare interface FileInfo{
    FileName: string;
    Size: string; // byte
    Path: string; // Physicall path
    LogicalPath: string;
    Extension: string;
}
```