var bc = require('../bootcards-functions.js');
var moment	= require('moment');

exports.list = function(req, res) {
	res.renderPjax('notes', {
  		activities: notes,
  		note : notes[0],
   		menu: bc.getActiveMenu(menu, 'notes')
  	});
};

exports.read = function(req, res) {

	var note = bc.getNoteById(req.params.id);

	if (note != null) {

		

		res.renderPjax( exports.getNotePartialRenderer(note.type) , {
		 	activities : notes,
		   	note: note,
		    menu: bc.getActiveMenu(menu, 'notes')
		});

	}
	   
}

exports.edit = function(req, res) {

	res.renderPjax('activity_edit', {
	 	activities : notes,
	   	activity: bc.getNoteById(req.params.id),
	    menu: bc.getActiveMenu(menu, 'notes')
	});
   
}

/*a note can be added to a contact or company*/
exports.add = function(req, res) {

	if (req.params.contactId) {

		var contact = bc.getContactById(req.params.contactId);

		res.renderPjax('activity_edit', {
	  		activities: notes,
	  		activity : {
	  			date : new Date(),
	  			isNew : true
	  		},
	  		contact: contact,
	   		menu: bc.getActiveMenu(menu, 'notes')
	  	});
	} else {

		res.renderPjax('activity_edit', {
	  		activities: notes,
	  		activity : {
	  			date : new Date(),
	  			isNew : true
	  		},
	   		menu: bc.getActiveMenu(menu, 'notes')
	  	});

	}
};

exports.save = function(req, res) {

	//retrieve the parent contact
	var contact = bc.getContactById(req.body.contactId);

	if (contact != null) {
		//found the contact: add new note

		var note = {
			type: req.body.type,
			subject: req.body.subject,
			date: moment(req.body.date),
			parentIds : [contact.id],
			details: req.body.details
		}

		notes.push(note);

		res.renderPjax('contact', {
		 	contacts:contacts,
		   	menu: bc.getActiveMenu(menu, 'notes'),
		    contact: contact,
		    activities : bc.getNotesForParent(contact.id),
		});
	}

}

//returns the name of a partial used to render a specific note type
exports.getNotePartialRenderer = function(type) {
	var renderWith = 'notes/text';		//default template

	if (type == 'file') {
		renderWith = 'notes/file';
	} else if (type == 'todo') {
		renderWith = 'notes/todo';
	} else if (type == 'text') {
		renderWith = 'notes/text';
	} else if (type == 'media') {
		renderWith = 'notes/media';
	}

	return renderWith;

}

