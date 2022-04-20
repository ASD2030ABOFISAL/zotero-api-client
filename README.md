[![Build Status](https://travis-ci.org/tnajdek/zotero-api-client.svg?branch=master)](https://travis-ci.org/tnajdek/zotero-api-client)
[![Coverage Status](https://coveralls.io/repos/github/tnajdek/zotero-api-client/badge.svg?branch=master)](https://coveralls.io/github/tnajdek/zotero-api-client?branch=master)
[![npm version](https://img.shields.io/npm/v/zotero-api-client)](https://www.npmjs.com/package/zotero-api-client)

Overview
--------
This is a lightweight, minimalistic Zotero API client written in JavaScript. It's been developed based on the following principles:

* Small, single purpose module, i.e. talk to the API
* Works in both node & browser environment
* No abstraction over Zotero data, what you see is what you get
* Clean api
* Small bundle footprint
* Minimal request validation
* Predictable and consistent responses
* Great test coverage, testing of all features

**Bear in mind it doesn't do any of the following:**

* Version management - version headers need to be provided explictely
* Caching - each call to get(), post() etc. will actually call the api
* Abstraction - There is no **Item** or **Collection** objects, only raw JSON

This library should be considered a low level tool to talk to the API.

Getting The Library
-------------------

NPM package contains source of the library which can be used as part of your build (e.g. when using browserify/rollup/webpack etc.) process or directly in node:

	npm i zotero-api-client

Also included in the package is an [UMD](https://github.com/umdjs/umd) bundle which can be loaded using common loaders or included directly in a `<script>` tag. In the latter case library is available globally as `ZoteroApiClient`. One way of using UMD bundle on your page is to include it from [unpkg](https://unpkg.com) project CDN:

```html
<script src="https://unpkg.com/zotero-api-client"></script>
```


Example
-----------

Simple example reading items from the public/test user library.

1. Import the library, pick one depending on your environment:

```javascript
// es module, most scenarios when using a bundler:
import api from 'zotero-api-client'
// common-js, node and some cases when using a bundler:
const { default: api } = require('zotero-api-client');
// UMD bundle creates `ZoteroApiClient` global object
const { default: api } = ZoteroApiClient;
```

2. Use the api to make the request (we're using [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function))

```javascript
const response = await api().library('user', 475425).collections('9KH9TNSJ').items().get();
```

3. Extract items from the response

```javascript
const items = response.getData();
```

4. Print titles of all the items in the library to console

```javascript
console.log(items.map(i => i.title));
```

Overview
--------

Library composes of three layers:

* An api function, which is the only interface exported.
* A request engine called by the api. It does the heavy lifting.
* An ApiResponse, or, more likely, its specialised variant


API interface
=============

API interface is a function that returns set of functions bound to previously configured options. This way it can be chained and stored at any level. Common scenario is to store authentication details and library details, which can be done quite simply:

```javascript
import api from 'zotero-api-client';
const myapi = api('AUTH_KEY').library('user', 0);
```

That produces api client already configured with your credentials and user library id. You can re-use it obtain list of collections in that library:

```javascript
const itemsResponse = await myapi.items().get();
```

Items in that library:

```javascript
const itemsResponse = await myapi.collections().get();
```

Or items in specific collection:

const collectionItemsResponse = await myapi.collections('EXAMPLE1').items().get();

There two types of api functions, configuration functions (e.g. `items()`) that can be further chained and execution functions (e.g. `get()`) that fire up the request. 

For complete reference, please see documentation for <a href="#api">api()</a>.

Request
=======

Request is a function that takes a complex configuration object generated by the api interface, communicates with the API and returns one of the response objects (see below). Some rarely used properties cannot be configured using api configuration functions and have to be specified as optional properties when calling `api()` or one of the execution functions of the api.

For a complete list of all the properties request() accepts, please see documentation for <a href="#request">request()</a>.

Response
========



## Classes

<dl>
<dt><a href="#SingleReadResponse">SingleReadResponse</a> ⇐ <code>ApiResponse</code></dt>
<dd><p>represents a response to a GET request containing a single entity</p>
</dd>
<dt><a href="#MultiReadResponse">MultiReadResponse</a> ⇐ <code>ApiResponse</code></dt>
<dd><p>represnets a response to a GET request containing multiple entities</p>
</dd>
<dt><a href="#SingleWriteResponse">SingleWriteResponse</a> ⇐ <code>ApiResponse</code></dt>
<dd><p>represents a response to a PUT or PATCH request</p>
</dd>
<dt><a href="#MultiWriteResponse">MultiWriteResponse</a> ⇐ <code>ApiResponse</code></dt>
<dd><p>represents a response to a POST request</p>
</dd>
<dt><a href="#DeleteResponse">DeleteResponse</a> ⇐ <code>ApiResponse</code></dt>
<dd><p>represents a response to a DELETE request</p>
</dd>
<dt><a href="#FileUploadResponse">FileUploadResponse</a> ⇐ <code>ApiResponse</code></dt>
<dd><p>represents a response to a file upload request</p>
</dd>
<dt><a href="#FileDownloadResponse">FileDownloadResponse</a> ⇐ <code>ApiResponse</code></dt>
<dd><p>represents a response to a file download request</p>
</dd>
<dt><a href="#FileUrlResponse">FileUrlResponse</a> ⇐ <code>ApiResponse</code></dt>
<dd><p>represents a response containing temporary url for file download</p>
</dd>
<dt><a href="#RawApiResponse">RawApiResponse</a> ⇐ <code>ApiResponse</code></dt>
<dd><p>represents a raw response, e.g. to data requests with format other than json</p>
</dd>
<dt><a href="#ErrorResponse">ErrorResponse</a> ⇐ <code>Error</code></dt>
<dd><p>represents an error response from the api</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#api">api()</a> ⇒ <code>Object</code></dt>
<dd><p>Wrapper function creates closure scope and calls api()</p>
</dd>
<dt><a href="#request">request()</a> ⇒ <code>Object</code></dt>
<dd><p>Executes request and returns a response</p>
</dd>
</dl>

<a name="SingleReadResponse"></a>

## SingleReadResponse ⇐ <code>ApiResponse</code>
represents a response to a GET request containing a single entity

**Kind**: global class  
**Extends**: <code>ApiResponse</code>  
<a name="SingleReadResponse+getData"></a>

### singleReadResponse.getData() ⇒ <code>Object</code>
**Kind**: instance method of [<code>SingleReadResponse</code>](#SingleReadResponse)  
**Returns**: <code>Object</code> - entity returned in this response  
<a name="MultiReadResponse"></a>

## MultiReadResponse ⇐ <code>ApiResponse</code>
represnets a response to a GET request containing multiple entities

**Kind**: global class  
**Extends**: <code>ApiResponse</code>  
<a name="MultiReadResponse+getData"></a>

### multiReadResponse.getData() ⇒ <code>Array</code>
**Kind**: instance method of [<code>MultiReadResponse</code>](#MultiReadResponse)  
**Returns**: <code>Array</code> - a list of entities returned in this response  
<a name="SingleWriteResponse"></a>

## SingleWriteResponse ⇐ <code>ApiResponse</code>
represents a response to a PUT or PATCH request

**Kind**: global class  
**Extends**: <code>ApiResponse</code>  
<a name="SingleWriteResponse+getData"></a>

### singleWriteResponse.getData() ⇒ <code>Object</code>
**Kind**: instance method of [<code>SingleWriteResponse</code>](#SingleWriteResponse)  
**Returns**: <code>Object</code> - For put requests, this represents a complete, updated object.
                 For patch requests, this reprents only updated fields of the updated object.  
<a name="MultiWriteResponse"></a>

## MultiWriteResponse ⇐ <code>ApiResponse</code>
represents a response to a POST request

**Kind**: global class  
**Extends**: <code>ApiResponse</code>  

* [MultiWriteResponse](#MultiWriteResponse) ⇐ <code>ApiResponse</code>
    * [.isSuccess()](#MultiWriteResponse+isSuccess) ⇒ <code>Boolean</code>
    * [.getData()](#MultiWriteResponse+getData) ⇒ <code>Array</code>
    * [.getErrors()](#MultiWriteResponse+getErrors) ⇒ <code>Object</code>
    * [.getEntityByKey(key)](#MultiWriteResponse+getEntityByKey)
    * [.getEntityByIndex(index)](#MultiWriteResponse+getEntityByIndex) ⇒ <code>Object</code>

<a name="MultiWriteResponse+isSuccess"></a>

### multiWriteResponse.isSuccess() ⇒ <code>Boolean</code>
**Kind**: instance method of [<code>MultiWriteResponse</code>](#MultiWriteResponse)  
**Returns**: <code>Boolean</code> - Indicates whether all write operations were successful  
<a name="MultiWriteResponse+getData"></a>

### multiWriteResponse.getData() ⇒ <code>Array</code>
Returns all entities POSTed in an array. Entities that have been written successfully
are returned updated, other entities are returned unchanged. It is advised to verify
if request was entirely successful (see isSuccess and getError) before using this method.

**Kind**: instance method of [<code>MultiWriteResponse</code>](#MultiWriteResponse)  
**Returns**: <code>Array</code> - A modified list of all entities posted.  
<a name="MultiWriteResponse+getErrors"></a>

### multiWriteResponse.getErrors() ⇒ <code>Object</code>
Returns all errors that have occurred.

**Kind**: instance method of [<code>MultiWriteResponse</code>](#MultiWriteResponse)  
**Returns**: <code>Object</code> - Errors object where keys are indexes of the array of the original request and values are the erorrs occurred.  
<a name="MultiWriteResponse+getEntityByKey"></a>

### multiWriteResponse.getEntityByKey(key)
Allows obtaining updated entity based on its key, otherwise identical to getEntityByIndex

**Kind**: instance method of [<code>MultiWriteResponse</code>](#MultiWriteResponse)  
**Throws**:

- <code>Error</code> If key is not present in the request

**See**: [getEntityByIndex](getEntityByIndex)  

| Param | Type |
| --- | --- |
| key | <code>String</code> | 

<a name="MultiWriteResponse+getEntityByIndex"></a>

### multiWriteResponse.getEntityByIndex(index) ⇒ <code>Object</code>
Allows obtaining updated entity based on its index in the original request

**Kind**: instance method of [<code>MultiWriteResponse</code>](#MultiWriteResponse)  
**Throws**:

- <code>Error</code> If index is not present in the original request
- <code>Error</code> If error occured in the POST for selected entity. Error message will contain reason for failure.


| Param | Type |
| --- | --- |
| index | <code>Number</code> | 

<a name="DeleteResponse"></a>

## DeleteResponse ⇐ <code>ApiResponse</code>
represents a response to a DELETE request

**Kind**: global class  
**Extends**: <code>ApiResponse</code>  
<a name="FileUploadResponse"></a>

## FileUploadResponse ⇐ <code>ApiResponse</code>
represents a response to a file upload request

**Kind**: global class  
**Extends**: <code>ApiResponse</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| authResponse | <code>Object</code> | Response object for the stage 1 (upload authorisation)                                       request |
| response | <code>Object</code> | alias for "authResponse" |
| uploadResponse | <code>Object</code> | Response object for the stage 2 (file upload) request |
| registerResponse | <code>Objext</code> | Response object for the stage 3 (upload registration)                                       request |

<a name="FileDownloadResponse"></a>

## FileDownloadResponse ⇐ <code>ApiResponse</code>
represents a response to a file download request

**Kind**: global class  
**Extends**: <code>ApiResponse</code>  
<a name="FileUrlResponse"></a>

## FileUrlResponse ⇐ <code>ApiResponse</code>
represents a response containing temporary url for file download

**Kind**: global class  
**Extends**: <code>ApiResponse</code>  
<a name="RawApiResponse"></a>

## RawApiResponse ⇐ <code>ApiResponse</code>
represents a raw response, e.g. to data requests with format other than json

**Kind**: global class  
**Extends**: <code>ApiResponse</code>  
<a name="ErrorResponse"></a>

## ErrorResponse ⇐ <code>Error</code>
represents an error response from the api

**Kind**: global class  
**Extends**: <code>Error</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| response | <code>Object</code> | Response object for the request, with untouched body |
| message | <code>String</code> | What error occurred, ususally contains response code and status |
| reason | <code>String</code> | More detailed reason for the failure, if provided by the API |
| options | <code>String</code> | Configuration object used for this request |

<a name="api"></a>

## api() ⇒ <code>Object</code>
Wrapper function creates closure scope and calls api()

**Kind**: global function  
**Returns**: <code>Object</code> - Partially configured api functions  

* [api()](#api) ⇒ <code>Object</code>
    * [~api(key, opts)](#api..api) ⇒ <code>Object</code>
    * [~library([typeOrKey], [id])](#api..library) ⇒ <code>Object</code>
    * [~items(items)](#api..items) ⇒ <code>Object</code>
    * [~itemTypes()](#api..itemTypes) ⇒ <code>Object</code>
    * [~itemFields()](#api..itemFields) ⇒ <code>Object</code>
    * [~creatorFields()](#api..creatorFields) ⇒ <code>Object</code>
    * [~itemTypeFields(itemType)](#api..itemTypeFields) ⇒ <code>Object</code>
    * [~itemTypeCreatorTypes(itemType)](#api..itemTypeCreatorTypes) ⇒ <code>Object</code>
    * [~template(itemType)](#api..template) ⇒ <code>Object</code>
    * [~collections(items)](#api..collections) ⇒ <code>Object</code>
    * [~subcollections()](#api..subcollections) ⇒ <code>Object</code>
    * [~publications()](#api..publications) ⇒ <code>Object</code>
    * [~tags(tags)](#api..tags) ⇒ <code>Object</code>
    * [~searches(searches)](#api..searches) ⇒ <code>Object</code>
    * [~top()](#api..top) ⇒ <code>Object</code>
    * [~trash()](#api..trash) ⇒ <code>Object</code>
    * [~children()](#api..children) ⇒ <code>Object</code>
    * [~settings(settings)](#api..settings) ⇒ <code>Object</code>
    * [~deleted()](#api..deleted) ⇒ <code>Object</code>
    * [~groups()](#api..groups) ⇒ <code>Object</code>
    * [~version(version)](#api..version) ⇒ <code>Object</code>
    * [~attachment(fileName, file, mtime, md5sum)](#api..attachment) ⇒ <code>Object</code>
    * [~registerAttachment(fileName, fileSize, mtime, md5sum)](#api..registerAttachment) ⇒ <code>Object</code>
    * [~attachmentUrl()](#api..attachmentUrl) ⇒ <code>Object</code>
    * [~verifyKeyAccess()](#api..verifyKeyAccess) ⇒ <code>Object</code>
    * [~get(opts)](#api..get) ⇒ <code>Promise</code>
    * [~post(data, opts)](#api..post) ⇒ <code>Promise</code>
    * [~put(data, opts)](#api..put) ⇒ <code>Promise</code>
    * [~patch(data, opts)](#api..patch) ⇒ <code>Promise</code>
    * [~del(keysToDelete, opts)](#api..del) ⇒ <code>Promise</code>
    * [~getConfig()](#api..getConfig) ⇒ <code>Object</code>
    * [~pretend(verb, data, opts)](#api..pretend) ⇒ <code>Promise</code>
    * [~use(extend)](#api..use) ⇒ <code>Object</code>

<a name="api..api"></a>

### api~api(key, opts) ⇒ <code>Object</code>
Entry point of the interface. Configures authentication.
Can be used to configure any other properties of the api
Returns a set of function that are bound to that configuration
and can be called to specify further api configuration.

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Authentication key |
| opts | <code>Object</code> | Optional api configuration. For a list of all                         possible properties, see documentation for                         request() function |

<a name="api..library"></a>

### api~library([typeOrKey], [id]) ⇒ <code>Object</code>
Configures which library api requests should use.

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  

| Param | Type | Description |
| --- | --- | --- |
| [typeOrKey] | <code>\*</code> | Library key, e.g. g1234. Alternatively, if                          second parameter is present, library type i.e                          either 'group' or 'user' |
| [id] | <code>Number</code> | Only when first argument is a type, library id |

<a name="api..items"></a>

### api~items(items) ⇒ <code>Object</code>
Configures api to use items or a specific item
Can be used in conjuction with library(), collections(), top(), trash(),
children(), tags() and any execution function (e.g. get(), post())

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| items | <code>String</code> | <code></code> | Item key, if present, configure api to point at                          this specific item |

<a name="api..itemTypes"></a>

### api~itemTypes() ⇒ <code>Object</code>
Configure api to request all item types
Can only be used in conjuction with get()

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  
<a name="api..itemFields"></a>

### api~itemFields() ⇒ <code>Object</code>
Configure api to request all item fields
Can only be used in conjuction with get()

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  
<a name="api..creatorFields"></a>

### api~creatorFields() ⇒ <code>Object</code>
Configure api to request localized creator fields
Can only be used in conjuction with get()

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  
<a name="api..itemTypeFields"></a>

### api~itemTypeFields(itemType) ⇒ <code>Object</code>
Configure api to request all valid fields for an item type
Can only be used in conjuction with get()

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  

| Param | Type | Description |
| --- | --- | --- |
| itemType | <code>String</code> | item type for which valid fields will be                             requested, e.g. 'book' or 'journalType' |

<a name="api..itemTypeCreatorTypes"></a>

### api~itemTypeCreatorTypes(itemType) ⇒ <code>Object</code>
Configure api to request valid creator types for an item type
Can only be used in conjuction with get()

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  

| Param | Type | Description |
| --- | --- | --- |
| itemType | <code>String</code> | item type for which valid creator types                             will be requested, e.g. 'book' or                              'journalType' |

<a name="api..template"></a>

### api~template(itemType) ⇒ <code>Object</code>
Configure api to request template for a new item
Can only be used in conjuction with get()

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  

| Param | Type | Description |
| --- | --- | --- |
| itemType | <code>String</code> | item type for which template will be                             requested, e.g. 'book' or 'journalType' |

<a name="api..collections"></a>

### api~collections(items) ⇒ <code>Object</code>
Configure api to use collections or a specific collection
Can be used in conjuction with library(), items(), top(), tags() and
any of the execution function (e.g. get(), post())

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  

| Param | Type | Description |
| --- | --- | --- |
| items | <code>String</code> | Collection key, if present, configure api to                          point to this specific collection |

<a name="api..subcollections"></a>

### api~subcollections() ⇒ <code>Object</code>
Configure api to use subcollections that reside underneath the specified
collection.
Should only be used in conjuction with both library() and collection()
and any of the execution function (e.g. get(), post())

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  
<a name="api..publications"></a>

### api~publications() ⇒ <code>Object</code>
Configure api to narrow the request to only consider items filled under
"My Publications"
Should only be used in conjuction with both library() and items()
and any of the execution function (e.g. get(), post())

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  
<a name="api..tags"></a>

### api~tags(tags) ⇒ <code>Object</code>
Configure api to request or delete tags or request a specific tag
Can be used in conjuction with library(), items(), collections() and
any of the following execution functions: get(), delete() but only
if the first argument is not present. Otherwise can only be used in
conjuctin with get()

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tags | <code>String</code> | <code></code> | name of a tag to request. If preset, configure                         api to request specific tag. |

<a name="api..searches"></a>

### api~searches(searches) ⇒ <code>Object</code>
Configure api to use saved searches or a specific saved search
Can be used in conjuction with library() and any of the execution
functions

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| searches | <code>String</code> | <code></code> | Search key, if present, configure api to point at                             this specific saved search |

<a name="api..top"></a>

### api~top() ⇒ <code>Object</code>
Configure api to narrow the request only to the top level items
Can be used in conjuction with items() and collections() and only
with conjuction with a get() execution function

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  
<a name="api..trash"></a>

### api~trash() ⇒ <code>Object</code>
Configure api to narrow the request only to the items in the trash
Can be only used in conjuction with items() and get() execution
function

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  
<a name="api..children"></a>

### api~children() ⇒ <code>Object</code>
Configure api to narrow the request only to the children of given
item
Can be only used in conjuction with items() and get() execution
function

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  
<a name="api..settings"></a>

### api~settings(settings) ⇒ <code>Object</code>
Configure api to request settings
Can only be used in conjuction with get(), put(), post() and delete()
For usage with put() and delete() settings key must be provided
For usage with post() settings key must not be included

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| settings | <code>String</code> | <code></code> | Settings key, if present, configure api to point at                             this specific key within settings, e.g. `tagColors`. |

<a name="api..deleted"></a>

### api~deleted() ⇒ <code>Object</code>
Configure api to request deleted content
Can only be used in conjuction with get()

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  
<a name="api..groups"></a>

### api~groups() ⇒ <code>Object</code>
Configure api to request user-accessible groups (i.e. The set of groups 
the current API key has access to, including public groups the key owner
belongs to even if the key doesn't have explicit permissions for them.)
Can only be used in conjuction with get()

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  
<a name="api..version"></a>

### api~version(version) ⇒ <code>Object</code>
Configure api to specify local version of given entity.
When used in conjuction with get() exec function, it will populate the
If-Modified-Since-Version header.
When used in conjuction with post(), put(), patch() or delete() it will
populate the If-Unmodified-Since-Version header.

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| version | <code>Number</code> | <code></code> | local version of the entity |

<a name="api..attachment"></a>

### api~attachment(fileName, file, mtime, md5sum) ⇒ <code>Object</code>
Configure api to upload or download an attachment file
Can be only used in conjuction with items() and post()/get()
Use items() to select attachment item for which file is uploaded/downloaded
Will populate format on download as well as Content-Type, If-None-Match headers
in case of an upload

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fileName | <code>String</code> |  | name of the file, should match values in attachment                              item entry |
| file | <code>ArrayBuffer</code> |  | file to be uploaded |
| mtime | <code>Number</code> | <code></code> | file's mtime, if not provided current time is used |
| md5sum | <code>Number</code> | <code></code> | existing file md5sum, if matches will override existing file. Leave empty to perform new upload. |

<a name="api..registerAttachment"></a>

### api~registerAttachment(fileName, fileSize, mtime, md5sum) ⇒ <code>Object</code>
Advanced, low-level function that will attempt to register existing 
file with given attachment-item based on known file metadata
Can be only used in conjuction with items() and post()
Use items() to select attachment item for which file is registered
Will populate Content-Type, If-Match headers
Will fail with a ErrorResponse if API does not return "exists"

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>String</code> | name of the file, should match values in attachment                              item entry |
| fileSize | <code>Number</code> | size of the existing file |
| mtime | <code>Number</code> | mtime of the existing file |
| md5sum | <code>String</code> | md5sum of the existing file |

<a name="api..attachmentUrl"></a>

### api~attachmentUrl() ⇒ <code>Object</code>
Configure api to request a temporary attachment file url
Can be only used in conjuction with items() and get()
Use items() to select attachment item for which file is url is requested
Will populate format, redirect

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  
<a name="api..verifyKeyAccess"></a>

### api~verifyKeyAccess() ⇒ <code>Object</code>
Configure api to request information on the API key.
Can only be used in conjuction with get()

**Kind**: inner method of [<code>api</code>](#api)  
**Chainable**  
**Returns**: <code>Object</code> - Partially configured api functions  
<a name="api..get"></a>

### api~get(opts) ⇒ <code>Promise</code>
Execution function. Specifies that the request should use a GET method.

**Kind**: inner method of [<code>api</code>](#api)  
**Returns**: <code>Promise</code> - A promise that will eventually return either an 
                  ApiResponse, SingleReadResponse or MultiReadResponse.
                  Might throw Error or ErrorResponse.  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | Optional api configuration. If duplicate,                          overrides properties already present. For a list                         of all possible properties, see documentation                         for request() function |

<a name="api..post"></a>

### api~post(data, opts) ⇒ <code>Promise</code>
Execution function. Specifies that the request should use a POST method.

**Kind**: inner method of [<code>api</code>](#api)  
**Returns**: <code>Promise</code> - A promise that will eventually return MultiWriteResponse.
                  Might throw Error or ErrorResponse  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array</code> | An array of entities to post |
| opts | <code>Object</code> | Optional api configuration. If duplicate,                          overrides properties already present. For a list                         of all possible properties, see documentation                         for request() function |

<a name="api..put"></a>

### api~put(data, opts) ⇒ <code>Promise</code>
Execution function. Specifies that the request should use a PUT method.

**Kind**: inner method of [<code>api</code>](#api)  
**Returns**: <code>Promise</code> - A promise that will eventually return SingleWriteResponse.
                  Might throw Error or ErrorResponse  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | An entity to put |
| opts | <code>Object</code> | Optional api configuration. If duplicate,                          overrides properties already present. For a list                         of all possible properties, see documentation                         for request() function |

<a name="api..patch"></a>

### api~patch(data, opts) ⇒ <code>Promise</code>
Execution function. Specifies that the request should use a PATCH
method.

**Kind**: inner method of [<code>api</code>](#api)  
**Returns**: <code>Promise</code> - A promise that will eventually return SingleWriteResponse.
                  Might throw Error or ErrorResponse  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Partial entity data to patch |
| opts | <code>Object</code> | Optional api configuration. If duplicate,                          overrides properties already present. For a list                         of all possible properties, see documentation                         for request() function |

<a name="api..del"></a>

### api~del(keysToDelete, opts) ⇒ <code>Promise</code>
Execution function. Specifies that the request should use a DELETE
method.

**Kind**: inner method of [<code>api</code>](#api)  
**Returns**: <code>Promise</code> - A promise that will eventually return DeleteResponse.
                  Might throw Error or ErrorResponse  

| Param | Type | Description |
| --- | --- | --- |
| keysToDelete | <code>Array</code> | An array of keys to delete. Depending on                                how api has been configured, these will                                be item keys, collection keys, search                                 keys or tag names. If not present, api                                should be configured to use specific                                 item, collection, saved search or settings                                key, in which case, that entity will be deleted |
| opts | <code>Object</code> | Optional api configuration. If duplicate,                          overrides properties already present. For a list                         of all possible properties, see documentation                         for request() function |

<a name="api..getConfig"></a>

### api~getConfig() ⇒ <code>Object</code>
Execution function. Returns current config without doing any requests.
Usually used in advanced scenarios where config needs to be tweaked
manually before submitted to the request method or as a debugging tool.

**Kind**: inner method of [<code>api</code>](#api)  
**Returns**: <code>Object</code> - current config  
<a name="api..pretend"></a>

### api~pretend(verb, data, opts) ⇒ <code>Promise</code>
Execution function. Prepares the request but does not execute fetch()
instead returning a "pretended" response where details for the actual
fetch that would have been used are included.
Usually used in advanced scenarios where config needs to be tweaked
manually before submitted to the request method or as a debugging tool.

**Kind**: inner method of [<code>api</code>](#api)  
**Returns**: <code>Promise</code> - A promise that will eventually return PretendResponse.
                  Might throw Error or ErrorResponse  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| verb | <code>String</code> | <code>get</code> | Defines which execution function is used to prepare                         the request. Should be one of 'get', 'post', 'patch'                         'put', 'delete'. Defaults to 'get'. |
| data | <code>Object</code> |  | This argument is passed over to the actual execution                         function. For 'get' it is ignored, for 'post', 'patch'                         and 'put' see 'data' of that execution function, for                         'delete' see 'keysToDelete' |
| opts | <code>Object</code> |  | Optional api configuration. If duplicate,                          overrides properties already present. For a list                         of all possible properties, see documentation                         for request() function |

<a name="api..use"></a>

### api~use(extend) ⇒ <code>Object</code>
Used for extending capabilities of the library by installing plugins.
In most cases plugins inject additional executors or bind api to an
alternative/extended set of functions

**Kind**: inner method of [<code>api</code>](#api)  
**Returns**: <code>Object</code> - Extended/partially configured api functions  

| Param | Type | Description |
| --- | --- | --- |
| extend | <code>function</code> | function that installs alternative                              or additional functionality of the api.                              It should return bound api functions,                              usually by caling arguments[0].ef() |

<a name="request"></a>

## request() ⇒ <code>Object</code>
Executes request and returns a response

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise that will eventually return a response object  
**Throws**:

- <code>Error</code> If options specify impossible configuration
- [<code>ErrorResponse</code>](#ErrorResponse) If API responds with a non-ok response


| Param | Type | Description |
| --- | --- | --- |
| options.authorization | <code>String</code> | 'Authorization' header |
| options.zoteroWriteToken | <code>String</code> | 'Zotero-Write-Token' header |
| options.ifModifiedSinceVersion | <code>String</code> | 'If-Modified-Since-Version' header |
| options.ifUnmodifiedSinceVersion | <code>String</code> | 'If-Unmodified-Since-Version' header |
| options.contentType | <code>String</code> | 'Content-Type' header |
| options.collectionKey | <code>String</code> | 'collectionKey' query argument |
| options.content | <code>String</code> | 'content' query argument |
| options.direction | <code>String</code> | 'direction' query argument |
| options.format | <code>String</code> | 'format' query argument |
| options.include | <code>String</code> | 'include' query argument |
| options.includeTrashed | <code>String</code> | 'includeTrashed' query argument |
| options.itemKey | <code>String</code> | 'itemKey' query argument |
| options.itemQ | <code>String</code> | 'itemQ' query argument |
| options.itemQMode | <code>String</code> | 'itemQMode' query argument |
| options.itemTag | <code>String</code> \| <code>Array.&lt;String&gt;</code> | 'itemTag' query argument |
| options.itemType | <code>String</code> | 'itemType' query argument |
| options.limit | <code>Number</code> | 'limit' query argument |
| options.linkMode | <code>String</code> | 'linkMode' query argument |
| options.locale | <code>String</code> | 'locale' query argument |
| options.q | <code>String</code> | 'q' query argument |
| options.qmode | <code>String</code> | 'qmode' query argument |
| options.searchKey | <code>String</code> | 'searchKey' query argument |
| options.since | <code>Number</code> | 'since' query argument |
| options.sort | <code>String</code> | 'sort' query argument |
| options.start | <code>Number</code> | 'start' query argument |
| options.style | <code>String</code> | 'style' query argument |
| options.tag | <code>String</code> \| <code>Array.&lt;String&gt;</code> | 'tag' query argument |
| options.pretend | <code>Boolean</code> | triggers pretend mode where fetch request                                        					  is prepared and returned without execution |
| options.resource.top | <code>String</code> | use 'top' resource |
| options.resource.trash | <code>String</code> | use 'trash' resource |
| options.resource.children | <code>String</code> | use 'children' resource |
| options.resource.groups | <code>String</code> | use 'groups' resource |
| options.resource.itemTypes | <code>String</code> | use 'itemTypes' resource |
| options.resource.itemFields | <code>String</code> | use 'itemFields' resource |
| options.resource.creatorFields | <code>String</code> | use 'creatorFields' resource |
| options.resource.itemTypeFields | <code>String</code> | use 'itemTypeFields' resource |
| options.resource.itemTypeCreatorTypes | <code>String</code> | use 'itemTypeCreatorTypes' resource |
| options.resource.library | <code>String</code> | use 'library' resource |
| options.resource.collections | <code>String</code> | use 'collections' resource |
| options.resource.items | <code>String</code> | use 'items' resource |
| options.resource.searches | <code>String</code> | use 'searches' resource |
| options.resource.tags | <code>String</code> | use 'tags' resource |
| options.resource.template | <code>String</code> | use 'template' resource |
| options.method | <code>String</code> | forwarded to fetch() |
| options.body | <code>String</code> | forwarded to fetch() |
| options.mode | <code>String</code> | forwarded to fetch() |
| options.cache | <code>String</code> | forwarded to fetch() |
| options.credentials | <code>String</code> | forwarded to fetch() |
| options.uploadRegisterOnly | <code>Boolean</code> | this file upload should only perform stage 1                                           				  error if file with provided meta does not exist |
| options.retry | <code>Number</code> | retry this many times after transient error. |
| options.retryDelay | <code>Number</code> | wait this many seconds before retry. If not set                                         					  an exponential backoff algorithm will be used |


