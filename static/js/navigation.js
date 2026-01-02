// Add this JavaScript to highlight the current page in navigation
document.addEventListener('DOMContentLoaded', function() {
    // Get current page URL
    const currentPage = window.location.pathname;
    
    // Remove trailing slash if present
    const cleanPath = currentPage.endsWith('/') ? currentPage.slice(0, -1) : currentPage;
    
    // Find all nav links
    const navLinks = document.querySelectorAll('.nav-links a, .dropdown-item');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        const cleanLinkPath = linkPath.endsWith('/') ? linkPath.slice(0, -1) : linkPath;
        
        // Check if this link matches current page
        if (cleanLinkPath === cleanPath) {
            link.classList.add('active');
            
            // Also update the dropdown item if it's in dropdown
            if (link.classList.contains('dropdown-item')) {
                // You can add specific styling for active dropdown items
                link.style.backgroundColor = '#f0f7ff';
                link.style.color = '#1D4ED8';
                link.style.borderLeftColor = '#1D4ED8';
            }
        }
    });
    
    // Mobile dropdown toggle functionality
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (dropdownToggle && dropdownMenu) {
        // Toggle dropdown on click for mobile
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const isVisible = dropdownMenu.style.display === 'block';
                
                if (isVisible) {
                    dropdownMenu.style.display = 'none';
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                } else {
                    dropdownMenu.style.display = 'block';
                    setTimeout(() => {
                        dropdownMenu.style.opacity = '1';
                        dropdownMenu.style.visibility = 'visible';
                    }, 10);
                }
            }
        });
        
        // Close dropdown when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !dropdownToggle.contains(e.target) && 
                !dropdownMenu.contains(e.target)) {
                dropdownMenu.style.display = 'none';
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
            }
        });
    }
});