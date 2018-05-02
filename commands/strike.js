const myRole = "437110642550243341";
const loafFace = "https://image.ibb.co/bYP6E7/LoafFace.png";
const Discord = require('discord.js');

module.exports = {
    name: 'strike',
    description: 'Give out strikes. The power is vested in me.',
    async execute(message, args, db,client, override, original) {
        message.delete();
        const userId = message.mentions.users.first() != null && override != 2 ? message.mentions.users.first().id : message.author.id;
        const user = await db.Users.findOne({where:{id:userId}});
        if(args.length >= 2)
            {
                
                if(message.guild.members.get(message.author.id).roles.has(myRole) || override > 0)
                    {
                        var amount = args.length == 3 ? args[1] : 1;
                        switch(args[0])
                        {
                            case "give":
                                var newAmount = +user.strikes + +amount;
                                await db.Users.findOrCreate({where:{id:userId}, defaults:{strikes:1}}).spread(async function(user, created){
	                             	   await db.Users.update({strikes:newAmount}, {where:{id:userId}});
                                });
                                
                                await message.channel.send("<@"+userId+"> now has **"+newAmount+"** strike"+((newAmount) != 1 ? "s!" : "!")
                                + (override == 2 ? " They said: "+original : ""));
                                break;
                            case "clear":
                                await db.Users.findOrCreate({where:{id:userId}, defaults:{strikes:1}}).spread(async function(user, created){
	                             	   await db.Users.update({strikes:0}, {where:{id:userId}});
                                });
                                await message.channel.send("<@"+userId+"> has been **forgiven**! They now have **0** strikes.");
                                break;
                            case "forgive":
                                var newAmount = +user.strikes - +amount;
                                if(newAmount < 0)
                                    newAmount = 0;
                                if(user.strikes > 0)
                                    {
                                        await db.Users.findOrCreate({where:{id:userId}, defaults:{strikes:1}}).spread(async function(user, created){
	                                    	   await db.Users.update({strikes:newAmount}, {where:{id:userId}});
                                        });
                                        await message.channel.send("<@"+userId+"> was forgiven. They now have **"+(newAmount)+"** strike"+((newAmount) != 1 ? "s!" : "!"));
                                    }
                                break;
                        }
                        
                    }
                else
                    {
                        await message.channel.send("<@"+message.author.id+"> you cannot adjust strikes! Fool!");
                    }
            }
        if(args.length == 1)
            {
                if(args[0] == "lb")
                   {
                            var resultMsg = "";
                            const users = await db.Users.findAll();
                            users.sort(function(x,y){
                            if(x.strikes == y.strikes)
                                return 0;
                            if(x.strikes < y.strikes)
                                return -1;
                            else
                                return 1;
                        });
                            var count = 1;
                            for(var i = users.length-1; i >= users.length-10; i--, count++)
                                {
                                    resultMsg += "**"+users[i].strikes+"**  -  "+client.users.get(users[i].id).username+"\n";
                                }
                            var embed = new Discord.RichEmbed()
                            .setColor(0x990000)
                            .setAuthor("Shrine of Loaf",loafFace)
                            .setTitle("Strikes Shameboard")
                            .setDescription(resultMsg);
                            await message.channel.send(embed);
                   }
                else
                    {
                        await message.channel.send("<@"+userId+"> has **"+user.strikes+ "** strikes!")
                        
                    }
            }
        if(args.length == 0)
            {
                await message.channel.send("<@"+message.author.id+"> has **"+user.strikes+ "** strikes!")
            }
    },
};