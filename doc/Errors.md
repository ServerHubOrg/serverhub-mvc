# Errors in ServerHub

All errors can be sorted by error code, which are listed below:

## Structure

The error code are made of two parts:

- Specification: usually two characters.
- Code serial number: usually 6 numbers.

Here is an example:

```plain
error SH010102: Controller path 'home' does not exist on 'controller/'.
```

For the 6 numbers, they are divided into 3 groups.

1. `01`: Category.

    Possible categories are:
    - Compile time errors, aka ct errors. The server is not started yet, and functions such as registers cannot intial components of the server correctly.
    - Runtime errors, aka rt errors. The server is started correctly, but an error or unhandled exception triggered the mechanism. Possible errors of this category can be network errors, database errors etc.
1. `01`: Type.

    Type are more specific than categories. And each type contains severial unique errors.
1. `02`: Unique

    Unique errors shows the detailed errors during runtime or compile time. According to the error code, you can easily find the COE.

## Preview

Category | Type | Unique | Cause
:-:|:-:|:-:|:--
01 | 01 | 01 | [Controller name not valid](#sh010101)
01 | 01 | 02 | [Controller path not valid](#sh010102)
01 | 01 | 03 | [Controller cannot be resolved](#sh010103)
01 | 02 | 01 | [Route rule not valid](#sh010201)
02 | 01 | 01 | [Controller not registered](#sh020101)
02 | 01 | 02 | [Default controller not found](#sh020102)
02 | 07 | 01 | [AppStart method not found](#sh020701)
02 | 07 | 02 | [Allocated cache size exceeded limitation](#sh020702)
02 | 07 | 03 | [Content pointer index overflow](#sh020703)
02 | 07 | 04 | [File already exists](#sh020704)
02 | 07 | 05 | [File path invalid](#sh020705)
02 | 07 | 06 | [File not exist](#sh020706)
02 | 07 | 07 | [Resource not cacheable](#sh020707)

## Compile Time Errors (CTE) (SH01____)

There are four types of ct errors:

1. Controller (SH0101__)
1. View (SH0102__)
1. Router (SH0102__)
1. Model (SH0102__)

### Controller (SH0101__)

Controllers in ct category is quite normal. If you misspell the name of or path to the controller file, error of this type may appear.

#### SH010101

<span id='sh010101'></span>
***Controller name not valid***

A controller name with other extension instead of '.js' are not valid, and they may cause this error. Simply change to '.js' and check the controller content may solve the problem.

#### SH010102

<span id='sh010102'></span>
***Controller path not valid***

A controller path does not match any files in the content directory. Check the given controller name and try initialize again.

#### SH010103

<span id='sh010103'></span>
***Controller cannot be resolved***

The controller file is not able to be resolved. May be you used a `const controller = ...` expression?

#### SH010201

<span id='sh010201'></span>
***Invalid route rule detected***

The custom route rule defined in serverhubinstance.Run() method is not supported.

## Runtime Errors (RTE) (SH02____)

There are five types of runtime errors:

1. Controller
1. View
1. Model
1. Router
1. Network
1. Database
1. Server

### Controller (SH0201__)

#### SH020101

<span id='sh020101'></span>
***Controller not registered***

Did you forget to register the corresponding controller script?

#### SH020102

<span id='sh020102'></span>
***Default controller not found***

There is not default controller, user cannot get access to '/' on your site.

### Server (SH0207__)

#### SH020701

<span id='sh020701'></span>
***AppStart method not found***

Did you forget to implement and pass appstart as a parameter to 'serverhub.Run()'?

#### SH020702

<span id='sh020702'></span>
***Allocated cache size exceeded limitation***

According to Cache document, ServerHub allows maxmium cache size to be 20% of physical installed memory. So it's possible that you passed a configuration object to serverhub.Run() method with a MaxCacheSize that is too large.

#### SH020703

<span id='sh020703'></span>
***Content pointer index overflow***

In storage service, service APIs with 'chunk' names may cause this error. The FileChunk interface has a From (number) and a Length (number) property. So if From or From + Length is larger than file length, this error may be thrown.

#### SH020704

<span id='sh020704'></span>
***File already exists***

When using service API "PutFile()", if a file exists, this error will be thrown. See doc/Storage for details.

#### SH020705

<span id='sh020705'></span>
***File path invalid***

Every service API requires a file path (as well as a basedir parameter if necessary). But if both path and basedir parameters are undefined or null, this error will be thrown.

#### SH020706

<span id='sh020706'></span>
***File not exists***

When using service API "GetFile()", "PatchFile()", if a file not exists, this error will be thrown. See doc/Storage for details.

#### SH020707

<span id='sh020707'></span>
***Resource not cacheable***

Check doc/Cache for detailed information. This is usually caused by an invalid or uncacheable resource URI.