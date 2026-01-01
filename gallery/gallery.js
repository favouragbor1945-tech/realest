// GALLERY JAVASCRIPT - COMPLETE VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 GeoAI Tutors Gallery loaded');
    
    // Initialize background slider
    function initBackgroundSlider() {
        const bgSlider = document.querySelector('.bg-slider');
        const slides = [
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
        ];
        
        // Create slide elements
        slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide';
            slideDiv.style.backgroundImage = `url(${slide})`;
            slideDiv.style.animationDelay = `${index * 5}s`;
            bgSlider.appendChild(slideDiv);
        });
    }
    
    // Initialize stats counter
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 50;
            const duration = 2000; // 2 seconds
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + '+';
            }, duration / 50);
        });
    }
    
    // Initialize filter functionality
    function initFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.masonry-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || filter === category) {
                        item.style.display = 'block';
                        // Add fade in animation
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        // Add fade out animation
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 400);
                    }
                });
            });
        });
    }
    
    // Initialize masonry item animations
    function initMasonryAnimations() {
        const masonryItems = document.querySelectorAll('.masonry-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const delay = item.getAttribute('data-id') * 100 || 100;
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, delay);
                    
                    observer.unobserve(item);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        masonryItems.forEach(item => {
            observer.observe(item);
        });
    }
    
    // Initialize item hover effects
    function initHoverEffects() {
        const masonryItems = document.querySelectorAll('.masonry-item');
        
        masonryItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.zIndex = '100';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
            });
            
            // Add click event for mobile devices
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    const overlay = this.querySelector('.item-overlay');
                    overlay.style.transform = overlay.style.transform === 'translateY(0%)' 
                        ? 'translateY(100%)' 
                        : 'translateY(0%)';
                }
            });
        });
    }
    
    // Initialize CTA buttons
    function initCTAButtons() {
        const ctaButtons = document.querySelectorAll('.cta-button');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
                    e.preventDefault();
                    
                    // Add ripple effect
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.cssText = `
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.7);
                        transform: scale(0);
                        animation: ripple 0.6s linear;
                        width: ${size}px;
                        height: ${size}px;
                        top: ${y}px;
                        left: ${x}px;
                        pointer-events: none;
                    `;
                    
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                }
            });
        });
    }
    
    // Initialize everything
    function initGallery() {
        console.log('Initializing Gallery...');
        
        // Initialize background slider
        initBackgroundSlider();
        
        // Initialize stats counter
        initStatsCounter();
        
        // Initialize filter
        initFilter();
        
        // Initialize animations
        initMasonryAnimations();
        
        // Initialize hover effects
        initHoverEffects();
        
        // Initialize CTA buttons
        initCTAButtons();
        
        console.log('✅ Gallery initialized successfully');
    }
    
    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Start initialization
    setTimeout(initGallery, 100);
});