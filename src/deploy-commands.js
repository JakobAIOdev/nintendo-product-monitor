import dotenv from 'dotenv';
dotenv.config();

import fs from 'node:fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const commandFile of commandFiles) {
    const commandModule = await import(`./commands/${commandFile}`);
    commands.push(commandModule.default.data.toJSON());
}

const restClient = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);

restClient.put(
    Routes.applicationGuildCommands(
        process.env.DISCORD_APPLICATION_ID,
        process.env.DISCORD_GUILD_ID
    ),
    { body: commands }
)
.then(() => console.log("Successfully registered commands"))
.catch(console.error);
