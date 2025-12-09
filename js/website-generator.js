/**
 * Website Generator
 * Generates a personalized portfolio website based on user input
 */

// Initialize the generator when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check for and fix any existing generator overlays
    const existingOverlay = document.querySelector('.generator-overlay');
    if (existingOverlay) {
        // Remove active class
        existingOverlay.classList.remove('active');
        
        // Reset form state
        const formContent = existingOverlay.querySelector('.form-content');
        const formButtons = existingOverlay.querySelector('.form-buttons');
        const loadingIndicator = existingOverlay.querySelector('.loading-indicator');
        const successMessage = existingOverlay.querySelector('.success-message');
        
        if (formContent) formContent.style.display = 'block';
        if (formButtons) formButtons.style.display = 'flex';
        if (loadingIndicator) loadingIndicator.classList.remove('active');
        if (successMessage) successMessage.classList.remove('active');
    }
      // Check if JSZip is available and load it if not
    if (typeof JSZip === 'undefined') {
        console.log("Loading JSZip library");
        const jsZipScript = document.createElement('script');
        jsZipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        jsZipScript.onload = function() {
            console.log("JSZip library loaded successfully");
            initWebsiteGenerator();
        };
        jsZipScript.onerror = function(error) {
            console.error("Failed to load JSZip library:", error);
            alert("Failed to load required libraries. Please check your internet connection and try again.");
        };
        document.head.appendChild(jsZipScript);
    } else {
        console.log("JSZip library already loaded");
        initWebsiteGenerator();
    }
});

function initWebsiteGenerator() {
    // Get the creator button
    const creatorBtn = document.querySelector('.website-creator-btn.create');
    if (!creatorBtn) return;
    
    // Add click event to the creator button
    creatorBtn.addEventListener('click', showGeneratorForm);
    
    // Check if generator overlay exists and remove active class
    const existingOverlay = document.querySelector('.generator-overlay');
    if (existingOverlay && existingOverlay.classList.contains('active')) {
        existingOverlay.classList.remove('active');
    }
}

