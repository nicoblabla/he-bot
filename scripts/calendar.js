var ical = require('node-ical')
var moment = require('moment')



var months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
var days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

var client;
function init(_client) {
	client = _client;
}
function showSalle(msg) {
	var now = moment();
	for (var i = 0; i < allEvents.horaire.length; i++) {
		if (isToday(allEvents.horaire[i].startDate.toDate())) {
			if (allEvents.horaire[i].endDate > now) {
				msg.channel.send("**" + allEvents.horaire[i].location + "** de " + allEvents.horaire[i].startDate.format('HH:mm') + " à " + allEvents.horaire[i].endDate.format('HH:mm') + " pour " + allEvents.horaire[i].title);
				return;
			}
		}
	}
	//console.log("no horaire");
	msg.channel.send("```Pas de cours aujourd'hui```");
}

function showHoraire(msg, cmds) {
	var date = moment();
	if (cmds.length > 1) {
		var index = days.indexOf(cmds[1]);
		if (index != -1) {
			var date = getNextDay(index);
		}
	}
	var str = "Horaire du " + dateToString(date.toDate()) + "\n";
	var hasMessage = true;
	str += getHoraire(date);
	if (hasMessage && msg)
		msg.channel.send(str);
}

function getHoraire(date = moment()) {
	str = "```";
	var hasMessage = false;
	for (var i = 0; i < allEvents.horaire.length; i++) {
		if (isSameDay(date.toDate(), allEvents.horaire[i].startDate.toDate())) {
			hasMessage = true;
			var dstr = allEvents.horaire[i].startDate.format('HH:mm') + " à " + allEvents.horaire[i].endDate.format('HH:mm');
			while (dstr.length < 15) {
				dstr += " ";
			}

			str += dstr + allEvents.horaire[i].title + " (" + allEvents.horaire[i].location + ")\n";
		}
	}
	if (!hasMessage) {
		str += "Rien à afficher";
	}
	str += "```";
	return str;
}

function getEvents(events, showAll = false) {
	var str = "```";
	var cpt = 0;
	for (var i = 0; i < events.length; i++) {
		var dayLeft = events[i].date.diff(moment().startOf("day"), 'days');
		if (dayLeft >= 0) {
			if (dayLeft == 0) {
				str += "Aujourd'hui:\n";
			} else if (dayLeft == 1) {
				str += "Demain:\n";
			} else if (dayLeft <= 7) {
				if (events[i].date.week() == moment().week()) {
					str += firstLetterUp(days[events[i].date.weekday()]) + ":\n";
				} else {
					str += firstLetterUp(days[events[i].date.weekday()]) + " prochain:\n";
				}
			} else if (dayLeft <= 31 || showAll || cpt < 5) {
				str += firstLetterUp(dateToString(events[i].date.toDate())) + ":\n";
			}
			if (dayLeft <= 31 || showAll || cpt < 5) {
				str += "\t" + events[i].title + "\n\n";
				cpt++;
			}
		}
	}
	if (cpt == 0) {
		str += "Rien à afficher";
	}
	str += "```";
	return str;
}

function test() {
	return getEvents(allEvents.events, true);
}

function showToday(msg) {
	var str = "";
	str += "**" + dateToString(new Date()) + "**\n\n";
	str += "Horaire du jour:\n";
	str += getHoraire();
	str += "\n\nProchains CP:\n";
	str += getEvents(allEvents.cps);
	str += "\n\nProchains devoirs:\n";
	str += getEvents(allEvents.events);
	str += "\nBonne journée !";
	if (msg)
		msg.channel.send(str);
	else {
		deleteInChannel('623990104758812692');
		deleteInChannel('624130953551282179');

		sendToChannel('623990104758812692', str);
		sendToChannel('624130953551282179', str);
	}
}

var allEvents = {horaire: [], cps: [], events: []};
function loadHoraire() {
	ical.fromURL('https://calendar.google.com/calendar/ical/drf9fkgb5as7cjp3ah64i71ug0%40group.calendar.google.com/public/basic.ics', {}, function (err, data) {
		allEvents = parseRecurent(data);
		allEvents.horaire.sort((a, b) => (new Date(a.startDate) > new Date(b.startDate)) ? 1 : -1);
		allEvents.cps.sort((a, b) => (new Date(a.date) > new Date(b.date)) ? 1 : -1);
		allEvents.events.sort((a, b) => (new Date(a.date) > new Date(b.date)) ? 1 : -1);
		//manageHoraire();
	});
}

function isToday(someDate)  {
	const today = new Date()
	return isSameDay(today, someDate);
}
function isSameDay(date1, date2) {
return date1.getDate() == date2.getDate() &&
		date1.getMonth() == date2.getMonth() &&
		date1.getFullYear() == date2.getFullYear()
}
function isDateBeforeToday(date) {
	return new Date(date.toDateString()) < new Date(new Date().toDateString());
}

function isDateTodayOrAfter(date) {
	return new Date(date.toDateString()) >= new Date(new Date().toDateString());
}

function convertToDate(str) {
	var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
	return new Date(str.replace(pattern,'$3-$2-$1'));
}

function getNextDay(day) {
	const today = moment().isoWeekday();
	if (today <= day) { 
		return moment().isoWeekday(day);
	} else {
		return moment().add(1, 'weeks').isoWeekday(day);
	}
}


function dateToString(date) {
	return days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()];
}

function firstLetterUp(str) {
	return str.replace(/^\w/, c => c.toUpperCase());
}

function sendToChannel(channelID, str) {
	var channel = client.channels.get(channelID);
	if (channel) {
		channel.send(str);
	}
}

