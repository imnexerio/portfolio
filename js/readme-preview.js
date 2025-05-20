// Function to implement hover-to-open and mouseleave-to-close for README modals
function initReadmeHoverBehavior() {
    // Get all portfolio items that might have README content
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.querySelector('.portfolio-modal');
    const modalContent = document.querySelector('.modal-body');
    
    if (!portfolioItems.length || !modal || !modalContent) return;
    
    // Small floating README preview container
    const readmePreview = document.createElement('div');
    readmePreview.className = 'readme-preview';
    readmePreview.innerHTML = `
        <div class="readme-preview-header">
            <h4>README Preview</h4>
            <button class="readme-preview-close">&times;</button>
        </div>
        <div class="readme-preview-content"></div>
    `;
    document.body.appendChild(readmePreview);
    
    // Close button functionality
    const closeBtn = readmePreview.querySelector('.readme-preview-close');
    closeBtn.addEventListener('click', () => {
        readmePreview.classList.remove('active');
    });
    
    let hoverTimer;
    let leaveTimer;
    
    // Add event listeners to all portfolio items
    portfolioItems.forEach(item => {
        // On hover, show README preview after short delay
        item.addEventListener('mouseenter', () => {
            // Clear any existing timers
            clearTimeout(leaveTimer);
            
            // Set timer to show preview
            hoverTimer = setTimeout(() => {
                // Only show if modal is not open
                if (modal.style.display !== 'block') {
                    const repoName = item.getAttribute('data-repo');
                    const userId = GitHubConfig.getUsername();
                    
                    if (!repoName || !userId) return;                    // Position the preview relative to the portfolio item
                    const rect = item.getBoundingClientRect();
                    const previewHeight = 350; // Maximum height of the preview as defined in CSS
                    
                    // Check if there's enough space above the item
                    const spaceAbove = rect.top;
                    
                    // Remove positioning classes
                    readmePreview.classList.remove('position-top', 'position-bottom');
                    
                    // Calculate horizontal positioning for the arrow
                    const itemCenter = rect.left + (rect.width / 2);
                    const arrowOffset = itemCenter - rect.left;
                    
                    // Adjust CSS arrow position to align with the center of the item
                    readmePreview.style.setProperty('--arrow-offset', `${arrowOffset}px`);
                    
                    if (spaceAbove >= previewHeight + 20) {
                        // Position above the item if there's enough space
                        readmePreview.style.top = `${rect.top + window.scrollY - previewHeight - 10}px`;
                        readmePreview.classList.add('position-top');
                    } else {
                        // Fall back to positioning below the item
                        readmePreview.style.top = `${rect.bottom + window.scrollY + 10}px`;
                        readmePreview.classList.add('position-bottom');
                    }
                    
                    // Center the preview horizontally under the portfolio item
                    const leftPosition = rect.left + window.scrollX + (rect.width / 2) - (Math.min(350, Math.max(300, rect.width)) / 2);
                    readmePreview.style.left = `${Math.max(10, leftPosition)}px`;
                    readmePreview.style.maxWidth = `${Math.max(300, rect.width)}px`;
                    
                    // Show loading state
                    const previewContent = readmePreview.querySelector('.readme-preview-content');
                    previewContent.innerHTML = '<div class="readme-loading"><i class="fas fa-spinner fa-spin"></i> Loading README...</div>';
                    
                    // Make preview visible
                    readmePreview.classList.add('active');
                    
                    // Check if we already have the README data
                    if (item.repoData && item.repoData.readmePromise) {
                        item.repoData.readmePromise.then(readmeData => {
                            if (readmeData) {
                                // Format README for preview
                                const content = atob(readmeData.content);
                                let formattedContent = cleanMarkdown(content);
                                
                                // Basic safety check for suspicious content
                                if (formattedContent.includes('<script') || 
                                    formattedContent.includes('javascript:') || 
                                    formattedContent.includes('onerror=')) {
                                    formattedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                                    formattedContent = '<pre style="white-space: pre-wrap;">' + formattedContent + '</pre>';
                                }
                                
                                // Update preview content
                                previewContent.innerHTML = `
                                    <div class="markdown-body preview-size">
                                        ${formattedContent}
                                    </div>
                                    <div class="readme-preview-footer">
                                        <a href="https://github.com/${userId}/${repoName}" target="_blank">View on GitHub</a>
                                    </div>
                                `;
                            } else {
                                previewContent.innerHTML = '<div class="readme-not-found">No README available for this repository.</div>';
                            }
                        });
                    } else {
                        // Fetch README if not already in progress
                        fetch(`https://api.github.com/repos/${userId}/${repoName}/readme`)
                            .then(response => {
                                if (response.ok) {
                                    return response.json();
                                }
                                throw new Error('README not found');
                            })
                            .then(readmeData => {
                                // Store for future use
                                item.repoData = item.repoData || {};
                                item.repoData.readmePromise = Promise.resolve(readmeData);
                                
                                // Format README for preview
                                const content = atob(readmeData.content);
                                let formattedContent = cleanMarkdown(content);
                                
                                // Safety check for suspicious content
                                if (formattedContent.includes('<script') || 
                                    formattedContent.includes('javascript:') || 
                                    formattedContent.includes('onerror=')) {
                                    formattedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                                    formattedContent = '<pre style="white-space: pre-wrap;">' + formattedContent + '</pre>';
                                }
                                
                                // Update preview content
                                previewContent.innerHTML = `
                                    <div class="markdown-body preview-size">
                                        ${formattedContent}
                                    </div>
                                    <div class="readme-preview-footer">
                                        <a href="https://github.com/${userId}/${repoName}" target="_blank">View on GitHub</a>
                                    </div>
                                `;
                            })
                            .catch(error => {
                                previewContent.innerHTML = '<div class="readme-not-found">No README available for this repository.</div>';
                            });
                    }
                }
            }, 800); // Longer delay for hover preview to avoid flickering
        });
        
        // On leave, hide README preview after short delay
        item.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            
            leaveTimer = setTimeout(() => {
                readmePreview.classList.remove('active');
            }, 300);
        });
    });
    
    // Keep preview visible when hovering over it
    readmePreview.addEventListener('mouseenter', () => {
        clearTimeout(leaveTimer);
    });
    
    // Hide preview when mouse leaves the preview
    readmePreview.addEventListener('mouseleave', () => {
        leaveTimer = setTimeout(() => {
            readmePreview.classList.remove('active');
        }, 300);
    });
}

// Call this function after portfolio items are loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for GitHub projects to load before initializing preview behavior
    const checkPortfolioLoaded = setInterval(() => {
        if (document.querySelectorAll('.portfolio-item').length > 0) {
            clearInterval(checkPortfolioLoaded);
            setTimeout(initReadmeHoverBehavior, 1000); // Give a moment for everything to stabilize
        }
    }, 500);
});
