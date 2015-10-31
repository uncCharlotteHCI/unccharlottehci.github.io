// Developer Console, https://console.developers.google.com
var CLIENT_KEY = 'AIzaSyDszN0ttLOjju1Ns6tNCX4x5Cxei8irpoI';

function handleClientLoad() {
    gapi.client.setApiKey(CLIENT_KEY);
    // window.setTimeout(checkAuth, 1);
    loadCalendarApi();
}

/**
* Initiate auth flow in response to user clicking authorize button.
*
* @param {Event} event Button click event.
*/
function handleAuthClick(event) {
	gapi.auth.authorize(
	  	{client_id: CLIENT_ID, scope: SCOPES, immediate: false},
	  		handleAuthResult);
	return false;
}

/**
* Load Google Calendar client library. List upcoming events
* once client library is loaded.
*/
function loadCalendarApi() {
	// gapi.client.load('calendar', 'v3', listUpcomingEvents);
	gapi.client.load('calendar', 'v3').then(listUpcomingEvents);
}

/**
* Print the summary and start datetime/date of the next ten events in
* the authorized user's calendar. If no events are found an
* appropriate message is printed.
*/
function listUpcomingEvents() {
	var date = new Date();
	var month = date.getMonth();
	var year = date.getYear();
	var lastDayInMonth = new Date(year, month + 1, 0);
	var firstDayInMonth = new Date(year, month, 1);
	var request = gapi.client.calendar.events.list({
	  'calendarId': '3kklvjqft982m0crtsjgu8qhgo@group.calendar.google.com',
	  'timeMin': firstDayInMonth.toISOString(),
	  'showDeleted': false,
	  'singleEvents': true,
	  'orderBy': 'startTime'
	});
	request.execute(function(resp) {
	  	var events = resp.items;
	  	var calendarEvents = [];
	  	if (events.length > 0) {
	    	for (i = 0; i < events.length; i++) {
	      		var event = events[i];
	      		var calendarEvent = {};
	      		calendarEvent.title = event.summary;
	      		calendarEvent.id = i + 1;
	      		calendarEvent.class = "event-important";
	      		var when = event.start.dateTime;
	      		if (!when) {
	        		when = event.start.date;
	      		}
	      		calendarEvent.start = new Date(when).getTime();
	      		var end = event.end.dateTime;
	      		if (!end) {
	      			end = event.end.date;
	      		}
	      		calendarEvent.end = new Date(end).getTime();

	      		calendarEvents.push(calendarEvent);
	    	}
		} else {
	    	console.log('No upcoming events found.');
	  	}
	  	$(".loading-spinner").remove();
	  	loadCalendar(calendarEvents);
	});
}

function loadCalendar (events) {
	var options = {
		events_source: events,
		view: 'month',
		tmpl_path: 'tmpls/',
		tmpl_cache: false,
		onAfterEventsLoad: function(events) {
			if(!events) {
				return;
			}
			var list = $('#eventlist');
			list.html('');

			$.each(events, function(key, val) {
				$(document.createElement('li'))
					.html('<a href="' + val.url + '">' + val.title + '</a>')
					.appendTo(list);
			});
		},
		onAfterViewLoad: function(view) {
			$('.page-header h3').text(this.getTitle());
			$('.btn-group button').removeClass('active');
			$('button[data-calendar-view="' + view + '"]').addClass('active');
		},
		classes: {
			months: {
				general: 'label'
			}
		}
	};

	var calendar = $('#calendar').calendar(options);

	$('.btn-group button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.navigate($this.data('calendar-nav'));
		});
	});

	$('.btn-group button[data-calendar-view]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.view($this.data('calendar-view'));
		});
	});
}
