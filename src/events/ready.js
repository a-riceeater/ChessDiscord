import { ActivityType } from "discord.js"

export default {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Bot running. Logged in as ${client.user.username}#${client.user.discriminator}`);

        const statusOptions = ["a game of chess", "chess against a grandmaster", "a game of chess while waiting for my opponent to make a move...", "chess. picking the best move..."];

        async function pickPresence() {
            try {
                const index = Math.floor(Math.random() * statusOptions.length);

                console.log(`Bot status set to: ${statusOptions[index]}`)

                client.user.setPresence({
                    activities: [{ name: statusOptions[index], type: ActivityType.Playing }],
                    status: 'online'
                });
            } catch (error) {
                console.error(error);
            }
        }

        pickPresence();
    },
};