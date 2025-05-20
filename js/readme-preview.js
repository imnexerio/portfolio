// Function to implement hover-to-open and mouseleave-to-close for README modals
function initReadmeHoverBehavior() {
    // Get all portfolio items that might have README content
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.querySelector('.portfolio-modal');
    const modalContent = document.querySelector('.modal-body');
    
    if (!portfolioItems.length || !modal || !modalContent) return;
    
    // When using the actual modal preview on hover, we don't need a separate preview element
    const modalPreview = document.createElement('div');
    modalPreview.className = 'portfolio-overlay-preview';
    document.body.appendChild(modalPreview);
    
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
                    const detailsBtn = item.querySelector('.portfolio-details');
                    
                    if (detailsBtn) {
                        const projectId = detailsBtn.getAttribute('data-id');
                        const repoName = detailsBtn.getAttribute('data-repo');
                        
                        if (!projectId || !window.projectDetailsData) return;
                        
                        const project = window.projectDetailsData[projectId];
                        
                        if (project) {
                            // Position the preview exactly over the portfolio item but make it larger
                            const rect = item.getBoundingClientRect();
                              // Calculate dimensions for the enlarged preview (30% larger than the original item)
                            const scaleFactor = 1.3; // Make the preview 30% larger
                            const enlargedWidth = rect.width * scaleFactor;
                            const enlargedHeight = rect.height * scaleFactor;
                            
                            // Calculate position to keep it centered (accounting for the size increase)
                            let topOffset = rect.top + window.scrollY - ((enlargedHeight - rect.height) / 2);
                            let leftOffset = rect.left + window.scrollX - ((enlargedWidth - rect.width) / 2);
                            
                            // Check if the preview would go off-screen and adjust if needed
                            const viewportWidth = window.innerWidth;
                            const viewportHeight = window.innerHeight;
                            
                            // Check right edge
                            if (leftOffset + enlargedWidth > viewportWidth - 20) {
                                // Shift left to keep it on screen with 20px margin
                                leftOffset = viewportWidth - enlargedWidth - 20;
                            }
                            
                            // Check left edge
                            if (leftOffset < 20) {
                                // Shift right to keep it on screen with 20px margin
                                leftOffset = 20;
                            }
                            
                            // Check bottom edge
                            if (topOffset + enlargedHeight > window.scrollY + viewportHeight - 20) {
                                // Shift up to keep it on screen with 20px margin
                                topOffset = window.scrollY + viewportHeight - enlargedHeight - 20;
                            }
                            
                            // Check top edge
                            if (topOffset < window.scrollY + 20) {
                                // Shift down to keep it on screen with 20px margin
                                topOffset = window.scrollY + 20;
                            }
                            
                            // Create and style an absolutely positioned container that overlays the portfolio item
                            modalPreview.style.position = 'absolute';
                            modalPreview.style.zIndex = '1000';
                            
                            // Add a class for repositioning transitions if position was adjusted
                            const wasRepositioned = 
                                leftOffset !== (rect.left + window.scrollX - ((enlargedWidth - rect.width) / 2)) ||
                                topOffset !== (rect.top + window.scrollY - ((enlargedHeight - rect.height) / 2));
                                
                            if (wasRepositioned) {
                                modalPreview.classList.add('repositioned');
                            } else {
                                modalPreview.classList.remove('repositioned');
                            }
                            
                            modalPreview.style.top = `${topOffset}px`;
                            modalPreview.style.left = `${leftOffset}px`;
                            modalPreview.style.width = `${enlargedWidth}px`;
                            modalPreview.style.height = `${enlargedHeight}px`;
                            modalPreview.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                            modalPreview.style.backdropFilter = 'blur(5px)';
                            modalPreview.style.borderRadius = '10px'; // Slightly larger border radius
                            modalPreview.style.overflow = 'hidden'; // Hide scrollbars initially
                            modalPreview.style.display = 'flex';
                            modalPreview.style.flexDirection = 'column';
                            modalPreview.style.alignItems = 'center';
                            modalPreview.style.justifyContent = 'flex-start';
                            modalPreview.style.color = '#fff';
                            modalPreview.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.5)'; // Enhanced shadow
                            modalPreview.style.padding = '20px'; // Larger padding for the bigger container
                            modalPreview.style.opacity = '0';
                            modalPreview.style.cursor = 'pointer';
                            modalPreview.style.transform = 'scale(0.95)'; // Start slightly smaller for growth animation
                            modalPreview.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            
                            // Create content for the preview
                            modalPreview.innerHTML = `
                                <h3>${project.title}</h3>
                                <div id="preview-readme-container" class="readme-container">
                                    <div class="readme-loading"><i class="fas fa-spinner fa-spin"></i> Loading README...</div>
                                </div>
                                <div class="preview-action-button">
                                    <a href="#" class="view-details-btn">View Full Details</a>
                                </div>
                                <div class="preview-click-hint">Click anywhere to see full details</div>
                            `;
                            
                            // Add click event to the view details button
                            const viewDetailsBtn = modalPreview.querySelector('.view-details-btn');
                            if (viewDetailsBtn) {
                                viewDetailsBtn.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    modalPreview.style.display = 'none';
                                    detailsBtn.click();
                                });
                            }
                            
                            // Make the entire preview clickable to open the full modal
                            modalPreview.addEventListener('click', (e) => {
                                // Don't trigger if clicking on links or buttons or scrolling
                                if (e.target.tagName.toLowerCase() === 'a' || 
                                    e.target.tagName.toLowerCase() === 'button' ||
                                    e.target.closest('a') || 
                                    e.target.closest('button') ||
                                    e.target.closest('.readme-container')) {
                                    return;
                                }
                                
                                modalPreview.style.display = 'none';
                                detailsBtn.click();
                            });
                            
                            // Show the preview with a fade-in and grow effect
                            modalPreview.style.display = 'flex';
                            setTimeout(() => {
                                modalPreview.style.opacity = '1';
                                modalPreview.style.transform = 'scale(1)';
                                
                                // Allow scrolling once visible
                                modalPreview.style.overflow = 'auto';
                            }, 10);
                            
                            // Fetch README only when needed
                            const readmeContainer = modalPreview.querySelector('#preview-readme-container');
                            if (readmeContainer) {
                                const username = project.url.split('/')[3]; // GitHub username from URL
                                
                                // Store the repo name for easier access
                                readmeContainer.setAttribute('data-repo', repoName);
                                
                                // Check if we already have prefetched README data
                                if (item.repoData && item.repoData.readmePromise) {
                                    // Use the same fetchRepoReadme function to ensure consistent display
                                    fetchRepoReadme(username, repoName, readmeContainer);
                                } else {
                                    fetchRepoReadme(username, repoName, readmeContainer);
                                }
                            }
                        }
                    }
                }
            }, 400); // Delay for hover preview to avoid flickering
        });
        
        // On leave, hide README preview after short delay
        item.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            
            leaveTimer = setTimeout(() => {
                if (modalPreview.style.display === 'flex' || modalPreview.style.display === 'block') {
                    modalPreview.style.opacity = '0';
                    modalPreview.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        modalPreview.style.display = 'none';
                    }, 300);
                }
            }, 300);
        });
    });
    
    // Keep preview visible when hovering over it
    modalPreview.addEventListener('mouseenter', () => {
        clearTimeout(leaveTimer);
    });
    
    // Hide preview when mouse leaves the preview
    modalPreview.addEventListener('mouseleave', () => {
        leaveTimer = setTimeout(() => {
            if (modalPreview.style.display === 'flex' || modalPreview.style.display === 'block') {
                modalPreview.style.opacity = '0';
                modalPreview.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    modalPreview.style.display = 'none';
                }, 300);
            }
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

// Add the necessary styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .portfolio-overlay-preview {
            display: none;
            box-sizing: border-box;
            transform-origin: center center;
            will-change: transform, opacity;
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: auto;
        }
        
        .portfolio-overlay-preview.repositioned {
            transition: opacity 0.3s ease, transform 0.3s ease, top 0.2s ease, left 0.2s ease;
        }
        
        .portfolio-overlay-preview .readme-container {
            max-height: 65%;
            overflow-y: auto;
            width: 100%;
            margin: 15px 0;
            padding: 15px;
            background-color: rgba(30, 30, 30, 0.5);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
          
        .portfolio-overlay-preview .readme-content {
            overflow: hidden;
            position: relative;
            max-height: 65%;
            width: 100%;
        }
          .portfolio-overlay-preview .markdown-body {
            font-size: 0.85rem;
            line-height: 1.5;
            color: #f0f0f0;
            max-height: 160px;  /* Increased height for larger preview */
            overflow-y: auto;
            padding-right: 12px;
        }
        
        .portfolio-overlay-preview .markdown-body.expanded {
            max-height: 70%;
        }        .portfolio-overlay-preview h3 {
            margin-top: 0;
            margin-bottom: 12px;
            color: var(--primary-color, #3498db);
            font-size: 1.2rem;
            text-align: center;
        }
        
        .portfolio-overlay-preview .view-details-btn {
            display: inline-block;
            background-color: var(--primary-color, #3498db);
            color: #fff;
            padding: 8px 18px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            margin-top: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
          .portfolio-overlay-preview .view-details-btn:hover {
            background-color: var(--primary-hover, #2980b9);
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
        }
        
        .portfolio-overlay-preview .readme-meta {
            text-align: right;
            margin-top: 5px;
            font-size: 0.75rem;
        }
        
        .portfolio-overlay-preview .readme-meta a {
            color: var(--primary-color, #3498db);
            text-decoration: none;
        }
        
        .portfolio-overlay-preview .readme-expand-container {
            text-align: center;
            margin-top: 10px;
            display: none;
        }
        
        .portfolio-overlay-preview .readme-expand-btn {
            background-color: transparent;
            border: 1px solid var(--primary-color, #3498db);
            color: var(--primary-color, #3498db);
            padding: 5px 15px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.2s ease;
        }
        
        .portfolio-overlay-preview .readme-expand-btn:hover {
            background-color: var(--primary-color, #3498db);
            color: #fff;
        }        .portfolio-overlay-preview .preview-click-hint {
            position: absolute;
            bottom: 15px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.8);
            padding: 6px 12px;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 20px;
            margin: 0 auto;
            width: fit-content;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(3px);
        }
        
        .readme-loading {
            text-align: center;
            padding: 25px;
            color: #ccc;
        }
        
        .readme-not-found, .readme-error {
            text-align: center;
            padding: 20px;
            color: #ccc;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
});
