import { SlashCommandBuilder } from 'discord.js';
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
            const productList = products.map((p, i) =>
                `**${i + 1}. ${p.product_name}**\n` +
                `ID: \`${p.product_id}\`\n` +
                `Price: ${p.product_price}\n` +
                `Status: ${p.is_instock ? '🟢 INSTOCK' : '🔴 OOS'}\n` +
                `[About the product](${p.product_path})\n`
            ).join('\n');

            return interaction.editReply({
                content: `**Products currently monitored:**\n\n${productList}`
            });
        } catch (error) {
            console.error(error);
            return interaction.editReply(`Error fetching products: ${error.message}`);
        }
    }
}