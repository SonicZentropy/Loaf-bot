const fs = require("fs");
const path = require("path");

let prevID = "";

module.exports = {
    name: 'loaf',
    description: 'ItsLoaf',
    reactionString: "has summoned",
	async execute(message, args) {
		// First, delete the !loaf message. We don't need it floating around.
		await message.delete();
		
		// Now, search for an old loaf message, if it exists, delete it.
		if(prevID !== "")
		{
			message.channel.fetchMessage(prevID)
  				.then(message => message.delete())
  				.catch();
		}
		
		var folder = fs.readdirSync("./LoafImages/");
		var randomIndex = Math.floor(Math.random() * folder.length);
		var imgPath = "./LoafImages/" + path.basename(folder[randomIndex]);
		
        var index = randomIndex==2 ? 1 : 0;
        var text = "<@"+message.author.id+"> "+reactionText[index];
		
		// Finally, send the new loaf image
		var sentMsg = await message.channel.send(text, {file:imgPath});
		prevID = sentMsg.id;
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
        
		var index = randomIndex==2 ? 1 : 0;
        var text = "<@"+user.id+"> "+reactionText[index];
		
		var sentMsg = await reaction.message.channel.send(text, {file:imgPath});
		prevID = sentMsg.id;
		await sentMsg.react('🔄');
	},
};