const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const ck = process.env.VITE_WC_CONSUMER_KEY;
const cs = process.env.VITE_WC_CONSUMER_SECRET;
const baseUrl = 'https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3';

const auth = Buffer.from(`${ck}:${cs}`).toString('base64');

const productsToAdd = [
  { name: 'Heritage Terracotta Drinkware (325g)', category: 'Drinkware', price: '249', description: 'Experience the essence of tradition with this heavyweight artisan drinkware. Perfectly crafted for a premium earthy feel.' },
  { name: 'Artisan Brick Pattern Mug', category: 'Drinkware', price: '199', description: 'A beautifully textured brick pattern mug. Lightweight at 225g and perfect for your daily coffee or tea ritual.' },
  { name: 'Rustic Tombol Coffee Mug', category: 'Drinkware', price: '229', description: 'Start your morning right with this earthy Tombol textured coffee mug. Elegantly crafted for comfort and style.' },
  { name: 'Classic Earthen Tea Cup Set (6 pcs)', category: 'Drinkware', price: '249', description: 'A complete set of 6 traditional terracotta tea cups. Perfect for hosting and serving authentic chai.' },
  { name: 'Premium Terracotta Chai Set (6 pcs)', category: 'Drinkware', price: '249', description: 'Elevate your tea time with this premium set of 6 handcrafted cups. Smooth finish with a timeless appeal.' },
  { name: 'Textured Brick Tea Cup Set (6 pcs)', category: 'Drinkware', price: '249', description: 'A stunning set of 6 tea cups featuring our signature brick texture for an enhanced grip and rustic charm.' },
  { name: 'Minimalist Terracotta Tea Set (6 pcs)', category: 'Drinkware', price: '249', description: 'Clean lines and a minimalist profile define this 6-piece tea cup set. Modern design meets ancient craft.' },
  { name: 'Modern Earthen Tea Cups (6 pcs)', category: 'Drinkware', price: '249', description: 'A beautifully balanced 6-piece tea cup set designed for everyday elegance and a natural sip.' },
  { name: 'Natural Cooling Terracotta Bottle', category: 'Water Bottles', price: '179', description: 'Stay hydrated naturally. This earthen bottle naturally cools your water while infusing it with earth\'s minerals.' }
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
        regular_price: p.price,
        description: p.description,
        short_description: p.description,
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
