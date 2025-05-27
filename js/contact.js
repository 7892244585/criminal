// Contact Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set up form validation and submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission();
        });
    }
    
    // Set up FAQ accordions
    initFaqAccordions();
});

/**
 * Handle contact form submission
 */
function handleContactFormSubmission() {
    // Get form values
    const name = document.getElementById('name').value;
    const organization = document.getElementById('organization').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const privacyConsent = document.getElementById('privacy').checked;
    
    // Validate required fields
    if (!name || !email || !subject || !message || !privacyConsent) {
        addNotificationStyles();
        showNotification('Please fill in all required fields and accept the privacy policy.', 'error');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        addNotificationStyles();
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // In a real application, this would send the form data to a server
    // For demo purposes, we'll simulate a successful submission
    
    // Disable submit button and show loading state
    const submitButton = document.querySelector('.form-actions button');
    if (submitButton) {
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        
        setTimeout(() => {
            // Show success message
            addNotificationStyles();
            showNotification('Your message has been sent successfully. We\'ll get back to you soon.', 'success');
            
            // Reset form
            document.getElementById('contact-form').reset();
            
            // Restore button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 1500);
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @return {boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggleIcon = item.querySelector('.toggle-icon');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                // Toggle active class on item
                item.classList.toggle('active');
                
                // Toggle icon text
                if (toggleIcon) {
                    toggleIcon.textContent = item.classList.contains('active') ? '−' : '+';
                }
                
                // Set max-height based on active state
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });
    
    // Open the first FAQ item by default
    if (faqItems.length > 0) {
        const firstItem = faqItems[0];
        const firstAnswer = firstItem.querySelector('.faq-answer');
        const firstToggleIcon = firstItem.querySelector('.toggle-icon');
        
        firstItem.classList.add('active');
        if (firstAnswer) {
            firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
        }
        if (firstToggleIcon) {
            firstToggleIcon.textContent = '−';
        }
    }
}

// Emergency contact button effect
document.addEventListener('DOMContentLoaded', function() {
    const emergencyButton = document.querySelector('.btn-emergency');
    
    if (emergencyButton) {
        emergencyButton.addEventListener('mouseover', function() {
            this.style.animation = 'pulse 1s infinite';
        });
        
        emergencyButton.addEventListener('mouseout', function() {
            this.style.animation = 'none';
        });
        
        // Add pulse animation if not already in stylesheet
        if (!document.getElementById('emergency-button-style')) {
            const style = document.createElement('style');
            style.id = 'emergency-button-style';
            style.innerHTML = `
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
});