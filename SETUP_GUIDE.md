# 🚀 Monday.com Dashboard - Complete Setup Guide

## Step-by-Step Instructions

### Step 1: Get Your Monday.com API Token

1. **Login to Monday.com**
   - Go to https://ibm.monday.com
   - Login with your credentials

2. **Access Developer Settings**
   - Click on your **profile picture** (bottom left corner)
   - Select **Developers** from the menu
   - Click on **My Access Tokens**

3. **Generate/Copy Token**
   - If you don't have a token, click **Generate**
   - If you have one, click **Show** to reveal it
   - **Copy the entire token** (it's a long string)
   - ⚠️ **Keep this token secure** - treat it like a password!

### Step 2: Identify Your Board ID

Your board ID is already known from the URL you provided:
- **Board URL**: https://ibm.monday.com/boards/6642841355
- **Board ID**: `6642841355`

### Step 3: Open the Dashboard

1. **Navigate to the dashboard folder**
   ```
   C:\Users\RAMALINGAM\Desktop\monday-dashboard
   ```

2. **Open index.html**
   - Double-click `index.html` file
   - OR right-click → Open with → Your preferred browser
   - Recommended: Chrome, Firefox, or Edge

### Step 4: Configure the Dashboard

1. **Enter API Token**
   - Paste your API token in the "Monday.com API Token" field
   - The token will be saved securely in your browser

2. **Enter Board ID**
   - The Board ID `6642841355` should already be filled in
   - If not, enter: `6642841355`

3. **Load Data**
   - Click the **"Load Dashboard Data"** button
   - Wait a few seconds while data loads
   - You should see a success message

### Step 5: Explore Your Dashboard

Once loaded, you'll see:

✅ **Summary Cards** at the top showing:
   - Total Products
   - Active Items
   - Completed Items
   - In Progress Items

✅ **Four Interactive Charts**:
   - Product Status Distribution (Doughnut)
   - Products by Priority (Bar)
   - Timeline Overview (Line)
   - Product Progress (Polar Area)

✅ **Products Table** at the bottom with all details

## 🔄 Refreshing Data

- Click **"Refresh Data"** button anytime to get latest updates
- Your credentials are saved, so you don't need to re-enter them

## 🎨 What Each Chart Shows

### 1. Product Status Distribution (Doughnut Chart)
- Shows how many products are in each status
- Colors represent different statuses
- Hover over sections to see exact numbers

### 2. Products by Priority (Bar Chart)
- Displays items grouped by priority level
- Helps identify high-priority items at a glance
- Shows count for each priority level

### 3. Timeline Overview (Line Chart)
- Shows when products were created over time
- Helps track project growth
- Useful for identifying busy periods

### 4. Product Progress (Polar Area Chart)
- Visualizes distribution across different groups
- Each section represents a group on your board
- Size indicates number of items in each group

## 📊 Understanding the Products Table

The table shows all your products with:
- **Product Name**: Item name from Monday.com
- **Status**: Color-coded badge showing current status
  - 🟢 Green = Done/Complete
  - 🟡 Yellow = Working/In Progress
  - 🔴 Red = Stuck
  - ⚪ Gray = Other statuses
- **Group**: Which group the item belongs to
- **Created**: When the item was created
- **Last Updated**: Most recent update timestamp

## 🔧 Troubleshooting

### Problem: "Error: Invalid API token"
**Solution:**
- Double-check your API token is copied correctly
- Make sure there are no extra spaces
- Try generating a new token from Monday.com

### Problem: "Error: Board not found"
**Solution:**
- Verify the Board ID is `6642841355`
- Ensure you have access to this board in Monday.com
- Check if the board still exists

### Problem: Charts are not showing
**Solution:**
- Check your internet connection (Chart.js loads from CDN)
- Try refreshing the page (F5 or Ctrl+R)
- Clear browser cache and reload

### Problem: No data in the table
**Solution:**
- Verify the board has items
- Check that items have values in columns
- Try clicking "Refresh Data"

### Problem: Some charts are empty
**Solution:**
- This is normal if your board doesn't have certain columns
- For example, if there's no "Priority" column, that chart will be empty
- The dashboard adapts to your board structure

## 💡 Pro Tips

1. **Bookmark the Page**
   - Your credentials are saved in the browser
   - You can quickly access the dashboard anytime

2. **Use Full Screen**
   - Press F11 for full-screen mode
   - Better view of all charts and data

3. **Regular Refreshes**
   - Click "Refresh Data" to see latest updates
   - Especially useful during active work periods

4. **Multiple Boards**
   - You can change the Board ID to view different boards
   - Just enter a new Board ID and click "Load Dashboard Data"

5. **Print/Export**
   - Use browser's print function (Ctrl+P) to save as PDF
   - Great for reports and presentations

## 🔐 Security Best Practices

- ✅ Never share your API token
- ✅ Don't commit tokens to version control
- ✅ Use tokens only on trusted devices
- ✅ Regenerate tokens if compromised
- ✅ Clear browser data when using shared computers

## 📱 Mobile Access

The dashboard is responsive and works on mobile devices:
- Charts adapt to smaller screens
- Table scrolls horizontally if needed
- Touch-friendly interface

## 🎯 Next Steps

1. **Customize Colors**: Edit `css/styles.css` to match your brand
2. **Add More Charts**: Modify `js/dashboard.js` to add custom visualizations
3. **Filter Data**: Add filtering options for specific date ranges or groups
4. **Export Features**: Add buttons to export data to CSV or Excel

## 📞 Need Help?

- Check Monday.com API docs: https://developer.monday.com/api-reference/docs
- Review browser console for detailed error messages (F12)
- Ensure you're using a modern browser (Chrome, Firefox, Edge, Safari)

## ✨ Enjoy Your Dashboard!

You now have a powerful, real-time dashboard for your Monday.com products!

Happy tracking! 🎉