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
    
    initWebsiteGenerator();
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
    }
      // Create the generator form
    const formHTML = `
        <div class="generator-overlay">
            <div class="generator-form">
                <button class="close-form">&times;</button>
                <h2>Create Your Portfolio Website</h2>
                <p>Enter your information below to generate a personalized portfolio website like this one.</p>
                <div class="form-content">
                    <div class="form-group">
                        <label for="generator-github-username">GitHub Username <span class="form-field-required">*</span></label>
                        <input type="text" id="generator-github-username" placeholder="e.g. octocat" required>
                        <div class="error-message" id="github-username-error">Please enter a valid GitHub username</div>
                        <div class="input-help">Your GitHub profile will be used to populate projects and stats</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="generator-github-token">GitHub Token <span class="form-field-optional">(optional)</span></label>
                        <input type="password" id="generator-github-token" placeholder="ghp_xxxxxxxxxxxx">
                        <div class="input-help">A token allows more GitHub API requests. <a href="https://github.com/settings/tokens" target="_blank">Create one here</a> with "public_repo" scope.</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="generator-name">Your Name <span class="form-field-required">*</span></label>
                        <input type="text" id="generator-name" placeholder="e.g. John Doe" required>
                        <div class="error-message" id="name-error">Please enter your name</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="generator-location">Your Location <span class="form-field-optional">(optional)</span></label>
                        <input type="text" id="generator-location" placeholder="e.g. San Francisco, CA">
                        <div class="input-help">Used in the About and Contact sections</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="generator-email">Your Email <span class="form-field-optional">(optional)</span></label>
                        <input type="text" id="generator-email" placeholder="e.g. you@example.com">
                        <div class="input-help">Displayed in the Contact section for potential employers</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="generator-linkedin">LinkedIn Username <span class="form-field-optional">(optional)</span></label>
                        <input type="text" id="generator-linkedin" placeholder="e.g. johndoe">
                        <div class="input-help">Just the username part of linkedin.com/in/username</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="generator-twitter">Twitter Username <span class="form-field-optional">(optional)</span></label>
                        <input type="text" id="generator-twitter" placeholder="e.g. johndoe">
                        <div class="input-help">Just the username without @</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="generator-instagram">Instagram Username <span class="form-field-optional">(optional)</span></label>
                        <input type="text" id="generator-instagram" placeholder="e.g. johndoe">
                        <div class="input-help">Used for social links in the header and footer</div>
                    </div>
                    
                    <div class="form-info">
                        <p><strong>What happens next?</strong></p>
                        <p>Clicking "Generate My Website" will create a custom portfolio website based on this template, personalized with your information and filled with your GitHub projects.</p>
                        <p>You'll receive a ZIP file that you can upload to any web hosting service or GitHub Pages.</p>
                    </div>
                </div>
                  <div class="loading-indicator">
                    <p>Generating your portfolio website...</p>
                    <div class="generator-progress">
                        <div class="progress-bar">
                            <div class="progress-bar-fill"></div>
                        </div>
                        <div class="progress-status">Preparing website files...</div>
                    </div>
                </div>
                  <div class="success-message">
                    <h3>Success! 🎉</h3>
                    <p>Your personalized portfolio website has been generated.</p>
                    <p>Download the ZIP file and upload it to any web hosting service to make your portfolio live!</p>
                    <div class="hosting-tips">
                        <h4>How to host your website:</h4>
                        <ol>
                            <li><strong>GitHub Pages (Free):</strong> Upload to a GitHub repository and enable GitHub Pages</li>
                            <li><strong>Netlify (Free):</strong> Drag and drop the ZIP folder to Netlify</li>
                            <li><strong>Vercel (Free):</strong> Connect your GitHub repo to deploy automatically</li>
                        </ol>
                    </div>
                    <a href="#" id="download-website" class="download-button">
                        <i class="fas fa-download"></i> Download Your Website
                    </a>
                </div>
                
                <div class="form-buttons">
                    <button class="cancel">Cancel</button>
                    <button class="generate">Generate My Website</button>
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
    generateButton.addEventListener('click', validateAndGenerate);
    
    // Add CSS for new elements
    const style = document.createElement('style');
    style.textContent = `
        .form-info {
            background-color: rgba(var(--primary-color-rgb), 0.1);
            border-left: 3px solid var(--primary-color);
            padding: 15px;
            margin-top: 20px;
            border-radius: 4px;
        }
        
        .form-info p {
            margin: 5px 0;
            text-align: left;
        }
        
        .form-field-required {
            color: var(--primary-color);
            font-weight: bold;
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
    // Reset all error messages first
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('input.error').forEach(el => el.classList.remove('error'));
    
    // Get form values
    const githubUsername = document.getElementById('generator-github-username').value.trim();
    const name = document.getElementById('generator-name').value.trim();
    
    // Validate required fields
    let isValid = true;
    
    if (!githubUsername) {
        document.getElementById('generator-github-username').classList.add('error');
        document.getElementById('github-username-error').classList.add('active');
        document.getElementById('github-username-error').textContent = 'Please enter your GitHub username';
        isValid = false;
    }
    
    if (!name) {
        document.getElementById('generator-name').classList.add('error');
        document.getElementById('name-error').classList.add('active');
        isValid = false;
    }
      if (isValid) {
        // Proceed with generation without validating GitHub username
        generateWebsite();
    }
}

