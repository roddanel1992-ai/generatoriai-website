# Google Analytics 4 Setup Instructions

## 📊 **KAIPĮjungti Google Analytics 4**

### **1️⃣ Sukurti Google Analytics 4 Account:**

1. Eikite į: https://analytics.google.com/
2. Paspauskite **"Admin"** (kairėje apačioje)
3. Pasirinkite **"Create Account"**
4. Užpildykite:
   - Account name: `Tavo Generatorius`
   - Property name: `tavogeneratorius.lt`
   - Industry: `Industrial Machinery & Equipment`
   - Time zone: `(GMT+02:00) Vilnius`
5. Paspauskite **"Create"**

---

### **2️⃣ Gauti Measurement ID:**

1. Admin → Property → **Data Streams**
2. Paspauskite **"Add stream"** → **"Web"**
3. Įveskite:
   - Website URL: `https://www.tavogeneratorius.lt`
   - Stream name: `Tavo Generatorius Website`
4. Paspauskite **"Create stream"**
5. **NUKOPIJUOKITE Measurement ID** (pvz., `G-XXXXXXXXXX`)

---

### **3️⃣ Įdiekti į Website:**

Atidarykite `index.html` ir **raskite šį kodą** (line 48-65):

```html
<!-- Google Analytics 4 - Ready for configuration -->
<!-- Replace GA_MEASUREMENT_ID with your actual Google Analytics 4 Measurement ID -->
<!--
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());
	gtag('config', 'GA_MEASUREMENT_ID', {
		page_title: 'Tavo Generatorius - Generatorių Montavimas Lietuvoje',
		page_location: window.location.href,
		custom_map: {
			'custom_parameter_1': 'generator_services',
			'custom_parameter_2': 'electrical_work_lithuania'
		}
	});
</script>
-->
```

**PAKEISKITE Į:**

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());
	gtag('config', 'G-XXXXXXXXXX', {
		page_title: 'Tavo Generatorius - Generatorių Montavimas Lietuvoje',
		page_location: window.location.href,
		custom_map: {
			'custom_parameter_1': 'generator_services',
			'custom_parameter_2': 'electrical_work_lithuania'
		}
	});
</script>
```

⚠️ **SVARBU:** Pakeiskite `G-XXXXXXXXXX` į jūsų tikrą Measurement ID!

---

### **4️⃣ Pridėti į VISUS paslaugų puslapius:**

Taip pat pridėkite GA4 kodą į šiuos failus (prieš `</head>` tagą):

```
✓ paslaugos/elektros-skydo-surinkimas.html
✓ paslaugos/interneto-sprendimai.html
✓ paslaugos/signalizacija.html
✓ paslaugos/ismanios-kontroles.html
✓ paslaugos/garso-sistemos.html
✓ paslaugos/generatoriu-parinkimas.html
✓ paslaugos/generatoriu-montavimas.html
✓ paslaugos/elektros-skydu-pritaikymas.html
✓ paslaugos/ismanios-valdymo-sistemos-generatoriams.html
✓ paslaugos/mokymai-ir-instruktavimas.html
✓ paslaugos/prieziura-ir-aptarnavimas.html
✓ 404.html
```

---

### **5️⃣ Commit ir Push:**

```bash
git add .
git commit -m "feat: Add Google Analytics 4 tracking"
git push
```

---

### **6️⃣ Patikrinti, ar veikia:**

1. Atidarykite: https://www.tavogeneratorius.lt
2. Google Analytics → Reports → Realtime
3. Turėtumėte matyti save kaip aktyvų vartotoją

---

## 📈 **Papildomi Nustatymai (Rekomenduojama):**

### **A. Enhanced Measurement (Automatinis Tracking):**

1. Admin → Data Streams → **Your Stream**
2. **Enhanced Measurement** → įjunkite:
   - ☑️ Page views
   - ☑️ Scrolls
   - ☑️ Outbound clicks
   - ☑️ Site search
   - ☑️ Form interactions
   - ☑️ Video engagement

### **B. Link to Google Search Console:**

1. Admin → Property Settings
2. **Product links** → **Search Console** → **Link**
3. Pasirinkite `tavogeneratorius.lt`

### **C. Set up Conversions:**

1. Admin → Events
2. **Create event:**
   - Event name: `form_submission`
   - Mark as conversion: **Yes**

---

## ✅ **Rezultatas:**

Po šių nustatymų matysite:
- 📊 Puslapio peržiūras
- 👥 Lankytojų skaičių
- 📍 Geografinę vietą
- 📱 Įrenginių tipus
- 🔍 Traffic šaltinius (Google, Facebook, direct, etc.)
- ⏱️ Laiką puslapyje
- 📝 Form submissions (kontaktų forma)

---

**Reikia pagalbos?** Skambinkite: **+370 607 94868**

