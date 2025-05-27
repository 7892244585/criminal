// System Logs JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize logs
    initLogs();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize the logs page
 */
function initLogs() {
    // Set up date range selector
    const dateRange = document.getElementById('date-range');
    const customDateRange = document.getElementById('custom-date-range');
    
    if (dateRange && customDateRange) {
        dateRange.addEventListener('change', function() {
            if (this.value === 'custom') {
                customDateRange.style.display = 'block';
            } else {
                customDateRange.style.display = 'none';
            }
            
            // Apply date filter
            applyFilters();
        });
    }
    
    // Set default dates for date picker
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    
    if (dateFrom && dateTo) {
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        
        dateFrom.valueAsDate = weekAgo;
        dateTo.valueAsDate = today;
        
        dateFrom.addEventListener('change', applyFilters);
        dateTo.addEventListener('change', applyFilters);
    }
    
    // Set up other filters
    const logType = document.getElementById('log-type');
    const cameraFilter = document.getElementById('camera-filter');
    
    if (logType) logType.addEventListener('change', applyFilters);
    if (cameraFilter) cameraFilter.addEventListener('change', applyFilters);
    
    // Set up search functionality
    const searchBtn = document.getElementById('search-btn');
    const logSearch = document.getElementById('log-search');
    
    if (searchBtn && logSearch) {
        searchBtn.addEventListener('click', function() {
            applyFilters();
        });
        
        logSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    }
    
    // Set up export buttons
    setupExportButtons();
    
    // Add detail view buttons
    setupLogDetailButtons();
}

/**
 * Set up event listeners for the log page
 */
function setupEventListeners() {
    // Pagination buttons
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
    paginationBtns.forEach(btn => {
        if (btn.textContent === '1' || btn.textContent === '«' || btn.textContent === '»') {
            return; // Skip first page and navigation buttons
        }
        
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            paginationBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real application, this would load the next page of logs
            // For demo, we'll just show a notification
            addNotificationStyles();
            showNotification(`Navigated to page ${this.textContent}`, 'info');
        });
    });
}

/**
 * Apply filters to the logs table
 */
