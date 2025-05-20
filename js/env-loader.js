/**
 * Environment Variable Loader for Local Development
 * This script loads environment variables for local development.
 * DO NOT include this file in production deployments.
 */

// Initialize window.env object to store environment variables
window.env = window.env || {};

// For local development, set your GitHub token value directly here
// This file is git-ignored, so it won't be committed to your repository
function setupLocalEnv() {
    // Only set environment variables in local development environments
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
        
        console.log('Local development environment detected');
        
        // Set your GitHub token for local testing
        // IMPORTANT: Don't commit this value to git!
        window.env.PAT_GITHUB = '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';
        
        // Log loaded environment variables (without showing the actual token value)
        Object.keys(window.env).forEach(key => {
            console.log(`Loaded env variable: ${key}`);
        });
        
        console.log('Environment variables loaded for local development');
    }
}

// Execute the setup
setupLocalEnv();
