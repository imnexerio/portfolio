// Social media links configuration
const socialLinks = [
    {
        platform: 'github',
        url: 'https://github.com/imnexerio',
        icon: 'fab fa-github',
        title: 'GitHub'
    },
    {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/imnexerio/',
        icon: 'fab fa-linkedin-in',
        title: 'LinkedIn'
    },
    {
        platform: 'twitter',
        url: 'https://www.twitter.com/imnexerio/',
        icon: 'fab fa-twitter',
        title: 'Twitter'
    },
    {
        platform: 'instagram',
        url: 'https://www.instagram.com/imnexerio/',
        icon: 'fab fa-instagram',
        title: 'Instagram'
    }
];

// Function to render social media links in specified containers
function renderSocialLinks() {
    // Find all containers with class 'social-icons'
    const socialContainers = document.querySelectorAll('.social-icons');
    
    // Check if viewing a guest profile
    const isGuest = window.GitHubConfig && window.GitHubConfig.isGuestProfile();
    
    // For each container, render the social links
    socialContainers.forEach(container => {
        // Clear existing content
        container.innerHTML = '';
        
        // If viewing guest profile, hide social links completely (Option 1)
        if (isGuest) {
            container.style.display = 'none';
            return;
        }
        
        // Show container for default profile
        container.style.display = '';
        
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
document.addEventListener('DOMContentLoaded', renderSocialLinks);
