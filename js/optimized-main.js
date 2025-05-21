/**
 * Enhanced Wow Factor and Performance Optimizations
 * Adds advanced animations and optimizes for performance
 */

// Utility functions for performance optimization
const utils = {
    // Throttle function to limit execution frequency
    throttle: function(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    },
    
    // Debounce function to delay execution until after events complete
    debounce: function(func, wait) {
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
};

// Configuration object for portfolio behavior
const portfolioConfig = {
    useModalPopup: false, // Set to false to use preview instead of modal popup
    useClickPreview: true, // Set to true to enable click preview
    useHoverPreview: true  // Set to true to enable hover preview
};

// Make configuration globally available
window.portfolioConfig = portfolioConfig;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme switcher first to properly set up the theme
    initThemeSwitcher();
    
    // Apply random color theme but preserve light/dark preference
    setTimeout(forceRandomThemeOnRefresh, 0);
    
    // Initialize all other functions
    initNavigation();
    initTypingEffect();
    initAdvancedScrollAnimations();
    initSkillsAnimation();
    initPortfolioFilter();
    initContactForm();
    initBackToTop();
    initScrollProgress();
    initCreatorTypingEffect();  // Initialize the creator button typing effect
    init3DCardEffect();
    initMagneticElements();
    initParallaxEffect();
    initSplitTextAnimation();
    initWowFactorElements();
    initMouseTrailer();
    initParticleEffect();
    
    // Initialize the portfolio modal with project data
    initPortfolioModal(window.projectDetailsData);
});

