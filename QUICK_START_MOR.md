# Quick Start Guide - MOR Report with Top 3 Highlights

## 🎯 Goal
Extract the **Top 3 Highlights** from Monday.com's Impact column and export them to PowerPoint or Text for your Monthly Operating Review (MOR) meeting.

## ⚡ 5-Minute Setup

### Step 1: Get Your Credentials (2 minutes)

#### Monday.com API Token
1. Go to [Monday.com](https://monday.com)
2. Click your profile picture (bottom left)
3. Select **Developers** → **My Access Tokens**
4. Click **Generate** or **Show**
5. Copy the token

#### Board ID
- Open your board in Monday.com
- Look at the URL: `https://monday.com/boards/6642841355`
- Your Board ID is: **6642841355**

### Step 2: Open Dashboard (1 minute)
1. Open `index.html` in your web browser
2. Paste your API Token
3. Enter your Board ID
4. Click **"Load Dashboard Data"**

### Step 3: Export Report (1 minute)

#### For MOR Meetings (Recommended):
- Click **"📊 Export to PowerPoint"**
- Opens a professional presentation
- **Slide 2 has your Top 3 Highlights** 🥇🥈🥉

#### For Documentation:
- Click **"📄 Export to Text"**
- Gets a formatted text file

## 📋 What You Need in Monday.com

### Required Columns

1. **Status Column** ✅
   - Type: Status
   - Values: "Done", "Complete", "Delivered", etc.
   - Used to identify completed items

2. **Impact Column** ⭐ (Highly Recommended)
   - Column name must contain "impact"
   - Values: High, Medium, Low (or Critical, Moderate, Low)
   - Used to rank the top 3 highlights

### Board Structure
- Group items by Product (use Monday.com groups)
- Each group = one product
- Items = features/deliverables

## 🎯 Top 3 Highlights Explained

### How It Works:
1. Dashboard finds all items marked as "Done"/"Complete"/"Delivered" **this month**
2. Sorts them by Impact column (High → Medium → Low)
3. Shows the top 3 with medals: 🥇🥈🥉

### What's Displayed:
- **Item Name**: The deliverable/feature name
- **Product**: Which product it belongs to
- **Impact**: High/Medium/Low priority
- **Delivery Date**: When it was completed

### Example:
```
🥇 #1: Enhanced Security Authentication
   Product: FileNet
   Impact: High
   Delivered: 06/01/2026

🥈 #2: Mobile App Performance Optimization
   Product: Daeja ViewONE
   Impact: High
   Delivered: 06/03/2026

🥉 #3: API Rate Limiting Implementation
   Product: Content Platform Engine
   Impact: Medium
   Delivered: 06/02/2026
```

## 📊 PowerPoint Presentation Structure

Your exported PowerPoint will have 4 slides:

### Slide 1: Title
- Report period and date

### Slide 2: Top 3 Highlights ⭐ **FOCUS HERE FOR MOR**
- Medal indicators (🥇🥈🥉)
- Item names
- Product associations
- Impact levels
- Delivery dates

### Slide 3: Last Month Changes
- Total changes in last 30 days
- Per-product breakdown table

### Slide 4: Items by State
- Overall status distribution
- Per-product status breakdown

## 💡 Tips for Best Results

### 1. Keep Impact Updated
```
✅ DO: Assign High/Medium/Low to all items
❌ DON'T: Leave impact blank
```

### 2. Mark Items as Delivered
```
✅ DO: Change status to "Done" when complete
❌ DON'T: Leave items in "In Progress" after completion
```

### 3. Use Clear Names
```
✅ DO: "Enhanced Security Authentication"
❌ DON'T: "SEC-AUTH-ENH-v2"
```

### 4. Organize by Product
```
✅ DO: Group items by product in Monday.com
❌ DON'T: Leave items ungrouped
```

## 🔧 Troubleshooting

### Problem: No highlights showing
**Solution**: 
- Check items are marked "Done"/"Complete"/"Delivered"
- Verify items were completed this calendar month
- Ensure status column exists

### Problem: Wrong ranking
**Solution**:
- Add an "Impact" column to your board
- Use consistent values: High, Medium, Low
- Update impact for all delivered items

### Problem: Export button not working
**Solution**:
- Make sure data is loaded first
- Check browser console for errors
- Try refreshing and reloading data

## 📱 Browser Support

Works in:
- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Firefox
- ✅ Safari
- ❌ Internet Explorer

## 🎯 For Your MOR Meeting

### Before Meeting:
1. Load dashboard (30 seconds)
2. Export to PowerPoint (10 seconds)
3. Review Slide 2 - Top 3 Highlights (2 minutes)

### During Meeting:
1. Open PowerPoint
2. **Focus on Slide 2** - discuss top 3 achievements
3. Use other slides for detailed questions

### After Meeting:
1. Share PowerPoint with stakeholders
2. Archive for historical tracking

## 📖 Need More Help?

- **Detailed Guide**: See [POWERPOINT_EXPORT_GUIDE.md](POWERPOINT_EXPORT_GUIDE.md)
- **Full Documentation**: See [README.md](README.md)
- **MOR Features**: See [MOR_FEATURES.md](MOR_FEATURES.md)

## 🚀 That's It!

You're ready to generate your MOR report with Top 3 Highlights!

**Time to first report: 5 minutes** ⏱️

---

**Made with Bob** 🤖