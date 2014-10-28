/*
 * Bootcards Customers demo application
 */

var express = require('express');

//routes
var company 	= require('./routes/company');
var contact 	= require('./routes/contact');
var note 		= require('./routes/note');
var media 		= require('./routes/media');
var settings 	= require('./routes/settings');
var dashboard 	= require('./routes/dashboard');
var snippets 	= require('./routes/docs');
var sampleData	= require('./data');

var pjson = require('./package.json');		//read the package.json file to get the current version

var bc 			= require('./bootcards-functions');		//bootcards functions

var http 	= require('http');
var path 	= require('path');			//work with paths
var pjax 	= require('express-pjax');	//express pjax (partial reloads)
var hbs 	= require('express-hbs');	//express handlebars
var moment	= require('moment');		//moment date formatting lib
var app 	= express();

app.use(express.compress());
//enable Express session support
app.use( express.cookieParser() );
app.use( express.session({secret : 'QWERTY'}));

app.set('port', process.env.PORT || 3000);
app.engine( 'html', hbs.express3({
	partialsDir : __dirname + '/views'
}));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

//pjax middleware for partials
app.use(pjax());

//send session info to handlebars, check OS used to send correct stylesheet
app.use(function(req, res, next){

	var ua = req.headers['user-agent'];
	req.session.isAndroid = (ua.match(/Android/i) != null);
	req.session.isIos = (ua.match(/iPhone|iPad|iPod/i) != null);
	req.session.isDev = (process.env.NODE_ENV !='production');
	req.session.test = (process.env.NODE_ENV);

	res.locals.session = req.session;

	next();
});

app.use(express.favicon());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

var fiveDays = 5*86400000;

app.use(express.static(path.join(__dirname, 'public'), { maxAge: fiveDays } ) );

//register a helper for date formatting using handlebars
hbs.registerHelper("formatDate", function(datetime, format) {
  if (moment) {
    f = "ddd DD MMM YYYY HH:mm"
    return moment(datetime).format(f);
  }
  else {
    return datetime;
  }
});

//helper to get the icon for a item type
hbs.registerHelper("getIconForType", function(type) {
	return bc.getIconForType(type);
});

//helper to get the number of data elements
hbs.registerHelper('count', function(type) {
	switch (type) {
		case 'companies':
			return companies.length;
		case 'contacts':
			return contacts.length;
		case 'notes':
			return notes.length;
		case 'charts':
			return 4;
	}

	return 0;
});

//helper to get the stylesheet for the current user agent
hbs.registerHelper("getCSSforOS", function(session) {
	var bootCardsBase = "/bower_components/bootcards/";
	if (session.isAndroid) {
		return '<link href="' + bootCardsBase + 'dist/css/bootcards-android.min.css" rel="stylesheet" type="text/css" />';
	} else if (session.isIos) {
		return '<link href="' + bootCardsBase + 'dist/css/bootcards-ios.min.css" rel="stylesheet" type="text/css" />';
	} else {
		return '<link href="' + bootCardsBase + 'dist/css/bootcards-desktop.min.css" rel="stylesheet" type="text/css" />';
	}	
});

hbs.registerHelper("isMobile", function(session) {
	return '<script>var isDesktop = ' + (!session.isIos && !session.isAndroid) + ';</script>';
});

//helper to get the app version
hbs.registerHelper("getAppVersion", function() {
	return pjson.version;
});

//read sample data
companies = [];
notes = [];
contacts = [];

sampleData.read();

//setup menu
menu = [
	{ id : 'dashboard', name : 'Dashboard', title : 'Customers', icon : "fa-dashboard", active : false, url : '/dashboard'},
	{ id : 'companies', name : "Companies", title : 'Companies', icon : "fa-building-o", active : false, url : '/companies'},
	{ id : 'contacts', name : "Contacts", title : 'Contacts', icon : "fa-users", active : true, url : '/contacts'},
	{ id : 'notes', name : "Notes", title : 'Notes', icon : "fa-clipboard", active : false, url : '/notes'},
	{ id : 'charts', name : "Charts", title : 'Charts', icon : "fa-bar-chart-o", active : false, url : '/charts'},
	{ id : 'settings', name : "Settings", title : 'Settings', icon : "fa-gears", active : false, url : '/settings'}
];

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//routes
app.get('/', dashboard.list);
app.get('/dashboard', dashboard.list);

app.get('/companies', company.list);
app.get('/companies/add', company.add);
app.get('/companies/:id', company.read);
app.put('/companies/:id', company.save);
app.get('/companies/:id/edit', company.edit);

app.get('/companies/:id/notes', company.listNotes);	
app.get('/companies/:id/notes/add', company.addNote);	
app.get('/companies/:id/notes/:noteId', company.readNote);	
app.get('/companies/:id/notes/:noteId/edit', company.editNote);	
app.put('/companies/:id/notes', company.saveNote);		//save new note 
app.put('/companies/:id/notes/:noteId', company.saveNote);

app.get('/companies/:id/contacts/add', company.addContact);

app.get('/contacts', contact.list);			//list
app.put('/contacts', contact.save);			//save new contact
app.get('/contacts/add', contact.add);
app.get('/contacts/:id', contact.read);		//read a contact
app.put('/contacts/:id', contact.save);		//save a specific contact
app.get('/contacts/:id/edit', contact.edit);

app.get('/contacts/:id/notes', contact.listNotes);	
app.get('/contacts/:id/notes/add', contact.addNote);	
app.get('/contacts/:id/notes/:noteId', contact.readNote);	
app.get('/contacts/:id/notes/:noteId/edit', contact.editNote);	
app.put('/contacts/:id/notes', contact.saveNote);		//save new note in contact
app.put('/contacts/:id/notes/:noteId', contact.saveNote);	

app.get('/notes', note.list);
app.get('/notes/add/:contactId', note.add);
app.get('/notes/add', note.add);
app.get('/notes/:id', note.read);
app.get('/notes/:id/edit', note.edit);
app.put('/notes', note.save);

app.get('/charts', media.list);

app.get('/settings', settings.read);
app.get('/settings/edit', settings.edit);

app.get('/snippets/:id', snippets.show);

http
	.createServer(app)
	.listen(app.get('port'), function(){
  		console.log('Bootcards demo app listening on port ' + app.get('port'));
	}
);
