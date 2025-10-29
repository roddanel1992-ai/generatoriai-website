# 📧 PHP Email Sistema - Įdiegimo Instrukcijos

## Kas pasikeitė?

✅ Pakeista **FormSubmit.co** į **PHP email sistemą**  
✅ El. laiškai siunčiami **tiesiogiai iš jūsų serverio**  
✅ Nereikia išorinių servisų ar verifikacijų  
✅ Veikia su **Cloudflare** ir **Debian/nginx**

---

## 🚀 Įdiegimo Žingsniai

### 1. SSH į Debian serverį

```bash
ssh your-user@your-server-ip
```

### 2. Įdiekite PHP ir mail funkcionalumą

```bash
# Update package list
sudo apt update

# Install PHP with FPM (for nginx)
sudo apt install -y php-fpm php-cli php-common php-mbstring

# Install mail functionality
sudo apt install -y sendmail mailutils

# Verify installation
php -v
which sendmail
```

### 3. Konfigūruokite nginx PHP palaikymui

Redaguokite nginx konfigūraciją:

```bash
sudo nano /etc/nginx/sites-available/generatoriai.conf
```

Pridėkite PHP location bloką į serverio konfigūraciją:

```nginx
server {
    listen 8082;
    server_name generatoriai.lt www.generatoriai.lt;

    root /var/www/generatoriai;
    index index.html index.htm index.php;

    # Existing location block
    location / {
        try_files $uri $uri/ =404;
    }

    # ✅ ADD THIS - PHP support
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;  # Adjust version if needed
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Rest of your config...
}
```

**Pastaba:** Patikrinkite PHP versija:
```bash
ls /var/run/php/
# Matysite: php8.2-fpm.sock arba php7.4-fpm.sock
# Naudokite tą versiją nginx config faile
```

### 4. Perkraukite nginx ir PHP-FPM

```bash
# Test nginx configuration
sudo nginx -t

# If OK, reload nginx
sudo systemctl reload nginx

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm  # Adjust version

# Check status
sudo systemctl status nginx
sudo systemctl status php8.2-fpm
```

### 5. Atnaujinkite website failus

```bash
cd /var/www/generatoriai

# Pull latest changes from GitHub
git pull origin main

# Verify files exist
ls -la send-email.php
ls -la index.html

# Set correct permissions
sudo chown -R www-data:www-data /var/www/generatoriai
sudo chmod 644 send-email.php
```

### 6. Konfigūruokite sendmail (Gmail SMTP)

Jei norite siųsti per Gmail SMTP (geresnė deliverability):

```bash
# Install ssmtp (lightweight SMTP)
sudo apt install -y ssmtp

# Configure ssmtp
sudo nano /etc/ssmtp/ssmtp.conf
```

Pridėkite šią konfigūraciją:

```conf
root=tavogeneratorius@gmail.com
mailhub=smtp.gmail.com:587
AuthUser=tavogeneratorius@gmail.com
AuthPass=your-gmail-app-password
UseSTARTTLS=YES
FromLineOverride=YES
```

**Svarbu:** Reikia **Gmail App Password**, ne įprasto slaptažodžio:
1. Eikite į: https://myaccount.google.com/security
2. Įjunkite **2-Step Verification**
3. Eikite į: https://myaccount.google.com/apppasswords
4. Sukurkite naują "App Password" - "Mail"
5. Naudokite tą slaptažodį `ssmtp.conf` faile

### 7. Testuokite email siuntimą

```bash
# Simple test
echo "Test email body" | mail -s "Test Subject" tavogeneratorius@gmail.com

# Check if email was sent
tail -f /var/log/mail.log

# Or check temporary logs
tail -f /tmp/contact_form.log
```

---

## ✅ Testavimas

### 1. Atidarykite svetainę

```
https://tavogeneratorius.lt
```

### 2. Užpildykite kontaktų formą

- Įveskite vardą
- Įveskite email
- Įveskite žinutę
- Pažymėkite "Aš nesu robotas"
- Spauskite "Siųsti žinutę"

### 3. Patikrinkite el. paštą

Turėtumėte gauti el. laišką adresu `tavogeneratorius@gmail.com` su gražiu HTML formatu!

---

## 🐛 Troubleshooting

### PHP failas nenuskaito (404 error)

```bash
# Check PHP-FPM status
sudo systemctl status php8.2-fpm

# Check nginx error log
sudo tail -f /var/log/nginx/error.log

# Check PHP errors
sudo tail -f /var/log/php8.2-fpm.log
```

### El. laiškai nesiunčiami

```bash
# Check mail log
sudo tail -f /var/log/mail.log

# Check sendmail status
sudo systemctl status sendmail

# Test sendmail manually
echo "Test" | sendmail tavogeneratorius@gmail.com

# Check contact form log
tail -f /tmp/contact_form.log
```

### Permission errors

```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/generatoriai
sudo chmod 755 /var/www/generatoriai
sudo chmod 644 /var/www/generatoriai/send-email.php
```

### Gmail blokuoja el. laiškus

Jei naudojate Gmail ir el. laiškai neateina:

1. Įjunkite **Less secure app access** (senesnėms Gmail paskyroms)
2. Arba naudokite **Gmail App Password** (rekomenduojama)
3. Patikrinkite Gmail **SPAM** folderį

---

## 📝 Saugumo Pastabos

✅ **Rate limiting** - 1 forma per minutę nuo to paties IP  
✅ **Honeypot** - Apsauga nuo botų  
✅ **Input sanitization** - XSS apsauga  
✅ **Email validation** - Tikrina email formato teisingumą  
✅ **CSRF protection** - Per formą load time check  

---

## 🔄 Grįžimas į FormSubmit.co

Jei PHP sistema neveiks, galite grįžti:

1. Atidaryti `index.html`
2. Pakeisti `action="send-email.php"` į `action="https://formsubmit.co/tavogeneratorius@gmail.com"`
3. Commitinti ir push'inti

---

## 📞 Pagalba

Jei kyla problemų:
- Patikrinkite `/var/log/nginx/error.log`
- Patikrinkite `/var/log/mail.log`
- Patikrinkite browser console (F12 → Console)
- Siųskite error logus man!

---

**Sukurta:** 2025-01-29  
**Autorius:** AI Assistant  
**Versija:** 1.0

