/**
 * Product Serviceability Dashboard Controller
 * Manages per-product serviceability tracking, monthly highlights, and delta changes
 */

class Dashboard {
    constructor() {
        this.charts = {};
        this.boardData = null;
        this.previousData = null;
        this.init();
    }

    init() {
        // Load saved credentials and previous data
        this.loadSavedCredentials();
        this.loadPreviousData();

        // Event listeners
        document.getElementById('loadData').addEventListener('click', () => this.loadDashboard());
        document.getElementById('refreshData').addEventListener('click', () => this.loadDashboard());

        // Auto-load if credentials exist
        const savedToken = localStorage.getItem('mondayApiToken');
        if (savedToken) {
            this.loadDashboard();
        }
    }

    loadSavedCredentials() {
        const savedToken = localStorage.getItem('mondayApiToken');
        const savedBoardId = localStorage.getItem('mondayBoardId');

        if (savedToken) {
            document.getElementById('apiToken').value = savedToken;
        }
        if (savedBoardId) {
            document.getElementById('boardId').value = savedBoardId;
        }
    }

    saveCredentials(token, boardId) {
        localStorage.setItem('mondayApiToken', token);
        localStorage.setItem('mondayBoardId', boardId);
    }

    loadPreviousData() {
        const saved = localStorage.getItem('mondayPreviousData');
        if (saved) {
            try {
                this.previousData = JSON.parse(saved);
            } catch (e) {
                this.previousData = null;
            }
        }
    }