function generateWebsite() {
    // Get form values
    const githubUsername = document.getElementById('generator-github-username').value.trim();
    const githubToken = document.getElementById('generator-github-token').value.trim();
    const name = document.getElementById('generator-name').value.trim();
    const location = document.getElementById('generator-location').value.trim();
    const email = document.getElementById('generator-email').value.trim();
    const linkedin = document.getElementById('generator-linkedin').value.trim();
    const twitter = document.getElementById('generator-twitter').value.trim();
    const instagram = document.getElementById('generator-instagram').value.trim();
    
    // Show loading indicator
    document.querySelector('.form-content').style.display = 'none';
    document.querySelector('.form-buttons').style.display = 'none';
    document.querySelector('.loading-indicator').classList.add('active');
    document.querySelector('.generator-progress').classList.add('active');
    
    // Update progress - skip verification
    updateProgress(10, 'Preparing website files...');
    updateProgress(30, 'Customizing content...');
    
    // Create a configuration object with all the user's information
    const siteConfig = {
        github: {
            username: githubUsername,
            token: githubToken
        },
        personal: {
            name: name,
            location: location || 'Earth',
            email: email || 'contact@example.com',
            avatar: '' // No avatar since we're not fetching user data
        },
        social: {
            linkedin: linkedin || '',
            twitter: twitter || '',
            instagram: instagram || ''
        },
        theme: {
            color: document.documentElement.style.getPropertyValue('--primary-color') || '#9d4edd'
        }
    };
    
    // Generate the website files
    updateProgress(50, 'Cloning website files...');
    
    // Create GitHub configuration file
    const githubConfigJS = generateGithubConfigFile(siteConfig);
    
    // Create a ZIP file with all the necessary website files
    createWebsiteZip(siteConfig, githubConfigJS)
        .then(zipBlob => {
            completeGeneration(siteConfig, zipBlob);
        })
        .catch(error => {
            console.error('Error creating website files:', error);
            showGenerationError('Failed to create website files');
        });
}

