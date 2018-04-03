var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, event) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch (cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case 'loaf':
                var loafImages = ["./LoafImages/Loaf.png", "./LoafImages/Loaf2.png"];
                var index = randomInt(0, loafImages.length); // Math.floor((Math.random()*100))%(loafImages.length-1);
                bot.uploadFile({
                    to: channelID,
                    file: loafImages[index]
                });
                bot.sendMessage({
                    to: channelID,
                    message: "<@!" + userID + "> has summoned Loaf!"
                });
                //var msg = bot.getMessage({ userID: userID });
                bot.deleteMessage({
                    channelID: channelID,
                    messageID: event.d.id
                });
                break;
            // Just add any case commands if you want to..
        }
    }
});
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
