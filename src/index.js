import { Client, GatewayIntentBits, Collection } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

dotenv.config();

const functions = await fs.readdirSync('./src/functions').filter(file => file.endsWith('.js'));
const eventFiles = await fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
const commandFolders = await fs.readdirSync('./src/commands');

(async () => {
  for (const file of functions) {
    await import(`./functions/${file}`).then(module => module.default(client));
  }
  client.handleEvents(eventFiles, './src/events');
  client.handleCommands(commandFolders, './src/commands');
  client.login(process.env.TOKEN);
})();