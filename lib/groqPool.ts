// Groq API Key Pool & Automatic Failover Engine
// Supports single or multiple comma-separated API keys in GROQ_API_KEY or GROQ_API_KEYS

export function getGroqKeys(): string[] {
  const raw = process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "";
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);
}

export async function callGroqWithFailover(options: {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
}): Promise<any> {
  const keys = getGroqKeys();

  if (keys.length === 0) {
    throw new Error("No Groq API keys configured in .env.local.");
  }

  const model = options.model || process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  let lastError: any = null;

  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];
    const keyPreview = `${currentKey.slice(0, 8)}...${currentKey.slice(-4)}`;

    try {
      console.log(`🤖 Attempting Groq AI generation with Key #${i + 1} (${keyPreview})...`);

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: options.systemPrompt },
            { role: "user", content: options.userPrompt },
          ],
          temperature: options.temperature ?? 0.7,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const text = result.choices?.[0]?.message?.content;
        if (!text) {
          throw new Error("Empty response content received from Groq API.");
        }
        console.log(`✅ Groq AI generation successful using Key #${i + 1}!`);
        return JSON.parse(text);
      }

      const errText = await response.text();
      const isRateLimit = response.status === 429 || errText.toLowerCase().includes("rate_limit") || errText.toLowerCase().includes("quota");

      if (isRateLimit && i < keys.length - 1) {
        console.warn(`⚠️ Groq Key #${i + 1} hit rate limit (Status 429). Seamlessly failing over to Key #${i + 2}...`);
        continue; // Try next key in the pool!
      }

      throw new Error(`Groq API error (Status ${response.status}): ${errText}`);
    } catch (err: any) {
      lastError = err;
      if (i < keys.length - 1) {
        console.warn(`⚠️ Groq Key #${i + 1} failed: ${err.message}. Seamlessly trying Key #${i + 2}...`);
        continue;
      }
    }
  }

  throw lastError || new Error("All configured Groq API keys in the pool failed or reached their limit.");
}
