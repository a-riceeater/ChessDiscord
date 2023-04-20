import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { matches, userMatches } from '../../matches.js';
import { ChessMatch } from '../../gameHandler.js';

export default {
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Move a piece in your chess game.'),
	async execute(interaction) {
		let ums = userMatches.get(interaction.user.tag)

		if (!ums) { await userMatches.set(interaction.user.tag, []); ums = []; }


		if (ums.length == 0) {
			const errorEmbed = new EmbedBuilder()
				.setTitle("No games!")
				.setDescription("You are not participating in any games at the moment.")
				.setTimestamp()
				.setFooter({ text: `ChessBot`, iconURL: 'https://i.imgur.com/NuAwthA.png' })
				.setColor("Red")


			await interaction.reply({ embeds: [errorEmbed] })
		} else {
			const embed = new EmbedBuilder()
				.setTitle("What game would you like to move in?")
				.setFooter({ text: `ChessBot`, iconURL: 'https://i.imgur.com/NuAwthA.png' })
				.setTimestamp()
			const labels = {};

			for (let i = 0; i < ums.length; i++) {
				const gdata = ums[i];

				Object.assign(labels, {
					label: gdata[0],
					description: `Game against ${gdata[1]}`,
					value: gdata[0],
				})

				if (i == ums.length - 1) {
					console.log(labels)

					const row = new ActionRowBuilder()
						.addComponents(
							new StringSelectMenuBuilder()
								.setCustomId('select')
								.setPlaceholder('Nothing selected')
								.addOptions(labels),
						);

					await interaction.reply({ embeds: [embed], components: [row] })
				}
			}
		}
	}
}