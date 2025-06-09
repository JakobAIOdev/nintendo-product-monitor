import { SlashCommandBuilder } from 'discord.js';
import {showAllProducts, changeStock, addProduct, removeProduct, getProduct} from "../manageProducts.js";

export default {
    data: new SlashCommandBuilder()
    .setName('removeproduct')
    .setDescription('remove a product from the nintendo monitor')
    .addStringOption(option => 
        option.setName('product')
            .setDescription('The productId')
            .setRequired(true)),
    async execute(interaction){
        await interaction.deferReply();
        const productInput = interaction.options.getString('product');
        try{
            const response = await removeProduct(productInput);
            return interaction.editReply(response);
        } catch(error){
            return `Error removing product: ${error.message}`;
        }
    }
}