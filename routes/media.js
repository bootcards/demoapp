var bc = require('../bootcards-functions.js');

exports.list = function(req, res){

	res.renderPjax('charts', {
  		menu: bc.getActiveMenu(menu, 'charts')
	});

};