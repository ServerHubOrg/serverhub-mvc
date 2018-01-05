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
02 | 01 | 01 | [Controller not registered](#sh020101)
02 | 01 | 02 | [Default controller not found](#sh020102)
02 | 07 | 01 | [AppStart method not found](#sh020701)

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