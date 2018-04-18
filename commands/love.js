module.exports = {
    name: 'love',
    description: 'Check how much Loaf Love you have',
    async execute(message, args, db) {
		const user = await db.Users.findOne({where:{id:message.author.id}});
		if(user)
			return message.channel.send(`You have **${user.loaflove}** Loaf love!`);
        else
			return message.channel.send("I couldn't find your Loaf love.");
    },
};