const pollVoterRole = "436895090338955264";

module.exports = {
    name: 'poll',
    description: 'Toggle the poll voter role',
    execute(message, args) {
        message.delete();
        if(message.member.roles.has(pollVoterRole))
            message.member.removeRole(pollVoterRole);
        else
            message.member.addRole("436895090338955264");
    },
};