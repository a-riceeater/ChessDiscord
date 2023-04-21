import { Client, GatewayIntentBits, Collection, EmbedBuilder } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
import { awaitingUsers, matches } from './matches.js';


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

client.on("messageCreate", async (message) => {
  if (!awaitingUsers.has(message.author.id)) return;

  // no match/user detection as it already has gone through two tests (in move.js command)

  let move = message.content;
  const matchId = awaitingUsers.get(message.author.id);
  const match = matches.get(matchId)
  const board = match.chess;

  const piece = move.charAt(0).toLowerCase() || "";
  const from = move.split(" ")[1] || "";
  const to = move.split(" ")[2] || "";
  const promote = move.split(" ")[3] || "";

  try {
    board.move({ to: to, piece: piece, color: board._turn, from: from, promote: promote })

    const moved = new EmbedBuilder()
      .setTitle("Moved!")
      .setDescription(`Sucessfully moved "${piece}" from "${from}" to "${to}" with promote "${promote}"`)
      .setTimestamp()
      .setFooter({ text: `ChessBot`, iconURL: 'https://i.imgur.com/NuAwthA.png' })
      .addFields(
        { name: 'Board', value: `\`\`\`${board.ascii().toLowerCase()}\nWhite\`\`\`` }
      )

    await message.reply({ embeds: [moved] });
  } catch (err) {
    console.error(err.toString().split("\n")[0])
    const error = new EmbedBuilder()
      .setTitle("Invalid move!")
      .setDescription(`"${piece}" from "${from}" to "${to}" with promotion "${promote}" is an invalid move.`)
      .setFooter({ text: `ChessBot`, iconURL: 'https://i.imgur.com/NuAwthA.png' })
      .setTimestamp()
      .addFields(
        { name: 'Board', value: `\`\`\`${board.ascii().toLowerCase()}\nWhite\`\`\`` }
      )
      .setColor("Red")

      await message.reply({ embeds: [error] })
  } finally {
    awaitingUsers.delete(message.author.id)
  }
})