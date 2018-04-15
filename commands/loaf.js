const fs = require("fs");
const path = require("path");

module.exports = {
    name: 'loaf',
    description: 'ItsLoaf',
    reactionString: "has summoned Loaf!",
	async execute(message, args) {
		// First, delete the loaf message. We don't need it floating around.
		await message.delete();
		
		var folder = fs.readdirSync("./LoafImages/");
		var randomIndex = Math.floor(Math.random() * folder.length);
		var imgPath = "./LoafImages/" + path.basename(folder[randomIndex]);
		
        var text = "<@"+message.author.id+"> has summoned Loaf!";
		
		// Finally, send the new loaf image
		var sentMsg = await message.channel.send(text, {file:imgPath});
		await sentMsg.react('🔄');
    },
	async onReactionReceived(reaction, user){
		// If this reaction was from the bot, ignore it.
		if(user.id === "430560389013438474" || user.id === "430205652313440256")
			return;
		
		// Delete the original message
		await reaction.message.delete();
		// Re-Send a new message
		var folder = fs.readdirSync("./LoafImages/");
		var randomIndex = Math.floor(Math.random() * folder.length);
		var imgPath = "./LoafImages/" + path.basename(folder[randomIndex]);
		
        var text = "<@"+user.id+"> has summoned Loaf!";
		
		var sentMsg = await reaction.message.channel.send(text, {file:imgPath});
		await sentMsg.react('🔄');
	},
};