// Live Detection JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the detection interface
    initDetectionInterface();
    
    // Set up event listeners for buttons and controls
    setupEventListeners();
});

/**
 * Initialize the detection interface
 */
function initDetectionInterface() {
    // Set initial sensitivity value
    const sensitivityInput = document.getElementById('detection-sensitivity');
    const sensitivityValue = document.getElementById('sensitivity-value');
    
    if (sensitivityInput && sensitivityValue) {
        sensitivityValue.textContent = sensitivityInput.value;
    }
    
    // Setup camera source selection
    const cameraSource = document.getElementById('camera-source');
    const uploadContainer = document.getElementById('upload-container');
    
    if (cameraSource && uploadContainer) {
        cameraSource.addEventListener('change', function() {
            if (this.value === 'upload') {
                uploadContainer.style.display = 'block';
            } else {
                uploadContainer.style.display = 'none';
            }
        });
    }
}

/**
 * Set up event listeners for the detection interface
 */
function setupEventListeners() {
    // Detection sensitivity slider
    const sensitivityInput = document.getElementById('detection-sensitivity');
    const sensitivityValue = document.getElementById('sensitivity-value');
    
    if (sensitivityInput && sensitivityValue) {
        sensitivityInput.addEventListener('input', function() {
            sensitivityValue.textContent = this.value;
        });
    }
    
    // Start/stop detection buttons
    const startButton = document.getElementById('start-detection');
    const stopButton = document.getElementById('stop-detection');
    
    if (startButton && stopButton) {
        startButton.addEventListener('click', startDetection);
        stopButton.addEventListener('click', stopDetection);
    }
    
    // Snapshot button
    const snapshotButton = document.getElementById('snapshot-btn');
    if (snapshotButton) {
        snapshotButton.addEventListener('click', takeSnapshot);
    }
    
    // Toggle detection overlay
    const toggleDetectionView = document.getElementById('toggle-detection-view');
    if (toggleDetectionView) {
        toggleDetectionView.addEventListener('click', toggleDetectionOverlay);
    }
    
    // View details buttons in the alerts table
    document.querySelectorAll('.alerts-table button').forEach(button => {
        button.addEventListener('click', function() {
            openAlertModal();
        });
    });
    
    // Close alert modal
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            const modal = document.getElementById('alert-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Close modal when clicking outside of modal content
    const modal = document.getElementById('alert-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                this.style.display = 'none';
            }
        });
    }
    
    // Video file upload handler
    const videoUpload = document.getElementById('video-upload');
    if (videoUpload) {
        videoUpload.addEventListener('change', handleVideoUpload);
    }
}

// Keep track of detection state
let isDetectionRunning = false;
let detectionInterval = null;
let detectedCriminals = [];

/**
 * Start the detection process
 */
