const axios = require('axios');
const fs = require('fs');
const path = require('path');

const apiKey = process.env.EXCHANGERATE_API_KEY;
const baseCurrency = 'UGX';
const currencies = ['UGX', 'KES', 'USD', 'TZS', 'RWF'];

async function updateRates() {
  try {
    // Correct API endpoint with access_key param for your paid plan
    const url = `https://api.exchangerate.host/live?access_key=${apiKey}&source=${baseCurrency}&currencies=${currencies.join(',')}`;

    const response = await axios.get(url);

    if (!response.data || !response.data.rates) {
      throw new Error("No exchange rate data received");
    }

    // Save JSON to local file for hosting later
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

    fs.writeFileSync(path.join(dataDir, 'latest.json'), JSON.stringify(response.data, null, 2));

    console.log("✅ Exchange rates updated successfully.");
  } catch (error) {
    console.error("❌ Error updating rates:", error.message || error);
    process.exit(1);
  }
}

updateRates();
