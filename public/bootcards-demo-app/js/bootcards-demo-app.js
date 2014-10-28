/* toggle between the chart and data */
function toggleChartData(event, chart) {

	var $ev = $(event.target);
	var $chart = $ev.parents('.bootcards-chart');

	if ($chart.length>0) {

		$chart.fadeOut( 'fast', function()  {
			$chart
				.siblings('.bootcards-table')
					.fadeIn('fast');
		});

	} else {
		
		var $data = $ev.parents('.bootcards-table');
		$data.fadeOut( 'fast', function()  {
			$data
				.siblings('.bootcards-chart')
					.fadeIn('fast', function() {
						if (typeof chart != 'undefined' && chart != null) { chart.redraw();}
					});
		});

	}
			
}

/*
 * Add click handlers to links to force a pjax (partial) load
 * http://pjax.heroku.com/
 */
bootcards.addPJaxHandlers = function(pjaxTarget) {

	//add pjax click handler to links
	$('a.pjax').off().on('click', function(e) {
		var $this = $(this);
		var tgtUrl = $this.attr('href');

		$.pjax( {
			container : pjaxTarget,
			url : tgtUrl
		});

		//add active class if this is a list item (removing it from all siblings)
		if ($this.hasClass('list-group-item')) {
			$this
				.addClass('active')
				.siblings()
					.removeClass('active');
		}

		e.preventDefault();
	});

};

/*
 * Setup publish/ subscribe mechanism for changing main menu option
 * Based on jQuery Callbacks
 * https://api.jquery.com/jQuery.Callbacks/
 */
bootcards.topics = {};
 
jQuery.Topic = function( id ) {
  var callbacks, method,
    topic = id && bootcards.topics[ id ];
 
  if ( !topic ) {
    callbacks = jQuery.Callbacks();
    topic = {
      publish: callbacks.fire,
      subscribe: callbacks.add,
      unsubscribe: callbacks.remove
    };
    if ( id ) {
      bootcards.topics[ id ] = topic;
    }
  }
  return topic;
};

//pjax on all a's that have the data-pjax attribute (the attribute's value is the pjax target container)
$(document).ready( function() {

	//publish event when changing main menu option
	$("a[data-title]").on("click", function() {
		$.Topic( "navigateTo" ).publish( $(this).data("title") );
	});

	var $body = $("body");

	//fix for status bar bug in iOS 8
	if (bootcards.isFullScreen) {
        $body
        	.prepend("<div class='statusbar' />")
            .addClass("fullscreen");
    }

    //destroy modals on close (to reload the contents when using the remote property)
    $body.on('hidden.bs.modal', '.modal', function () {  	
  		$(this).removeData('bs.modal');
	});

	var pjaxTarget = (bootcards.isXS() ? '#list' : '#listDetails');

	if (bootcards.isXS() ) {

		//restrict footer to only 4 items
		var $footer = $(".navbar-fixed-bottom .btn-group");
		if ($footer.length>0) {
			var $links = $('a', $footer);
		
			if ($links.length > 4) {
				$links.each( function(idx) {
					if (idx >= 4) { this.remove(); }
				});
			}
		}

	}
	
	bootcards.addPJaxHandlers(pjaxTarget);

	$(document)
	.pjax('a[data-pjax]')
	.on('submit', 'form[data-pjax]', function(event) {
		//use pjax to submit forms
  		$.pjax.submit(event);
	})
	.on('pjax:start', function(event) {

		//hide the offcanvas menu
		$("#offCanvasMenu").removeClass("active");
		$("#main").removeClass("active");

	})
	.on('pjax:end', function(event) {

		var $tgt = $(event.target);
		var tgtId = $tgt.attr('id');

		if ( bootcards.isXS() ) {
			//function only performed on small screens (smartphones)

			//we only use the list column
			var details = $('#listDetails');
			if (details.length>0) {
				details.remove();
			}

			//change class on container elements (list>card and vice versa)
			if ( tgtId == 'main') {

				$('#list')
					.removeClass('bootcards-cards')
					.addClass('bootcards-list');
				
				//show the back button
				$('.btn-menu').removeClass('hidden');
				$('.btn-back').addClass('hidden');

				//get the panel 
				var $main = $("#main");
				var $panel = $("#main > .panel");
				if ($panel.length>0) {

					var row = $('<div class="row"></div>');
					var container = $('<div class="col-sm-5 bootcards-list" id="list"></div>')
						.appendTo(row);

					$panel.appendTo(container);

					row.appendTo($main);
				}

			} else if (tgtId == 'list') {
				
				var $list = $('#list');

				if ( !$list.hasClass('bootcards-cards')) {

					$list
						.addClass('bootcards-cards')
						.removeClass('bootcards-list');

					//show the menu button
					$('.btn-menu').addClass('hidden');
					$('.btn-back').removeClass('hidden');

					//scroll to the top of the card
					$list.animate({scrollTop:0}, '500', 'easeOutExpo'); 
				}
				
			}
			
		}

		bootcards.addPJaxHandlers(pjaxTarget);

		//highlight first list group option (if non active yet)
		if ( $('.list-group a.active').length === 0 ) {
			$('.list-group a').first().addClass('active');
		}

		//enable single pane portrait mode when loading content with pjax
		if ( tgtId == 'main' && bootcards.portraitModeEnabled ) {

			//do some cleaning up first
            if (bootcards.listOffcanvasToggle) {
                bootcards.listOffcanvasToggle.remove();
                bootcards.listTitleEl.remove();
                Bootcards.OffCanvas.$menuTitleEl.remove();
            }
            bootcards.listOffcanvasToggle = null;
            bootcards.listTitleEl = null;
            Bootcards.OffCanvas.$menuTitleEl = null;
            bootcards.listEl = null;
            bootcards.cardsEl = null;

			bootcards._setOrientation(true);

			if (bootcards.listTitleEl) {
				bootcards.listTitleEl.find('button').show();
			}

			//add the resize events again
			$(window)
				.off()
		        .on( 'resize', function() { 
		        	setTimeout( function() {
		                bootcards._setOrientation(false);
		                if (chartSalesProductType !== null) { chartSalesProductType.redraw(); }
		                if (closedSalesChart !== null) { closedSalesChart.redraw(); }
		                if (dbSizeChart !== null) { dbSizeChart.redraw(); }
		                if (barChartClosedSales !== null) { barChartClosedSales.redraw(); }
		            } , 250);
		        } );
               
		}

	})
	.on('pjax:complete', function(event) {
		//called after a pjax content update
		
		//check for any modals to close
		var modal = $(event.relatedTarget).closest('.modal');
		if (modal.length) {
			modal.modal('hide');
		}

	});

});

//show a confirmation dialog before NOT deleting an item: this is a demo app after all...
bootcards.confirmDelete = function(type) {

	if ( confirm('Are you sure?') ) {
		var modal = $(event.target).closest('.modal');
		if (modal.length>0) {
			modal.modal('hide');
		}
	}
	return false;

};

/*
 * Enable FTLabs' FastClick
 * https://github.com/ftlabs/fastclick
 */
window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

//functions to perform if the main menu option has changed
$.Topic( "navigateTo" ).subscribe( function(value) {
	
	//change header title - only on mobile
	if (!isDesktop ) {
		$('.navbar-brand').text(value);
	}

	//change active menu option in all navigation menus
	$("a[data-title='" + value + "']").each( function() {

		var $this = $(this);
		var $li = $this.parent('li');

		//add active class to either a parent LI or current A
		($li.length>0 ? $li : $this)
			.addClass('active')
			.siblings('.active')
				.removeClass('active');
	});

} );

