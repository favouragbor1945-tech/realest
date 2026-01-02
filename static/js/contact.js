// WORLD-CLASS CONTACT PAGE JAVASCRIPT
document.addEventListener('DOMContentLoaded', function() {
    console.log('📞 GeoAI Tutors World-Class Contact Platform loaded');
    
    // Initialize background slider
    function initBackgroundSlider() {
        const bgSlider = document.querySelector('.bg-slider');
        const slides = [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1525547719578-21a34d5d8b08?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
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
    
    // Initialize interactive map
    function initMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;
        
        try {
            // Create map centered on Berlin
            const map = L.map('map').setView([52.5200, 13.4050], 14);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);
            
            // Add custom marker
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: '<i class="fas fa-map-marker-alt"></i>',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
            
            // Add marker with popup
            const marker = L.marker([52.5200, 13.4050], { icon: customIcon })
                .addTo(map)
                .bindPopup(`
                    <div class="map-popup">
                        <h4>GeoAI Tutors Headquarters</h4>
                        <p>Alexanderplatz 1, 10178 Berlin</p>
                        <p>Germany</p>
                    </div>
                `);
            
            // Open popup by default
            marker.openPopup();
            
            // Remove placeholder
            const placeholder = mapElement.querySelector('.map-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            console.log('✅ Interactive map loaded');
        } catch (error) {
            console.error('Map loading error:', error);
            
            // Fallback: Show static map image
            const mapElement = document.getElementById('map');
            mapElement.innerHTML = `
                <div style="
                    width: 100%;
                    height: 100%;
                    background-image: url('https://maps.googleapis.com/maps/api/staticmap?center=52.5200,13.4050&zoom=14&size=600x300&scale=2&markers=color:red%7C52.5200,13.4050&key=AIzaSyCiyuZ4S8YlXw6Q7Q5m8Q1J2K3L4M5N6O7P');
                    background-size: cover;
                    background-position: center;
                    border-radius: 0 0 15px 15px;
                "></div>
            `;
        }
    }
    
    // Initialize form validation
    function initFormValidation() {
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const messageTextarea = document.getElementById('message');
        const charCount = document.getElementById('charCount');
        
        if (!form) return;
        
        // Validation rules
        const validationRules = {
            name: (value) => {
                if (!value.trim()) return 'Name is required';
                if (value.length < 2) return 'Name must be at least 2 characters';
                if (value.length > 100) return 'Name is too long';
                return '';
            },
            email: (value) => {
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return '';
            },
            phone: (value) => {
                if (!value.trim()) return '';
                const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)\.]{7,}$/;
                if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
                return '';
            },
            subject: (value) => {
                if (!value.trim()) return 'Subject is required';
                if (value.length < 5) return 'Subject must be at least 5 characters';
                if (value.length > 200) return 'Subject is too long';
                return '';
            },
            message: (value) => {
                if (!value.trim()) return 'Message is required';
                if (value.length < 10) return 'Message must be at least 10 characters';
                if (value.length > 2000) return 'Message is too long';
                return '';
            }
        };
        
        // Character counter for message
        if (messageTextarea && charCount) {
            messageTextarea.addEventListener('input', function() {
                const length = this.value.length;
                charCount.textContent = length;
                
                if (length > 2000) {
                    charCount.style.color = '#dc2626';
                } else if (length > 1500) {
                    charCount.style.color = '#f59e0b';
                } else {
                    charCount.style.color = '#10b981';
                }
            });
        }
        
        // Real-time validation
        form.addEventListener('input', function(e) {
            const input = e.target;
            const fieldName = input.name;
            const validationType = input.dataset.validation;
            
            if (validationType && validationRules[validationType]) {
                validateField(input, validationType);
            }
        });
        
        // Validate a single field
        function validateField(field, type) {
            const value = field.value;
            const errorMessage = validationRules[type](value);
            const validationMessage = field.parentElement.querySelector('.validation-message');
            
            field.classList.remove('valid', 'invalid');
            validationMessage.textContent = '';
            validationMessage.className = 'validation-message';
            
            if (errorMessage) {
                field.classList.add('invalid');
                validationMessage.textContent = errorMessage;
                validationMessage.classList.add('error');
                return false;
            } else if (value.trim()) {
                field.classList.add('valid');
                validationMessage.classList.add('success');
                return true;
            }
            
            return true;
        }
        
        // File upload handling
        const fileInput = document.getElementById('attachment');
        const fileName = document.querySelector('.file-name');
        
        if (fileInput && fileName) {
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const file = this.files[0];
                    const fileSize = file.size / 1024 / 1024; // MB
                    
                    if (fileSize > 10) {
                        fileName.textContent = 'File too large (max 10MB)';
                        fileName.style.color = '#dc2626';
                        this.value = '';
                    } else {
                        fileName.textContent = file.name;
                        fileName.style.color = '#10b981';
                    }
                } else {
                    fileName.textContent = 'No file chosen';
                    fileName.style.color = '#666';
                }
            });
        }
        
        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            const fieldsToValidate = [
                { field: document.getElementById('fullName'), type: 'name' },
                { field: document.getElementById('email'), type: 'email' },
                { field: document.getElementById('subject'), type: 'subject' },
                { field: document.getElementById('message'), type: 'message' }
            ];
            
            fieldsToValidate.forEach(({ field, type }) => {
                if (!validateField(field, type)) {
                    isValid = false;
                }
            });
            
            // Check honeypot field
            const honeypot = document.getElementById('website');
            if (honeypot && honeypot.value.trim() !== '') {
                console.log('Spam detected - honeypot field filled');
                showToast('Submission blocked - suspicious activity detected', 'error');
                return;
            }
            
            // Check terms agreement
            const terms = document.querySelector('input[name="terms"]');
            if (!terms.checked) {
                showToast('Please agree to the Privacy Policy and Terms of Service', 'error');
                return;
            }
            
            if (!isValid) {
                showToast('Please fix the errors in the form', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            
            // Simulate API call with delay
            setTimeout(() => {
                // Generate reference ID
                const referenceId = 'GT-' + new Date().getTime();
                
                // Show success modal
                document.getElementById('referenceId').textContent = referenceId;
                document.getElementById('successModal').style.display = 'flex';
                
                // Reset form
                form.reset();
                
                // Reset character counter
                if (charCount) charCount.textContent = '0';
                
                // Reset file name display
                if (fileName) {
                    fileName.textContent = 'No file chosen';
                    fileName.style.color = '#666';
                }
                
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'flex';
                btnLoading.style.display = 'none';
                
                // Send auto-reply email simulation
                simulateAutoReply();
                
                console.log('✅ Form submitted successfully');
            }, 2000);
        });
    }
    
    // Initialize live chat
    function initLiveChat() {
        const chatWidget = document.getElementById('chatWidget');
        const openChatBtn = document.getElementById('openChat');
        const closeChatBtn = document.getElementById('closeChat');
        const chatInput = document.getElementById('chatInput');
        const sendChatBtn = document.getElementById('sendChat');
        const chatMessages = document.getElementById('chatMessages');
        
        if (!chatWidget) return;
        
        // Chat responses pool
        const chatResponses = [
            "Hello! I'm Sophia, your GeoAI support assistant. How can I help you today?",
            "For technical support, you can email support@geoaitutors.eu for detailed assistance.",
            "Course enrollment questions are best handled by our admissions team at admissions@geoaitutors.eu.",
            "Live class technical issues should be reported immediately during the session for fastest resolution.",
            "You can download course materials from the Resources tab in your dashboard.",
            "Our business hours are Monday-Friday, 9:00-18:00 CET. Responses may take longer outside these hours.",
            "For urgent technical issues during live sessions, please use the 'Raise Hand' feature in the classroom.",
            "You can schedule a consultation call with our admissions team through the portal."
        ];
        
        // Current response index
        let responseIndex = 0;
        
        // Open chat
        openChatBtn.addEventListener('click', function() {
            chatWidget.style.display = 'flex';
            
            // Auto-scroll to bottom
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        });
        
        // Close chat
        closeChatBtn.addEventListener('click', function() {
            chatWidget.style.display = 'none';
        });
        
        // Send message
        function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;
            
            // Add user message
            addChatMessage('You', message, 'user');
            chatInput.value = '';
            
            // Simulate typing delay
            setTimeout(() => {
                // Get next response
                const response = chatResponses[responseIndex];
                responseIndex = (responseIndex + 1) % chatResponses.length;
                
                // Add bot response
                addChatMessage('Sophia (Support)', response, 'bot');
            }, 1000 + Math.random() * 2000); // 1-3 second delay
        }
        
        // Add chat message
        function addChatMessage(sender, message, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${type}`;
            
            const time = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            messageDiv.innerHTML = `
                <div class="message-sender">${sender}</div>
                <div class="message-content">${message}</div>
                <div class="message-time">${time}</div>
            `;
            
            chatMessages.appendChild(messageDiv);
            
            // Auto-scroll
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Event listeners
        sendChatBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Add initial welcome message
        addChatMessage('Sophia (Support)', chatResponses[0], 'bot');
    }
    
    // Initialize schedule visit button
    function initScheduleVisit() {
        const scheduleBtn = document.getElementById('scheduleVisit');
        
        if (scheduleBtn) {
            scheduleBtn.addEventListener('click', function() {
                showModal(
                    'Schedule Office Visit',
                    'Please select your preferred date and time for an office visit. Our team will confirm your appointment within 24 hours.',
                    [
                        { text: 'Cancel', type: 'secondary' },
                        { 
                            text: 'Open Calendar', 
                            type: 'primary',
                            action: () => {
                                window.open('https://calendar.google.com/calendar/u/0/r/week', '_blank');
                                showToast('Calendar opened in new tab');
                            }
                        }
                    ]
                );
            });
        }
    }
    
    // Initialize success modal
    function initSuccessModal() {
        const modal = document.getElementById('successModal');
        const closeModalBtn = document.getElementById('closeModal');
        
        if (modal && closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            // Close on background click
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }
    
    // Simulate auto-reply email
    function simulateAutoReply() {
        // This would normally send an actual email
        // For demo, we'll just log it
        console.log('📧 Auto-reply email sent to user');
        
        // Simulate sending confirmation email
        setTimeout(() => {
            showToast('Confirmation email sent to your inbox', 'success');
        }, 1000);
    }
    
    // Utility: Show toast notification
    function showToast(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Style based on type
        const bgColor = type === 'error' ? '#dc2626' : 
                       type === 'success' ? '#10B981' : '#2563EB';
        
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1002;
            animation: toastSlideUp 0.3s ease;
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'toastSlideDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
    
    // Utility: Show modal
    function showModal(title, message, buttons = []) {
        // Remove existing modal
        document.querySelectorAll('.custom-modal').forEach(modal => modal.remove());
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1002;
            animation: fadeIn 0.3s ease;
        `;
        
        // Create buttons HTML
        let buttonsHTML = '';
        buttons.forEach((btn, index) => {
            const btnClass = btn.type === 'primary' ? 'modal-btn-primary' : 'modal-btn-secondary';
            buttonsHTML += `
                <button class="${btnClass}" data-index="${index}">
                    ${btn.text}
                </button>
            `;
        });
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                padding: 2rem;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                animation: slideInUp 0.3s ease;
            ">
                <h3 style="color: #1D4ED8; margin-bottom: 1rem;">${title}</h3>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">${message}</p>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    ${buttonsHTML}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners to buttons
        buttons.forEach((btn, index) => {
            const button = modal.querySelector(`button[data-index="${index}"]`);
            if (button && btn.action) {
                button.addEventListener('click', () => {
                    btn.action();
                    modal.remove();
                });
            }
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Add CSS animations
    function addAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes toastSlideUp {
                from {
                    transform: translate(-50%, 100%);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            }
            
            @keyframes toastSlideDown {
                from {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
                to {
                    transform: translate(-50%, 100%);
                    opacity: 0;
                }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideInUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .custom-marker {
                font-size: 2rem;
                color: #1D4ED8;
                text-align: center;
            }
            
            .map-popup h4 {
                margin: 0 0 0.5rem 0;
                color: #1D4ED8;
            }
            
            .map-popup p {
                margin: 0.25rem 0;
                color: #666;
            }
            
            .chat-message {
                margin-bottom: 1rem;
                padding: 0.75rem;
                border-radius: 10px;
                max-width: 80%;
            }
            
            .chat-message.user {
                background: #e2e8f0;
                margin-left: auto;
            }
            
            .chat-message.bot {
                background: #dbeafe;
                margin-right: auto;
            }
            
            .message-sender {
                font-weight: 600;
                font-size: 0.9rem;
                margin-bottom: 0.25rem;
                color: #1D4ED8;
            }
            
            .message-content {
                color: #333;
                line-height: 1.4;
            }
            
            .message-time {
                font-size: 0.7rem;
                color: #666;
                text-align: right;
                margin-top: 0.25rem;
            }
            
            .modal-btn-primary {
                padding: 0.75rem 1.5rem;
                background: #2563EB;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            }
            
            .modal-btn-primary:hover {
                background: #1D4ED8;
            }
            
            .modal-btn-secondary {
                padding: 0.75rem 1.5rem;
                background: #e2e8f0;
                color: #333;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            }
            
            .modal-btn-secondary:hover {
                background: #cbd5e1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize everything
    function initContactPage() {
        console.log('Initializing World-Class Contact Page...');
        
        // Add animations
        addAnimations();
        
        // Initialize components
        initBackgroundSlider();
        initMap();
        initFormValidation();
        initLiveChat();
        initScheduleVisit();
        initSuccessModal();
        
        console.log('✅ World-Class Contact Page initialized successfully');
    }
    
    // Start initialization
    setTimeout(initContactPage, 100);
});