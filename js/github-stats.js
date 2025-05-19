/**
 * GitHub Stats Extension
 * Handles the GitHub activity chart and additional stats
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the GitHub stats
    initGitHubStats();
});

async function initGitHubStats() {
    const username = GitHubConfig.getUsername();
    
    try {
        // Get headers from config
        const headers = GitHubConfig.getAuthHeaders();
        if (headers.Authorization) {
            console.log('GitHub Stats: Using token for API requests');
        }
        
        // Fetch basic user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`, 
            headers.Authorization ? { headers } : {});
            
        // Check rate limits
        const rateLimitRemaining = userResponse.headers.get('X-RateLimit-Remaining');
        console.log(`GitHub Stats: Rate limit remaining: ${rateLimitRemaining}`);
        
        if (!userResponse.ok) {
            if (userResponse.status === 403 && rateLimitRemaining === '0') {
                console.error('GitHub Stats: Rate limit exceeded');
                showStatsError('GitHub API rate limit exceeded. Please try again later.');
                return;
            }
            throw new Error(`Failed to fetch user data: ${userResponse.status}`);
        }
        
        const userData = await userResponse.json();
        
        // Update profile image with GitHub avatar
        setGitHubProfileImage(userData.avatar_url);
        updateUserInfoFromGitHub(userData);
          
        // Update stats elements
        document.getElementById('repo-count').textContent = userData.public_repos || '-';
          // Fetch repository data to calculate stars and forks
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, 
            headers.Authorization ? { headers } : {});
            
        // Check rate limits again
        const reposRateLimitRemaining = reposResponse.headers.get('X-RateLimit-Remaining');
        console.log(`GitHub Stats: Rate limit remaining after repos fetch: ${reposRateLimitRemaining}`);
        
        if (!reposResponse.ok) {
            if (reposResponse.status === 403 && reposRateLimitRemaining === '0') {
                console.error('GitHub Stats: Rate limit exceeded during repo fetch');
                showStatsError('GitHub API rate limit exceeded. Please try again later.');
                return;
            }
            throw new Error(`Failed to fetch repos: ${reposResponse.status}`);
        }
        
        const repos = await reposResponse.json();
        
        if (Array.isArray(repos)) {
            // Calculate total stars and forks
            const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
            const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
            
            // Update the stats
            document.getElementById('stars-count').textContent = totalStars || '-';
            document.getElementById('forks-count').textContent = totalForks || '-';
            
            // Set a placeholder for commits since GitHub API doesn't provide this directly
            // For a real implementation, you would need a backend service or use the GitHub GraphQL API with authentication
            document.getElementById('commits-count').textContent = '500+';
            
            // Extract skills from repositories and update skills section
            extractAndDisplaySkills(repos, headers);
        }        
        // Generate a simulated activity chart
        generateActivityChart();
        
        // Fetch GitHub projects for portfolio
        fetchGitHubProjects();
        
    } catch (error) {
        console.error('Error initializing GitHub stats:', error);
    }
}

// Function to set the GitHub profile image
function setGitHubProfileImage(avatarUrl) {
    if (!avatarUrl) return;
    
    // Find the profile image in the about section and replace its src
    const profileImage = document.getElementById('profile-image') || document.querySelector('.about-image img');
    if (profileImage) {
        profileImage.src = avatarUrl;
        console.log('GitHub Stats: Profile image updated with GitHub avatar');
    } else {
        console.warn('GitHub Stats: Profile image element not found');
    }

    // Also set the GitHub avatar as the favicon
    setFaviconFromGitHub(avatarUrl);
}

// Function to set the favicon using GitHub avatar
function setFaviconFromGitHub(avatarUrl) {
    if (!avatarUrl) return;
    
    // Create a new image to load the avatar
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for the image
    
    img.onload = function() {
        // Create a canvas to manipulate the image
        const canvas = document.createElement('canvas');
        const size = 64; // Standard favicon size
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Draw a circular mask for the avatar
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        
        // Draw the avatar image within the circular mask
        ctx.drawImage(img, 0, 0, size, size);
        
        // Convert the canvas to a data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        // Create or update favicon links
        const faviconLink = document.querySelector('link[rel="icon"]') || document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.href = dataUrl;
        faviconLink.type = 'image/png';
        if (!document.querySelector('link[rel="icon"]')) {
            document.head.appendChild(faviconLink);
        }
        
        // Also set the shortcut icon for compatibility
        const shortcutLink = document.querySelector('link[rel="shortcut icon"]') || document.createElement('link');
        shortcutLink.rel = 'shortcut icon';
        shortcutLink.href = dataUrl;
        shortcutLink.type = 'image/png';
        if (!document.querySelector('link[rel="shortcut icon"]')) {
            document.head.appendChild(shortcutLink);
        }
        
        console.log('GitHub Stats: Favicon updated with GitHub avatar');
    };
    
    img.onerror = function() {
        console.error('GitHub Stats: Failed to load avatar for favicon');
    };
    
    // Start loading the image
    img.src = avatarUrl;
}

// Function to update user information from GitHub profile
function updateUserInfoFromGitHub(userData) {
    if (!userData) return;

    // Update page title
    const pageTitle = document.querySelector('title');
    if (pageTitle && userData.name) {
        pageTitle.textContent = `${userData.name} - Portfolio`;
    }

    // Update hero section
    const heroName = document.querySelector('#hero .hero-content h1 .highlight');
    if (heroName && userData.name) {
        heroName.textContent = userData.name;
    }

    // Update about section
    const aboutName = document.querySelector('.info-item:nth-child(1) .info-value');
    if (aboutName && userData.name) {
        aboutName.textContent = userData.name;
    }

    const aboutGitHubUsername = document.querySelector('.info-item:nth-child(2) .info-value');
    if (aboutGitHubUsername) {
        aboutGitHubUsername.textContent = userData.login;
    }

    const aboutLocation = document.querySelector('.info-item:nth-child(3) .info-value');
    if (aboutLocation && userData.location) {
        aboutLocation.textContent = userData.location;
    }

    // Update bio if available
    const userBio = document.getElementById('user-bio');
    if (userBio && userData.bio) {
        userBio.textContent = userData.bio;
    }

    // Update contact section
    const contactLocation = document.querySelector('.contact-item:nth-child(1) .contact-text p');
    if (contactLocation && userData.location) {
        contactLocation.textContent = userData.location;
    }

    const contactEmail = document.querySelector('.contact-item:nth-child(2) .contact-text p');
    if (contactEmail && userData.email) {
        contactEmail.textContent = userData.email;
    } else if (contactEmail) {
        // GitHub API doesn't expose email if user has set it to private
        // We'll keep the existing email or set a placeholder
        if (contactEmail.textContent.includes('example.com')) {
            contactEmail.textContent = 'Contact via GitHub';
        }
    }

    const contactGitHub = document.querySelector('.contact-item:nth-child(3) .contact-text p a');
    if (contactGitHub) {
        contactGitHub.textContent = `github.com/${userData.login}`;
        contactGitHub.href = userData.html_url;
    }

    const contactRepos = document.querySelector('.contact-item:nth-child(4) .contact-text p');
    if (contactRepos) {
        contactRepos.textContent = `${userData.public_repos} Public Repositories`;
    }

    // Update footer
    const footerName = document.querySelector('#footer .footer-logo h3');
    if (footerName && userData.name) {
        footerName.textContent = userData.name;
    }

    const footerCopyright = document.querySelector('#footer .footer-bottom p');
    if (footerCopyright && userData.name) {
        const currentYear = new Date().getFullYear();
        footerCopyright.textContent = `© ${currentYear} ${userData.name}. All Rights Reserved.`;
    }
}
// Extract skills (languages) from repositories and update the skills section
async function extractAndDisplaySkills(repos, headers) {
    try {
        console.log('GitHub Stats: Extracting skills from repositories');
        
        // First, collect all languages from repositories
        const languageData = {};
        const professionalSkills = {
            'Mobile Development': { score: 0, category: 'professional' },
            'Problem Solving': { score: 0, category: 'professional' },
            'Cross-Platform Development': { score: 0, category: 'professional' },
            'Open Source Contribution': { score: repos.length, category: 'professional' }
        };
        
        // Add a fallback for empty repositories
        let hasLanguages = false;
        
        // Process repositories to extract languages
        for (const repo of repos) {
            // Skip forks to focus on original work
            if (repo.fork) continue;
            
            // Fetch languages for this repository
            const languagesResponse = await fetch(repo.languages_url, 
                headers.Authorization ? { headers } : {});
                
            if (!languagesResponse.ok) {
                console.warn(`Failed to fetch languages for ${repo.name}: ${languagesResponse.status}`);
                continue;
            }
            
            const languages = await languagesResponse.json();
            
            // If we found languages, mark flag as true
            if (Object.keys(languages).length > 0) {
                hasLanguages = true;
            }
            
            // Calculate total bytes for this repo
            const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
            
            // Add language data with weighting based on repo activity
            // Newer repos and those with more stars get higher weight
            const repoAge = new Date() - new Date(repo.created_at);
            const ageWeight = Math.max(0.5, 1 - (repoAge / (1000 * 60 * 60 * 24 * 365))); // Higher weight for newer repos
            const popularityWeight = 1 + (repo.stargazers_count * 0.1); // More stars = higher weight
            const repoWeight = ageWeight * popularityWeight;
            
            for (const [language, bytes] of Object.entries(languages)) {
                if (!languageData[language]) {
                    languageData[language] = { bytes: 0, score: 0, repos: 0 };
                }
                
                const percentage = bytes / totalBytes;
                languageData[language].bytes += bytes;
                languageData[language].score += percentage * repoWeight;
                languageData[language].repos += 1;
            }
            
            // Update professional skills based on repository topics and languages
            if (repo.topics && repo.topics.length > 0) {
                if (repo.topics.some(topic => ['android', 'ios', 'mobile', 'app'].includes(topic))) {
                    professionalSkills['Mobile Development'].score += repoWeight;
                }
                
                if (repo.topics.some(topic => ['flutter', 'react-native', 'xamarin', 'cross-platform'].includes(topic)) ||
                    Object.keys(languages).some(lang => ['Dart', 'JavaScript', 'TypeScript'].includes(lang))) {
                    professionalSkills['Cross-Platform Development'].score += repoWeight;
                }
                
                if (repo.topics.some(topic => ['algorithm', 'problem-solving', 'leetcode', 'competitive-programming'].includes(topic))) {
                    professionalSkills['Problem Solving'].score += repoWeight;
                }
            }
        }
          // If no languages were found, display an error message
        if (!hasLanguages || Object.keys(languageData).length === 0) {
            console.error('GitHub Stats: No languages found in repositories');
            showStatsError('No programming languages found in your GitHub repositories.');
            return;
        }
          // Normalize and limit the number of programming languages
        const maxLanguages = GitHubConfig.getConfig('maxLanguages') || 6;
        const minLanguagePercentage = GitHubConfig.getConfig('minLanguagePercentage') || 1;
        
        // Sort languages by score
        const sortedLanguages = Object.entries(languageData)
            .sort((a, b) => b[1].score - a[1].score)
            .slice(0, maxLanguages);
            
        // Calculate max score for normalization
        const maxLanguageScore = sortedLanguages.length > 0 ? sortedLanguages[0][1].score : 100;
        
        // Prepare languages for display with normalized scores (between 50% and 95%)
        const languages = sortedLanguages.map(([name, data]) => {
            const normalizedScore = Math.round(50 + (data.score / maxLanguageScore) * 45);
            return {
                name,
                percentage: normalizedScore,
                category: 'language'
            };
        });
        
        // Normalize professional skills (between 65% and 95%)
        const proSkillsEntries = Object.entries(professionalSkills);
        const maxProScore = Math.max(...proSkillsEntries.map(([_, data]) => data.score));
        
        const professionalSkillsArray = proSkillsEntries.map(([name, data]) => {
            const normalizedScore = Math.round(65 + (data.score / (maxProScore || 1)) * 30);
            return {
                name,
                percentage: normalizedScore,
                category: 'professional'
            };
        });
        
        // Now update the skills section with the dynamic data
        updateSkillsSection(languages, professionalSkillsArray);
          } catch (error) {
        console.error('Error extracting skills:', error);
        
        // Show error message instead of using fallback data
        showStatsError('Failed to extract skills from GitHub repositories. Please try again later.');
        
        // Clear skill sections to indicate error
        const languageSkillsContainer = document.querySelector('#skills .skill-category:nth-child(1) .skills-grid');
        const professionalSkillsContainer = document.querySelector('#skills .skill-category:nth-child(2) .skills-grid');
        
        if (languageSkillsContainer && professionalSkillsContainer) {
            languageSkillsContainer.innerHTML = '<div class="error-message">Unable to load language skills</div>';
            professionalSkillsContainer.innerHTML = '<div class="error-message">Unable to load professional skills</div>';
        }
    }
}

// Update the skills section in the DOM with dynamic data
function updateSkillsSection(languages, professionalSkills) {
    // Get the skill categories containers
    const languageSkillsContainer = document.querySelector('#skills .skill-category:nth-child(1) .skills-grid');
    const professionalSkillsContainer = document.querySelector('#skills .skill-category:nth-child(2) .skills-grid');
    
    if (!languageSkillsContainer || !professionalSkillsContainer) {
        console.error('GitHub Stats: Skills containers not found in the DOM');
        return;
    }
    
    // Clear existing skills
    languageSkillsContainer.innerHTML = '';
    professionalSkillsContainer.innerHTML = '';
    
    // Add programming languages
    languages.forEach((skill, index) => {
        const skillItem = createSkillElement(skill.name, skill.percentage, index + 1);
        languageSkillsContainer.appendChild(skillItem);
    });
    
    // Add professional skills
    professionalSkills.forEach((skill, index) => {
        const skillItem = createSkillElement(skill.name, skill.percentage, index + 1);
        professionalSkillsContainer.appendChild(skillItem);
    });
    
    // Reinitialize the skills animation
    initSkillsAnimation();
    
    // Re-initialize 3D card effects and other interactive elements for new skill items
    reinitializeCardEffects();
}

// Reinitialize card effects and other interactive animations on newly added elements
function reinitializeCardEffects() {
    // Use a slightly longer timeout to ensure DOM is fully updated
    setTimeout(() => {
        // Get all the newly added card elements
        const newCards = document.querySelectorAll('#skills .skill-item.card-3d');
        
        console.log('Reinitializing 3D effects for', newCards.length, 'skill cards');
        
        // Apply 3D card effect manually to each new card
        newCards.forEach(card => {
            // Mouse move effect for 3D rotation
            card.addEventListener('mousemove', (e) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                const mouseX = e.clientX - cardCenterX;
                const mouseY = e.clientY - cardCenterY;
                
                // Calculate rotation based on mouse position
                const rotateY = (mouseX / (cardRect.width / 2)) * 15; // Max 15 degrees
                const rotateX = -((mouseY / (cardRect.height / 2)) * 15); // Max 15 degrees
                
                // Apply the transform
                requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });
            });
            
            // Reset on mouse leave
            card.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                });
            });
        });
        
        // Also reinitialize magnetic effect if available
        if (typeof initMagneticElements === 'function') {
            try {
                initMagneticElements();
            } catch (e) {
                console.warn('Could not reinitialize magnetic elements:', e);
            }
        }
        
        // If there's a global init3DCardEffect function also try to call it
        if (typeof init3DCardEffect === 'function') {
            try {
                init3DCardEffect();
            } catch (e) {
                console.warn('Could not call global init3DCardEffect:', e);
            }
        }
    }, 300); // Longer timeout for reliable initialization
}

// Helper function to create a skill element with the same structure and classes as the original
function createSkillElement(name, percentage, delay) {
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item card-3d scroll-scale';
    skillItem.classList.add(`delay-${delay <= 5 ? delay : 5}`);
    
    skillItem.innerHTML = `
        <div class="skill-info">
            <h4>${name}</h4>
            <p>${percentage}%</p>
        </div>
        <div class="skill-bar">
            <div class="skill-level" style="width: 0%;"></div>
        </div>
    `;
    
    return skillItem;
}

// Show error message when stats can't be loaded
function showStatsError(message) {
    console.error('GitHub Stats Error:', message);
    
    // Update UI elements with error messages
    const statsElements = [
        'repo-count',
        'stars-count',
        'forks-count',
        'commits-count'
    ];
    
    // Show error state in all stats elements
    statsElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '⚠️';
            element.style.color = '#ff5252';
            element.title = message;
        }
    });
    
    // Also try to show error in the chart if it exists
    const chartContainer = document.getElementById('github-activity-chart');
    if (chartContainer) {
        chartContainer.innerHTML = `<div class="chart-error">${message}</div>`;
    }
    
    // Add error class to skills section if it exists
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        skillsSection.classList.add('skills-error');
        // Add a data attribute to hold the error message
        skillsSection.setAttribute('data-error', message);
    }
}

/**
 * Fetch GitHub repositories to display as projects
 */
