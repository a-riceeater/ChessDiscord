import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { matches, userMatches } from '../../matches.js';
import { ChessMatch } from '../../gameHandler.js';

export default {
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Move a piece in your chess game.'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle("What game would you like to move in?")
			.setFooter({ text: `ChessBot`, iconURL: 'https://i.imgur.com/NuAwthA.png' })
			.setTimestamp()

		let ums = userMatches.get(interaction.user.tag)
		if (!ums) { await userMatches.set(interaction.user.tag, []); ums = []; }

		const labels = {};

		console.log(ums.length)

		if (ums.length == 0) {
			const row = new ActionRowBuilder()
				.addComponents(
					new StringSelectMenuBuilder()
						.setCustomId('select')
						.setPlaceholder('Select a match')
						.addOptions(
							{
								label: 'No games.',
								description: 'You currently have no games to move in.',
								value: 'noGames'
							}
						),
				);

			interaction.reply({ embeds: [embed], components: [row] })
			return;
		} else {
			for (let i = 0; i < ums.length; i++) {
				labels.push({
					label: 'Select me',
					description: 'This is a description',
					value: 'first_option',
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

					interaction.reply({ embeds: [embed], components: [row] })
				}
			}
		}
	}
}