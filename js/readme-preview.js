// Function to implement portfolio preview on hover and click
function initReadmeHybridBehavior() {
    // Get all portfolio items that might have README content
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.querySelector('.portfolio-modal');
    
    if (!portfolioItems.length || !modal) return;
    
    // Create the preview element that will show the content
    const modalPreview = document.createElement('div');
    modalPreview.className = 'portfolio-overlay-preview';
    document.body.appendChild(modalPreview);
    
    let hoverTimer;
    let leaveTimer;
    let isPreviewOpen = false;
    let isHoverMode = false;
    
    // Add event listeners to all portfolio items
    portfolioItems.forEach(item => {
        // On hover, show preview after short delay
        item.addEventListener('mouseenter', () => {
            // Clear any existing timers
            clearTimeout(leaveTimer);
            
            // Don't show hover preview if already in click mode
            if (!isPreviewOpen) {
                // Set timer to show preview
                hoverTimer = setTimeout(() => {
                    isHoverMode = true;
                    showPreview(item, modalPreview);
                }, 400); // Delay for hover preview to avoid flickering
            }
        });
        
        // On leave, hide preview after short delay but only if in hover mode
        item.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            
            // Only hide if not in click-preview mode
            if (!isPreviewOpen && isHoverMode) {
                leaveTimer = setTimeout(() => {
                    if (isPreviewVisible(modalPreview) && isHoverMode) {
                        hidePreview(modalPreview);
                        isHoverMode = false;
                    }
                }, 300);
            }
        });
        
        // Add click event to show preview in modal mode
        item.addEventListener('click', (e) => {
            // Prevent default behavior
            e.preventDefault();
            e.stopPropagation();
            
            // Prevent duplicate processing if clicking a button
            if (e.target.tagName.toLowerCase() === 'a' || 
                e.target.tagName.toLowerCase() === 'button' ||
                e.target.closest('a') || 
                e.target.closest('button')) {
                return;
            }
            
            // Clear any hover timers
            clearTimeout(hoverTimer);
            clearTimeout(leaveTimer);
            isHoverMode = false;
            
            // Toggle between open/closed states
            if (isPreviewOpen && modalPreview.currentItem === item) {
                // If already open and same item, close it
                isPreviewOpen = false;
                hidePreview(modalPreview);
            } else {
                // If different item or not open, open it and set flag
                isPreviewOpen = true;
                modalPreview.currentItem = item;
                
                // Show the preview in click mode
                showPreview(item, modalPreview, true);
            }
        });
    });
    
    // Keep preview visible when hovering over it in hover mode
    modalPreview.addEventListener('mouseenter', () => {
        if (isHoverMode && !isPreviewOpen) {
            clearTimeout(leaveTimer);
        }
    });
    
    // Hide preview when mouse leaves the preview in hover mode
    modalPreview.addEventListener('mouseleave', () => {
        if (isHoverMode && !isPreviewOpen) {
            leaveTimer = setTimeout(() => {
                if (isPreviewVisible(modalPreview) && isHoverMode) {
                    hidePreview(modalPreview);
                    isHoverMode = false;
                }
            }, 300);
        }
    });
    
    // Close preview when clicking outside in click mode
    document.body.addEventListener('click', (e) => {
        if (isPreviewOpen && 
            e.target !== modalPreview && 
            !modalPreview.contains(e.target) &&
            !e.target.closest('.portfolio-item')) {
            isPreviewOpen = false;
            hidePreview(modalPreview);
        }
    });
    
    // Helper function to check if preview is visible
    function isPreviewVisible(previewEl) {
        return previewEl.style.display === 'flex' || previewEl.style.display === 'block';
    }
    
    // Helper function to show preview
    function showPreview(item, previewEl, isClickMode = false) {
        const detailsBtn = item.querySelector('.portfolio-details');
        
        if (!detailsBtn) return;
        
        const projectId = detailsBtn.getAttribute('data-id');
        
        if (!projectId || !window.projectDetailsData) return;
        
        const project = window.projectDetailsData[projectId];
        
        if (!project) return;
        
        // Set preview positioning
        const rect = item.getBoundingClientRect();
        const scaleFactor = 1.3;
        const enlargedWidth = rect.width * scaleFactor;
        const enlargedHeight = rect.height * scaleFactor;
        
        // Calculate centered position
        let topOffset = rect.top + window.scrollY - ((enlargedHeight - rect.height) / 2);
        let leftOffset = rect.left + window.scrollX - ((enlargedWidth - rect.width) / 2);
        
        // Check boundaries
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Check edges and adjust if needed
        if (leftOffset + enlargedWidth > viewportWidth - 20) leftOffset = viewportWidth - enlargedWidth - 20;
        if (leftOffset < 20) leftOffset = 20;
        if (topOffset + enlargedHeight > window.scrollY + viewportHeight - 20) topOffset = window.scrollY + viewportHeight - enlargedHeight - 20;
        if (topOffset < window.scrollY + 20) topOffset = window.scrollY + 20;
        
        // Apply the positioning
        previewEl.style.position = 'absolute';
        previewEl.style.zIndex = '1000';
        previewEl.style.top = `${topOffset}px`;
        previewEl.style.left = `${leftOffset}px`;
        previewEl.style.width = `${enlargedWidth}px`;
        previewEl.style.height = `${enlargedHeight}px`;
        previewEl.style.transform = 'scale(0.95)';
        
        // Detect if position was adjusted from ideal centered position
        const wasRepositioned = 
            leftOffset !== (rect.left + window.scrollX - ((enlargedWidth - rect.width) / 2)) ||
            topOffset !== (rect.top + window.scrollY - ((enlargedHeight - rect.height) / 2));
            
        // Add transition class if repositioned
        previewEl.classList.toggle('repositioned', wasRepositioned);
        
        // Apply common styles
        setPreviewStyles(previewEl);
        
        // Create content for the preview
        previewEl.innerHTML = createPreviewContent(project);
        
        // Add close button for both hover and click modes
        const closeBtn = document.createElement('div');
        closeBtn.className = 'preview-close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isPreviewOpen = false;
            isHoverMode = false;
            hidePreview(previewEl);
        });
        previewEl.appendChild(closeBtn);
        
        // Show the preview with animation
        previewEl.style.display = 'flex';
        setTimeout(() => {
            previewEl.style.opacity = '1';
            previewEl.style.transform = 'scale(1)';
            previewEl.style.overflow = 'auto';
        }, 10);
    }
    
    // Apply styles to preview element
    function setPreviewStyles(previewEl) {
        previewEl.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        previewEl.style.backdropFilter = 'blur(5px)';
        previewEl.style.borderRadius = '10px';
        previewEl.style.overflow = 'hidden';
        previewEl.style.display = 'flex';
        previewEl.style.flexDirection = 'column';
        previewEl.style.alignItems = 'center';
        previewEl.style.justifyContent = 'flex-start';
        previewEl.style.color = '#fff';
        previewEl.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.5)';
        previewEl.style.padding = '20px';
        previewEl.style.opacity = '0';
        previewEl.style.cursor = 'pointer';
        previewEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
    
    // Create the HTML content for the preview
    function createPreviewContent(project) {
        return `
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
        `;
    }
    
    // Helper function to hide preview
    function hidePreview(previewEl) {
        previewEl.style.opacity = '0';
        previewEl.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            previewEl.style.display = 'none';
            // Remove the close button if it exists
            const closeBtn = previewEl.querySelector('.preview-close-btn');
            if (closeBtn) {
                previewEl.removeChild(closeBtn);
            }
        }, 300);
    }
}

