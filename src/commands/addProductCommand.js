import { SlashCommandBuilder } from 'discord.js';
import {addProduct} from "../manageProducts.js";

export default {
    data: new SlashCommandBuilder()
    .setName('addproduct')
    .setDescription('add a product to the nintendo monitor')
    .addStringOption(option => 
        option.setName('product')
            .setDescription('The productId')
            .setRequired(true)),
    async execute(interaction){
        await interaction.deferReply();
        const productInput = interaction.options.getString('product');
        try{
            const response = await addProduct(productInput);
            return interaction.editReply(response);
        } catch(error){
            return `Error adding product: ${error.message}`;
        }
    }
}