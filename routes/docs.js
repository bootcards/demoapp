var bc = require('../bootcards-functions.js');
var fs 		= require('fs');			//work with filesystem
var path = require('path');

exports.show = function(req, res){
	
	var appDir = path.dirname(require.main.filename);
	var dataFile = appDir + '/public/snippets/' + req.params.id + '.html';
	fs.readFile(dataFile, 'utf8', function (err, data) {

		if (err) {
			console.log('Error reading data file: ' + err);
			return;
		}

		data = data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		
		res.renderPjax('docs', {
  			content: '<pre><code class="html">' + data + '</code></pre>'
		});

		
	});

};