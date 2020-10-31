const Discord = require('discord.js');
const client = new Discord.Client();

const CommandHandler = require('./command-handler.js');
const SaveHandler = require('./save-handler.js');
const MessageResponder = require('./message-responder.js');

client.on('ready', () => {
	client.user.setActivity('Virtual Trashcans', {type: 'WATCHING'})
	console.log(`Logged in as ${client.user.tag}!`);
});

let responder = new MessageResponder.Responder();

CommandHandler.RegisterResponder(responder);

client.on('message', msg => {
	if (msg.member.id != client.user.id) {
		CommandHandler.HandleMessage(msg);
		responder.handleMessage(msg);
	}
});

client.login(process.argv[2]);
