var bc = require('../bootcards-functions.js');
var moment	= require('moment');
var note = require('./note');

exports.list = function(req, res){

	var firstId = contacts[0].id;

	res.renderPjax('contacts', {
  		contacts : contacts,
  		contact : bc.getContactById(firstId),
   		menu: bc.getActiveMenu(menu, 'contacts')
	});
};

exports.read = function(req, res) {

	res.renderPjax('contact', {
	 	contacts:contacts,
	   	contact: bc.getContactById(req.params.id),
	    menu: bc.getActiveMenu(menu, 'contacts')
	});
   
}

exports.edit = function(req, res) {

	res.renderPjax('contact_edit', {
	 	contacts:contacts,
	   	menu: bc.getActiveMenu(menu, 'contacts'),
		contact: bc.getContactById(req.params.id)
	});
   
}

exports.add = function(req, res) {

	if (req.params.companyId) {

		var company = (req.params.companyId ? bc.getCompanyById(req.params.companyId) : null);

		res.renderPjax('contact_edit', {
	  		contacts:contacts,
	  		contact : {
	  			isNew : true,
	  			companyId : (company ? company.id : null)
	  		},
	   		menu: bc.getActiveMenu(menu, 'contacts')
	  	});
	} else {
		res.renderPjax('contact_edit', {
	  		contacts:contacts,
	  		contact : {
	  			isNew : true
	  		},
	   		menu: bc.getActiveMenu(menu, 'contacts')
	  	});
	}
};

exports.save = function(req,res) {

	var contact = bc.getContactById(req.params.id);

	if (contact != null) {
		//found the contact: update it
		contact.firstName = req.body.firstName;
		contact.lastName = req.body.lastName;
		contact.email = req.body.email;
		contact.phone = req.body.phone;
		contact.jobTitle = req.body.jobTitle;
		contact.department = req.body.department;
		contact.salutation = req.body.salutation;
	}

	res.renderPjax('contacts', {
	 	contacts:contacts,
	   	menu: bc.getActiveMenu(menu, 'contacts'),
	    contact: contact
	});

}

/* NOTES */

exports.listNotes = function(req, res) {

	res.renderPjax('activities_for_contact', {
  		contact : bc.getContactById(req.params.id)
	});

}

exports.readNote = function(req, res) {

	var contact = bc.getContactById( req.params.id);
	contact.isContact = true;

	var tgtNote = bc.getNoteById(req.params.noteId);

	res.renderPjax( note.getNotePartialRenderer(tgtNote.type), {
		contact : contact,
  		note : tgtNote
	});
}
exports.editNote = function(req, res) {

	var contact = bc.getContactById( req.params.id);
	contact.isContact = true;

	var note = bc.getNoteById( req.params.noteId);

	res.renderPjax('contact_activity_edit', {
		contact : contact,
		activity : note
	});
}
exports.addNote = function(req, res) {
	
	var contact = bc.getContactById(req.params.id);

	res.renderPjax('contact_activity_edit', {
  		contact: contact,
  		activity : {
  			date : moment().format("DD/MM/YYYY HH:mm"),
  			isNew : true
  		}
	});
}

exports.saveNote = function(req, res) {

	var note;
	var contact = bc.getContactById(req.params.id);

	if (req.params.noteId) {

		note = bc.getNoteById(req.params.noteId);
		note.type = req.body.type;
		note.subject = req.body.subject;
		note.date = moment(req.body.date, "DD/MM/YYYY HH:mm");
		note.details = req.body.details;

	} else {

		note = {
			id: bc.getUniqueId(),
			parentIds : [req.params.id],
			type: req.body.type,
			subject: req.body.subject,
			date: moment(req.body.date, "DD/MM/YYYY HH:mm"),
			details: req.body.details
		}

		notes.push(note);
		contact.notes.push(note);

	}

	if (contact != null) {

		res.renderPjax('activities_for_contact', {
	  		contact : contact
		});
	}

}