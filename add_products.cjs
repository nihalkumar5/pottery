const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const ck = process.env.VITE_WC_CONSUMER_KEY;
const cs = process.env.VITE_WC_CONSUMER_SECRET;
const baseUrl = 'https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3';

const auth = Buffer.from(`${ck}:${cs}`).toString('base64');

const productsToAdd = [
  { name: 'Heritage Terracotta Surahi', category: 'Drinkware', regular_price: '450', sale_price: '299', price: '299', description: 'Traditional handcrafted Surahi designed to keep your water naturally cool.' },
  { name: 'Artisan Temple Bell', category: 'Drinkware', regular_price: '300', sale_price: '199', price: '199', description: 'A beautiful handcrafted bell, resonant and perfectly shaped by local artisans.' },
  { name: 'Terracotta Jug (Small)', category: 'Drinkware', price: '149', description: 'A perfectly sized small jug for serving water or lassi.' },
  { name: 'Terracotta Jug (Big)', category: 'Drinkware', price: '249', description: 'A large, elegant terracotta jug perfect for family meals and serving cold water.' }
];

async function addProducts() {
  try {
    console.log("Fetching categories...");
    const catRes = await axios.get(`${baseUrl}/products/categories`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    
    let categories = catRes.data;
    
    const neededCategories = [...new Set(productsToAdd.map(p => p.category))];
    for (const catName of neededCategories) {
      if (!categories.find(c => c.name === catName)) {
        console.log(`Creating category: ${catName}`);
        const newCatRes = await axios.post(`${baseUrl}/products/categories`, { name: catName }, {
          headers: { 'Authorization': `Basic ${auth}` }
        });
        categories.push(newCatRes.data);
      }
    }

    for (const p of productsToAdd) {
      console.log(`Adding product: ${p.name}`);
      const catObj = categories.find(c => c.name === p.category);
      
      await axios.post(`${baseUrl}/products`, {
        name: p.name,
        type: 'simple',
        regular_price: p.regular_price || p.price,
        sale_price: p.sale_price || '',
        description: p.description,
        categories: [ { id: catObj.id } ],
        status: 'publish'
      }, {
        headers: { 'Authorization': `Basic ${auth}` }
      });
    }
    console.log("All done!");
  } catch(e) {
    console.error("Error:", e.response ? e.response.data : e.message);
  }
}

addProducts();
