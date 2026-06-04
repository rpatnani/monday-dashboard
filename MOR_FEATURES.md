# Monthly Operating Review (MOR) Features

## Overview
This dashboard has been enhanced to focus on the three key metrics required for Monthly Operating Review (MOR) meetings:

1. **Last Month Changes/Updates** - Total and per-product breakdown
2. **Total Items in Each State** - Overall and per-product distribution
3. **Top 3 Highlights of the Month** - Based on delivered items with highest impact

## Key Features

### 1. Last Month Changes/Updates (Last 30 Days)

**What it shows:**
- Total number of changes across all products
- Per-product breakdown showing:
  - New items added
  - Items delivered
  - Items cancelled
  - Items modified
  - Total changes per product

**How it works:**
- Tracks all items created or updated in the last 30 days
- Automatically categorizes changes based on status transitions
- Provides both aggregate and per-product views

### 2. Total Items in Each State

**What it shows:**
- Overall status distribution across all items
- Per-product status breakdown with item counts
- Total items per product

**How it works:**
- Reads the status column from Monday.com board
- Groups items by their current status
- Provides both overall and per-product views

### 3. Top 3 Highlights of the Month

**What it shows:**
- Top 3 delivered items from the current month
- Ranked by impact level (if impact column exists)
- Shows: Item name, Product, Impact level, Delivery date

**How it works:**
- Filters items delivered/completed in the current month
- Sorts by impact column value (High > Medium > Low)
- Displays top 3 with medal indicators (🥇🥈🥉)

**Impact Column Support:**
The dashboard automatically detects an "Impact" column in your Monday.com board. Impact values are ranked as:
- **Critical/High**: Highest priority (Score: 3)
- **Medium/Moderate**: Medium priority (Score: 2)
- **Low**: Lower priority (Score: 1)
- Numeric values are also supported

## Export Functionality

### MOR Report Export

**Features:**
- One-click export of all three MOR sections
- Generates a formatted text file
- Includes:
  - Report header with date and period
  - All three MOR sections with detailed breakdowns
  - Professional formatting for easy sharing

**How to use:**
1. Load your dashboard data
2. Click the "📥 Export MOR Report" button
3. A text file will be automatically downloaded
4. File name format: `MOR_Report_YYYY-MM-DD.txt`

**Report Contents:**
```
═══════════════════════════════════════════════════════════════
           MONTHLY OPERATING REVIEW (MOR) REPORT
═══════════════════════════════════════════════════════════════
Report Period: [Month Year]
Generated: [Date and Time]

1. LAST MONTH CHANGES/UPDATES (Last 30 Days)
   - Total Changes
   - Per Product Breakdown

2. TOTAL ITEMS IN EACH STATE
   - Overall Status Distribution
   - Per Product Status Distribution

3. TOP 3 HIGHLIGHTS OF THE MONTH
   - Ranked by impact
   - With product and delivery details
```

## Setup Requirements

### Monday.com Board Configuration

**Required Columns:**
1. **Status Column** (Required)
   - Type: Status
   - Used for: Tracking item states and changes
   - Common values: Done, In Progress, Stuck, etc.

2. **Impact Column** (Optional but Recommended)
   - Type: Status, Text, or Dropdown
   - Used for: Ranking highlights by importance
   - Recommended values: High, Medium, Low (or Critical, Moderate, Low)

**Board Structure:**
- Items should be grouped by Product (using Monday.com groups)
- Each group represents a different product
- Items track serviceability features or deliverables

### API Configuration

1. Get your Monday.com API token:
   - Go to Monday.com → Profile → Admin → API
   - Generate a personal API token
   - Copy the token

2. Get your Board ID:
   - Open your board in Monday.com
   - The Board ID is in the URL: `https://ibm.monday.com/boards/[BOARD_ID]`

3. Enter credentials in the dashboard:
   - Paste API token
   - Enter Board ID (e.g., 6642841355)
   - Click "Load Dashboard Data"

## Dashboard Sections

### Priority Sections (MOR Focus)

1. **MOR Report Header**
   - Quick access to export functionality
   - Prominent placement at top of dashboard

2. **Last Month Changes/Updates**
   - Large total changes counter
   - Per-product cards with detailed breakdowns
   - Color-coded for easy reading

3. **Total Items in Each State**
   - Overall state cards with counts
   - Per-product state distribution
   - Visual hierarchy for quick scanning

4. **Top 3 Highlights**
   - Medal indicators for top 3
   - Impact badges
   - Product and date information

### Additional Analytics (Nice to Have)

- Status distribution charts
- Monthly delivery trends
- Product completion rates
- Detailed items table with filters

## Usage Tips

### For Monthly Reviews

1. **Before the Meeting:**
   - Load the dashboard
   - Export the MOR report
   - Review the top 3 highlights

2. **During the Meeting:**
   - Share the exported report
   - Focus on the three key sections
   - Use additional analytics for deep dives

3. **After the Meeting:**
   - Archive the report for historical tracking
   - Compare month-over-month trends

### Best Practices

1. **Keep Impact Column Updated:**
   - Assign impact levels to all items
   - Use consistent terminology (High/Medium/Low)
   - Update impact as priorities change

2. **Regular Status Updates:**
   - Update item statuses promptly
   - Use consistent status labels
   - Mark items as delivered when complete

3. **Product Grouping:**
   - Organize items by product using groups
   - Use clear, consistent product names
   - Keep product structure stable

## Troubleshooting

### No Highlights Showing
- **Cause:** No items delivered this month
- **Solution:** Check if items are marked as "Done" or "Delivered"

### Impact Not Sorting Correctly
- **Cause:** Impact column not detected or inconsistent values
- **Solution:** 
  - Ensure column name contains "impact"
  - Use consistent values (High/Medium/Low)
  - Check column type (Status or Text)

### Missing Product Data
- **Cause:** Items not grouped in Monday.com
- **Solution:** Organize items into groups representing products

### Export Not Working
- **Cause:** Dashboard data not loaded
- **Solution:** Click "Load Dashboard Data" before exporting

## Technical Details

### Data Refresh
- Dashboard loads data on demand
- Click "Refresh Data" to update
- Credentials are saved locally in browser

### Time Periods
- "Last Month" = Last 30 days from current date
- "Current Month" = Calendar month (Jan 1 - Jan 31, etc.)
- Dates use local timezone

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Edge, Safari)
- JavaScript must be enabled
- Local storage for credentials

## Support

For issues or questions:
1. Check Monday.com API token is valid
2. Verify Board ID is correct
3. Ensure board has required columns
4. Check browser console for errors

## Version History

### v2.0 - MOR Focus Update
- Added per-product delta changes
- Added state distribution (total and per-product)
- Enhanced highlights with impact ranking
- Added MOR report export functionality
- Reorganized dashboard to prioritize MOR sections

### v1.0 - Initial Release
- Basic dashboard functionality
- Status tracking
- Product cards
- Charts and analytics

---

**Made with Bob** 🤖