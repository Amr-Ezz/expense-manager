export async function getRate(from: string, to: string): Promise<number> {
  const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY; 
  if (!apiKey) throw new Error("Missing API key for FreeCurrencyAPI");

  const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${from}&currencies=${to}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) throw new Error(data.error || "Rate fetch failed");
  if (!data.data || !data.data[to]) throw new Error("Invalid currency response");

  return data.data?.[to]; 
}

// lib/exchange.ts
// export async function getRate(from: string, to: string): Promise<number> {
//   const apiKey = process.env.EXCHANGE_RATE_API_KEY;
//   if (!apiKey) throw new Error("Missing ExchangeRate API key");

//   const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${from}&currencies=${to}`;
//   const response = await fetch(url);
//   const data = await response.json();

//   if (!response.ok) {
//     console.error("Error fetching rate:", data);
//     throw new Error(data.error || "Rate fetch failed");
//   }

//   return data.data?.[to];
// }
