define(function (require, exports, module) {

	var Type = require('./type'),
	Event = require('./eventDispatcher');

	var Undefined;
	var _eventEmitter = new Event();

	function merge() {
		var i,
		args = arguments,
		len,
		ret = {},
		doCopy = function (copy, original) {
			var value,
			key;

			// An object is replacing a primitive
			if (typeof copy !== 'object') {
				copy = {};
			}

			for (key in original) {
				if (original.hasOwnProperty(key)) {
					value = original[key];

					// Copy the contents of objects, but not arrays or DOM nodes
					if (value && typeof value === 'object' && Object.prototype.toString.call(value) !== '[object Array]'
						 && typeof value.nodeType !== 'number') {
						copy[key] = doCopy(copy[key] || {}, value);

						// Primitives and arrays are copied over directly
					} else {
						copy[key] = original[key];
					}
				}
			}
			return copy;
		};

		// If first argument is true, copy into the existing object. Used in setOptions.
		if (args[0] === true) {
			ret = args[1];
			args = Array.prototype.slice.call(args, 2);
		}

		// For each argument, extend the return
		len = args.length;
		for (i = 0; i < len; i++) {
			ret = doCopy(ret, args[i]);
		}

		return ret;
	}

	/**
	 * Check if an element is an array, and if not, make it into an array. Like
	 * MooTools' $.splat.
	 */

	function splat(obj) {
		return isArray(obj) ? obj : [obj];
	}

	function extend(a, b) {
		var n;
		if (!a) {
			a = {};
		}
		for (n in b) {
			a[n] = b[n];
		}
		return a;
	}

	function extendClass(parent, members) {
		var object = function () {};
		object.prototype = new parent();
		extend(object.prototype, members);
		return object;
	}

	var Option = function (schema, error) {
		this.schema = {};
		this._val = {};
		this.error = extend({
				"required" : "missing configuration target",
				"typeError" : "type error",
			}, error);
		this.create(schema);
	};

	Option.prototype = {

		constructor : Option,

		error : function (key, type) {
			var msg = 'options error: option name "' + key + '"has an error:' + this.error[type];
			throw msg;
			if (win.console) {
				console.log(msg);
			}
		},
		get : function () {},
		set : function () {},

		//[{type:Number,name:"hello"}]

		create : function (schema) {
			if (!Type.isArray(schema)) {
				throw "schema类型错误"
			} //检验schema格式
			var source = schema;
			var plainObj = {},
			i = 0,
			l = source.length;

			for (; i < l; i++) {

				var singleInput = source[i];

				plainObj[singleInput['name']] = Type.isDefined(singleInput['default']) ? singleInput['default'] : Undefined;

			}
			console.log(plainObj)
			this._val = plainObj;
			this.schema = schema
		}

	};

	module.exports = Option;

})