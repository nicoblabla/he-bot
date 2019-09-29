const auth = require('./auth.json');
const Discord = require('discord.js');
var schedule = require('node-schedule');

const calendar = require('./scripts/calendar.js');
const itt = require('./scripts/imgToText/imgToText.js');
const autoTalk = require('./scripts/autoTalk/auto-talk.js');
const random = require('./scripts/random.js');



const client = new Discord.Client();

client.on('ready', () => {
	console.log('Ready');
	calendar.init(client);
	main();
	//itt.imgToText("https://cdn.discordapp.com/attachments/618874851129819138/624662585555288094/pdpFloc.jpg", 640);
});

client.on('message', msg => {
	if (msg.content.startsWith("he-") || msg.content.startsWith("he ") || msg.content.startsWith("He ") || msg.content.startsWith("HE ")) {
		var cmds = msg.content.substr(3).split(" ");
		var cmd = cmds[0].toLowerCase();
		if (cmd == 'rip') {
			const attachment = new Discord.Attachment('https://i.imgur.com/w3duR07.png');
			msg.channel.send(attachment);
		} else if (cmd == 'note') {
			var note = Math.floor(Math.random() * 51 + 10) / 10;
			msg.channel.send("Ta prochaine note sera un " + note);
		} else if (cmd == 'share') {
			msg.channel.send("https://files.bde-arc.ch/index.php/s/SHARE");
		} else if (cmd == 'cafet') {
			msg.channel.send("https://mycafet.he-arc.ch/apex/f?p=112:100");
		} else if (cmd == 'wiki') {
			msg.channel.send("https://ssl.horus.ch/~schaefer/bin/view/HEArc");
		} else if (cmd == 'intranet') {
			msg.channel.send("https://intranet.he-arc.ch/ing");
		} else if (cmd == 'notes') {
			msg.channel.send("https://age.hes-so.ch/imoniteur_AGEP/PORTAL4S.htm#tab4");
		} else if (cmd == "cp") {
			//manageCP(cmds, msg);
		} else if (cmd == "salle") {
			calendar.showSalle(msg);
		} else if (cmd == "horaire") {
			calendar.showHoraire(msg, cmds);
		} else if (cmd == "horaire-lisible") {
			msg.channel.send("https://calendar.google.com/calendar/embed?src=drf9fkgb5as7cjp3ah64i71ug0%40group.calendar.google.com&ctz=Europe%2FZurich");
		} else if (cmd == "today") {
			calendar.showToday();
		} else if (cmd == "konis") {
			msg.channel.send(random.showKonis());
		} else if (cmd == "merci") {
			msg.channel.send("de rien")
		} else if (cmd == "sapin") {
			msg.channel.send(random.createSapin(cmds[1], cmds[2]));
		} else if (cmd == "java") {
			msg.channel.send(random.chooseRandom());
		} else if (cmd == "txt") {
			itt.manageTxt(msg, cmds);
		} else if (cmd == "say") {
			random.say(msg, cmds);
		} else if (cmd == "yas") {
			random.yas(msg, cmds);
		} else if (cmd == "lab") {
			random.createLab(msg);
		} else if (cmd == "talk") {
			//msg.channel.send(autoTalk.getMessage());
		} else if (cmd == "autotalk") {
			//autoTalk.manageAutoTalk(msg, cmds);
		} else if (cmd == "help") {
			msg.channel.send(showHelp());
		} else if (cmd == "test") {
			//msg.channel.send(calendar.test());
		}
	} else {
		autoTalk.autoTalk(msg);
	}
	

});

function main() {
	calendar.loadHoraire();

	var shedule1 = schedule.scheduleJob('0 7 * * 1-5', function(){
		calendar.showToday();
	});
	var shedule2 = schedule.scheduleJob('0 6 * * 1-5', function(){
		loadHoraire();
	});
}


function showHelp() {
	return "```\
\n==Lien utile==\n\
he share\n\
he wiki\n\
he intranet\n\
he notes\n\
he cafet\n\
he horaire-lisible\n\
\n==HE-Arc==\n\
he horaire [jour de la semaine]\n\
he salle\n\
he note\n\
he java\n\
\n==fun==\n\
he txt [image]\n\
he sapin [taille] [tronc]\n\
he lab\n\
he konis\n\
he say [text]\n\
he yas [ʇxǝʇ]\n\
\
```\nby Nicolas\nhost by Antoine";
}


client.login(auth.token);
