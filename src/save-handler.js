const fs = require('fs');

var Servers = {}

function Server() {
	let newServer = {}
	newServer.users = {}
	newServer.data = {}

	newServer.getUser = function(userId) {
		return newServer.users[userId] || (newServer.users[userId] = {})
	}

	newServer.save = function() {
		let objSave = {}
		objSave.users = newServer.users
		objSave.data = newServer.data

		let rawSave = JSON.stringify(objSave)
		return rawSave
	}

	newServer.load = function(toParse) {
		let objSave = JSON.parse(toParse)
		newServer.users = objSave.users
		newServer.data = objSave.data
	}

	return newServer
}

exports.getServer = function(serverId) {
	return Servers[serverId] || (Servers[serverId] = Server())
}

exports.saveSession = function() {
	let objSave = {}
	objSave.servers = {}

	for(const key in Servers)
		objSave.servers[key] = Servers[key].save();


	let rawSave = JSON.stringify(objSave)
	fs.writeFile('./save.json', rawSave, (err) => {
		if(err){
			console.log(err.message)
			return
		}

		console.log('saved successfully')
	})
}

exports.loadSession = function() {
	if(fs.existsSync('./save.json')){
		let rawSave = fs.readFileSync('./save.json')
		let parsedSave = JSON.parse(rawSave)

		for(const key in parsedSave.servers) {
			let toParse = parsedSave.servers[key]
			let newServer = Server()
			newServer.load(toParse)

			Servers[key] = newServer
		}
	}
}