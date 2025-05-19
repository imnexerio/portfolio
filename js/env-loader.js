/**
 * Environment Variable Loader
 * 
 * This script loads environment variables from a .env file for local development
 * It creates a global Env object that can be accessed throughout the application
 */

window.Env = (function() {
    // Container for environment variables
    const variables = {};
    
    // Function to load variables from .env
    async function loadEnv() {
        try {
            // Try to fetch the .env file
            const response = await fetch('/.env');
            
            // If the file is found, parse it
            if (response.ok) {
                const text = await response.text();
                
                // Parse each line that's not a comment and has an equals sign
                text.split('\n').forEach(line => {
                    // Skip comments and empty lines
                    if (line.trim().startsWith('#') || !line.includes('=')) return;
                    
                    // Split by the first equals sign
                    const [key, ...valueParts] = line.split('=');
                    const value = valueParts.join('=').trim();
                    
                    // Store the variable if it has a value
                    if (key && value) {
                        variables[key.trim()] = value;
                    }
                });
                
                console.log('Environment variables loaded from .env file');
            } else {
                console.log('No .env file found - using default configuration');
                // Try to load from other sources (GitHub Pages meta tags)
                loadFromMetaTags();
            }
        } catch (error) {
            // If there's an error loading the file, just continue
            console.log('Could not load .env file - using default configuration');
            // Try to load from other sources (GitHub Pages meta tags)
            loadFromMetaTags();
        }
    }
    
    // Function to load environment variables from meta tags (for GitHub Pages)
    function loadFromMetaTags() {
        // Look for meta tags with name starting with 'env-'
        const envMetaTags = document.querySelectorAll('meta[name^="env-"]');
        
        if (envMetaTags.length > 0) {
            envMetaTags.forEach(tag => {
                const key = tag.getAttribute('name').replace('env-', '');
                const value = tag.getAttribute('content');
                
                if (key && value) {
                    variables[key] = value;
                }
            });
            console.log('Environment variables loaded from meta tags');
        }
    }
    
    // Public API
    return {
        // Initialize by loading the .env file
        init: async function() {
            await loadEnv();
            return this;
        },
        
        // Get a specific environment variable
        get: function(key, defaultValue = '') {
            // First check browser environment variables (for deployed sites)
            if (typeof process !== 'undefined' && process.env && process.env[key]) {
                return process.env[key];
            }
            
            // Then check our loaded variables (for local development)
            return variables[key] || defaultValue;
        }
    };
})();
