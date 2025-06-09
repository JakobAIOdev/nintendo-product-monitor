import pool from "./db.js";
import { getProduct, showAllProducts, changeStock } from "./manageProducts.js";
import dotenv from 'dotenv';
dotenv.config();
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import fs from 'node:fs';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

async function loadCommands() {
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
    for (const commandFile of commandFiles) {
        const command = await import(`./commands/${commandFile}`);
        client.commands.set(command.default.data.name, command.default);
    }
}

async function monitorLoop() {
    try {
        const products = await showAllProducts();
        if (products.length < 1) {
            console.log("No products to monitor. Stopping loop.");
            return;
        }

        for (const product of products) {
            try {
                const response = await getProduct(product.product_id);
                if (product.is_instock === false && response.inventory.orderable === true) {
                    console.log(`Product ${response.name} (${response.id}) is Instock!`);
                    console.log(await changeStock(true, product.product_id));
                } else if (product.is_instock === true && response.inventory.orderable === false) {
                    console.log(await changeStock(false, product.product_id));
                } else{
                    console.log(`${product.product_name}, (${product.product_id}) OOS..`)
                }
            } catch (err) {
                console.error(`Error processing product ${product.product_id}:`, err);
            }
        }
    } catch (err) {
        console.error("Error in monitorLoop:", err);
    } finally {
        setTimeout(monitorLoop, 5000);
    }
}

client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}`);
    await loadCommands();
    monitorLoop();
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (command) {
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.deferred || interaction.replied) {
                interaction.editReply("Fehler aufgetreten");
            } else {
                interaction.reply("Fehler aufgetreten");
            }
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);

process.on('SIGINT', async () => {
    console.log("Shutting down, closing db ...");
    await pool.end();
    process.exit(0);
});
