/**
 * GitHub Configuration Manager
 * 
 * Central configuration for all GitHub-related functionality across the portfolio.
 * This file must be loaded BEFORE any other GitHub integration scripts.
 */

// Create a namespace for GitHub configuration
window.GitHubConfig = (function() {    // Private GitHub credentials
    const _username = 'imnexerio';
    
    // Try to get token from environment variables for local development
    // 1. Check window.env (from .env file loader for local dev)
    // 2. Empty string for production (should use PAT_GITHUB in GitHub Actions)
    const _token = (window.env && window.env.PAT_GITHUB) || '';
    
    // Get Formspree ID from environment variables
    const _formspreeId = (window.env && window.env.FORMSPREE_ID) || '';
    
    // Configuration options
    const _config = {
        maxLanguages: 6,              // Maximum number of languages to display
        minLanguagePercentage: 1,     // Minimum percentage to include a language
        perPage: 100,                 // Number of repos to fetch per page
        sortBy: 'updated'             // How to sort repositories
    };
    
    // Public API
    return {
        // Get GitHub username
        getUsername: function() {
            return _username;
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
