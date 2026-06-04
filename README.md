# Monday.com Product Dashboard - MOR Edition

A beautiful, interactive dashboard for visualizing your Monday.com board data, optimized for Monthly Operating Review (MOR) meetings.

## 🎯 MOR Focus - Top 3 Priorities

This dashboard prioritizes the three key metrics needed for MOR:

1. **📈 Last Month Changes/Updates** - Total and per-product breakdown (Last 30 days)
2. **📊 Total Items in Each State** - Overall and per-product distribution
3. **🌟 Top 3 Highlights of the Month** - Delivered items ranked by impact

### ✨ New MOR Features

- **Per-Product Delta Changes**: See new, delivered, cancelled, and modified items by product
- **State Distribution**: Total items in each state, with overall and per-product views
- **Impact-Based Highlights**: Top 3 delivered items automatically ranked by impact column
- **📊 Export to PowerPoint**: Professional presentation with Top 3 Highlights (NEW!)
- **📄 Export to Text**: Formatted text file for documentation
- **Automatic Impact Detection**: Reads impact column from Monday.com and ranks accordingly
- **Dual Export Options**: Choose between PowerPoint or Text format based on your needs

## 🎯 Additional Features

- **Real-time Data Sync**: Connects directly to your Monday.com board
- **Interactive Charts**:
  - Status distribution (Doughnut chart)
  - Monthly delivery trends (Line chart)
  - Product completion rates (Bar chart)
  - Items by product (Polar area chart)
- **Product Cards**: Per-product status breakdown with visual indicators
- **Detailed Table**: Filterable view of all items with status, product, and dates
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

## 📥 Export MOR Report

After loading your data, you have **two export options**:

### 📊 Export to PowerPoint (Recommended for MOR Meetings)
Click **"📊 Export to PowerPoint"** to generate a professional presentation with:
- **Slide 1**: Title slide with report period
- **Slide 2**: **Top 3 Highlights** (🥇🥈🥉) - Primary focus for MOR
- **Slide 3**: Last month's changes/updates with per-product breakdown
- **Slide 4**: Total items in each state (overall and per-product)

The presentation is automatically downloaded as `MOR_Report_YYYY-MM-DD.pptx` and ready for your meeting!

### 📄 Export to Text (For Documentation)
Click **"📄 Export to Text"** to generate a formatted text file containing:
- Last month's changes/updates (total and per-product)
- Total items in each state (overall and per-product)
- Top 3 highlights of the month (ranked by impact)

The report is automatically downloaded as `MOR_Report_YYYY-MM-DD.txt` and ready to share!

**📖 For detailed PowerPoint export guide, see [POWERPOINT_EXPORT_GUIDE.md](POWERPOINT_EXPORT_GUIDE.md)**

## 📊 Dashboard Components

### MOR Priority Sections

#### 1. Last Month Changes/Updates
- **Total Changes**: Aggregate count of all changes in last 30 days
- **Per-Product Breakdown**: Each product shows:
  - ➕ New Items Added
  - ✅ Items Delivered
  - ❌ Items Cancelled
  - 🔄 Items Modified
  - Total Changes

#### 2. Total Items in Each State
- **Overall Distribution**: Total count for each status across all products
- **Per-Product Distribution**: Status breakdown for each product with totals

#### 3. Top 3 Highlights of the Month
- Shows top 3 delivered items from current month
- Ranked by Impact column (High > Medium > Low)
- Displays: 🥇🥈🥉 medals, item name, product, impact level, delivery date
- **Note**: Requires an "Impact" column in your Monday.com board for ranking

### Additional Analytics

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