    savePreviousData() {
        if (this.boardData) {
            const dataToSave = {
                timestamp: new Date().toISOString(),
                items: this.boardData.items_page.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    state: item.state,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                    group: item.group?.title
                }))
            };
            localStorage.setItem('mondayPreviousData', JSON.stringify(dataToSave));
        }
    }

    showStatus(message, type = 'loading') {
        const statusEl = document.getElementById('status');
        statusEl.textContent = message;
        statusEl.className = `status-message ${type}`;
        statusEl.style.display = 'block';
    }

    hideStatus() {
        document.getElementById('status').style.display = 'none';
    }

    async loadDashboard() {
        const apiToken = document.getElementById('apiToken').value.trim();
        const boardId = document.getElementById('boardId').value.trim();

        if (!apiToken || !boardId) {
            this.showStatus('Please enter both API token and Board ID', 'error');
            return;
        }

        try {
            this.showStatus('Loading data from Monday.com...', 'loading');

            // Save credentials
            this.saveCredentials(apiToken, boardId);

            // Set API credentials
            mondayAPI.setCredentials(apiToken, boardId);

            // Fetch board data
            this.boardData = await mondayAPI.getBoardData();

            // Show dashboard
            document.getElementById('dashboardContent').style.display = 'block';

            // Update all components
            this.updateMonthlyHighlights();
            this.updateDeltaChanges();
            this.updateProductCards();
            this.updateCharts();
            this.updateItemsTable();

            // Save current data for next comparison
            this.savePreviousData();

            this.showStatus('Dashboard loaded successfully!', 'success');
            setTimeout(() => this.hideStatus(), 3000);

        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showStatus(`Error: ${error.message}`, 'error');
        }
    }

    updateMonthlyHighlights() {
        const items = this.boardData.items_page.items;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Find status column
        const statusColumn = this.boardData.columns.find(col => 
            col.type === 'status' || col.title.toLowerCase().includes('status')
        );

        // Find items delivered/completed this month
        const deliveredThisMonth = items.filter(item => {
            const updated = new Date(item.updated_at);
            if (updated.getMonth() !== currentMonth || updated.getFullYear() !== currentYear) {
                return false;
            }

            if (statusColumn) {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    const status = mondayAPI.parseColumnValue(statusValue);
                    const statusLower = (status || '').toLowerCase();
                    return statusLower.includes('done') || statusLower.includes('complete') || statusLower.includes('delivered');
                }
            }
            return false;
        });

        const highlightsContainer = document.getElementById('monthlyHighlights');
        
        if (deliveredThisMonth.length === 0) {
            highlightsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <p>No items delivered this month yet</p>
                </div>
            `;
            return;
        }

        let highlightsHTML = '';
        deliveredThisMonth.forEach(item => {
            const date = new Date(item.updated_at).toLocaleDateString();
            const product = item.group?.title || 'General';
            
            highlightsHTML += `
                <div class="highlight-item">
                    <div class="highlight-icon">🎉</div>
                    <div class="highlight-content">
                        <h4>${item.name}</h4>
                        <p>Product: ${product}</p>
                    </div>
                    <div class="highlight-date">${date}</div>
                </div>
            `;
        });

        highlightsContainer.innerHTML = highlightsHTML;
    }

    updateDeltaChanges() {
        const items = this.boardData.items_page.items;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Find status column
        const statusColumn = this.boardData.columns.find(col =>
            col.type === 'status' || col.title.toLowerCase().includes('status')
        );

        let added = 0;
        let delivered = 0;
        let cancelled = 0;
        let modified = 0;

        items.forEach(item => {
            const created = new Date(item.created_at);
            const updated = new Date(item.updated_at);

            // Check if item was updated in last 30 days
            const wasUpdatedRecently = updated >= thirtyDaysAgo;
            const wasCreatedRecently = created >= thirtyDaysAgo;

            // New items added in last 30 days
            if (wasCreatedRecently) {
                added++;
            }

            // Only count changes for items updated in last 30 days
            if (wasUpdatedRecently && statusColumn) {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    const status = mondayAPI.parseColumnValue(statusValue);
                    const statusLower = (status || '').toLowerCase();
                    
                    // Items delivered/completed in last 30 days
                    if (statusLower.includes('done') || statusLower.includes('complete') || statusLower.includes('delivered')) {
                        delivered++;
                    }
                    // Items cancelled/closed in last 30 days
                    else if (statusLower.includes('cancel') || statusLower.includes('closed')) {
                        cancelled++;
                    }
                    // Items with other status changes (modified) in last 30 days
                    // Exclude newly created items from modified count
                    else if (!wasCreatedRecently) {
                        modified++;
                    }
                }
            }
            // Items updated but without status column, count as modified if not newly created
            else if (wasUpdatedRecently && !wasCreatedRecently && !statusColumn) {
                modified++;
            }
        });

        document.getElementById('deltaAdded').textContent = added;
        document.getElementById('deltaDelivered').textContent = delivered;
        document.getElementById('deltaCancelled').textContent = cancelled;
        document.getElementById('deltaModified').textContent = modified;
    }

    updateProductCards() {
        const items = this.boardData.items_page.items;
        
        // Find status column
        const statusColumn = this.boardData.columns.find(col => 
            col.type === 'status' || col.title.toLowerCase().includes('status')
        );

        // Group items by product (group)
        const productGroups = {};
        
        items.forEach(item => {
            const product = item.group?.title || 'Ungrouped';
            
            if (!productGroups[product]) {
                productGroups[product] = {
                    total: 0,
                    statuses: {}
                };
            }
            
            productGroups[product].total++;

            // Count by status
            if (statusColumn) {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    const status = mondayAPI.parseColumnValue(statusValue) || 'No Status';
                    productGroups[product].statuses[status] = (productGroups[product].statuses[status] || 0) + 1;
                }
            }
        });

        const container = document.getElementById('productCards');
        let cardsHTML = '';

        Object.keys(productGroups).sort().forEach(product => {
            const data = productGroups[product];
            
            cardsHTML += `
                <div class="product-card">
                    <div class="product-card-header">
                        <h3>${product}</h3>
                        <span class="product-total">${data.total} items</span>
                    </div>
                    <div class="product-status-breakdown">
            `;

            // Sort statuses and display
            Object.keys(data.statuses).sort().forEach(status => {
                const count = data.statuses[status];
                const statusLower = status.toLowerCase();
                let dotClass = 'default';
                
                if (statusLower.includes('done') || statusLower.includes('complete')) {
                    dotClass = 'done';
                } else if (statusLower.includes('working') || statusLower.includes('progress')) {
                    dotClass = 'working';
                } else if (statusLower.includes('stuck')) {
                    dotClass = 'stuck';
                }

                cardsHTML += `
                    <div class="status-row">
                        <div class="status-label">
                            <span class="status-dot ${dotClass}"></span>
                            <span>${status}</span>
                        </div>
                        <span class="status-count">${count}</span>
                    </div>
                `;
            });

            cardsHTML += `
                    </div>
                </div>
            `;
        });

        container.innerHTML = cardsHTML;
    }

    updateCharts() {
        this.createStatusChart();
        this.createDeliveryTrendChart();
        this.createCompletionChart();
        this.createProductItemsChart();
    }

    createStatusChart() {
        const items = this.boardData.items_page.items;
        const statusColumn = this.boardData.columns.find(col => 
            col.type === 'status' || col.title.toLowerCase().includes('status')
        );

        const statusCounts = {};

        if (statusColumn) {
            items.forEach(item => {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    const status = mondayAPI.parseColumnValue(statusValue) || 'No Status';
                    statusCounts[status] = (statusCounts[status] || 0) + 1;
                }
            });
        }

        const ctx = document.getElementById('statusChart');
        if (this.charts.status) {
            this.charts.status.destroy();
        }

        this.charts.status = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#4CAF50',
                        '#FFC107',
                        '#F44336',
                        '#2196F3',
                        '#9C27B0',
                        '#FF9800',
                        '#00BCD4',
                        '#8BC34A'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createDeliveryTrendChart() {
        const items = this.boardData.items_page.items;
        const statusColumn = this.boardData.columns.find(col => 
            col.type === 'status' || col.title.toLowerCase().includes('status')
        );

        // Get last 6 months
        const monthCounts = {};
        const now = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
            monthCounts[key] = 0;
        }

        items.forEach(item => {
            if (statusColumn) {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    const status = mondayAPI.parseColumnValue(statusValue);
                    const statusLower = (status || '').toLowerCase();
                    
                    if (statusLower.includes('done') || statusLower.includes('complete') || statusLower.includes('delivered')) {
                        const updated = new Date(item.updated_at);
                        const key = `${updated.toLocaleString('default', { month: 'short' })} ${updated.getFullYear()}`;
                        if (monthCounts.hasOwnProperty(key)) {
                            monthCounts[key]++;
                        }
                    }
                }
            }
        });

        const ctx = document.getElementById('deliveryTrendChart');
        if (this.charts.delivery) {
            this.charts.delivery.destroy();
        }

        this.charts.delivery = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(monthCounts),
                datasets: [{
                    label: 'Items Delivered',
                    data: Object.values(monthCounts),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    createCompletionChart() {
        const items = this.boardData.items_page.items;
        const statusColumn = this.boardData.columns.find(col => 
            col.type === 'status' || col.title.toLowerCase().includes('status')
        );

        // Group by product and calculate completion rate
        const productGroups = {};
        
        items.forEach(item => {
            const product = item.group?.title || 'Ungrouped';
            
            if (!productGroups[product]) {
                productGroups[product] = { total: 0, completed: 0 };
            }
            
            productGroups[product].total++;

            if (statusColumn) {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    const status = mondayAPI.parseColumnValue(statusValue);
                    const statusLower = (status || '').toLowerCase();
                    
                    if (statusLower.includes('done') || statusLower.includes('complete')) {
                        productGroups[product].completed++;
                    }
                }
            }
        });

        const products = Object.keys(productGroups);
        const completionRates = products.map(p => 
            Math.round((productGroups[p].completed / productGroups[p].total) * 100)
        );

        const ctx = document.getElementById('completionChart');
        if (this.charts.completion) {
            this.charts.completion.destroy();
        }

        this.charts.completion = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: products,
                datasets: [{
                    label: 'Completion Rate (%)',
                    data: completionRates,
                    backgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createProductItemsChart() {
        const items = this.boardData.items_page.items;
        const productCounts = {};

        items.forEach(item => {
            const product = item.group?.title || 'Ungrouped';
            productCounts[product] = (productCounts[product] || 0) + 1;
        });

        const ctx = document.getElementById('productItemsChart');
        if (this.charts.productItems) {
            this.charts.productItems.destroy();
        }

        this.charts.productItems = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: Object.keys(productCounts),
                datasets: [{
                    data: Object.values(productCounts),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(199, 199, 199, 0.6)',
                        'rgba(83, 102, 255, 0.6)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    updateItemsTable() {
        const items = this.boardData.items_page.items;
        const statusColumn = this.boardData.columns.find(col => 
            col.type === 'status' || col.title.toLowerCase().includes('status')
        );

        // Populate filters
        const products = [...new Set(items.map(item => item.group?.title || 'Ungrouped'))].sort();
        const statuses = new Set();
        
        items.forEach(item => {
            if (statusColumn) {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    const status = mondayAPI.parseColumnValue(statusValue) || 'No Status';
                    statuses.add(status);
                }
            }
        });

        // Update product filter
        const productFilter = document.getElementById('productFilter');
        productFilter.innerHTML = '<option value="all">All Products</option>';
        products.forEach(product => {
            productFilter.innerHTML += `<option value="${product}">${product}</option>`;
        });

        // Update status filter
        const statusFilter = document.getElementById('statusFilter');
        statusFilter.innerHTML = '<option value="all">All Statuses</option>';
        [...statuses].sort().forEach(status => {
            statusFilter.innerHTML += `<option value="${status}">${status}</option>`;
        });

        // Add filter event listeners
        productFilter.addEventListener('change', () => this.filterTable());
        statusFilter.addEventListener('change', () => this.filterTable());

        // Render table
        this.renderTable(items, statusColumn);
    }

    filterTable() {
        const items = this.boardData.items_page.items;
        const statusColumn = this.boardData.columns.find(col => 
            col.type === 'status' || col.title.toLowerCase().includes('status')
        );

        const productFilter = document.getElementById('productFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        const filtered = items.filter(item => {
            const product = item.group?.title || 'Ungrouped';
            let status = 'No Status';
            
            if (statusColumn) {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    status = mondayAPI.parseColumnValue(statusValue) || 'No Status';
                }
            }

            const productMatch = productFilter === 'all' || product === productFilter;
            const statusMatch = statusFilter === 'all' || status === statusFilter;

            return productMatch && statusMatch;
        });

        this.renderTable(filtered, statusColumn);
    }

    renderTable(items, statusColumn) {
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Product</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>
                <tbody>
        `;

        items.forEach(item => {
            let status = 'N/A';
            let statusClass = 'status-default';

            if (statusColumn) {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    status = mondayAPI.parseColumnValue(statusValue) || 'N/A';
                    const statusLower = status.toLowerCase();
                    
                    if (statusLower.includes('done') || statusLower.includes('complete')) {
                        statusClass = 'status-done';
                    } else if (statusLower.includes('working') || statusLower.includes('progress')) {
                        statusClass = 'status-working';
                    } else if (statusLower.includes('stuck')) {
                        statusClass = 'status-stuck';
                    }
                }
            }

            const created = new Date(item.created_at).toLocaleDateString();
            const updated = new Date(item.updated_at).toLocaleDateString();
            const product = item.group?.title || 'Ungrouped';

            tableHTML += `
                <tr>
                    <td><strong>${item.name}</strong></td>
                    <td>${product}</td>
                    <td><span class="status-badge ${statusClass}">${status}</span></td>
                    <td>${created}</td>
                    <td>${updated}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        document.getElementById('itemsTable').innerHTML = tableHTML;
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});

// Made with Bob
