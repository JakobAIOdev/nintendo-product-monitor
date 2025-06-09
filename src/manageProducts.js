import pool from './db.js';
import axios from "axios";

async function showAllProducts() {
    try{
        const result = await pool.query('SELECT * FROM monitor_products');
        if(result.rowCount === 0){
            return "No Products found!";
        }
        return result.rows.map(row => ({
                                        product_name: row.product_name,
                                        product_id: row.product_id,
                                        product_price: row.product_price + "€",
                                        product_path: "https://store.nintendo.de/de" + row.product_path,
                                        is_instock: row.is_instock
                                        }));
    } catch(error){
        console.error('Database error:', error.message);
        return `Error while fetching all products: ${error.message}`;
    }
}

async function changeStock(state, productID) {
    try{
       const result = await pool.query(
            'UPDATE monitor_products SET is_instock = $1 WHERE product_id = $2',
            [state, productID]
        );
        if (result.rowCount === 0) {
            return `No product with id ${productID} found.`;
        }
        return `Successfully changed state to 'is_instock = ${state}' for ${productID}`;
    } catch(error){
        console.error('Database error:', error.message);
        return `Error while changing stock state: ${error.message}`;
    }
}

async function addProduct(productID) {
    try{
        const productObj = await getProduct(productID);
        if (!productObj || !productObj.name || !productObj.path || !productObj.price?.value) {
            return `Invalid product data for ID ${productID}!`;
        }
        const productName = productObj.name;
        const productUrl = productObj.path;
        const productPrice = productObj.price.value;
        const result = await pool.query(
            'INSERT INTO monitor_products (product_id, product_name, product_path, product_price) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
            [productID, productName, productUrl, productPrice]
        );

        if (result.rowCount === 0) {
            return `Product "${productName}" (${productID}) already exists.`;
        }

        return `Successfully added "${productName}" (${productID}) to products.`;
    } catch (error) {
        console.error('Database error:', error.message);
        return `Error adding product: ${error.message}`;
    }
}

async function removeProduct(product_id) {
    try {
        const result = await pool.query(
            'DELETE FROM monitor_products WHERE product_id = $1',
            [product_id]
        );

        if (result.rowCount === 0) {
            return `Product with ID ${product_id} was not found in monitor_products.`;
        }

        return `Successfully removed ${product_id} from products.`; 
    } catch (error) {
        console.error('Database error:', error.message);
        return `Error removing product: ${error.message}`;
    }
}

async function getProduct(productID) {
    let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://store.nintendo.de/api/catalog/product?id=${productID}`,
        headers: {
            accept: "*/*",
            "accept-language":
                "en-DE,en;q=0.9,de-DE;q=0.8,de;q=0.7,en-US;q=0.6",
            priority: "u=1, i",
            "sec-ch-ua":
                '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        },
    };

    try {
        const response = await axios.request(config);
        //console.log(JSON.stringify(response.data));
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
}

//console.log(await showAllProducts());
//console.log(await removeProduct('000000000010015151'));
//console.log( await addProduct("000000000010015151"));
//console.log(await changeStock(false, '70010000096802'));

//console.log(await changeStock(false, '70010000096802'));

export {showAllProducts, changeStock, addProduct, removeProduct, getProduct};