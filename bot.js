// Libraries
const fs = require('fs');	// Require the file system, used to load our commands.
const Path = require('path');
const Discord = require('discord.js');
const Sequelize = require('sequelize'); 
// Config Values
const {prefix} = require('./config.json');
const {token} = require('./auth.json');

// Client init
const client = new Discord.Client();

// ---Commands---
client.commands = new Discord.Collection();

function readDirR(dir) {
    return fs.statSync(dir).isDirectory()
        ? Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirR(Path.join(dir, f))))
        : dir;
}

const cmdPaths = readDirR('./commands');
for(const filePath of cmdPaths){
	console.log("[COMMAND] Loaded command at path " + filePath);
	const command = require(`./${filePath}`);
	client.commands.set(command.name, command);
}
// ---End Commands---

// ---DB---
const sqlize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	operatorsAliases: false,
	// Since we're using SQLite
	storage: 'database.sqlite'
});
const DB = {
    Users: sqlize.define('users', {
        id: {
            type: Sequelize.STRING,
            unique: true,
            primaryKey: true,
        },
        pets: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    }),
};
// ---End DB---

client.on('ready', () => {
    console.log('Discord connected. Syncing Database.');

	DB.Users.sync();

	console.log('Database synced.');
});

client.on('message', async message => {

	// For debug purposes, one msg = one pet.
	const authorID = message.author.id;
	await DB.Users.findOrCreate({where:{id:authorID}, defaults:{pets:0}}).spread(async function(user, created){
		await DB.Users.update({pets:user.pets + 1}, {where:{id:authorID}});
	});

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

	if(!client.commands.has(commandName))
		return;

	const command = client.commands.get(commandName);

	try{
		command.execute(message, args, DB);
	}
	catch(error){
		console.error(error);
		message.reply("I had a problem with that command :|");
	}

});

client.on('guildMemberAdd', (member) => {
    member.addRole('430164694880354314')
});

client.on('messageReactionAdd', (reaction, user) =>{
	for(var cmd of client.commands)
	{
		if(typeof cmd[1].reactionString === 'undefined')
			continue;
		if(reaction.message.content.includes(cmd[1].reactionString))
		{
			//console.log("attempting onReactionRecieved call for command [" + cmd[1].name + "]");
			cmd[1].onReactionReceived(reaction, user);
		}
	}
});

client.login(token);
