# PowerPoint Export Feature Guide

## Overview
The Monday.com Dashboard now supports exporting the Monthly Operating Review (MOR) report to both **PowerPoint** and **Text** formats, with a focus on the **Top 3 Highlights** from the Impact column.

## Key Features

### 🎯 Top 3 Highlights (Primary Focus)
The dashboard automatically extracts and ranks the top 3 delivered items based on:
- **Impact Column**: Items are sorted by impact level (Critical/High > Medium > Low)
- **Delivery Status**: Only items marked as "Done", "Complete", or "Delivered" in the current month
- **Product Association**: Shows which product each highlight belongs to
- **Delivery Date**: Displays when the item was completed

### 📊 Export Options

#### 1. Export to PowerPoint (NEW!)
Creates a professional PowerPoint presentation with:
- **Slide 1**: Title slide with report period and date
- **Slide 2**: Top 3 Highlights (🥇🥈🥉) - **PRIMARY FOCUS FOR MOR**
  - Item name with medal indicator
  - Product name
  - Impact level
  - Delivery date
- **Slide 3**: Last Month Changes/Updates (30 days)
  - Total changes summary
  - Per-product breakdown table
- **Slide 4**: Total Items in Each State
  - Overall status distribution
  - Per-product status breakdown

#### 2. Export to Text
Creates a formatted text file with all three MOR sections in a readable format.

## How to Use

### Step 1: Load Dashboard Data
1. Enter your Monday.com API Token
2. Enter your Board ID (e.g., 6642841355)
3. Click "Load Dashboard Data"

### Step 2: Review Top 3 Highlights
The dashboard will automatically display the top 3 highlights in the "🌟 Top 3 Highlights of the Month" section.

### Step 3: Export Report
Choose your preferred export format:
- Click **"📊 Export to PowerPoint"** for a presentation-ready format
- Click **"📄 Export to Text"** for a simple text document

### Step 4: Use in MOR Meeting
- Open the PowerPoint file
- Focus on Slide 2 (Top 3 Highlights) for the main discussion
- Use additional slides for detailed analysis if needed

## Monday.com Board Requirements

### Required Columns

1. **Status Column** (Required)
   - Type: Status
   - Used to identify delivered items
   - Common values: "Done", "Complete", "Delivered", "In Progress", etc.

2. **Impact Column** (Highly Recommended)
   - Type: Status, Text, or Dropdown
   - Column name must contain the word "impact" (case-insensitive)
   - Recommended values:
     - **High** or **Critical** (highest priority)
     - **Medium** or **Moderate** (medium priority)
     - **Low** (lower priority)
   - Numeric values are also supported (higher = more important)

### Board Structure
- Items should be grouped by Product using Monday.com groups
- Each group represents a different product
- Items track features, deliverables, or serviceability items

## Impact Column Scoring

The dashboard uses the following scoring system to rank highlights:

| Impact Value | Score | Priority |
|--------------|-------|----------|
| Critical, High | 3 | Highest |
| Medium, Moderate | 2 | Medium |
| Low | 1 | Lower |
| Numeric values | As-is | Variable |
| No value | 0 | Lowest |

## PowerPoint Presentation Details

### Slide Design
- **Professional color scheme**: Purple gradient theme
- **Clear hierarchy**: Title, highlights, details
- **Visual indicators**: Medals (🥇🥈🥉) for top 3
- **Structured layout**: Tables and boxes for data organization

### File Format
- Format: `.pptx` (PowerPoint 2007+)
- File name: `MOR_Report_YYYY-MM-DD.pptx`
- Compatible with: PowerPoint, Google Slides, LibreOffice Impress

## Tips for Best Results

### 1. Keep Impact Column Updated
- Assign impact levels to all delivered items
- Use consistent terminology (High/Medium/Low)
- Update impact as priorities change

### 2. Mark Items as Delivered Promptly
- Change status to "Done" or "Delivered" when complete
- This ensures items appear in the current month's highlights

### 3. Use Descriptive Item Names
- Item names appear in the PowerPoint presentation
- Use clear, concise descriptions
- Avoid abbreviations that may not be understood

### 4. Organize by Product
- Group items by product in Monday.com
- This provides better context in the report
- Makes it easier to track product-specific achievements

## Troubleshooting

### No Highlights Showing
**Problem**: The "Top 3 Highlights" section is empty

**Solutions**:
- Ensure items are marked as "Done", "Complete", or "Delivered"
- Check that items were completed in the current calendar month
- Verify the status column is properly configured

### Impact Not Sorting Correctly
**Problem**: Items are not ranked by impact

**Solutions**:
- Ensure your board has a column with "impact" in the name
- Use consistent impact values (High/Medium/Low)
- Check that the impact column type is Status or Text

### PowerPoint Export Not Working
**Problem**: Export button doesn't generate a file

**Solutions**:
- Ensure dashboard data is loaded first
- Check browser console for errors
- Try refreshing the page and reloading data
- Verify you're using a modern browser (Chrome, Firefox, Edge, Safari)

### Missing Product Information
**Problem**: Items show as "General" instead of product name

**Solutions**:
- Organize items into groups in Monday.com
- Each group should represent a product
- Ensure items are assigned to the correct group

## Browser Compatibility

The PowerPoint export feature works in:
- ✅ Google Chrome (recommended)
- ✅ Microsoft Edge
- ✅ Mozilla Firefox
- ✅ Safari
- ❌ Internet Explorer (not supported)

## Technical Details

### Libraries Used
- **PptxGenJS**: JavaScript library for creating PowerPoint presentations
- **Chart.js**: For dashboard visualizations
- **Monday.com API**: For data retrieval

### Data Refresh
- Dashboard loads data on demand
- Click "Refresh Data" to update with latest information
- Credentials are saved locally in browser storage

### Time Periods
- **"Last Month"**: Last 30 days from current date
- **"Current Month"**: Calendar month (e.g., January 1-31)
- All dates use local timezone

## Example Use Case

### Scenario: Monthly Product Review Meeting

1. **Before the meeting** (5 minutes):
   - Open the dashboard
   - Load the latest data
   - Export to PowerPoint
   - Review the top 3 highlights

2. **During the meeting** (30 minutes):
   - Open the PowerPoint presentation
   - **Focus on Slide 2**: Discuss the top 3 achievements
   - Highlight impact and product associations
   - Use additional slides for detailed questions

3. **After the meeting**:
   - Share the PowerPoint with stakeholders
   - Archive for historical tracking
   - Compare with previous months

## Support

For issues or questions:
1. Check that your Monday.com API token is valid
2. Verify Board ID is correct
3. Ensure board has required columns (Status and Impact)
4. Check browser console for error messages
5. Try the text export as an alternative

## Version Information

- **Version**: 2.1
- **Last Updated**: June 2026
- **New Features**:
  - PowerPoint export functionality
  - Enhanced Top 3 Highlights display
  - Dual export options (PowerPoint + Text)
  - Professional presentation design

---

**Made with Bob** 🤖