function startDetection() {
    const startButton = document.getElementById('start-detection');
    const stopButton = document.getElementById('stop-detection');
    const snapshotButton = document.getElementById('snapshot-btn');
    const statusIndicator = document.getElementById('status-indicator');
    const videoFeed = document.getElementById('video-feed');
    const placeholder = document.getElementById('video-placeholder');
    const cameraSource = document.getElementById('camera-source');
    
    if (!startButton || !stopButton || !statusIndicator) return;
    
    // Update UI state
    startButton.disabled = true;
    stopButton.disabled = false;
    if (snapshotButton) snapshotButton.disabled = false;
    
    // Update status indicator
    statusIndicator.className = 'status-indicator live';
    statusIndicator.innerHTML = '<span class="status-dot"></span><span class="status-text">Live</span>';
    
    // Show video feed, hide placeholder
    if (videoFeed && placeholder) {
        videoFeed.style.display = 'block';
        placeholder.style.display = 'none';
        
        // In a real application, we would initialize the webcam or camera stream here
        // For demo purposes, we'll use a video element with a placeholder or video file
        if (cameraSource && cameraSource.value === 'upload') {
            // Video file was uploaded - do nothing, it's already set up
        } else {
            // Simulate camera feed with a solid color or test pattern
            const canvas = document.getElementById('detection-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                canvas.width = videoFeed.offsetWidth;
                canvas.height = videoFeed.offsetHeight;
                
                // Draw a simple test pattern
                ctx.fillStyle = '#1e3a8a';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                for (let i = 0; i < canvas.width; i += 20) {
                    ctx.fillRect(i, 0, 1, canvas.height);
                }
                for (let i = 0; i < canvas.height; i += 20) {
                    ctx.fillRect(0, i, canvas.width, 1);
                }
                
                // Add text
                ctx.font = '20px Arial';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText('SENTINEL CAMERA FEED', canvas.width/2, canvas.height/2);
                
                // Add a simulated recording indicator
                setInterval(() => {
                    const time = new Date();
                    const timeString = time.toLocaleTimeString();
                    
                    // Clear the area
                    ctx.fillStyle = '#1e3a8a';
                    ctx.fillRect(10, 10, 200, 30);
                    
                    // Draw the time
                    ctx.fillStyle = 'white';
                    ctx.textAlign = 'left';
                    ctx.font = '16px monospace';
                    ctx.fillText(timeString, 20, 30);
                    
                    // Draw a recording dot
                    ctx.beginPath();
                    ctx.arc(180, 25, 8, 0, Math.PI * 2);
                    ctx.fillStyle = 'red';
                    ctx.fill();
                }, 1000);
            }
        }
    }
    
    // Clear any previous detections
    detectedCriminals = [];
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML = '<div class="no-detection-message"><p>Scanning for matches...</p></div>';
    }
    
    // Set detection state
    isDetectionRunning = true;
    
    // Simulate random detections
    detectionInterval = setInterval(simulateDetection, 10000); // Every 10 seconds
    
    // Show notification
    addNotificationStyles();
    showNotification('Detection started. Monitoring for criminal matches.', 'info');
}

/**
 * Stop the detection process
 */
function stopDetection() {
    const startButton = document.getElementById('start-detection');
    const stopButton = document.getElementById('stop-detection');
    const snapshotButton = document.getElementById('snapshot-btn');
    const statusIndicator = document.getElementById('status-indicator');
    
    if (!startButton || !stopButton || !statusIndicator) return;
    
    // Update UI state
    startButton.disabled = false;
    stopButton.disabled = true;
    if (snapshotButton) snapshotButton.disabled = true;
    
    // Update status indicator
    statusIndicator.className = 'status-indicator offline';
    statusIndicator.innerHTML = '<span class="status-dot"></span><span class="status-text">Offline</span>';
    
    // Clear detection interval
    clearInterval(detectionInterval);
    
    // Set detection state
    isDetectionRunning = false;
    
    // Show notification
    addNotificationStyles();
    showNotification('Detection stopped.', 'info');
}

/**
 * Simulate a criminal detection
 */
function simulateDetection() {
    if (!isDetectionRunning) return;
    
    // Get random criminal data
    const criminals = JSON.parse(localStorage.getItem('criminals')) || sampleCriminals;
    
    // 70% chance of no detection
    if (Math.random() < 0.7 && detectedCriminals.length > 0) return;
    
    // Select a random criminal
    const randomIndex = Math.floor(Math.random() * criminals.length);
    const criminal = criminals[randomIndex];
    
    // Make sure we haven't already detected this criminal
    if (detectedCriminals.some(c => c.id === criminal.id)) return;
    
    // Add to detected criminals
    const matchConfidence = (85 + Math.floor(Math.random() * 15)) / 100;
    const detectedAt = new Date();
    
    detectedCriminals.push({
        ...criminal,
        matchConfidence,
        detectedAt
    });
    
    // Update the results container
    updateDetectionResults();
    
    // Simulate drawing a detection frame
    drawDetectionFrame();
    
    // If it's a high danger level, show the alert modal
    if (criminal.dangerLevel === 'high' || criminal.dangerLevel === 'extreme') {
        openAlertModal(criminal, matchConfidence);
    }
    
    // Add to the alerts table
    addAlertToTable(criminal, matchConfidence, detectedAt);
    
    // Play detection sound (if available in the browser)
    playDetectionSound();
}

