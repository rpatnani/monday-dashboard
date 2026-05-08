# 🚀 Deploy to IBM GitHub Enterprise

## Quick Deploy to https://github.ibm.com/

---

## Prerequisites
- IBM GitHub Enterprise account (https://github.ibm.com/)
- Access to create repositories

---

## Method 1: Web Upload (Easiest - 5 minutes)

### Step 1: Create Repository on IBM GitHub

1. **Login** to https://github.ibm.com/
2. **Click "+" icon** (top right) → "New repository"
3. **Fill in:**
   - Repository name: `monday-dashboard`
   - Description: "Product Serviceability Dashboard for Monday.com"
   - Visibility: **Public** or **Internal** (your choice)
   - ✅ Initialize with README
4. **Click "Create repository"**

### Step 2: Upload Files

1. **In your new repository**, click "Add file" → "Upload files"

2. **Open File Explorer:**
   ```
   C:\Users\RAMALINGAM\Desktop\monday-dashboard
   ```

3. **Select and drag ALL files:**
   - index.html
   - css/ folder
   - js/ folder
   - All .md files

4. **Drop them** in the upload area

5. **Commit message:** "Initial dashboard deployment"

6. **Click "Commit changes"**

### Step 3: Enable GitHub Pages

1. **Go to Settings** (in your repository)
2. **Find "Pages"** in left sidebar
3. **Under Source:**
   - Branch: **main**
   - Folder: **/ (root)**
4. **Click "Save"**
5. **Wait 2-3 minutes**

### Step 4: Get Your Link

Your dashboard will be available at:
```
https://pages.github.ibm.com/YOUR-USERNAME/monday-dashboard/
```

**Share this link with your manager!**

---

## Method 2: Using Git (Command Line)

### Step 1: Initialize Git Repository

Open PowerShell in the dashboard folder:

```powershell
cd C:\Users\RAMALINGAM\Desktop\monday-dashboard

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial dashboard deployment"
```

### Step 2: Create Repository on IBM GitHub

1. Go to https://github.ibm.com/
2. Create new repository: `monday-dashboard`
3. **Copy the repository URL** (it will look like):
   ```
   https://github.ibm.com/YOUR-USERNAME/monday-dashboard.git
   ```

### Step 3: Push to IBM GitHub

```powershell
# Add remote (replace YOUR-USERNAME with your IBM username)
git remote add origin https://github.ibm.com/YOUR-USERNAME/monday-dashboard.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to repository Settings → Pages
2. Enable Pages with main branch
3. Wait 2-3 minutes

---

## Method 3: Using GitHub Desktop (Visual)

### Step 1: Install GitHub Desktop

1. Download from: https://desktop.github.com/
2. Install and login with IBM credentials
3. Configure for IBM GitHub Enterprise:
   - File → Options → Accounts
   - Add Enterprise account: `github.ibm.com`

### Step 2: Create Repository

1. **File** → **Add Local Repository**
2. **Choose** the `monday-dashboard` folder
3. **Click** "Create Repository"
4. **Publish** to IBM GitHub Enterprise

### Step 3: Enable Pages

1. Go to https://github.ibm.com/YOUR-USERNAME/monday-dashboard
2. Settings → Pages
3. Enable with main branch

---

## 🔗 Your Shareable Link

After deployment, your link will be:

```
https://pages.github.ibm.com/YOUR-USERNAME/monday-dashboard/
```

**Example:**
If your IBM username is `ramalingam`, the link would be:
```
https://pages.github.ibm.com/ramalingam/monday-dashboard/
```

---

## 📧 Email Template for Manager

```
Subject: Product Serviceability Dashboard - Monday.com

Hi [Manager Name],

I've deployed our Product Serviceability Dashboard:

🔗 Dashboard Link: https://pages.github.ibm.com/YOUR-USERNAME/monday-dashboard/

This dashboard provides:
• Real-time per-product serviceability tracking
• Monthly highlights of delivered items
• Delta changes (new, delivered, cancelled, modified)
• Interactive analytics and trends

To Access:
1. Click the link above
2. Enter your Monday.com API token
   (Get from: Monday.com → Profile → Developers → My Access Tokens)
3. Board ID is pre-filled: 6642841355
4. Click "Load Dashboard Data"

The dashboard syncs directly with our Monday.com board.

Repository: https://github.ibm.com/YOUR-USERNAME/monday-dashboard

Let me know if you need assistance!

Best regards,
[Your Name]
```

---

## 🔐 Security Notes

### For IBM Internal Use:

1. **Repository Visibility:**
   - Use "Internal" for IBM-only access
   - Use "Public" if you want it visible to all IBM employees

2. **API Token:**
   - Each user should use their own Monday.com token
   - Tokens are stored locally in browser
   - Never commit tokens to the repository

3. **Access Control:**
   - You can add specific collaborators in Settings → Collaborators
   - Control who can view/edit the repository

---

## 🔄 Updating the Dashboard

When you make changes:

### Via Web:
1. Go to your repository on github.ibm.com
2. Navigate to the file
3. Click pencil icon to edit
4. Commit changes
5. Wait 2-3 minutes for Pages to update

### Via Git:
```powershell
cd C:\Users\RAMALINGAM\Desktop\monday-dashboard

# Make your changes, then:
git add .
git commit -m "Update dashboard"
git push
```

---

## ✅ Deployment Checklist

- [ ] Logged into https://github.ibm.com/
- [ ] Created repository: `monday-dashboard`
- [ ] Uploaded all files (index.html, css/, js/)
- [ ] Enabled GitHub Pages in Settings
- [ ] Waited 2-3 minutes for deployment
- [ ] Tested the dashboard link
- [ ] Verified with API token
- [ ] Shared link with manager

---

## 🆘 Troubleshooting

### "Pages not available"
- Check if IBM GitHub Enterprise has Pages enabled
- Contact IBM GitHub admin if needed
- Alternative: Use IBM Cloud or internal hosting

### "Authentication failed"
- Use IBM SSO credentials
- May need to generate personal access token
- Go to Settings → Developer settings → Personal access tokens

### "Can't push to repository"
- Verify you have write access
- Check if repository exists
- Ensure correct remote URL

---

## 💡 Alternative: IBM Cloud Hosting

If GitHub Pages isn't available on IBM GitHub Enterprise:

1. **Use IBM Cloud Static Web Apps**
2. **Deploy to IBM Cloud Foundry**
3. **Use IBM Cloud Object Storage** with static website hosting

Would you like instructions for IBM Cloud deployment instead?

---

## 📞 Need Help?

- IBM GitHub Support: Contact your IBM GitHub admin
- Internal IT: Submit ticket for GitHub Enterprise access
- Alternative: I can provide IBM Cloud deployment instructions

---

**Ready to deploy! Follow Method 1 (Web Upload) for the easiest deployment.** 🚀