const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const ck = process.env.VITE_WC_CONSUMER_KEY;
const cs = process.env.VITE_WC_CONSUMER_SECRET;
const baseUrl = 'https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
const headers = { 'Authorization': `Basic ${auth}` };

const productsToAdd = [
  { name: 'Heritage Terracotta Drinkware', category: 'Glasses & Tumblers', price: '249', description: 'Experience the essence of tradition.' },
  { name: 'Artisan Brick Pattern Mug', category: 'Mugs', price: '199', description: 'A beautifully textured brick pattern mug.' },
  { name: 'Rustic Tombol Coffee Mug', category: 'Mugs', price: '229', description: 'Start your morning right with this earthy Tombol textured coffee mug.' },
  { name: 'Classic Earthen Tea Cup Set (6 pcs)', category: 'Tea Sets', price: '249', description: 'A complete set of 6 traditional terracotta tea cups.' },
  { name: 'Premium Terracotta Chai Set (6 pcs)', category: 'Tea Sets', price: '249', description: 'Elevate your tea time with this premium set of 6 handcrafted cups.' },
  { name: 'Textured Brick Tea Cup Set (6 pcs)', category: 'Tea Sets', price: '249', description: 'A stunning set of 6 tea cups featuring our signature brick texture.' },
  { name: 'Minimalist Terracotta Tea Set (6 pcs)', category: 'Tea Sets', price: '249', description: 'Clean lines and a minimalist profile define this 6-piece tea cup set.' },
  { name: 'Modern Earthen Tea Cups (6 pcs)', category: 'Tea Sets', price: '249', description: 'A beautifully balanced 6-piece tea cup set.' },
  { name: 'Natural Cooling Terracotta Bottle', category: 'Water Bottles', price: '179', description: 'Stay hydrated naturally.' },
  { name: 'Heritage Terracotta Surahi', category: 'Serveware', regular_price: '450', sale_price: '299', price: '299', description: 'Traditional handcrafted Surahi designed to keep your water naturally cool.' },
  { name: 'Artisan Temple Bell', category: 'Spiritual Collection', regular_price: '300', sale_price: '199', price: '199', description: 'A beautiful handcrafted bell.' },
  { name: 'Terracotta Jug (Small)', category: 'Serveware', price: '149', description: 'A perfectly sized small jug.' },
  { name: 'Terracotta Jug (Big)', category: 'Serveware', price: '249', description: 'A large, elegant terracotta jug.' }
];

async function run() {
  try {
    let catRes = await axios.get(`${baseUrl}/products/categories?per_page=100`, { headers });
    let categories = catRes.data;
    
    for (const p of productsToAdd) {
      let catObj = categories.find(c => c.name === p.category);
      if (!catObj) {
         try {
           const newCatRes = await axios.post(`${baseUrl}/products/categories`, { name: p.category }, { headers });
           catObj = newCatRes.data;
           categories.push(catObj);
         } catch(e) {
            console.log("Cat error:", e.response?.data?.message);
            // If exists, fetch again
            catRes = await axios.get(`${baseUrl}/products/categories?search=${p.category}`, { headers });
            catObj = catRes.data[0];
         }
      }
      
      console.log(`Adding ${p.name}...`);
      await axios.post(`${baseUrl}/products`, {
        name: p.name,
        type: 'simple',
        regular_price: p.regular_price || p.price,
        sale_price: p.sale_price || '',
        description: p.description,
        categories: [ { id: catObj.id } ],
        status: 'publish'
      }, { headers });
    }
    console.log("Done!");
  } catch(e) { console.error(e.response?.data || e.message); }
}
run();