/**
 * Update the detection results container
 */
function updateDetectionResults() {
    const resultsContainer = document.getElementById('results-container');
    if (!resultsContainer) return;
    
    if (detectedCriminals.length === 0) {
        resultsContainer.innerHTML = '<div class="no-detection-message"><p>No criminals detected yet.</p></div>';
        return;
    }
    
    // Clear the container
    resultsContainer.innerHTML = '';
    
    // Sort by detected time, newest first
    detectedCriminals.sort((a, b) => b.detectedAt - a.detectedAt);
    
    // Add each detected criminal
    detectedCriminals.forEach(criminal => {
        const detectionTime = formatDateTime(criminal.detectedAt);
        const matchPercent = Math.round(criminal.matchConfidence * 100);
        
        const criminalElement = document.createElement('div');
        criminalElement.className = 'detected-criminal';
        criminalElement.innerHTML = `
            <div class="detected-criminal-header">
                <div class="detected-criminal-name">${criminal.name}</div>
                <div class="detected-criminal-match">${matchPercent}% Match</div>
            </div>
            <div class="detected-criminal-content">
                <div class="detected-criminal-img">
                    <img src="${criminal.image}" alt="${criminal.name}">
                </div>
                <div class="detected-criminal-info">
                    <div class="detected-criminal-details">
                        <div class="detected-criminal-detail">
                            <span class="detected-criminal-detail-label">ID:</span>
                            <span>${criminal.id}</span>
                        </div>
                        <div class="detected-criminal-detail">
                            <span class="detected-criminal-detail-label">Crime:</span>
                            <span>${criminal.crime.charAt(0).toUpperCase() + criminal.crime.slice(1)}</span>
                        </div>
                        <div class="detected-criminal-detail">
                            <span class="detected-criminal-detail-label">Danger:</span>
                            <span class="danger-badge ${criminal.dangerLevel}">${criminal.dangerLevel}</span>
                        </div>
                        <div class="detected-criminal-detail">
                            <span class="detected-criminal-detail-label">Detected:</span>
                            <span>${detectionTime}</span>
                        </div>
                    </div>
                    <div class="detected-criminal-actions">
                        <button class="btn-small view-alert" data-id="${criminal.id}">View Alert</button>
                        <button class="btn-small btn-primary send-alert" data-id="${criminal.id}">Resend Alert</button>
                    </div>
                </div>
            </div>
        `;
        
        resultsContainer.appendChild(criminalElement);
    });
    
    // Add event listeners to the new buttons
    document.querySelectorAll('.view-alert').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const criminal = detectedCriminals.find(c => c.id === id);
            if (criminal) {
                openAlertModal(criminal, criminal.matchConfidence);
            }
        });
    });
    
    document.querySelectorAll('.send-alert').forEach(btn => {
        btn.addEventListener('click', function() {
            addNotificationStyles();
            showNotification('Alert sent to authorities.', 'success');
        });
    });
}

/**
 * Draw a detection frame around a face
 */
