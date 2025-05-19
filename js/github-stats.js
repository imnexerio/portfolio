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
        }
        
        // Generate a simulated activity chart
        generateActivityChart();
        
    } catch (error) {
        console.error('Error initializing GitHub stats:', error);
    }
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
