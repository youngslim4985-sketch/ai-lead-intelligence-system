import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import Airtable from 'airtable';
import Anthropic from '@anthropic-ai/sdk';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(bodyParser.json());

  // Airtable Setup
  const airtableBase = process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID 
    ? new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID)
    : null;

  // Anthropic Setup
  const anthropic = process.env.ANTHROPIC_API_KEY 
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

  // Webhook Endpoint
  app.post('/webhook/leads', async (req, res) => {
    const signature = req.headers['x-webhook-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    // Optional HMAC Validation
    if (secret && signature) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
      if (signature !== digest) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const { name, email, phone, source, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    try {
      // 1. Create record in Airtable
      let recordId = '';
      if (airtableBase) {
        const record = await airtableBase('Leads').create([
          {
            fields: {
              'Name': name,
              'Email': email,
              'Phone': phone || '',
              'Source': source || 'Webhook',
              'Message': message || '',
              'Status': 'New',
              'Created_At': new Date().toISOString()
            }
          }
        ]);
        recordId = record[0].id;
      }

      // 2. Generate AI Message (Asynchronous)
      if (anthropic && recordId) {
        generateAndSaveAIMessage(recordId, name, message || '', airtableBase, anthropic);
      }

      res.status(200).json({ status: 'success', message: 'Lead received and processing started', recordId });
    } catch (error) {
      console.error('Webhook Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // API Routes
  app.get('/api/leads', async (req, res) => {
    if (!airtableBase) {
      return res.json({ leads: [] });
    }
    try {
      const records = await airtableBase('Leads').select({
        maxRecords: 100,
        sort: [{ field: 'Created_At', direction: 'desc' }]
      }).all();
      
      const leads = records.map(record => ({
        id: record.id,
        ...record.fields
      }));
      
      res.json({ leads });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

async function generateAndSaveAIMessage(recordId: string, name: string, message: string, airtableBase: any, anthropic: any) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: "You are a world-class SDR for T&F Automate. Your goal is to write a personalized, short, and punchy outbound message to a new lead. Focus on their specific message, be helpful, and suggest a booking link. Keep it under 100 words.",
      messages: [
        { role: "user", content: `Lead Name: ${name}\nLead Message: ${message}` }
      ],
    });

    const aiMessage = response.content[0].text;

    await airtableBase('Leads').update([
      {
        id: recordId,
        fields: {
          'AI_Personalized_Message': aiMessage,
          'Status': 'AI_Generated'
        }
      }
    ]);
  } catch (error) {
    console.error('AI Generation Error:', error);
    if (airtableBase) {
      await airtableBase('Leads').update([
        {
          id: recordId,
          fields: { 'Status': 'AI_Generation_Failed' }
        }
      ]);
    }
  }
}

startServer();
