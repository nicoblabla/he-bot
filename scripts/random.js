function createSapin(taille, tronc) {
	var str = "";
	if (taille >= 0 && taille <= 200 && tronc >= 0 && tronc <= 100) {
		str += "```";
		for	(var i = 0; i < taille; i++) {
			for (var j = 0; j < taille-i; j++) {
				str += " ";
			}
			for (var j = 0; j < i*2-1; j++) {
				str += "*";
			}
			str += "\n";
		}
		for (var i = 0; i < tronc; i++) {
			for (var j = 0; j < taille-2; j++) {
				str += " ";
			}
			str += "||\n";
		}
		str += "```";
		if (str.length < 2000) {
			return str;
		} else {
			return "Limite de caractères dépassée (2000)"
		}
	}
	return "Mauvais format (he sapin taille tronc)";
}


var listEtudiants = ["Louis", "Jonatan", "Marie", "Adrian", "Cédric", "Alan", "Nicola", "Massimo", "Guillaume", "Florian", "Mohamed", "Dimitri", "Nicolas", "Antoine", "Mathias", "Colin", "Alexis", "Sébastien", "Luca", "Valentin"];
function chooseRandom() {
	var theChoosenOne = listEtudiants[Math.floor(Math.random() * listEtudiants.length)];
	return theChoosenOne;
}


function createLab(msg) {
	var str = "```\n";
	for (var i = 0; i < 20; i++) {
		for (var j = 0; j < 20; j++) {
			if (Math.random() < 0.5) {
				str += "╱╱";
			} else {
				str += "╲╲";
			}
		}
		str += "\n";
	}
	str += "```";
	msg.channel.send(str);
}


function say(msg, cmds) {
	if (cmds.length > 1) {
		cmds.splice(0,1);
		var txt = cmds.join(" ");
		msg.delete();
		msg.channel.send(txt);
	}
}

function yas(msg, cmds) {
	if (cmds.length > 1) {
		cmds.splice(0,1);
		var txt = cmds.join(" ");
		msg.delete();
		var alphabet = { a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z'};
		var str = "";
		for (var i = 0; i < txt.length; i++) {
			if (alphabet[txt[txt.length - i - 1]] != undefined) {
				str += alphabet[txt[txt.length - i - 1]];
			} else {
				str += txt[txt.length - i - 1];
			}
		}
		msg.channel.send(str);
	}
}


function showKonis() {
	return "Mit Konis Hupen ist Stimmung garantiert\n\
weil bei uns Show und Spaß\n\
ganz groß geschrieben wird\n\
Und Konis Hupen\n\
das weiß doch jedes Kind\n\
erklingen immer da\n\
wo Freunde sind\n\
Mit Konis Hupen ist Stimmung garantiert\n\
weil bei uns Show und Spaß\n\
ganz groß geschrieben wird\n\
Und Konis Hupen\n\
das weiß doch jedes Kind\n\
erklingen immer da\n\
wo Freunde sind\n\
\n\
Original: https://youtu.be/PcRyjkYdDxM\n\
Trap Remix: https://youtu.be/Z5QOfDVKyC8\n"
}


module.exports.createSapin = createSapin;
module.exports.chooseRandom = chooseRandom;
module.exports.createLab = createLab;
module.exports.say = say;
module.exports.yas = yas;
module.exports.showKonis = showKonis;