function showGeneratorForm() {
    // Check if the form already exists
    if (document.querySelector('.generator-overlay')) {
        const overlay = document.querySelector('.generator-overlay');
        
        // Reset form state
        const formContent = overlay.querySelector('.form-content');
        const formButtons = overlay.querySelector('.form-buttons');
        const loadingIndicator = overlay.querySelector('.loading-indicator');
        const successMessage = overlay.querySelector('.success-message');
        
        if (formContent) formContent.style.display = 'block';
        if (formButtons) formButtons.style.display = 'flex';
        if (loadingIndicator) loadingIndicator.classList.remove('active');
        if (successMessage) successMessage.classList.remove('active');
        
        // Show the overlay
        overlay.classList.add('active');
        return;
    }      // Create the generator form
    const formHTML = `
        <div class="generator-overlay">
            <div class="generator-form">
                <button class="close-form">&times;</button>
                <h2>Your complete Portfolio just using GitHub ID</h2>
                <div class="form-content">
                    <div class="form-group">
                        <label for="generator-github-username">GitHub Username <span class="form-field-required">*</span></label>
                        <input type="text" id="generator-github-username" placeholder="e.g. octocat" required>
                        <div class="error-message" id="github-username-error">Please enter a valid GitHub username</div>
                        <div class="input-help">Your GitHub profile will be used to populate your portfolio</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="generator-linkedin">LinkedIn URL <span class="form-field-optional">(optional)</span></label>
                        <input type="text" id="generator-linkedin" placeholder="e.g. https://www.linkedin.com/in/johndoe/">
                        <div class="input-help">Full LinkedIn profile URL including https://</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="generator-twitter">Twitter/X URL <span class="form-field-optional">(optional)</span></label>
                        <input type="text" id="generator-twitter" placeholder="e.g. https://twitter.com/johndoe">
                        <div class="input-help">Complete Twitter/X profile URL including https://</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="generator-instagram">Instagram URL <span class="form-field-optional">(optional)</span></label>
                        <input type="text" id="generator-instagram" placeholder="e.g. https://www.instagram.com/johndoe/">
                        <div class="input-help">Complete Instagram profile URL including https://</div>
                    </div>
                </div><div class="loading-indicator">
                    <p>Updating your portfolio website...</p>
                    <div class="generator-progress">
                        <div class="progress-bar">
                            <div class="progress-bar-fill"></div>
                        </div>
                        <div class="progress-status">Updating site files...</div>
                    </div>
                </div>                <div class="success-message">
                    <h3>Success! 🎉</h3>
                    <p>Your portfolio website has been created.</p>

                    <div class="setup-instructions">
                        <h4>Important Setup Steps:</h4>
                        <ol>
                            <li><strong>GitHub Authentication:</strong>
                                <ul>
                                    <li>Create a token with "public_repo" scope at <a href="https://github.com/settings/tokens" target="_blank">GitHub token settings</a></li>
                                    <li>Add the token as a repository secret named <code>PAT_GITHUB</code></li>
                                </ul>
                            </li>
                            <li><strong>Formspree Contact Form:</strong>
                                <ul>
                                    <li>Create an account at <a href="https://formspree.io" target="_blank">Formspree.io</a></li>
                                    <li>Get your form ID and update the form action URL</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                    
                    <div class="hosting-tips">
                        <h4>Deploy Your Website:</h4>
                        <ol>
                            <li><strong>GitHub Pages with Actions (Recommended):</strong> 
                              <ul>
                                <li>Set GitHub Pages source to "GitHub Actions" in repository settings</li>
                              </ul>
                            </li>
                            <li><strong>Manual Options:</strong> GitHub Pages (manual), Netlify, or Vercel</li>
                        </ol>
                    </div>
                    <a href="#" id="download-website" class="download-button">
                        <i class="fas fa-download"></i> Download Updated Website
                    </a>
                </div>
                
                <div class="form-buttons">
                    <button class="cancel">Cancel</button>
                    <button class="generate">Update My Portfolio</button>
                </div>
            </div>
        </div>
    `;
    
    // Add the form to the body
    document.body.insertAdjacentHTML('beforeend', formHTML);
    
    // Get form elements
    const generatorOverlay = document.querySelector('.generator-overlay');
    const closeButton = generatorOverlay.querySelector('.close-form');
    const cancelButton = generatorOverlay.querySelector('button.cancel');
    const generateButton = generatorOverlay.querySelector('button.generate');
    
    // Show the form with a slight delay
    setTimeout(() => {
        generatorOverlay.classList.add('active');
    }, 10);
    
    // Close form events
    closeButton.addEventListener('click', hideGeneratorForm);
    cancelButton.addEventListener('click', hideGeneratorForm);
    
    // Click outside to close
    generatorOverlay.addEventListener('click', function(event) {
        if (event.target === generatorOverlay) {
            hideGeneratorForm();
        }
    });
    
    // Generate website event
    generateButton.addEventListener('click', validateAndGenerate);      // Add CSS for new elements
    const style = document.createElement('style');
    style.textContent = `
        /* Form field styling */
        .form-field-required {
            color: var(--primary-color);
            font-weight: bold;
        }
        
        /* Setup instructions and hosting tips */
        .setup-instructions, .hosting-tips {
            background-color: rgba(var(--primary-color-rgb, 0, 120, 215), 0.05);
            border: 1px solid rgba(var(--primary-color-rgb, 0, 120, 215), 0.2);
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            text-align: left;
        }
        
        .setup-instructions h4, .hosting-tips h4 {
            margin-top: 0;
            margin-bottom: 10px;
            color: var(--secondary-color, #0078d7);
            font-size: 1.1em;
            text-align: center;
        }
        
        .setup-instructions ol, .hosting-tips ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        .setup-instructions li, .hosting-tips li {
            margin-bottom: 8px;
        }
        
        .setup-instructions ul, .hosting-tips ul {
            padding-left: 20px;
        }
        
        .update-details {
            background-color: rgba(var(--primary-color-rgb), 0.05);
            border-radius: 4px;
            padding: 8px 12px;
            margin: 10px 0;
            font-size: 0.9em;
        }
        
        .update-details ul {
            margin: 5px 0;
            padding-left: 20px;
        }
        
        /* Error message */
        .generator-error-message {
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

function hideGeneratorForm() {
    const generatorOverlay = document.querySelector('.generator-overlay');
    if (!generatorOverlay) return;
    
    generatorOverlay.classList.remove('active');
}

function validateAndGenerate() {
    console.log("validateAndGenerate called"); // Debug log
    
    // Reset all error messages first
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('input.error').forEach(el => el.classList.remove('error'));
    
    // Get form values
    const githubUsernameInput = document.getElementById('generator-github-username');
    
    if (!githubUsernameInput) {
        console.error("Required form elements not found");
        alert("Error: Required form elements not found. Please refresh the page and try again.");
        return;
    }
    
    const githubUsername = githubUsernameInput.value.trim();
    
    // Validate required fields
    let isValid = true;
    
    if (!githubUsername) {
        githubUsernameInput.classList.add('error');
        const errorElement = document.getElementById('github-username-error');
        if (errorElement) {
            errorElement.classList.add('active');
            errorElement.textContent = 'Please enter your GitHub username';
        }
        isValid = false;
    }
    
    if (isValid) {
        console.log("Form valid, updating website..."); // Debug log
        // Proceed with generation without validating GitHub username
        generateWebsite();
    } else {
        console.log("Form validation failed"); // Debug log
    }
}

function generateWebsite() {
    console.log("generateWebsite called"); // Debug log
    try {
        // Get form values
        const githubUsername = document.getElementById('generator-github-username')?.value.trim();
        if (!githubUsername) {
            throw new Error('GitHub username is required');
        }
        
        // No longer using form input for token - always generate config with empty token
        const githubToken = '';
        const linkedin = document.getElementById('generator-linkedin')?.value.trim() || '';
        const twitter = document.getElementById('generator-twitter')?.value.trim() || '';
        const instagram = document.getElementById('generator-instagram')?.value.trim() || '';
        
        // Validate URLs (optional step but ensures proper format)
        const validateUrl = (url) => {
            if (!url) return url;
            try {
                new URL(url);
                return url;
            } catch (e) {
                // If not a valid URL, return empty string
                console.warn(`Invalid URL format: ${url}`);
                return '';
            }
        };
        
        // Show loading indicator
        const formContent = document.querySelector('.form-content');
        const formButtons = document.querySelector('.form-buttons');
        const loadingIndicator = document.querySelector('.loading-indicator');
        const generatorProgress = document.querySelector('.generator-progress');
        
        if (!formContent || !formButtons || !loadingIndicator || !generatorProgress) {
            throw new Error('Required form elements not found');
        }
        
        formContent.style.display = 'none';
        formButtons.style.display = 'none';
        loadingIndicator.classList.add('active');
        generatorProgress.classList.add('active');
        
        // Update progress
        updateProgress(10, 'Preparing to update GitHub and social links...');
        updateProgress(20, 'Checking internet connection...');
        
        // Set a timeout to handle connectivity issues
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Connection timeout. Please check your internet connection.')), 10000);
        });
        
        // Check connectivity to GitHub first with timeout
        Promise.race([
            fetch('https://raw.githubusercontent.com/imnexerio/portfolio/main/README.md'),
            timeoutPromise
        ])
            .then(response => {
                if (!response.ok) {
                    throw new Error('Cannot connect to GitHub. Please check your internet connection.');
                }
                
                updateProgress(30, 'Processing your input...');
                
                // Create a configuration object with the user's information
                const siteConfig = {
                    github: {
                        username: githubUsername,
                        token: githubToken
                    },
                    social: {
                        linkedin: validateUrl(linkedin) || '',
                        twitter: validateUrl(twitter) || '',
                        instagram: validateUrl(instagram) || ''
                    },
                    personal: {
                        name: githubUsername // Fallback to username if we don't have a name
                    }
                };
                
                // Generate the website files
                updateProgress(50, 'Generating configuration files...');
                
                // Create GitHub configuration file
                const githubConfigJS = generateGithubConfigFile(siteConfig);
                
                // Create social links file
                const socialLinksJS = generateSocialLinksFile(siteConfig);
                
                // Make sure JSZip is available
                if (typeof JSZip === 'undefined') {
                    throw new Error("Required JSZip library not found. Please check your internet connection and try again.");
                }
                
                // Create a ZIP file with all the necessary website files
                createWebsiteZip(siteConfig, githubConfigJS, socialLinksJS)
                    .then(zipBlob => {
                        completeGeneration(siteConfig, zipBlob);
                    })
                    .catch(error => {
                        console.error('Error creating website files:', error);
                        showGenerationError('Failed to create website files: ' + error.message);
                    });
            })
            .catch(error => {
                console.error('Connectivity or generation error:', error);
                showGenerationError('Error during website generation: ' + error.message);
            });
    } catch (error) {
        console.error('Error in generateWebsite:', error);
        showGenerationError('An unexpected error occurred: ' + error.message);
    }
}

// Generate GitHub configuration file
function generateGithubConfigFile(config) {    return `/**
 * GitHub Configuration Manager
 * 
 * Central configuration for all GitHub-related functionality across the portfolio.
 * This file must be loaded BEFORE any other GitHub integration scripts.
 */

// Create a namespace for GitHub configuration
window.GitHubConfig = (function() {
    // Private GitHub credentials
    const _username = '${config.github.username}';
    
    // Dynamic mode disabled for generated sites (locked to owner)
    const _allowDynamic = false;
    
    // Get token from environment variable or leave empty for public access
    const _token = ''; // Token should be set as PAT_GITHUB in GitHub repository secrets
    
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
        
        // Get config settings
        getConfig: function(key) {
            return key ? _config[key] : _config;
        },
        
        // Get authorization headers for GitHub API requests
        getAuthHeaders: function() {
            const headers = {};
            if (_token) {
                headers['Authorization'] = \`Bearer \${_token}\`;
            }
            return headers;
        },
        
        // Build GitHub API URL
        buildApiUrl: function(endpoint, params = {}) {
            const baseUrl = \`https://api.github.com/\${endpoint}\`;
            const urlParams = new URLSearchParams();
            
            // Add params to URL
            Object.keys(params).forEach(key => {
                urlParams.append(key, params[key]);
            });
            
            // Return complete URL with parameters
            const paramString = urlParams.toString();
            return paramString ? \`\${baseUrl}?\${paramString}\` : baseUrl;
        }
    };
})();`;
}

// Generate social links JS file
function generateSocialLinksFile(config) {
    // Set default social links with fallbacks
    const linkedinUrl = config.social.linkedin || 'https://www.linkedin.com/in/imnexerio/';
    const twitterUrl = config.social.twitter || 'https://www.twitter.com/imnexerio/';
    const instagramUrl = config.social.instagram || 'https://www.instagram.com/imnexerio/';
    
    return `// Social media links configuration
const socialLinks = [
    {
        platform: 'github',
        url: 'https://github.com/${config.github.username}',
        icon: 'fab fa-github',
        title: 'GitHub'
    },
    {
        platform: 'linkedin',
        url: '${linkedinUrl}',
        icon: 'fab fa-linkedin-in',
        title: 'LinkedIn'
    },
    {
        platform: 'twitter',
        url: '${twitterUrl}',
        icon: 'fab fa-twitter',
        title: 'Twitter'
    },
    {
        platform: 'instagram',
        url: '${instagramUrl}',
        icon: 'fab fa-instagram',
        title: 'Instagram'
    }
];

// Function to render social media links in specified containers
function renderSocialLinks() {
    // Find all containers with class 'social-icons'
    const socialContainers = document.querySelectorAll('.social-icons');
    
    // For each container, render the social links
    socialContainers.forEach(container => {
        // Clear existing content
        container.innerHTML = '';
        
        // Add each social link
        socialLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.target = '_blank';
            linkElement.title = link.title;
            linkElement.className = 'magnetic';
            
            const iconElement = document.createElement('i');
            iconElement.className = link.icon;
            
            linkElement.appendChild(iconElement);
            container.appendChild(linkElement);
        });
    });
}

// Initialize social links when the DOM is loaded
document.addEventListener('DOMContentLoaded', renderSocialLinks);`;
}

// Generate a license file with proper attribution
function generateLicense(config) {
    const currentYear = new Date().getFullYear();
    
    return `Portfolio Website License and Attribution

Copyright (c) ${currentYear} ${config.personal.name}

This portfolio website was generated using a template created by Santosh Prajapati (https://github.com/imnexerio).

Permission is hereby granted to:
1. Use this website as your personal portfolio
2. Modify the content and design to suit your needs
3. Host the website on any platform

Attribution Requirements:
- Please maintain the attribution in the website footer
- If you significantly modify the template, please still credit the original creator

For commercial use beyond personal portfolio purposes, please contact the original creator.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.`;
}

// Create a ZIP file with all website files
function createWebsiteZip(config, githubConfigJS, socialLinksJS) {
    return new Promise((resolve, reject) => {
        updateProgress(60, 'Packaging website files...');
        
        // Use the already loaded JSZip library
        if (typeof JSZip === 'undefined') {
            reject(new Error('JSZip library not loaded'));
            return;
        }
        
        const zip = new JSZip();
        
        // Get all the files we need to include
        collectWebsiteFiles()
            .then(files => {
                updateProgress(70, 'Updating configuration files...');
                
                try {
                    // Add all files to the ZIP with GitHub config and social links updates
                    files.forEach(file => {
                        // Track any binary files to handle differently
                        const isBinary = file.content instanceof Blob;
                        
                        let content = file.content;
                        
                        // Only modify the text files, not binary files
                        if (!isBinary) {
                            // Only modify the GitHub config and social links files
                            if (file.path === 'js/github-config.js') {
                                // Replace with our generated config
                                content = githubConfigJS;
                            } else if (file.path === 'js/social-links.js') {
                                // Replace with our generated social links
                                content = socialLinksJS;
                            }
                        }
                        
                        // Add the file to the ZIP (binary or text)
                        zip.file(file.path, content);
                    });
                    
                    updateProgress(90, 'Creating download package...');
                    
                    // Generate the ZIP file with compression
                    const zipOptions = {
                        type: 'blob',
                        compression: 'DEFLATE',
                        compressionOptions: {
                            level: 6 // Balanced between speed and compression ratio
                        }
                    };
                    
                    zip.generateAsync(zipOptions)
                        .then(blob => {
                            resolve(blob);
                        })
                        .catch(err => {
                            console.error('ZIP generation failed:', err);
                            reject(err);
                        });
                } catch (error) {
                    console.error('Error processing files for ZIP:', error);
                    reject(error);
                }
            })
            .catch(err => {
                console.error('Failed to collect website files:', err);
                reject(err);
            });
    });
}

// Collect all website files
function collectWebsiteFiles() {
    return new Promise((resolve, reject) => {
        updateProgress(65, 'Collecting all website files from repository...');
        
        // Use the GitHub repository as the source of files instead of the current document
        const repoBaseUrl = 'https://raw.githubusercontent.com/imnexerio/portfolio/main/';
        const files = [
            {
                path: 'js/github-config.js',
                content: '' // This will be replaced with our generated content
            },
            {
                path: 'js/social-links.js',
                content: '' // This will be replaced with our generated content
            },
            {                
                path: 'README.md',
                content: `# Personal Portfolio Website\n\nThis portfolio website was generated from the template by Santosh Prajapati.\n\n## Setup\n\n1. Edit the js/github-config.js file with your GitHub credentials if needed\n2. Host on any web server or GitHub Pages\n\n## GitHub Actions Deployment\n\nFor secure deployment with GitHub Actions:\n1. Add your GitHub token as a repository secret named \`PAT_GITHUB\`\n2. Use the included workflow file in \`.github/workflows/deploy.yml\`\n3. Set GitHub Pages source to "GitHub Actions" in repository settings\n\n## Features\n\n- Responsive design that works on all devices\n- Dynamic GitHub project loading\n- GitHub statistics visualization\n- Light/dark theme switcher\n- Custom color picker\n\n## Credits\n\nOriginal template by [Santosh Prajapati](https://github.com/imnexerio)`
            }
        ];
        // Files to fetch from the repository - comprehensive list
        const filesToFetch = [
            'index.html',
            'LICENSE',
            'css/modern-styles.css',
            'css/advanced-animations.css',
            'css/wow-effects.css',
            'css/consolidated-responsive.css',
            'css/github-stats.css',
            'css/github-readme.css',
            'css/website-generator.css',
            'css/dynamic-profile.css',
            'js/github-stats.js',
            'js/optimized-main.js',
            'js/website-generator.js',
            'js/modal-override.js',
            'js/readme-preview.js',
            'js/env-loader.js',
            'js/social-links.js',
            'public-portfolio/preview.gif',
            'public-portfolio/preview.png',
            '.github/workflows/deploy.yml'
        ];
        
        // Create a map to identify binary files
        const binaryExtensions = ['.gif', '.png', '.jpg', '.jpeg', '.ico', '.pdf', '.woff', '.woff2', '.eot', '.ttf', '.otf'];
        const isBinaryFile = (file) => binaryExtensions.some(ext => file.toLowerCase().endsWith(ext));
        
        // Fetch handlers with optimized error handling
        const fetchTextFile = async (fileUrl, filePath) => {
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${filePath} (${response.status})`);
                }
                return {
                    path: filePath,
                    content: await response.text()
                };
            } catch (error) {
                console.warn(`Could not fetch ${filePath}:`, error);
                // Create placeholder based on file extension
                if (filePath.endsWith('.js')) {
                    return {
                        path: filePath,
                        content: `// JS file placeholder: ${filePath}\n\n// This file couldn't be automatically included`
                    };
                } else if (filePath.endsWith('.css')) {
                    return {
                        path: filePath,
                        content: `/* CSS file placeholder: ${filePath} */\n\n/* This file couldn't be automatically included */`
                    };
                } else {
                    return {
                        path: filePath,
                        content: `<!-- Could not fetch ${filePath} from GitHub -->`
                    };
                }
            }
        };
        
        const fetchBinaryFile = async (fileUrl, filePath) => {
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch binary ${filePath} (${response.status})`);
                }
                return {
                    path: filePath,
                    content: await response.blob()
                };
            } catch (error) {
                console.warn(`Could not fetch binary file ${filePath}:`, error);
                // Return null for binary files that couldn't be fetched
                return null;
            }
        };
        
        // Process files with Promise.all for better performance
        const fetchAllFiles = async () => {
            const fetchPromises = filesToFetch.map(file => {
                const fileUrl = repoBaseUrl + file;
                return isBinaryFile(file) 
                    ? fetchBinaryFile(fileUrl, file)
                    : fetchTextFile(fileUrl, file);
            });
            
            const results = await Promise.allSettled(fetchPromises);
            
            // Filter out null results and add successful fetches to files array
            const fetchedFiles = results
                .filter(result => result.status === 'fulfilled' && result.value !== null)
                .map(result => result.value);
            
            files.push(...fetchedFiles);
            
            const successCount = fetchedFiles.length;
            console.log(`Successfully fetched ${successCount} out of ${filesToFetch.length} files`);
            updateProgress(75, `Successfully collected ${successCount} out of ${filesToFetch.length} files...`);
            
            return files;
        };
        
        // Execute fetching with proper error handling
        fetchAllFiles()
            .then(resolve)
            .catch(error => {
                console.error('Error collecting files from GitHub:', error);
                // Still resolve with partial files rather than rejecting
                resolve(files);
            });
    });
}

// Customize HTML based on configuration
function completeGeneration(config, zipBlob) {
    // Update progress and show success message
    updateProgress(100, 'Website updated successfully!');
    
    // Store the URL object for later cleanup
    let objectUrl = null;
    
    // Hide loading indicator and show success message
    setTimeout(() => {
        // Check if we can find the necessary elements before proceeding
        const loadingIndicator = document.querySelector('.loading-indicator');
        const successMessage = document.querySelector('.success-message');
        const downloadLink = document.getElementById('download-website');
        
        if (!loadingIndicator || !successMessage || !downloadLink) {
            console.error('Required DOM elements not found for completion');
            showGenerationError('Required DOM elements not found. Please refresh and try again.');
            return;
        }
        
        // Hide loading and show success
        loadingIndicator.classList.remove('active');
        successMessage.classList.add('active');
        
        // Create download link for the ZIP file
        try {
            objectUrl = URL.createObjectURL(zipBlob);
            downloadLink.href = objectUrl;
            downloadLink.download = `${config.github.username}-portfolio-updated.zip`;
            
            // Clean up the URL object when the page unloads or when download is clicked
            downloadLink.addEventListener('click', () => {
                // Give the browser some time to start the download before revoking
                setTimeout(() => {
                    if (objectUrl) {
                        URL.revokeObjectURL(objectUrl);
                        objectUrl = null;
                    }
                }, 5000);
            });
            
            // Also clean up on page unload
            window.addEventListener('unload', () => {
                if (objectUrl) {
                    URL.revokeObjectURL(objectUrl);
                    objectUrl = null;
                }
            });
        } catch (error) {
            console.error('Error creating object URL:', error);
            showGenerationError('Failed to create download link. Please try again.');
            return;
        }
        
        // Add a small note about what was updated
        if (successMessage) {
            const updateNote = document.createElement('div');
            updateNote.className = 'update-details';
                        
            // Insert after the first paragraph
            const firstP = successMessage.querySelector('p');
            if (firstP && firstP.nextSibling) {
                successMessage.insertBefore(updateNote, firstP.nextSibling);
            } else {
                successMessage.appendChild(updateNote);
            }
        }
    }, 500);
}

function showGenerationError(message) {
    // Update UI to show error
    const loadingIndicator = document.querySelector('.loading-indicator');
    const formContent = document.querySelector('.form-content');
    const formButtons = document.querySelector('.form-buttons');
    
    // Safely reset UI elements if they exist
    if (loadingIndicator) loadingIndicator.classList.remove('active');
    if (formContent) formContent.style.display = 'block';
    if (formButtons) formButtons.style.display = 'flex';
      // Create a more user-friendly error notification
    // First, check if we already have an error message element
    let errorElement = document.querySelector('.generator-error-message');
    
    if (!errorElement) {
        // Create a new error element
        errorElement = document.createElement('div');
        errorElement.className = 'generator-error-message';
        
        // Add styling that matches our consolidated approach
        errorElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        errorElement.style.border = '1px solid #ff0000';
        errorElement.style.borderRadius = '8px';
        errorElement.style.padding = '15px';
        errorElement.style.margin = '15px 0';
        errorElement.style.color = '#ff0000';
        
        // Insert at the top of the form content
        if (formContent) {
            // Insert it at the top of form content
            formContent.insertBefore(errorElement, formContent.firstChild);
        } else {
            // If formContent doesn't exist, try to find the generator form
            const generatorForm = document.querySelector('.generator-form');
            if (generatorForm) {
                generatorForm.insertBefore(errorElement, generatorForm.firstChild);
            } else {
                // As a fallback, just show an alert
                alert(`Error generating website: ${message}`);
                return;
            }
        }
    }
    
    // Set the error message
    errorElement.innerHTML = `
        <strong>Error generating website:</strong>
        <p>${message}</p>
        <p>Please try again or check your internet connection.</p>
    `;
    
    // Automatically remove the error after 10 seconds
    setTimeout(() => {
        if (errorElement && errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
        }
    }, 10000);
    
    // Log the error to console for debugging
    console.error('Website generation error:', message);
}

/**
 * Updates the progress bar and status message during website generation
 * @param {number} percentage - Progress percentage (0-100)
 * @param {string} message - Status message to display
 */
function updateProgress(percentage, message) {
    console.log(`Generation progress: ${percentage}% - ${message}`);
    
    try {
        // Update progress bar
        const progressBar = document.querySelector('.progress-bar-fill');
        const progressStatus = document.querySelector('.progress-status');
        
        if (progressBar) {
            // Set progress bar width
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressStatus) {
            // Update status message
            progressStatus.textContent = message;
        }
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