function deleteInChannel(channelID) {
	var channel = client.channels.get(channelID);
	if (channel) {
		const messages = channel.fetchMessages({ limit: 100}) // Fetch last 100 messages
		.then(msgs => {
			channel.bulkDelete(msgs, true);
		}); // Remove the last 3 messages out of the collection to delete
	}
}


// Complicated example demonstrating how to handle recurrence rules and exceptions.
function parseRecurent(data) {

	var allEvents = {horaire: [], cps: [], events: []};
	for (var k in data) {

		// When dealing with calendar recurrences, you need a range of dates to query against,
		// because otherwise you can get an infinite number of calendar events.
		var rangeStart = moment("2019-08-01");
		var rangeEnd = moment("2019-12-31");


		var event = data[k]
		//console.log(event);
		//console.log(k);
		if (event.type === 'VEVENT') {

			var title = event.summary;
			var startDate = moment(event.start);
			var endDate = moment(event.end);

			// Calculate the duration of the event for use with recurring events.
			var duration = parseInt(endDate.format("x")) - parseInt(startDate.format("x"));

			// Simple case - no recurrences, just print out the calendar event.
			if (typeof event.rrule === 'undefined')
			{
				if (startDate.isBetween(rangeStart, rangeEnd)) {
					if (event.description.toLowerCase() == "cp") {
						allEvents.cps.push({
							'title': title,
							'date': startDate
						});
					} else if (isSameDay(new Date(event.start), new Date(event.end))) {
						allEvents.horaire.push({
							'title': title,
							'startDate': startDate,
							'endDate': endDate,
							'duration': duraction,
							'location': recurrencePlace
						});
					} else {
						allEvents.events.push({
							'title': title,
							'date': startDate
						});
					}
				}
				/*console.log('title:' + title);
				console.log('startDate:' + startDate.format('MMMM Do YYYY, h:mm:ss a'));
				console.log('endDate:' + endDate.format('MMMM Do YYYY, h:mm:ss a'));
				console.log('duration:' + moment.duration(duration).humanize());
				console.log();*/
			}

			// Complicated case - if an RRULE exists, handle multiple recurrences of the event.
			else if (typeof event.rrule !== 'undefined')
			{
				// For recurring events, get the set of event start dates that fall within the range
				// of dates we're looking for.
				var dates = event.rrule.between(
				  rangeStart.toDate(),
				  rangeEnd.toDate(),
				  true,
				  function(date, i) {return true;}
				)

				// The "dates" array contains the set of dates within our desired date range range that are valid
				// for the recurrence rule.  *However*, it's possible for us to have a specific recurrence that
				// had its date changed from outside the range to inside the range.  One way to handle this is
				// to add *all* recurrence override entries into the set of dates that we check, and then later
				// filter out any recurrences that don't actually belong within our range.
				if (event.recurrences != undefined)
				{
					for (var r in event.recurrences)
					{

						// Only add dates that weren't already in the range we added from the rrule so that 
						// we don't double-add those events.
						if (moment(new Date(r)).isBetween(rangeStart, rangeEnd) != true)
						{
							dates.push(new Date(r));
						}
					}
				}

				// Loop through the set of date entries to see which recurrences should be printed.
				for(var i in dates) {

					var date = dates[i];
					var curEvent = event;
					var showRecurrence = true;
					var curDuration = duration;

					startDate = moment(date);

					// Use just the date of the recurrence to look up overrides and exceptions (i.e. chop off time information)
					var dateLookupKey = date.toISOString().substring(0, 10);

					// For each date that we're checking, it's possible that there is a recurrence override for that one day.
					if ((curEvent.recurrences != undefined) && (curEvent.recurrences[dateLookupKey] != undefined))
					{
						// We found an override, so for this recurrence, use a potentially different title, start date, and duration.
						curEvent = curEvent.recurrences[dateLookupKey];
						startDate = moment(curEvent.start);
						curDuration = parseInt(moment(curEvent.end).format("x")) - parseInt(startDate.format("x"));
					}
					// If there's no recurrence override, check for an exception date.  Exception dates represent exceptions to the rule.
					else if ((curEvent.exdate != undefined) && (curEvent.exdate[dateLookupKey] != undefined))
					{
						// This date is an exception date, which means we should skip it in the recurrence pattern.
						showRecurrence = false;
					}

					// Set the the title and the end date from either the regular event or the recurrence override.
					var recurrenceTitle = curEvent.summary;
					var recurrencePlace = curEvent.location;
					endDate = moment(parseInt(startDate.format("x")) + curDuration, 'x');

					// If this recurrence ends before the start of the date range, or starts after the end of the date range, 
					// don't process it.
					if (endDate.isBefore(rangeStart) || startDate.isAfter(rangeEnd)) {
						showRecurrence = false;
					}

					if (showRecurrence === true) {

						/*console.log('title:' + recurrenceTitle);
						console.log('startDate:' + startDate.format('MMMM Do YYYY, h:mm:ss a'));
						console.log('endDate:' + endDate.format('MMMM Do YYYY, h:mm:ss a'));
						console.log('duration:' + moment.duration(curDuration).humanize());
						console.log();*/
						allEvents.horaire.push({
							'title': recurrenceTitle,
							'startDate': startDate,
							'endDate': endDate,
							'duration': curDuration,
							'location': recurrencePlace
						});
					}

				}
			}
		}
	}

	return allEvents;
}


module.exports.init = init;
module.exports.showSalle = showSalle;
module.exports.showHoraire = showHoraire;
module.exports.loadHoraire = loadHoraire;
module.exports.test = test;
module.exports.showToday = showToday;


