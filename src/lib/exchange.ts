// Cache rates to avoid hitting API limits
const rateCache = new Map<string, { rate: number; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function getRate(from: string, to: string): Promise<number> {
  // Normalize currency codes
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();

  // If same currency, return 1
  if (fromUpper === toUpper) {
    console.log(`✅ Same currency ${fromUpper} -> ${toUpper}: rate = 1`);
    return 1;
  }

  // Check cache first
  const cacheKey = `${fromUpper}-${toUpper}`;
  const cached = rateCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`📦 Using cached rate ${fromUpper} -> ${toUpper}: ${cached.rate}`);
    return cached.rate;
  }

  // Try ExchangeRate-API first (supports more currencies including EGP)
  const exchangeRateApiKey = process.env.EXCHANGE_RATE_API_KEY;
  
  if (exchangeRateApiKey) {
    try {
      console.log(`🌐 Fetching rate from ExchangeRate-API: ${fromUpper} -> ${toUpper}`);
      
      const url = `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/pair/${fromUpper}/${toUpper}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log(`📡 ExchangeRate-API Response:`, data);

      if (data.result === 'success' && data.conversion_rate) {
        const rate = data.conversion_rate;
        
        // Cache the result
        rateCache.set(cacheKey, { rate, timestamp: Date.now() });
        
        console.log(`✅ Rate ${fromUpper} -> ${toUpper}: ${rate}`);
        return rate;
      }
    } catch (error: any) {
      console.error(`⚠️ ExchangeRate-API failed:`, error.message);
      // Continue to fallback
    }
  }

  // Fallback to FreeCurrencyAPI
  const freeCurrencyApiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
  
  if (!freeCurrencyApiKey) {
    throw new Error("No exchange rate API keys configured");
  }

  try {
    console.log(`🌐 Fetching rate from FreeCurrencyAPI: ${fromUpper} -> ${toUpper}`);
    
    const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${freeCurrencyApiKey}&base_currency=${fromUpper}&currencies=${toUpper}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log(`📡 FreeCurrencyAPI Response:`, JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.message || data.error || `API returned ${response.status}`);
    }

    if (!data.data || !data.data[toUpper]) {
      throw new Error(`Currency ${toUpper} not supported by FreeCurrencyAPI`);
    }

    const rate = data.data[toUpper];
    
    if (typeof rate !== 'number' || isNaN(rate) || rate <= 0) {
      throw new Error(`Invalid rate value: ${rate}`);
    }

    // Cache the result
    rateCache.set(cacheKey, { rate, timestamp: Date.now() });
    
    console.log(`✅ Rate ${fromUpper} -> ${toUpper}: ${rate}`);
    return rate;

  } catch (error: any) {
    console.error(`❌ Both APIs failed for ${fromUpper} -> ${toUpper}:`, error.message);
    throw new Error(`Failed to get exchange rate ${fromUpper} -> ${toUpper}: ${error.message}`);
  }
}

// Helper to clear cache if needed
export function clearRateCache() {
  rateCache.clear();
  console.log("🧹 Rate cache cleared");
}