// lib/updateEmailStatus.ts

interface UpdateEmailStatusParams {
  leadId?: string
  phone: string
  emailStatus: 'Sent' | 'Failed'
}

export async function updateEmailStatus({ leadId, phone, emailStatus }: UpdateEmailStatusParams) {
  const results = await Promise.allSettled([
    updateLSQEmailStatus(leadId, phone, emailStatus),
    updateSheetEmailStatus(phone, emailStatus),
  ])

  if (results[0].status === 'rejected') {
    console.error(`[updateEmailStatus] LSQ update failed for ${phone}: ${results[0].reason}`)
  }
  if (results[1].status === 'rejected') {
    console.error(`[updateEmailStatus] Sheets update failed for ${phone}: ${results[1].reason}`)
  }

  return {
    lsqUpdated: results[0].status === 'fulfilled',
    sheetUpdated: results[1].status === 'fulfilled',
  }
}

async function updateLSQEmailStatus(leadId: string | undefined, phone: string, emailStatus: string) {
  // Use env vars or fall back to hardcoded values from existing route if env vars missing
  const host = process.env.LSQ_HOST || 'api-in21.leadsquared.com'
  const accessKey = process.env.LSQ_ACCESS_KEY || 'u$rfdb83f05f0b66fc1db816ac810a2e0d3'
  const secretKey = process.env.LSQ_SECRET_KEY || '5d1e931f0b5e3bbbdf4bfa24a3486e133c46cbb4'

  let resolvedLeadId = leadId
  if (!resolvedLeadId) {
    // Search for lead by phone
    const searchUrl = `https://${host}/v2/LeadManagement.svc/RetrieveLeadByPhoneNumber?accessKey=${accessKey}&secretKey=${secretKey}&phone=${encodeURIComponent(phone)}`
    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()
    resolvedLeadId = searchData?.[0]?.ProspectID
    if (!resolvedLeadId) throw new Error(`No LSQ lead found for phone ${phone}`)
  }

  const updateUrl = `https://${host}/v2/LeadManagement.svc/Lead.Update?accessKey=${accessKey}&secretKey=${secretKey}&leadId=${resolvedLeadId}`
  const updateRes = await fetch(updateUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([{ Attribute: 'mx_Email_Status', Value: emailStatus }]),
  })
  
  if (!updateRes.ok) {
    const errBody = await updateRes.text().catch(() => '')
    throw new Error(`LSQ update failed: ${updateRes.status} ${errBody.slice(0, 200)}`)
  }
}

// Minimal implementation using fetch to avoid heavy googleapis dependency if possible, 
// but since the project already uses googleapis patterns in other files, I'll check if it's in package.json
// Wait, the existing verify route uses raw fetch for sheets too! I'll stick to that.

async function updateSheetEmailStatus(phone: string, emailStatus: string) {
  const sheetId = process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_SHEETS_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SHEETS_PRIVATE_KEY
  
  if (!sheetId || !clientEmail || !privateKey) throw new Error('Google Sheets credentials not configured')

  // We need a token. We can reuse the logic from the verify route or just use the same pattern.
  // To keep it simple and independent, I'll implement a minimal JWT fetch here.
  const token = await getMinimalGoogleToken(clientEmail, privateKey)

  // 1. Find the row
  const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!D:D`
  const getRes = await fetch(getUrl, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const getData = await getRes.json()
  const rows = getData.values || []
  
  let targetRow = -1
  const targetClean = phone.replace(/\D/g, '')
  for (let i = rows.length - 1; i >= 0; i--) {
    const cellValue = rows[i] && rows[i][0] ? String(rows[i][0]).replace(/\D/g, '') : ''
    if (cellValue && (cellValue === targetClean || cellValue.endsWith(targetClean))) {
      targetRow = i + 1
      break
    }
  }
  
  if (targetRow === -1) throw new Error(`No sheet row found for phone ${phone}`)

  // 2. Update Column R
  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!R${targetRow}?valueInputOption=RAW`
  const updateRes = await fetch(updateUrl, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ values: [[emailStatus]] })
  })

  if (!updateRes.ok) {
    throw new Error(`Sheet update failed: ${updateRes.status}`)
  }
}

async function getMinimalGoogleToken(clientEmail: string, privateKey: string): Promise<string> {
  const crypto = await import('crypto')
  const header = { alg: 'RS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }
  const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url')
  const b64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signatureInput = `${b64Header}.${b64Payload}`
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(signatureInput)
  sign.end()
  const formattedKey = privateKey.replace(/\\n/g, '\n').replace(/^"|"$/g, '')
  const signature = sign.sign(formattedKey, 'base64url')
  const jwt = `${signatureInput}.${signature}`
  
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  })
  const data = await res.json()
  return data.access_token
}
