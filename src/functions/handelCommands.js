import { REST } from "@discordjs/rest"
import { Routes } from 'discord-api-types/v9'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const clientId = process.env.clientId; 
const guildId = process.env.guildId; 

export default (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (let folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (let file of commandFiles) {
                console.dir(file)
                const command = await import(`../commands/${folder}/${file}`);


                client.commands.set(command.default.data.name, command.default);
                client.commandArray.push(command.default.data.toJSON());
            }
        }

        const rest = new REST({
            version: '9'
        }).setToken(process.env.token);

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');

                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    };
};