// Function to apply custom color to CSS variables - moved outside to make it globally accessible
function applyCustomColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--accent-color', color);
    
    // Adjust secondary color to be slightly darker
    const darkerColor = adjustColorBrightness(color, -30);
    document.documentElement.style.setProperty('--secondary-color', darkerColor);
    
    // Update gradients
    document.documentElement.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${color}, ${darkerColor})`);
    document.documentElement.style.setProperty('--gradient-secondary', `linear-gradient(135deg, ${color}, ${darkerColor})`);
    
    // Update color of the custom theme button
    const purpleButton = document.querySelector('.theme-btn.purple');
    if (purpleButton) {
        purpleButton.style.backgroundColor = color;
    }
}

// Helper function to darken or lighten a color - moved outside to make it globally accessible
function adjustColorBrightness(hex, percent) {
    // Convert hex to RGB
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    
    // Adjust brightness
    r = Math.max(0, Math.min(255, r + percent));
    g = Math.max(0, Math.min(255, g + percent));
    b = Math.max(0, Math.min(255, b + percent));
    
    // Convert back to hex
    return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
}

/**
 * Helper function to update theme icon visibility
 */
function updateThemeIcons(sunIcon, moonIcon, theme) {
    if (!sunIcon || !moonIcon) return;
    
    if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline-block';
    } else {
        sunIcon.style.display = 'inline-block';
        moonIcon.style.display = 'none';
    }
}

/**
 * Theme Switcher
 */
function initThemeSwitcher() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const htmlElement = document.documentElement;
    const colorOptions = document.querySelectorAll('.color-option');
    const customColorPicker = document.getElementById('custom-color-picker');
    const purpleButton = document.querySelector('.theme-btn.purple');
    const toggleButton = document.querySelector('.theme-btn.toggle-theme');
    const sunIcon = toggleButton ? toggleButton.querySelector('.fa-sun') : null;
    const moonIcon = toggleButton ? toggleButton.querySelector('.fa-moon') : null;
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        
        // Set the toggle button state based on the saved theme
        if (toggleButton) {
            toggleButton.setAttribute('data-theme', savedTheme);
            
            // Update icon visibility
            updateThemeIcons(sunIcon, moonIcon, savedTheme);
        }
    }
    
    // Theme toggle button click handler
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const currentTheme = toggleButton.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
              // Toggle the icon display
            updateThemeIcons(sunIcon, moonIcon, newTheme);
            
            // Update button attribute
            toggleButton.setAttribute('data-theme', newTheme);
            
            // Update button states - the toggle button should be active
            themeButtons.forEach(btn => btn.classList.remove('active'));
            toggleButton.classList.add('active');
            
            // Set theme
            htmlElement.setAttribute('data-theme', newTheme);
            
            // Save theme preference
            localStorage.setItem('theme', newTheme);
            
            // Add animation effect when changing theme
            document.body.classList.add('theme-transition');
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 1000);
        });
    }
      // Toggle color palette visibility for touch devices
    if (purpleButton) {
        // Simple toggle for color palette
        purpleButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from propagating
            purpleButton.classList.toggle('palette-open');
            
            // Close palette when clicking outside
            if (purpleButton.classList.contains('palette-open')) {
                setTimeout(() => {
                    document.addEventListener('click', closeColorPalette);
                }, 10);
            }
        });
        
        // Function to close color palette
        function closeColorPalette(e) {
            if (!e.target.closest('.color-palette') && !e.target.closest('.theme-btn.purple')) {
                purpleButton.classList.remove('palette-open');
                document.removeEventListener('click', closeColorPalette);
            }
        }
    }
      // Apply saved custom color if available
    const savedCustomColor = localStorage.getItem('customThemeColor');
    if (savedCustomColor) {
        applyCustomColor(savedCustomColor);
        if (customColorPicker) {
            customColorPicker.value = savedCustomColor;
        }
    }
    
    // Update theme button states using the helper function
    updateThemeButtonStates(savedTheme, purpleButton, toggleButton);
    
    // Handle color option clicks
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const color = option.getAttribute('data-color');
            applyCustomColor(color);
            localStorage.setItem('customThemeColor', color);
            
            // Close the color palette after selection on mobile
            if (purpleButton) {
                setTimeout(() => {
                    purpleButton.classList.remove('palette-open');
                    document.removeEventListener('click', closeColorPalette);
                }, 300);
            }
        });
    });
    
    // Handle custom color picker
    if (customColorPicker) {
        customColorPicker.addEventListener('input', () => {
            const color = customColorPicker.value;
            applyCustomColor(color);
            localStorage.setItem('customThemeColor', color);
            
            // Close the color palette after selection on mobile
            if (purpleButton) {
                setTimeout(() => {
                    purpleButton.classList.remove('palette-open');
                    document.removeEventListener('click', closeColorPalette);
                }, 300);
            }
        });
    }
}

/**
 * Helper function to update theme button states
 */
function updateThemeButtonStates(savedTheme, purpleButton, toggleButton) {
    // Update active button
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => btn.classList.remove('active'));
    
    // Determine which button should be active
    if (toggleButton && savedTheme === toggleButton.getAttribute('data-theme')) {
        toggleButton.classList.add('active');
    } else if (purpleButton) {
        purpleButton.classList.add('active');
    }
}

/**
 * Force Random Theme on Every Refresh
 */
function forceRandomThemeOnRefresh() {
    // Get user's theme preference (light/dark mode)
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // We need to wait for the DOM to be ready to get the color options
    const colorOptions = document.querySelectorAll('.color-option');
    const fallbackColors = ['#9d4edd', '#ff6b6b', '#4cc9f0', '#f72585', '#4361ee', '#fb8500', '#43aa8b', '#f94144'];
    
    // Choose colors based on availability
    let randomColor;
    if (colorOptions.length > 0) {
        const availableColors = Array.from(colorOptions).map(option => option.getAttribute('data-color'));
        randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    } else {
        randomColor = fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
    }
    
    // Apply and save the random color
    applyCustomColor(randomColor);
    localStorage.setItem('customThemeColor', randomColor);
    
    // Update the custom color picker value if it exists
    const customColorPicker = document.getElementById('custom-color-picker');
    if (customColorPicker) {
        customColorPicker.value = randomColor;
    }
    
    // Set theme attribute and save preference if needed
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'light');
    }
    
    // Update theme button states and icons
    const purpleButton = document.querySelector('.theme-btn.purple');
    const toggleButton = document.querySelector('.theme-btn.toggle-theme');
    
    updateThemeButtonStates(savedTheme, purpleButton, toggleButton);
    
    // Update toggle button icon if it exists
    if (toggleButton) {
        const sunIcon = toggleButton.querySelector('.fa-sun');
        const moonIcon = toggleButton.querySelector('.fa-moon');
        
        if (sunIcon && moonIcon) {
            updateThemeIcons(sunIcon, moonIcon, savedTheme);
            toggleButton.setAttribute('data-theme', savedTheme);
        }
    }
}

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');
    const header = document.querySelector('#header');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Typing Effect for Hero Section
 */
function initTypingEffect() {
    const typedTextElement = document.querySelector('.typed-text');
    if (!typedTextElement) return;

    // Default roles if GitHub data isn't available yet
    let words = ['Software Developer', 'Full Stack Developer', 'Web Developer', 'Open Source Contributor'];
    
    // We'll expose this function globally so it can be called after GitHub data is loaded
    window.updateTypedRoles = function(newRoles) {
        if (Array.isArray(newRoles) && newRoles.length > 0) {
            words = newRoles;
            // Reset indexes to start with the new words
            wordIndex = 0;
            charIndex = 0;
            isDeleting = false;
        }
    };
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before starting new word
        }

        setTimeout(type, typingSpeed);
    }

    // Start the typing effect
    setTimeout(type, 1000);
}

/**
 * Creator Button Typing Animation
 */
function initCreatorTypingEffect() {
    const typedMessage = document.querySelector('.typed-message');
    if (!typedMessage) return;
    
    const message = "Create your own portfolio - It's free!";
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        if (isDeleting) {
            typedMessage.textContent = message.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedMessage.textContent = message.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === message.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at the end of message
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            typingSpeed = 500; // Pause before retyping
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing immediately
    setTimeout(type, 1000);
}


function createAnimationObserver(callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    return new IntersectionObserver(callback, {...defaultOptions, ...options});
}

/**
 * Advanced Scroll Animations with Intersection Observer for performance
 */
function initAdvancedScrollAnimations() {
    // Select all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .scroll-reveal, .scroll-scale, .scroll-rotate, .stagger-item, .split-text, .wow-title, .wow-subtitle, .wow-button');
    
    // Create observer with callback
    const observer = createAnimationObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    });
    
    // Observe each element
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Handle staggered animations
    const staggerContainers = document.querySelectorAll('.stagger-container');
    
    staggerContainers.forEach(container => {
        const staggerItems = container.querySelectorAll('.stagger-item');
        
        const staggerObserver = createAnimationObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                staggerItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('active');
                    }, index * 100); // 100ms delay between each item
                });
                
                // Unobserve after animation is triggered
                observer.unobserve(container);
            }
        });
        
        staggerObserver.observe(container);
    });
}

/**
 * Skills Animation with Intersection Observer
 */
function initSkillsAnimation() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    // Initial state - set width to 0
    skillLevels.forEach(level => {
        level.style.width = '0';
    });

    // Use Intersection Observer for better performance
    const observer = createAnimationObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target;
                const width = level.parentElement.previousElementSibling.lastElementChild.textContent;
                
                // Use requestAnimationFrame for smoother animation
                requestAnimationFrame(() => {
                    level.style.width = width;
                });
                
                // Unobserve after animation is triggered
                observer.unobserve(level);
            }
        });
    });
    
    // Observe each skill level
    skillLevels.forEach(level => {
        observer.observe(level);
    });
    
    // Re-initialize scroll animations for newly added skill items
    const newScrollElements = document.querySelectorAll('.skill-item.scroll-scale:not(.active)');
    if (newScrollElements.length > 0) {
        // Create a new observer for the new elements
        const scrollObserver = createAnimationObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        });
        
        newScrollElements.forEach(element => {
            scrollObserver.observe(element);
        });
    }
}

/**
 * Portfolio Filtering with debounce for performance
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', utils.debounce(function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter items
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
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
}

/**
 * Portfolio Modal
 */
function initPortfolioModal(dynamicProjectDetails) {
    const modal = document.querySelector('.portfolio-modal');
    const modalContent = document.querySelector('.modal-body');
    const closeModal = document.querySelector('.close-modal');
    const detailButtons = document.querySelectorAll('.portfolio-details');

    // If modal popup is disabled via config, set the modal display to none and return early
    if (!portfolioConfig.useModalPopup) {
        if (modal) {
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
            modal.style.opacity = '0';
            modal.style.pointerEvents = 'none';
        }
        // Don't add click handlers for the modal when it's disabled
        return;
    }

    // Project details data - only use dynamic data, no fallback
    const projectDetails = dynamicProjectDetails;    // Open modal with project details
    detailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = button.getAttribute('data-id');
            
            if (!projectDetails) {
                // Display error message when no project details are provided
                modalContent.innerHTML = `
                    <div class="modal-project">
                        <div class="modal-error">
                            <h2>Error</h2>
                            <p>Project details are not available. Please check the GitHub integration.</p>
                        </div>
                    </div>
                `;
                
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
                
                // Add animation class to modal content
                setTimeout(() => {
                    modalContent.classList.add('modal-animate');
                }, 50);
                
                return;
            }
            
            const project = projectDetails[projectId];
            
            if (project) {
                let techHtml = '';
                project.technologies.forEach(tech => {
                    techHtml += `<span class="tech-tag">${tech}</span>`;
                });
                  modalContent.innerHTML = `
                    <div class="modal-project">
                        <div class="modal-image">
                            <img src="${project.image}" alt="${project.title}">
                        </div>
                        <div class="modal-details">
                            <h2>${project.title}</h2>
                            <p class="project-category">${project.category}</p>
                            <div class="project-info">
                                <div class="info-row">
                                    <span class="info-label">Client:</span>
                                    <span class="info-value">${project.client}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Date:</span>
                                    <span class="info-value">${project.date}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Technologies:</span>
                                    <div class="tech-tags">${techHtml}</div>
                                </div>
                            </div>
                            <div class="project-description">
                                <h3>Project Description</h3>
                                <p>${project.description}</p>
                            </div>
                            <div id="readme-container" class="readme-container">
                                <!-- README content will be loaded here -->
                            </div>                            <a href="${project.url}" class="btn primary-btn" target="_blank">View Project on GitHub</a>
                        </div>
                    </div>
                `;
                
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
                
                // Add animation class to modal content
                setTimeout(() => {
                    modalContent.classList.add('modal-animate');
                      // Fetch and display README content after modal is displayed
                    const readmeContainer = document.getElementById('readme-container');
                    if (readmeContainer) {
                        // Extract repo name from the URL
                        const repoName = project.url.split('/').pop();
                        const username = project.url.split('/')[3]; // GitHub username from URL
                        
                        // Store the repo name in the modal for easier access
                        readmeContainer.setAttribute('data-repo', repoName);
                        
                        // Fetch README only when needed (when modal is shown)
                        fetchRepoReadme(username, repoName, readmeContainer);
                    }
                }, 50);
            } else {
                // Display error message for specific project not found
                modalContent.innerHTML = `
                    <div class="modal-project">
                        <div class="modal-error">
                            <h2>Error</h2>
                            <p>Project with ID ${projectId} was not found.</p>
                        </div>
                    </div>
                `;
                
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                setTimeout(() => {
                    modalContent.classList.add('modal-animate');
                }, 50);
            }
        });
    });

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modalContent.classList.remove('modal-animate');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Re-enable scrolling
            }, 300);
        });
    }

    // Close modal when clicking outside of modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modalContent.classList.remove('modal-animate');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    });
}

/**
 * Contact Form Validation
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    
    if (form) {
        // Get Formspree ID from config
        const formspreeId = window.GitHubConfig.getFormspreeId();
        
        // Set the form action URL using the Formspree ID
        if (formspreeId) {
            form.action = `https://formspree.io/f/${formspreeId}`;
        } else {
            console.warn('Formspree ID not found. Contact form may not work.');
        }
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show loading status
            formStatus.innerHTML = '<div class="loading">Sending message...</div>';
            formStatus.style.display = 'block';
            
            // Get the form data
            const formData = new FormData(form);
              // Send the form data to Formspree
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Success message
                    formStatus.innerHTML = '<div class="success">Thank you! Your message has been sent.</div>';
                    form.reset(); // Clear the form
                } else {
                    // Error message - handle non-JSON responses safely
                    formStatus.innerHTML = '<div class="error">Oops! There was a problem with your submission. Please try again.</div>';
                    console.log('Form submission error:', response.status, response.statusText);
                }
            })
            .catch(error => {
                // Network error
                formStatus.innerHTML = '<div class="error">Oops! There was a network error. Please check your connection and try again.</div>';
                console.log('Form submission network error:', error);
            });
        });
    }
}

