const {Client, IntentsBitField, ActivityType} =require('discord.js');
const eventHandler = require('./handlers/eventHandler');

require("dotenv").config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.MessageContent,
    ]
});

eventHandler(client);

client.login(process.env.TOKEN);