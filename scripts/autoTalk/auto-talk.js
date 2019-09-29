let {PythonShell} = require('python-shell')
var fs = require('fs');


var messages = ["Generating messages pls wait..."];
var index = 0;
var autoTalkChannel = "";

function generateNewMessages() {
	PythonShell.run('./autoTalk/generate.py', [], function (err) {
		if (err) throw err;
		console.log('finished');

		fs.readFile('output.json', 'utf8', function(err, data) {
			if (err){
				console.log(err);
			} else {
				messages = JSON.parse(data);
			}
		});
	});
}

function getMessage() {
	var str = messages[index % messages.length];
	index++;
	if (index >= messages.length) {
		generateNewMessages();
		index = 0;
	}
	return str;
}
var canSendMessage = true;

function manageAutoTalk(msg, cmds) {
	if (cmds[1] == "start" || cmds[1] == "on") {
		autoTalkChannel = msg.channel.id;
		msg.channel.send("Auto-talk : On");
	} else if (cmds[1] == "stop" || cmds[1] == "off") {
		autoTalkChannel = "";
		msg.channel.send("Auto-talk : Off");
	}
}

function autoTalk(msg) {
	if (canSendMessage && msg.channel.id == autoTalkChannel && msg.author.id != "623784663386685440" && msg.author.id != "618871533238091786") {
		msg.channel.startTyping();
		canSendMessage = false;
		setTimeout(function() {
			msg.channel.send(getMessage());
			msg.channel.stopTyping();
			setTimeout(function() {
				canSendMessage = true;
			}, 400);
		}, 1100);
		
		/*console.log("send message");
		console.log(msg);*/
	}
}


module.exports.generateNewMessages = generateNewMessages;
module.exports.getMessage = getMessage;
module.exports.manageAutoTalk = manageAutoTalk;
module.exports.autoTalk = autoTalk;