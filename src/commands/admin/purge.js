import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('purge')
        .addStringOption(option =>
            option.setName("amount")
                .setDescription("The amount of messages to purge")
                .setRequired(true))
        .setDescription('purge messages'),
    async execute(interaction) {
        let messagecount = parseInt(interaction.options.getString("amount"));
        interaction.channel.bulkDelete(messagecount)
        interaction.reply({ ephemeral: true, content: "Purged " + messagecount + " messages."})
    },
};
