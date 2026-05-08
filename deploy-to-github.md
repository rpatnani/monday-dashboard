# 🚀 Quick Deploy to GitHub Pages (Step-by-Step)

## What You'll Get
A shareable link like: `https://YOUR-USERNAME.github.io/monday-dashboard/`

---

## Step 1: Create GitHub Account (if needed)
1. Go to https://github.com
2. Click "Sign up"
3. Follow the registration steps
4. Verify your email

---

## Step 2: Create New Repository

1. **Login to GitHub**
2. **Click the "+" icon** (top right) → "New repository"
3. **Fill in details:**
   - Repository name: `monday-dashboard`
   - Description: "Product Serviceability Dashboard for Monday.com"
   - Select: **Public** (required for free GitHub Pages)
   - ✅ Check "Add a README file"
4. **Click "Create repository"**

---

## Step 3: Upload Dashboard Files

### Method A: Web Upload (Easiest)

1. **In your new repository**, click "Add file" → "Upload files"

2. **Open File Explorer** and navigate to:
   ```
   C:\Users\RAMALINGAM\Desktop\monday-dashboard
   ```

3. **Select ALL files and folders:**
   - index.html
   - css folder (with styles.css inside)
   - js folder (with monday-api.js and dashboard.js inside)
   - README.md
   - All other .md files

4. **Drag and drop** them into the GitHub upload area

5. **Scroll down** and click "Commit changes"

6. **Wait** for upload to complete (30 seconds - 1 minute)

### Method B: Using Git (Advanced)

```powershell
# Open PowerShell in the monday-dashboard folder
cd C:\Users\RAMALINGAM\Desktop\monday-dashboard

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial dashboard commit"

# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/monday-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 4: Enable GitHub Pages

1. **In your repository**, click "Settings" (top menu)

2. **Scroll down** to find "Pages" in the left sidebar

3. **Under "Source":**
   - Branch: Select **main**
   - Folder: Select **/ (root)**
   - Click **Save**

4. **Wait 2-3 minutes** for deployment

5. **Refresh the page** - you'll see:
   ```
   Your site is live at https://YOUR-USERNAME.github.io/monday-dashboard/
   ```

---

## Step 5: Test Your Dashboard

1. **Click the link** GitHub provides
2. **Enter your API token** (from Monday.com)
3. **Board ID** should be pre-filled: `6642841355`
4. **Click "Load Dashboard Data"**
5. **Verify** everything works

---

## Step 6: Share with Your Manager

### Copy this email template:

```
Subject: Product Serviceability Dashboard

Hi [Manager Name],

I've created an interactive dashboard for our Monday.com board:

🔗 Dashboard Link: https://YOUR-USERNAME.github.io/monday-dashboard/

Features:
✅ Per-product serviceability items with status breakdown
✅ Monthly highlights showing delivered items
✅ Delta changes (new, delivered, cancelled, modified)
✅ Interactive charts and analytics
✅ Real-time data from Monday.com

To Access:
1. Click the link above
2. Enter your Monday.com API token
   (Get it from: Monday.com → Profile → Developers → My Access Tokens)
3. Board ID is pre-filled: 6642841355
4. Click "Load Dashboard Data"

The dashboard updates in real-time from our board.

Let me know if you need help!

Best,
[Your Name]
```

---

## 🔐 Security Note

**API Token:**
- Each person should use their own API token
- Tokens are stored locally in the browser
- Never share tokens via email
- You can create read-only tokens in Monday.com

---

## 🔄 Updating the Dashboard

When you make changes:

1. **Go to your GitHub repository**
2. **Click on the file** you want to update
3. **Click the pencil icon** (Edit)
4. **Make your changes**
5. **Scroll down** and click "Commit changes"
6. **Wait 2-3 minutes** - changes appear automatically

---

## ✅ Checklist

- [ ] GitHub account created
- [ ] Repository created (public)
- [ ] All files uploaded
- [ ] GitHub Pages enabled
- [ ] Dashboard link works
- [ ] Tested with API token
- [ ] Link shared with manager

---

## 🆘 Common Issues

### "404 - Page not found"
- Wait 2-3 minutes after enabling GitHub Pages
- Check that repository is Public
- Verify index.html is in root folder

### "Files not showing"
- Make sure you uploaded the css and js folders
- Check folder structure is correct
- Refresh the page

### "API token not working"
- Get a fresh token from Monday.com
- Ensure token has access to board 6642841355
- Try in incognito/private browser window

---

## 💡 Pro Tips

1. **Custom URL:** You can change the repository name anytime to get a different URL

2. **Bookmark:** Add the link to your browser bookmarks for quick access

3. **Mobile:** The dashboard works on phones and tablets too

4. **Updates:** Any changes you push to GitHub automatically update the live site

---

## 🎉 You're Done!

Your dashboard is now live and shareable. Your manager can access it anytime from anywhere!

**Your Link:** `https://YOUR-USERNAME.github.io/monday-dashboard/`

(Replace YOUR-USERNAME with your actual GitHub username)