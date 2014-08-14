var fs 		= require('fs');			//work with filesystem
var bc = require('../bootcards-functions.js');

exports.read = function() {

	var dataFile = __dirname + '/data.json';
	fs.readFile(dataFile, 'utf8', function (err, data) {

		if (err) {
			console.log('Error reading data file: ' + err);
			return;
		}

		var jsonContents = JSON.parse(data);

		contacts = jsonContents.contacts;
		companies = bc.sortByField( jsonContents.companies, 'name');
		notes = jsonContents.notes;

		console.log("Sample data read. Found " + contacts.length + " contacts, " + companies.length + " companies, " + notes.length + " notes");
	});

}