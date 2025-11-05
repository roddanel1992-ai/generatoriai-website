# Cloudflare URL Canonicalization Setup

## 🔗 **URL CANONICALIZATION - Redirect Rules**

### **Problema:**
Google randa kelias jūsų puslapio versijas:
- ❌ `http://tavogeneratorius.lt` (be www, be HTTPS)
- ❌ `http://www.tavogeneratorius.lt` (su www, be HTTPS)
- ❌ `https://tavogeneratorius.lt` (be www, su HTTPS)
- ✅ `https://www.tavogeneratorius.lt` (TEISINGAS - canonical)

**SEO problema:** Google nesugeba nuspręsti, kuris yra pagrindinis URL, todėl puslapio reitingas skirstomas.

---

## **SPRENDIMAS: Cloudflare Redirect Rules**

### **1️⃣ Prisijunkite prie Cloudflare:**

https://dash.cloudflare.com/

Pasirinkite domeną: **tavogeneratorius.lt**

---

###  **2️⃣ Sukurti Redirect Rule #1: HTTP → HTTPS**

1. Eikite į: **Rules** → **Redirect Rules**
2. Paspauskite **"Create rule"**
3. Įveskite:

**Rule name:** `Force HTTPS`

**When incoming requests match:**
```
(http.host eq "tavogeneratorius.lt" or http.host eq "www.tavogeneratorius.lt") and not ssl
```

**Then:**
- Type: **Dynamic**
- Expression: `concat("https://www.tavogeneratorius.lt", http.request.uri.path)`
- Status code: **301 (Permanent Redirect)**
- Preserve query string: **Yes**

4. Paspauskite **"Save"**

---

### **3️⃣ Sukurti Redirect Rule #2: Non-WWW → WWW**

1. Paspauskite **"Create rule"** dar kartą
2. Įveskite:

**Rule name:** `Force WWW`

**When incoming requests match:**
```
http.host eq "tavogeneratorius.lt"
```

**Then:**
- Type: **Dynamic**
- Expression: `concat("https://www.tavogeneratorius.lt", http.request.uri.path)`
- Status code: **301 (Permanent Redirect)**
- Preserve query string: **Yes**

3. Paspauskite **"Save"**

---

### **4️⃣ Patikrinti SSL/TLS Settings:**

1. Eikite į: **SSL/TLS** → **Overview**
2. Pasirinkite: **Full (strict)** arba **Full**
3. Įjunkite **"Always Use HTTPS"**:
   - SSL/TLS → **Edge Certificates**
   - **Always Use HTTPS:** ON

---

### **5️⃣ Patikrinti, ar veikia:**

Testuokite šiuos URL:

```bash
# Test 1: HTTP be www → turėtų redirect į HTTPS su www
curl -I http://tavogeneratorius.lt
# Expected: Location: https://www.tavogeneratorius.lt/

# Test 2: HTTPS be www → turėtų redirect į HTTPS su www
curl -I https://tavogeneratorius.lt
# Expected: Location: https://www.tavogeneratorius.lt/

# Test 3: HTTP su www → turėtų redirect į HTTPS su www
curl -I http://www.tavogeneratorius.lt
# Expected: Location: https://www.tavogeneratorius.lt/

# Test 4: HTTPS su www → turėtų būti 200 OK (jokio redirect)
curl -I https://www.tavogeneratorius.lt
# Expected: HTTP/2 200
```

---

## **6️⃣ Papildoma Optimizacija (Rekomenduojama):**

### **A. Auto Minify:**
1. **Speed** → **Optimization**
2. Įjunkite **Auto Minify:**
   - ☑️ JavaScript
   - ☑️ CSS
   - ☑️ HTML

### **B. Brotli Compression:**
1. **Speed** → **Optimization**
2. **Brotli:** ON

### **C. Early Hints:**
1. **Speed** → **Optimization**
2. **Early Hints:** ON

### **D. Browser Cache TTL:**
1. **Caching** → **Configuration**
2. **Browser Cache TTL:** 1 month

---

## **7️⃣ Patikrinti Google Search Console:**

1. Eikite į: https://search.google.com/search-console
2. **Settings** → **Address**
3. Pasirinkite: **https://www.tavogeneratorius.lt/** (su www)
4. Submit **sitemap.xml:**
   ```
   https://www.tavogeneratorius.lt/sitemap.xml
   ```

---

## **8️⃣ Patikrinti kurpirktigeneratoriu.lt:**

Jei naudojate **kurpirktigeneratoriu.lt** kaip papildomą domeną, taip pat sukurkite redirect:

**Rule name:** `Redirect kurpirktigeneratoriu.lt to tavogeneratorius.lt`

**When incoming requests match:**
```
http.host eq "kurpirktigeneratoriu.lt" or http.host eq "www.kurpirktigeneratoriu.lt"
```

**Then:**
- Type: **Dynamic**
- Expression: `concat("https://www.tavogeneratorius.lt", http.request.uri.path)`
- Status code: **301 (Permanent Redirect)**
- Preserve query string: **Yes**

---

## ✅ **Rezultatas:**

Po šių nustatymų:
- ✅ Visi URL automatiškai redirect į `https://www.tavogeneratorius.lt`
- ✅ Google mato TIK vieną canonical URL
- ✅ SEO reitingas nesiskirstys
- ✅ HTTPS visur (saugumas)
- ✅ Geresnis Google ranking

---

**Reikia pagalbos?** Skambinkite: **+370 607 94868**

