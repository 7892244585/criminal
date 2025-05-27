// Admin Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set up form validation
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Password visibility toggle
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            // Toggle password visibility
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Update button text
            this.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    }
    
    // Set up "Remember me" functionality
    const rememberCheckbox = document.getElementById('remember');
    
    if (rememberCheckbox) {
        // Check if username is stored in localStorage
        const savedUsername = localStorage.getItem('sentinel_username');
        const usernameInput = document.getElementById('username');
        
        if (savedUsername && usernameInput) {
            usernameInput.value = savedUsername;
            rememberCheckbox.checked = true;
        }
    }
});

/**
 * Handle the login form submission
 */
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    if (!username || !password) {
        // Display error
        addNotificationStyles();
        showNotification('Please enter both username and password.', 'error');
        return;
    }
    
    // In a real application, this would validate against a server
    // For demo purposes, we'll accept any login with some basic validation
    if (username.length < 3 || password.length < 4) {
        addNotificationStyles();
        showNotification('Invalid username or password. Try again.', 'error');
        return;
    }
    
    // Save username if "Remember me" is checked
    if (rememberMe) {
        localStorage.setItem('sentinel_username', username);
    } else {
        localStorage.removeItem('sentinel_username');
    }
    
    // Simulate login delay
    const loginButton = document.querySelector('.form-actions button');
    if (loginButton) {
        // Disable button and show loading state
        loginButton.disabled = true;
        const originalText = loginButton.textContent;
        loginButton.textContent = 'Logging in...';
        
        setTimeout(() => {
            // Authentication successful
            addNotificationStyles();
            showNotification('Login successful. Redirecting to dashboard...', 'success');
            
            // Simulate redirect
            setTimeout(() => {
                // In a real app, this would redirect to the dashboard
                window.location.href = 'system-logs.html';
            }, 1500);
        }, 1500);
    }
}

/**
 * Handle forgotten password functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordLink = document.querySelector('.forgot-password');
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            
            if (!username) {
                addNotificationStyles();
                showNotification('Please enter your username first.', 'warning');
                return;
            }
            
            // In a real app, this would trigger a password reset email
            addNotificationStyles();
            showNotification('Password reset instructions sent to your email.', 'info');
        });
    }
});