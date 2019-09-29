/*
		NOT USED ANYMORE
*/

function manageCP(cmds, msg) {
	if (cmds.length == 1) {
		showCP(msg);
	} else if (cmds[1] == "add") {
		if (cmds.length > 2) {
			var date = convertToDate(cmds[2]);
			if (isNaN(date.getTime())) {
				msg.channel.send("Date invalide (he cp add dd.mm.yyyy nom)");
				return;
			}
			cmds.splice(0,3);
			var name = cmds.join(" ");
			if (name == "") {
				msg.channel.send("Nom invalide (he cp add dd.mm.yyyy nom)");
				return;
			}
			msg.channel.send("Ajout de " + name + " le " + dateToString(date));
			cps.push({name: name, date: date.toString()});
			saveCP();
		} else {
			msg.channel.send("Commande invalide (he cp add dd.mm.yyyy nom)");
		}
	} else if (cmds[1] == "remove") {
		var id = parseInt(cmds[2]);
		if (!isNaN(id) && id >= 0 && id < cps.length) {
			var cp = cps.splice(id, 1);
			msg.channel.send("Suppression de " + cp[0].name + " le " + dateToString(new Date(cp[0].date)));
			saveCP();		
		} else {
			msg.channel.send("Erreur de format (he cp remove id)");
		}
	} else if (cmds[1] == "today") {
		showToday();
	} else if (cmds[1] == "save") {
		saveCP();
	} else if (cmds[1] == "help") {
		msg.channel.send("```he cp\
\n\the cp add dd.mm.yyyy nom\
\n\the cp remove id\```");
	}
}


function showToday() {
	var nbMessage = 0;

	var str = "```";
	for (var i = 0; i < cps.length; i++) {
		if (isToday(new Date(cps[i].date))) {
			nbMessage++;
			str += cps[i].name + "\n";
		} else if (isDateBeforeToday(new Date(cps[i].date))) {
			cps.splice(i, 1);
			i--;
		}
	}
	str += "```"
	str = nbMessage + " CP aujourd'hui:\n" + str;
	saveCP();
	if (nbMessage > 0) {
		//client.channels.get('618874851129819138').send(str);
		client.channels.get('623990104758812692').send(str); //he-bot
		//client.channels.get('624130953551282179').send(str); //he-bot-test
	}
}



var cps = [];

fs.readFile('cps.json', 'utf8', function(err, data) {
	if (err){
		console.log(err);
	} else {
		cps = JSON.parse(data); //now it an object		
	}
});

function saveCP() {
	cps.sort((a, b) => (new Date(a.date) > new Date(b.date)) ? 1 : -1);
	fs.writeFile('cps.json', JSON.stringify(cps), 'utf8', function(error) {

	});
}



function showCP(msg) {
	var hasMessage = false;
	var str = "```";
	for (var i = 0; i < cps.length; i++) {
		var date = new Date(cps[i].date);
		if (isDateTodayOrAfter(date)) {

			var dstr = i + ". " + dateToString(date) + " : ";
			while(dstr.length < 30) {
				dstr += " ";
			}
			str += dstr + cps[i].name + "\n";
			hasMessage = true;
		}
	}
	str += "```";
	if (hasMessage)
		msg.channel.send(str);
	else {
		msg.channel.send("Aucun CP de programmé !");
	}
}