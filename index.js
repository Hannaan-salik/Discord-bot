require('dotenv').config(); // Load environment variables from .env

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const config = require('./config.json');

// Use environment variables for sensitive data
const botToken = process.env.DISCORD_TOKEN;
const userTag = process.env.USER_TAG;

// Define the 12 colors
const rainbow = [
    '#FFDAB9', // Peach
    '#FFFF00', // Yellow
    '#008000', // Green
    '#808080', // Grey
    '#FFFFFF', // White
    '#FF0000', // Red
    '#8B0000', // Dark Red
    '#FF007F', // Rose
    '#FFC0CB', // Pink
    '#FFD700', // Gold
    '#FF69B4', // Hot Pink
    '#000000', // Black
    '#AC91CE', // East Side
    '#BFD8D2', // Reef
    '#00FFFF', // Cyan
    '#E34234', // Vermillion
    '#FFA500', // Orange
    '#FFF700', // Lemon Yellow
];

let place = 0;

function changeColor() {
    for (const serverId of config.servers) {
        const server = client.guilds.cache.get(serverId);
        if (!server) {
            if (config.logging) {
                console.log(`[ColorChanger] Server ${serverId} was not found. Skipping.`);
            }
            continue;
        }

        const role = server.roles.cache.get(config.roleId);
        if (!role) {
            if (config.logging) {
                console.log(`[ColorChanger] Role ${config.roleId} was not found in server: ${serverId}. Skipping.`);
            }
            continue;
        }

        role.setColor(rainbow[place]).catch(console.error);

        if (config.logging) {
            console.log(`[ColorChanger] Changed color to ${rainbow[place]} in server: ${serverId}`);
        }
    }

    place = (place + 1) % rainbow.length;
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`User Tag: ${userTag}`);

    setInterval(changeColor, config.speed);
    changeColor();
});

client.login(botToken);