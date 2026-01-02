// LIVE CLASS PAGE JAVASCRIPT - PROFESSIONAL VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 GeoAI Tutors Live Class Platform loaded');
    
    // Initialize background slider
    function initBackgroundSlider() {
        const bgSlider = document.querySelector('.bg-slider');
        const slides = [
            'https://th.bing.com/th/id/OIP.hox91sU6EdmV6IA07smh0AHaEe?w=256&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
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
    
    // Initialize classroom tabs
    function initClassroomTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    content.style.display = 'none';
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show corresponding content
                const targetTab = document.getElementById(`${tabId}-tab`);
                if (targetTab) {
                    targetTab.classList.add('active');
                    targetTab.style.display = 'flex';
                }
            });
        });
    }
    
    // Initialize chat functionality
    function initChat() {
        const chatInput = document.querySelector('.chat-input input');
        const sendButton = document.querySelector('.send-btn');
        const chatMessages = document.querySelector('.chat-messages');
        
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                // Create new message element
                const messageElement = document.createElement('div');
                messageElement.className = 'message';
                messageElement.innerHTML = `
                    <div class="message-header">
                        <span class="message-sender">You</span>
                        <span class="message-time">${getCurrentTime()}</span>
                    </div>
                    <div class="message-content">${message}</div>
                `;
                
                // Add to chat
                chatMessages.appendChild(messageElement);
                chatInput.value = '';
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate instructor response after 2 seconds
                setTimeout(() => {
                    const responses = [
                        "Great question! Let me explain that in more detail.",
                        "Yes, that's an important point. We'll cover it in the next section.",
                        "Can you elaborate on what specifically you're trying to achieve?",
                        "I'll demonstrate that in the live coding session coming up.",
                        "That's covered in the downloadable materials. Check the resources tab."
                    ];
                    
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    
                    const responseElement = document.createElement('div');
                    responseElement.className = 'message instructor';
                    responseElement.innerHTML = `
                        <div class="message-header">
                            <span class="message-sender">Prof. Rossi (Instructor)</span>
                            <span class="message-time">${getCurrentTime()}</span>
                        </div>
                        <div class="message-content">${randomResponse}</div>
                    `;
                    
                    chatMessages.appendChild(responseElement);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 2000);
            }
        };
        
        // Send message on button click
        sendButton.addEventListener('click', sendMessage);
        
        // Send message on Enter key
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Initialize session timers
    function initSessionTimers() {
        function updateTimer() {
            const timerElements = document.querySelectorAll('.session-time strong');
            timerElements.forEach(element => {
                // This would normally calculate time until session
                // For demo, we'll just update with current time
                const now = new Date();
                const options = { 
                    weekday: 'long', 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZone: 'Europe/Berlin'
                };
                element.textContent = now.toLocaleDateString('en-US', options);
            });
        }
        
        // Update every minute
        updateTimer();
        setInterval(updateTimer, 60000);
    }
    
    // Initialize reminder buttons
    function initReminderButtons() {
        const reminderButtons = document.querySelectorAll('.btn-primary');
        
        reminderButtons.forEach(button => {
            if (button.innerHTML.includes('bell')) {
                button.addEventListener('click', function() {
                    const sessionTitle = this.closest('.session-card').querySelector('h3').textContent;
                    
                    // Check if notifications are supported
                    if (!("Notification" in window)) {
                        alert("Browser doesn't support notifications");
                        return;
                    }
                    
                    // Request permission
                    Notification.requestPermission().then(permission => {
                        if (permission === "granted") {
                            // Create notification
                            const notification = new Notification("GeoAI Tutors Reminder", {
                                body: `Reminder set for: ${sessionTitle}`,
                                icon: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                            });
                            
                            // Update button text
                            const originalText = this.innerHTML;
                            this.innerHTML = '<i class="fas fa-check"></i> Reminder Set';
                            this.style.background = '#10B981';
                            
                            // Revert after 3 seconds
                            setTimeout(() => {
                                this.innerHTML = originalText;
                                this.style.background = '';
                            }, 3000);
                        } else {
                            alert("Please enable notifications to set reminders");
                        }
                    });
                });
            }
        });
    }
    
    // Initialize calendar buttons
    function initCalendarButtons() {
        const calendarButtons = document.querySelectorAll('.btn-secondary');
        
        calendarButtons.forEach(button => {
            if (button.innerHTML.includes('calendar-plus')) {
                button.addEventListener('click', function() {
                    const sessionCard = this.closest('.session-card');
                    const sessionTitle = sessionCard.querySelector('h3').textContent;
                    const sessionTime = sessionCard.querySelector('.session-time p').textContent;
                    
                    // Create ICS file
                    const icsContent = createICSEvent(sessionTitle, sessionTime);
                    
                    // Download file
                    const blob = new Blob([icsContent], { type: 'text/calendar' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${sessionTitle.replace(/\s+/g, '-')}.ics`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    
                    // Update button text
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Added to Calendar';
                    this.style.background = '#10B981';
                    
                    // Revert after 3 seconds
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.background = '';
                    }, 3000);
                });
            }
        });
    }
    
    function createICSEvent(title, time) {
        // Simple ICS content generator
        const startDate = new Date();
        startDate.setHours(startDate.getHours() + 24); // Tomorrow same time
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2); // 2 hour session
        
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GeoAI Tutors//Live Class//EN
BEGIN:VEVENT
UID:${Date.now()}@geoaitutors.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${title}
DESCRIPTION:GeoAI Tutors Live Class: ${title}\\nJoin at: ${window.location.href}
LOCATION:Online - GeoAI Tutors Platform
END:VEVENT
END:VCALENDAR`;
    }
    
    // Initialize timezone selector
    function initTimezoneSelector() {
        const timezoneSelect = document.getElementById('timezone');
        
        timezoneSelect.addEventListener('change', function() {
            const selectedTimezone = this.value;
            
            // Update all times based on selected timezone
            updateAllTimes(selectedTimezone);
            
            // Show confirmation
            showToast(`Times updated to ${selectedTimezone}`);
        });
    }
    
    function updateAllTimes(timezone) {
        // This would normally convert all displayed times
        // For demo, we'll just update the label
        const timezoneLabel = document.querySelector('.timezone-selector label');
        timezoneLabel.innerHTML = `<i class="fas fa-globe-europe"></i> Your Timezone: ${timezone}`;
    }
    
    // Initialize video controls
    function initVideoControls() {
        const controlButtons = document.querySelectorAll('.control-btn');
        
        controlButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.textContent.trim();
                
                switch(action) {
                    case 'Video':
                        this.classList.toggle('active');
                        showToast(this.classList.contains('active') ? 'Video enabled' : 'Video disabled');
                        break;
                    case 'Audio':
                        this.classList.toggle('active');
                        showToast(this.classList.contains('active') ? 'Audio enabled' : 'Audio disabled');
                        break;
                    case 'Share Screen':
                        if (!this.classList.contains('active')) {
                            this.classList.add('active');
                            showToast('Screen sharing started');
                        } else {
                            this.classList.remove('active');
                            showToast('Screen sharing stopped');
                        }
                        break;
                    case 'Leave':
                        if (confirm('Are you sure you want to leave the live session?')) {
                            window.location.href = '/liveclass/liveclass.html';
                        }
                        break;
                }
            });
        });
    }
    
    // Initialize recording playback
    function initRecordingPlayback() {
        const recordingCards = document.querySelectorAll('.recording-card');
        
        recordingCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking on links
                if (!e.target.closest('.action-link')) {
                    const title = this.querySelector('h3').textContent;
                    showModal(`Playing: ${title}`, 'The recording will open in a new player window.');
                }
            });
        });
    }
    
    // Utility function to show toast notifications
    function showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1D4ED8;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Utility function to show modal
    function showModal(title, message) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
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
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
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
                <p style="color: #666; margin-bottom: 2rem;">${message}</p>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button class="modal-cancel" style="
                        padding: 0.75rem 1.5rem;
                        background: #e2e8f0;
                        border: none;
                        border-radius: 8px;
                        color: #666;
                        cursor: pointer;
                    ">Cancel</button>
                    <button class="modal-confirm" style="
                        padding: 0.75rem 1.5rem;
                        background: #1D4ED8;
                        border: none;
                        border-radius: 8px;
                        color: white;
                        cursor: pointer;
                    ">Open Player</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-confirm').addEventListener('click', () => {
            modal.remove();
            showToast('Opening recording player...');
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Add CSS animations for toast and modal
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
        `;
        document.head.appendChild(style);
    }
    
    // Simulate live updates
    function simulateLiveUpdates() {
        // Update viewer count every 30 seconds
        setInterval(() => {
            const viewerCount = document.querySelector('.viewer-count');
            if (viewerCount) {
                const currentCount = parseInt(viewerCount.textContent.match(/\d+/)[0]);
                const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
                const newCount = Math.max(100, currentCount + change);
                viewerCount.innerHTML = `<i class="fas fa-users"></i> ${newCount} students currently online`;
            }
        }, 30000);
        
        // Simulate new chat messages
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance
                const messages = [
                    "This is really helpful, thanks!",
                    "Can we get the code for this example?",
                    "How does this scale with larger datasets?",
                    "Is there a GitHub repo for this project?",
                    "What's the best practice for deployment?"
                ];
                
                const students = ["Alex Chen", "Maria Garcia", "Thomas Weber", "Sarah Müller", "James Wilson"];
                const randomStudent = students[Math.floor(Math.random() * students.length)];
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                
                const chatMessages = document.querySelector('.chat-messages');
                if (chatMessages) {
                    const messageElement = document.createElement('div');
                    messageElement.className = 'message';
                    messageElement.innerHTML = `
                        <div class="message-header">
                            <span class="message-sender">${randomStudent}</span>
                            <span class="message-time">${getCurrentTime()}</span>
                        </div>
                        <div class="message-content">${randomMessage}</div>
                    `;
                    
                    chatMessages.appendChild(messageElement);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            }
        }, 15000);
    }
    
    // Initialize everything
    function initLiveClass() {
        console.log('Initializing Live Class Platform...');
        
        // Add animations
        addAnimations();
        
        // Initialize components
        initBackgroundSlider();
        initClassroomTabs();
        initChat();
        initSessionTimers();
        initReminderButtons();
        initCalendarButtons();
        initTimezoneSelector();
        initVideoControls();
        initRecordingPlayback();
        
        // Start live updates simulation
        simulateLiveUpdates();
        
        console.log('✅ Live Class Platform initialized successfully');
    }
    
    // Start initialization
    setTimeout(initLiveClass, 100);
});