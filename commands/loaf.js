module.exports = {
    name: 'loaf',
    description: 'ItsLoaf',
    execute(message, args) {
        var text = "<@"+message.author.id+"> has summoned Loaf!";
        message.channel.send(text, {
        file: "./LoafImages/Loaf.png"
        });
    },
};