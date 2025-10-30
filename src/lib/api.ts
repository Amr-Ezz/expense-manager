export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    console.log("📡 API Request to:", endpoint);
    console.log("🧾 Options:", options);

    const res = await fetch(endpoint, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    const data = await res.json();

    console.log("📨 Response status:", res.status);
    console.log("📦 Response data:", data);

    if (!res.ok) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("🚨 apiRequest error:", error);
    throw error;
  }
}
