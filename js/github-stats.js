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
        
    } catch (error) {
        console.error('Error initializing GitHub stats:', error);
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
        
        // Normalize and limit the number of programming languages
        const maxLanguages = GitHubConfig.getConfig('maxLanguages') || 6;
        const minLanguagePercentage = GitHubConfig.getConfig('minLanguagePercentage') || 1;
        
        // Sort languages by score
        const sortedLanguages = Object.entries(languageData)
            .sort((a, b) => b[1].score - a[1].score)
            .slice(0, maxLanguages);
            
        // Calculate max score for normalization
        const maxLanguageScore = sortedLanguages[0][1].score;
        
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
            const normalizedScore = Math.round(65 + (data.score / maxProScore) * 30);
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

// For a more complete implementation, you would need to use the GitHub GraphQL API with authentication
// to fetch the actual contribution data. This would typically be done through a backend service to
// protect your API token. The implementation above provides a visual demonstration of what it would
// look like without requiring server-side code.
