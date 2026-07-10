const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const ck = process.env.VITE_WC_CONSUMER_KEY;
const cs = process.env.VITE_WC_CONSUMER_SECRET;
const baseUrl = 'https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
axios.get(`${baseUrl}/products`, { headers: { 'Authorization': `Basic ${auth}` } }).then(r => console.log(r.data.map(p => ({id: p.id, name: p.name}))));