/**
 * Back to Top Button with throttle for performance
 */
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', utils.throttle(() => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        }, 100));
        
        // Scroll to top when button is clicked
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Scroll Progress Indicator with throttle for performance
 */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    
    if (progressBar) {
        window.addEventListener('scroll', utils.throttle(() => {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = (window.pageYOffset / totalHeight) * 100;
            
            // Use requestAnimationFrame for smoother animation
            requestAnimationFrame(() => {
                progressBar.style.width = progress + '%';
            });
        }, 50));
    }
}

/**
 * 3D Card Effect with throttle for performance
 */
function init3DCardEffect() {
    const cards = document.querySelectorAll('.card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', utils.throttle((e) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            // Calculate rotation based on mouse position
            const rotateY = (mouseX / (cardRect.width / 2)) * 15; // Max 15 degrees
            const rotateX = -((mouseY / (cardRect.height / 2)) * 15); // Max 15 degrees
            
            // Use requestAnimationFrame for smoother animation
            requestAnimationFrame(() => {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        }, 50));
        
        card.addEventListener('mouseleave', () => {
            // Use requestAnimationFrame for smoother animation
            requestAnimationFrame(() => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    });
}

/**
 * Magnetic Elements with throttle for performance
 */
function initMagneticElements() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', utils.throttle((e) => {
            const elementRect = element.getBoundingClientRect();
            const elementCenterX = elementRect.left + elementRect.width / 2;
            const elementCenterY = elementRect.top + elementRect.height / 2;
            const mouseX = e.clientX - elementCenterX;
            const mouseY = e.clientY - elementCenterY;
            
            // Calculate movement based on mouse position
            const moveX = (mouseX / (elementRect.width / 2)) * 10; // Max 10px
            const moveY = (mouseY / (elementRect.height / 2)) * 10; // Max 10px
            
            // Use requestAnimationFrame for smoother animation
            requestAnimationFrame(() => {
                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        }, 50));
        
        element.addEventListener('mouseleave', () => {
            // Use requestAnimationFrame for smoother animation
            requestAnimationFrame(() => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    });
}

/**
 * Parallax Effect with throttle for performance
 */
function initParallaxEffect() {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    window.addEventListener('scroll', utils.throttle(() => {
        parallaxSections.forEach(section => {
            const distance = window.scrollY;
            const parallaxBg = section.querySelector('.parallax-bg');
            
            if (parallaxBg) {
                // Use requestAnimationFrame for smoother animation
                requestAnimationFrame(() => {
                    parallaxBg.style.transform = `translateY(${distance * 0.3}px)`;
                });
            }
        });
    }, 50));
}

/**
 * Split Text Animation
 */
function initSplitTextAnimation() {
    const splitTextElements = document.querySelectorAll('.split-text');
    
    splitTextElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        // Split text into individual characters
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.transitionDelay = `${i * 0.05}s`; // Staggered delay
            element.appendChild(span);
        }
    });
}

