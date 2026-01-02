// FAQ PAGE JAVASCRIPT - COMPREHENSIVE VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('❓ GeoAI Tutors FAQ loaded');
    
    // Initialize background slider
    function initBackgroundSlider() {
        const bgSlider = document.querySelector('.bg-slider');
        const slides = [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
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
    
    // Initialize FAQ accordion functionality
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    
                    // Scroll into view if needed (for mobile)
                    if (window.innerWidth <= 768) {
                        setTimeout(() => {
                            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 300);
                    }
                    
                    // Track FAQ view for analytics
                    trackFAQView(question.textContent.trim());
                } else {
                    answer.style.maxHeight = '0';
                }
            });
            
            // Initialize height for active items on page load
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
        
        // Open FAQ based on URL hash
        const hash = window.location.hash;
        if (hash) {
            const targetItem = document.querySelector(hash);
            if (targetItem && targetItem.classList.contains('faq-item')) {
                targetItem.classList.add('active');
                const answer = targetItem.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    
                    setTimeout(() => {
                        targetItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        }
    }
    
    // Track FAQ views for analytics
    function trackFAQView(question) {
        console.log(`FAQ viewed: ${question}`);
        // In a real implementation, you would send this to your analytics service
        // Example: Google Analytics, Mixpanel, etc.
    }
    
    // Initialize search functionality
    function initSearch() {
        const searchInput = document.getElementById('faqSearch');
        const searchButton = document.querySelector('.search-btn');
        const searchTags = document.querySelectorAll('.search-tag');
        const allFaqItems = document.querySelectorAll('.faq-item');
        
        const performSearch = (query) => {
            const searchTerm = query.toLowerCase().trim();
            
            if (!searchTerm) {
                // Reset all items
                allFaqItems.forEach(item => {
                    item.style.display = 'flex';
                    const answer = item.querySelector('.faq-answer');
                    if (item.classList.contains('active')) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                });
                
                // Show all sections
                document.querySelectorAll('.faq-section').forEach(section => {
                    section.style.display = 'block';
                });
                
                return;
            }
            
            let foundResults = false;
            
            allFaqItems.forEach(item => {
                const question = item.querySelector('.faq-question span').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'flex';
                    item.classList.add('active');
                    const answerEl = item.querySelector('.faq-answer');
                    answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
                    
                    // Ensure parent section is visible
                    const parentSection = item.closest('.faq-section');
                    if (parentSection) {
                        parentSection.style.display = 'block';
                    }
                    
                    foundResults = true;
                } else {
                    item.style.display = 'none';
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });
            
            // Hide sections with no visible items
            document.querySelectorAll('.faq-section').forEach(section => {
                const visibleItems = section.querySelectorAll('.faq-item[style*="display: flex"]');
                if (visibleItems.length === 0) {
                    section.style.display = 'none';
                }
            });
            
            // Show notification
            showSearchNotification(foundResults ? `Found ${document.querySelectorAll('.faq-item[style*="display: flex"]').length} results` : 'No results found');
        };
        
        // Search on button click
        searchButton.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
        
        // Search on tag click
        searchTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                const searchTerm = tag.textContent;
                searchInput.value = searchTerm;
                performSearch(searchTerm);
                
                // Highlight the section
                const sectionId = tag.getAttribute('href').replace('#', '');
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
        
        // Clear search on input clear
        searchInput.addEventListener('input', () => {
            if (!searchInput.value) {
                performSearch('');
            }
        });
    }
    
    // Show search notification
    function showSearchNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.search-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'search-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${message.includes('No results') ? '#dc2626' : '#10B981'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Initialize chat widget
    function initChatWidget() {
        const chatTrigger = document.querySelector('.chat-trigger');
        const chatWidget = document.querySelector('.chat-widget');
        const chatClose = document.querySelector('.chat-close');
        const chatSend = document.querySelector('.chat-send');
        const chatInput = document.querySelector('.chat-input input');
        const chatMessages = document.querySelector('.chat-messages');
        
        if (!chatTrigger) return;
        
        // Toggle chat widget
        chatTrigger.addEventListener('click', () => {
            chatWidget.classList.toggle('active');
        });
        
        // Close chat
        chatClose.addEventListener('click', () => {
            chatWidget.classList.remove('active');
        });
        
        // Send message
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                // Add user message
                const userMessage = document.createElement('div');
                userMessage.className = 'chat-message user';
                userMessage.innerHTML = `<p>${message}</p>`;
                chatMessages.appendChild(userMessage);
                chatInput.value = '';
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Show typing indicator
                const typingIndicator = document.createElement('div');
                typingIndicator.className = 'chat-message bot';
                typingIndicator.innerHTML = '<p><i>Support agent is typing...</i></p>';
                chatMessages.appendChild(typingIndicator);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate bot response after delay
                setTimeout(() => {
                    typingIndicator.remove();
                    
                    const responses = [
                        "I'd be happy to help with that. Can you provide more details?",
                        "That's a great question! Let me connect you with our specialist.",
                        "For detailed assistance, please email support@geoaitutors.com",
                        "I recommend checking our technical requirements section for that.",
                        "Our team typically responds within 4 hours for such queries."
                    ];
                    
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    
                    const botMessage = document.createElement('div');
                    botMessage.className = 'chat-message bot';
                    botMessage.innerHTML = `<p>${randomResponse}</p>`;
                    chatMessages.appendChild(botMessage);
                    
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1500);
            }
        };
        
        // Send on button click
        chatSend.addEventListener('click', sendMessage);
        
        // Send on Enter key
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (!chatWidget.contains(e.target) && !chatTrigger.contains(e.target) && chatWidget.classList.contains('active')) {
                chatWidget.classList.remove('active');
            }
        });
    }
    
    // Initialize smooth scrolling for anchor links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    // Close all FAQ items before scrolling
                    document.querySelectorAll('.faq-item.active').forEach(item => {
                        item.classList.remove('active');
                        item.querySelector('.faq-answer').style.maxHeight = '0';
                    });
                    
                    // Open the target FAQ item if it exists
                    if (targetElement.classList.contains('faq-item')) {
                        targetElement.classList.add('active');
                        const answer = targetElement.querySelector('.faq-answer');
                        if (answer) {
                            answer.style.maxHeight = answer.scrollHeight + 'px';
                        }
                    }
                    
                    // Scroll to the element
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Initialize FAQ statistics animation
    function initStatsAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const targetText = stat.textContent;
            const target = parseInt(targetText.replace(/[^0-9]/g, ''));
            let current = 0;
            const increment = target / 50;
            const duration = 2000;
            
            // Reset for counting animation
            const originalText = stat.textContent;
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
    
    // Initialize FAQ category highlighting
    function initCategoryHighlighting() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const navCard = document.querySelector(`.nav-card[href="#${sectionId}"]`);
                    
                    // Remove highlight from all cards
                    document.querySelectorAll('.nav-card').forEach(card => {
                        card.style.borderColor = '#e2e8f0';
                        card.style.transform = 'translateY(0)';
                    });
                    
                    // Highlight current card
                    if (navCard) {
                        navCard.style.borderColor = '#1D4ED8';
                        navCard.style.transform = 'translateY(-5px)';
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });
        
        // Observe all FAQ sections
        document.querySelectorAll('.faq-section').forEach(section => {
            observer.observe(section);
        });
    }
    
    // Initialize FAQ helpfulness tracking
    function initHelpfulnessTracking() {
        // This would be implemented with a backend in production
        // For now, we'll just log the interactions
        document.querySelectorAll('.faq-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const question = item.querySelector('.faq-question span').textContent;
                console.log(`FAQ helpfulness tracked: ${question} (click ${index + 1})`);
            });
        });
    }
    
    // Add CSS animations for search notifications
    function addAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Print FAQ functionality (for user convenience)
    function initPrintFunctionality() {
        const printButton = document.createElement('button');
        printButton.innerHTML = '<i class="fas fa-print"></i> Print FAQ';
        printButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #1D4ED8;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(29, 78, 216, 0.3);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
        `;
        
        printButton.addEventListener('click', () => {
            // Open all FAQ items for printing
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = 'none';
                }
            });
            
            // Wait a moment then print
            setTimeout(() => {
                window.print();
            }, 100);
            
            // Close items after printing
            window.onafterprint = () => {
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) {
                        answer.style.maxHeight = '0';
                    }
                });
            };
        });
        
        document.body.appendChild(printButton);
    }
    
    // Initialize everything
    function initFAQ() {
        console.log('Initializing FAQ Page...');
        
        // Add animations
        addAnimations();
        
        // Initialize components
        initBackgroundSlider();
        initFAQAccordion();
        initSearch();
        initChatWidget();
        initSmoothScrolling();
        initStatsAnimation();
        initCategoryHighlighting();
        initHelpfulnessTracking();
        initPrintFunctionality();
        
        console.log('✅ FAQ Page initialized successfully');
    }
    
    // Start initialization
    setTimeout(initFAQ, 100);
});