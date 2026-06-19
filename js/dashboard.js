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
        document.getElementById('quickExportMOR').addEventListener('click', () => this.quickExportMOR());
        document.getElementById('exportReport').addEventListener('click', () => this.exportMORReport());
        document.getElementById('exportPowerPoint').addEventListener('click', () => this.exportMORToPowerPoint());

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

            // Update all components - MOR priorities first
            this.updateDeltaChanges();
            this.updateStateDistribution();
            this.updateMonthlyHighlights();
            
            // Additional analytics
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

        // Find status and impact columns
        const statusColumn = this.boardData.columns.find(col =>
            col.type === 'status' || col.title.toLowerCase().includes('status')
        );
        
        const impactColumn = this.boardData.columns.find(col =>
            col.title.toLowerCase().includes('impact')
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

        // Sort by impact if impact column exists
        if (impactColumn) {
            deliveredThisMonth.sort((a, b) => {
                const impactA = a.column_values.find(cv => cv.id === impactColumn.id);
                const impactB = b.column_values.find(cv => cv.id === impactColumn.id);
                
                const valueA = impactA ? this.getImpactScore(mondayAPI.parseColumnValue(impactA)) : 0;
                const valueB = impactB ? this.getImpactScore(mondayAPI.parseColumnValue(impactB)) : 0;
                
                return valueB - valueA; // Descending order
            });
        }

        // Get top 3
        const top3 = deliveredThisMonth.slice(0, 3);

        const highlightsContainer = document.getElementById('monthlyHighlights');
        
        if (top3.length === 0) {
            highlightsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <p>No items delivered this month yet</p>
                </div>
            `;
            return;
        }

        let highlightsHTML = '';
        top3.forEach((item, index) => {
            const date = new Date(item.updated_at).toLocaleDateString();
            const product = item.group?.title || 'General';
            
            let impactText = '';
            if (impactColumn) {
                const impactValue = item.column_values.find(cv => cv.id === impactColumn.id);
                if (impactValue) {
                    const impact = mondayAPI.parseColumnValue(impactValue);
                    if (impact) {
                        impactText = `<span class="highlight-impact">Impact: ${impact}</span>`;
                    }
                }
            }
            
            const medals = ['🥇', '🥈', '🥉'];
            
            highlightsHTML += `
                <div class="highlight-item">
                    <div class="highlight-icon">${medals[index]}</div>
                    <div class="highlight-content">
                        <h4>${item.name}</h4>
                        <p>Product: ${product}</p>
                    </div>
                    ${impactText}
                    <div class="highlight-date">${date}</div>
                </div>
            `;
        });

        highlightsContainer.innerHTML = highlightsHTML;
    }

    getImpactScore(impactValue) {
        if (!impactValue) return 0;
        
        const impactStr = String(impactValue).toLowerCase();
        
        // Map impact levels to scores
        if (impactStr.includes('critical') || impactStr.includes('high')) return 3;
        if (impactStr.includes('medium') || impactStr.includes('moderate')) return 2;
        if (impactStr.includes('low')) return 1;
        
        // Try to parse as number
        const num = parseFloat(impactStr);
        if (!isNaN(num)) return num;
        
        return 0;
    }

    updateDeltaChanges() {
        const items = this.boardData.items_page.items;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Find status column
        const statusColumn = this.boardData.columns.find(col =>
            col.type === 'status' || col.title.toLowerCase().includes('status')
        );

        // Track overall and per-product changes
        const productChanges = {};
        let totalChanges = 0;

        items.forEach(item => {
            const created = new Date(item.created_at);
            const updated = new Date(item.updated_at);
            const product = item.group?.title || 'Ungrouped';

            // Initialize product tracking
            if (!productChanges[product]) {
                productChanges[product] = {
                    added: 0,
                    delivered: 0,
                    cancelled: 0,
                    modified: 0,
                    total: 0
                };
            }

            // Check if item was updated in last 30 days
            const wasUpdatedRecently = updated >= thirtyDaysAgo;
            const wasCreatedRecently = created >= thirtyDaysAgo;

            // New items added in last 30 days
            if (wasCreatedRecently) {
                productChanges[product].added++;
                totalChanges++;
            }

            // Only count changes for items updated in last 30 days
            if (wasUpdatedRecently && statusColumn) {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    const status = mondayAPI.parseColumnValue(statusValue);
                    const statusLower = (status || '').toLowerCase();
                    
                    // Items delivered/completed in last 30 days
                    if (statusLower.includes('done') || statusLower.includes('complete') || statusLower.includes('delivered')) {
                        productChanges[product].delivered++;
                        if (!wasCreatedRecently) totalChanges++;
                    }
                    // Items cancelled/closed in last 30 days
                    else if (statusLower.includes('cancel') || statusLower.includes('closed')) {
                        productChanges[product].cancelled++;
                        if (!wasCreatedRecently) totalChanges++;
                    }
                    // Items with other status changes (modified) in last 30 days
                    else if (!wasCreatedRecently) {
                        productChanges[product].modified++;
                        totalChanges++;
                    }
                }
            }
            // Items updated but without status column, count as modified if not newly created
            else if (wasUpdatedRecently && !wasCreatedRecently && !statusColumn) {
                productChanges[product].modified++;
                totalChanges++;
            }
        });

        // Calculate totals per product
        Object.keys(productChanges).forEach(product => {
            const p = productChanges[product];
            p.total = p.added + p.delivered + p.cancelled + p.modified;
        });

        // Update total changes
        document.getElementById('deltaTotalChanges').textContent = totalChanges;

        // Update per-product breakdown
        const perProductContainer = document.getElementById('deltaPerProduct');
        let perProductHTML = '';

        Object.keys(productChanges).sort().forEach(product => {
            const data = productChanges[product];
            
            perProductHTML += `
                <div class="product-delta-card">
                    <h4>${product}</h4>
                    <div class="product-delta-stats">
                        <div class="delta-stat-row">
                            <span class="delta-stat-label">➕ New Items</span>
                            <span class="delta-stat-value">${data.added}</span>
                        </div>
                        <div class="delta-stat-row">
                            <span class="delta-stat-label">✅ Delivered</span>
                            <span class="delta-stat-value">${data.delivered}</span>
                        </div>
                        <div class="delta-stat-row">
                            <span class="delta-stat-label">❌ Cancelled</span>
                            <span class="delta-stat-value">${data.cancelled}</span>
                        </div>
                        <div class="delta-stat-row">
                            <span class="delta-stat-label">🔄 Modified</span>
                            <span class="delta-stat-value">${data.modified}</span>
                        </div>
                        <div class="delta-stat-row" style="background: #667eea; color: white; font-weight: bold;">
                            <span class="delta-stat-label">Total Changes</span>
                            <span class="delta-stat-value" style="color: white;">${data.total}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        perProductContainer.innerHTML = perProductHTML;
    }

    updateStateDistribution() {
        const items = this.boardData.items_page.items;
        
        // Find status column
        const statusColumn = this.boardData.columns.find(col =>
            col.type === 'status' || col.title.toLowerCase().includes('status')
        );

        // Overall state distribution
        const overallStates = {};
        
        // Per-product state distribution
        const productStates = {};

        items.forEach(item => {
            const product = item.group?.title || 'Ungrouped';
            
            // Initialize product tracking
            if (!productStates[product]) {
                productStates[product] = {
                    total: 0,
                    states: {}
                };
            }
            
            productStates[product].total++;

            if (statusColumn) {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    const status = mondayAPI.parseColumnValue(statusValue) || 'No Status';
                    
                    // Overall count
                    overallStates[status] = (overallStates[status] || 0) + 1;
                    
                    // Per-product count
                    productStates[product].states[status] = (productStates[product].states[status] || 0) + 1;
                }
            }
        });

        // Update overall state distribution
        const overallContainer = document.getElementById('totalStateDistribution');
        let overallHTML = '';

        Object.keys(overallStates).sort().forEach(state => {
            const count = overallStates[state];
            overallHTML += `
                <div class="state-card">
                    <div class="state-card-label">${state}</div>
                    <div class="state-card-value">${count}</div>
                </div>
            `;
        });

        overallContainer.innerHTML = overallHTML;

        // Update per-product state distribution
        const perProductContainer = document.getElementById('statePerProduct');
        let perProductHTML = '';

        Object.keys(productStates).sort().forEach(product => {
            const data = productStates[product];
            
            perProductHTML += `
                <div class="product-state-card">
                    <div class="product-state-header">
                        <h4>${product}</h4>
                        <span class="product-state-total">${data.total} items</span>
                    </div>
                    <div class="product-state-breakdown">
            `;

            Object.keys(data.states).sort().forEach(state => {
                const count = data.states[state];
                perProductHTML += `
                    <div class="state-breakdown-row">
                        <span class="state-breakdown-label">${state}</span>
                        <span class="state-breakdown-value">${count}</span>
                    </div>
                `;
            });

            perProductHTML += `
                    </div>
                </div>
            `;
        });

        perProductContainer.innerHTML = perProductHTML;
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

    quickExportMOR() {
        // Check if data is loaded
        if (!this.boardData) {
            // Show modal asking user to choose format
            const choice = confirm(
                '📊 Quick Export MOR Report\n\n' +
                'Please load dashboard data first by entering:\n' +
                '1. Your Monday.com API Token\n' +
                '2. Your Board ID\n' +
                '3. Click "Load Dashboard Data"\n\n' +
                'Then you can export the report.\n\n' +
                'Click OK to see instructions, or Cancel to continue.'
            );
            
            if (choice) {
                alert(
                    '📋 How to Get Your Credentials:\n\n' +
                    '1. API Token:\n' +
                    '   - Go to Monday.com\n' +
                    '   - Click profile → Developers → API\n' +
                    '   - Copy your token\n\n' +
                    '2. Board ID:\n' +
                    '   - Open your board\n' +
                    '   - Look at URL: monday.com/boards/[ID]\n' +
                    '   - Copy the number\n\n' +
                    '3. Enter both above and click "Load Dashboard Data"'
                );
            }
            return;
        }

        // Data is loaded, ask which format
        const format = confirm(
            '📊 Export MOR Report\n\n' +
            'Choose export format:\n\n' +
            'OK = PowerPoint (.pptx) - Recommended for presentations\n' +
            'Cancel = Text (.txt) - Simple text format\n\n' +
            'Both include Top 3 Highlights from Impact column'
        );

        if (format) {
            // Export to PowerPoint
            this.exportMORToPowerPoint();
        } else {
            // Export to Text
            this.exportMORReport();
        }
    }

    exportMORReport() {
        if (!this.boardData) {
            alert('Please load dashboard data first');
            return;
        }

        const reportData = this.generateMORReportData();
        
        // Create text format
        const textReport = this.formatReportAsText(reportData);
        
        // Download as text file
        this.downloadTextFile(textReport, `MOR_Report_${new Date().toISOString().split('T')[0]}.txt`);
        
        // Show success message
        this.showStatus('MOR Report exported successfully!', 'success');
        setTimeout(() => this.hideStatus(), 3000);
    }

    generateMORReportData() {
        const items = this.boardData.items_page.items;
        const currentMonth = new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' });
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const statusColumn = this.boardData.columns.find(col =>
            col.type === 'status' || col.title.toLowerCase().includes('status')
        );
        
        const impactColumn = this.boardData.columns.find(col =>
            col.title.toLowerCase().includes('impact')
        );

        // 1. Delta Changes
        const productChanges = {};
        let totalChanges = 0;

        items.forEach(item => {
            const created = new Date(item.created_at);
            const updated = new Date(item.updated_at);
            const product = item.group?.title || 'Ungrouped';

            if (!productChanges[product]) {
                productChanges[product] = { added: 0, delivered: 0, cancelled: 0, modified: 0, total: 0 };
            }

            const wasUpdatedRecently = updated >= thirtyDaysAgo;
            const wasCreatedRecently = created >= thirtyDaysAgo;

            if (wasCreatedRecently) {
                productChanges[product].added++;
                totalChanges++;
            }

            if (wasUpdatedRecently && statusColumn) {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    const status = mondayAPI.parseColumnValue(statusValue);
                    const statusLower = (status || '').toLowerCase();
                    
                    if (statusLower.includes('done') || statusLower.includes('complete') || statusLower.includes('delivered')) {
                        productChanges[product].delivered++;
                        if (!wasCreatedRecently) totalChanges++;
                    } else if (statusLower.includes('cancel') || statusLower.includes('closed')) {
                        productChanges[product].cancelled++;
                        if (!wasCreatedRecently) totalChanges++;
                    } else if (!wasCreatedRecently) {
                        productChanges[product].modified++;
                        totalChanges++;
                    }
                }
            }
        });

        Object.keys(productChanges).forEach(product => {
            const p = productChanges[product];
            p.total = p.added + p.delivered + p.cancelled + p.modified;
        });

        // 2. State Distribution
        const overallStates = {};
        const productStates = {};

        items.forEach(item => {
            const product = item.group?.title || 'Ungrouped';
            
            if (!productStates[product]) {
                productStates[product] = { total: 0, states: {} };
            }
            
            productStates[product].total++;

            if (statusColumn) {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    const status = mondayAPI.parseColumnValue(statusValue) || 'No Status';
                    overallStates[status] = (overallStates[status] || 0) + 1;
                    productStates[product].states[status] = (productStates[product].states[status] || 0) + 1;
                }
            }
        });

        // 3. Top 3 Highlights
        const deliveredThisMonth = items.filter(item => {
            const updated = new Date(item.updated_at);
            if (updated.getMonth() !== new Date().getMonth() || updated.getFullYear() !== new Date().getFullYear()) {
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

        if (impactColumn) {
            deliveredThisMonth.sort((a, b) => {
                const impactA = a.column_values.find(cv => cv.id === impactColumn.id);
                const impactB = b.column_values.find(cv => cv.id === impactColumn.id);
                
                const valueA = impactA ? this.getImpactScore(mondayAPI.parseColumnValue(impactA)) : 0;
                const valueB = impactB ? this.getImpactScore(mondayAPI.parseColumnValue(impactB)) : 0;
                
                return valueB - valueA;
            });
        }

        const top3Highlights = deliveredThisMonth.slice(0, 3).map(item => {
            const product = item.group?.title || 'General';
            const date = new Date(item.updated_at).toLocaleDateString();
            
            let impact = 'N/A';
            if (impactColumn) {
                const impactValue = item.column_values.find(cv => cv.id === impactColumn.id);
                if (impactValue) {
                    impact = mondayAPI.parseColumnValue(impactValue) || 'N/A';
                }
            }
            
            return { name: item.name, product, date, impact };
        });

        return {
            month: currentMonth,
            totalChanges,
            productChanges,
            overallStates,
            productStates,
            top3Highlights
        };
    }

    formatReportAsText(data) {
        let report = '';
        
        report += '═══════════════════════════════════════════════════════════════\n';
        report += '           MONTHLY OPERATING REVIEW (MOR) REPORT\n';
        report += '═══════════════════════════════════════════════════════════════\n';
        report += `Report Period: ${data.month}\n`;
        report += `Generated: ${new Date().toLocaleString()}\n`;
        report += '═══════════════════════════════════════════════════════════════\n\n';

        // Section 1: Last Month Changes/Updates
        report += '1. LAST MONTH CHANGES/UPDATES (Last 30 Days)\n';
        report += '───────────────────────────────────────────────────────────────\n';
        report += `Total Changes: ${data.totalChanges}\n\n`;
        report += 'Per Product Breakdown:\n\n';

        Object.keys(data.productChanges).sort().forEach(product => {
            const changes = data.productChanges[product];
            report += `  ${product}:\n`;
            report += `    • New Items Added:    ${changes.added}\n`;
            report += `    • Items Delivered:    ${changes.delivered}\n`;
            report += `    • Items Cancelled:    ${changes.cancelled}\n`;
            report += `    • Items Modified:     ${changes.modified}\n`;
            report += `    • Total Changes:      ${changes.total}\n\n`;
        });

        // Section 2: Total Items in Each State
        report += '\n2. TOTAL ITEMS IN EACH STATE\n';
        report += '───────────────────────────────────────────────────────────────\n';
        report += 'Overall Status Distribution:\n\n';

        Object.keys(data.overallStates).sort().forEach(state => {
            report += `  ${state}: ${data.overallStates[state]}\n`;
        });

        report += '\nPer Product Status Distribution:\n\n';

        Object.keys(data.productStates).sort().forEach(product => {
            const states = data.productStates[product];
            report += `  ${product} (Total: ${states.total} items):\n`;
            Object.keys(states.states).sort().forEach(state => {
                report += `    • ${state}: ${states.states[state]}\n`;
            });
            report += '\n';
        });

        // Section 3: Top 3 Highlights
        report += '\n3. TOP 3 HIGHLIGHTS OF THE MONTH\n';
        report += '───────────────────────────────────────────────────────────────\n';
        report += 'Based on delivered items with highest impact:\n\n';

        if (data.top3Highlights.length === 0) {
            report += '  No items delivered this month yet.\n';
        } else {
            data.top3Highlights.forEach((highlight, index) => {
                const medals = ['🥇', '🥈', '🥉'];
                report += `  ${medals[index]} #${index + 1}: ${highlight.name}\n`;
                report += `     Product: ${highlight.product}\n`;
                report += `     Impact: ${highlight.impact}\n`;
                report += `     Delivered: ${highlight.date}\n\n`;
            });
        }

        report += '═══════════════════════════════════════════════════════════════\n';
        report += 'End of Report\n';
        report += '═══════════════════════════════════════════════════════════════\n';

        return report;
    }

    downloadTextFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    exportMORToPowerPoint() {
        if (!this.boardData) {
            alert('Please load dashboard data first');
            return;
        }

        const reportData = this.generateMORReportData();
        this.createPowerPointPresentation(reportData);
        
        // Show success message
        this.showStatus('Generating PowerPoint presentation...', 'loading');
    }

    async createPowerPointPresentation(data) {
        try {
            // Create new presentation
            const pptx = new PptxGenJS();
            
            // Set presentation properties
            pptx.author = 'Monday.com Dashboard';
            pptx.company = 'IBM';
            pptx.subject = 'Monthly Operating Review';
            pptx.title = 'MOR Report';

            // IBM Carbon Design System Colors
            const colors = {
                // IBM Blue - Primary interactive color
                primary: '0f62fe',
                // IBM Gray 100 - Darkest gray for text
                text: '161616',
                // IBM Gray 70 - Secondary text
                textSecondary: '525252',
                // IBM Gray 10 - Light background
                background: 'f4f4f4',
                // IBM Gray 20 - Card background
                cardBackground: 'e0e0e0',
                // White
                white: 'FFFFFF',
                // IBM Green - Success/positive
                success: '24a148',
                // IBM Red - Error/negative
                error: 'da1e28',
                // IBM Yellow - Warning
                warning: 'f1c21b',
                // IBM Blue 60 - Links and interactive elements
                interactive: '0f62fe'
            };

            // Slide 1: Title Slide - Professional IBM Carbon Style
            let slide = pptx.addSlide();
            slide.background = { color: colors.white };
            
            // IBM Blue accent bar at top
            slide.addShape(pptx.ShapeType.rect, {
                x: 0,
                y: 0,
                w: 10,
                h: 0.15,
                fill: { color: colors.primary },
                line: { type: 'none' }
            });
            
            // Company/IBM branding text in top left
            slide.addText('IBM', {
                x: 0.5,
                y: 0.4,
                w: 2,
                h: 0.5,
                fontSize: 28,
                bold: true,
                color: colors.text,
                fontFace: 'IBM Plex Sans'
            });
            
            // Main title - centered and prominent
            slide.addText('Monthly Operating Review', {
                x: 1,
                y: 2.2,
                w: 8,
                h: 1.2,
                fontSize: 54,
                bold: false,
                color: colors.text,
                align: 'center',
                fontFace: 'IBM Plex Sans'
            });
            
            // Month subtitle
            slide.addText(data.month, {
                x: 1,
                y: 3.5,
                w: 8,
                h: 0.6,
                fontSize: 28,
                color: colors.textSecondary,
                align: 'center',
                fontFace: 'IBM Plex Sans'
            });
            
            // Generated date at bottom
            slide.addText(`Generated: ${new Date().toLocaleDateString()}`, {
                x: 1,
                y: 5.2,
                w: 8,
                h: 0.4,
                fontSize: 12,
                color: colors.textSecondary,
                align: 'center',
                fontFace: 'IBM Plex Sans'
            });

            // Slide 2+: Top 3 Highlights (Most Important) - IBM Carbon Style
            // Split into multiple slides if needed - max 2 highlights per slide to prevent overlap
            if (data.top3Highlights.length === 0) {
                slide = pptx.addSlide();
                slide.background = { color: colors.white };
                
                // Blue accent bar
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0,
                    y: 0,
                    w: 10,
                    h: 0.1,
                    fill: { color: colors.primary },
                    line: { type: 'none' }
                });
                
                slide.addText('Top 3 Highlights of the Month', {
                    x: 0.5,
                    y: 0.5,
                    w: 9,
                    h: 0.6,
                    fontSize: 42,
                    bold: false,
                    color: colors.text,
                    fontFace: 'IBM Plex Sans'
                });

                slide.addText('Based on delivered items with highest impact', {
                    x: 0.5,
                    y: 1.2,
                    w: 9,
                    h: 0.4,
                    fontSize: 14,
                    color: colors.textSecondary,
                    fontFace: 'IBM Plex Sans'
                });

                slide.addText('No items delivered this month yet', {
                    x: 1.5,
                    y: 2.5,
                    w: 7,
                    h: 1,
                    fontSize: 20,
                    color: colors.textSecondary,
                    align: 'center',
                    fontFace: 'IBM Plex Sans'
                });
            } else {
                const medals = ['🥇', '🥈', '🥉'];
                const highlightsPerSlide = 1; // 1 highlight per slide for maximum clarity
                
                // Split highlights into chunks (1 per slide)
                for (let i = 0; i < data.top3Highlights.length; i += highlightsPerSlide) {
                    slide = pptx.addSlide();
                    slide.background = { color: colors.white };
                    
                    // Blue accent bar
                    slide.addShape(pptx.ShapeType.rect, {
                        x: 0,
                        y: 0,
                        w: 10,
                        h: 0.1,
                        fill: { color: colors.primary },
                        line: { type: 'none' }
                    });
                    
                    // Add title to each slide
                    const slideNum = Math.floor(i / highlightsPerSlide) + 1;
                    const totalSlides = Math.ceil(data.top3Highlights.length / highlightsPerSlide);
                    const titleText = totalSlides > 1
                        ? `Top 3 Highlights of the Month (${slideNum}/${totalSlides})`
                        : 'Top 3 Highlights of the Month';
                    
                    slide.addText(titleText, {
                        x: 0.5,
                        y: 0.5,
                        w: 9,
                        h: 0.5,
                        fontSize: 32,
                        bold: false,
                        color: colors.text,
                        fontFace: 'IBM Plex Sans'
                    });

                    slide.addText('Based on delivered items with highest impact', {
                        x: 0.5,
                        y: 1.1,
                        w: 9,
                        h: 0.3,
                        fontSize: 12,
                        color: colors.textSecondary,
                        fontFace: 'IBM Plex Sans'
                    });

                    const highlightsOnThisSlide = data.top3Highlights.slice(i, i + highlightsPerSlide);
                    
                    highlightsOnThisSlide.forEach((highlight, localIndex) => {
                        const globalIndex = i + localIndex;
                        
                        // Highlight box - IBM Carbon style, properly sized
                        slide.addShape(pptx.ShapeType.rect, {
                            x: 0.5,
                            y: 1.8,
                            w: 9,
                            h: 3.5,
                            fill: { color: colors.background },
                            line: { color: colors.cardBackground, width: 1 }
                        });
                        
                        // Left accent bar (IBM Blue)
                        slide.addShape(pptx.ShapeType.rect, {
                            x: 0.5,
                            y: 1.8,
                            w: 0.1,
                            h: 3.5,
                            fill: { color: colors.primary },
                            line: { type: 'none' }
                        });

                        // Medal and title
                        slide.addText(`${medals[globalIndex]} ${highlight.name}`, {
                            x: 0.9,
                            y: 2.0,
                            w: 8.4,
                            h: 0.7,
                            fontSize: 16,
                            bold: true,
                            color: colors.text,
                            valign: 'top',
                            wrap: true,
                            fontFace: 'IBM Plex Sans'
                        });

                        // Description - ample space for text
                        slide.addText(highlight.description || '', {
                            x: 0.9,
                            y: 2.8,
                            w: 8.4,
                            h: 1.9,
                            fontSize: 12,
                            color: colors.textSecondary,
                            valign: 'top',
                            wrap: true,
                            fontFace: 'IBM Plex Sans'
                        });

                        // Details at bottom
                        slide.addText(`Product: ${highlight.product}  |  Impact: ${highlight.impact}  |  Delivered: ${highlight.date}`, {
                            x: 0.9,
                            y: 4.9,
                            w: 8.4,
                            h: 0.3,
                            fontSize: 11,
                            color: colors.textSecondary,
                            fontFace: 'IBM Plex Sans'
                        });
                    });
                }
            }

            // Slide 3: Last Month Changes/Updates - IBM Carbon Style
            slide = pptx.addSlide();
            slide.background = { color: colors.white };
            
            // Blue accent bar
            slide.addShape(pptx.ShapeType.rect, {
                x: 0,
                y: 0,
                w: 10,
                h: 0.1,
                fill: { color: colors.primary },
                line: { type: 'none' }
            });
            
            slide.addText('Last Month Changes/Updates', {
                x: 0.5,
                y: 0.5,
                w: 9,
                h: 0.8,
                fontSize: 42,
                bold: false,
                color: colors.text,
                fontFace: 'IBM Plex Sans'
            });

            slide.addText('Last 30 Days', {
                x: 0.5,
                y: 1.3,
                w: 9,
                h: 0.4,
                fontSize: 14,
                color: colors.textSecondary,
                fontFace: 'IBM Plex Sans'
            });

            // Total changes box - IBM Carbon style
            slide.addShape(pptx.ShapeType.rect, {
                x: 3.0,
                y: 2.5,
                w: 4.0,
                h: 2.0,
                fill: { color: colors.primary },
                line: { type: 'none' }
            });

            slide.addText('Total Changes', {
                x: 3.0,
                y: 2.7,
                w: 4.0,
                h: 0.5,
                fontSize: 18,
                color: colors.white,
                align: 'center',
                bold: false,
                fontFace: 'IBM Plex Sans'
            });

            slide.addText(data.totalChanges.toString(), {
                x: 3.0,
                y: 3.3,
                w: 4.0,
                h: 1.0,
                fontSize: 72,
                color: colors.white,
                align: 'center',
                bold: false,
                fontFace: 'IBM Plex Sans'
            });

            slide.addText('See next slide for detailed breakdown by product', {
                x: 0.5,
                y: 5.5,
                w: 9,
                h: 0.4,
                fontSize: 14,
                color: colors.textSecondary,
                fontFace: 'IBM Plex Sans'
            });

            // Slide 4: Per Product Changes Table
            slide = pptx.addSlide();
            slide.addText('📈 Changes by Product', {
                x: 0.5,
                y: 0.3,
                w: 9,
                h: 0.5,
                fontSize: 28,
                bold: true,
                color: colors.primary
            });

            slide.addText('Last 30 Days - Detailed Breakdown', {
                x: 0.5,
                y: 0.85,
                w: 9,
                h: 0.3,
                fontSize: 12,
                color: colors.text,
                italic: true
            });

            // Per product breakdown table
            const tableData = [
                [
                    { text: 'Product', options: { bold: true, color: colors.white, fill: colors.primary, fontSize: 11 } },
                    { text: 'Added', options: { bold: true, color: colors.white, fill: colors.primary, fontSize: 11 } },
                    { text: 'Delivered', options: { bold: true, color: colors.white, fill: colors.primary, fontSize: 11 } },
                    { text: 'Cancelled', options: { bold: true, color: colors.white, fill: colors.primary, fontSize: 11 } },
                    { text: 'Modified', options: { bold: true, color: colors.white, fill: colors.primary, fontSize: 11 } },
                    { text: 'Total', options: { bold: true, color: colors.white, fill: colors.primary, fontSize: 11 } }
                ]
            ];

            // Show up to 12 products on this slide
            const maxTableRows = 12;
            const productKeys = Object.keys(data.productChanges).sort().slice(0, maxTableRows);
            
            productKeys.forEach(product => {
                const changes = data.productChanges[product];
                tableData.push([
                    { text: product, options: { fontSize: 10 } },
                    { text: changes.added.toString(), options: { fontSize: 10 } },
                    { text: changes.delivered.toString(), options: { fontSize: 10 } },
                    { text: changes.cancelled.toString(), options: { fontSize: 10 } },
                    { text: changes.modified.toString(), options: { fontSize: 10 } },
                    { text: changes.total.toString(), options: { fontSize: 10 } }
                ]);
            });
            
            slide.addTable(tableData, {
                x: 0.5,
                y: 1.3,
                w: 9,
                colW: [2.0, 1.4, 1.4, 1.4, 1.4, 1.4],
                border: { pt: 1, color: colors.primary },
                align: 'center',
                valign: 'middle',
                autoPage: false,
                rowH: 0.4
            });

            // If more products, add note
            if (Object.keys(data.productChanges).length > maxTableRows) {
                const remaining = Object.keys(data.productChanges).length - maxTableRows;
                slide.addText(`Note: Showing ${maxTableRows} products. ${remaining} more not displayed.`, {
                    x: 0.5,
                    y: 6.8,
                    w: 9,
                    h: 0.3,
                    fontSize: 10,
                    color: colors.text,
                    italic: true,
                    align: 'center'
                });
            }

            // Slide 5: Total Items in Each State - Overview
            slide = pptx.addSlide();
            slide.addText('📊 Total Items in Each State', {
                x: 0.5,
                y: 0.5,
                w: 9,
                h: 0.8,
                fontSize: 36,
                bold: true,
                color: colors.primary,
                align: 'center'
            });

            // Overall status distribution
            slide.addText('Overall Status Distribution', {
                x: 0.5,
                y: 1.5,
                w: 9,
                h: 0.4,
                fontSize: 18,
                bold: true,
                color: colors.text,
                align: 'center'
            });

            let xPos = 0.6;
            let yPos = 2.1;
            let count = 0;
            const statusKeys = Object.keys(data.overallStates).sort();
            
            statusKeys.forEach(state => {
                const stateCount = data.overallStates[state];
                
                slide.addShape(pptx.ShapeType.rect, {
                    x: xPos,
                    y: yPos,
                    w: 1.7,
                    h: 0.8,
                    fill: { color: colors.lightGray },
                    line: { color: colors.primary, width: 2 }
                });

                slide.addText(state, {
                    x: xPos,
                    y: yPos + 0.1,
                    w: 1.7,
                    h: 0.3,
                    fontSize: 11,
                    color: colors.text,
                    align: 'center',
                    bold: true
                });

                slide.addText(stateCount.toString(), {
                    x: xPos,
                    y: yPos + 0.45,
                    w: 1.7,
                    h: 0.3,
                    fontSize: 18,
                    color: colors.primary,
                    align: 'center',
                    bold: true
                });

                xPos += 1.9;
                count++;
                
                if (count % 5 === 0) {
                    xPos = 0.6;
                    yPos += 1.0;
                }
            });

            slide.addText('See next slide for per-product breakdown', {
                x: 0.5,
                y: 6.0,
                w: 9,
                h: 0.4,
                fontSize: 14,
                color: colors.text,
                italic: true,
                align: 'center'
            });

            // Slide 6: Per Product Status Distribution
            slide = pptx.addSlide();
            slide.addText('📊 Status by Product', {
                x: 0.5,
                y: 0.3,
                w: 9,
                h: 0.5,
                fontSize: 28,
                bold: true,
                color: colors.primary
            });

            slide.addText('Detailed Status Breakdown per Product', {
                x: 0.5,
                y: 0.85,
                w: 9,
                h: 0.3,
                fontSize: 12,
                color: colors.text,
                italic: true
            });

            // Per product status table
            const statusTableData = [
                [
                    { text: 'Product', options: { bold: true, color: colors.white, fill: colors.primary, fontSize: 11 } },
                    { text: 'Total', options: { bold: true, color: colors.white, fill: colors.primary, fontSize: 11 } },
                    { text: 'Status Breakdown', options: { bold: true, color: colors.white, fill: colors.primary, fontSize: 11 } }
                ]
            ];

            const maxProductRows = 10; // Show up to 10 products
            const productStateKeys = Object.keys(data.productStates).sort().slice(0, maxProductRows);
            
            productStateKeys.forEach(product => {
                const states = data.productStates[product];
                const statusBreakdown = Object.keys(states.states)
                    .map(s => `${s}: ${states.states[s]}`)
                    .join(', ');
                
                statusTableData.push([
                    { text: product, options: { fontSize: 10 } },
                    { text: states.total.toString(), options: { fontSize: 10 } },
                    { text: statusBreakdown, options: { fontSize: 9 } }
                ]);
            });
            
            slide.addTable(statusTableData, {
                x: 0.5,
                y: 1.3,
                w: 9,
                colW: [1.8, 1.0, 6.2],
                border: { pt: 1, color: colors.primary },
                valign: 'middle',
                autoPage: false,
                rowH: 0.45
            });

            // If more products, add note
            if (Object.keys(data.productStates).length > maxProductRows) {
                const remaining = Object.keys(data.productStates).length - maxProductRows;
                slide.addText(`Note: Showing ${maxProductRows} products. ${remaining} more not displayed.`, {
                    x: 0.5,
                    y: 6.8,
                    w: 9,
                    h: 0.3,
                    fontSize: 10,
                    color: colors.text,
                    italic: true,
                    align: 'center'
                });
            }

            // Save presentation
            const fileName = `MOR_Report_${new Date().toISOString().split('T')[0]}.pptx`;
            await pptx.writeFile({ fileName });
            
            this.showStatus('PowerPoint presentation exported successfully!', 'success');
            setTimeout(() => this.hideStatus(), 3000);

        } catch (error) {
            console.error('Error creating PowerPoint:', error);
            this.showStatus(`Error creating PowerPoint: ${error.message}`, 'error');
        }
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});

// Made with Bob