/**
 * Wow Factor Elements
 */
function initWowFactorElements() {
    // Create 3D Rotating Cube
    const wowSection = document.querySelector('.wow-section');
    
    if (wowSection) {
        // Create cube container
        const cubeContainer = document.createElement('div');
        cubeContainer.className = 'cube-container';
        cubeContainer.style.left = '10%';
        cubeContainer.style.top = '20%';
        
        // Create cube
        const cube = document.createElement('div');
        cube.className = 'cube';
        
        // Create cube faces
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        const icons = ['fas fa-code', 'fas fa-mobile-alt', 'fas fa-laptop-code', 'fas fa-brain', 'fas fa-rocket', 'fas fa-cogs'];
        
        faces.forEach((face, index) => {
            const cubeFace = document.createElement('div');
            cubeFace.className = `cube-face ${face}`;
            cubeFace.innerHTML = `<i class="${icons[index]}"></i>`;
            cube.appendChild(cubeFace);
        });
        
        cubeContainer.appendChild(cube);
        wowSection.appendChild(cubeContainer);
        
        // Create second cube
        const cubeContainer2 = document.createElement('div');
        cubeContainer2.className = 'cube-container';
        cubeContainer2.style.right = '10%';
        cubeContainer2.style.bottom = '20%';
        
        // Create cube
        const cube2 = document.createElement('div');
        cube2.className = 'cube';
        cube2.style.animationDelay = '2s';
        
        // Create cube faces
        faces.forEach((face, index) => {
            const cubeFace = document.createElement('div');
            cubeFace.className = `cube-face ${face}`;
            cubeFace.innerHTML = `<i class="${icons[(index + 3) % 6]}"></i>`;
            cube2.appendChild(cubeFace);
        });
        
        cubeContainer2.appendChild(cube2);
        wowSection.appendChild(cubeContainer2);
        
        // Create wave animation
        const waveContainer = document.createElement('div');
        waveContainer.className = 'wave-container';
        
        // Create SVG waves
        waveContainer.innerHTML = `
            <svg class="wave" viewBox="0 0 1024 128" preserveAspectRatio="none">
                <path d="M0,64 C300,84 400,64 512,64 C614,64 714,84 1024,64 L1024,128 L0,128 Z"></path>
            </svg>
            <svg class="wave" viewBox="0 0 1024 128" preserveAspectRatio="none">
                <path d="M0,64 C200,44 300,84 412,64 C514,44 614,84 1024,64 L1024,128 L0,128 Z"></path>
            </svg>
        `;
        
        wowSection.appendChild(waveContainer);
    }
}

