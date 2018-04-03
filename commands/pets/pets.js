module.exports = {
    name: 'pets',
    description: 'Check your pets',
    async execute(message, args, users) {
		const user = await users.findOne({where:{id:message.author.id}});
		if(user)
			return message.channel.send(`You have **${user.pets}** pets.`);
        else
			return message.channel.send("I couldn't find your pets.");
    },
};