const pollVoterRole = "436895090338955264";
const Discord = require('discord.js');

module.exports = {
    name: 'check',
    description: 'Check information',
    execute(message, args) {
        message.delete();
        
        var guild = message.guilds;
        var resultMsg = "";
        if(args.length > 0)
            {
                switch(args[0].toLowerCase())
                    {
                        case "pollvoter":
                            message.guild.members.array().forEach(function(mem)
                                                                 {
                                    if(mem.roles.has(pollVoterRole))
                                        {
                                            resultMsg += mem.user.username+"\n";
                                        }
                            });
                            var embed = new Discord.RichEmbed()
                            .setTitle("Members in PollVoter")
                            .setDescription(resultMsg);
                            message.channel.send(embed);
                            break;
                    }
                
            }
    },
};