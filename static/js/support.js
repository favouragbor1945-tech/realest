// SUPPORT PAGE JAVASCRIPT - COMPREHENSIVE VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🆘 GeoAI Tutors Support Center loaded');
    
    // Initialize background slider
    function initBackgroundSlider() {
        const bgSlider = document.querySelector('.bg-slider');
        const slides = [
            'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
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
    
    // Initialize stats counter animation
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const targetText = stat.textContent;
            let target;
            
            if (targetText.includes('/')) {
                // Handle 24/7 separately
                stat.textContent = '24/7';
                return;
            } else if (targetText.includes('min')) {
                target = parseInt(targetText.replace('min', ''));
            } else {
                target = parseInt(targetText.replace(/[^0-9]/g, ''));
            }
            
            let current = 0;
            const increment = target / 30;
            const duration = 1500;
            
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
                } else if (targetText.includes('min')) {
                    stat.textContent = Math.floor(current) + 'min';
                } else if (targetText.includes('+')) {
                    stat.textContent = Math.floor(current) + '+';
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, duration / 30);
        });
    }
    
    // Initialize chat widget
    function initChatWidget() {
        const chatWidget = document.querySelector('.chat-widget');
        const chatTriggers = document.querySelectorAll('.chat-trigger, .cta-button.secondary');
        const chatClose = document.querySelector('.chat-close');
        const chatMinimize = document.querySelector('.chat-minimize');
        const chatSend = document.querySelector('.send-btn');
        const chatInput = document.querySelector('.chat-input textarea');
        const chatMessages = document.querySelector('.chat-messages');
        
        let isMinimized = false;
        
        // Toggle chat widget
        chatTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                chatWidget.classList.add('active');
                isMinimized = false;
                chatWidget.style.height = 'auto';
                chatInput.focus();
                
                // Update status
                updateChatStatus('online');
            });
        });
        
        // Close chat
        chatClose.addEventListener('click', () => {
            chatWidget.classList.remove('active');
        });
        
        // Minimize chat
        chatMinimize.addEventListener('click', () => {
            isMinimized = !isMinimized;
            if (isMinimized) {
                chatWidget.style.height = '60px';
                chatMinimize.innerHTML = '<i class="fas fa-plus"></i>';
            } else {
                chatWidget.style.height = 'auto';
                chatMinimize.innerHTML = '<i class="fas fa-minus"></i>';
            }
        });
        
        // Send message
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                // Add user message
                const userMessage = document.createElement('div');
                userMessage.className = 'message user';
                userMessage.innerHTML = `
                    <div class="message-content">
                        <p>${message}</p>
                    </div>
                    <div class="message-time">${getCurrentTime()}</div>
                `;
                chatMessages.appendChild(userMessage);
                chatInput.value = '';
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Show typing indicator
                updateAgentStatus('typing', true);
                
                // Simulate agent response after delay
                setTimeout(() => {
                    updateAgentStatus('typing', false);
                    
                    const responses = [
                        "I understand. Let me check that for you. Can you provide more details about the error message you're seeing?",
                        "Thanks for sharing that information. I'll need to escalate this to our technical team. In the meantime, could you try clearing your browser cache?",
                        "That's a common issue. Here's what usually helps: restart the application and check your internet connection. Let me know if that works.",
                        "I'll need to access your account to investigate this further. Can you provide your student ID or the email associated with your account?",
                        "For security reasons, I'll send you a secure link to upload any screenshots or error logs. Check your email in a moment."
                    ];
                    
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    
                    const agentMessage = document.createElement('div');
                    agentMessage.className = 'message agent';
                    agentMessage.innerHTML = `
                        <div class="message-content">
                            <p>${randomResponse}</p>
                        </div>
                        <div class="message-time">${getCurrentTime()}</div>
                    `;
                    chatMessages.appendChild(agentMessage);
                    
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Update agent status
                    updateAgentStatus('online', true);
                }, 2000);
            }
        };
        
        // Send on button click
        chatSend.addEventListener('click', sendMessage);
        
        // Send on Enter key (but allow Shift+Enter for new line)
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Update agent status
        function updateAgentStatus(status, isTyping) {
            const statusElement = document.querySelector('.agent-status');
            const dotElement = document.querySelector('.status-dot');
            
            if (isTyping) {
                statusElement.innerHTML = '<span class="status-dot"></span> Typing...';
            } else {
                statusElement.innerHTML = '<span class="status-dot"></span> Online';
            }
        }
        
        // Update chat status
        function updateChatStatus(status) {
            const statusElement = document.querySelector('.chat-status');
            statusElement.textContent = status.toUpperCase();
            statusElement.className = `chat-status ${status}`;
        }
        
        // Simulate agent greeting after 3 seconds if chat is open
        setTimeout(() => {
            if (chatWidget.classList.contains('active')) {
                const greeting = document.createElement('div');
                greeting.className = 'message agent';
                greeting.innerHTML = `
                    <div class="message-content">
                        <p>Welcome to GeoAI Tutors support! My name is Alex. How can I assist you today?</p>
                    </div>
                    <div class="message-time">${getCurrentTime()}</div>
                `;
                chatMessages.appendChild(greeting);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }, 3000);
    }
    
    // Initialize schedule modal
    function initScheduleModal() {
        const scheduleModal = document.querySelector('.schedule-modal');
        const scheduleTriggers = document.querySelectorAll('.schedule-trigger');
        const modalClose = document.querySelector('.modal-close');
        const scheduleForm = document.getElementById('scheduleForm');
        
        // Open modal
        scheduleTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                scheduleModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal
        modalClose.addEventListener('click', () => {
            scheduleModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Close modal when clicking outside
        scheduleModal.addEventListener('click', (e) => {
            if (e.target === scheduleModal) {
                scheduleModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Handle form submission
        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('schedule-name').value,
                email: document.getElementById('schedule-email').value,
                topic: document.getElementById('schedule-topic').value,
                date: document.getElementById('schedule-date').value,
                time: document.getElementById('schedule-time').value,
                notes: document.getElementById('schedule-notes').value
            };
            
            // Simulate API call
            simulateScheduleCall(formData);
            
            // Close modal
            scheduleModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Reset form
            scheduleForm.reset();
        });
        
        // Set minimum date to today
        const dateInput = document.getElementById('schedule-date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Disable weekends
        dateInput.addEventListener('change', () => {
            const selectedDate = new Date(dateInput.value);
            const day = selectedDate.getDay();
            
            if (day === 0 || day === 6) { // Sunday or Saturday
                showNotification('Please select a weekday (Monday-Friday)', 'error');
                dateInput.value = '';
            }
        });
    }
    
    // Simulate schedule call
    function simulateScheduleCall(data) {
        // Show loading state
        showNotification('Scheduling your call...', 'info');
        
        setTimeout(() => {
            // Simulate successful scheduling
            showNotification(`Call scheduled for ${data.date} at ${data.time}! You'll receive a confirmation email shortly.`, 'success');
            
            // Log to console (in production, this would be an API call)
            console.log('Call scheduled:', data);
        }, 1500);
    }
    
    // Initialize support form
    function initSupportForm() {
        const supportForm = document.getElementById('supportForm');
        const fileInput = document.getElementById('attachments');
        const fileList = document.getElementById('fileList');
        
        // Handle file uploads
        fileInput.addEventListener('change', (e) => {
            fileList.innerHTML = '';
            const files = Array.from(e.target.files);
            
            if (files.length > 5) {
                showNotification('Maximum 5 files allowed', 'error');
                fileInput.value = '';
                return;
            }
            
            let totalSize = 0;
            files.forEach((file, index) => {
                totalSize += file.size;
                
                if (totalSize > 50 * 1024 * 1024) { // 50MB limit
                    showNotification('Total file size exceeds 50MB limit', 'error');
                    fileInput.value = '';
                    fileList.innerHTML = '';
                    return;
                }
                
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <div class="file-info">
                        <i class="fas fa-file file-icon"></i>
                        <span>${file.name} (${formatFileSize(file.size)})</span>
                    </div>
                    <button class="file-remove" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                fileList.appendChild(fileItem);
            });
            
            // Add remove functionality
            fileList.querySelectorAll('.file-remove').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    removeFile(index);
                });
            });
        });
        
        // Handle form submission
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(supportForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!validateSupportForm(data)) {
                return;
            }
            
            // Simulate form submission
            simulateSupportSubmission(data);
            
            // Reset form
            supportForm.reset();
            fileList.innerHTML = '';
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Form validation
        function validateSupportForm(data) {
            if (!data.name || !data.email || !data.subject || !data.category || !data.urgency || !data.message) {
                showNotification('Please fill in all required fields', 'error');
                return false;
            }
            
            if (!isValidEmail(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return false;
            }
            
            return true;
        }
        
        // Simulate support submission
        function simulateSupportSubmission(data) {
            // Show loading state
            const submitButton = supportForm.querySelector('.submit-button');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                showNotification('Support request submitted successfully! Ticket #GEO-2024-00126 created. We\'ll respond within the timeframe based on your urgency level.', 'success');
                
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Log to console (in production, this would be an API call)
                console.log('Support request submitted:', data);
                
                // Show ticket number
                const ticketNumber = 'GEO-2024-00126';
                showTicketConfirmation(ticketNumber, data.urgency);
            }, 2000);
        }
        
        // Remove file from list
        function removeFile(index) {
            const dt = new DataTransfer();
            const files = Array.from(fileInput.files);
            
            files.forEach((file, i) => {
                if (i !== index) {
                    dt.items.add(file);
                }
            });
            
            fileInput.files = dt.files;
            
            // Trigger change event to update UI
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }
    }
    
    // Show ticket confirmation
    function showTicketConfirmation(ticketNumber, urgency) {
        const confirmation = document.createElement('div');
        confirmation.className = 'ticket-confirmation';
        confirmation.innerHTML = `
            <div class="confirmation-content">
                <h3><i class="fas fa-check-circle"></i> Ticket Created</h3>
                <p>Your support ticket has been created successfully.</p>
                <div class="ticket-details">
                    <div class="detail-row">
                        <span class="detail-label">Ticket Number:</span>
                        <span class="detail-value">${ticketNumber}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Urgency Level:</span>
                        <span class="detail-value urgency-${urgency}">${urgency.toUpperCase()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Expected Response:</span>
                        <span class="detail-value">${getExpectedResponseTime(urgency)}</span>
                    </div>
                </div>
                <div class="confirmation-actions">
                    <button class="btn-close-confirmation">Close</button>
                    <button class="btn-view-ticket" data-ticket="${ticketNumber}">View Ticket</button>
                </div>
            </div>
        `;
        
        confirmation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 3000;
            max-width: 500px;
            width: 90%;
            animation: slideInUp 0.3s ease;
        `;
        
        document.body.appendChild(confirmation);
        document.body.style.overflow = 'hidden';
        
        // Add event listeners
        confirmation.querySelector('.btn-close-confirmation').addEventListener('click', () => {
            confirmation.remove();
            document.body.style.overflow = 'auto';
        });
        
        confirmation.querySelector('.btn-view-ticket').addEventListener('click', () => {
            confirmation.remove();
            document.body.style.overflow = 'auto';
            
            // Scroll to ticket section and highlight new ticket
            const ticketSection = document.getElementById('tickets');
            if (ticketSection) {
                ticketSection.scrollIntoView({ behavior: 'smooth' });
                
                // Add new ticket to the list (simulated)
                addNewTicket(ticketNumber);
            }
        });
        
        // Close when clicking outside
        confirmation.addEventListener('click', (e) => {
            if (e.target === confirmation) {
                confirmation.remove();
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Add new ticket to the list
    function addNewTicket(ticketNumber) {
        const ticketPreview = document.querySelector('.ticket-preview');
        
        const newTicket = document.createElement('div');
        newTicket.className = 'ticket-card new-ticket';
        newTicket.innerHTML = `
            <div class="ticket-header">
                <div class="ticket-info">
                    <h3>${ticketNumber}</h3>
                    <span class="ticket-status-badge pending">Pending</span>
                </div>
                <div class="ticket-date">
                    Created: Just now
                </div>
            </div>
            <div class="ticket-body">
                <h4>New Support Request</h4>
                <p>Your support request has been received and is awaiting assignment to an agent.</p>
                <div class="ticket-meta">
                    <span><i class="fas fa-user-tie"></i> Not assigned yet</span>
                    <span><i class="fas fa-clock"></i> Last update: Just now</span>
                    <span><i class="fas fa-comments"></i> 0 messages</span>
                </div>
            </div>
        `;
        
        ticketPreview.insertBefore(newTicket, ticketPreview.firstChild);
        
        // Highlight the new ticket
        newTicket.style.animation = 'pulse 2s';
        
        setTimeout(() => {
            newTicket.style.animation = '';
        }, 2000);
    }
    
    // Initialize ticket search
    function initTicketSearch() {
        const searchTicketBtn = document.querySelector('.search-ticket');
        const ticketNumberInput = document.getElementById('ticketNumber');
        
        searchTicketBtn.addEventListener('click', () => {
            const ticketNumber = ticketNumberInput.value.trim();
            
            if (!ticketNumber) {
                showNotification('Please enter a ticket number', 'error');
                return;
            }
            
            if (!isValidTicketNumber(ticketNumber)) {
                showNotification('Invalid ticket number format. Example: GEO-2024-00123', 'error');
                return;
            }
            
            // Simulate ticket search
            simulateTicketSearch(ticketNumber);
        });
        
        // Allow Enter key to trigger search
        ticketNumberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchTicketBtn.click();
            }
        });
    }
    
    // Simulate ticket search
    function simulateTicketSearch(ticketNumber) {
        const searchTicketBtn = document.querySelector('.search-ticket');
        const originalText = searchTicketBtn.textContent;
        
        // Show loading state
        searchTicketBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        searchTicketBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Reset button
            searchTicketBtn.textContent = originalText;
            searchTicketBtn.disabled = false;
            
            // Check if ticket exists in preview
            const tickets = document.querySelectorAll('.ticket-card h3');
            let found = false;
            
            tickets.forEach(ticket => {
                if (ticket.textContent === ticketNumber) {
                    found = true;
                    // Highlight the found ticket
                    const ticketCard = ticket.closest('.ticket-card');
                    ticketCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    ticketCard.style.animation = 'pulse 2s';
                    
                    setTimeout(() => {
                        ticketCard.style.animation = '';
                    }, 2000);
                    
                    showNotification(`Ticket ${ticketNumber} found!`, 'success');
                }
            });
            
            if (!found) {
                showNotification(`Ticket ${ticketNumber} not found. Please check the number and try again.`, 'error');
            }
        }, 1500);
    }
    
    // Initialize knowledge base search
    function initKnowledgeSearch() {
        const searchButton = document.querySelector('.search-button');
        const searchInput = document.getElementById('knowledgeSearch');
        const tags = document.querySelectorAll('.tag');
        
        searchButton.addEventListener('click', () => {
            performKnowledgeSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performKnowledgeSearch(searchInput.value);
            }
        });
        
        tags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                const tagText = tag.textContent;
                searchInput.value = tagText;
                performKnowledgeSearch(tagText);
            });
        });
    }
    
    // Perform knowledge search
    function performKnowledgeSearch(query) {
        if (!query.trim()) {
            showNotification('Please enter a search term', 'info');
            return;
        }
        
        // Show loading state
        const searchButton = document.querySelector('.search-button');
        const originalText = searchButton.textContent;
        searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        searchButton.disabled = true;
        
        // Simulate search
        setTimeout(() => {
            searchButton.textContent = originalText;
            searchButton.disabled = false;
            
            showNotification(`Found 15 articles for "${query}"`, 'success');
            
            // In a real implementation, this would filter/search articles
            // For now, we'll just log the search
            console.log('Knowledge base search:', query);
        }, 1000);
    }
    
    // Initialize view tickets button
    function initViewTickets() {
        const viewTicketsBtn = document.getElementById('view-tickets');
        
        if (viewTicketsBtn) {
            viewTicketsBtn.addEventListener('click', () => {
                const ticketSection = document.getElementById('tickets');
                if (ticketSection) {
                    ticketSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Focus on search input
                    const searchInput = document.getElementById('ticketNumber');
                    if (searchInput) {
                        searchInput.focus();
                    }
                }
            });
        }
    }
    
    // Utility functions
    function getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidTicketNumber(ticket) {
        const re = /^GEO-\d{4}-\d{5}$/;
        return re.test(ticket);
    }
    
    function getExpectedResponseTime(urgency) {
        const times = {
            low: 'Within 48 hours',
            medium: 'Within 24 hours',
            high: 'Within 4 hours',
            critical: 'Under 1 hour'
        };
        return times[urgency] || 'Within 24 hours';
    }
    
    function showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            info: '#3B82F6',
            warning: '#F59E0B'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || '#3B82F6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    // Add CSS animations
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
            
            .new-ticket {
                border-left-color: #F59E0B !important;
            }
            
            .urgency-low { color: #10B981; }
            .urgency-medium { color: #F59E0B; }
            .urgency-high { color: #EF4444; }
            .urgency-critical { color: #DC2626; }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize everything
    function initSupport() {
        console.log('Initializing Support Center...');
        
        // Add animations
        addAnimations();
        
        // Initialize components
        initBackgroundSlider();
        initStatsCounter();
        initChatWidget();
        initScheduleModal();
        initSupportForm();
        initTicketSearch();
        initKnowledgeSearch();
        initViewTickets();
        
        // Show welcome notification
        setTimeout(() => {
            showNotification('Welcome to GeoAI Tutors Support Center! How can we help you today?', 'info');
        }, 1000);
        
        console.log('✅ Support Center initialized successfully');
    }
    
    // Start initialization
    setTimeout(initSupport, 100);
});