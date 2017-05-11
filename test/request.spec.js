/* eslint-env mocha */
'use strict';

const URL = require('url');
const fetchMock = require('fetch-mock');
const { assert } = require('chai');
const request = require('../src/request');
const {
	ApiResponse,
	SingleReadResponse,
	MultiReadResponse,
	SingleWriteResponse,
	MultiWriteResponse,
	ErrorResponse
} = require('../src/response.js');
const singleGetResponseFixture = require('./fixtures/single-object-get-response.json');
const multiGetResponseFixture = require('./fixtures/multi-object-get-response.json');
const tagsResponseFixture = require('./fixtures/tags-data-response.json');
const searchesResponseFixture = require('./fixtures/searches-data-response.json');
const itemTypesDataFixture = require('./fixtures/item-types-data.json');
const multiMixedWriteResponseFixture = require('./fixtures/multi-mixed-write-response.json');
const multiSuccessWriteResponseFixture = require('./fixtures/multi-success-write-response.json');

describe('ZoteroJS request', () => {
	beforeEach(() => {
			fetchMock.catch(request => {
				throw(new Error(`A request to ${request} was not expected`));
			});
		});

	afterEach(fetchMock.restore);

	describe('Meta read requests', () => {
		it('should get item types', () => {
			fetchMock.mock(
				'begin:https://api.zotero.org/users/475425/itemTypes',
				itemTypesDataFixture
			);

			return request({
				resource: {
					library: 'u475425',
					itemTypes: null
				}
			}).then(response => {
				assert.instanceOf(response, ApiResponse);
				assert.equal(response.getData().length, 2);
			});
		});
	});

	describe('Item read requests', () => {
		it('should get a single item', () => {
			fetchMock.mock(
				'begin:https://api.zotero.org/users/475425/items/X42A7DEE',
				singleGetResponseFixture
			);

			return request({
				resource: {
					library: 'u475425',
					items: 'X42A7DEE'
				}
			}).then(response => {
				assert.instanceOf(response, SingleReadResponse);
				assert.equal(response.getData().key, 'X42A7DEE');
			});
		});

		it('should get /top items from a user library', () => {
			fetchMock.mock(
				'begin:https://api.zotero.org/users/475425/items/top',
				multiGetResponseFixture
			);

			return request({
				resource: {
					library: 'u475425',
					items: null,
					top: null
				}
			}).then(response => {
				assert.instanceOf(response, MultiReadResponse);
				assert.equal(response.getData().length, 15);
			});
		});

		it('should get /top items from a group library', () => {
			fetchMock.mock(
				'begin:https://api.zotero.org/groups/123456/items/top',
				multiGetResponseFixture
			);

			return request({
				resource: {
					library: 'g123456',
					items: null,
					top: null
				}
			}).then(response => {
				assert.instanceOf(response, MultiReadResponse);
				assert.equal(response.getData().length, 15);
			});
		});

		it('should get items from the trash', () => {
			fetchMock.mock(
				'begin:https://api.zotero.org/users/475425/items/trash',
				multiGetResponseFixture
			);

			return request({
				resource: {
					library: 'u475425',
					items: null,
					trash: null
				}
			}).then(response => {
				assert.instanceOf(response, MultiReadResponse);
				assert.equal(response.getData().length, 15);
			});
		});

		it('should get items from the collection', () => {
			fetchMock.mock(
				'begin:https://api.zotero.org/users/475425/collections/N7W92H48/items',
				multiGetResponseFixture
			);

			return request({
				resource: {
					library: 'u475425',
					collections: 'N7W92H48',
					items: null
				}
			}).then(response => {
				assert.instanceOf(response, MultiReadResponse);
				assert.equal(response.getData().length, 15);
			});
		});

		it('should get /top items from the collection', () => {
			fetchMock.mock(
				'begin:https://api.zotero.org/users/475425/collections/N7W92H48/items/top',
				multiGetResponseFixture
			);

			return request({
				resource: {
					library: 'u475425',
					collections: 'N7W92H48',
					items: null,
					top: null
				}
			}).then(response => {
				assert.instanceOf(response, MultiReadResponse);
				assert.equal(response.getData().length, 15);
			});
		});

		it('should get a single tag by name', () => {
			fetchMock.mock(
				/https:\/\/api\.zotero\.org\/users\/475425\/tags\?.*?tag=Fiction.*?/,
				tagsResponseFixture.slice(-1)
			);

			return request({
				resource: {
					library: 'u475425',
					tags: null
					},
				tag: 'Fiction'
			}).then(response => {
				assert.instanceOf(response, ApiResponse);
				assert.equal(response.getData().length, 1);
			});
		});

		it('should get a single search', () => {
			fetchMock.mock(
				'begin:https://api.zotero.org/users/475425/searches',
				searchesResponseFixture
			);

			return request({
				resource: {
					library: 'u475425',
					searches: null
					},
				searchKey: 'HHF7BB4C'
			}).then(response => {
				assert.instanceOf(response, ApiResponse);
				assert.equal(response.getData().length, 1);
			});
		});

		it('should handle sorting and pagination', () => {
			fetchMock.mock(
				url => {
					let parsedUrl = URL.parse(url);
					parsedUrl = parsedUrl.search.slice(1);
					parsedUrl = parsedUrl.split('&');
					if(!parsedUrl.includes('sort=title')) {
						return false;
					}
					if(!parsedUrl.includes('direction=asc')) {
						return false;
					}
					if(!parsedUrl.includes('limit=50')) {
						return false;
					}
					if(!parsedUrl.includes('start=25')) {
						return false;
					}
					return true;
				},
				multiGetResponseFixture
			);

			return request({
				resource: {
					library: 'u475425',
					items: null
					},
				sort: 'title',
				direction: 'asc',
				limit: 50,
				start: 25
			}).then(response => {
				assert.instanceOf(response, MultiReadResponse);
				assert.equal(response.getData().length, 15);
			});
		});

		it('should handle searching by itemKey', () => {
			fetchMock.mock(
				url => {
					let parsedUrl = URL.parse(url);
					parsedUrl = parsedUrl.search.slice(1);
					parsedUrl = parsedUrl.split('&');
					if(!parsedUrl.includes('itemKey=N7W92H48')) {
						return false;
					}
					return true;
				},
				[multiGetResponseFixture[0]]
			);

			return request({
				resource: {
					library: 'u475425',
					items: null
					},
				itemKey: 'N7W92H48'
			}).then(response => {
				assert.instanceOf(response, MultiReadResponse);
				assert.equal(response.getData().length, 1);
			});
		});
	});

	describe('Misc read requests', () => {
		it('should get a single search', () => {
			fetchMock.mock(
				'begin:https://api.zotero.org/users/475425/searches',
				searchesResponseFixture
			);

			return request({
				resource: {
					library: 'u475425',
					searches: null
					},
				searchKey: 'HHF7BB4C'
			}).then(response => {
				assert.instanceOf(response, MultiReadResponse);
				assert.equal(response.getData().length, 1);
			});
		});

		it('should get searches', () => {
			fetchMock.mock(
				'begin:https://api.zotero.org/users/475425/searches',
				searchesResponseFixture
			);

			return request({
				resource: {
					library: 'u475425',
					searches: null
					}
			}).then(response => {
				assert.instanceOf(response, ApiResponse);
				assert.equal(response.getData().length, 1);
			});
		});

		it('should get a set of all tags in the library', () => {
			fetchMock.mock(
				'begin:https://api.zotero.org/users/475425/tags',
				tagsResponseFixture
			);

			return request({
				resource: {
					library: 'u475425',
					tags: null
				}
			}).then(response => {
				assert.instanceOf(response, ApiResponse);
				assert.equal(response.getData().length, 25);
			});
		});
	});

	describe('Get requests with extra params', () => {
		it('should include headers in the request', () => {
			fetchMock.mock(
				(url, opts) => {
					assert.property(opts, 'headers');
					assert.equal(opts.headers['Authorization'], 'a');
					assert.equal(opts.headers['Zotero-Write-Token'], 'b');
					assert.equal(opts.headers['If-Modified-Since-Version'], 1);
					assert.equal(opts.headers['If-Unmodified-Since-Version'], 1);
					assert.equal(opts.headers['Content-Type'], 'c');
					return true;
				}, {}
			);

			return request({
				resource: {
					library: 'u475425',
					items: null
				},
				'authorization': 'a',
				'zoteroWriteToken': 'b',
				'ifModifiedSinceVersion': 1,
				'ifUnmodifiedSinceVersion': 1 ,
				'contentType': 'c'
			});
		});

		it('should include query params in the request', () => {
			fetchMock.mock(
				url => { 
					return [
						'format', 'include', 'content', 'style', 'itemKey',
						'collectionKey', 'searchKey', 'itemType', 'qmode',
						'since', 'tag', 'sort', 'direction', 'limit', 'start'
					].every(qp => url.includes(`${qp}=`));
				}, {}
			);

			return request({
				resource: {
					library: 'u475425',
					items: null
				},
				format: 'foo',
				include: 'foo',
				content: 'foo',
				style: 'foo',
				itemKey: 'foo',
				collectionKey: 'foo',
				searchKey: 'foo',
				itemType: 'foo',
				qmode: 'foo',
				since: 'foo',
				tag: 'foo',
				sort: 'foo',
				direction: 'foo',
				limit: 'foo',
				start: 'foo'
			});
		});
	});

	describe('Failing, empty & raw response get requests', () => {
		it('should throw ErrorResponse for non ok results', () => {
			fetchMock.mock('begin:https://api.zotero.org/', {
				status: 404,
				statusText: 'Not Found',
				body: 'These aren\'t the droids You are looking for'
			});

			return request({
				resource: {
					library: 'u475425',
					items: null
				}
			}).then(() => {
				throw new Error('fail');
			}).catch(async error => {
				assert.instanceOf(error, ErrorResponse);
				assert.equal(error.message, '404: Not Found');
				assert.equal(error.reason, 'These aren\'t the droids You are looking for');
				assert.equal(error.response.bodyUsed, false);
			});
		});

		it('should handly empty-body 304 response', () => {
			fetchMock.mock('begin:https://api.zotero.org/', {
				status: 304,
				body: ''
			});

			return request({
				resource: {
					library: 'u475425',
					items: null
				},
				ifModifiedSinceVersion: 42
			}).then(response => {
				assert.instanceOf(response, ApiResponse);
				assert.isNull(response.getData());
				assert.equal(response.response.status, 304);
			});
		});

		it('should return raw response for non-json requests', () => {
			fetchMock.mock('begin:https://api.zotero.org/', {
				status: 200,
				body: '<xml></xml>'
			});

			return request({
				resource: {
					library: 'u475425',
					items: null
				},
				format: 'atom'
			}).then(response => {
				assert.instanceOf(response, Response);
				assert.equal(response.status, 200);
				assert.equal(response.bodyUsed, false);
			});
		});
	});

	describe('Item write & delete requests', () => {
		it('should post a new item', () => {
			fetchMock.mock( (url, opts) => {
					assert.isOk(url.startsWith('https://api.zotero.org/users/475425/items'));
					assert.equal(opts.method, 'post');
					return true;
				}, {
				headers: {
					'Last-Modified-Version': 1337
				},
				body: multiSuccessWriteResponseFixture
			});

			const item ={
				'key': 'AZBCAADA',
				'version': 0,
				'itemType': 'book',
				'title': 'My Amazing Book'
			};

			return request({
				method: 'post',
				body: [item],
				resource: {
					library: 'u475425',
					items: null
				}
			}).then(response => {
				assert.instanceOf(response, MultiWriteResponse);
				assert.isOk(response.isSuccess());
				assert.equal(response.getData()[0].key, 'AZBCAADA');
				assert.equal(response.getData()[0].title, 'My Amazing Book');
				assert.equal(response.getData()[0].itemType, 'book');
				assert.equal(response.getData()[0].version, 1337);
			});
		});

		it('should post multiple items', () => {
			fetchMock.mock( (url, opts) => {
					assert.isOk(url.startsWith('https://api.zotero.org/users/475425/items'));
					assert.equal(opts.method, 'post');
					return true;
				}, {
				headers: {
					'Last-Modified-Version': 1337
				},
				body: multiMixedWriteResponseFixture
			});

			const book = {
				'key': 'ABCD1111',
				'version': 0,
				'itemType': 'book',
				'title': 'My Amazing Book'
			};

			const bug1 = {
				'key': 'ABCD4444',
				'version': 0
			}

			const paper = {
				'key': 'ABCD2222',
				'version': 0,
				'itemType': 'journalArticle',
				'title': 'My super paper'
			};

			const bug2 = {
				'key': 'ABCD5555',
				'version': 0
			}

			const unchanged = {
				'key': 'ABCD3333',
				'version': 0,
				'itemType': 'journalArticle',
				'title': 'My super paper'
			};

			return request({
				method: 'post',
				body: [book, bug1, paper, bug2, unchanged],
				resource: {
					library: 'u475425',
					items: null
				}
			}).then(response => {
				assert.instanceOf(response, MultiWriteResponse);
				assert.isNotOk(response.isSuccess());

				assert.equal(response.getData().length, 5);
				assert.equal(response.getData()[0].version, 1337); // successful
				assert.equal(response.getData()[1].version, 0); // failed
				assert.equal(response.getData()[4].version, 0); // unchanged

				assert.equal(response.getErrors()[1].message, 'Bad input');
				assert.equal(response.getErrors()[3].message, 'Bad input');

				assert.equal(response.getEntityByIndex(2).key, 'ABCD2222');
				assert.equal(response.getEntityByIndex(2).version, 1337);
				assert.equal(response.getEntityByIndex(4).key, 'ABCD3333');
				assert.equal(response.getEntityByIndex(4).version, 0);

				assert.throws(response.getEntityByIndex.bind(response, 1), /400: Bad input/);
				assert.throws(response.getEntityByIndex.bind(response, 10), /Index 10 is not present in the reponse/);
				assert.throws(response.getEntityByKey.bind(response, 'ABCD5555'), /400: Bad input/);
				assert.throws(response.getEntityByKey.bind(response, 'LORE1234'), /Key LORE1234 is not present in the request/);
			});
		});
	});
});