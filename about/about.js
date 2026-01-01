// ABOUT JAVASCRIPT - GALLERY STYLE VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 GeoAI Tutors About page loaded');
    
    // Initialize background slider
    function initBackgroundSlider() {
        const bgSlider = document.querySelector('.bg-slider');
        const slides = [
            'https://th.bing.com/th/id/OIP.6L8TUmaobZGvWaVpC_KLpgHaHa?w=173&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
            'https://th.bing.com/th/id/OIP.lNWim_EgBtunyOuqT-yl7AHaHa?w=151&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
            'https://th.bing.com/th/id/OIP.zQqZRNnN05IeCA1U022mOQHaEo?w=281&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
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
            const targetText = stat.textContent;
            const target = parseInt(targetText.replace(/[^0-9]/g, ''));
            let current = 0;
            const increment = target / 50;
            const duration = 2000;
            
            // Reset for counting animation
            stat.textContent = '0';
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (targetText.includes('%')) {
                    stat.textContent = Math.floor(current) + '%';
                } else if (targetText.includes('+')) {
                    stat.textContent = Math.floor(current) + '+';
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, duration / 50);
        });
    }
    
    // Initialize card animations
    function initCardAnimations() {
        const cards = document.querySelectorAll('.mission-vision-card, .value-card, .team-card, .partner-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    
                    // Get animation delay from data attribute or use default
                    const delay = card.getAttribute('data-delay') || 0;
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, delay);
                    
                    observer.unobserve(card);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }
    
    // Initialize team card hover effects
    function initTeamHoverEffects() {
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.zIndex = '100';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
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
    
    // Initialize partner card animations
    function initPartnerAnimations() {
        const partnerCards = document.querySelectorAll('.partner-card');
        
        partnerCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
    }
    
    // Initialize everything
    function initAbout() {
        console.log('Initializing About page...');
        
        // Initialize background slider
        initBackgroundSlider();
        
        // Initialize stats counter
        initStatsCounter();
        
        // Initialize animations
        initCardAnimations();
        
        // Initialize hover effects
        initTeamHoverEffects();
        
        // Initialize CTA buttons
        initCTAButtons();
        
        // Initialize partner animations
        initPartnerAnimations();
        
        console.log('✅ About page initialized successfully');
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
    setTimeout(initAbout, 100);
});