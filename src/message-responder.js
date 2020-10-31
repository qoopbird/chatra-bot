class Responder {
	constructor() {
		this.bullyTargets = [];
	}
	handleMessage(msg) {
		if (this.bullyTargets.includes(msg.author.id)) {
			msg.channel.send(insult(msg));
		}
	}
	bully(target) {
		this.bullyTargets.push(target.id);
	}
	stopBullying() {
		this.bullyTargets = [];
	}
}

function insult(msg) {
	let numInsults = randomRange(2, 4);
	let response = `<@${msg.author.id}>`;
	let insults = [
		"you baby",
		"you piss baby",	// could add a command to teach it new ones
		"go cry, idiot baby",
		"you have dumb kidneys",
		":middle_finger:",
		":brain: this is your brain, to scale. its small cuz ur dumb",
		"cry me a river dumb baby",
		"what a dumb thing to say",
		"go think about how dumb u are",
		`${msg.author.tag} is such a baby`,
		":baby:",
		"stupid :rage:",
		":triumph:",
		"nerd! :nerd:",
		":rolling_eyes:",
		"go be dumb with the other dumb babies",
		"all the words coming out of your mouth mean dumb things",
		`who would even say something like "${msg.content}"`,
		"baby",
		"baaaaabey",
		"me: :sunglasses:\nyou: :clown:",
	];
	for (let i = 0; i < numInsults; i++) {
		shuffle(insults);
		newInsult = insults.pop();
		response += "\n"
		response += newInsult
	}
	return response;
}

function randomRange(low, high) {
	return Math.floor(Math.random() * (high - 1) + low);
}

function shuffle(array) {
	for (index in array) {
		let swapWith = randomRange(index, array.length);
		let temp = array[index];
		array[index] = array[swapWith];
		array[swapWith] = temp;
	}
}

module.exports = {Responder};
