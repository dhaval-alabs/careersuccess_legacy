# WhatsApp OTP Integration Guide (via xBot Webhook)

This document provides clear instructions for the marketing team to integrate WhatsApp OTP verification on other landing pages and servers, utilizing the active xBot automation webhook.

---

## 1. Why use the xBot Webhook?
Directly calling Meta's Graph API requires managing **Permanent System User Access Tokens** and **Phone Number IDs**. If standard user tokens are used, they expire after 60 days, breaking the OTP flow.

By routing OTP requests through **xBot**, we leverage the active access token stored inside the xBot backend (which automatically manages token validity).

---

## 2. API Endpoint Specification

To send a WhatsApp OTP message, make a `POST` request to the following xBot inbound webhook:

* **Endpoint URL**: `https://chat-xbot.webspecia.in/api/iwh/08c86dc50ec3914c2fdf14a39ab3acb8`
* **Request Method**: `POST`
* **Content-Type**: `application/x-www-form-urlencoded`

### Request Parameters (Form Fields)

| Parameter Name | Data Type | Required | Description / Format |
| :--- | :--- | :--- | :--- |
| `Name` | String | Yes | Lead's full name (e.g., `John Doe`). |
| `mobile` | String | Yes | 10-digit mobile number **without** country code (e.g., `8128181213`). |
| `email` | String | Yes | Lead's email address (e.g., `john@example.com`). |
| `city` | String | Yes | Lead's city (e.g., `Bangalore`). |
| `countryCode`| String | Yes | Dialing country code starting with `+` (e.g., `+91`). |
| `mobilecc` | String | Yes | Combined country code and 10-digit mobile (e.g., `+918128181213`). |
| `otp` | String | Yes | The generated 4-digit OTP code to send (e.g., `5678`). |
| `status` | String | Yes | Must be exactly: `not varified` (captures initial unverified lead state in xBot). |

---

## 3. Implementation Example (JavaScript / Node.js)

Below is the standard backend fetch implementation to generate and send the OTP:

```javascript
async function sendWhatsAppOtp(leadData, generatedOtp) {
  const xbotUrl = 'https://chat-xbot.webspecia.in/api/iwh/08c86dc50ec3914c2fdf14a39ab3acb8';

  // 1. Format payload as urlencoded params
  const payload = new URLSearchParams();
  payload.append('Name', leadData.name);
  payload.append('mobile', leadData.mobile); // 10 digits only
  payload.append('email', leadData.email);
  payload.append('city', leadData.city);
  payload.append('countryCode', leadData.countryCode); // e.g. "+91"
  payload.append('mobilecc', `${leadData.countryCode}${leadData.mobile}`); // e.g. "+918128181213"
  payload.append('otp', generatedOtp); // e.g. "5678"
  payload.append('status', 'not varified'); // Intentional typo matching xBot requirements

  try {
    const response = await fetch(xbotUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
      // Recommended: set an 8-second timeout to handle fallback gracefully
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === 'ok') {
        console.log('WhatsApp OTP sent successfully through xBot!');
        return { success: true };
      }
    }
    
    // Fallback if xBot returns non-200 or status is not 'ok'
    console.error('xBot API response error');
    return { success: false, fallback: true };
  } catch (error) {
    console.error('xBot request timed out or failed:', error);
    return { success: false, fallback: true }; // Proceed to silent verification fallback
  }
}
```

---

## 4. Best Practices for OTP Flow

1. **Graceful Fallback**: If the xBot request fails, rejects, or times out (e.g., >8 seconds), do **not** block the user. Fall back silently by redirecting them directly to the thank-you/success page or allowing submission without verification.
2. **LSQ Status Updates**:
   - If the OTP message is sent successfully, record the lead in LeadSquared with `"mx_OTP_Status": "Unverified"`.
   - If the API fails and fallback is triggered, record it as `"mx_OTP_Status": "Fallback"`.
   - Once the user inputs the correct code and verifies, update LSQ status to `"Verified"`.

---

## 5. Direct Meta Cloud API Setup (Discarding xBot)

If you decide to bypass xBot entirely and send messages directly through your own Meta Developer Account, follow this specification.

### 5.1 Pre-requisites
1. **Meta Business Account**: Verify your business under `business.facebook.com`.
2. **Meta Developer App**: Create a "Business" type app at `developers.facebook.com`.
3. **WABA**: Register a live phone number to your WhatsApp Business Account.
4. **Template Approval**: Submit and approve a utility-category message template named `form_otp` with one body variable (`{{1}}`) for the OTP code.
5. **Credentials**:
   - **Phone Number ID**: Copy the specific Phone Number ID (not WABA ID) under App Dashboard → WhatsApp → API Setup.
   - **Permanent Access Token**: Generate a permanent system user access token in Meta Business Manager settings (Users → System Users) with the `whatsapp_business_messaging` permission.

### 5.2 Direct API Endpoint Specification
* **Endpoint URL**: `https://graph.facebook.com/v23.0/<YOUR_PHONE_NUMBER_ID>/messages`
* **Request Method**: `POST`
* **Headers**:
  ```http
  Authorization: Bearer <YOUR_PERMANENT_ACCESS_TOKEN>
  Content-Type: application/json
  ```
* **Payload (JSON)**:
  ```json
  {
    "messaging_product": "whatsapp",
    "to": "<RECIPIENT_MOBILE_WITH_COUNTRY_CODE>",
    "type": "template",
    "template": {
      "name": "form_otp",
      "language": {
        "code": "en_US"
      },
      "components": [
        {
          "type": "body",
          "parameters": [
            {
              "type": "text",
              "text": "<OTP_CODE>"
            }
          ]
        }
      ]
    }
  }
  ```

### 5.3 Direct Implementation Example (JavaScript / Node.js)
```javascript
async function sendDirectMetaWhatsAppOtp(recipientPhone, generatedOtp) {
  const phoneId = process.env.META_WA_PHONE_NUMBER_ID; // Your 15-digit Phone Number ID
  const accessToken = process.env.META_WA_ACCESS_TOKEN; // Your Permanent System User Token
  
  const url = `https://graph.facebook.com/v23.0/${phoneId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: recipientPhone, // Must include country code (e.g. "918128181213")
    type: 'template',
    template: {
      name: 'form_otp', // Must match your approved Meta template name
      language: { code: 'en_US' },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: generatedOtp // e.g. "5678"
            }
          ]
        }
      ]
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.messages && data.messages.length > 0) {
        console.log('OTP delivered successfully through Meta API!');
        return { success: true };
      }
    }
    
    const errBody = await response.json();
    console.error('Meta API responded with error:', errBody);
    return { success: false, fallback: true };
  } catch (error) {
    console.error('Direct Meta API request failed:', error);
    return { success: false, fallback: true };
  }
}
```

