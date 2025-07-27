const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const apiKey = process.env.EXCHANGERATE_API_KEY; // your exchangerate.host key
const baseCurrency = 'UGX';
const currencies = ['UGX', 'KES', 'USD', 'TZS', 'RWF'];

const apiURL = `https://api.exchangerate.host/live?access_key=${apiKey}&source=${baseCurrency}&currencies=${currencies.join(',')}`;

(async () => {
  try {
    const res = await fetch(apiURL);
    const data = await res.json();

    console.log("API Response:", data);

    if (!data || !data.quotes) throw new Error("No exchange rate data");

    // Parse quotes like "UGXUSD": 0.00027 → USD: 0.00027
    const rates = {};
    for (const key in data.quotes) {
      const targetCurrency = key.replace(baseCurrency, '');
      rates[targetCurrency] = data.quotes[key];
    }

    // Prepare the payload to save
    const payload = {
      updatedAt: new Date().toISOString(),
      base: baseCurrency,
      rates,
    };

    // Save locally (create 'data' folder if needed)
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

    fs.writeFileSync(path.join(dataDir, 'latest.json'), JSON.stringify(payload, null, 2));

    console.log("✅ Exchange rates updated and saved locally.");

  } catch (err) {
    console.error("❌ Error updating rates:", err);
    process.exit(1);
  }
})();
