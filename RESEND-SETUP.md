# 📧 Resend.com Email Setup - 5 Minutės!

## ✅ Kodėl Resend.com?

- ✅ **100% NEMOKAMA:** 100 el. laiškų/dieną, 3,000/mėnesį
- ✅ **Patikima:** 99.9% deliverability, niekad nepateks į SPAM
- ✅ **Paprasta:** Super lengva API
- ✅ **Greita:** 2-5 sekundės delivery
- ✅ **Modern:** Designed for developers

---

## 🚀 Setup Žingsniai (5 minutės)

### 1️⃣ Registruokitės Resend.com

1. **Eikite į:** https://resend.com/signup
2. **Sign up** su Google arba email
3. **Patvirtinkite** email (check inbox)

### 2️⃣ Pridėkite savo domeną

1. **Po login,** eikite į: https://resend.com/domains
2. **Click:** "Add Domain"
3. **Įveskite:** `tavogeneratorius.lt`
4. **Click:** "Add"

### 3️⃣ Konfigūruokite DNS Records

Resend parodys DNS records, kuriuos reikia pridėti:

1. **Eikite į Cloudflare DNS:** https://dash.cloudflare.com/6d0a3c650f933e01c146f6ef39978dcc/tavogeneratorius.lt/dns

2. **Pridėkite šiuos records** (Resend dashboard parodys tikslias vertes):

   **A. SPF Record (TXT):**
   - Type: `TXT`
   - Name: `@`
   - Content: `v=spf1 include:resend.com ~all`
   - Click "Save"

   **B. DKIM Record (TXT):**
   - Type: `TXT`
   - Name: `resend._domainkey` (arba ką Resend parodo)
   - Content: (nukopijuokite iš Resend dashboard)
   - Click "Save"

3. **Grįžkite į Resend** → Click "Verify DNS Records"
4. **Palaukite 1-2 minutes** → Refresh → Domain status turėtų būti ✅ **"Verified"**

### 4️⃣ Sukurkite API Key

1. **Eikite į:** https://resend.com/api-keys
2. **Click:** "Create API Key"
3. **Name:** `Cloudflare Worker - Contact Form`
4. **Permission:** "Sending access" (default)
5. **Click:** "Create"
6. **📋 NUKOPIJUOKITE API KEY!** (parodys tik kartą!)
   ```
   re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 5️⃣ Pridėkite API Key į Cloudflare Worker

1. **Eikite į:** https://dash.cloudflare.com/workers
2. **Click:** `contact-form` worker
3. **Click:** "Settings" tab
4. **Scroll down:** "Variables and Secrets"
5. **Click:** "Add variable"
   - **Variable name:** `RESEND_API_KEY_ENV`
   - **Value:** (paste jūsų Resend API key)
   - **Type:** "Secret" (reikia encrypt)
6. **Click:** "Save"

### 6️⃣ Update Worker kodą

1. **Click:** "Quick edit" arba "Edit code"
2. **Ištrinkite** visą esamą kodą
3. **Atidarykite** `cloudflare-worker-resend.js` failą lokaliame kompiuteryje
4. **Nukopijuokite** visą kodą (Ctrl+A, Ctrl+C)
5. **Paste** į Worker editor (Ctrl+V)
6. **Click:** "Save and Deploy"

### 7️⃣ Testuokite!

```bash
# Test su curl
curl -X POST https://contact-form.rod-daniel1992.workers.dev \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "message=Testing Resend.com integration with Cloudflare Worker" \
  -F "not_robot=on"
```

Turėtumėte gauti:
```json
{"success":true,"message":"✅ Ačiū! Jūsų žinutė sėkmingai išsiųsta..."}
```

**Patikrinkite `tavogeneratorius@gmail.com` po 5-10 sekundžių!** 📧

---

## 🌐 Testuokite per svetainę:

1. **Clear browser cache:** Ctrl+Shift+R
2. **Atidarykite:** https://tavogeneratorius.lt/
3. **Užpildykite formą**
4. **Spauskite** "Siųsti žinutę"
5. **El. laiškas turėtų ateiti per 5-10 sekundžių!** ✅

---

## 📊 Resend Dashboard - Monitoring

### Real-time Email Logs:

**https://resend.com/emails**

Matysite:
- ✅ Kiekvieno el. laiško statusą
- ✅ Kada išsiųsta
- ✅ Ar pristatytas
- ✅ Jei atmetė - kodėl
- ✅ Open rates (optional)

### Analytics:

**https://resend.com/analytics**
- Siunčiama per dieną
- Success rate
- Delivery time
- Bounce rate

---

## 🎨 Bonus: Custom "From" Domain

Vietoj `noreply@tavogeneratorius.lt`, galite naudoti:
- `kontaktai@tavogeneratorius.lt`
- `info@tavogeneratorius.lt`
- Bet ką norite!

**Worker kode** pakeiskite:
```javascript
from: 'Kontaktai <kontaktai@tavogeneratorius.lt>',
```

---

## 🐛 Troubleshooting

### "Domain not verified"

```bash
# Patikrinkite DNS records
dig tavogeneratorius.lt TXT
dig resend._domainkey.tavogeneratorius.lt TXT

# Palaukite 5-10 minučių DNS propagation
# Tada Resend dashboard → Verify DNS
```

### "RESEND_API_KEY not configured"

```
Worker Settings → Variables → Add variable
Name: RESEND_API_KEY_ENV
Value: re_xxxxxxxxxxxxx (jūsų API key)
Type: Secret
```

### Email neateina

1. **Patikrinkite Resend Dashboard:** https://resend.com/emails
   - Ar matote email log?
   - Koks statusas? (sent/delivered/bounced)

2. **Patikrinkite Gmail SPAM** folderį

3. **Patikrinkite Worker Logs:**
   - Cloudflare Dashboard → Workers → contact-form → Logs
   - Žiūrėkite errors

### API Key nevelka

```
1. Resend dashboard → API Keys
2. Sukurkite naują key
3. Nukopijuokite
4. Update Cloudflare Worker variable
5. Redeploy worker
```

---

## 💰 Pricing

### Free Tier (amžinai):
- ✅ **100 emails/day**
- ✅ **3,000 emails/month**
- ✅ All features included
- ✅ No credit card required

### Jūsų website:
- ~20-50 contacts/day = **100% nemokama!**

### Jei reikia daugiau:
- **Pro:** $20/mėn = 50,000 emails/mėn
- **Enterprise:** Custom pricing

---

## 🔐 Security

✅ **API Key Encryption** - Stored as secret in Cloudflare  
✅ **HTTPS Only** - All requests encrypted  
✅ **Rate Limiting** - Built-in to Resend  
✅ **Spam Protection** - Bot detection in Worker  
✅ **Domain Verification** - DNS-based auth  

---

## ✅ Summary

Po setup:

1. ✅ User fills form → tavogeneratorius.lt
2. ✅ Form submits → Cloudflare Worker
3. ✅ Worker validates → Bot protection
4. ✅ Worker → Resend API
5. ✅ Resend → Gmail inbox (per 5 sekundės!)
6. ✅ **Gražus HTML email!** 📧✨

---

## 🆘 Support

- **Resend Docs:** https://resend.com/docs
- **API Reference:** https://resend.com/docs/api-reference
- **Status Page:** https://status.resend.com/

---

**Sukurta:** 2025-10-29  
**Autorius:** AI Assistant  
**Resend.com:** https://resend.com/

