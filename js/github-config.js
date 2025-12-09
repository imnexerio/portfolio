/**
 * GitHub Configuration Manager
 * 
 * Central configuration for all GitHub-related functionality across the portfolio.
 * This file must be loaded BEFORE any other GitHub integration scripts.
 */

// Create a namespace for GitHub configuration
window.GitHubConfig = (function() {    // Private GitHub credentials
    const _username = 'imnexerio';
    
    // Allow dynamic username from URL parameters (set to false for generated sites)
    const _allowDynamic = true;
    
    // Try to get token from environment variables for local development
    // 1. Check window.env (from .env file loader for local dev)
    // 2. Empty string for production (should use PAT_GITHUB in GitHub Actions)
    const _token = (window.env && window.env.PAT_GITHUB) || '';
      // Get Formspree ID from environment variables (local development) or from HTML data attribute (production)
    let _formspreeId = (window.env && window.env.FORMSPREE_ID) || '';
    
    // Attempt to get the Formspree ID from the form's data attribute when the page loads
    // This is for the deployed version where environment variables might not be available
    document.addEventListener('DOMContentLoaded', function() {
        if (!_formspreeId) {
            const contactForm = document.getElementById('contactForm');
            if (contactForm && contactForm.dataset.formspreeId) {
                _formspreeId = contactForm.dataset.formspreeId;
            }
        }
    });
    
    // Configuration options
    const _config = {
        maxLanguages: 6,              // Maximum number of languages to display
        minLanguagePercentage: 1,     // Minimum percentage to include a language
        perPage: 100,                 // Number of repos to fetch per page
        sortBy: 'updated'             // How to sort repositories
    };
    
    // Helper function to get username from URL
    function getUsernameFromURL() {
        // Priority 1: Check hash params (cleaner URLs)
        const hash = window.location.hash.slice(1); // Remove #
        if (hash) {
            // Support both formats:
            // #octocat (clean format - preferred)
            // #user=octocat (explicit format)
            const hashMatch = hash.match(/^(?:user=)?([^&]+)/);
            if (hashMatch) {
                const username = hashMatch[1].trim();
                if (username) return username;
            }
        }
        
        // Priority 2: Fall back to query params (?user=username)
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('user');
        if (searchParam) return searchParam.trim();
        
        return null;
    }
    
    // Validate username format (only alphanumeric and hyphens)
    function validateUsername(username) {
        if (!username || typeof username !== 'string') return false;
        // GitHub usernames: alphanumeric and hyphens, max 39 chars
        return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username);
    }
    
    // Public API
    return {
        // Get GitHub username (with dynamic support)
        getUsername: function() {
            // If dynamic mode is allowed, check URL first
            if (_allowDynamic) {
                const urlUsername = getUsernameFromURL();
                if (urlUsername) {
                    // Validate the username from URL
                    if (validateUsername(urlUsername)) {
                        return urlUsername;
                    } else {
                        console.warn('Invalid username format from URL:', urlUsername);
                        // Fall back to default
                        return _username;
                    }
                }
            }
            // Return default username
            return _username;
        },
        
        // Get the default/configured username (ignoring URL)
        getDefaultUsername: function() {
            return _username;
        },
        
        // Check if currently viewing a guest profile
        isGuestProfile: function() {
            if (!_allowDynamic) return false;
            const urlUsername = getUsernameFromURL();
            return urlUsername && validateUsername(urlUsername) && urlUsername !== _username;
        },
        
        // Check if dynamic mode is enabled
        isDynamicMode: function() {
            return _allowDynamic;
        },
        
        // Validate username format
        validateUsername: function(username) {
            return validateUsername(username);
        },
        
        // Get GitHub token
        getToken: function() {
            return _token;
        },
        
        // Get Formspree ID
        getFormspreeId: function() {
            return _formspreeId;
        },
        
        // Get config settings
        getConfig: function(key) {
            return key ? _config[key] : _config;
        },
          // Get authorization headers for GitHub API requests
        getAuthHeaders: function() {
            const headers = {
                'Accept': 'application/vnd.github.v3+json'
            };
            if (_token && _token.trim() !== '') {
                headers['Authorization'] = `Bearer ${_token}`;
            }
            return headers;
        },
        
        // Build GitHub API URL
        buildApiUrl: function(endpoint, params = {}) {
            const baseUrl = `https://api.github.com/${endpoint}`;
            const queryParams = new URLSearchParams(params).toString();
            return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
        },
        
        // Get user repositories URL with parameters
        getUserReposUrl: function() {
            return this.buildApiUrl(`users/${_username}/repos`, {
                per_page: _config.perPage,
                sort: _config.sortBy
            });
        },
          // Check if token is valid
        validateToken: function(token = _token) {
            if (!token || token.trim() === '') {
                console.log('No token provided - using GitHub API with rate limitations');
                return { valid: false, message: 'No token provided - using public API access' };
            }
            
            // Check if token is a fine-grained token (starts with github_pat_)
            if (token.startsWith('github_pat_')) {
                // These tokens have a specific format we can check
                if (!/^github_pat_[A-Za-z0-9_]{22}_[A-Za-z0-9]{59}$/.test(token)) {
                    return { valid: false, message: 'Invalid fine-grained token format' };
                }
                return { valid: true, message: 'Fine-grained token format is valid' };
            }
            
            // Classic tokens are harder to validate by format
            // At minimum it should be of reasonable length
            if (token.length < 30) {
                return { valid: false, message: 'Token appears too short to be valid' };
            }
            
            return { valid: true, message: 'Token format appears valid' };
        }
    };
})();

// Log that the config has been initialized
console.log('GitHub Config: Initialized successfully');
if (!window.GitHubConfig.getToken()) {
    console.log('GitHub Config: No authentication token provided. Operating with GitHub API rate limits for public access.');
}
