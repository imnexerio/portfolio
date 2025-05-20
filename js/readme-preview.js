// Function to implement click-to-open for portfolio modals with simplified preview on hover
function initReadmeHoverBehavior() {
    // Get all portfolio items that might have README content
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.querySelector('.portfolio-modal');
    const modalContent = document.querySelector('.modal-body');
    
    if (!portfolioItems.length || !modal || !modalContent) return;
    
    // Create the preview element that will show the same content as the main modal
    const modalPreview = document.createElement('div');
    modalPreview.className = 'portfolio-overlay-preview';
    document.body.appendChild(modalPreview);
    
    let hoverTimer;
    let leaveTimer;
    
    // Add event listeners to all portfolio items
    portfolioItems.forEach(item => {
        // On hover, show preview after short delay
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
                            modalPreview.style.borderRadius = '10px';
                            modalPreview.style.overflow = 'hidden';
                            modalPreview.style.display = 'flex';
                            modalPreview.style.flexDirection = 'column';
                            modalPreview.style.alignItems = 'center';
                            modalPreview.style.justifyContent = 'flex-start';
                            modalPreview.style.color = '#fff';
                            modalPreview.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.5)';
                            modalPreview.style.padding = '20px';
                            modalPreview.style.opacity = '0';
                            modalPreview.style.cursor = 'pointer';
                            modalPreview.style.transform = 'scale(0.95)';
                            modalPreview.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            
                            // Create content for the preview - use the same content structure as the main modal
                            // but only include image, description, and "View Project on GitHub" button
                            modalPreview.innerHTML = `
                                <div class="modal-project preview-project">
                                    <div class="modal-image preview-image">
                                        <img src="${project.image}" alt="${project.title}">
                                    </div>
                                    <div class="modal-details preview-details">
                                        <h2>${project.title}</h2>
                                        <p class="project-category">${project.category}</p>
                                        <div class="project-description">
                                            <p>${project.description}</p>
                                        </div>
                                        <a href="${project.url}" class="btn primary-btn" target="_blank">View Project on GitHub</a>
                                    </div>
                                </div>
                                <div class="preview-click-hint">Click anywhere to see full details</div>
                            `;
                            
                            // Make the entire preview clickable to open the full modal
                            modalPreview.addEventListener('click', (e) => {
                                // Don't trigger if clicking on links or buttons
                                if (e.target.tagName.toLowerCase() === 'a' || 
                                    e.target.tagName.toLowerCase() === 'button' ||
                                    e.target.closest('a') || 
                                    e.target.closest('button')) {
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
                        }
                    }
                }
            }, 400); // Delay for hover preview to avoid flickering
        });
        
        // On leave, hide preview after short delay
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
document.addEventListener('DOMContentLoaded', () => {    const style = document.createElement('style');
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
        
        .portfolio-overlay-preview .preview-project {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
        }
        
        .portfolio-overlay-preview .preview-image {
            width: 100%;
            height: 160px;
            overflow: hidden;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        
        .portfolio-overlay-preview .preview-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .portfolio-overlay-preview .preview-details {
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        
        .portfolio-overlay-preview .preview-details h2 {
            margin-top: 0;
            margin-bottom: 5px;
            color: var(--primary-color, #3498db);
            font-size: 1.2rem;
            text-align: center;
        }
        
        .portfolio-overlay-preview .project-category {
            color: #ccc;
            font-size: 0.9rem;
            text-align: center;
            margin-bottom: 10px;
        }
        
        .portfolio-overlay-preview .project-description {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 15px;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        
        .portfolio-overlay-preview .btn {
            display: inline-block;
            background-color: var(--primary-color, #3498db);
            color: #fff;
            padding: 8px 18px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        
        .portfolio-overlay-preview .btn:hover {
            background-color: var(--primary-hover, #2980b9);
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
        }
        
        .portfolio-overlay-preview .preview-click-hint {
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
    `;
    document.head.appendChild(style);
});
