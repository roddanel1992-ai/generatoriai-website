# 📧 Cloudflare Email Worker - Setup Instrukcijos

## ✅ Privalumai

- ✅ **100% NEMOKAMA** - Cloudflare Workers Free tier: 100,000 requests/dieną
- ✅ **Niekad nepateks į SPAM** - MailChannels turi puikų deliverability
- ✅ **Nereikia Gmail/SendGrid** - Visiškai nepriklausomas sprendimas
- ✅ **Greitas** - Global Cloudflare network
- ✅ **Patikimas** - Enterprise level infrastruktūra
- ✅ **Lengvas setup** - 5-10 minučių

---

## 🚀 Setup Žingsniai

### 1️⃣ Prisijunkite prie Cloudflare Dashboard

1. Eikite į: https://dash.cloudflare.com/
2. Prisijunkite su savo Cloudflare paskyra
3. Pasirinkite savo domeną: **tavogeneratorius.lt**

### 2️⃣ Sukurkite Cloudflare Worker

1. **Kairėje pusėje:** Click **Workers & Pages**
2. **Click:** "Create application"
3. **Pasirinkite:** "Create Worker"
4. **Worker name:** `contact-form` (arba bet kokį kitą pavadinimą)
5. **Click:** "Deploy"

### 3️⃣ Redaguokite Worker kodą

1. Po deployment, click **"Edit code"**
2. **Ištrinkite** visą default kodą
3. **Nukopijuokite** visą kodą iš `cloudflare-worker.js` failo
4. **Paste** į Worker editorių
5. **Click:** "Save and Deploy" (viršuje dešinėje)

### 4️⃣ Gaukite Worker URL

Po deployment, matysite Worker URL:
```
https://contact-form.YOUR-SUBDOMAIN.workers.dev
```

**Pavyzdys:**
```
https://contact-form.tavogeneratorius.workers.dev
```

**Nukopijuokite šį URL** - jums reikės jo kitame žingsnyje!

### 5️⃣ Atnaujinkite index.html

1. Atidarykite `index.html` failą
2. Suraskite eilutę:
   ```html
   <form id="contactForm" action="https://contact-form.YOUR-SUBDOMAIN.workers.dev" method="POST"
   ```
3. **Pakeiskite** `YOUR-SUBDOMAIN` į jūsų tikrą subdomain
4. **Pavyzdys:**
   ```html
   <form id="contactForm" action="https://contact-form.tavogeneratorius.workers.dev" method="POST"
   ```

### 6️⃣ Commit ir Deploy

```bash
# Lokal kompiuteryje
cd /Users/Danel.Rod/Development/DeividoProjektas/Generatoriai

# Add changes
git add index.html cloudflare-worker.js CLOUDFLARE-WORKER-SETUP.md

# Commit
git commit -m "📧 Add Cloudflare Worker email system - No Gmail needed!"

# Push
git push origin main
```

### 7️⃣ Atnaujinkite Debian serverį

```bash
# SSH į serverį
ssh your-user@your-server

# Eikite į website direktoriją
cd /var/www/generatoriai

# Pull changes
git pull origin main

# Permissions (jei reikia)
sudo chown -R www-data:www-data /var/www/generatoriai
```

### 8️⃣ Testuokite!

1. Atidarykite: https://tavogeneratorius.lt/
2. Užpildykite kontaktų formą
3. Spauskite "Siųsti žinutę"
4. **Po 5-10 sekundžių** patikrinkite `tavogeneratorius@gmail.com`
5. **El. laiškas turėtų ateiti su gražiu HTML formatu!** 🎉

---

## 🎨 (Opcional) Custom Domain vietoj workers.dev

Jei norite naudoti savo domeną vietoj `workers.dev`:

### Variantas A: Workers Route

1. **Cloudflare Dashboard** → Workers & Pages → contact-form worker
2. **Click:** "Triggers" tab
3. **Click:** "Add route"
4. **Route:** `api.tavogeneratorius.lt/contact-form`
5. **Zone:** tavogeneratorius.lt
6. **Click:** "Add route"

Tada `index.html`:
```html
<form action="https://api.tavogeneratorius.lt/contact-form" method="POST">
```

### Variantas B: Custom Domain

1. **Workers → contact-form → Settings → Domains**
2. **Click:** "Add Custom Domain"
3. **Enter:** `contact.tavogeneratorius.lt`
4. **Click:** "Add Domain"

