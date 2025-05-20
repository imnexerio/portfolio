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
            console.log("JSZip library loaded");
            initWebsiteGenerator();
        };
        jsZipScript.onerror = function() {
            console.error("Failed to load JSZip library");
            initWebsiteGenerator();
        };
        document.head.appendChild(jsZipScript);
    } else {
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
                <h2>Customize Your Portfolio</h2>
                <p>Update your social links and GitHub information without recreating the entire website.</p>                <div class="form-content">
                    <div class="form-group">
                        <label for="generator-github-username">GitHub Username <span class="form-field-required">*</span></label>
                        <input type="text" id="generator-github-username" placeholder="e.g. octocat" required>
                        <div class="error-message" id="github-username-error">Please enter a valid GitHub username</div>
                        <div class="input-help">Your GitHub profile will be used to populate projects, stats, and personal information</div>
                    </div>
                      <div class="form-group">
                        <label for="generator-github-token">GitHub Token <span class="form-field-optional">(optional)</span></label>
                        <input type="password" id="generator-github-token" placeholder="ghp_xxxxxxxxxxxx">
                        <div class="input-help">A token allows more GitHub API requests. <a href="https://github.com/settings/tokens" target="_blank">Create one here</a> with "public_repo" scope. For enhanced security, use GitHub Actions for deployment and add your token as a repository secret named <code>PAT_GITHUB</code>.</div>
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
                      <div class="form-info">
                        <p><strong>What happens next?</strong></p>
                        <p>Clicking "Update My Portfolio" will update the social links and GitHub information in the website.</p>
                        <p>You'll receive a ZIP file that you can upload to any web hosting service or GitHub Pages.</p>
                        <p><strong>Secure Deployment:</strong> The generated package includes a GitHub Actions workflow (<code>.github/workflows/deploy.yml</code>) for secure deployment. Add your token as a repository secret called <code>PAT_GITHUB</code> instead of including it in your code.</p>
                    </div>
                </div>                  <div class="loading-indicator">
                    <p>Updating your portfolio website...</p>
                    <div class="generator-progress">
                        <div class="progress-bar">
                            <div class="progress-bar-fill"></div>
                        </div>
                        <div class="progress-status">Updating site files...</div>
                    </div>
                </div>
                  <div class="success-message">
                    <h3>Success! 🎉</h3>
                    <p>Your portfolio website has been updated.</p>
                    <p>Download the ZIP file and upload it to your existing web hosting service!</p>
                    <div class="hosting-tips">                        <h4>How to update your website:</h4>
                        <ol>
                            <li><strong>GitHub Pages with Actions (Recommended):</strong> 
                              <ul>
                                <li>Add your GitHub token as a repository secret named <code>PAT_GITHUB</code></li>
                                <li>Include the <code>.github/workflows/deploy.yml</code> file</li>
                                <li>Set GitHub Pages source to "GitHub Actions" in repository settings</li>
                              </ul>
                            </li>
                            <li><strong>GitHub Pages (Manual):</strong> Replace the files in your repository</li>
                            <li><strong>Netlify:</strong> Drag and drop the ZIP folder to update your site</li>
                            <li><strong>Vercel:</strong> Push updated files to your GitHub repo</li>
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
        const githubUsername = document.getElementById('generator-github-username').value.trim();
        const githubToken = document.getElementById('generator-github-token')?.value.trim() || '';
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
        
        if (formContent) formContent.style.display = 'none';
        if (formButtons) formButtons.style.display = 'none';
        if (loadingIndicator) loadingIndicator.classList.add('active');
        if (generatorProgress) generatorProgress.classList.add('active');
          // Update progress
        updateProgress(10, 'Preparing to update GitHub and social links...');
        updateProgress(20, 'Checking internet connection...');
        
        // Check connectivity to GitHub first
        fetch('https://raw.githubusercontent.com/imnexerio/portfolio/main/README.md')
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
                    console.error("JSZip library not found");
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
                console.error('Connectivity check failed:', error);
                showGenerationError('Cannot connect to GitHub. Please check your internet connection and try again.');
            });
    } catch (error) {
        console.error('Error in generateWebsite:', error);
        showGenerationError('An unexpected error occurred: ' + error.message);
    }
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
                
                // Add all files to the ZIP with GitHub config and social links updates
                files.forEach(file => {
                    let content = file.content;
                    
                    // Only modify the GitHub config and social links files
                    if (file.path === 'js/github-config.js') {
                        // Replace with our generated config
                        content = githubConfigJS;
                    } else if (file.path === 'js/social-links.js') {
                        // Replace with our generated social links
                        content = socialLinksJS;
                    }
                    
                    // Add the file to the ZIP without other modifications
                    zip.file(file.path, content);
                });
                
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
        updateProgress(65, 'Collecting website files from repository...');
        
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
            {                path: 'README.md',
                content: `# Personal Portfolio Website\n\nThis portfolio website was generated from the template by Santosh Prajapati.\n\n## Setup\n\n1. Edit the js/github-config.js file with your GitHub credentials if needed\n2. Host on any web server or GitHub Pages\n\n## GitHub Actions Deployment\n\nFor secure deployment with GitHub Actions:\n1. Add your GitHub token as a repository secret named \`PAT_GITHUB\`\n2. Use the included workflow file in \`.github/workflows/deploy.yml\`\n3. Set GitHub Pages source to "GitHub Actions" in repository settings\n\n## Features\n\n- Responsive design that works on all devices\n- Dynamic GitHub project loading\n- GitHub statistics visualization\n- Light/dark theme switcher\n- Custom color picker\n\n## Credits\n\nOriginal template by [Santosh Prajapati](https://github.com/imnexerio)`
            }
        ];
          // Files to fetch from the repository
        const filesToFetch = [
            'index.html',
            'css/modern-styles.css',
            'css/advanced-animations.css',
            'css/wow-effects.css',
            'css/consolidated-responsive.css',
            'css/github-stats.css',
            'css/website-generator.css',
            'js/github-stats.js',
            'js/optimized-main.js',
            'js/website-generator.js',
            '.github/workflows/deploy.yml'
        ];
        
        // Create promises to fetch each file from GitHub
        const fetchPromises = [];
        
        // Fetch files from GitHub repository
        filesToFetch.forEach(file => {
            const fileUrl = repoBaseUrl + file;
            fetchPromises.push(
                fetch(fileUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch ${file} from GitHub`);
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
                        console.warn(`Could not fetch ${file} from GitHub:`, error);
                        // Create a placeholder file with a comment
                        if (file.endsWith('.js')) {
                            files.push({
                                path: file,
                                content: `// JS file placeholder: ${file}\n\n// This file couldn't be automatically included`
                            });
                        } else if (file.endsWith('.css')) {
                            files.push({
                                path: file,
                                content: `/* CSS file placeholder: ${file} */\n\n/* This file couldn't be automatically included */`
                            });
                        } else {
                            files.push({
                                path: file,
                                content: `<!-- Could not fetch ${file} from GitHub -->`
                            });
                        }
                    })
            );
        });
        
        // Wait for all files to be fetched
        Promise.allSettled(fetchPromises)
            .then(() => {
                resolve(files);
            })
            .catch(error => {
                console.error('Error collecting files from GitHub:', error);
                reject(error);
            });
    });
}

