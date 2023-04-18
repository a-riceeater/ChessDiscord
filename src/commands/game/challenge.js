import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { matches } from '../matches';
import { ChessMatch } from '../../gameHandler';

export default {
    data: new SlashCommandBuilder()
        .setName('challenge')
        .setDescription('Challenge a user to a game of chess!')
        .addUserOption(option =>
            option.setName('user')
                .setRequired(true)
                .setDescription('The user to challenge'))
        .addStringOption(option =>
            option.setName('notify-type')
                .setDescription('The way to notify the user')
                .setRequired(true)
                .addChoices(
                    { name: 'dm', value: 'dm' },
                    { name: 'server', value: 'server' }
                )),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const nType = interaction.options.getString('notify-type')


        /*if (user == interaction.user) {
            const error = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle("You cannot send a challenge to yourself")
                .setDescription(`Nice try.`)
                .setTimestamp()
                .setFooter({ text: `Interaction created by ${interaction.user.tag}`, iconURL: 'https://i.imgur.com/NuAwthA.png' })

            interaction.reply({ embeds: [error] })

            commented out for testing purposes
        } else*/ if (user.bot) {
            const error = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle("You cannot play a bot.")
                .setDescription(`This may change in the future.`)
                .setTimestamp()
                .setFooter({ text: `Interaction created by ${interaction.user.tag}`, iconURL: 'https://i.imgur.com/NuAwthA.png' })

            interaction.reply({ embeds: [error] })
        } else {
            const sendingEmbed = new EmbedBuilder()
                .setColor('#324ea8')
                .setTitle("Sending challenge...")
                .setDescription(`Attempting to send challenge to ${user}...`)
                .setTimestamp()
                .setFooter({ text: `Interaction created by ${interaction.user.tag}`, iconURL: 'https://i.imgur.com/NuAwthA.png' })

            interaction.reply({ embeds: [sendingEmbed] })

            setTimeout(async () => {
                if (nType == 'dm') {
                    const challengeEmbed = new EmbedBuilder()
                        .setColor("#347aeb")
                        .setTitle("You recieved a challenge!")
                        .setDescription(`${interaction.user} wants to play a game of chess!`)
                        .setTimestamp()
                        .setFooter({ text: `ChessBot`, iconURL: 'https://i.imgur.com/NuAwthA.png' })

                    const accept = new ButtonBuilder()
                        .setCustomId('accept')
                        .setLabel('Accept Challenge')
                        .setStyle(ButtonStyle.Success);

                    const decline = new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('Decline')
                        .setStyle(ButtonStyle.Danger);

                    const row = new ActionRowBuilder()
                        .addComponents(accept, decline);

                    const resp = await user.send({ embeds: [challengeEmbed], components: [row] })


                    try {
                        const filter = i => i.user.id === interaction.user.id;
                        const confirmation = await resp.awaitMessageComponent({ filter });

                        if (confirmation.customId === 'accept') {

                            const acceptEmbed = new EmbedBuilder()
                                .setTitle("Challenge accepted!")
                                .setDescription(`You accepted the challenge from ${interaction.user}`)
                                .setColor("#2a780d")
                                .setTimestamp()
                                .setFooter({ text: `ChessBot`, iconURL: 'https://i.imgur.com/NuAwthA.png' })

                            const acceptEmbed2 = new EmbedBuilder()
                                .setTitle(`${interaction.user.tag}, your challenge was accepted!`)
                                .setDescription(`Your challenge from ${user} was accepted.`)
                                .setColor("#2a780d")
                                .setTimestamp()
                                .setFooter({ text: `ChessBot`, iconURL: 'https://i.imgur.com/NuAwthA.png' })

                            await confirmation.update({ embeds: [acceptEmbed] })
                            await interaction.channel.send({ embeds: [acceptEmbed2] })

                            const match = new ChessMatch({ users: [interaction.user, user] })
                            matches.set(gameId, match)

                            console.log("NEW MATCH CREATED:")
                            console.dir(match)
                        }
                        else if (confirmation.customId === 'cancel') {
                            await confirmation.update("Challenge declined.")

                        }
                    } catch (e) {
                        await user.send(`**An error occured: **\n\`\`\`${e}\`\`\``)
                    }

                } else {
                    const challengeEmbed = new EmbedBuilder()
                        .setColor("#347aeb")
                        .setTitle("You recieved a challenge!")
                        .setDescription(`${interaction.user} wants to play a game of chess!`)
                        .setTimestamp()
                        .setFooter({ text: `ChessBot`, iconURL: 'https://i.imgur.com/NuAwthA.png' })

                    const accept = new ButtonBuilder()
                        .setCustomId('accept')
                        .setLabel('Accept Challenge')
                        .setStyle(ButtonStyle.Success);

                    const decline = new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('Decline')
                        .setStyle(ButtonStyle.Danger);

                    const row = new ActionRowBuilder()
                        .addComponents(accept, decline);

                    const resp = await interaction.channel.send({ embeds: [challengeEmbed], components: [row] })


                    try {
                        const filter = i => i.user.id === interaction.user.id;
                        const confirmation = await resp.awaitMessageComponent({ filter });

                        if (confirmation.customId === 'accept') {

                            const acceptEmbed = new EmbedBuilder()
                                .setTitle("Challenge accepted!")
                                .setDescription(`You accepted the challenge from ${interaction.user}`)
                                .setColor("#2a780d")
                                .setTimestamp()
                                .setFooter({ text: `ChessBot`, iconURL: 'https://i.imgur.com/NuAwthA.png' })

                            const acceptEmbed2 = new EmbedBuilder()
                                .setTitle(`${interaction.user.tag}, your challenge was accepted!`)
                                .setDescription(`Your challenge from ${user} was accepted.`)
                                .setColor("#2a780d")
                                .setTimestamp()
                                .setFooter({ text: `ChessBot`, iconURL: 'https://i.imgur.com/NuAwthA.png' })

                            await confirmation.update({ embeds: [acceptEmbed] })
                            await interaction.channel.send({ embeds: [acceptEmbed2] })

                            const match = new ChessMatch({ users: [interaction.user, user] })
                            matches.set(gameId, match)

                            console.log("NEW MATCH CREATED:")
                            console.dir(match)
                        }
                        else if (confirmation.customId === 'cancel') {
                            await confirmation.update("Challenge declined.")

                        }
                    } catch (e) {
                        await interaction.channel.send(`\`\`\`${e}\`\`\``)
                    }

                }
            }, 1000)
        }
    },
};
