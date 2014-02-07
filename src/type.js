define(function (require, exports, module) {

	var UNDEFINED;
	var objProto = Object.prototype,
	hasOwn = objProto.hasOwnProperty;

	var isDefined = function (obj) {
		return obj !== UNDEFINED && obj !== null;
	}

	function _getType(object) {
		return objProto.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
	};

	/**
	 * Check for string
	 * @param {Object} s
	 */
	var isString = function (s) {
		return typeof s === 'string';
	}

	/**
	 * Check for object
	 * @param {Object} obj
	 */
	var isObject = function (obj) {
		return typeof obj === 'object';
	}

	/**
	 * Check for array
	 * @param {Object} obj
	 */
	var isArray = function (obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}

	/**
	 * Check for number
	 * @param {Object} n
	 */
	var isNumber = function (n) {
		return typeof n === 'number';
	}

	var isEmpty = function (object) {
		if (isArray(object)) {
			return object.length == 0;
		} else {
			for (var k in object) {
				return false;
			}
			return true;
		}
	}

	
	var isEqual = function (a, b) {
		if (a === b) {
			return true;
		} else if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined" || _getType(a) !== _getType(b)) {
			return false;
		} else {
			switch (_getType(a)) {
			case "String":
			case "Boolean":
			case "Number":
			case "Null":
			case "Undefined":
				//处理简单类型的伪对象与字面值相比较的情况,如1 v new Number(1)
				if (b instanceof a.constructor || a instanceof b.constructor) {
					return a == b;
				}
				return a === b;
			case "NaN":
				return isNaN(b);
			case "Date":
				return +a === +b;
			case "NodeList":
			case "Arguments":
			case "Array":
				var len = a.length;
				if (len !== b.length)
					return false;
				for (var i = 0; i < len; i++) {
					if (!isEqual(a[i], b[i])) {
						return false;
					}
				}
				return true;
			default:
				for (var key in b) {
					if (!isEqual(a[key], b[key])) {
						return false;
					}
				}
				return true;
			}
		}
	}

	module.exports = {
		isDefined : isDefined,
		isNumber : isNumber,
		isArray : isArray,
		isObject : isObject,
		isString : isString,
		isEmpty : isEmpty,
		isEqual : isEqual,
		getType : _getType
	}

})