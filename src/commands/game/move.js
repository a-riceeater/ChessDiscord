import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { matches, userMatches, matchIds } from '../../matches.js';
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

					const response = await interaction.reply({ embeds: [embed], components: [row] })

					const filter = i => i.user.id === interaction.user.id;
					try {
						const selection = await response.awaitMessageComponent({ filter, time: 60_000 });

						const gameId = selection.customId;
						const match = matches.get(gameId);

						if (!matchIds.has(gameId)) tr();
						else {
							if (!matchIds.get(gameId).includes(interaction.user.tag)) tr()
						}

						function tr() {
							interaction.channel.send("❌ This match was either not found, or you are not a user participating in this match!")
						}

					} catch (e) {
						await interaction.channel.send({ content: 'Confirmation not received within 1 minute, cancelling :<', components: [] });
						return
					}
				}
			}
		}
	}
}