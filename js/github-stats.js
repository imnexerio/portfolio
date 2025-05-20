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
        
        // Fetch and display user bio from README
        fetchUserBioFromReadme(username, headers);
          
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

    // Update bio if available from user data (will be overwritten by README bio if available)
    const userBio = document.getElementById('user-bio');
    const userBioContinued = document.getElementById('user-bio-continued');
    
    if (userBio && userData.bio) {
        userBio.textContent = userData.bio;
        // Clear the second paragraph since we have only one from the profile bio
        if (userBioContinued) {
            userBioContinued.innerHTML = '';
        }
    }
}

// Function to update GitHub bio with improved handling for multiple paragraphs
function updateBioFromReadmeImproved(readmeData) {
    if (!readmeData || !readmeData.content) return;
    
    // Decode the base64-encoded content
    const decodedContent = atob(readmeData.content.replace(/\n/g, ''));
    
    // Extract bio section from README - looking for sections or paragraphs
    let bioContent = '';
    
    // Try to find a section titled "About Me" or similar
    const aboutSectionMatch = decodedContent.match(/#+\s*(About\s*Me|Bio|Introduction|Profile|About|Sobre\s*mí|Biografía)/i);
    if (aboutSectionMatch) {
        const sectionStart = decodedContent.indexOf(aboutSectionMatch[0]);
        let sectionEnd = decodedContent.indexOf('#', sectionStart + 1);
        if (sectionEnd === -1) sectionEnd = decodedContent.length;
        
        // Extract the section content
        bioContent = decodedContent.substring(sectionStart, sectionEnd).trim();
        
        // Remove the section header
        bioContent = bioContent.replace(aboutSectionMatch[0], '').trim();
    } else {
        // If no section found, use the first paragraphs
        const paragraphs = decodedContent.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
        if (paragraphs.length > 0) {
            // Use first three paragraphs or what's available
            bioContent = paragraphs.slice(0, Math.min(3, paragraphs.length)).join('\n\n');
        }
    }
    
    // Clean up markdown syntax for display
    bioContent = cleanMarkdown(bioContent);
    
    // Update the bio element if content was found
    if (bioContent) {
        const userBio = document.getElementById('user-bio');
        const userBioContinued = document.getElementById('user-bio-continued');
        
        if (userBio) {
            // If there are multiple paragraphs, split them between the two elements
            const bioParagraphs = bioContent.split('\n\n');
            
            userBio.innerHTML = bioParagraphs[0] || '';
            console.log('GitHub Stats: Bio updated from README');
            
            if (bioParagraphs.length > 1 && userBioContinued) {
                userBioContinued.innerHTML = bioParagraphs.slice(1).join('<br><br>');
                userBioContinued.style.display = 'block'; // Ensure it's visible
            } else if (userBioContinued) {
                // If no second paragraph, make sure it's not empty
                userBioContinued.innerHTML = '';
                userBioContinued.style.display = 'none'; // Hide if empty
            }
        }
    }
}

// Helper function to clean markdown syntax for HTML display
function cleanMarkdown(text) {
    if (!text) return '';
    
    // Replace markdown links with HTML links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Replace bold syntax
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    
    // Replace italic syntax
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Replace code blocks and inline code
    text = text.replace(/```[\s\S]*?```/g, (match) => {
        const code = match.replace(/```(?:\w+)?\n([\s\S]*?)```/g, '$1').trim();
        return `<pre><code>${code}</code></pre>`;
    });
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Replace headers (h4-h6 only since we're in a paragraph context)
    text = text.replace(/####\s*([^\n]+)/g, '<h4>$1</h4>');
    text = text.replace(/#####\s*([^\n]+)/g, '<h5>$1</h5>');
    text = text.replace(/######\s*([^\n]+)/g, '<h6>$1</h6>');
    
    // Replace unordered lists
    text = text.replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Replace ordered lists
    text = text.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.+<\/li>\n?)+/g, (match) => {
        // Only replace with ol if not already wrapped in ul
        if (!match.startsWith('<ul>')) {
            return `<ol>${match}</ol>`;
        }
        return match;
    });
    
    return text;
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
        
        // Clear existing projects immediately
        projectsContainer.innerHTML = '';
        
        // Track unique languages for filter
        const languages = new Set(['all']);
        
        // Create project details object for modal
        const projectDetails = {};
        
        // Track all repos for final processing
        let allRepos = [];
        let page = 1;
        let hasMoreRepos = true;
        let processedCount = 0;
        
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
                // Process this batch immediately
                console.log(`GitHub Projects: Processing batch of ${repos.length} repositories`);
                
                // Add to total repos collection
                allRepos = [...allRepos, ...repos];
                
                // Process repositories from this batch and add them to the grid immediately
                repos.forEach((repo, batchIndex) => {                    // Skip forked repositories
                    if (repo.fork) return;
                    
                    // Add to the portfolio grid with progressive loading
                    processRepositoryItem(repo, processedCount, projectsContainer, projectDetails, languages, username);
                    processedCount++;});
                
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
            throw new Error('No GitHub repositories found.');        }
        
        // Helper function to process a single repository
        function processRepositoryItem(repo, index, container, details, langs, user) {
            // Skip forked repositories if needed
            if (repo.fork) return;
              // Determine the main language for filtering
            const language = repo.language || 'Other';
            langs.add(language.toLowerCase());
            
            // Set delay class for animation (max delay-5)
            const delay = Math.min(index + 1, 5);
            
            // Create the portfolio item HTML
            const portfolioItem = document.createElement('div');
            portfolioItem.className = `portfolio-item card-3d scroll-scale delay-${delay}`;
            portfolioItem.setAttribute('data-category', language.toLowerCase());
            // Set initial styles for proper rendering
            portfolioItem.style.opacity = '1';
            portfolioItem.style.transform = 'scale(1)';
            
            // Try to use custom preview images from the repository's main branch
            // First try PNG (faster loading) then switch to GIF (for animation)
            const customPreviewPngUrl = `https://raw.githubusercontent.com/${user}/${repo.name}/main/public-portfolio/preview.png`;
            const customPreviewGifUrl = `https://raw.githubusercontent.com/${user}/${repo.name}/main/public-portfolio/preview.gif`;
            const githubOgPreviewUrl = `https://opengraph.githubassets.com/1/${user}/${repo.name}`;
            const fallbackImageUrl = `https://github.com/identicons/${repo.name}.png`;
            
            // Use the GitHub OpenGraph image as initial fallback
            let imageUrl = githubOgPreviewUrl;
            
            // First check if preview.png exists
            const imgTestPng = new Image();
            imgTestPng.onload = function() {                // If PNG exists, update immediately as it's faster to load
                const imgElement = portfolioItem.querySelector('.portfolio-img img');
                if (imgElement) {
                    imgElement.src = customPreviewPngUrl;
                }
                // Also update the project details for the modal
                if (details[index + 1]) {
                    details[index + 1].image = customPreviewPngUrl;
                }
                
                // Then try to load the GIF in the background
                const imgTestGif = new Image();
                imgTestGif.onload = function() {
                    // When GIF is loaded, switch to it for animation
                    const imgElement = portfolioItem.querySelector('.portfolio-img img');
                    if (imgElement) {
                        imgElement.src = customPreviewGifUrl;
                    }
                    // Update project details to use GIF for modal
                    if (details[index + 1]) {
                        details[index + 1].image = customPreviewGifUrl;
                    }
                };
                // Set the source to test if GIF exists
                imgTestGif.src = customPreviewGifUrl;
            };
            // Set the source to test if PNG exists
            imgTestPng.src = customPreviewPngUrl;
            
            // Prepare date string
            const createdDate = new Date(repo.created_at);
            const dateString = createdDate.getFullYear().toString();
              // Store project details for modal
            const projectId = index + 1;
            details[projectId] = {
                title: repo.name,
                category: language,
                client: 'Open Source',
                date: dateString,
                description: repo.description || `A ${language} project hosted on GitHub.`,
                technologies: [language],
                image: imageUrl,
                url: repo.html_url
            };            // Create HTML for the portfolio item
            portfolioItem.innerHTML = `
                <div class="portfolio-img">
                    <img src="${imageUrl}" alt="${repo.name}">
                </div>
                <div class="portfolio-info">
                    <h3>${repo.name}</h3>
                    <p>${language}</p>
                    <div class="portfolio-links">
                        <a href="${repo.html_url}" class="portfolio-link magnetic" target="_blank" title="View Repository"><i class="fas fa-link"></i></a>
                        <a href="#" class="portfolio-details magnetic" data-id="${projectId}" data-repo="${repo.name}" title="View Details"><i class="fas fa-search"></i></a>
                    </div>
                </div>
            `;
              // Add to the DOM
            container.appendChild(portfolioItem);
              // Set up hover functionality to prefetch README when user hovers over the item
            portfolioItem.addEventListener('mouseenter', () => {
                // Set a data attribute to track if we've already started fetching the README
                if (!portfolioItem.dataset.readmeFetching) {
                    portfolioItem.dataset.readmeFetching = 'true';
                    
                    // Small delay to avoid unnecessary fetches if user is just moving the mouse across items
                    portfolioItem.readmeTimer = setTimeout(() => {
                        const repoName = repo.name;
                        // Store the repo object in the DOM element for later access                        portfolioItem.repoData = portfolioItem.repoData || {};
                        
                        // Begin fetching the README but don't display it yet
                        // This preload will make it faster when the modal is actually opened
                        console.log(`Pre-fetching README for ${repoName}`);
                        portfolioItem.repoData.readmePromise = fetch(`https://api.github.com/repos/${user}/${repoName}/readme`)
                            .then(response => {
                                if (response.ok) {
                                    console.log(`Successfully pre-fetched README for ${repoName}`);
                                    return response.json();
                                }
                                console.warn(`No README found for ${repoName}`);
                                return null; // README not found or other error
                            })
                            .catch(error => {
                                console.warn(`Error pre-fetching README for ${repoName}:`, error);
                                return null;
                            });
                    }, 300); // 300ms delay before starting to fetch
                }
            });
            
            // Clear the timer if user moves away before the delay
            portfolioItem.addEventListener('mouseleave', () => {
                if (portfolioItem.readmeTimer) {
                    clearTimeout(portfolioItem.readmeTimer);
                }
            });
            
            // Apply card effect to this specific item
            setTimeout(() => {
                // Mouse move effect for 3D rotation
                portfolioItem.addEventListener('mousemove', (e) => {
                    const cardRect = portfolioItem.getBoundingClientRect();
                    const cardCenterX = cardRect.left + cardRect.width / 2;
                    const cardCenterY = cardRect.top + cardRect.height / 2;
                    const mouseX = e.clientX - cardCenterX;
                    const mouseY = e.clientY - cardCenterY;
                    
                    // Calculate rotation based on mouse position
                    const rotateY = (mouseX / (cardRect.width / 2)) * 15; // Max 15 degrees
                    const rotateX = -((mouseY / (cardRect.height / 2)) * 15); // Max 15 degrees
                    
                    // Apply the transform
                    requestAnimationFrame(() => {
                        portfolioItem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    });
                });
                
                // Reset on mouse leave
                portfolioItem.addEventListener('mouseleave', () => {
                    requestAnimationFrame(() => {
                        portfolioItem.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                    });                });
            }, 100);
        }
        
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

async function fetchUserBioFromReadme(username, headers) {
    try {
        // Add loading animation to bio elements
        const userBio = document.getElementById('user-bio');
        const userBioContinued = document.getElementById('user-bio-continued');
        
        if (userBio) {
            userBio.classList.add('bio-loading');
        }
        
        // First, try to fetch the profile's README (username/username repository)
        const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${username}/readme`, 
            headers.Authorization ? { headers } : {});
        
        // If profile README not found, try to fetch from a repository called "profile"
        if (!readmeResponse.ok && readmeResponse.status === 404) {
            console.log('GitHub Stats: Profile README not found, trying profile repository');
            const profileReadmeResponse = await fetch(`https://api.github.com/repos/${username}/profile/readme`, 
                headers.Authorization ? { headers } : {});
                
            if (!profileReadmeResponse.ok) {
                throw new Error(`Failed to fetch README: ${profileReadmeResponse.status}`);
            }
            
            const readmeData = await profileReadmeResponse.json();
            updateBioFromReadmeImproved(readmeData);
        } else if (!readmeResponse.ok) {
            throw new Error(`Failed to fetch README: ${readmeResponse.status}`);
        } else {
            const readmeData = await readmeResponse.json();
            updateBioFromReadmeImproved(readmeData);
        }
        
        // Remove loading animation
        if (userBio) {
            userBio.classList.remove('bio-loading');
        }
    } catch (error) {
        console.warn('GitHub Stats: Could not fetch bio from README:', error);
        // If README fetch fails, use GitHub profile bio as fallback
        const userBio = document.getElementById('user-bio');
        const userBioContinued = document.getElementById('user-bio-continued');
        
        // Remove loading animation
        if (userBio) {
            userBio.classList.remove('bio-loading');
        }
        
        const userData = await fetch(`https://api.github.com/users/${username}`, 
            headers.Authorization ? { headers } : {}).then(res => res.json());
            
        if (userBio && userData.bio) {
            userBio.textContent = userData.bio;
            // Clear the continued bio element if using fallback
            if (userBioContinued) {
                userBioContinued.innerHTML = '';
            }
            console.log('GitHub Stats: Using GitHub profile bio as fallback');
        }
    }
}

// Function to fetch repository README and update the modal
async function fetchRepoReadme(username, repoName, displayElement) {
    // Show loading indicator
    displayElement.innerHTML = '<div class="readme-loading"><i class="fas fa-spinner fa-spin"></i> Loading README...</div>';
    
    try {
        let readmeData = null;        // Check if we have a prefetched README promise for this repo
        const portfolioItems = document.querySelectorAll(`.portfolio-details[data-repo="${repoName}"]`);
        let prefetchedData = null;
        
        if (portfolioItems.length > 0) {
            const portfolioItem = portfolioItems[0].closest('.portfolio-item');
            
            if (portfolioItem && portfolioItem.repoData && portfolioItem.repoData.readmePromise) {
                console.log(`Using prefetched README data for ${repoName}`);
                try {
                    prefetchedData = await portfolioItem.repoData.readmePromise;
                } catch (err) {
                    console.warn(`Error retrieving prefetched README for ${repoName}:`, err);
                    // We'll continue and fetch it directly below
                }
            }
        }
        
        // If we have prefetched data, use it; otherwise, fetch it now
        if (prefetchedData) {
            console.log(`Using prefetched README for ${repoName}`);
            readmeData = prefetchedData;
        } else {
            // Fetch the README file
            const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`);
            
            if (readmeResponse.ok) {
                readmeData = await readmeResponse.json();
            } else {
                // README not found
                displayElement.innerHTML = '<div class="readme-not-found">No README available for this repository.</div>';
                return;
            }
        }
        
        // If we have README data, decode and display it
        if (readmeData) {            // Decode content from base64
            const content = atob(readmeData.content);
            
            // Format the last updated date if available
            let lastUpdatedText = '';
            if (readmeData.sha) {
                const readmeUrl = readmeData.html_url || `https://github.com/${username}/${repoName}/blob/main/README.md`;
                lastUpdatedText = `
                    <div class="readme-meta">
                        <a href="${readmeUrl}" target="_blank" class="view-on-github">View full README on GitHub</a>
                    </div>
                `;
            }
              // Clean up and format the content
            let formattedContent = cleanMarkdown(content);
            
            // Basic safety check - if suspicious content is detected, use text-only version
            if (formattedContent.includes('<script') || 
                formattedContent.includes('javascript:') || 
                formattedContent.includes('onerror=')) {
                console.warn('Potentially unsafe content detected in README, using text-only version');
                formattedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                formattedContent = '<pre style="white-space: pre-wrap;">' + formattedContent + '</pre>';
            }
              // Update the display element with the README content
            displayElement.innerHTML = `
                <div class="readme-content">
                    <h3>README ${lastUpdatedText}</h3>
                    <div class="markdown-body">${formattedContent}</div>
                    <div class="readme-expand-container">
                        <button class="readme-expand-btn">Show More</button>
                    </div>
                </div>
            `;
            
            // Add event listener for the show more button
            const readmeContent = displayElement.querySelector('.markdown-body');
            const expandBtn = displayElement.querySelector('.readme-expand-btn');
            const expandContainer = displayElement.querySelector('.readme-expand-container');
            
            if (readmeContent && expandBtn) {
                // Check if the content is overflowing
                setTimeout(() => {
                    if (readmeContent.scrollHeight > readmeContent.clientHeight) {
                        // Content is overflowing, show the expand button
                        expandContainer.style.display = 'flex';
                        
                        // Add click handler
                        expandBtn.addEventListener('click', () => {
                            if (readmeContent.classList.contains('expanded')) {
                                // Collapse
                                readmeContent.classList.remove('expanded');
                                expandBtn.textContent = 'Show More';
                                
                                // Scroll back to the top of the README
                                readmeContent.scrollTop = 0;
                            } else {
                                // Expand
                                readmeContent.classList.add('expanded');
                                expandBtn.textContent = 'Show Less';
                            }
                        });
                    } else {
                        // Content fits, hide the button
                        expandContainer.style.display = 'none';
                    }
                }, 100);
            }
        } else {
            displayElement.innerHTML = '<div class="readme-not-found">No README available for this repository.</div>';
        }
    } catch (error) {
        console.error('Error fetching README:', error);
        displayElement.innerHTML = '<div class="readme-error">Failed to load README: ' + error.message + '</div>';
    }
}
