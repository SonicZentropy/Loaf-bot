module.exports = {
    name: 'pet',
    description: 'ItsPettingTime',
    async execute(message, args, db) {
    //const authorID = message.author.id;
    //await db.Users.findOrCreate({where:{id:authorID}, defaults:{loaflove:0}}).spread(async function(user, created){
	//	await db.Users.update({loaflove:user.loaflove + 1}, {where:{id:authorID}});
	//});
        const user = await db.Users.findOne({where:{id:message.author.id}});
        message.channel.send("You have "+user.loaflove+" Loaf love!");
    },
};