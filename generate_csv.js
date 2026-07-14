const fs = require('fs');
const products = [
  { name: 'Terracotta Jug (Big)', category: 'Serveware', price: '249', sku: 'SR-116' },
  { name: 'Terracotta Jug (Small)', category: 'Serveware', price: '149', sku: 'SR-115' },
  { name: 'Artisan Temple Bell', category: 'Spiritual Collection', price: '199', sku: 'SR-114' },
  { name: 'Heritage Terracotta Surahi', category: 'Serveware', price: '299', sku: 'SR-113' },
  { name: 'Natural Cooling Terracotta Bottle', category: 'Water Bottles', price: '179', sku: 'SR-112' },
  { name: 'Modern Earthen Tea Cups (6 pcs)', category: 'Tea Sets', price: '249', sku: 'SR-111' },
  { name: 'Minimalist Terracotta Tea Set (6 pcs)', category: 'Tea Sets', price: '249', sku: 'SR-110' },
  { name: 'Textured Brick Tea Cup Set (6 pcs)', category: 'Tea Sets', price: '249', sku: 'SR-109' },
  { name: 'Premium Terracotta Chai Set (6 pcs)', category: 'Tea Sets', price: '249', sku: 'SR-108' },
  { name: 'Classic Earthen Tea Cup Set (6 pcs)', category: 'Tea Sets', price: '249', sku: 'SR-107' },
  { name: 'Rustic Tombol Coffee Mug', category: 'Mugs', price: '229', sku: 'SR-106' },
  { name: 'Artisan Brick Pattern Mug', category: 'Mugs', price: '199', sku: 'SR-105' }
];

let csv = "SKU,Product Name,Product Category,Selling Price,Weight,Length,Width,Height\n";
for (const p of products) {
  csv += `${p.sku},"${p.name}","${p.category}",${p.price},0.5,10,10,10\n`;
}
fs.writeFileSync('shiprocket_products.csv', csv);
console.log('Successfully created shiprocket_products.csv');
