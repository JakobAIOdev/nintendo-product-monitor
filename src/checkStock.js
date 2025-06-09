import axios from "axios";

async function checkStock(productID) {
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

let running = true;

async function monitorLoop() {
    const response = await checkStock("000000000010015151");
    console.log('Monitor läuft:', new Date());

    if (response.inventory.orderable === true) {
        console.log("Instock!");
        running = false;
        return;
    }
    if (running) {
        //const nextDelay = Math.floor((5 + Math.random() * 5) * 60 * 1000);
        const nextDelay = 5000;
        setTimeout(monitorLoop, nextDelay);
    }
}

monitorLoop();