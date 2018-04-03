module.exports = {
    name: 'dbtest',
    description: 'Test the database.',
    async execute(message, args, db) {
        const userList = await db.Users.findAll({ attributes: ['id'] });
		const userString = userList.map(t => t.name).join(', ') || 'No users added.';
		return message.channel.send(`List of users: ${userString}`);
    },
};