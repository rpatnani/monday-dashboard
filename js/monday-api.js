/**
 * Monday.com API Service
 * Handles all API interactions with Monday.com
 */

class MondayAPI {
    constructor() {
        this.apiUrl = 'https://api.monday.com/v2';
        this.apiToken = null;
        this.boardId = null;
    }

    /**
     * Set API credentials
     */
    setCredentials(apiToken, boardId) {
        this.apiToken = apiToken;
        this.boardId = boardId;
    }

    /**
     * Make a GraphQL query to Monday.com API
     */
    async query(queryString) {
        if (!this.apiToken) {
            throw new Error('API token not set');
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.apiToken
                },
                body: JSON.stringify({
                    query: queryString
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            return data.data;
        } catch (error) {
            console.error('Monday API Error:', error);
            throw error;
        }
    }

    /**
     * Get board data with all items and columns
     */
    async getBoardData() {
        const query = `
            query {
                boards(ids: ${this.boardId}) {
                    id
                    name
                    description
                    columns {
                        id
                        title
                        type
                        settings_str
                    }
                    items_page(limit: 500) {
                        items {
                            id
                            name
                            state
                            created_at
                            updated_at
                            column_values {
                                id
                                text
                                value
                                type
                            }
                            group {
                                id
                                title
                            }
                        }
                    }
                }
            }
        `;

        const data = await this.query(query);
        return data.boards[0];
    }

    /**
     * Get specific columns data
     */
    async getItemsWithColumns(columnIds = []) {
        const columnIdsStr = columnIds.length > 0 
            ? `ids: [${columnIds.map(id => `"${id}"`).join(', ')}]` 
            : '';

        const query = `
            query {
                boards(ids: ${this.boardId}) {
                    items_page(limit: 500) {
                        items {
                            id
                            name
                            column_values(${columnIdsStr}) {
                                id
                                title
                                text
                                value
                                type
                            }
                        }
                    }
                }
            }
        `;

        const data = await this.query(query);
        return data.boards[0].items_page.items;
    }

    /**
     * Parse column value based on type
     */
    parseColumnValue(columnValue) {
        if (!columnValue.value) return null;

        try {
            const value = JSON.parse(columnValue.value);
            
            switch (columnValue.type) {
                case 'status':
                    return value.label || columnValue.text;
                case 'date':
                    return value.date || columnValue.text;
                case 'numeric':
                    return parseFloat(columnValue.text) || 0;
                case 'timeline':
                    return {
                        from: value.from,
                        to: value.to
                    };
                case 'people':
                    return value.personsAndTeams || [];
                default:
                    return columnValue.text;
            }
        } catch (e) {
            return columnValue.text;
        }
    }

    /**
     * Get board statistics
     */
    async getBoardStats() {
        const boardData = await this.getBoardData();
        const items = boardData.items_page.items;

        // Find status column
        const statusColumn = boardData.columns.find(col => 
            col.type === 'status' || col.title.toLowerCase().includes('status')
        );

        const stats = {
            totalItems: items.length,
            byStatus: {},
            byGroup: {},
            recentUpdates: []
        };

        items.forEach(item => {
            // Count by group
            const groupTitle = item.group?.title || 'Ungrouped';
            stats.byGroup[groupTitle] = (stats.byGroup[groupTitle] || 0) + 1;

            // Count by status
            if (statusColumn) {
                const statusValue = item.column_values.find(cv => cv.id === statusColumn.id);
                if (statusValue) {
                    const status = this.parseColumnValue(statusValue) || 'No Status';
                    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
                }
            }

            // Track recent updates
            stats.recentUpdates.push({
                name: item.name,
                updated: new Date(item.updated_at)
            });
        });

        // Sort recent updates
        stats.recentUpdates.sort((a, b) => b.updated - a.updated);
        stats.recentUpdates = stats.recentUpdates.slice(0, 10);

        return stats;
    }
}

// Create global instance
const mondayAPI = new MondayAPI();

// Made with Bob
