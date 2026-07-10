const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const ck = process.env.VITE_WC_CONSUMER_KEY;
const cs = process.env.VITE_WC_CONSUMER_SECRET;
const baseUrl = 'https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3';

const auth = Buffer.from(`${ck}:${cs}`).toString('base64');

const productsToAdd = [
  { name: 'Brick Pattern Terracotta Mug', category: 'Drinkware', price: '599', description: 'Handcrafted terracotta mug featuring a signature brick-textured design. Perfect for tea, coffee, and hot beverages while adding a rustic touch to your table.' },
  { name: 'Heritage Tall Coffee Mug', category: 'Drinkware', price: '699', description: 'A tall handcrafted terracotta mug with textured detailing and a glazed rim, designed for coffee lovers who appreciate artisan craftsmanship.' },
  { name: 'Terracotta Goblet Cup', category: 'Drinkware', price: '699', description: 'Elegant handcrafted goblet inspired by traditional Indian pottery. Suitable for serving tea, coffee, lassi, and festive beverages.' },
  { name: 'Artisan Clay Glass', category: 'Drinkware', price: '399', description: 'Minimal handcrafted clay tumbler for water, juice, chaas, and traditional drinks.' },
  { name: 'Hand-Painted Terracotta Water Bottle', category: 'Water Bottles', price: '999', description: 'Beautiful hand-painted terracotta bottle designed for naturally cool drinking water while adding artistic charm.' },
  { name: 'Leaf Carved Terracotta Bottle', category: 'Water Bottles', price: '899', description: 'Handmade engraved clay bottle featuring elegant leaf carvings and natural cooling properties.' },
  { name: 'Classic Terracotta Bottle', category: 'Water Bottles', price: '699', description: 'Minimal handcrafted earthen bottle designed for everyday hydration with natural cooling.' },
  { name: 'Hand-Painted Water Dispenser', category: 'Water Storage', price: '2999', description: 'Traditional hand-painted terracotta water dispenser with tap, combining artisan craftsmanship and functional design.' },
  { name: 'Heritage Terracotta Jug', category: 'Serveware', price: '1199', description: 'Rustic handcrafted clay jug for serving water, lemonade, chaas, and other beverages.' },
  { name: 'Artisan Serving Set', category: 'Serveware', price: '1499', description: 'Complete handcrafted serving set including tray, bowls, and serving accessories for snacks and festive gatherings.' },
  { name: 'Hand-Painted Decorative Vase', category: 'Home Decor', price: '1299', description: 'Elegant hand-painted terracotta vase crafted to complement modern and traditional interiors.' },
  { name: 'Decorative Terracotta Vase', category: 'Home Decor', price: '999', description: 'Minimal artisan vase with timeless earthy aesthetics for fresh flowers or dried arrangements.' },
  { name: 'Temple Bell', category: 'Spiritual Collection', price: '499', description: 'Handmade terracotta temple bell crafted for home temples and spiritual décor with a traditional finish.' }
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
