const fetch = require("node-fetch");

const jsonbinKey = process.env.JSONBIN_API_KEY;
const binId = process.env.JSONBIN_BIN_ID;
const baseCurrency = 'UGX';

const currencies = ['UGX', 'KES', 'USD', 'TZS', 'RWF'];
const apiURL = `https://api.exchangerate.host/latest?base=${baseCurrency}&symbols=${currencies.join(',')}`;

(async () => {
  try {
    const res = await fetch(apiURL);
    const data = await res.json();

    if (!data || !data.rates) throw new Error("No exchange rate data");

    const rates = data.rates;
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
