# Cache

Cache technology is used in two aspect on ServerHub. And it is designed to provide faster and reliable server response for static resources (such as JavaScript or CSS stylesheet files) or relatively not frequently changed data (such as blog data or posted articles). Also, when rendering views, we want it to be extremely fast. IO and database queries are two major aspect that slow our application. In order to reduce the time cost and improve IO performance, we have to cache those stuffs.

We distinguish caching in two types:

- HTTP Cache
- Local view and model hot cache

As ServerHub's core feature, we introduced **RCS (Resource Caching Service)** to controll and manage caching.

## What Is Cacheable

Any resource URI with query/search string is not cacheable. We have the following cacheable examples:

```text
/path/to/resource/name.extension
/path/to/resource/name.extension?
/path/to/resource/name_with_no_extension
/name.extension?
/name.extension
```

Uncacheable resources:

```text
/path/to/resource/name.extension>
/path/to/resource/name.extension?search=query
/path/to/resource/name_with_no_extension#
/path/to/resource/name_with_no_extension?search=query
/name.extension?search=query
/name.extension"
```

All forms of invalid URIs are not cacheable.

## RCS

For the early versions of ServerHub, RCS only support request path that does not match any specific route rules (which are generally static resources). Later, a fully support of dynamic resource caching will be introduced to RCS when it is well-designed and fully implemented (See Task #CACHE01).

Sometimes, we have resources that we are not willing to cache at all. How to do that? See "RCS Ingore Rules" for details.

### How Is Data Cached in RCS

Every resource is cached as an object in RCS:

```json
{
    "key":{
        "content-type":"(string)",
        "etags":"(string)", // eg: 3fc52afd3g
        "cache":{}, // the content of the file
        "date-time":1515356241210,
        "expires": 6000,
        "weight":1 // the weight of the resource among all the queries
    }
}
```

`key` refers to resource URI. When one request hit a specific cached resource, then the `key` value is pointed to the `path` value of the request.

### How RCS Controlls Caching

RCS controlls resource caching. As it is mentioned in task #CACHE01, developers currently cannot get access to RCS instance directly. RCS uses the routed result to distinguish static and dynamic caching. And when there is no route rule matched, RCS regards the resource as a static one and try to hit the cache. When `key` exists in cache, corresponding content will be written to response and finish the query. While no `key` exists, RCS tries to read file from disk or storage service and writes content to cache a new item.

When it comes to dynamic resources, how can developers controll what to cache? Later, developers can get access to RCS reference and add, delete, update a cached dynamic resource. Thus, RCS or the server will never manage developer controlled cache unless it exceeded the limitation.

For hot cache (view and model files), there is something different. These files are stored on local disk. Every read operation may reduce IO performance, so it is essential to cache all those files every time the server starts.

But what will happen when the models or views are updated after server started? How to update them without rebooting server? RCS listens to file changes in view and model directories based on user configurations. And once file changed in those directories, RCS will read the file and update cached files. So, no need to reboot server after updating view and model files.

### What Will Happen If Cache Size Exceeded Limitation

If the exception occurs while ServerHub starting, there will be an error thrown and ServerHub will terminate immediately. But if it occurs while ServerHub running, and with the growth of dynamic resources, RCS has to unload some files that have lower `caculated weight`. And that is called **WCS**.

## When to Cache

You need to know, the following content is written based on static resources and cannot be applied to dynamic content or hot caching.

When a request came in from remote client, router matches with rules and when there is no match, it comes to RCS.

### Cache Not Exists in RCS

This usually happens when the resource is being accessed for the first time. Firstly, RCS read the file and write it to the ServerResponse object. After that, RCS create a new entry with `key` assigned to `path` value of the request object. `etags` of both response object and the cache entry will be set to a random string made with hexadecimal characters. `expires` properties are usually 120 (delta-seconds). At this time, ServerHub assigns 1 to `weight` property. The last step, current date and time in **seconds** will be assigned to `date-time` property.

What about cached content? There are two properties that describes the cached resource: its type and content.

`content-type` is set to a special value according to the resource type. For example: .js file will have "application/js" as its `content-type` property value. Detailed type list are defined in `lib/core/content-type.ts` source file.

### Cache Avaliable

This situation happens most of the time. RCS will not read through Storage module at all. Instead, it will find corresponding resource entry from cache and write it to the ServerResponse object as well as a modification on the HTTP response header.

Now, let's look deeper under the hood. First of all, RCS checks the conditional request headers such as `If-Match`. If it is equal to `etags` in cache, then RCS treat the request as a active cache, and will return an empty response. Client, such as browsers may not need to download the resource again. See the tables below to get more information.

Here is corresponding response when meet conditional request:

Table 1: `If-Match`/`If-None-Match`

<table>
    <thead>
        <tr>
            <th colspan=3>Request</th>
            <th colspan=3>Response</th>
        </tr>
        <tr>
            <th>Condition</th>
            <th>Condition Value</th>
            <th>HTTP Method</th>
            <th>Etags</th>
            <th>Response Code</th>
            <th>Note</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>If-None-Match</td>
            <td>"3f4ac46e3d"</td>
            <td>GET/HEAD</td>
            <td>"3f4ac46e3c" (True)</td>
            <td>200</td>
            <td>Return resource as response with "Cache-Control", "Content-Location", "Date", "Etag", "Expires" and "Vary".</td>
        </tr>
        <tr>
            <td>If-None-Match</td>
            <td>"3f4ac46e3d"</td>
            <td>GET/HEAD</td>
            <td>"3f4ac46e3d" (False)</td>
            <td>304 (Not modified)</td>
            <td>Return empty response with "Cache-Control", "Content-Location", "Date", "Etag", "Expires" and "Vary".</td>
        </tr>
        <tr>
            <td>If-None-Match</td>
            <td>"3f4ac46e3d"</td>
            <td>PUT, etc.</td>
            <td>"3f4ac46e3d" (False)</td>
            <td>412 (Precondition failed)</td>
            <td>Return empty response.</td>
        </tr>
        <tr>
            <td>If-Match</td>
            <td>"3f4ac46e3d"</td>
            <td>GET/HEAD</td>
            <td>"3f4ac46e3d" (True)</td>
            <td>200</td>
            <td>Return resource as response with "Cache-Control", "Content-Location", "Date", "Etag", "Expires" and "Vary".</td>
        </tr>
        <tr>
            <td>If-Match</td>
            <td>"3f4ac46e3d"</td>
            <td>GET/HEAD</td>
            <td>"3f4ac46e3c" (True)</td>
            <td>412</td>
            <td>Return empty response.</td>
        </tr>
    </tbody>
</table>

Table 2: `If-Modified-Since`/`If-Unmodified-Since`

<table>
    <thead>
        <tr>
            <th colspan=3>Request</th>
            <th colspan=3>Response</th>
        </tr>
        <tr>
            <th>Condition</th>
            <th>Condition Value</th>
            <th>HTTP Method</th>
            <th>Latest Modification</th>
            <th>Response Code</th>
            <th>Note</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>If-Modified-Since</td>
            <td>Wed, 21 Oct 2015 07:28:00 GMT (GMT is a MUST)</td>
            <td>GET/HEAD</td>
            <td>Wed, 21 Oct 2015 07:30:00 GMT (True)</td>
            <td>200</td>
            <td>Return resource as response with "Cache-Control", "Content-Location", "Date", "Etag", "Expires" and "Vary". <b>Note: This header property will be ignored if `IF-None-Match` exists.</b></td>
        </tr>
        <tr>
            <td>If-Modified-Since</td>
            <td>Wed, 21 Oct 2015 07:28:00 GMT (GMT is a MUST)</td>
            <td>GET/HEAD</td>
            <td>Wed, 21 Oct 2015 07:28:00 GMT (False)</td>
            <td>304</td>
            <td>Return empty response with "Cache-Control", "Content-Location", "Date", "Etag", "Expires" and "Vary".</td>
        </tr>
        <tr>
            <td>If-Unmodified-Since</td>
            <td>Wed, 21 Oct 2015 07:28:00 GMT (GMT is a MUST)</td>
            <td>PUT, etc.</td>
            <td>Wed, 21 Oct 2015 07:28:00 GMT (True)</td>
            <td>200</td>
            <td>Requested operation on the specific resource will be executed. Same as other "no-safe" methods.</td>
        </tr>
        <tr>
            <td>If-Unmodified-Since</td>
            <td>Wed, 21 Oct 2015 07:28:00 GMT (GMT is a MUST)</td>
            <td>PUT, etc.</td>
            <td>Wed, 21 Oct 2015 07:30:00 GMT (False)</td>
            <td>412</td>
            <td>Resource modified since last post, current operation aborted. Same as other "no-safe" methods.</td>
        </tr>
    </tbody>
</table>

**UNSUPPORTED HEADERS**: `If-Range` `Range`.

## RCS Ingore Rules

What is this scenario? Imagine you have one file which is pretty large, let's see, 200Mb. If you want to cache that file, ServerHub has to load it to memory and it could took a lot of time and space. And it could be worse if the resource is not frequently requested. So here is the solution: 

- ServerHub does not support caching files more than 64Mb. But if you want to force exceed that limitation, just change the configuration object you passed to `ServerHub.Run()` method. But, you will never be able to get more than 20% of the total memory and apply it to cache resources (There will be a server startup failure).

## WCS (Weight-based Caching Strategy)

Let's talk about **WCS** in ServerHub caching system.

Caching system is designed to provide better I/O performance for HTTP request. For frequently used and smaller files, they usually have higher priorities while caching.

There are three factors that been used to calculate final resource weight in WCS: `size`, `time` (frequency) and `weight`.

WCS automatically sort cached resources with each factor and get each influence with different constant:

```
SIZE = size * size_order_index * 0.2;
TIME = time * time_order_index * 0.1;
WEIGHT = weight * weight_order_index * 0.7;
CACULATED_WEIGHT = SIZE + TIME + WEIGHT
```

All cached resources will be judged with the operations above and re-sorted under caculated weight. The last resources will be removed from cache until memory is avaliable for new cache items.