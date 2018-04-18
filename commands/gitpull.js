const shell = require('shelljs');

module.exports = {
    name: 'gitpull',
    description: 'Pulls from git!',
    async execute(message, args) {
		if(message.author.id !== "92838401044140032" && message.author.id !== "107967155928088576")
			return;
	    
	    	await message.channel.send("Updated").react("👍");
	    	message.delete();
	    
	    
        shell.exec('git pull && node .');
		process.exit();
    },
};