// Generate GitHub configuration file
function generateGithubConfigFile(config) {
    return `/**
 * GitHub Configuration Manager
 * 
 * Central configuration for all GitHub-related functionality across the portfolio.
 * This file must be loaded BEFORE any other GitHub integration scripts.
 */

// Create a namespace for GitHub configuration
window.GitHubConfig = (function() {
    // Private GitHub credentials
    const _username = '${config.github.username}';
    const _token = '${config.github.token}';
    
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
function createWebsiteZip(config, githubConfigJS) {
    return new Promise((resolve, reject) => {
        updateProgress(60, 'Customizing HTML...');
        
        // Use the already loaded JSZip library
        if (typeof JSZip === 'undefined') {
            reject(new Error('JSZip library not loaded'));
            return;
        }
        
        const zip = new JSZip();
        
        // Get all the files we need to include
        collectWebsiteFiles()
            .then(files => {
                updateProgress(70, 'Personalizing content...');
                
                // Add all files to the ZIP with customizations
                files.forEach(file => {
                    let content = file.content;
                    
                    // Customize file content based on the configuration
                    if (file.path === 'js/github-config.js') {
                        // Replace with our generated config
                        content = githubConfigJS;
                    } else if (file.path === 'index.html') {
                        // Replace name and social links in HTML
                        content = customizeHTML(content, config);
                    } else if (file.path === 'js/website-generator.js') {
                        // Ensure form is shown correctly in the generated site
                        content = content.replace(/class="generator-overlay active"/g, 'class="generator-overlay"');
                        content = content.replace(/class="loading-indicator active"/g, 'class="loading-indicator"');
                        content = content.replace(/class="generator-progress active"/g, 'class="generator-progress"');
                        content = content.replace(/class="success-message active"/g, 'class="success-message"');
                    }
                    
                    // Add the file to the ZIP
                    zip.file(file.path, content);
                });
                
                // Add license file
                zip.file('LICENSE.txt', generateLicense(config));
                
                updateProgress(90, 'Creating download package...');
                
                // Generate the ZIP file
                zip.generateAsync({ type: 'blob' })
                    .then(blob => {
                        resolve(blob);
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .catch(err => {
                reject(err);
            });
    });
}

// Collect all website files
function collectWebsiteFiles() {
    return new Promise((resolve, reject) => {
        updateProgress(65, 'Collecting website files...');
        
        // Initialize files array with index.html
        const html = document.documentElement.outerHTML;
        const files = [
            {
                path: 'index.html',
                content: html
            },
            {
                path: 'js/github-config.js',
                content: '' // This will be replaced with our generated content
            },
            {
                path: 'README.md',
                content: `# Personal Portfolio Website\n\nThis portfolio website was generated from the template by Santosh Prajapati.\n\n## Setup\n\n1. Edit the js/github-config.js file with your GitHub credentials if needed\n2. Host on any web server or GitHub Pages\n\n## Features\n\n- Responsive design that works on all devices\n- Dynamic GitHub project loading\n- GitHub statistics visualization\n- Light/dark theme switcher\n- Custom color picker\n\n## Credits\n\nOriginal template by [Santosh Prajapati](https://github.com/imnexerio)`
            }
        ];
        
        // Collect all CSS files
        const cssFiles = [
            'css/modern-styles.css',
            'css/advanced-animations.css',
            'css/wow-effects.css',
            'css/consolidated-responsive.css',
            'css/github-stats.css',
            'css/website-generator.css'
        ];
        
        // Collect all JS files
        const jsFiles = [
            'js/github-stats.js',
            'js/optimized-main.js',
            'js/website-generator.js'
        ];
        
        // Create promises to fetch each file
        const fetchPromises = [];
        
        // Add CSS files to fetch promises
        cssFiles.forEach(file => {
            fetchPromises.push(fetch(file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${file}`);
                    }
                    return response.text();
                })
                .then(content => {
                    files.push({
                        path: file,
                        content: content
                    });
                })
                .catch(error => {
                    console.warn(`Could not fetch ${file}:`, error);
                    // Create a placeholder file with a comment
                    files.push({
                        path: file,
                        content: `/* CSS file placeholder: ${file} */\n\n/* This file couldn't be automatically included */`
                    });
                })
            );
        });
        
        // Add JS files to fetch promises
        jsFiles.forEach(file => {
            fetchPromises.push(fetch(file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${file}`);
                    }
                    return response.text();
                })
                .then(content => {
                    files.push({
                        path: file,
                        content: content
                    });
                })
                .catch(error => {
                    console.warn(`Could not fetch ${file}:`, error);
                    // Create a placeholder file with a comment
                    files.push({
                        path: file,
                        content: `// JS file placeholder: ${file}\n\n// This file couldn't be automatically included`
                    });
                })
            );
        });
        
        // Wait for all files to be fetched
        Promise.allSettled(fetchPromises)
            .then(() => {
                resolve(files);
            })
            .catch(error => {
                console.error('Error collecting files:', error);
                reject(error);
            });
    });
}

