const { ActivityType } = require("discord.js");

let status = [
    {
        name: 'Store Orders',
        type: ActivityType.Watching,
    },
    {
        name: 'To Tickets',
        type: ActivityType.Listening
    }
];

module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}!`);

    setInterval(() => {
        let random = Math.floor(Math.random() * status.length);
        client.user.setActivity(status[random]);
    }, 10000);
};