function drawDetectionFrame() {
    const framesContainer = document.getElementById('detection-frames');
    if (!framesContainer) return;
    
    // Clear existing frames
    framesContainer.innerHTML = '';
    
    // Create a new detection frame
    const frame = document.createElement('div');
    frame.className = 'detection-frame';
    
    // Random position within the video container
    const left = 20 + Math.floor(Math.random() * 60); // 20% to 80% from left
    const top = 20 + Math.floor(Math.random() * 60);  // 20% to 80% from top
    const width = 80 + Math.floor(Math.random() * 100); // 80px to 180px wide
    const height = width * 1.2; // Approximate face ratio
    
    // Set position and size
    frame.style.left = `${left}%`;
    frame.style.top = `${top}%`;
    frame.style.width = `${width}px`;
    frame.style.height = `${height}px`;
    
    // Add a label showing match percentage
    const latestCriminal = detectedCriminals[detectedCriminals.length - 1];
    if (latestCriminal) {
        const matchPercent = Math.round(latestCriminal.matchConfidence * 100);
        
        const label = document.createElement('div');
        label.className = 'detection-label';
        label.textContent = `${matchPercent}% Match: ${latestCriminal.name}`;
        
        frame.appendChild(label);
    }
    
    framesContainer.appendChild(frame);
    
    // Remove the frame after 5 seconds
    setTimeout(() => {
        frame.remove();
    }, 5000);
}

/**
 * Add an alert to the recent alerts table
 * @param {Object} criminal - Criminal object
 * @param {number} matchConfidence - Match confidence (0-1)
 * @param {Date} detectedAt - Detection timestamp
 */
