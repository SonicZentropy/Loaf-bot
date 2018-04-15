const rules = [
	"What happens in Shrine of Loaf, *stays* in Shrine of Loaf."
];

module.exports = {
    name: 'rule',
    description: 'Rules',
    execute(message, args) {
		if(!args.length)
			return message.channel.send("You didn't provide a rule #. Not gonna send all of em here.");
		var i = parseInt(args[0]);
        message.channel.send("Rule " + (i) + ": " + rules[i-1]);
    },
};