// Customize HTML based on configuration
function customizeHTML(html, config) {
    // Remove any active classes that could cause issues in the generated site
    html = html.replace(/class="generator-overlay active"/g, 'class="generator-overlay"');
    html = html.replace(/class="loading-indicator active"/g, 'class="loading-indicator"');
    html = html.replace(/class="generator-progress active"/g, 'class="generator-progress"');
    html = html.replace(/class="success-message active"/g, 'class="success-message"');
    
    // Create a RegExp for entire portfolio name
    const nameRegExp = new RegExp('Santosh Prajapati', 'g');
    const shortNameRegExp = new RegExp('SP', 'g'); // For the logo
    
    // Replace all instances of the original creator's name
    html = html.replace(nameRegExp, config.personal.name);
    
    // Get initials for the logo
    const initials = getInitials(config.personal.name);
    html = html.replace(shortNameRegExp, initials);
    
    // Replace page title
    html = html.replace(/<title>Santosh Prajapati - Portfolio<\/title>/g, 
                      `<title>${config.personal.name} - Portfolio</title>`);
    
    // Replace location
    const locationRegExp = new RegExp('Delhi, India', 'g');
    html = html.replace(locationRegExp, config.personal.location);
    
    // Replace email
    const emailRegExp = new RegExp('contact@example\\.com', 'g');
    html = html.replace(emailRegExp, config.personal.email);
    
    // Replace GitHub username in all links and references
    const githubUsernameRegExp = new RegExp('imnexerio', 'g');
    html = html.replace(githubUsernameRegExp, config.github.username);
    
    // Replace social media links
    if (config.social.linkedin) {
        const linkedinRegExp = new RegExp('linkedin\\.com/in/imnexerio', 'g');
        html = html.replace(linkedinRegExp, `linkedin.com/in/${config.social.linkedin}`);
    }
    
    if (config.social.twitter) {
        const twitterRegExp = new RegExp('twitter\\.com/imnexerio', 'g');
        html = html.replace(twitterRegExp, `twitter.com/${config.social.twitter}`);
    }
    
    if (config.social.instagram) {
        const instagramRegExp = new RegExp('instagram\\.com/imnexerio', 'g');
        html = html.replace(instagramRegExp, `instagram.com/${config.social.instagram}`);
    }
    
    // Update copyright year
    const currentYear = new Date().getFullYear();
    html = html.replace(/&copy; 2025/g, `&copy; ${currentYear}`);
    
    // Update the "Generated By" section
    html = html.replace(/"Create your own portfolio - It's free!"/g, 
                      `"Generated using Santosh Prajapati's template"`);
    
    // Replace profile image if available
    if (config.personal.avatar) {
        // Find and replace the profile image placeholder
        const imgPlaceholderRegExp = new RegExp('data:image/svg\\+xml,[^"]+', 'g');
        html = html.replace(imgPlaceholderRegExp, config.personal.avatar);
    }
    
    return html;
}

// Helper function to get initials from name
function getInitials(name) {
    if (!name) return 'ME';
    
    const parts = name.split(' ');
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function completeGeneration(config, zipBlob) {
    // Update progress and show success message
    updateProgress(100, 'Website generated successfully!');
    
    // Hide loading indicator and show success message
    setTimeout(() => {
        document.querySelector('.loading-indicator').classList.remove('active');
        document.querySelector('.success-message').classList.add('active');
        
        // Create download link for the ZIP file
        const downloadLink = document.getElementById('download-website');
        const url = URL.createObjectURL(zipBlob);
        downloadLink.href = url;
        downloadLink.download = `${config.github.username}-portfolio.zip`;
    }, 500);
}

function showGenerationError(message) {
    // Update UI to show error
    document.querySelector('.loading-indicator').classList.remove('active');
    document.querySelector('.form-content').style.display = 'block';
    document.querySelector('.form-buttons').style.display = 'flex';
    
    // Show error message
    alert(`Error generating website: ${message}`);
}

/**
 * Updates the progress bar and status message during website generation
 * @param {number} percentage - Progress percentage (0-100)
 * @param {string} message - Status message to display
 */
function updateProgress(percentage, message) {
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressStatus = document.querySelector('.progress-status');
    
    if (progressBar && progressStatus) {
        // Set progress bar width
        progressBar.style.width = `${percentage}%`;
        
        // Update status message
        progressStatus.textContent = message;
        
        // Log progress for debugging
        console.log(`Generation progress: ${percentage}% - ${message}`);
    }
}