function addAlertToTable(criminal, matchConfidence, detectedAt) {
    const tableBody = document.getElementById('alerts-table-body');
    if (!tableBody) return;
    
    // Create alert types based on checkboxes
    const smsChecked = document.getElementById('sms-alert').checked;
    const voiceChecked = document.getElementById('voice-alert').checked;
    const emailChecked = document.getElementById('email-alert').checked;
    
    let alertTypes = [];
    if (smsChecked) alertTypes.push('SMS');
    if (voiceChecked) alertTypes.push('Voice');
    if (emailChecked) alertTypes.push('Email');
    
    // If nothing is checked, default to SMS
    if (alertTypes.length === 0) alertTypes.push('SMS');
    
    const alertTypeText = alertTypes.join(', ');
    
    // Get camera source name
    const cameraSource = document.getElementById('camera-source');
    let cameraName = 'Unknown';
    if (cameraSource) {
        const selectedOption = cameraSource.options[cameraSource.selectedIndex];
        cameraName = selectedOption.text;
    }
    
    // Create a new row and insert at the top
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${formatDateTime(detectedAt)}</td>
        <td>${criminal.id}</td>
        <td>${criminal.name}</td>
        <td>${cameraName}</td>
        <td>${alertTypeText}</td>
        <td><button class="btn-small">View Details</button></td>
    `;
    
    // Add at the beginning
    if (tableBody.firstChild) {
        tableBody.insertBefore(newRow, tableBody.firstChild);
    } else {
        tableBody.appendChild(newRow);
    }
    
    // Add event listener to the view details button
    const viewButton = newRow.querySelector('button');
    viewButton.addEventListener('click', function() {
        openAlertModal(criminal, matchConfidence);
    });
    
    // If we have too many rows, remove the last one
    const maxRows = 5;
    while (tableBody.children.length > maxRows) {
        tableBody.removeChild(tableBody.lastChild);
    }
}

/**
 * Open the alert modal with criminal details
 * @param {Object} criminal - Criminal object
 * @param {number} matchConfidence - Match confidence (0-1)
 */
function openAlertModal(criminal, matchConfidence) {
    const modal = document.getElementById('alert-modal');
    if (!modal) return;
    
    // If no criminal provided, use the first detected one
    if (!criminal && detectedCriminals.length > 0) {
        criminal = detectedCriminals[0];
        matchConfidence = criminal.matchConfidence;
    } else if (!criminal) {
        return;
    }
    
    // Get alert status elements
    const smsChecked = document.getElementById('sms-alert')?.checked;
    const voiceChecked = document.getElementById('voice-alert')?.checked;
    const emailChecked = document.getElementById('email-alert')?.checked;
    
    // Update modal content
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        const dangerBadge = modalContent.querySelector('.danger-badge');
        if (dangerBadge) {
            dangerBadge.className = `danger-badge ${criminal.dangerLevel}`;
            dangerBadge.textContent = criminal.dangerLevel.charAt(0).toUpperCase() + criminal.dangerLevel.slice(1) + ' Danger';
        }
        
        // Update images
        const images = modalContent.querySelectorAll('.alert-image img');
        if (images.length >= 2) {
            images[0].src = criminal.image; // Database photo
            images[1].src = criminal.image; // Camera capture (same for demo)
        }
        
        // Update details
        const detailValues = modalContent.querySelectorAll('.detail-value');
        if (detailValues.length >= 6) {
            detailValues[0].textContent = criminal.name;
            detailValues[1].textContent = criminal.id;
            detailValues[2].textContent = criminal.crime.charAt(0).toUpperCase() + criminal.crime.slice(1);
            detailValues[3].textContent = (matchConfidence * 100).toFixed(1) + '%';
            detailValues[4].textContent = formatDateTime(new Date());
            
            // Get camera source name
            const cameraSource = document.getElementById('camera-source');
            let cameraName = 'Unknown';
            if (cameraSource) {
                const selectedOption = cameraSource.options[cameraSource.selectedIndex];
                cameraName = selectedOption.text;
                detailValues[5].textContent = cameraName;
            }
        }
        
        // Update alert status
        const statusValues = modalContent.querySelectorAll('.status-value');
        if (statusValues.length >= 3) {
            const now = formatDateTime(new Date());
            
            if (smsChecked) {
                statusValues[0].className = 'status-value sent';
                statusValues[0].textContent = `Sent at ${now}`;
            } else {
                statusValues[0].className = 'status-value not-sent';
                statusValues[0].textContent = 'Not Configured';
            }
            
            if (voiceChecked) {
                statusValues[1].className = 'status-value sent';
                statusValues[1].textContent = `Sent at ${now}`;
            } else {
                statusValues[1].className = 'status-value not-sent';
                statusValues[1].textContent = 'Not Configured';
            }
            
            if (emailChecked) {
                statusValues[2].className = 'status-value sent';
                statusValues[2].textContent = `Sent at ${now}`;
            } else {
                statusValues[2].className = 'status-value not-sent';
                statusValues[2].textContent = 'Not Configured';
            }
        }
        
        // Get the notes field (full-width detail)
        const notesDetail = modalContent.querySelector('.detail-group.full-width .detail-value');
        if (notesDetail) {
            notesDetail.textContent = criminal.description;
        }
    }
    
    modal.style.display = 'block';
    
    // Play alert sound
    playAlertSound();
}

/**
 * Take a snapshot of the current video feed
 */
function takeSnapshot() {
    if (!isDetectionRunning) return;
    
    const video = document.getElementById('video-feed');
    const canvas = document.getElementById('detection-canvas');
    
    if (!video || !canvas) return;
    
    // In a real implementation, this would capture the current frame
    addNotificationStyles();
    showNotification('Snapshot captured and saved to gallery.', 'success');
}

/**
 * Toggle the detection overlay
 */
function toggleDetectionOverlay() {
    const overlay = document.getElementById('detection-frames');
    if (overlay) {
        overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
    }
}

/**
 * Handle video file upload
 * @param {Event} e - Change event from file input
 */
function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const video = document.getElementById('video-feed');
    if (!video) return;
    
    // Create object URL for the video file
    const url = URL.createObjectURL(file);
    
    // Set as source for video element
    video.src = url;
    
    // Show notification
    addNotificationStyles();
    showNotification('Video file loaded. Ready to start detection.', 'success');
}

/**
 * Play a detection sound
 */
function playDetectionSound() {
    // Create an audio element
    const audio = new Audio();
    audio.src = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    audio.play().catch(e => console.log('Audio play failed:', e));
}

/**
 * Play an alert sound for high-danger criminals
 */
function playAlertSound() {
    // Create an audio element
    const audio = new Audio();
    audio.src = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    audio.play().catch(e => console.log('Audio play failed:', e));
}