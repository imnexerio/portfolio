// Replacement for the default modal click handler
// This will be called before the original to prevent default behavior
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for the portfolio items to be loaded
        const checkPortfolioLoaded = setInterval(() => {
            const detailButtons = document.querySelectorAll('.portfolio-details');
            const modal = document.querySelector('.portfolio-modal');
            
            if (detailButtons.length > 0) {
                clearInterval(checkPortfolioLoaded);
                
                // Hide the modal completely
                if (modal) {
                    modal.style.display = 'none';
                    // For extra safety, set it to be invisible
                    modal.style.visibility = 'hidden';
                    modal.style.opacity = '0';
                    modal.style.pointerEvents = 'none';
                }
                
                // Replace the click handlers for all detail buttons
                detailButtons.forEach(button => {
                    // Replace with a cloned element to remove event listeners
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                });
                
                console.log('Portfolio modal click handlers have been disabled.');
            }
        }, 500);
    });
})();