/**
 * Mouse Trailer Effect
 */
function initMouseTrailer() {
    // Create mouse trailer element
    const mouseTrailer = document.createElement('div');
    mouseTrailer.className = 'mouse-trailer';
    document.body.appendChild(mouseTrailer);
    
    // Update mouse trailer position
    document.addEventListener('mousemove', utils.throttle((e) => {
        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
            mouseTrailer.style.left = `${e.clientX}px`;
            mouseTrailer.style.top = `${e.clientY}px`;
        });
    }, 10));
    
    // Change mouse trailer size on hover
    const interactiveElements = document.querySelectorAll('a, button, .card-3d, .magnetic');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            mouseTrailer.style.width = '60px';
            mouseTrailer.style.height = '60px';
            mouseTrailer.style.background = 'rgba(255, 255, 255, 0.3)';
        });
        
        element.addEventListener('mouseleave', () => {
            mouseTrailer.style.width = '40px';
            mouseTrailer.style.height = '40px';
            mouseTrailer.style.background = 'rgba(255, 255, 255, 0.2)';
        });
    });
}

/**
 * Particle Effect - Optimized to generate particles once and reuse them
 */
function initParticleEffect() {
    const wowSection = document.querySelector('.wow-section');
    
    if (!wowSection) return;
    
    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    
    // Create particles
    const particleCount = window.innerWidth < 768 ? 30 : 60; // Reduce particles on mobile
    
    // Create particles in a document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random animation duration
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        fragment.appendChild(particle);
    }
    
    particlesContainer.appendChild(fragment);
    wowSection.appendChild(particlesContainer);
}

