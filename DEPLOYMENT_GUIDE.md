# 🌐 Deployment Guide - Share Your Dashboard

## Quick Deployment Options

### Option 1: GitHub Pages (Recommended - FREE)
**Best for:** Easy sharing with a permanent link

#### Steps:
1. **Create a GitHub Account** (if you don't have one)
   - Go to https://github.com
   - Sign up for free

2. **Create a New Repository**
   - Click "+" → "New repository"
   - Name it: `monday-dashboard`
   - Make it **Public**
   - Click "Create repository"

3. **Upload Your Files**
   - Click "uploading an existing file"
   - Drag and drop ALL files from `monday-dashboard` folder:
     - index.html
     - css/styles.css
     - js/monday-api.js
     - js/dashboard.js
     - README.md
   - Click "Commit changes"

4. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Under "Source", select "main" branch
   - Click "Save"
   - Wait 2-3 minutes

5. **Get Your Link**
   - Your dashboard will be available at:
   - `https://YOUR-USERNAME.github.io/monday-dashboard/`
   - Share this link with your manager!

**Pros:**
- ✅ Free forever
- ✅ Permanent link
- ✅ Easy to update
- ✅ Professional URL

---

### Option 2: Netlify (Easiest - FREE)
**Best for:** Fastest deployment (2 minutes)

#### Steps:
1. **Go to Netlify**
   - Visit https://app.netlify.com/drop

2. **Drag & Drop**
   - Drag the entire `monday-dashboard` folder
   - Drop it on the page
   - Wait 30 seconds

3. **Get Your Link**
   - Netlify generates a link like: `https://random-name-123.netlify.app`
   - Click "Change site name" to customize it
   - Share the link!

**Pros:**
- ✅ Fastest (2 minutes)
- ✅ No account needed initially
- ✅ Free SSL certificate
- ✅ Can customize domain

---

### Option 3: Vercel (FREE)
**Best for:** Professional deployment

#### Steps:
1. **Sign up at Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import from GitHub (after uploading to GitHub)
   - Click "Deploy"

3. **Get Your Link**
   - Vercel provides: `https://monday-dashboard.vercel.app`
   - Share the link!

**Pros:**
- ✅ Professional
- ✅ Auto-updates from GitHub
- ✅ Fast global CDN

---

### Option 4: Simple HTTP Server (Local Network Only)
**Best for:** Quick testing or local network sharing

#### Steps:
1. **Open Terminal/PowerShell** in the `monday-dashboard` folder

2. **Start Server:**
   ```powershell
   # If you have Python installed:
   python -m http.server 8000
   
   # OR if you have Node.js:
   npx http-server -p 8000
   ```

3. **Share Local Link:**
   - Your computer: `http://localhost:8000`
   - Same network: `http://YOUR-IP-ADDRESS:8000`
   - Find your IP: Run `ipconfig` in PowerShell

**Pros:**
- ✅ Instant
- ✅ No upload needed

**Cons:**
- ❌ Only works on same network
- ❌ Computer must stay on

---

## 🔐 Security Considerations

### API Token Sharing
**IMPORTANT:** The dashboard stores API tokens in the browser's localStorage.

**For Manager Access:**

#### Option A: Manager Uses Their Own Token (Recommended)
1. Manager opens the dashboard link
2. Manager enters their own Monday.com API token
3. Each person has their own credentials

#### Option B: Shared Token (Use with Caution)
1. Create a read-only API token in Monday.com
2. Share the dashboard link
3. Share the token separately (via secure channel)

**Best Practice:**
- ✅ Use read-only tokens
- ✅ Share token via secure channel (not email)
- ✅ Regenerate tokens periodically

---

## 📧 Sharing with Your Manager

### Email Template:

```
Subject: Product Serviceability Dashboard - Monday.com

Hi [Manager Name],

I've created an interactive dashboard for our Monday.com board that shows:
- Per-product serviceability items and their status
- Highlights of items delivered this month
- Delta changes (new, delivered, cancelled, modified items)
- Analytics and trends

Dashboard Link: [YOUR-LINK-HERE]

To access:
1. Open the link
2. Enter your Monday.com API token (get it from Monday.com → Profile → Developers → My Access Tokens)
3. Board ID is pre-filled: 6642841355
4. Click "Load Dashboard Data"

The dashboard updates in real-time from our Monday.com board.

Let me know if you need any help accessing it!

Best regards,
[Your Name]
```

---

## 🔄 Updating the Dashboard

### If Using GitHub Pages:
1. Make changes to your local files
2. Go to your GitHub repository
3. Upload the updated files
4. Changes appear automatically in 2-3 minutes

### If Using Netlify:
1. Make changes to your local files
2. Drag and drop the folder again to Netlify
3. Changes appear instantly

### If Using Vercel:
1. Push changes to GitHub
2. Vercel auto-deploys
3. Changes appear in ~30 seconds

---

## 🎯 Recommended Approach

**For Sharing with Manager:**

1. **Use GitHub Pages** (most professional)
   - Permanent link
   - Easy to remember
   - Free forever

2. **Create Read-Only Token**
   - Go to Monday.com
   - Create a new API token with read-only access
   - Share this token with your manager

3. **Send Professional Email**
   - Include the dashboard link
   - Provide setup instructions
   - Offer to help with first login

---

## 🆘 Troubleshooting

### "Dashboard not loading"
- Check if files uploaded correctly
- Verify all folders (css, js) are included
- Wait 2-3 minutes after deployment

### "API token not working"
- Verify token has board access
- Check token hasn't expired
- Try generating a new token

### "Charts not showing"
- Check internet connection (Chart.js loads from CDN)
- Try different browser
- Clear browser cache

---

## 💡 Pro Tips

1. **Custom Domain**
   - GitHub Pages: Add custom domain in settings
   - Netlify: Free custom domain support
   - Makes link more professional

2. **Bookmark the Link**
   - Add to browser bookmarks
   - Share bookmark with team

3. **Mobile Access**
   - Dashboard is mobile-responsive
   - Works on phones and tablets

4. **Regular Updates**
   - Keep dashboard files updated
   - Add new features as needed

---

## 📞 Need Help?

If you need assistance with deployment:
1. Check the platform's documentation
2. Most platforms have free support
3. Community forums are very helpful

**Your dashboard is ready to share! Choose your preferred deployment method and get started.** 🚀