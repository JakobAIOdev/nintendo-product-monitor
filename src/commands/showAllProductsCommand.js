import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { showAllProducts } from '../manageProducts.js';

export default {
    data: new SlashCommandBuilder()
        .setName('showproducts')
        .setDescription('Displays all currently monitored products'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const products = await showAllProducts();

            if (!products.length) {
                return interaction.editReply('There are currently no products in monitoring.');
            }
            const embeds = products.map((p, i) => {
                const embed = new EmbedBuilder()
                    .setTitle(`${i + 1}. ${p.product_name}`)
                    .setURL(p.product_path)
                    .addFields(
                        { name: 'ID', value: `\`${p.product_id}\``, inline: true },
                        { name: 'Price', value: p.product_price, inline: true },
                        { name: 'Status', value: p.is_instock ? '🟢 INSTOCK' : '🔴 OOS', inline: true }
                    )
                    .setColor(p.is_instock ? 0x57f287 : 0xed4245)
                    .setFooter({ text: 'Nintendo Product Monitor' });
                if (p.product_img) {
                    embed.setImage(p.product_img);
                }
                return embed;
            });

            return interaction.editReply({ embeds });
        } catch (error) {
            console.error(error);
            return interaction.editReply(`Error fetching products: ${error.message}`);
        }
    }
}
