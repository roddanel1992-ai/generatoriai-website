# Google Favicon Update Guide

## Why Google Shows Old Favicon

Google caches favicons aggressively and can take **2-8 weeks** to update them in search results. This is normal behavior.

## What We've Done

✅ **Added cache-busting parameters** (`?v=2`) to all favicon references
✅ **Updated Schema.org logo** with version parameter
✅ **Deployed new favicon** to production

## How to Speed Up Google Favicon Update

### Option 1: Google Search Console (Recommended - Fastest)

1. **Go to Google Search Console:**
   - https://search.google.com/search-console

2. **Request Re-indexing:**
   - Navigate to **URL Inspection** tool
   - Enter: `https://www.tavogeneratorius.lt/`
   - Click **Request Indexing**
   - This forces Google to re-crawl your homepage and fetch new favicon

3. **Wait 1-3 days** for Google to process

### Option 2: Direct Favicon URL Request

1. **Open Google Search Console**
2. **Use URL Inspection** tool
3. **Request indexing for:**
   ```
   https://www.tavogeneratorius.lt/favicon.ico?v=2
   https://www.tavogeneratorius.lt/favicon.png?v=2
   ```

### Option 3: Verify Favicon is Accessible

Test that your favicon loads correctly:
- Visit: `https://www.tavogeneratorius.lt/favicon.ico?v=2`
- Visit: `https://www.tavogeneratorius.lt/favicon.png?v=2`
- Visit: `https://www.tavogeneratorius.lt/favicon.svg?v=2`

All should load without errors.

### Option 4: Check Current Favicon in Google

1. **Search for:** `site:tavogeneratorius.lt`
2. **Check the favicon** shown in search results
3. **If still old:** Google hasn't updated yet (normal, can take weeks)

## Technical Details

### Current Favicon Files:
- ✅ `/favicon.ico` - Windows/IE (32x32)
- ✅ `/favicon.svg` - Modern browsers (vector)
- ✅ `/favicon-16x16.png` - Small size
- ✅ `/favicon-32x32.png` - Standard size
- ✅ `/favicon.png` - Large size (192x192)
- ✅ `/apple-touch-icon.png` - iOS devices

### Cache-Busting:
All favicon URLs now include `?v=2` parameter to force browsers and Google to fetch the new version instead of using cached old version.

## Expected Timeline

- **Immediate:** Your website shows new favicon ✅
- **1-3 days:** After Search Console re-indexing request
- **2-8 weeks:** Natural Google cache refresh (if no manual request)

## Troubleshooting

### If favicon still doesn't update after 2 weeks:

1. **Check favicon file sizes:**
   - ICO should be < 100KB
   - PNG should be < 200KB
   - SVG should be < 10KB

2. **Verify HTTP headers:**
   - Favicon should return `200 OK`
   - Should have proper `Content-Type` header

3. **Check robots.txt:**
   - Ensure `/favicon.ico` is not blocked

4. **Re-request indexing** in Google Search Console

## Notes

- Google may show different favicons in different search result positions
- Mobile search results may update faster than desktop
- Some Google services (like Google My Business) have separate favicon caches

