import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { scoreConversation } from '@/lib/qualify';

const LSQ_ACCESS = 'u$rfdb83f05f0b66fc1db816ac810a2e0d3';
const LSQ_SECRET = '5d1e931f0b5e3bbbdf4bfa24a3486e133c46cbb4';

let sheetsTokenCache: { token: string; expiresAt: number } | null = null;
async function getGoogleSheetsToken(clientEmail: string, privateKey: string): Promise<string> {
  if (sheetsTokenCache && Date.now() < sheetsTokenCache.expiresAt) return sheetsTokenCache.token;
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const b64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signatureInput = `${b64Header}.${b64Payload}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  sign.end();
  let formattedKey = privateKey.replace(/\\n/g, '\n');
  if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) formattedKey = formattedKey.slice(1, -1);
  const signature = sign.sign(formattedKey, 'base64url');
  const jwt = `${signatureInput}.${signature}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Failed Google Sheets Auth');
  sheetsTokenCache = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 300) * 1000 };
  return sheetsTokenCache.token;
}

export async function POST(req: NextRequest) {
  try {
    const { phone, email, conversation, preferredCallbackTime } = await req.json();

    if (!phone || !conversation) {
      return NextResponse.json({ success: false, error: 'Missing required params' }, { status: 400 });
    }

    const { score, reason } = await scoreConversation(conversation);
    const convText = conversation.join('\n');

    // 1. LeadSquared Update
    try {
      const searchUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/RetrieveLeadByPhoneNumber?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&phone=${encodeURIComponent(phone)}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      
      let prospectId = null;
      if (searchRes.ok && searchData && searchData.length > 0) {
        prospectId = searchData[0].ProspectID;
      } else if (email) {
        const searchEmailUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Leads.GetByEmailaddress?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&emailaddress=${encodeURIComponent(email)}`;
        const searchEmailRes = await fetch(searchEmailUrl);
        const searchEmailData = await searchEmailRes.json();
        if (searchEmailRes.ok && searchEmailData) {
          if (Array.isArray(searchEmailData) && searchEmailData.length > 0) {
            prospectId = searchEmailData[0].ProspectID;
          } else if (searchEmailData.ProspectID) {
            prospectId = searchEmailData.ProspectID;
          }
        }
      }

      if (prospectId) {
        const updateUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Update?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&leadId=${prospectId}`;
        const scoreField = process.env.LSQ_LEAD_SCORE_FIELD || 'mx_Lead_Score';
        const notesField = process.env.LSQ_NOTES_FIELD_NAME || 'mx_Notes';
        const payload = [
          { Attribute: scoreField, Value: score },
          { Attribute: notesField, Value: `Score Reason: ${reason}\n\nConversation:\n${convText}` },
          { Attribute: 'mx_conv_form', Value: convText }
        ];

        await fetch(updateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    } catch (e) {
      console.error('[Qualify] LSQ update failed', e);
    }

    // 2. Google Sheets Update
    try {
      const sheetId = process.env.GOOGLE_SHEET_ID;
      const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const key = process.env.GOOGLE_PRIVATE_KEY;

      if (sheetId && saEmail && key) {
        const token = await getGoogleSheetsToken(saEmail, key);
        const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!D:D`;
        const getRes = await fetch(getUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        
        if (getRes.ok) {
          const getData = await getRes.json();
          const rows: string[][] = getData.values || [];
          let rowIndex = -1;
          const targetClean = phone.replace(/\D/g, '');
          
          for (let i = rows.length - 1; i >= 0; i--) {
            const cellValue = rows[i] && rows[i][0] ? String(rows[i][0]).replace(/\D/g, '') : '';
            if (cellValue && (cellValue === targetClean || cellValue.endsWith(targetClean) || targetClean.endsWith(cellValue))) {
              rowIndex = i + 1;
              break;
            }
          }

          if (rowIndex !== -1) {
            const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!R${rowIndex}?valueInputOption=USER_ENTERED`;
            await fetch(updateUrl, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ values: [[score, preferredCallbackTime || '', reason]] })
            });
          }
        }
      }
    } catch (e) {
      console.error('[Qualify] Sheets update failed', e);
    }

    return NextResponse.json({ success: true, score, reason });
  } catch (error) {
    console.error('[Qualify] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
