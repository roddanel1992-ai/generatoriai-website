# 🚀 QUICKSTART - Cloudflare Worker Email (5 minutės!)

## ⚡ Greiti Žingsniai

### 1. Cloudflare Dashboard

https://dash.cloudflare.com/ → **Workers & Pages**

### 2. Sukurkite Worker

- Click "Create application" → "Create Worker"
- Name: `contact-form`
- Click "Deploy"

### 3. Redaguokite Worker

- Click "Edit code"
- **Ištrinkite viską**
- **Paste** kodą iš `cloudflare-worker.js`
- Click "Save and Deploy"

### 4. Nukopijuokite URL

```
https://contact-form.JŪSŲ-SUBDOMAIN.workers.dev
```

### 5. Atnaujinkite index.html

Suraskite:
```html
<form action="https://contact-form.YOUR-SUBDOMAIN.workers.dev"
```

Pakeiskite `YOUR-SUBDOMAIN` į jūsų tikrą!

### 6. Commit & Push

```bash
git add index.html
git commit -m "Update Worker URL"
git push origin main
```

### 7. Serveryje

```bash
cd /var/www/generatoriai
git pull origin main
```

### 8. Testuokite!

https://tavogeneratorius.lt/ → Užpildykite formą → Submit

**El. laiškas turėtų ateiti į `tavogeneratorius@gmail.com` per 10 sekundžių!** ✅

---

## 📧 Patikrinkite

- ✅ Gmail Inbox
- ✅ Gmail SPAM (jei nerandote)
- ✅ Browser Console (F12) - errors?
- ✅ Cloudflare Worker Logs

---

## 🎯 Privalumai

✅ **100% NEMOKAMA**  
✅ **Nereikia Gmail App Password**  
✅ **Niekad nepateks į SPAM**  
✅ **Patikima Cloudflare infrastruktūra**  
✅ **Greita - Global CDN**

---

**Pilnos instrukcijos:** `CLOUDFLARE-WORKER-SETUP.md`

**Problemos?** Žiūrėkite Troubleshooting skyriuje setup faile!

