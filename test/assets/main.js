define(function (require, exports, module) {

	var opt = require('../../src/options.js');

	var option = new opt([{
					type : "Number",
					name : "hello",
				default:
					123
				}
			])

		console.log(option._val)

})