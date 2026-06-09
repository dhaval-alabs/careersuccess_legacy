import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, courseSubject } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ack: 'Got it.' });
    }

    const systemPrompt = `You are a friendly, conversational assistant helping a user enroll in a ${courseSubject || 'course'}.
The user has just answered a question. You must produce a very short, neutral acknowledgment (1-2 sentences maximum, under 60 tokens). Do not say "Great", "Awesome", or "Perfect" every time. Vary your responses to sound natural (e.g., "Makes sense", "Understood", "Got it", "Thanks for sharing that").

CRITICAL GUARDRAIL: You may only acknowledge what the prospect said. NEVER state or imply any fact about fees, pricing, placement rates, guarantees, curriculum, batch dates, or outcomes. Make no promises. If the prospect asks such a question, do not answer it — produce a neutral acknowledgement only.`;

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const payload = {
      contents: [{ role: 'user', parts: [{ text: message }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 60,
      }
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ ack: 'Got it.' });
    }

    const data = await res.json();
    const ack = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Got it.';

    return NextResponse.json({ ack });
  } catch (error) {
    return NextResponse.json({ ack: 'Got it.' });
  }
}
