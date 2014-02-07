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

	function _bind(fn, context) {
		var args,
		proxy,
		tmp;

		if (typeof context === "string") {
			tmp = fn[context];
			context = fn;
			fn = tmp;
		}

		// Simulated bind
		args = Array.prototype.slice.call(arguments, 2);
		proxy = function () {
			return fn.apply(context || this, args.concat(Array.prototype.slice.call(arguments)));
		};

		return proxy;
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
		this.errorString = extend({
				"required" : "missing configuration target",
				"typeError" : "type error",
				"undefine" : "not defined",
			}, error);
		this.create(schema);
		_eventEmitter.on('set', _bind(this._handleSetter, this))
	};

	Option.prototype = {

		constructor : Option,

		error : function (key, type) {
			var msg = 'options error: option name "' + key + '"has an error:' + this.errorString[type];
			if (window.console) {
				console.log('%c' + msg, 'color:blue');
			}
			throw msg;
		},
		get : function () {},
		set : function (key, value) {
			if (Type.isString(key)) {

				_eventEmitter.trigger('set', key, value);

			} else if (Type.isObject(key)) {

				for (var singleKey in key) {
					_eventEmitter.trigger('set', singleKey, key[singleKey]);
				}

			}
		},
		_handleSetter : function (key, value) {

			Type.isObject(this.schema[key]) || this.error(key, 'undefine');

			Type.getType(value) !== this.schema[key]['type'] && this.error(key, 'typeError');

			this._val[key] = value;
		},

		//[{type:Number,name:"hello"}]
			
		create : function (schema) {
			if (!Type.isObject(schema)) {
				throw "schema类型错误"
			} //检验schema格式
			var source = schema;
			var plainObj = {},
			key;

			for (key in source) {

				var singleInput = source[key];

				plainObj[key] = Type.isDefined(singleInput['defaultValue']) ? singleInput['defaultValue'] : Undefined;

			}

			this._val = plainObj;
			this.schema = schema
		},
		assign : function (opt) {
			for (n in opt) {
				this.set(n, opt[n])
			}
			return this._val;
		}

	};

	module.exports = Option;

})