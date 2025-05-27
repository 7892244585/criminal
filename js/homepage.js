// Homepage JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add animation to stats numbers
    animateStats();
    
    // Handle video play button
    setupPlayButton();
    
    // Update stats periodically to simulate live updates
    setInterval(updateStats, 30000); // Every 30 seconds
});

/**
 * Animate the statistics with a counting effect
 */
function animateStats() {
    const stats = [
        {id: 'detection-count', target: 984, duration: 2000},
        {id: 'database-count', target: 1245, duration: 2500},
        {id: 'accuracy-rate', target: 99.7, duration: 2800, isPercentage: true},
        {id: 'response-time', target: 0.8, duration: 1500, isTime: true}
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (!element) return;
        
        const startValue = 0;
        const increment = stat.target / (stat.duration / 16);
        let currentValue = startValue;
        
        // If it's a time value, start from a higher number to count down
        if (stat.isTime) {
            currentValue = stat.target * 3;
            const updateElement = () => {
                if (currentValue > stat.target) {
                    currentValue -= increment;
                    if (currentValue < stat.target) currentValue = stat.target;
                    element.textContent = currentValue.toFixed(1) + 's';
                    requestAnimationFrame(updateElement);
                }
            };
            updateElement();
        } else {
            // For regular counts and percentages, count up
            const updateElement = () => {
                if (currentValue < stat.target) {
                    currentValue += increment;
                    if (currentValue > stat.target) currentValue = stat.target;
                    
                    if (stat.isPercentage) {
                        element.textContent = currentValue.toFixed(1) + '%';
                    } else {
                        element.textContent = Math.floor(currentValue).toLocaleString();
                    }
                    
                    requestAnimationFrame(updateElement);
                }
            };
            updateElement();
        }
    });
}

/**
 * Setup the video play button functionality
 */
function setupPlayButton() {
    const playButton = document.querySelector('.play-button');
    if (!playButton) return;
    
    playButton.addEventListener('click', function() {
        // In a real implementation, this would play a video
        // For this demo, we'll just show a notification
        addNotificationStyles();
        showNotification('Video playback would start in a real implementation.', 'info');
        
        // Add a video element dynamically (simulating behavior)
        const videoPlaceholder = document.querySelector('.video-placeholder');
        if (videoPlaceholder) {
            const img = videoPlaceholder.querySelector('img');
            img.style.opacity = '0.7';
            
            // Change button appearance to indicate "playing"
            playButton.innerHTML = '❚❚';
            playButton.style.opacity = '0.7';
        }
    });
}

/**
 * Periodically update statistics to simulate live data
 */
function updateStats() {
    // Small random changes to simulate live updates
    const detectionsElement = document.getElementById('detection-count');
    const databaseElement = document.getElementById('database-count');
    
    if (detectionsElement) {
        let detections = parseInt(detectionsElement.textContent.replace(/,/g, ''));
        detections += Math.floor(Math.random() * 3); // Add 0-2 detections
        detectionsElement.textContent = detections.toLocaleString();
    }
    
    if (databaseElement) {
        let dbCount = parseInt(databaseElement.textContent.replace(/,/g, ''));
        // Occasionally add a new criminal to the database
        if (Math.random() > 0.7) {
            dbCount += 1;
            databaseElement.textContent = dbCount.toLocaleString();
            
            // Add subtle animation
            databaseElement.classList.add('highlight');
            setTimeout(() => {
                databaseElement.classList.remove('highlight');
            }, 1000);
        }
    }
}

// Add a highlighting effect style
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes highlightStat {
            0% { color: var(--primary); }
            50% { color: var(--accent); }
            100% { color: var(--primary); }
        }
        .highlight {
            animation: highlightStat 1s ease-in-out;
        }
    `;
    document.head.appendChild(style);
});