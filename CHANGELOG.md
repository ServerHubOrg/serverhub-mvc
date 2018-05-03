# Changelog

## `1.0.8` May 3, 2018

### Add

- Support `async` plugins.

### Fix

- Fix typescript signature for plugin interface.

### Update

- Update plugins execution logic. Failed plugins will no longer block further request handling.
- Old changelogs are placed in `changelog-archive` directory.

## `1.0.7` April 24, 2018

### Fix

- Fix cache module issues.

## `1.0.6` April 24, 2018

### Add

- Support TLS and HTTPS connection.

### Fix

- Fix wrong MIME type for `image/svg+xml`.

## `1.0.5` April 12, 2018

### Add

- Support "." and "-" in controller and action names.

### Update

- Route rule updated, see docs later.

## `1.0.4` April 9, 2018

### Add

- Test tools integration (Mocha and Coveralls)
- Travis-CI
- Fossa

### Fix

- Controller and port number bugs.

## `1.0.3` April 8, 2018

### Add

- Module style controller scripts support (with legacy style continues).
- Module loader for all server scope scripts (workaround for legacy controller style).

## `1.0.2` April 4, 2018

### Add

- Range request support

### Fix

- Error transferring some files when too large.

## `1.0.1` March 28, 2018

### Fix

- Wrong value of CacheInfo generation.
- Wrong MIME type for `.mp4` files.

### Update

- Buffer stream feature for large file transmitting.

### Add

- MIME type for `.flv` and `.avi` files.

## `1.0.0-beta` March 28, 2018

### Fix

- Start up fails when no plugin folder found.

### Add

- Multiple port number support added.


## `1.0.0-alpha` March 27, 2018

### Add

- Full support for plugins before route start and after routed. Now you can easily write your own plugins to handle every possible requests.