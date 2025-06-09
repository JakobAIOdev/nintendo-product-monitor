import pool from "./db.js";
import { getProduct, showAllProducts, changeStock } from "./manageProducts.js";
import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    EmbedBuilder,
} from "discord.js";
import fs from "node:fs";
import dotenv from "dotenv";
dotenv.config();

const delay_mid = 300000; // 5min
const delay_short = 5000; // 5sek
const delay_normal = 180000; //3min

let isMonitoring = false;
let monitoringTimeout;
const delay = delay_normal;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

async function loadCommands() {
    const commandFiles = fs
        .readdirSync("./src/commands")
        .filter((file) => file.endsWith(".js"));
    for (const commandFile of commandFiles) {
        const command = await import(`./commands/${commandFile}`);
        client.commands.set(command.default.data.name, command.default);
    }
}


async function monitorLoop() {
    if (isMonitoring) {
        console.log("Monitor already running, skipping...");
        return;
    }
    
    isMonitoring = true;
    console.log(`[${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}] Starting monitor cycle...`);
    
    try {
        const products = await showAllProducts();
        if (products.length < 1) {
            console.log("No products to monitor. Will retry in next cycle.");
            return;
        }

        console.log(`Checking ${products.length} products...`);

        for (const product of products) {
            try {
                console.log(`Checking product: ${product.product_name} (${product.product_id})`);
                const response = await getProduct(product.product_id);
                if (!response) {
                    console.error(`Failed to get product data for ${product.product_id}`);
                    continue;
                }
                
                if (product.is_instock === false && response.inventory.orderable === true) {
                    console.log(`Product ${response.name} (${response.id}) is Instock!`);
                    const productImg = response.imageGroups[0].images[0].link;
                    const updatedImg = productImg.replace('upload', 'private');
                    const embed = new EmbedBuilder()
                        .setColor(0x57f287)
                        .setTitle(response.name)
                        .setURL("https://store.nintendo.de/de" + response.path)
                        .setDescription(`**${response.name}** is now **INSTOCK**!`)
                        .addFields(
                            { name: "Price", value: `${response.price.value} €`, inline: true },
                            { name: "ProductID", value: response.id, inline: true }
                        )
                        .setThumbnail(updatedImg)
                        .setTimestamp()
                        .setFooter({ text: "Nintendo Product Monitor" });

                    try {
                        const channel = await client.channels.fetch(
                            process.env.DISCORD_CHANNEL_ID
                        );
                        await channel.send({ embeds: [embed] });
                        console.log(await changeStock(true, product.product_id));
                    } catch (discordError) {
                        console.error("Discord error:", discordError);
                    }
                } else if (
                    product.is_instock === true &&
                    response.inventory.orderable === false
                ) {
                    console.log(await changeStock(false, product.product_id));
                } else {
                    console.log(
                        `${product.product_name}, (${product.product_id}) OOS`
                    );
                }
            } catch (err) {
                console.error(
                    `Error processing product ${product.product_id}:`,
                    err
                );
            }
        }
        console.log(`Finished checking all products.`);
    } catch (err) {
        console.error("Error in monitorLoop:", err);
    } finally {
        isMonitoring = false;
        console.log(`[${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}] waiting ${delay}ms ...`);
        monitoringTimeout = setTimeout(() => {
            monitorLoop().catch(err => {
                console.error("Monitor loop crashed:", err);
                setTimeout(() => monitorLoop().catch(console.error), delay);
            });
        }, delay);
    }
}

client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}`);
    await loadCommands();
    console.log('starting monitor..')
    monitorLoop().catch(err => {
        console.error("Initial monitor start failed:", err);
        setTimeout(() => monitorLoop().catch(console.error), delay);
    });
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
                interaction.editReply("An error occurred");
            } else {
                interaction.reply("An error occurred");
            }
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);

process.on("SIGINT", async () => {
    console.log("Shutting down, closing db ...");
    if (monitoringTimeout) {
        clearTimeout(monitoringTimeout);
    }
    await pool.end();
    process.exit(0);
});


process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

setInterval(() => {
    console.log(`[${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}] Monitor heartbeat - Status: ${isMonitoring ? 'Running' : 'Waiting'}`);
}, 300000);