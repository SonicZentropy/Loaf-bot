const rules = [
	"What happens in Shrine of Loaf, *stays* in Shrine of Loaf.",
    "7ark is immune from all rules",
    "Violators of rule #1 will be banned",
    "Only <@99325504796000256> gets to wear a monocle and tophat.",
    "My rules don't have to make sense.",
    "If you post something NSFW in any channel other than #not-safe-for-work I will fucking ban you.",
    "No assholes or annoying people allowed. This place is for fun."
];

module.exports = {
    name: 'rule',
    description: 'Rules',
    execute(message, args) {
        message.delete();
		if(!args.length)
			return message.channel.send("You didn't provide a rule #. Not gonna send all of em here.");
		var i = parseInt(args[0]);
		if(i <= 0 || i > rules.length)
			return message.channel.send("That rule # was invalid!");
        message.channel.send("Rule " + (i) + ": " + rules[i-1]);
    },
};