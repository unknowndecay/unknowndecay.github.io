require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js'); 

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.MessageContent,
    ],
});

const handledInteractions = new Set();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.once('ready', () => {
    const commands = [
        {
            name: 'announce',
            description: 'Send an announcement',
            options: [
                {
                    name: 'channel',
                    type: 7, 
                    description: 'Select a channel for the announcement',
                    required: true,
                },
                {
                    name: 'title',
                    type: 3, 
                    description: 'Announcement title',
                    required: true,
                },
                {
                    name: 'content',
                    type: 3, 
                    description: 'Announcement content',
                    required: true,
                },
            ],
        },
    ];

    client.guilds.cache.forEach(async (guild) => {
        try {
            await guild.commands.set(commands);
            console.log(`Slash commands registered in ${guild.name}`);
        } catch (error) {
            console.error(`Error registering slash commands in ${guild.name}:`, error);
        }
    });
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options, member } = interaction;
    const adminRole = member.roles.cache.find((role) => role.name === 'admin');

    if (commandName === 'announce') {

        if (handledInteractions.has(interaction.id)) {
            return;
        }

        handledInteractions.add(interaction.id); 

        if (!adminRole) {
            await interaction.reply('You do not have permission to use this command.');
            return;
        }

        const channelId = options.getChannel('channel').id;
        const title = options.getString('title');
        const content = options.getString('content');

        const channel = interaction.guild.channels.cache.get(channelId);

        if (!channel) {
            await interaction.reply('Invalid channel specified.');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(content)
            .setColor('#ff0000') 
            .setFooter({ text: `Sent on: ${new Date().toLocaleString()}` }); 

        try {
            await channel.send({ embeds: [embed] });
            await interaction.reply('Announcement sent successfully!');
        } catch (error) {
            console.error('Error sending announcement:', error);
            await interaction.reply('An error occurred while sending the announcement.');
        }
    }
});

client.login(process.env.TOKEN);