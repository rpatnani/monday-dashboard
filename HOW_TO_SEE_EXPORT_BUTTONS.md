# How to See the Export Buttons

## ⚠️ Important: Export Buttons Are Hidden Until Data Loads

The export buttons **only appear after you load dashboard data**. This is by design.

## 📍 Where Are The Buttons?

The export buttons are located in the **MOR Report Section** at the top of the dashboard, but they're inside a container that's hidden (`display: none`) until you complete the setup.

## ✅ Step-by-Step to See the Buttons:

### Step 1: Open the Dashboard
1. Open `index.html` in your web browser
2. You'll see the configuration section at the top

### Step 2: Enter Credentials
1. **API Token**: Enter your Monday.com API token
2. **Board ID**: Enter your board ID (e.g., 6642841355)

### Step 3: Load Data
1. Click the **"Load Dashboard Data"** button
2. Wait for the data to load (you'll see a loading message)

### Step 4: See the Export Buttons! 🎉
Once data loads successfully, you'll see:
- A purple section at the top labeled "📊 Monthly Operating Review (MOR) Report"
- Two buttons side by side:
  - **📄 Export to Text** (white button)
  - **📊 Export to PowerPoint** (orange button)

## 🖼️ Visual Guide

```
Before Loading Data:
┌─────────────────────────────────────┐
│  ⚙️ Configuration                   │
│  [API Token Input]                  │
│  [Board ID Input]                   │
│  [Load Dashboard Data] [Refresh]    │
└─────────────────────────────────────┘
(Nothing below - dashboard is hidden)

After Loading Data:
┌─────────────────────────────────────┐
│  ⚙️ Configuration                   │
│  [API Token Input]                  │
│  [Board ID Input]                   │
│  [Load Dashboard Data] [Refresh]    │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  📊 Monthly Operating Review (MOR)  │
│  [📄 Export to Text]                │
│  [📊 Export to PowerPoint]          │  ← BUTTONS APPEAR HERE!
└─────────────────────────────────────┘
│  📈 Last Month Changes/Updates      │
│  📊 Total Items in Each State       │
│  🌟 Top 3 Highlights                │
│  ... (rest of dashboard)            │
```

## 🔍 Troubleshooting

### "I clicked Load Data but nothing happened"
**Check:**
1. Did you enter both API Token AND Board ID?
2. Is your API token valid?
3. Is your Board ID correct?
4. Check browser console (F12) for error messages

### "I see an error message"
**Common errors:**
- **"Please enter both API token and Board ID"** → Fill in both fields
- **"HTTP error! status: 401"** → Invalid API token
- **"HTTP error! status: 404"** → Invalid Board ID

### "Data loaded but I still don't see buttons"
**Try:**
1. Scroll down - the buttons are at the top of the dashboard content
2. Refresh the page (F5) and try again
3. Check if `dashboardContent` div is visible in browser inspector (F12)

## 🎯 Quick Test

Want to verify the buttons exist? Open browser console (F12) and run:
```javascript
document.getElementById('exportReport')
document.getElementById('exportPowerPoint')
```

If both return elements (not null), the buttons exist and will appear after loading data.

## 📝 Button Details

### 📄 Export to Text Button
- **ID**: `exportReport`
- **Class**: `btn-export`
- **Color**: White with purple text
- **Function**: Exports MOR report as `.txt` file

### 📊 Export to PowerPoint Button
- **ID**: `exportPowerPoint`
- **Class**: `btn-export btn-powerpoint`
- **Color**: Orange gradient
- **Function**: Exports MOR report as `.pptx` file

## 🚀 Need Help Getting Started?

See [QUICK_START_MOR.md](QUICK_START_MOR.md) for complete setup instructions.

---

**Made with Bob** 🤖