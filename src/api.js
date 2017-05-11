'use strict';

const request = require('./request');

const functions = {
	api: function(key, opts) {
		return ef.bind({})({
			...opts,
			authorization: `Bearer ${key}`
		});
	},

	library: function() {
		var libraryKey;
		if(arguments.length > 1) {
			switch(arguments[0].toLowerCase()) {
				case 'user':
					libraryKey = `u${arguments[1]}`;
				break;
				case 'group':
					libraryKey = `g${arguments[1]}`;
				break;
				default:
					throw new Error(`Unrecognized library type ${arguments[0]}`);
			}
		} else {
			libraryKey = arguments[0];
		}

		return efr.bind(this)({
			library: libraryKey
		})
	},

	items: function(items) {
		return efr.bind(this)({
			items: items || null
		})
	},

	itemTypes: function() {
		return efr.bind(this)({
			itemTypes: null
		});
	},

	itemFields: function() {
		return efr.bind(this)({
			itemFields: null
		});
	},

	creatorFields: function() {
		return efr.bind(this)({
			creatorFields: null
		});
	},

	itemTypeFields: function(itemType) {
		return efr.bind(this)({
			itemTypeFields: null
		}, itemType ? { itemType } : {});
	},

	itemTypeCreatorTypes: function(itemType) {
		return efr.bind(this)({
			itemTypeCreatorTypes: null
		}, itemType ? { itemType } : {});
	},

	template: function(itemType) {
		return efr.bind(this)({
			template: null
		}, itemType ? { itemType } : {});
	},

	collections: function(collections) {
		return efr.bind(this)({
			collections: collections || null
		})
	},

	tags: function(tags) {
		return efr.bind(this)({
			tags: tags || null
		})
	},

	searches: function(searches) {
		return efr.bind(this)({
			searches: searches || null
		})
	},

	top: function() {
		return efr.bind(this)({
			top: null
		})
	},

	trash: function() {
		return efr.bind(this)({
			trash: null
		})
	},

	children: function() {
		return efr.bind(this)({
			children: null
		})
	},

	version: function(version) {
		return ef.bind(this)({
			version: version || null
		})
	},

	get: function(opts) {
		let requestConfig = {
			...this,
			...opts,
			method: 'get'
		};

		if('version' in requestConfig) {
			requestConfig['ifModifiedSinceVersion'] = requestConfig['version'];
			delete requestConfig['version'];
		}

		return request(requestConfig);
	},

	post: function(data, opts) {
		let requestConfig = {
			...this,
			...opts,
			body: data,
			method: 'post'
		};

		if('version' in requestConfig) {
			requestConfig['ifUnmodifiedSinceVersion'] = requestConfig['version'];
			delete requestConfig['version'];
		}

		return request(requestConfig);

	},

	put: function(data, opts) {
		let requestConfig = {
			...this,
			...opts,
			body: data,
			method: 'put'
		};

		if('version' in requestConfig) {
			requestConfig['ifUnmodifiedSinceVersion'] = requestConfig['version'];
			delete requestConfig['version'];
		}

		return request(requestConfig);

	},

	patch: function(data, opts) {
		let requestConfig = {
			...this,
			...opts,
			body: data,
			method: 'patch'
		};

		if('version' in requestConfig) {
			requestConfig['ifUnmodifiedSinceVersion'] = requestConfig['version'];
			delete requestConfig['version'];
		}

		return request(requestConfig);
	},

	delete: function(keysToDelete, opts) {
		let requestConfig = {
			...this,
			...opts,
			method: 'delete'
		};

		if('version' in requestConfig) {
			requestConfig['ifUnmodifiedSinceVersion'] = requestConfig['version'];
			delete requestConfig['version'];
		}

		if('resource' in requestConfig && 'items' in requestConfig.resource) {
			relevantSearchKey = 'itemKey';
		} else if('resource' in requestConfig && 'collections' in requestConfig.resource) {
			relevantSearchKey = 'collectionKey';
		} else if('resource' in requestConfig && 'tags' in requestConfig.resource) {
			relevantSearchKey = 'tag';
		} else if('resource' in requestConfig && 'searches' in requestConfig.resource) {
			relevantSearchKey = 'searchKey';
		} else {
			throw new Error('Called delete() without first specifing what to delete.')
		}

		if(keysToDelete) {
			var relevantSearchKey;
			
			requestConfig[relevantSearchKey] = [
				...(requestConfig[relevantSearchKey] || []),
				...keysToDelete
			]
		}

		return request(requestConfig);
	},

	_getConfig: function() {
		return this;
	}
};

const ef = function(opts) {
	let context = { ...this, ...opts };
	let enhancedFunctions = {};
	for(let fname in functions) {
		enhancedFunctions[fname] = functions[fname].bind(context)
	}

	return enhancedFunctions;
}

const efr = function(resource, opts) {
	resource = { ...this.resource, ...resource };
	opts = { ...opts, resource};
	return ef.bind(this)(opts);
}

module.exports = functions;