// Add CSS for theme transition
const style = document.createElement('style');
style.textContent = `
    .theme-transition {
        transition: background-color 0.5s ease, color 0.5s ease;
    }
    
    .modal-animate {
        animation: modalContentFadeIn 0.5s forwards;
    }
    
    @keyframes modalContentFadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .alert-animate {
        animation: alertSlideIn 0.3s forwards;
    }
    
    @keyframes alertSlideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Optimize animations for performance */
    .fade-in, .slide-in-left, .slide-in-right, .scale-in, 
    .scroll-reveal, .scroll-scale, .scroll-rotate, 
    .stagger-item, .split-text span, .wow-title, 
    .wow-subtitle, .wow-button {
        will-change: transform, opacity;
    }
    
    .skill-level {
        will-change: width;
    }
    
    .card-3d, .magnetic {
        will-change: transform;
    }
    
    .parallax-bg {
        will-change: transform;
    }
    
    .horizontal-scroll-section {
        will-change: transform;
    }
    
    .mouse-trailer {
        will-change: transform, width, height;
    }
      /* Reduce animation complexity on mobile */
    @media (max-width: 768px) {
        .cube-container {
            display: none;
        }
        
        .floating-element:nth-child(2),
        .floating-element:nth-child(4),
        .floating-element:nth-child(6) {
            display: none;
        }
        
        .mouse-trailer {
            display: none;
        }
    }
    
    /* Modal error styling */
    .modal-error {
        text-align: center;
        padding: 30px;
        background-color: rgba(255, 0, 0, 0.1);
        border-radius: 8px;
        margin: 20px;
    }
    
    .modal-error h2 {
        color: #ff3333;
        margin-bottom: 15px;
    }
    
    .modal-error p {
        font-size: 1.1rem;
        line-height: 1.6;
    }
`;
document.head.appendChild(style);
