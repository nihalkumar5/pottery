const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const ck = process.env.VITE_WC_CONSUMER_KEY;
const cs = process.env.VITE_WC_CONSUMER_SECRET;
const baseUrl = 'https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
const headers = { 'Authorization': `Basic ${auth}` };

async function exportCSV() {
  try {
    const res = await axios.get(`${baseUrl}/products?per_page=100`, { headers });
    const products = res.data;
    
    let csv = "SKU,Product Name,Product Category,Selling Price,Weight,Length,Width,Height\n";
    
    for (const p of products) {
      const sku = p.sku || `SR-${p.id}`;
      const name = `"${p.name.replace(/"/g, '""')}"`;
      const category = p.categories && p.categories.length > 0 ? `"${p.categories[0].name.replace(/"/g, '""')}"` : "";
      const price = p.price || "0";
      const weight = p.weight || "0.5"; 
      const length = p.dimensions?.length || "10";
      const width = p.dimensions?.width || "10";
      const height = p.dimensions?.height || "10";
      
      csv += `${sku},${name},${category},${price},${weight},${length},${width},${height}\n`;
    }
    
    fs.writeFileSync('shiprocket_products.csv', csv);
    console.log('Successfully created shiprocket_products.csv with ' + products.length + ' products.');
  } catch(e) {
    console.error(e.response?.data || e.message);
  }
}
exportCSV();
