// server.js
// Minimal Express server implementing /api/ai-insights
// Usage: export OPENAI_API_KEY="sk-..." && node server.js
const express = require('express');
const fetch = require('node-fetch'); // or native fetch in Node 18+
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(bodyParser.json({ limit: '256kb' }));

// Simple middleware: protect the endpoint with a short shared secret header (optional)
const DASHBOARD_SECRET = process.env.DASHBOARD_SECRET || 'changeme_local';
function checkSecret(req, res, next) {
  const s = req.get('x-dashboard-secret');
  if (!s || s !== DASHBOARD_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// Example: /api/ai-insights receives { services: [ { id, name, lastStatus, lastRespTime, history[...] } ], context: {...} }
app.post('/api/ai-insights', checkSecret, async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.services) return res.status(400).json({ error:'missing services' });

    // Build a concise, structured prompt to send to OpenAI
    const systemPrompt = `You are an expert Site Reliability Engineer. Analyze the provided microservice health telemetry and produce:
1) summary of issues (top 3)
2) root-cause hypotheses with confidence (low/med/high)
3) prioritized remediation steps (short checklist)
4) a numeric risk score (0-100)
Return JSON only with keys: summary, issues (list), hypotheses (list of {service, hypothesis, confidence}), actions (list), riskScore.`;

    // Compose the user content with compact structured data
    const userContent = `Telemetry payload (services):\n${JSON.stringify(payload.services, null, 2)}\n
    Give concise, actionable output as JSON.`;

    // Call OpenAI Responses/Chat endpoint
    // NOTE: adapt endpoint/model to your preference. This example uses Chat Completions API to keep it simple.
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      return res.status(500).json({ error: 'Server misconfigured: missing OPENAI_API_KEY' });
    }

    // Choose the model you want: "gpt-4o" or "gpt-4" or "gpt-4o-mini" etc (depends on your account)
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'; // pick a suitable model available to you

    const chatReqBody = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      max_tokens: 700,
      temperature: 0.2
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(chatReqBody)
    });

    if (!r.ok) {
      const text = await r.text();
      console.error('OpenAI error:', r.status, text);
      return res.status(502).json({ error: 'AI provider error', status: r.status, body: text });
    }

    const aiResp = await r.json();
    // Chat completion: aiResp.choices[0].message.content typically contains the text.
    const content = aiResp.choices && aiResp.choices[0] && aiResp.choices[0].message && aiResp.choices[0].message.content;
    // Try to parse JSON from model. If it's not strict JSON, send the raw text as fallback.
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // If the model returned text, try to extract JSON substring:
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); }
        catch(e2){ parsed = { text: content }; }
      } else {
        parsed = { text: content };
      }
    }

    // Return enriched response to frontend
    res.json({
      ok: true,
      query: payload,
      ai: parsed,
      meta: { model, provider: 'openai' }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_server_error', details: err.message });
  }
});

// allow health check of this server
app.get('/health', (req,res) => res.json({ ok:true, ts: Date.now() }));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`AI proxy listening on ${port}`));
