const fetch = require("node-fetch");

const jsonbinKey = process.env.JSONBIN_API_KEY;
const binId = process.env.JSONBIN_BIN_ID;
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

    const rates = {};
    // The live endpoint returns quotes in the form: { "UGXKES": 0.030, "UGXUSD": 0.00027, ... }
    for (const key in data.quotes) {
      // extract the target currency code from keys like "UGXKES"
      const targetCurrency = key.replace(baseCurrency, '');
      rates[targetCurrency] = data.quotes[key];
    }

    const payload = {
      updatedAt: new Date().toISOString(),
      base: baseCurrency,
      rates,
    };

    const updateRes = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": jsonbinKey
      },
      body: JSON.stringify(payload)
    });

    if (!updateRes.ok) throw new Error("Failed to update JSONBin");
    console.log("✅ Exchange rates updated to JSONBin");

  } catch (err) {
    console.error("❌ Error updating rates:", err);
    process.exit(1);
  }
})();
