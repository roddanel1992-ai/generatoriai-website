/**
 * Cloudflare Worker - Contact Form Email Handler
 * Uses MailChannels API (free with Cloudflare Workers)
 * 
 * Deploy this to Cloudflare Workers
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Leidžiama tik POST užklausa' 
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    // Parse form data
    const formData = await request.formData()
    const name = formData.get('name')
    const email = formData.get('email')
    const message = formData.get('message')
    const notRobot = formData.get('not_robot')
    const honeypot = formData.get('_honey')

    // Bot protection - honeypot
    if (honeypot) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Aptikta įtartina veikla' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Validation
    if (!name || name.length < 2) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Vardas turi būti bent 2 simbolių ilgio' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Neteisingas el. pašto adresas' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!message || message.length < 10) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Žinutė turi būti bent 10 simbolių ilgio' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!notRobot) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Prašome patvirtinti, kad nesate robotas' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get client IP
    const clientIP = request.headers.get('CF-Connecting-IP') || 'Unknown'

    // Prepare email HTML
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(to right, #5e42a6, #b74e91); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px 20px; border-left: 4px solid #5e42a6; }
        .field { margin-bottom: 20px; padding: 15px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #5e42a6; display: block; margin-bottom: 5px; }
        .value { color: #333; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #f0f0f0; }
        .footer a { color: #5e42a6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 Nauja Kontaktinė Žinutė</h1>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">📝 Vardas:</span>
                <span class="value">${escapeHtml(name)}</span>
            </div>
            <div class="field">
                <span class="label">✉️ El. paštas:</span>
                <span class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></span>
            </div>
            <div class="field">
                <span class="label">💬 Žinutė:</span>
                <div class="value" style="margin-top: 10px; white-space: pre-wrap;">${escapeHtml(message)}</div>
            </div>
            <div class="field">
                <span class="label">🌐 IP adresas:</span>
                <span class="value">${clientIP}</span>
            </div>
            <div class="field">
                <span class="label">📅 Data ir laikas:</span>
                <span class="value">${new Date().toLocaleString('lt-LT', { timeZone: 'Europe/Vilnius' })}</span>
            </div>
        </div>
        <div class="footer">
            <p>Ši žinutė gauta per kontaktų formą svetainėje <a href="https://tavogeneratorius.lt">tavogeneratorius.lt</a></p>
            <p>Atsakykite tiesiogiai į šį el. laišką arba susisiekite su klientu: <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        </div>
    </div>
</body>
</html>
`

    // Send email via MailChannels
    const sendRequest = new Request('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-API-Key': 'cloudflare-worker', // Optional for Workers
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'tavogeneratorius@gmail.com', name: 'Tavo Generatorius' }],
            reply_to: { email: email, name: name }
          },
        ],
        from: {
          email: 'noreply@tavogeneratorius.lt',
          name: 'Tavo Generatorius Kontaktai',
        },
        subject: `🔔 Nauja žinutė iš ${name}`,
        content: [
          {
            type: 'text/html',
            value: emailHTML,
          },
        ],
      }),
    })

    const sendResponse = await fetch(sendRequest)

    if (sendResponse.ok) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: '✅ Ačiū! Jūsų žinutė sėkmingai išsiųsta. Susisieksime su jumis artimiausiu metu.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else {
      const errorText = await sendResponse.text()
      console.error('MailChannels error:', sendResponse.status, errorText)
      
      // Return more detailed error for debugging
      return new Response(JSON.stringify({ 
        success: false, 
        message: '❌ Atsiprašome, įvyko techninė klaida. Prašome susisiekti tiesiogiai: +370 607 94868',
        debug: {
          status: sendResponse.status,
          error: errorText
        }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    console.error('Worker error:', error)
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: '❌ Atsiprašome, įvyko techninė klaida. Prašome susisiekti tiesiogiai: +370 607 94868 arba tavogeneratorius@gmail.com' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

