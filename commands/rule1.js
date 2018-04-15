module.exports = {
    name: 'rule1',
    description: 'DaRule1',
    execute(message, args) {
        message.channel.send("Rule 1: What happens in Shrine of Loaf, *stays* in Shrine of Loaf.");
    },
};