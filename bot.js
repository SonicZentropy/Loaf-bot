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
        loaflove: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
    })
};
// ---End DB---

var loafInterval = 4000000;
var maxLoafAttacks = 100000;
var currentLoafAttacks = 0;
var loafEmbed;
var loafEmbedMessage;
var currentLoafChannelID;
var loafHealth = 100;
var usersAttacking = [];
var canAttack = false;

var attackChannelIds = [ "430040785178853376" ]; //Bot-testing, loaf-discussion "430208289234747393"

var currentIntervalHandle;
var timeOutIntervalHandle;

client.on('ready', () => {
    console.log('Discord connected. Syncing Database.');
    
    currentIntervalHandle = setInterval(function() {LoafAttack()},loafInterval/4);
    
	DB.Users.sync();

	console.log('Database synced.');
});

function LoafAttack(forceIndex = -1)
{
    loafEmbed = new Discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle('Loaf Attacks!')
    .setDescription("Health: 100/100")
    .setImage("https://image.ibb.co/dhU3Z7/Loaf_Attack.png")
    .setFooter ('!pet to calm him down!');
    
    var index = Math.floor(Math.random()*attackChannelIds.length);
    if(forceIndex != -1)
        index = forceIndex;
    currentLoafChannelID = attackChannelIds[index];
    loafEmbedMessage = client.channels.get(attackChannelIds[index]).send(
        {embed: loafEmbed}
    );
    canAttack = true;
    loafHealth = 100;
    usersAttacking = [];
    
    
    clearInterval(timeOutIntervalHandle);
    clearInterval(currentIntervalHandle);
    currentLoafAttacks++;
    if(currentLoafAttacks < maxLoafAttacks)
        currentIntervalHandle = setInterval(function() 
                    { LoafAttack(); }, 
                    Math.random()*loafInterval + Math.random()*loafInterval + loafInterval/2);
    
    timeOutIntervalHandle = setInterval(function() {
        if(canAttack)
            {
                canAttack = false;
                var ranAway = new Discord.RichEmbed();
                ranAway
                .setColor('#0099ff')
                .setTitle('Loaf is still angry, and ran away!');
                loafEmbedMessage.then((msg) => {
                    msg.edit(ranAway);
                });
            }
        clearInterval(timeOutIntervalHandle);
        
    },60000);
}

client.on('message', async message => {

	// For debug purposes, one msg = one pet.
	const authorID = message.author.id;
	await DB.Users.findOrCreate({where:{id:authorID}, defaults:{pets:0,test:0}}).spread(async function(user, created){
		await DB.Users.update({pets:user.pets + 1}, {where:{id:authorID}});
	});

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

	if(!client.commands.has(commandName) && message.content != "!pet")
		return;

	const command = client.commands.get(commandName);
    
	try{
        if(message.content == "!pet")
            {
                message.delete();
                if(!canAttack || message.channel.id != currentLoafChannelID)
                    {
                        return;
                    }
                
                loafHealth -= 10;
                loafEmbed.setDescription("Anger: "+loafHealth+"/100");
                loafEmbedMessage.then((msg) => {
                    msg.edit(loafEmbed);
                });
                
                var found = false;
                for(var key in usersAttacking)
                    {
                        if(usersAttacking[key].key == message.author.id)
                            {
                                usersAttacking[key].value += 10;
                                found = true;
                                break;
                            }
                    }
                if(!found)
                    {
                        usersAttacking.push({
                            key: message.author.id,
                            value: 10
                        });
                    }
                
                if(loafHealth <= 0)
                    {
                        var winningID;
                        var highest = 0;
                        for(var key in usersAttacking)
                            {
                                if(usersAttacking[key].value > highest)
                                    {
                                        winningID = usersAttacking[key].key;
                                        highest = usersAttacking[key].value;
                                    }
                            }
                        loafEmbed
                            .setImage("https://image.ibb.co/kZSoj7/loaf123.png")
                            .setDescription("Happy! :)")
                            .setFooter("");
                        loafEmbedMessage.then((msg) => {
                            msg.edit(loafEmbed);
                        })
                        message.channel.send("<@"+winningID+"> has calmed Loaf! They have gained some Loaf Love");
                        await DB.Users.findOrCreate({where:{id:winningID}, defaults:{loaflove:0}}).spread(async function(user, created){
	                   	   await DB.Users.update({loaflove:user.loaflove + 1}, {where:{id:winningID}});
	                    });
                        canAttack = false;
                    }
            }
        else
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
