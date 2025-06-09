import pool from "./db.js";
import { getProduct, showAllProducts, changeStock } from "./manageProducts.js";
let running = true;

async function monitorLoop() {
    const products = await showAllProducts();
    if(products.length < 1) running = false;

    for(const product of products){
        if(product.is_instock === false){
            const response = await getProduct(product.product_id);
            if(response.inventory.orderable === true){
                console.log(`Product ${response.name} (${response.id}) is Instock!`);
                console.log(await changeStock(true, product.product_id));
            }else{
                console.log(`Product ${response.name} (${response.id}) is OOS`);
            }
        }else if(product.is_instock === true){
            const response = await getProduct(product.product_id);
            if(response.inventory.orderable === false){
                console.log(await changeStock(false, product.product_id));
            }
        }
    }

    if(running){
        //const nextDelay = Math.floor((5 + Math.random() * 5) * 60 * 1000);
        const nextDelay = 5000;
        setTimeout(monitorLoop, nextDelay);
    }
}

monitorLoop();