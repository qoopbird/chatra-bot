var COMMANDS = {}
let SaveHandler = require('./save-handler.js')

exports.RegisterCommand = function(command, callback) {
	if (COMMANDS.hasOwnProperty(command)) { throw `${command} already exists!`; }

	COMMANDS[command] = {
		'callback': callback,
		'command': command.toLowerCase(),
	}
}

exports.HandleMessage = function(message) {
	if (message.content.match(/^[\!\~]/)) {
		for(const cmd in COMMANDS){
			if(message.content.substring(1, cmd.length + 1).toLowerCase() == cmd.toLowerCase()){
				let cmdObject = COMMANDS[cmd]
				let args = []

				message.content.split(/\s-/).forEach((msg) => {
					let matched = msg.match(/(\w+)\s+(.+)/)

					if(matched){
						args[matched[1].toLowerCase()] = matched[2].trim()
					}else{
						args[msg] = true
					}
				})

				cmdObject.callback(message, (args[cmd] || "").trim(), args)
				return
			}
		}
	}
}

function findUser(guild, input) {
	let userId =  (input.match(/^<@!?(\d*)>$/) || {})[1] || Number(input)

	if(userId){
		return guild.members.cache.find(member => member.id == userId)
	}else if(input.length >= 3) {
		return guild.members.cache.find(member => {
			if(member.user.tag.toLowerCase().substring(0, input.length) == input.toLowerCase()){
				return true
			}
		})
	}
}

SaveHandler.loadSession()

exports.RegisterCommand("b", (msg, farg, args) => {
	let cmdMatch = farg.match(/(\w+)(.*)/)
	if(!cmdMatch) return;

	let targCmd = Object.keys(COMMANDS).find(cmd => cmd.toLowerCase() == cmdMatch[1].toLowerCase())
	if(!targCmd) return;

	let cmdObject = COMMANDS[targCmd]
	cmdObject.callback(msg, (cmdMatch[2] || "").trim(), args)
})

exports.RegisterCommand("warn", (msg, farg, args) => {
	let user = findUser(msg.guild, farg)
	if(!user) return;

	let userData = SaveHandler.getServer(msg.guild.id).getUser(user.id)
	let warnCount = 1 + (userData.warnCount || 0)
	userData.warnCount = warnCount

	msg.channel.send(`:ok_hand: **${user.user.tag}** has been given a warning. They now have ${warnCount} warning${(warnCount == 1) ? "" : "s"}.`)
	SaveHandler.saveSession()
})

exports.RegisterCommand("color", (msg, farg, args) => {
	let userData = SaveHandler.getServer(msg.guild.id).getUser(msg.member.id)

	let customRole = msg.guild.roles.cache.find(role => role.id == (userData.customRole || -1))
	let roleChanges = {}

	if(args.r){
		if(customRole){
			msg.channel.send(`Your role **${customRole.name}** has been destroyed`)
			customRole.delete()
			return
		}
	}

	if(farg != "")  roleChanges.color = farg;
	if(args.n) roleChanges.name = args.n;
	roleChanges.position = 2


	if(!customRole) {
		customRole = msg.member.roles.cache.find(role => role.name.match(/(.+?)-cr$/))

		if(customRole && !roleChanges.name){
			roleChanges.name = customRole.name.match(/(.+?)-cr$/)[1]
		}
	}

	if(!customRole){
		msg.guild.roles.create({data: roleChanges}).then(role => {
			msg.channel.send(`Your role **${role.name}** has been created`)
			userData.customRole = role.id
			msg.member.roles.add(role)
			SaveHandler.saveSession()
		})
	}else{
		customRole.edit(roleChanges).then(role => {
			msg.channel.send(`Your role **${role.name}** has been edited`)
			userData.customRole = role.id
			msg.member.roles.add(role)
			SaveHandler.saveSession()
		})
	}
})

exports.RegisterCommand("pronouns", (msg, farg, args) => {
	let serverData = SaveHandler.getServer(msg.guild.id).data
	let pronouns = serverData.pronouns || (serverData.pronouns = {})

	if(farg != ""){
		let targetRoleId = Object.keys(pronouns).find(key => pronouns[key].toLowerCase() == farg.toLowerCase())
		let targetRole = msg.guild.roles.cache.find(r => r.id == targetRoleId)

		if(targetRole){
			if(!msg.member.roles.cache.find(r => r.id == targetRole.id)){
				msg.channel.send(`You have been granted the **${targetRole.name}** role`)
				msg.member.roles.add(targetRole)

			}else{
				msg.channel.send(`You have been revoked the **${targetRole.name}** role`)
				msg.member.roles.remove(targetRole)

			}
		}else{
			msg.channel.send(`Pronouns **${farg}** have not been found`)

		}
	}else{
		let message = "The server's registered pronouns are "
		let first = true

		for(const key in pronouns) {
			if(!first) message += ", "
			message += `\`${pronouns[key]}\``
			first = false
		}

		msg.channel.send(message)
	}
})

exports.RegisterCommand("rpronouns", (msg, farg, args) => {
	if(msg.author.id != 80010348391825408) return;

	let targetRole = msg.guild.roles.cache.find(r => r.name.toLowerCase() == farg.toLowerCase())

	if(targetRole) {
		let serverData = SaveHandler.getServer(msg.guild.id).data
		let pronouns = serverData.pronouns || (serverData.pronouns = {})

		if(!pronouns[targetRole.id]) {
			msg.channel.send(`Pronouns **${targetRole.name}** have been registered`)
			pronouns[targetRole.id] = targetRole.name

		}else{
			msg.channel.send(`Pronouns **${targetRole.name}** have been removed`)
			delete pronouns[targetRole.id]
		}

		SaveHandler.saveSession()
	}else{
		msg.channel.send(`Role **${farg}** cannot be found`)

	}
})

exports.RegisterCommand("save", (msg, farg, args) => {
	if(msg.author.id != 80010348391825408) return;
	SaveHandler.saveSession()
})