function applyFilters() {
    const logType = document.getElementById('log-type');
    const dateRange = document.getElementById('date-range');
    const cameraFilter = document.getElementById('camera-filter');
    const searchInput = document.getElementById('log-search');
    
    // Get filter values
    const typeValue = logType ? logType.value : 'all';
    const dateValue = dateRange ? dateRange.value : 'week';
    const cameraValue = cameraFilter ? cameraFilter.value : 'all';
    const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Get all log rows
    const logRows = document.querySelectorAll('.log-row');
    
    logRows.forEach(row => {
        let showRow = true;
        
        // Apply type filter
        if (typeValue !== 'all') {
            const rowType = row.className.split(' ')[1]; // e.g., "detection-event"
            if (!rowType.startsWith(typeValue)) {
                showRow = false;
            }
        }
        
        // Apply camera filter
        if (cameraValue !== 'all' && showRow) {
            const rowCamera = row.querySelector('td:nth-child(4)').textContent;
            if (!rowCamera.toLowerCase().includes(cameraValue.replace('-', ' '))) {
                showRow = false;
            }
        }
        
        // Apply search filter
        if (searchValue && showRow) {
            const rowText = row.textContent.toLowerCase();
            if (!rowText.includes(searchValue)) {
                showRow = false;
            }
        }
        
        // Apply date filter (in a real app)
        // For demo purposes, we skip actual date filtering
        
        // Show or hide the row
        row.style.display = showRow ? '' : 'none';
    });
    
    // Show a message if no results
    const visibleRows = document.querySelectorAll('.log-row[style=""]').length;
    const noResultsMsg = document.querySelector('.no-results');
    
    if (visibleRows === 0) {
        if (!noResultsMsg) {
            const tableBody = document.querySelector('#logs-table tbody');
            if (tableBody) {
                const noResults = document.createElement('tr');
                noResults.className = 'no-results';
                noResults.innerHTML = '<td colspan="6" style="text-align: center; padding: 2rem;">No logs found matching your filters.</td>';
                tableBody.appendChild(noResults);
            }
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
    
    // Notification about filter application
    addNotificationStyles();
    showNotification('Filters applied to log data.', 'info');
}

/**
 * Set up export buttons for logs
 */
function setupExportButtons() {
    const exportCsv = document.getElementById('export-csv');
    const exportPdf = document.getElementById('export-pdf');
    const exportPrint = document.getElementById('export-print');
    
    if (exportCsv) {
        exportCsv.addEventListener('click', function() {
            // In a real app, this would generate and download a CSV file
            addNotificationStyles();
            showNotification('Logs exported to CSV file.', 'success');
        });
    }
    
    if (exportPdf) {
        exportPdf.addEventListener('click', function() {
            // In a real app, this would generate and download a PDF file
            addNotificationStyles();
            showNotification('Logs exported to PDF file.', 'success');
        });
    }
    
    if (exportPrint) {
        exportPrint.addEventListener('click', function() {
            // In a real app, this would open a print dialog
            addNotificationStyles();
            showNotification('Print dialog opened.', 'info');
        });
    }
}

/**
 * Set up buttons to view log details
 */
function setupLogDetailButtons() {
    const detailButtons = document.querySelectorAll('#logs-table .btn-small');
    const modal = document.getElementById('log-detail-modal');
    const closeModal = modal?.querySelector('.close-modal');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (modal) {
                // Update modal content based on the log row
                const row = this.closest('tr');
                const timestamp = row.querySelector('td:nth-child(1)').textContent;
                const eventType = row.querySelector('td:nth-child(2) .event-type').textContent;
                const description = row.querySelector('td:nth-child(3)').textContent;
                const source = row.querySelector('td:nth-child(4)').textContent;
                const status = row.querySelector('td:nth-child(5) .status').textContent;
                
                // Generate a unique event ID
                const eventId = 'EVENT-' + timestamp.replace(/[^0-9]/g, '');
                
                // Update metadata in modal
                const metadataValues = modal.querySelectorAll('.metadata-value');
                if (metadataValues.length >= 5) {
                    metadataValues[0].textContent = eventId;
                    metadataValues[1].textContent = timestamp;
                    
                    const eventTypeSpan = metadataValues[2].querySelector('.event-type');
                    if (eventTypeSpan) {
                        eventTypeSpan.className = `event-type ${eventType.toLowerCase()}`;
                        eventTypeSpan.textContent = eventType;
                    }
                    
                    metadataValues[3].textContent = source;
                    
                    const statusSpan = metadataValues[4].querySelector('.status');
                    if (statusSpan) {
                        statusSpan.className = `status ${status.toLowerCase() === 'successful' ? 'success' : 'error'}`;
                        statusSpan.textContent = status;
                    }
                }
                
                // Update description
                const descriptionElement = modal.querySelector('.log-description p');
                if (descriptionElement) {
                    descriptionElement.textContent = description;
                }
                
                // Update related events based on event type
                const relatedList = modal.querySelector('.log-related ul');
                if (relatedList) {
                    relatedList.innerHTML = '';
                    
                    if (eventType.toLowerCase() === 'detection') {
                        relatedList.innerHTML += `<li><a href="#">SMS Alert Sent (${eventId.replace('DETECTION', 'ALERT')}-SMS)</a></li>`;
                        relatedList.innerHTML += `<li><a href="#">Voice Alert Triggered (${eventId.replace('DETECTION', 'ALERT')}-VOICE)</a></li>`;
                    } else if (eventType.toLowerCase() === 'alert') {
                        relatedList.innerHTML += `<li><a href="#">Original Detection (${eventId.replace('ALERT', 'DETECTION')})</a></li>`;
                    }
                }
                
                // Update technical details
                const technicalPre = modal.querySelector('.log-technical pre');
                if (technicalPre) {
                    // Create a sample JSON object based on the event type
                    let jsonObj = {
                        event_id: eventId,
                        timestamp: new Date().toISOString(),
                        event_type: eventType.toLowerCase(),
                    };
                    
                    if (eventType.toLowerCase() === 'detection') {
                        jsonObj = {
                            ...jsonObj,
                            criminal_id: description.includes('(') ? description.split('(')[1].replace(')', '') : 'UNKNOWN',
                            confidence: (85 + Math.floor(Math.random() * 15)) / 100,
                            camera_id: source.includes('Camera') ? `IP-CAM-00${source.match(/\d+/)[0]}` : 'WEBCAM-001',
                            frame_id: Math.floor(Math.random() * 50000),
                            processing_time_ms: Math.floor(Math.random() * 200) + 100,
                            face_coordinates: {
                                x: Math.floor(Math.random() * 500) + 200,
                                y: Math.floor(Math.random() * 300) + 100,
                                width: Math.floor(Math.random() * 100) + 80,
                                height: Math.floor(Math.random() * 100) + 100
                            }
                        };
                    } else if (eventType.toLowerCase() === 'alert') {
                        jsonObj = {
                            ...jsonObj,
                            alert_type: description.includes('SMS') ? 'sms' : description.includes('Voice') ? 'voice' : 'email',
                            recipient: '+1*****7890',
                            message_id: generateRandomId('MSG-', 8),
                            delivery_status: status.toLowerCase() === 'successful' ? 'delivered' : 'failed',
                            delivery_time: new Date().toISOString()
                        };
                    } else if (eventType.toLowerCase() === 'system') {
                        jsonObj = {
                            ...jsonObj,
                            system_component: description.includes('backup') ? 'database' : description.includes('Camera') ? 'camera' : 'core',
                            operation: description.toLowerCase(),
                            status: status.toLowerCase(),
                            duration_ms: Math.floor(Math.random() * 1000) + 500
                        };
                    } else if (eventType.toLowerCase() === 'error') {
                        jsonObj = {
                            ...jsonObj,
                            error_code: 'ERR-' + Math.floor(Math.random() * 1000),
                            component: source,
                            severity: 'high',
                            error_message: description,
                            recovery_action: description.includes('lost') ? 'automatic-retry' : 'manual-intervention'
                        };
                    }
                    
                    technicalPre.textContent = JSON.stringify(jsonObj, null, 2);
                }
                
                modal.style.display = 'block';
            }
        });
    });
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}