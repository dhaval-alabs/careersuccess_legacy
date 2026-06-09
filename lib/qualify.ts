export async function scoreConversation(conversation: string[]): Promise<{ score: string; reason: string }> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('No GEMINI_API_KEY found, returning Cold.');
      return { score: 'Cold', reason: 'Missing API key' };
    }

    const systemPrompt = `You are an expert sales qualifier for AnalytixLabs.
Your job is to analyze a short conversation between a user and an automated assistant and determine their lead score.

TIERS:
- Hot: clear goal, wants to start THIS MONTH, high intent
- Warm: clear goal but a month or two out, or comparing options / moderate fit
- Cold: still exploring, no firm timeline, early research
- Junk: bot, gibberish, fake details, or zero / irrelevant intent

Output a JSON object exactly like this:
{"score": "Hot|Warm|Cold|Junk", "reason": "A 1-line reason for the score"}`;

    const convText = conversation.join('\n');
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const payload = {
      contents: [{ role: 'user', parts: [{ text: `Conversation:\n${convText}` }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json"
      }
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.text();
      console.error('Gemini API Error:', err);
      return { score: 'Cold', reason: 'Gemini API Error' };
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Fast-path parsing using Regex
    const scoreMatch = rawText.match(/"score"\s*:\s*"?(Hot|Warm|Cold|Junk)"?/i);
    const reasonMatch = rawText.match(/"reason"\s*:\s*"([^"]+)"/i);

    if (scoreMatch) {
      const score = scoreMatch[1].charAt(0).toUpperCase() + scoreMatch[1].slice(1).toLowerCase();
      const reason = reasonMatch ? reasonMatch[1] : 'Determined from conversation';
      return { score, reason };
    }

    // JSON fallback
    try {
      const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const obj = JSON.parse(jsonStr);
      if (obj.score) {
        const score = obj.score.charAt(0).toUpperCase() + obj.score.slice(1).toLowerCase();
        return { score, reason: obj.reason || 'Parsed from JSON' };
      }
    } catch (e) {
      console.error('Failed to parse Gemini output:', rawText);
    }

    return { score: 'Cold', reason: 'Unparseable response' };
  } catch (error) {
    console.error('scoreConversation error:', error);
    return { score: 'Cold', reason: 'Exception during scoring' };
  }
}
