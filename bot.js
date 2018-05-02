// Libraries
const fs = require('fs');	// Require the file system, used to load our commands.
const Path = require('path');
const Discord = require('discord.js');
const Sequelize = require('sequelize'); 
const shell = require('shelljs');
// Config Values
const {prefix} = require('./config.json');
const {token} = require('./auth.json');
const IsDeployedVersion = fs.existsSync("./Deployed.txt");	// If this is the deployed version of the bot with auto updating.

const myRole = "437110642550243341";

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
            defaultValue: 0,
            allowNull: false
        },
        strikes: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        cash: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
    })
};
// ---End DB---

// ---Loaf Minigame---
var loafInterval = 7.2e+6;
var maxLoafAttacks = 100000;
var currentLoafAttacks = 0;
var loafEmbed;
var loafEmbedMessage;
var currentLoafChannelID;
var loafHealth = 100;
var usersAttacking = [];
var canAttack = false;

var attackChannelIds = [ "435978332899770378", "430040785178853376" ]; //Loaf-fun, loaf-discussion
var programmingChannel = "435172707886432267";
var pollChannel = "430208289234747393"//"430543422512955392";
var pollvoterId = "439205393273716746"//"439141548274221077"

var currentIntervalHandle;
var timeOutIntervalHandle;
// ---End Loaf---

// ---Bot Constants---
//						All Might
const ImageBlacklist = ["191372589484998656"];
// ---End Constants---

client.on('ready', () => {
	
    console.log('Discord connected. Syncing Database.');
    
    currentIntervalHandle = setInterval(function() {LoafAttack(1)},loafInterval/10);
    
	DB.Users.sync();

	console.log('Database synced.');
});

function LoafAttack(forceIndex = -1)
{
    var strength = Math.floor(Math.random()*2)+1;
    loafEmbed = new Discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle('Loaf Attacks!')
    //.setDescription("Health: 100/100")
    .setImage("https://image.ibb.co/donM3c/Loaf_Attack_Small.png")
    .setFooter ('!pet until Loaf is calm again!');
    
    var index = Math.floor(Math.random()*attackChannelIds.length);
    if(forceIndex != -1)
        index = forceIndex;
    currentLoafChannelID = attackChannelIds[index];
    loafEmbedMessage = client.channels.get(attackChannelIds[index]).send(
        {embed: loafEmbed}
    );
    canAttack = true;
    loafHealth = strength;
    usersAttacking = [];
    
    
    clearInterval(timeOutIntervalHandle);
    clearInterval(currentIntervalHandle);
    currentLoafAttacks++;
    if(currentLoafAttacks < maxLoafAttacks)
        currentIntervalHandle = setInterval(function() 
                    { LoafAttack(); }, 
                    Math.random()*loafInterval + loafInterval);
    
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
        
    },80000);
 }

client.on('messageUpdate', async (original, message) => {
    // Do image blacklisting (basically block certain users from sending images)
	if(ImageBlacklist.includes(message.author.id))
	{
		var hasEmbedImage = (message.embeds.length > 0 && typeof message.embeds[0].image !== 'undefined');
		var hasAttachedImage = (message.attachments.array().length > 0);
		
		if(hasEmbedImage || hasAttachedImage)
		{
			// It had an image.
			await message.delete();
		}
	}
});

client.on('message', async message => {
    var authorID = message.author.id;

    if(message.channel.id == programmingChannel)
        return;
    
    if(message.content.includes("!strikes"))
        {
            message.content = message.content.replace("!strikes","!strike");
        }

    var override = 0;
    var originalMessage = message.content;
    
	// Do image blacklisting (basically block certain users from sending images)
	if(ImageBlacklist.includes(message.author.id) && message.channel.id != "436206950729121832" && message.channel.id != "439193193771171840")
	{
		var hasEmbedImage = (message.embeds.length > 0 && typeof message.embeds[0].image !== 'undefined');
		var hasAttachedImage = (message.attachments.array().length > 0);
		
		if(hasEmbedImage || hasAttachedImage)
		{
			// It had an image.
			await message.delete();
            message.content = "!strike give <@"+message.author.id+">";
            override = 1;
		}
	}
    
    if(!message.guild.members.get(message.author.id).roles.has(myRole) && (message.content.toLowerCase().includes("hate") || message.content.toLowerCase().includes("evil") || message.content.toLowerCase().includes("fuck")) && (message.content.toLowerCase().includes(" cat") || message.content.toLowerCase().includes("loaf")))
	{
       message.content = "!strike give <@"+authorID+">";
        override= 2;
    }
       
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    

	if(!client.commands.has(commandName) && message.content != "!pet" && message.content != "!strikes")
		return;
    
    if(message.content != "!cash")
        {
            DB.Users.findOrCreate({where:{id:message.author.id}, defaults:{cash:0}}).spread(async function(user, created){
	                   	   DB.Users.update({cash:user.cash + 10}, {where:{id:message.author.id}});
	                    });
            
        }

	const command = client.commands.get(commandName);
    
    const LoafStates = [ "https://image.ibb.co/nj7w3c/Loaf_Happy_Tiny.png" ];
        
    
	try{
        if(message.content == "!pet")
            {
                message.delete();
                if(!canAttack || message.channel.id != currentLoafChannelID)
                    {
                        return;
                    }
                
                loafHealth -= 1;
                
                if(loafHealth <= 0)
                    {
                        loafEmbed
                            .setImage(LoafStates[0])
                            .setDescription("Happy! :)")
                            .setFooter("");
                        loafEmbedMessage.then((msg) => {
                            msg.edit(loafEmbed);
                        })
                        message.channel.send("<@"+authorID+"> has calmed Loaf! They have gained some Loaf Love");
                        DB.Users.findOrCreate({where:{id:authorID}, defaults:{loaflove:0}}).spread(async function(user, created){
	                   	   DB.Users.update({loaflove:user.loaflove + 1}, {where:{id:authorID}});
	                    });
                        canAttack = false;
                    }
            }
        else
            command.execute(message, args, DB, client, override, originalMessage);
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
