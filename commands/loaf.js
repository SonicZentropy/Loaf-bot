const images = [
    "./LoafImages/Loaf.png",
    "./LoafImages/Loaf2.png",
    "./LoafImages/Loaf3.png"
]

module.exports = {
    name: 'loaf',
    description: 'ItsLoaf',
    execute(message, args) {
        var text = "<@"+message.author.id+"> has summoned Loaf!";
        var index = Math.floor(Math.random()*images.length);
        if(args.length == 1 && args[0].toLowerCase() == "king")
            index = 2;
        if(index == 2)
            text = "<@"+message.author.id+"> has summoned King Loaf! All bow before the king!";
        message.channel.send(text, {
        file: images[index]
        });
    },
};