// Call this function after portfolio items are loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if the global portfolioConfig exists and use its settings
    const shouldUsePreview = 
        typeof window.portfolioConfig !== 'undefined' 
            ? !window.portfolioConfig.useModalPopup && (window.portfolioConfig.useClickPreview || window.portfolioConfig.useHoverPreview)
            : true; // Default to true if config isn't available
    
    if (!shouldUsePreview) return;
    
    // Wait for GitHub projects to load before initializing preview behavior
    const checkPortfolioLoaded = setInterval(() => {
        if (document.querySelectorAll('.portfolio-item').length > 0) {
            clearInterval(checkPortfolioLoaded);
            // Initialize our custom preview behavior
            setTimeout(initReadmeHybridBehavior, 500);
        }
    }, 500);
    
    // Add the necessary styles
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
          .preview-close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: var(--primary-color, #3498db);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 10;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .preview-close-btn:hover {
            background-color: var(--primary-hover, #2980b9);
            transform: scale(1.1);
        }
        
        /* Responsive adjustments for the preview */
        @media (max-width: 768px) {
            .portfolio-overlay-preview {
                position: absolute !important;
                width: calc(100% - 40px) !important;
                max-width: 400px !important;
            }
            
            .portfolio-overlay-preview .preview-image {
                height: 120px;
            }
        }
    `;
    document.head.appendChild(style);
});
