require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');

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

    client.user.setActivity('Store tickets', { type: ActivityType.Watching });
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
                {
                    name: 'image',
                    type: 3,
                    description: 'URL of the image to attach to the announcement',
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
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        const channelId = options.getChannel('channel').id;
        const title = options.getString('title');
        const content = options.getString('content');
        const imageUrl = options.getString('image');

        const channel = interaction.guild.channels.cache.get(channelId);

        if (!channel) {
            await interaction.reply({ content: 'Invalid channel specified.', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(content)
            .setColor('#ff0000')
            .setFooter({ text: `Sent on: ${new Date().toLocaleString()}` });

        if (imageUrl) {
            embed.setImage(imageUrl);
        }

        try {
            await channel.send({ embeds: [embed] });

            await interaction.reply({ content: 'Announcement sent successfully!', ephemeral: true });
        } catch (error) {
            console.error('Error sending announcement:', error);
            await interaction.reply({ content: 'An error occurred while sending the announcement.', ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);