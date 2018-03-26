# Changelog

## `0.0.97` March 26, 2018

### Add

- `AsyncOperationTimeout` configuration property added. Please see doc/instance.run-config for more details.
- Ignorable route rules are now supported. You can use an array of exception rules to ignore them. See doc/route to learn more.

## `0.0.96` March 23, 2018

### Add

- `this.Runtime.WAIT` signal.
- id and search string contained during dispatch.

## `0.0.95` March 22, 2018

### Add

- Custom route rules can use prefix. Last slash can be ignored.

### Fix

- Controllers with empty response may cause render function not working.

## `0.0.94` March 21, 2018

### Patch

- Fix JSON string format issue.

## `0.0.93` March 21, 2018

### Add

- Full support for custom 404 error page.

## `0.0.92-patch-1` March 18, 2018

### Update

- Fix issue of unable to dispatch registered controllers in v0.0.92.

## `0.0.92` March 18, 2018

### Add

- Support default page configuration.

### Update

- Allow omit controller/model/view path in your website now. pretty easy to start a static website.

## `0.0.91` March 16, 2018

### Update

- Update entry point, simplified parameters. Thanks to Yuyang Mao's advice.

## `0.0.9` March 16, 2018

### Add

- Auto caching feature for views.

## `0.0.8` March 16, 2018

### Add

- Auto caching feature for models. This will reduce disk IO on server-side.

## `0.0.7` March 15, 2018

### Add

- Wrap ServerResponse to avoid accidently crash ServerHub.
- Fixed multiple document mistakes.

## `0.0.6` March 14, 2018

### Add

- MySQL database support in controllers

## `0.0.5` March 13, 2018

### Add

- Controller scope variable feature