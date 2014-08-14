var bc = require('../bootcards-functions.js');

exports.read = function(req, res){

	res.renderPjax('settings', {
  		menu: bc.getActiveMenu(menu, 'settings')
	});

};

exports.edit = function(req, res){

	res.renderPjax('settings_edit', {
  		menu: bc.getActiveMenu(menu, 'settings')
	});

};