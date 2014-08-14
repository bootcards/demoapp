var bc = require('../bootcards-functions.js');

exports.list = function(req, res) {
	res.renderPjax('dashboard', {
   		menu: bc.getActiveMenu(menu, 'dashboard')
  	});
};