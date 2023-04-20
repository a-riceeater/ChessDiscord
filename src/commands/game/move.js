import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { matches, userMatches, matchIds, awaitingUsers } from '../../matches.js';
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
								.setPlaceholder('Select a match to move in.')
								.addOptions(labels),
						);

					const response = await interaction.reply({ embeds: [embed], components: [row] })

					const filter = i => i.user.id === interaction.user.id;
					try {
						const selection = await response.awaitMessageComponent({ filter, time: 60_000 });

						const gameId = selection.values[0]
						const match = matches.get(gameId);

						if (!matchIds.has(gameId)) return tr();
						else {
							const m = matchIds.get(gameId)
							for (let i = 0; i < m.length; i++) {
								if (m[i].tag == interaction.user.tag) break;

								if (i = m.length - 1) {
									return tr();
								}
							}
						}

						async function tr() {
							await selection.update({ content: "❌ This match was either not found, or you are not a user participating in this match!", components: [], embeds: [] });
							return;
						}


						const typeEmbed = new EmbedBuilder()
							.setTitle("Type your move...")
							.setDescription("Message the move that you want to do.")
							.addFields(
								{ name: 'Example Move', value: 'Pe4 (Pawn to e4)', inline: true },
								{ name: 'Game ID:', value: gameId, inline: true }
							)
							.setTimestamp()
							.setFooter({ text: `ChessBot`, iconURL: 'https://i.imgur.com/NuAwthA.png' })
						await selection.update({ embeds: [typeEmbed], components: [] })
						awaitingUsers.push(interaction.user.id)

					} catch (e) {
						await selection.update({ content: 'Confirmation not received within 1 minute, cancelling :<', components: [],  embeds: [] });
						delete awaitingUsers[interaction.user.id]
						return
					}
				}
			}
		}
	}
}