define(function (require, exports, module) {

	var opt = require('../../src/options.js');

	var option = new opt({
			id : {
				type : "Number",
				name : "hello",
			default:
				123
			}
		})

		console.log(option._val)
		
		option.set('id',44);
		//option.set('id','aa');
		console.log(option._val)
		option.set('ddd',44)
		console.log(option._val)
})