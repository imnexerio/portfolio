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
            clearTimeout(leaveTimer);
            
            // Don't show hover preview if already in click mode
            if (!isPreviewOpen) {
                hoverTimer = setTimeout(() => {
                    isHoverMode = true;
                    showPreview(item, modalPreview);
                }, 400);
            }
        });
        
        // On leave, hide preview after short delay but only if in hover mode
        item.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            
            if (!isPreviewOpen && isHoverMode) {
                leaveTimer = setTimeout(() => {
                    if (modalPreview.style.display !== 'none' && isHoverMode) {
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
            
            // Skip if clicking on interactive elements
            const interactive = e.target.closest('a, button');
            if (interactive) return;
            
            // Clear any hover timers
            clearTimeout(hoverTimer);
            clearTimeout(leaveTimer);
            isHoverMode = false;
            
            // Toggle preview state
            if (isPreviewOpen && modalPreview.currentItem === item) {
                isPreviewOpen = false;
                hidePreview(modalPreview);
            } else {
                isPreviewOpen = true;
                modalPreview.currentItem = item;
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
    
    // Add interactive hover effects to the preview window
    modalPreview.addEventListener('mousemove', (e) => {
        // Only apply 3D effect when preview is visible
        if (modalPreview.style.display === 'none') return;
        
        const rect = modalPreview.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calculate rotation based on mouse position (subtle effect)
        const rotateY = (mouseX / (rect.width / 2)) * 5; // Max 5 degrees
        const rotateX = -((mouseY / (rect.height / 2)) * 5); // Max 5 degrees
        
        // Apply 3D transform with smooth transition
        requestAnimationFrame(() => {
            modalPreview.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
    });
    
    // Reset transform when mouse leaves in both modes
    modalPreview.addEventListener('mouseleave', () => {
        // Reset 3D transform
        requestAnimationFrame(() => {
            modalPreview.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
        
        if (isHoverMode && !isPreviewOpen) {
            leaveTimer = setTimeout(() => {
                if (modalPreview.style.display !== 'none' && isHoverMode) {
                    hidePreview(modalPreview);
                    isHoverMode = false;
                }
            }, 300);
        }
    });
    
    // Close preview when clicking outside in click mode
    document.body.addEventListener('click', (e) => {
        const clickedOutside = isPreviewOpen && 
                              e.target !== modalPreview && 
                              !modalPreview.contains(e.target) &&
                              !e.target.closest('.portfolio-item');
                              
        if (clickedOutside) {
            isPreviewOpen = false;
            hidePreview(modalPreview);
        }
    });
    
    // Helper function to show preview
    function showPreview(item, previewEl, isClickMode = false) {
        const detailsBtn = item.querySelector('.portfolio-details');
        if (!detailsBtn) return;
        
        const projectId = detailsBtn.getAttribute('data-id');
        if (!projectId || !window.projectDetailsData) return;
        
        const project = window.projectDetailsData[projectId];
        if (!project) return;
        
        // Calculate dimensions and positioning
        const rect = item.getBoundingClientRect();
        const scaleFactor = 1.3;
        const enlargedWidth = rect.width * scaleFactor;
        const enlargedHeight = rect.height * scaleFactor;
        
        // Calculate initial centered position
        let topOffset = rect.top + window.scrollY - ((enlargedHeight - rect.height) / 2);
        let leftOffset = rect.left + window.scrollX - ((enlargedWidth - rect.width) / 2);
        
        // Check boundaries and adjust if needed
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 20; // Padding from viewport edges
        
        // Adjust for viewport edges
        if (leftOffset + enlargedWidth > viewportWidth - padding) leftOffset = viewportWidth - enlargedWidth - padding;
        if (leftOffset < padding) leftOffset = padding;
        if (topOffset + enlargedHeight > window.scrollY + viewportHeight - padding) 
            topOffset = window.scrollY + viewportHeight - enlargedHeight - padding;
        if (topOffset < window.scrollY + padding) topOffset = window.scrollY + padding;
        
        // Detect if repositioned from ideal center
        const idealLeft = rect.left + window.scrollX - ((enlargedWidth - rect.width) / 2);
        const idealTop = rect.top + window.scrollY - ((enlargedHeight - rect.height) / 2);
        const wasRepositioned = leftOffset !== idealLeft || topOffset !== idealTop;
        
        // Apply the positioning
        previewEl.style.position = 'absolute';
        previewEl.style.zIndex = '1000';
        previewEl.style.top = `${topOffset}px`;
        previewEl.style.left = `${leftOffset}px`;
        previewEl.style.width = `${enlargedWidth}px`;
        previewEl.style.height = `${enlargedHeight}px`;
        previewEl.style.transform = 'scale(0.95)';
        
        // Add transition class if repositioned
        previewEl.classList.toggle('repositioned', wasRepositioned);
        
        // Apply common styles
        setPreviewStyles(previewEl);
        
        // Create content for the preview
        previewEl.innerHTML = createPreviewContent(project);
        
        // Add close button
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
        previewEl.style.cursor = 'default';
        previewEl.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease';
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
    
    // Add the necessary styles immediately
    const style = document.createElement('style');
    style.textContent = `
        .portfolio-overlay-preview {
            display: none;
            box-sizing: border-box;
            transform-origin: center center;
            will-change: transform, opacity;
            transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            pointer-events: auto;
            transform-style: preserve-3d;
        }
        
        .portfolio-overlay-preview.repositioned {
            transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.2s ease, left 0.2s ease;
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
            position: relative;
            transition: transform 0.3s ease;
        }
        
        .portfolio-overlay-preview .preview-image::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        
        .portfolio-overlay-preview .preview-image:hover::after {
            opacity: 1;
        }
        
        .portfolio-overlay-preview .preview-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        
        .portfolio-overlay-preview .preview-image:hover img {
            transform: scale(1.1);
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
            transition: all 0.3s ease;
            cursor: default;
        }
        
        .portfolio-overlay-preview .preview-details h2:hover {
            transform: translateY(-2px);
            text-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
        }
        
        .portfolio-overlay-preview .project-category {
            color: #ccc;
            font-size: 0.9rem;
            text-align: center;
            margin-bottom: 10px;
            transition: color 0.3s ease;
        }
        
        .portfolio-overlay-preview .project-category:hover {
            color: #fff;
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
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            text-align: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .portfolio-overlay-preview .btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        
        .portfolio-overlay-preview .btn:hover::before {
            width: 300px;
            height: 300px;
        }
        
        .portfolio-overlay-preview .btn:hover {
            background-color: var(--primary-hover, #2980b9);
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 20px rgba(52, 152, 219, 0.5);
        }
        
        .portfolio-overlay-preview .btn:active {
            transform: translateY(-1px) scale(1.02);
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
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
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            z-index: 10;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .preview-close-btn:hover {
            background-color: #e74c3c;
            transform: scale(1.2) rotate(90deg);
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.5);
        }
        
        .preview-close-btn:active {
            transform: scale(1.1) rotate(90deg);
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
    
    // Wait for GitHub projects to load before initializing preview behavior
    const checkPortfolioLoaded = setInterval(() => {
        if (document.querySelectorAll('.portfolio-item').length > 0) {
            clearInterval(checkPortfolioLoaded);
            // Initialize our custom preview behavior
            initReadmeHybridBehavior();
        }
    }, 500);
});
