const shell = require('shelljs');

module.exports = {
    name: 'gitpull',
    description: 'Pulls from git!',
    execute(message, args) {
		if(message.author.id !== "92838401044140032" && message.author.id !== "107967155928088576")
			return;
		await message.delete();
        shell.exec('git pull && node .');
		process.exit();
    },
};