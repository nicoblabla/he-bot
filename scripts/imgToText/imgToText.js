var ascii = require('./ascii.json');
const Jimp = require('jimp');

//62 * 31

const W = 62;
const H = 31;

for (var i = 0; i < ascii.length; i++) {
	ascii[i].darkness = map(ascii[i].darkness, 210, 255, 255, 0);
}
//console.log(ascii);


function manageTxt(msg, cmds) {
	if (msg.attachments.first() != undefined) {
		imgToText(msg, msg.attachments.first().url);
	} else {
		//console.log(msg.mentions.users.first());
		if (msg.mentions.users.first() != undefined) {
			if (msg.mentions.users.first().avatar != null) {
				imgToText(msg, "https://cdn.discordapp.com/avatars/" + msg.mentions.users.first().id + "/" + msg.mentions.users.first().avatar + ".png");
			}
		} else if (cmds.length > 1) {
			imgToText(msg, cmds[1]);
		}
	}
}
function imgToText(msg, url) {
	Jimp.read(url)
	.then(image => {
		var size = Math.min(image.bitmap.width, image.bitmap.height);
		var chunkWidth = Math.floor(size/W);
		var chunkHeight = Math.floor(size/H);
		var width = size - size % W;
		var height = size - size % H;

		var tab = createTableau();
		var nbByChunk = chunkWidth * chunkHeight;

		for (var i = 0; i < width; i++) {
			for (var j = 0; j < height; j++) {
				var idx = image.getPixelIndex(i, j);
				var red = image.bitmap.data[idx + 0];
				var green = image.bitmap.data[idx + 1];
				var blue = image.bitmap.data[idx + 2];
				var gray = (0.3 * red) + (0.59 * green) + (0.11 * blue);
				//var gray = (red + green + blue)/3;
				tab[Math.floor(j / chunkHeight)][Math.floor(i / chunkWidth)] += gray;
			}
		}
		var str = "";
		for (var j = 0; j < H; j++) {
			for (var i = 0; i < W; i++) {
				var c = tab[j][i] / nbByChunk;
				var dif = 1000;
				var char = "";
				for (var a = 0; a < ascii.length; a++) {
					if (Math.abs(c - ascii[a].darkness) < dif) {
						dif = Math.abs(c - ascii[a].darkness);
						char = ascii[a].char;
					} else {
						break;
					}
				}
				tab[j][i] = char;
				str += char;
			}
			str += "\n";
		}
		//console.log(str);
		msg.channel.send("```\n" + str + "```");
	})
	.catch(err => {
		console.log(err);
	});
	
}

function createTableau() {
	var array = [];
	for (var i = 0; i < H; i++) {
		array.push([]);
		for (var j = 0; j < W; j++) {
			array[i].push(0);
		}
	}

	return array;
}

function map(n, start1, stop1, start2, stop2) {
	return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

module.exports.imgToText = imgToText;
module.exports.manageTxt = manageTxt;
