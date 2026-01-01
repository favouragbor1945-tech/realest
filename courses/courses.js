// COURSES JAVASCRIPT - GALLERY STYLE VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 GeoAI Tutors Courses loaded');
    
    // Initialize background slider
    function initBackgroundSlider() {
        const bgSlider = document.querySelector('.bg-slider');
        const slides = [
            'https://th.bing.com/th/id/OIP.yaTVg0WywMdtWha9HKb5BwHaEZ?w=282&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
            'https://th.bing.com/th/id/OIP.IHh_0uulpayuzDxjCE2vNAHaEj?w=236&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
            'https://th.bing.com/th/id/OIP.CsGmocjUSXUCFw1bkLiFpwHaEd?w=258&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
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
                } else if (targetText.includes('/')) {
                    stat.textContent = '24/7';
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, duration / 50);
        });
    }
    
    // Initialize filter functionality
    function initFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const courseItems = document.querySelectorAll('.masonry-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Filter course items
                courseItems.forEach(item => {
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
            item.addEventListener('click', function(e) {
                if (window.innerWidth <= 768 && !e.target.closest('.enroll-btn')) {
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
    
    // Initialize payment modal
    function initPaymentModal() {
        const modal = document.getElementById('paymentModal');
        const enrollButtons = document.querySelectorAll('.enroll-btn');
        const closeBtn = document.querySelector('.close');
        const courseAmount = document.getElementById('courseAmount');
        const selectedCourse = document.getElementById('selectedCourse');
        const paymentForm = document.getElementById('paymentForm');

        const courses = {
            1: { name: 'GeoAI Fundamentals & Core Concepts', price: '€969' },
            2: { name: 'Machine Learning for Geospatial Applications', price: '€1099' },
            3: { name: 'Advanced GeoAI Analysis & Professional Practice', price: '€1299' },
            4: { name: 'Urban GeoAI & Smart City Analytics', price: '€899' },
            5: { name: 'Climate Change & Environmental GeoAI', price: '€999' },
            6: { name: 'Agricultural GeoAI & Precision Farming', price: '€849' }
        };

        enrollButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const courseId = this.getAttribute('data-course');
                const course = courses[courseId];

                selectedCourse.textContent = course.name;
                courseAmount.textContent = course.price;

                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });

        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const paymentMethod = document.getElementById('paymentMethod').value;

            if (!paymentMethod) {
                alert('Please select a payment method.');
                return;
            }

            processPayment(paymentMethod);
        });

        // Handle Global Payment Gateways
        function processPayment(method) {
            const payBtn = document.querySelector('.pay-btn');
            const originalText = payBtn.textContent;

            payBtn.textContent = 'Redirecting...';
            payBtn.disabled = true;

            setTimeout(() => {
                switch (method) {
                    case 'bitcoin':
                        window.location.href = 'https://your-bitcoin-gateway.com/pay';
                        break;

                    case 'paypal':
                        window.location.href = 'https://www.paypal.com/checkout';
                        break;

                    case 'stripe':
                        window.location.href = 'https://checkout.stripe.com/pay';
                        break;

                    case 'wise':
                        window.location.href = 'https://wise.com/transfer';
                        break;

                    case 'applepay':
                        alert('Apple Pay session will start on supported devices.');
                        break;

                    case 'googlepay':
                        alert('Google Pay request will initiate on supported devices.');
                        break;

                    default:
                        alert('Unsupported payment method.');
                }

                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                payBtn.textContent = originalText;
                payBtn.disabled = false;
            }, 1000);
        }
    }
    
    // Initialize everything
    function initCourses() {
        console.log('Initializing Courses...');
        
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
        
        // Initialize payment modal
        initPaymentModal();
        
        console.log('✅ Courses initialized successfully');
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
    setTimeout(initCourses, 100);
});