# Monday.com Product Dashboard

A beautiful, interactive dashboard for visualizing your Monday.com board data with real-time graphs and metrics.

## 🎯 Features

- **Real-time Data Sync**: Connects directly to your Monday.com board
- **Interactive Charts**: 
  - Status distribution (Doughnut chart)
  - Priority breakdown (Bar chart)
  - Timeline overview (Line chart)
  - Group distribution (Polar area chart)
- **Summary Cards**: Quick metrics for total products, active items, completed, and in-progress
- **Product Table**: Detailed view of all products with status, group, and dates
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Secure Storage**: API credentials saved locally in browser

## 🚀 Quick Start

### 1. Get Your Monday.com API Token

1. Go to https://ibm.monday.com
2. Click your profile picture (bottom left)
3. Select **Developers** → **My Access Tokens**
4. Click **Generate** or **Show** to get your API token
5. Copy the token (keep it secure!)

### 2. Get Your Board ID

Your board ID is in the URL: `https://ibm.monday.com/boards/6642841355`
- Board ID: **6642841355**

### 3. Open the Dashboard

1. Open `index.html` in your web browser
2. Enter your API token
3. Enter your Board ID: `6642841355`
4. Click **Load Dashboard Data**

## 📊 Dashboard Components

### Summary Cards
- **Total Products**: Total number of items on the board
- **Active Items**: Items with "Active" or "Open" status
- **Completed**: Items marked as "Done" or "Complete"
- **In Progress**: Items currently being worked on

### Charts
1. **Product Status Distribution**: Visual breakdown of all status types
2. **Products by Priority**: Bar chart showing priority levels
3. **Timeline Overview**: Line chart of items created over time
4. **Product Progress**: Polar area chart showing distribution by groups

### Products Table
Detailed table with:
- Product name
- Current status (color-coded badges)
- Group assignment
- Creation date
- Last update date

## 🔧 Configuration

### API Token Security
- Tokens are stored in browser's localStorage
- Never share your API token
- Tokens are only sent to Monday.com API

### Customization
You can customize the dashboard by editing:
- `css/styles.css` - Visual styling
- `js/dashboard.js` - Dashboard logic and charts
- `js/monday-api.js` - API queries and data processing

## 📝 API Queries

The dashboard uses Monday.com's GraphQL API to fetch:
- Board information
- All items with column values
- Status, priority, and timeline data
- Group assignments
- Creation and update timestamps

## 🎨 Chart Types

### Status Chart (Doughnut)
Shows distribution of items by status column

### Priority Chart (Bar)
Displays items grouped by priority level

### Timeline Chart (Line)
Tracks item creation over time

### Progress Chart (Polar Area)
Visualizes items distribution across groups

## 🔄 Refresh Data

Click the **Refresh Data** button to reload the latest information from Monday.com.

## 🐛 Troubleshooting

### "Error: Invalid API token"
- Verify your API token is correct
- Check token hasn't expired
- Ensure you have access to the board

### "Error: Board not found"
- Verify the Board ID is correct
- Check you have permissions to view the board

### Charts not displaying
- Ensure you have internet connection (Chart.js loads from CDN)
- Check browser console for errors
- Try refreshing the page

### No data showing
- Verify the board has items
- Check that columns exist (status, priority, etc.)
- Ensure items have values in those columns

## 🌐 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📦 Dependencies

- **Chart.js** (v4.x) - Loaded from CDN for data visualization
- No other external dependencies required

## 🔐 Security Notes

- API tokens are stored locally in your browser
- No data is sent to any third-party servers
- All communication is directly with Monday.com API
- Use HTTPS when hosting on a server

## 💡 Tips

1. **Bookmark the page** after entering credentials (they're saved)
2. **Use specific column names** like "Status" and "Priority" for best results
3. **Refresh regularly** to see latest updates
4. **Check browser console** for detailed error messages

## 📧 Support

For Monday.com API documentation:
https://developer.monday.com/api-reference/docs

## 🎉 Enjoy Your Dashboard!

Your dashboard is now ready to visualize your Monday.com board data with beautiful, interactive charts!