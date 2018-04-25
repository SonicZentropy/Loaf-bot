const pollVoterRole = "436895090338955264";
const Discord = require('discord.js');

module.exports = {
    name: 'cash',
    description: 'That sweet money',
    async execute(message, args, db) {
        message.delete();
        const user = await db.Users.findOne({where:{id:message.author.id}});
        
        var embed = new Discord.RichEmbed()
        .setColor(0x00ff00)
        .setTitle(message.author.username + "'s Cash")
        .setDescription("$"+user.cash);
        message.channel.send(embed);
    },
};