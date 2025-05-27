// Criminal Database JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize database
    initDatabase();
    
    // Set up event listeners
    setupEventListeners();
});

// Sample criminal data for demo
const sampleCriminals = [
    {
        id: 'CR-2025-0042',
        name: 'John Doe',
        age: 34,
        gender: 'male',
        crime: 'robbery',
        description: 'Armed robbery of First National Bank on May 2, 2025. Suspect was armed with a handgun and stole approximately $50,000.',
        lastSeen: 'Downtown area, near Central Station',
        dangerLevel: 'high',
        image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
        id: 'CR-2025-0104',
        name: 'Jane Smith',
        age: 29,
        gender: 'female',
        crime: 'fraud',
        description: 'Identity theft and credit card fraud affecting over 200 victims. Total damages estimated at $1.2 million.',
        lastSeen: 'Shopping district, West Mall',
        dangerLevel: 'medium',
        image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
        id: 'CR-2025-0076',
        name: 'Robert Johnson',
        age: 42,
        gender: 'male',
        crime: 'assault',
        description: 'Multiple counts of aggravated assault. Known to be violent and unpredictable. Has attacked police officers in the past.',
        lastSeen: 'Industrial district, warehouse area',
        dangerLevel: 'extreme',
        image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
        id: 'CR-2025-0118',
        name: 'Emily Chen',
        age: 31,
        gender: 'female',
        crime: 'cybercrime',
        description: 'Sophisticated hacking and data theft from government systems. Highly skilled in cybersecurity circumvention.',
        lastSeen: 'Tech district, coffee shop on 5th avenue',
        dangerLevel: 'medium',
        image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
        id: 'CR-2025-0091',
        name: 'Michael Williams',
        age: 25,
        gender: 'male',
        crime: 'theft',
        description: 'Serial shoplifting and pickpocketing in tourist areas. Known to work with accomplices.',
        lastSeen: 'Tourist district, museum area',
        dangerLevel: 'low',
        image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
        id: 'CR-2025-0133',
        name: 'David Rodriguez',
        age: 38,
        gender: 'male',
        crime: 'robbery',
        description: 'Multiple armed robberies of convenience stores. Uses intimidation tactics and has brandished weapons.',
        lastSeen: 'Residential district, apartment complex on Park Street',
        dangerLevel: 'high',
        image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
];

/**
 * Initialize the database with sample data
 */
function initDatabase() {
    // Check if we have data in localStorage, otherwise use sample data
    let criminals = localStorage.getItem('criminals');
    
    if (!criminals) {
        criminals = sampleCriminals;
        localStorage.setItem('criminals', JSON.stringify(criminals));
    } else {
        criminals = JSON.parse(criminals);
    }
    
    renderCriminals(criminals);
    setupFilters();
}

/**
 * Render criminals to the grid
 * @param {Array} criminals - Array of criminal objects
 */
function renderCriminals(criminals) {
    const grid = document.getElementById('criminal-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (criminals.length === 0) {
        grid.innerHTML = '<div class="no-results">No criminals found matching your criteria.</div>';
        return;
    }
    
    criminals.forEach(criminal => {
        const card = document.createElement('div');
        card.className = 'criminal-card';
        card.innerHTML = `
            <div class="criminal-img">
                <img src="${criminal.image}" alt="${criminal.name}">
                <div class="danger-level ${criminal.dangerLevel}">${criminal.dangerLevel}</div>
            </div>
            <div class="criminal-info">
                <h3 class="criminal-name">${criminal.name}</h3>
                <div class="criminal-id">${criminal.id}</div>
                <div class="criminal-details">
                    <div class="detail-item">
                        <span class="detail-label">Age:</span>
                        <span class="detail-value">${criminal.age}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Gender:</span>
                        <span class="detail-value">${criminal.gender}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Crime:</span>
                        <span class="detail-value">${criminal.crime.charAt(0).toUpperCase() + criminal.crime.slice(1)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Last Seen:</span>
                        <span class="detail-value">${criminal.lastSeen}</span>
                    </div>
                </div>
                <div class="criminal-description">
                    <p>${criminal.description}</p>
                </div>
                <div class="criminal-actions">
                    <button class="btn btn-secondary edit-btn" data-id="${criminal.id}">Edit</button>
                    <button class="btn btn-primary view-btn" data-id="${criminal.id}">View Details</button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            openEditModal(id);
        });
    });
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            viewCriminalDetails(id);
        });
    });
}

/**
 * Set up event listeners for database page
 */
function setupEventListeners() {
    // Add Criminal button
    const addButton = document.getElementById('add-criminal-btn');
    if (addButton) {
        addButton.addEventListener('click', openAddModal);
    }
    
    // Search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
    
    // Cancel button in modal
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Form submission
    const criminalForm = document.getElementById('criminal-form');
    if (criminalForm) {
        criminalForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Image preview
    const imageInput = document.getElementById('criminal-image');
    if (imageInput) {
        imageInput.addEventListener('change', handleImagePreview);
    }
    
    // Close modal
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            const modal = document.getElementById('criminal-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }
}

/**
 * Set up filters for the criminal database
 */
function setupFilters() {
    const crimeFilter = document.getElementById('filter-crime');
    const dangerFilter = document.getElementById('filter-danger');
    const sortBy = document.getElementById('sort-by');
    
    const applyFilters = () => {
        let criminals = JSON.parse(localStorage.getItem('criminals')) || sampleCriminals;
        
        // Apply crime filter
        if (crimeFilter && crimeFilter.value !== 'all') {
            criminals = criminals.filter(criminal => criminal.crime === crimeFilter.value);
        }
        
        // Apply danger filter
        if (dangerFilter && dangerFilter.value !== 'all') {
            criminals = criminals.filter(criminal => criminal.dangerLevel === dangerFilter.value);
        }
        
        // Apply sorting
        if (sortBy) {
            switch (sortBy.value) {
                case 'name':
                    criminals.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'id':
                    criminals.sort((a, b) => a.id.localeCompare(b.id));
                    break;
                case 'danger-desc':
                    const dangerLevels = { 'low': 1, 'medium': 2, 'high': 3, 'extreme': 4 };
                    criminals.sort((a, b) => dangerLevels[b.dangerLevel] - dangerLevels[a.dangerLevel]);
                    break;
                case 'danger-asc':
                    const dangerLevelsAsc = { 'low': 1, 'medium': 2, 'high': 3, 'extreme': 4 };
                    criminals.sort((a, b) => dangerLevelsAsc[a.dangerLevel] - dangerLevelsAsc[b.dangerLevel]);
                    break;
                // Date sorting would require actual dates in the data model
            }
        }
        
        renderCriminals(criminals);
    };
    
    // Add event listeners to filters
    if (crimeFilter) crimeFilter.addEventListener('change', applyFilters);
    if (dangerFilter) dangerFilter.addEventListener('change', applyFilters);
    if (sortBy) sortBy.addEventListener('change', applyFilters);
}

/**
 * Open modal for adding a new criminal
 */
function openAddModal() {
    const modal = document.getElementById('criminal-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('criminal-form');
    
    if (modal && modalTitle && form) {
        modalTitle.textContent = 'Add New Criminal Record';
        form.reset();
        
        // Clear image preview
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview) {
            imagePreview.style.backgroundImage = 'none';
            imagePreview.textContent = 'Image preview will appear here';
        }
        
        // Set form submission mode
        form.setAttribute('data-mode', 'add');
        
        modal.style.display = 'block';
    }
}

/**
 * Open modal for editing a criminal record
 * @param {string} id - Criminal ID to edit
 */
function openEditModal(id) {
    const criminals = JSON.parse(localStorage.getItem('criminals')) || sampleCriminals;
    const criminal = criminals.find(c => c.id === id);
    
    if (!criminal) return;
    
    const modal = document.getElementById('criminal-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('criminal-form');
    
    if (modal && modalTitle && form) {
        modalTitle.textContent = 'Edit Criminal Record';
        
        // Fill form with criminal data
        document.getElementById('criminal-name').value = criminal.name;
        document.getElementById('criminal-id').value = criminal.id;
        document.getElementById('criminal-age').value = criminal.age;
        document.getElementById('criminal-gender').value = criminal.gender;
        document.getElementById('criminal-crime').value = criminal.crime;
        document.getElementById('criminal-description').value = criminal.description;
        document.getElementById('criminal-last-seen').value = criminal.lastSeen;
        document.getElementById('criminal-danger').value = criminal.dangerLevel;
        
        // Display image preview
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview) {
            imagePreview.style.backgroundImage = `url(${criminal.image})`;
            imagePreview.textContent = '';
        }
        
        // Set form submission mode and ID
        form.setAttribute('data-mode', 'edit');
        form.setAttribute('data-id', id);
        
        modal.style.display = 'block';
    }
}

/**
 * Close the criminal modal
 */
function closeModal() {
    const modal = document.getElementById('criminal-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Handle form submission for adding/editing criminals
 * @param {Event} e - Form submission event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const mode = form.getAttribute('data-mode');
    
    // Get form values
    const name = document.getElementById('criminal-name').value;
    const id = document.getElementById('criminal-id').value;
    const age = document.getElementById('criminal-age').value;
    const gender = document.getElementById('criminal-gender').value;
    const crime = document.getElementById('criminal-crime').value;
    const description = document.getElementById('criminal-description').value;
    const lastSeen = document.getElementById('criminal-last-seen').value;
    const dangerLevel = document.getElementById('criminal-danger').value;
    
    // Get image (in a real app, this would upload the image)
    // For demo purposes, we'll use the existing image or a placeholder
    const imagePreview = document.getElementById('image-preview');
    let imageUrl;
    
    if (imagePreview && imagePreview.style.backgroundImage) {
        // Extract URL from background-image style
        imageUrl = imagePreview.style.backgroundImage.replace(/url\(['"](.+)['"]\)/, '$1');
    } else {
        // Use a placeholder image based on gender
        if (gender === 'female') {
            imageUrl = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600';
        } else {
            imageUrl = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600';
        }
    }
    
    const criminalData = {
        id,
        name,
        age: parseInt(age) || '',
        gender,
        crime,
        description,
        lastSeen,
        dangerLevel,
        image: imageUrl
    };
    
    // Get existing data
    let criminals = JSON.parse(localStorage.getItem('criminals')) || sampleCriminals;
    
    if (mode === 'add') {
        // Add new criminal
        criminals.push(criminalData);
        addNotificationStyles();
        showNotification('Criminal record added successfully.', 'success');
    } else if (mode === 'edit') {
        // Update existing criminal
        const index = criminals.findIndex(c => c.id === id);
        if (index !== -1) {
            criminals[index] = criminalData;
            addNotificationStyles();
            showNotification('Criminal record updated successfully.', 'success');
        }
    }
    
    // Save to localStorage
    localStorage.setItem('criminals', JSON.stringify(criminals));
    
    // Refresh the display
    renderCriminals(criminals);
    
    // Close the modal
    closeModal();
}

/**
 * Handle image file preview
 * @param {Event} e - Change event from file input
 */
function handleImagePreview(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('image-preview');
    
    if (file && preview) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            preview.style.backgroundImage = `url(${event.target.result})`;
            preview.textContent = '';
        };
        
        reader.readAsDataURL(file);
    }
}

/**
 * Perform search on criminal database
 * @param {string} query - Search query
 */
function performSearch(query) {
    if (!query) {
        // If empty query, show all criminals
        const criminals = JSON.parse(localStorage.getItem('criminals')) || sampleCriminals;
        renderCriminals(criminals);
        return;
    }
    
    query = query.toLowerCase();
    const criminals = JSON.parse(localStorage.getItem('criminals')) || sampleCriminals;
    
    const results = criminals.filter(criminal => {
        return (
            criminal.name.toLowerCase().includes(query) || 
            criminal.id.toLowerCase().includes(query) || 
            criminal.crime.toLowerCase().includes(query) ||
            criminal.description.toLowerCase().includes(query)
        );
    });
    
    renderCriminals(results);
}

/**
 * View detailed information about a criminal
 * @param {string} id - Criminal ID to view
 */
function viewCriminalDetails(id) {
    const criminals = JSON.parse(localStorage.getItem('criminals')) || sampleCriminals;
    const criminal = criminals.find(c => c.id === id);
    
    if (!criminal) return;
    
    // In a real application, this would open a detailed view
    // For now, just display an alert with the information
    addNotificationStyles();
    showNotification(`Viewing details for: ${criminal.name}`, 'info');
    
    // Simulate opening a detailed view modal
    // This would be implemented in a real application
    console.log('Viewing details for criminal:', criminal);
}