const fs = require('fs');	// Require the file system, used to load our commands.
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const { token } = require('./auth.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');

for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
	const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
	
	if(!client.commands.has(commandName))
		return;
	
	const command = client.commands.get(commandName);
	
	try{
		command.execute(message, args);
	}
	catch(error){
		console.error(error);
		message.reply("I had a problem with that command :|");
	}
	
});

client.login(token);