// Customize HTML based on configuration
function completeGeneration(config, zipBlob) {
    // Update progress and show success message
    updateProgress(100, 'Website updated successfully!');
    
    // Hide loading indicator and show success message
    setTimeout(() => {
        document.querySelector('.loading-indicator').classList.remove('active');
        document.querySelector('.success-message').classList.add('active');
          // Create download link for the ZIP file
        const downloadLink = document.getElementById('download-website');
        const url = URL.createObjectURL(zipBlob);
        downloadLink.href = url;
        downloadLink.download = `${config.github.username}-portfolio-updated.zip`;
        
        // Add a small note about what was updated
        const successMessage = document.querySelector('.success-message');
        if (successMessage) {
            const updateNote = document.createElement('div');
            updateNote.className = 'update-details';                updateNote.innerHTML = `
                <p><small>Files updated:</small></p>
                <ul>
                    <li><small>GitHub Configuration (username: ${config.github.username})</small></li>
                    <li><small>Social Media Links</small></li>
                    <li><small>GitHub Actions workflow for secure deployment</small></li>
                </ul>
                <p><small><strong>Secure Deployment Tip:</strong> For better security, set up your GitHub token as a repository secret named <code>PAT_GITHUB</code> in your GitHub repository settings instead of including it in the code.</small></p>
            `;
            
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

