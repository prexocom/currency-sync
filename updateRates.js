const fs = require('fs');
const path = require('path');
const axios = require('axios');

const EXCHANGERATE_API_KEY = process.env.EXCHANGERATE_API_KEY;
const API_URL = `https://api.apilayer.com/exchangerates_data/latest?base=UGX&symbols=USD,KES,TZS,RWF`;

async function updateRates() {
  try {
    const response = await axios.get(API_URL, {
      headers: { apikey: EXCHANGERATE_API_KEY }
    });

    const data = response.data;
    if (!data || !data.rates) throw new Error('No exchange rate data');

    const filePath = path.join(__dirname, 'data', 'latest.json');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify({ updated: Date.now(), rates: data.rates }, null, 2));

    console.log('✅ Exchange rates saved to /data/latest.json');
  } catch (error) {
    console.error('❌ Error updating rates:', error);
    process.exit(1);
  }
}

updateRates();
