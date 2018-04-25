const Discord = require('discord.js');
const loafFace = "https://image.ibb.co/bYP6E7/LoafFace.png";

module.exports = {
    name: 'love',
    description: 'Check how much Loaf Love you have',
    async execute(message, args, db, client) {
        message.delete();
        var userId;
        if(args.length != 0)
            {
                if(args[0] == "lb")
                    {
                        var resultMsg = "";
                        var users = await db.Users.findAll();
                        users.sort(function(x,y){
                            if(x.loaflove == y.loaflove)
                                return 0;
                            if(x.loaflove < y.loaflove)
                                return -1;
                            else
                                return 1;
                        });
                        var count = 1;
                        for(var i = users.length-1; i >= users.length-10; i--, count++)
                            {
                                resultMsg += "**"+users[i].loaflove+"**  -  "+client.users.get(users[i].id).username+"\n";
                            }
                        var embed = new Discord.RichEmbed()
                        .setColor(0x7777ff)
                        .setAuthor("Shrine of Loaf",loafFace)
                        .setTitle("Loaf Love Leaderboard")
                        .setDescription(resultMsg);
                        return message.channel.send(embed);
                    }
                else
                    {
                        userId = message.mentions.users.first().id;// message.author.id;
                        
                    }
            }
        else{
            userId = message.author.id;
        }
        
        const user = await db.Users.findOne({where:{id:userId}});
		     if(user)
		     	   return message.channel.send("<@"+userId+"> has **"+user.loaflove+"** Loaf love!");
             else
		     	   return message.channel.send("I couldn't find your Loaf love.");
    },
};