async function fetchGitHubProjects() {
    const username = GitHubConfig.getUsername();
    const headers = GitHubConfig.getAuthHeaders();
    const projectsContainer = document.querySelector('.portfolio-grid');
    const portfolioFilter = document.querySelector('.portfolio-filter');
    
    if (!projectsContainer) {
        console.error('GitHub Projects: Projects container not found');
        return;
    }
    
    try {
        console.log('GitHub Projects: Fetching repositories');
        
        // Show loading state (the loading message is already in the HTML)
        
        // Fetch all repositories by making multiple API calls if needed
        let allRepos = [];
        let page = 1;
        let hasMoreRepos = true;
        
        while (hasMoreRepos) {
            console.log(`GitHub Projects: Fetching page ${page} of repositories`);
            
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100&page=${page}`, 
                headers.Authorization ? { headers } : {});
                
            if (!reposResponse.ok) {
                if (reposResponse.status === 403 && reposResponse.headers.get('X-RateLimit-Remaining') === '0') {
                    console.error('GitHub Projects: Rate limit exceeded');
                    throw new Error('GitHub API rate limit exceeded. Please try again later.');
                }
                throw new Error(`Failed to fetch repos: ${reposResponse.status}`);
            }
            
            const repos = await reposResponse.json();
            
            if (Array.isArray(repos) && repos.length > 0) {
                allRepos = [...allRepos, ...repos];
                
                // If we got fewer repos than the max per page, we've reached the end
                if (repos.length < 100) {
                    hasMoreRepos = false;
                } else {
                    // Otherwise, fetch the next page
                    page++;
                }
            } else {
                // No more repos or empty response
                hasMoreRepos = false;
            }
        }
        
        console.log(`GitHub Projects: Fetched a total of ${allRepos.length} repositories`);
        
        if (allRepos.length === 0) {
            console.error('GitHub Projects: No repositories found');
            throw new Error('No GitHub repositories found.');
        }
        
        // Clear existing projects
        projectsContainer.innerHTML = '';
        
        // Track unique languages for filter
        const languages = new Set(['all']);
        
        // Create project details object for modal
        const projectDetails = {};
        
        // Process each repository and add it to the portfolio grid
        allRepos.forEach((repo, index) => {
            // Skip forked repositories if needed
            if (repo.fork) return;
            
            // Determine the main language for filtering
            const language = repo.language || 'Other';
            languages.add(language.toLowerCase());
            
            // Set delay class for animation (max delay-5)
            const delay = Math.min(index + 1, 5);
              // Create the portfolio item HTML
            const portfolioItem = document.createElement('div');
            portfolioItem.className = `portfolio-item card-3d scroll-scale delay-${delay}`;
            portfolioItem.setAttribute('data-category', language.toLowerCase());            // Set initial styles for proper rendering
            portfolioItem.style.opacity = '1';
            portfolioItem.style.transform = 'scale(1)';
            
            // First try to use a custom preview.png from the repository's main branch
            // Then fallback to GitHub OpenGraph image if not found
            const customPreviewUrl = `https://raw.githubusercontent.com/${username}/${repo.name}/main/preview.png`;
            const githubOgPreviewUrl = `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
            const fallbackImageUrl = `https://github.com/identicons/${repo.name}.png`;
            
            // Use the custom preview image with fallback logic
            // We'll set it to the GitHub OpenGraph image first, then check if the custom preview exists
            let imageUrl = githubOgPreviewUrl;
            
            // Create an image element to test if the custom preview exists
            const imgTest = new Image();
            imgTest.onload = function() {
                // If the custom preview image loads successfully, update the project image
                const imgElement = portfolioItem.querySelector('.portfolio-img img');
                if (imgElement) {
                    imgElement.src = customPreviewUrl;
                }
                // Also update the image URL in the project details for the modal
                if (projectDetails[index + 1]) {
                    projectDetails[index + 1].image = customPreviewUrl;
                }
            };
            // Set the source to test if image exists
            imgTest.src = customPreviewUrl;
            
            // Prepare date string
            const createdDate = new Date(repo.created_at);
            const dateString = createdDate.getFullYear().toString();
            
            // Store project details for modal
            const projectId = index + 1;
            projectDetails[projectId] = {
                title: repo.name,
                category: language,
                client: 'Open Source',
                date: dateString,
                description: repo.description || `A ${language} project hosted on GitHub.`,
                technologies: [language],
                image: imageUrl,
                url: repo.html_url
            };
            
            // Create HTML for the portfolio item
            portfolioItem.innerHTML = `
                <div class="portfolio-img">
                    <img src="${imageUrl}" alt="${repo.name}">
                </div>
                <div class="portfolio-info">
                    <h3>${repo.name}</h3>
                    <p>${language}</p>
                    <div class="portfolio-links">
                        <a href="${repo.html_url}" class="portfolio-link magnetic" target="_blank" title="View Repository"><i class="fas fa-link"></i></a>
                        <a href="#" class="portfolio-details magnetic" data-id="${projectId}" title="View Details"><i class="fas fa-search"></i></a>
                    </div>
                </div>
            `;
            
            projectsContainer.appendChild(portfolioItem);
        });
        
        // Update filter buttons based on available languages
        if (portfolioFilter) {
            portfolioFilter.innerHTML = '';
            
            // Add "All" button
            const allButton = document.createElement('button');
            allButton.className = 'filter-btn active magnetic';
            allButton.setAttribute('data-filter', 'all');
            allButton.textContent = 'All';
            portfolioFilter.appendChild(allButton);
            
            // Add language-specific filter buttons
            Array.from(languages)
                .filter(lang => lang !== 'all')
                .sort()
                .forEach(language => {
                    const button = document.createElement('button');
                    button.className = 'filter-btn magnetic';
                    button.setAttribute('data-filter', language.toLowerCase());
                    button.textContent = language.charAt(0).toUpperCase() + language.slice(1); // Capitalize
                    portfolioFilter.appendChild(button);
                });
                
            // Reinitialize portfolio filters
            initPortfolioFilters();
        }
        
        // Update the project details data in the global scope
        window.projectDetailsData = projectDetails;
          // Reinitialize portfolio modal with new data
        initPortfolioModal(projectDetails);
        
        // Reinitialize 3D effects on portfolio items
        const portfolioItems = document.querySelectorAll('.portfolio-item.card-3d');
        initializeCardEffects(portfolioItems);
        
        // Trigger a click on the "All" filter button to show all projects by default
        const allFilterButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allFilterButton) {
            setTimeout(() => {
                allFilterButton.click();
            }, 100);
        }
          } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsContainer.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>
                Failed to load projects. ${error.message}
            </div>
        `;
    }
}

// Helper function to initialize card effects specifically for portfolio items
function initializeCardEffects(cards) {
    setTimeout(() => {
        cards.forEach(card => {
            // Mouse move effect for 3D rotation
            card.addEventListener('mousemove', (e) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                const mouseX = e.clientX - cardCenterX;
                const mouseY = e.clientY - cardCenterY;
                
                // Calculate rotation based on mouse position
                const rotateY = (mouseX / (cardRect.width / 2)) * 15; // Max 15 degrees
                const rotateX = -((mouseY / (cardRect.height / 2)) * 15); // Max 15 degrees
                
                // Apply the transform
                requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });
            });
            
            // Reset on mouse leave
            card.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                });
            });
        });
    }, 300);
}

/**
 * Function to reinitialize portfolio filters
 * This is called after dynamically loading projects from GitHub
 */
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!filterButtons.length || !portfolioItems.length) {
        console.error('GitHub Projects: Filter buttons or portfolio items not found');
        return;
    }
    
    // Make all items visible initially
    portfolioItems.forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
    });
    
    // Debounce function to improve performance
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // Remove any existing event listeners (if possible)
    filterButtons.forEach(button => {
        button.replaceWith(button.cloneNode(true));
    });
    
    // Add event listeners to new buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', debounce(function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
              // Filter items
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        }, 100));
    });
    
    console.log('GitHub Projects: Portfolio filters reinitialized');
}

function generateActivityChart() {
    const grid = document.getElementById('activity-grid');
    if (!grid) return;
    
    // Clear any existing content
    grid.innerHTML = '';
    
    // Create 16 columns (representing 16 weeks)
    for (let i = 0; i < 16; i++) {
        const column = document.createElement('div');
        column.className = 'activity-col';
        
        // Each column has 7 cells (days of the week)
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('div');
            cell.className = 'activity-cell';
            
            // Simulate activity levels (for demonstration)
            // In a real implementation, this data would come from the GitHub API
            const activityLevel = Math.floor(Math.random() * 5); // 0-4
            cell.classList.add(`activity-level-${activityLevel}`);
            
            column.appendChild(cell);
        }
        
        grid.appendChild(column);
    }
}