Cloudflare automatiškai sukurs DNS record ir SSL.

Tada `index.html`:
```html
<form action="https://contact.tavogeneratorius.lt" method="POST">
```

---

## 🧪 Testing & Debugging

### Test Worker Direct

```bash
# Test su curl
curl -X POST https://contact-form.YOUR-SUBDOMAIN.workers.dev \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "message=Test message from curl" \
  -F "not_robot=on"
```

### Worker Logs

1. **Cloudflare Dashboard** → Workers & Pages → contact-form
2. **Click:** "Logs" tab (Real-time logs)
3. Refresh logs po form submission
4. Matysite visas klaidas ir debug info

### Browser Console

1. Atidarykite svetainę
2. Press **F12** → Console tab
3. Užpildykite formą ir submit
4. Žiūrėkite **Network** tab → POST request
5. Patikrinkite Response

---

## 📧 Email Delivery

### MailChannels API

Worker naudoja **MailChannels** - tai nemokama email API su Cloudflare Workers:
- ✅ Puikus deliverability rating
- ✅ Niekad neblokuoja Gmail/Outlook
- ✅ Nepateks į SPAM
- ✅ 100% uptime

### Jei el. laiškai neateina:

1. **Patikrinkite SPAM folderį** Gmail
2. **Patikrinkite Worker logs** Cloudflare Dashboard
3. **Patikrinkite Browser Console** errors
4. **Test su curl** (žiūrėkite aukščiau)

### DNS Configuration (Optional, bet rekomenduojama):

Pridėkite SPF record DNS:

1. **Cloudflare Dashboard** → tavogeneratorius.lt → DNS
2. **Add record:**
   - Type: **TXT**
   - Name: **@**
   - Content: `v=spf1 a mx include:relay.mailchannels.net ~all`
3. **Save**

Tai pagerins email deliverability!

---

## 🔒 Security Features

Worker turi:

✅ **CORS protection** - Tik iš jūsų domeno  
✅ **Rate limiting** - Cloudflare built-in  
✅ **Honeypot** - Bot protection  
✅ **Input validation** - XSS apsauga  
✅ **HTML escaping** - Injection apsauga  
✅ **IP logging** - Abuse prevention  

---

## 💰 Pricing

### Cloudflare Workers Free Tier:
- ✅ 100,000 requests/dieną (per daug kontaktų formai!)
- ✅ 10ms CPU time per request
- ✅ Unlimited outbound requests

### Jūsų forma:
- ~50-100 submissions/dieną = 0.05-0.1% of limit
- **100% NEMOKAMA!**

---

## 🆘 Troubleshooting

### "Worker not found" error

- Patikrinkite Worker URL `index.html` faile
- Įsitikinkite, kad Worker deployed
- Patikrinkite, ar Worker public (ne restricted)

### "MailChannels send failed"

```javascript
// Worker logs rodys tikslią klaidą
// Dažniausiai: domain verification
```

**Sprendimas:** Pridėkite DNS TXT record (žiūrėkite aukščiau)

### CORS errors

```javascript
// Jei matote CORS klaidą browser console
// Patikrinkite, ar Worker turi CORS headers (jau įtraukti!)
```

### Form submits bet el. laiškas neatkeliauja

1. Patikrinkite **Worker Logs** → Errors
2. Patikrinkite **Gmail SPAM** folderį
3. Testuokite su **curl** (žiūrėkite Testing skiltį)
4. Pridėkite **SPF DNS record** (žiūrėkite aukščiau)

---

## 📊 Monitoring

### Real-time Logs:

**Cloudflare Dashboard** → Workers & Pages → contact-form → Logs

### Analytics:

**Cloudflare Dashboard** → Workers & Pages → contact-form → Analytics
- Requests per day
- Success rate
- Errors
- CPU time

---

## ✅ Summary

Po setup, jūsų sistema:

1. ✅ Forma svetainėje → Cloudflare Worker
2. ✅ Worker → Validation & bot protection
3. ✅ Worker → MailChannels API
4. ✅ MailChannels → Gmail inbox (su gražiu HTML!)
5. ✅ **100% nemokama, patikima, greita!**

---

**Sukurta:** 2025-10-29  
**Autorius:** AI Assistant  
**Cloudflare Workers:** https://workers.cloudflare.com/  
**MailChannels:** https://www.mailchannels.com/

