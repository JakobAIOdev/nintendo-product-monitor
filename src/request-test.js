import axios from 'axios';

let config = {
 method: 'get',
 maxBodyLength: Infinity,
 url: 'https://store.nintendo.de/api/catalog/product?id=000000000010015151',
 headers: { 
  'accept': '*/*', 
  'accept-language': 'en-DE,en;q=0.9,de-DE;q=0.8,de;q=0.7,en-US;q=0.6', 
  'priority': 'u=1, i', 
  //'referer': 'https://store.nintendo.de/de/nintendo-switch-2-P00153', 
  'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"', 
  'sec-ch-ua-mobile': '?0', 
  'sec-ch-ua-platform': '"macOS"', 
  'sec-fetch-dest': 'empty', 
  'sec-fetch-mode': 'cors', 
  'sec-fetch-site': 'same-origin', 
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
 }
};

async function makeRequest() {
 try {
  const response = await axios.request(config);
  //console.log(JSON.stringify(response.data));
  return response.data.data;
 }
 catch (error) {
  console.log(error);
 }
}

async function getProductData() {
    const productInfo = await makeRequest();
    const product = {
        inventory : productInfo.inventory,
        id : productInfo.id,
        name : productInfo.name,
        price : productInfo.price.value,
        path : productInfo.path
    }

    console.log(product);
}

getProductData();