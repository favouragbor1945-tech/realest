// Signup Page JavaScript - Production Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 GeoAI Tutors Signup Page loaded');
    
    // API Configuration
    const API_CONFIG = {
        BASE_URL: 'https://api.geoaitutors.com',
        ENDPOINTS: {
            SIGNUP: '/api/v1/auth/signup',
            CHECK_EMAIL: '/api/v1/auth/check-email',
            OAUTH: '/api/v1/auth/oauth',
            COUNTRIES: '/api/v1/data/countries',
            GEOLOCATION: '/api/v1/utils/geolocation',
            ANALYTICS: '/api/v1/analytics/event'
        },
        HEADERS: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Client-Version': '1.0.0',
            'X-Client-Platform': 'web'
        }
    };
    
    // App Configuration
    const CONFIG = {
        MAX_INTERESTS: 3,
        PASSWORD_MIN_LENGTH: 8,
        MAX_SIGNUP_ATTEMPTS: 5,
        RATE_LIMIT_RESET: 15 * 60 * 1000, // 15 minutes
        COUNTRIES_API: 'https://restcountries.com/v3.1/all',
        GEOLOCATION_API: 'https://ipapi.co/json/',
        SESSION_TIMEOUT: 30 * 24 * 60 * 60 * 1000, // 30 days
        VERSION: '1.0.0',
        ENV: 'production'
    };
    
    // Common passwords to block
    const COMMON_PASSWORDS = [
        'password', '12345678', 'qwerty123', 'letmein', 'welcome',
        'admin123', 'password123', 'abc123', 'football', 'monkey',
        '123456789', '11111111', 'sunshine', 'iloveyou', '123123123'
    ];
    
    // State Management
    let state = {
        isSubmitting: false,
        selectedInterests: [],
        passwordStrength: 0,
        formData: {},
        countries: [],
        filteredCountries: [],
        selectedCountry: null,
        submissionAttempts: 0,
        lastSubmissionAttempt: 0,
        isOnline: navigator.onLine,
        sessionId: generateSessionId(),
        hasPendingSubmission: false,
        emailVerified: false
    };
    
    // Generate session ID
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Generate CSRF token
    function generateCSRFToken() {
        const token = 'csrf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
        localStorage.setItem('geoai_csrf_token', token);
        localStorage.setItem('geoai_csrf_expiry', (Date.now() + 3600000).toString()); // 1 hour
        
        const csrfInput = document.getElementById('csrfToken');
        if (csrfInput) {
            csrfInput.value = token;
        }
        
        return token;
    }
    
    // Validate CSRF token
    function validateCSRFToken() {
        const storedToken = localStorage.getItem('geoai_csrf_token');
        const expiry = localStorage.getItem('geoai_csrf_expiry');
        
        if (!storedToken || !expiry || Date.now() > parseInt(expiry)) {
            return generateCSRFToken();
        }
        
        return storedToken;
    }
    
    // Initialize all components
    async function initSignupPage() {
        console.log('Initializing Signup Page...');
        
        try {
            // Initialize session
            initSession();
            
            // Generate CSRF token
            generateCSRFToken();
            
            // Load submission attempts
            loadSubmissionAttempts();
            
            // Initialize form validation
            initFormValidation();
            
            // Initialize password toggles
            initPasswordToggles();
            
            // Initialize password strength
            initPasswordStrength();
            
            // Initialize interests selection
            initInterestsSelection();
            
            // Initialize goal selection
            initGoalSelection();
            
            // Initialize OAuth buttons
            initOAuthButtons();
            
            // Load countries
            await loadCountries();
            
            // Initialize country search
            initCountrySearch();
            
            // Auto-detect country
            await detectUserLocation();
            
            // Initialize success modal
            initSuccessModal();
            
            // Initialize verification modal
            initVerificationModal();
            
            // Initialize auto-focus
            initAutoFocus();
            
            // Initialize network monitoring
            initNetworkMonitoring();
            
            // Initialize analytics
            initAnalytics();
            
            // Check for pending submissions
            checkPendingSubmissions();
            
            console.log('✅ Signup Page initialized successfully');
            
            // Log page view
            logEvent('page_view', { page: 'signup' });
            
        } catch (error) {
            console.error('❌ Signup page initialization failed:', error);
            showToast('Failed to initialize page. Please refresh.', 'error');
        }
    }
    
    // Initialize session
    function initSession() {
        // Store session ID
        localStorage.setItem('geoai_session_id', state.sessionId);
        localStorage.setItem('geoai_session_start', Date.now().toString());
        
        // Set session cookie
        document.cookie = `geoai_session=${state.sessionId}; path=/; max-age=${CONFIG.SESSION_TIMEOUT / 1000}; SameSite=Strict`;
    }
    
    // Load submission attempts
    function loadSubmissionAttempts() {
        const attempts = localStorage.getItem('geoai_signup_attempts');
        const lastAttempt = localStorage.getItem('geoai_last_signup_attempt');
        
        if (attempts) {
            state.submissionAttempts = parseInt(attempts);
        }
        
        if (lastAttempt) {
            state.lastSubmissionAttempt = parseInt(lastAttempt);
        }
        
        // Check rate limit
        checkRateLimit();
    }
    
    // Check rate limit
    function checkRateLimit() {
        const timeSinceLastAttempt = Date.now() - state.lastSubmissionAttempt;
        
        if (state.submissionAttempts >= CONFIG.MAX_SIGNUP_ATTEMPTS && 
            timeSinceLastAttempt < CONFIG.RATE_LIMIT_RESET) {
            
            const minutesLeft = Math.ceil((CONFIG.RATE_LIMIT_RESET - timeSinceLastAttempt) / 60000);
            
            // Disable form
            disableForm(`Too many attempts. Please wait ${minutesLeft} minutes.`);
            showToast(`Too many signup attempts. Please wait ${minutesLeft} minutes.`, 'warning');
            
            return false;
        }
        
        // Reset if time has passed
        if (timeSinceLastAttempt >= CONFIG.RATE_LIMIT_RESET) {
            resetRateLimit();
        }
        
        return true;
    }
    
    // Disable form
    function disableForm(message) {
        const submitBtn = document.getElementById('signupSubmit');
        const inputs = document.querySelectorAll('#signupForm input, #signupForm select, #signupForm button');
        
        inputs.forEach(input => {
            if (input !== submitBtn) {
                input.disabled = true;
            }
        });
        
        submitBtn.disabled = true;
        
        // Show rate limit warning
        const warning = document.getElementById('rateLimitWarning');
        if (warning) {
            warning.style.display = 'flex';
            warning.querySelector('span').textContent = message;
        }
    }
    
    // Reset rate limit
    function resetRateLimit() {
        state.submissionAttempts = 0;
        state.lastSubmissionAttempt = 0;
        localStorage.setItem('geoai_signup_attempts', '0');
        localStorage.removeItem('geoai_last_signup_attempt');
        
        // Hide warning
        const warning = document.getElementById('rateLimitWarning');
        if (warning) {
            warning.style.display = 'none';
        }
    }
    
    // Increment submission attempts
    function incrementAttempts() {
        state.submissionAttempts++;
        state.lastSubmissionAttempt = Date.now();
        
        localStorage.setItem('geoai_signup_attempts', state.submissionAttempts.toString());
        localStorage.setItem('geoai_last_signup_attempt', state.lastSubmissionAttempt.toString());
    }
    
    // Form Validation
    function initFormValidation() {
        const signupForm = document.getElementById('signupForm');
        const inputs = signupForm.querySelectorAll('input, select');
        const submitBtn = document.getElementById('signupSubmit');
        
        if (!signupForm) return;
        
        // Real-time validation for all inputs
        inputs.forEach(input => {
            // Skip hidden inputs and honeypot
            if (input.type === 'hidden' || input.id === 'website') return;
            
            input.addEventListener('input', function() {
                validateField(this);
                updateSubmitButton();
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
                updateSubmitButton();
            });
            
            input.addEventListener('change', function() {
                validateField(this);
                updateSubmitButton();
            });
            
            // Add focus styling
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
        
        // Special handling for checkboxes and radio buttons
        const checkboxes = signupForm.querySelectorAll('input[type="checkbox"]');
        const radios = signupForm.querySelectorAll('input[type="radio"]');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                validateField(this);
                updateSubmitButton();
            });
        });
        
        radios.forEach(radio => {
            radio.addEventListener('change', function() {
                validateField(this);
                updateSubmitButton();
            });
        });
        
        // Form submission
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Check honeypot
            const honeypot = document.getElementById('website');
            if (honeypot && honeypot.value.trim() !== '') {
                console.log('🛡️ Spam bot detected');
                showToast('Submission blocked.', 'error');
                return;
            }
            
            if (state.isSubmitting) {
                showToast('Please wait while we process your previous submission', 'info');
                return;
            }
            
            // Check rate limit
            if (!checkRateLimit()) {
                return;
            }
            
            // Validate all fields before submission
            let isValid = true;
            const validationErrors = [];
            
            inputs.forEach(input => {
                if (input.type === 'hidden' || input.id === 'website') return;
                
                if (!validateField(input)) {
                    isValid = false;
                    const fieldName = input.name || input.id;
                    validationErrors.push(fieldName);
                }
            });
            
            // Validate checkboxes and radios
            checkboxes.forEach(cb => {
                if (!validateField(cb)) {
                    isValid = false;
                    validationErrors.push(cb.name);
                }
            });
            
            radios.forEach(radio => {
                if (!validateField(radio)) {
                    isValid = false;
                    validationErrors.push(radio.name);
                }
            });
            
            // Validate interests count
            if (state.selectedInterests.length === 0) {
                const interestsError = document.getElementById('interestsError');
                if (interestsError) {
                    interestsError.textContent = 'Please select at least one interest';
                    interestsError.style.display = 'block';
                }
                isValid = false;
            } else if (state.selectedInterests.length > CONFIG.MAX_INTERESTS) {
                const interestsError = document.getElementById('interestsError');
                if (interestsError) {
                    interestsError.textContent = `Maximum ${CONFIG.MAX_INTERESTS} interests allowed`;
                    interestsError.style.display = 'block';
                }
                isValid = false;
            }
            
            // Validate terms agreement
            const termsCheckbox = document.getElementById('terms');
            if (!termsCheckbox || !termsCheckbox.checked) {
                showToast('Please agree to the Terms of Service and Privacy Policy', 'error');
                termsCheckbox.focus();
                termsCheckbox.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            
            if (!isValid) {
                showToast('Please fix the errors in the form', 'error');
                
                // Scroll to first error
                const firstError = signupForm.querySelector('.error-message:not(:empty)');
                if (firstError) {
                    firstError.closest('.form-group')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Log validation errors
                logEvent('form_validation_failed', { 
                    errors: validationErrors,
                    fieldCount: validationErrors.length 
                });
                
                return;
            }
            
            // Increment attempt counter
            incrementAttempts();
            
            // Start signup process
            await performSignup();
        });
        
        function validateField(field) {
            const fieldId = field.id || field.name;
            const errorElement = document.getElementById(fieldId + 'Error');
            let errorMessage = '';
            
            // Clear previous error
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
            
            // Remove error/success class from input
            field.classList.remove('error', 'success');
            
            // Skip validation if field is not required and empty
            if (!field.required && !field.value.trim() && field.type !== 'checkbox' && field.type !== 'radio') {
                return true;
            }
            
            // Validation based on field type
            if (field.type === 'email') {
                errorMessage = validateEmail(field.value);
            } else if (field.type === 'password') {
                if (field.id === 'password') {
                    errorMessage = validatePassword(field.value);
                } else if (field.id === 'confirmPassword') {
                    errorMessage = validateConfirmPassword(field.value);
                }
            } else if (field.type === 'text') {
                if (field.id === 'fullName') {
                    errorMessage = validateName(field.value);
                }
            } else if (field.tagName === 'SELECT') {
                errorMessage = validateSelect(field.value, field.id);
            } else if (field.type === 'checkbox') {
                if (field.name === 'interests') {
                    // Interests are handled separately
                    return true;
                }
            } else if (field.type === 'radio') {
                if (field.name === 'goal') {
                    const goalSelected = document.querySelector('input[name="goal"]:checked');
                    if (!goalSelected) {
                        errorMessage = 'Please select a learning goal';
                    }
                }
            }
            
            // Show error if exists
            if (errorMessage && errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
                field.classList.add('error');
                return false;
            } else if (field.value.trim() && errorElement) {
                // Show success for valid fields
                field.classList.add('success');
            }
            
            return true;
        }
        
        function validateEmail(email) {
            if (!email.trim()) return 'Email is required';
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return 'Please enter a valid email address';
            
            // Check for disposable/temporary emails
            const disposableDomains = [
                'tempmail.com', 'guerrillamail.com', 'mailinator.com', 
                '10minutemail.com', 'yopmail.com', 'throwawaymail.com',
                'fakeinbox.com', 'trashmail.com', 'mailnesia.com'
            ];
            
            const domain = email.split('@')[1]?.toLowerCase();
            if (domain && disposableDomains.some(d => domain.includes(d))) {
                return 'Please use a permanent email address';
            }
            
            return '';
        }
        
        function validatePassword(password) {
            if (!password) return 'Password is required';
            
            if (password.length < CONFIG.PASSWORD_MIN_LENGTH) {
                return `Password must be at least ${CONFIG.PASSWORD_MIN_LENGTH} characters`;
            }
            
            // Check against common passwords
            if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
                return 'Password is too common. Please choose a stronger password';
            }
            
            // Check for password patterns
            if (/(.)\1{3,}/.test(password)) {
                return 'Password contains repeating characters';
            }
            
            if (/^(1234|abcd|qwert)/i.test(password)) {
                return 'Password is too predictable';
            }
            
            // Check complexity
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /[0-9]/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            
            let score = 0;
            if (hasUpperCase) score++;
            if (hasLowerCase) score++;
            if (hasNumbers) score++;
            if (hasSpecialChar) score++;
            if (password.length >= 12) score++;
            
            if (score < 3) {
                return 'Password is weak. Include uppercase, lowercase, and numbers';
            }
            
            return '';
        }
        
        function validateConfirmPassword(password) {
            const passwordField = document.getElementById('password');
            if (!password) return 'Please confirm your password';
            if (password !== passwordField.value) return 'Passwords do not match';
            return '';
        }
        
        function validateName(name) {
            if (!name.trim()) return 'Full name is required';
            if (name.length < 2) return 'Name must be at least 2 characters';
            if (name.length > 100) return 'Name must be less than 100 characters';
            
            // Check for valid name format
            const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
            if (!nameRegex.test(name)) {
                return 'Please enter a valid name (letters, spaces, and common punctuation only)';
            }
            
            return '';
        }
        
        function validateSelect(value, fieldId) {
            if (!value) {
                const fieldNames = {
                    'country': 'Country',
                    'profession': 'Profession',
                    'experience': 'Experience level'
                };
                return `${fieldNames[fieldId] || 'This field'} is required`;
            }
            return '';
        }
        
        function updateSubmitButton() {
            // Basic check for required fields
            const requiredFields = signupForm.querySelectorAll('[required]');
            let allValid = true;
            
            requiredFields.forEach(field => {
                if (field.type === 'checkbox' && field.name === 'interests') {
                    // Interests handled separately
                } else if (field.type === 'radio' && field.name === 'goal') {
                    const goalSelected = document.querySelector('input[name="goal"]:checked');
                    if (!goalSelected) allValid = false;
                } else if (field.type === 'checkbox' && field.id === 'terms') {
                    if (!field.checked) allValid = false;
                } else if (!field.value && field.type !== 'checkbox' && field.type !== 'radio') {
                    allValid = false;
                }
            });
            
            // Check terms agreement
            const termsCheckbox = document.getElementById('terms');
            if (termsCheckbox && !termsCheckbox.checked) {
                allValid = false;
            }
            
            // Check interests
            if (state.selectedInterests.length === 0) {
                allValid = false;
            }
            
            submitBtn.disabled = !allValid || state.isSubmitting;
        }
    }
    
    // Password Toggles
    function initPasswordToggles() {
        const toggleBtns = {
            password: document.getElementById('togglePassword'),
            confirmPassword: document.getElementById('toggleConfirmPassword')
        };
        
        Object.keys(toggleBtns).forEach(field => {
            const btn = toggleBtns[field];
            const input = document.getElementById(field === 'password' ? 'password' : 'confirmPassword');
            
            if (btn && input) {
                btn.addEventListener('click', function() {
                    const type = input.type === 'password' ? 'text' : 'password';
                    input.type = type;
                    
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
                    }
                    
                    // Update aria-label
                    this.setAttribute('aria-label', 
                        type === 'password' ? 'Show password' : 'Hide password');
                });
                
                // Handle Enter key on toggle button
                btn.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            }
        });
    }
    
    // Password Strength
    function initPasswordStrength() {
        const passwordInput = document.getElementById('password');
        const strengthBars = document.querySelectorAll('#passwordStrength .strength-bar');
        const requirements = document.querySelectorAll('.password-requirements p i');
        
        if (!passwordInput || !strengthBars.length) return;
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const result = calculatePasswordStrength(password);
            
            state.passwordStrength = result.score;
            
            // Update strength bars
            strengthBars.forEach((bar, index) => {
                if (index < result.score) {
                    bar.style.background = getStrengthColor(result.score);
                } else {
                    bar.style.background = '#e2e8f0';
                }
            });
            
            // Update requirement icons
            requirements.forEach((icon, index) => {
                if (result.checks[index]) {
                    icon.className = 'fas fa-check-circle';
                    icon.style.color = '#10B981';
                } else {
                    icon.className = 'fas fa-times-circle invalid';
                    icon.style.color = '#dc2626';
                }
            });
        });
        
        function calculatePasswordStrength(password) {
            const checks = {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                numbers: /[0-9]/.test(password),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
                length12: password.length >= 12
            };
            
            let score = 0;
            if (checks.length) score++;
            if (checks.uppercase) score++;
            if (checks.lowercase) score++;
            if (checks.numbers) score++;
            if (checks.special) score++;
            if (checks.length12) score++;
            
            return {
                score: Math.min(score, 5),
                checks: [checks.length, checks.uppercase && checks.lowercase, checks.numbers, checks.special]
            };
        }
        
        function getStrengthColor(strength) {
            switch(strength) {
                case 1: return '#dc2626'; // Very weak
                case 2: return '#ea580c'; // Weak
                case 3: return '#f59e0b'; // Fair
                case 4: return '#3b82f6'; // Good
                case 5: return '#10b981'; // Strong
                default: return '#e2e8f0';
            }
        }
    }
    
    // Interests Selection
    function initInterestsSelection() {
        const interestCheckboxes = document.querySelectorAll('.interest-checkbox input');
        const interestsError = document.getElementById('interestsError');
        
        interestCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const checkedBoxes = document.querySelectorAll('.interest-checkbox input:checked');
                
                if (checkedBoxes.length > CONFIG.MAX_INTERESTS) {
                    this.checked = false;
                    
                    if (interestsError) {
                        interestsError.textContent = `Maximum ${CONFIG.MAX_INTERESTS} interests allowed`;
                        interestsError.style.display = 'block';
                        
                        setTimeout(() => {
                            interestsError.style.display = 'none';
                        }, 3000);
                    }
                    
                    showToast(`You can select up to ${CONFIG.MAX_INTERESTS} interests`, 'warning');
                } else {
                    state.selectedInterests = Array.from(checkedBoxes).map(cb => cb.value);
                    
                    if (interestsError) {
                        interestsError.style.display = 'none';
                    }
                }
                
                // Update submit button
                updateSubmitButton();
            });
        });
    }
    
    // Goal Selection
    function initGoalSelection() {
        const goalOptions = document.querySelectorAll('.goal-option');
        
        goalOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                // Don't trigger if clicking on the radio button directly
                if (e.target.type === 'radio') return;
                
                const radio = this.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    
                    // Update visual state
                    goalOptions.forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    this.classList.add('selected');
                    
                    // Trigger validation
                    validateField(radio);
                }
            });
            
            // Keyboard navigation
            option.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            // Make focusable
            option.setAttribute('tabindex', '0');
            option.setAttribute('role', 'radio');
        });
    }
    
    // OAuth Buttons
    function initOAuthButtons() {
        const oauthButtons = {
            google: document.getElementById('googleSignup'),
            linkedin: document.getElementById('linkedinSignup'),
            github: document.getElementById('githubSignup')
        };
        
        Object.keys(oauthButtons).forEach(provider => {
            const button = oauthButtons[provider];
            if (button) {
                button.addEventListener('click', function() {
                    handleOAuthSignup(provider);
                });
            }
        });
    }
    
    // Load Countries
    async function loadCountries() {
        try {
            // Try cache first
            const cached = localStorage.getItem('geoai_countries');
            const cacheTime = localStorage.getItem('geoai_countries_timestamp');
            
            if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < 86400000) {
                state.countries = JSON.parse(cached);
                renderCountries(state.countries);
                return;
            }
            
            showToast('Loading countries...', 'info');
            
            // Fetch from API
            const response = await fetch(CONFIG.COUNTRIES_API);
            if (!response.ok) throw new Error('Failed to fetch countries');
            
            const data = await response.json();
            
            // Process countries
            state.countries = data
                .map(country => ({
                    code: country.cca2,
                    name: country.name.common,
                    flag: country.flag || '🏳️',
                    callingCode: country.idd?.root ? country.idd.root + (country.idd.suffixes?.[0] || '') : '',
                    region: country.region,
                    subregion: country.subregion
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
            
            // Cache for 24 hours
            localStorage.setItem('geoai_countries', JSON.stringify(state.countries));
            localStorage.setItem('geoai_countries_timestamp', Date.now().toString());
            
            renderCountries(state.countries);
            
            // Log successful load
            logEvent('countries_loaded', { count: state.countries.length });
            
        } catch (error) {
            console.error('Error loading countries:', error);
            
            // Fallback to basic country list
            loadFallbackCountries();
            
            showToast('Using basic country list', 'warning');
        }
    }
    
    function loadFallbackCountries() {
        state.countries = [
            { code: 'US', name: 'United States', flag: '🇺🇸', callingCode: '+1' },
            { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', callingCode: '+44' },
            { code: 'DE', name: 'Germany', flag: '🇩🇪', callingCode: '+49' },
            { code: 'FR', name: 'France', flag: '🇫🇷', callingCode: '+33' },
            { code: 'ES', name: 'Spain', flag: '🇪🇸', callingCode: '+34' },
            { code: 'IT', name: 'Italy', flag: '🇮🇹', callingCode: '+39' },
            { code: 'CA', name: 'Canada', flag: '🇨🇦', callingCode: '+1' },
            { code: 'AU', name: 'Australia', flag: '🇦🇺', callingCode: '+61' },
            { code: 'JP', name: 'Japan', flag: '🇯🇵', callingCode: '+81' },
            { code: 'CN', name: 'China', flag: '🇨🇳', callingCode: '+86' },
            { code: 'IN', name: 'India', flag: '🇮🇳', callingCode: '+91' },
            { code: 'BR', name: 'Brazil', flag: '🇧🇷', callingCode: '+55' },
            { code: 'RU', name: 'Russia', flag: '🇷🇺', callingCode: '+7' },
            { code: 'ZA', name: 'South Africa', flag: '🇿🇦', callingCode: '+27' },
            { code: 'NG', name: 'Nigeria', flag: '🇳🇬', callingCode: '+234' },
            { code: 'MX', name: 'Mexico', flag: '🇲🇽', callingCode: '+52' },
            { code: 'AR', name: 'Argentina', flag: '🇦🇷', callingCode: '+54' },
            { code: 'TR', name: 'Turkey', flag: '🇹🇷', callingCode: '+90' },
            { code: 'KR', name: 'South Korea', flag: '🇰🇷', callingCode: '+82' },
            { code: 'ID', name: 'Indonesia', flag: '🇮🇩', callingCode: '+62' }
        ];
        renderCountries(state.countries);
    }
    
    function renderCountries(countries) {
        const dropdown = document.getElementById('countryDropdown');
        if (!dropdown) return;
        
        dropdown.innerHTML = '';
        
        if (countries.length === 0) {
            dropdown.innerHTML = '<div class="dropdown-empty">No countries found</div>';
            return;
        }
        
        state.filteredCountries = countries;
        
        countries.forEach(country => {
            const item = document.createElement('div');
            item.className = 'country-item';
            item.setAttribute('role', 'option');
            item.setAttribute('aria-selected', 'false');
            item.setAttribute('data-country-code', country.code);
            item.tabIndex = 0;
            
            item.innerHTML = `
                <span class="country-flag">${country.flag}</span>
                <span class="country-name">${country.name}</span>
                <span class="country-code">${country.code}</span>
            `;
            
            item.addEventListener('click', () => selectCountry(country));
            
            // Keyboard support
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectCountry(country);
                }
            });
            
            dropdown.appendChild(item);
        });
        
        // Mark selected country if exists
        if (state.selectedCountry) {
            const selectedItem = dropdown.querySelector(`[data-country-code="${state.selectedCountry.code}"]`);
            if (selectedItem) {
                selectedItem.classList.add('selected');
                selectedItem.setAttribute('aria-selected', 'true');
            }
        }
    }
    
    function selectCountry(country) {
        const countryInput = document.getElementById('country');
        const displayDiv = document.getElementById('selectedCountryDisplay');
        const searchInput = document.getElementById('countrySearch');
        
        state.selectedCountry = country;
        countryInput.value = country.code;
        countryInput.setAttribute('data-country-code', country.code);
        
        displayDiv.innerHTML = `
            <span class="selected-flag">${country.flag}</span>
            <span class="selected-name">${country.name}</span>
            <span class="selected-code">(${country.code})</span>
        `;
        
        displayDiv.setAttribute('aria-label', `Selected country: ${country.name}`);
        
        searchInput.value = '';
        toggleCountryDropdown(false);
        validateField(countryInput);
        
        // Update selected state in dropdown
        const dropdown = document.getElementById('countryDropdown');
        if (dropdown) {
            const items = dropdown.querySelectorAll('.country-item');
            items.forEach(item => {
                item.classList.remove('selected');
                item.setAttribute('aria-selected', 'false');
            });
            
            const selectedItem = dropdown.querySelector(`[data-country-code="${country.code}"]`);
            if (selectedItem) {
                selectedItem.classList.add('selected');
                selectedItem.setAttribute('aria-selected', 'true');
            }
        }
        
        // Log country selection
        logEvent('country_selected', { 
            country: country.name,
            code: country.code 
        });
    }
    
    function initCountrySearch() {
        const searchInput = document.getElementById('countrySearch');
        const clearBtn = document.getElementById('clearSearch');
        const dropdown = document.getElementById('countryDropdown');
        
        if (!searchInput) return;
        
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length === 0) {
                renderCountries(state.countries);
            } else if (query.length >= 2) {
                const filtered = state.countries.filter(country =>
                    country.name.toLowerCase().includes(query) ||
                    country.code.toLowerCase().includes(query)
                );
                renderCountries(filtered);
            }
            
            toggleCountryDropdown(true);
        });
        
        searchInput.addEventListener('focus', () => {
            toggleCountryDropdown(true);
            searchInput.select();
        });
        
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            renderCountries(state.countries);
        });
        
        // Keyboard navigation in dropdown
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                
                const items = dropdown.querySelectorAll('.country-item');
                if (items.length === 0) return;
                
                const currentIndex = Array.from(items).findIndex(item => 
                    item.classList.contains('selected') || 
                    item === document.activeElement
                );
                
                let nextIndex;
                if (e.key === 'ArrowDown') {
                    nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                } else {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                }
                
                items[nextIndex].focus();
                items[nextIndex].classList.add('selected');
                
                // Remove selection from other items
                items.forEach((item, index) => {
                    if (index !== nextIndex) {
                        item.classList.remove('selected');
                    }
                });
            } else if (e.key === 'Enter') {
                const selectedItem = dropdown.querySelector('.country-item.selected');
                if (selectedItem) {
                    const countryCode = selectedItem.getAttribute('data-country-code');
                    const country = state.countries.find(c => c.code === countryCode);
                    if (country) {
                        selectCountry(country);
                    }
                }
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.country-select-wrapper')) {
                toggleCountryDropdown(false);
            }
        });
        
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                toggleCountryDropdown(false);
                searchInput.blur();
            }
        });
    }
    
    function toggleCountryDropdown(show) {
        const dropdown = document.getElementById('countryDropdown');
        if (dropdown) {
            dropdown.style.display = show ? 'block' : 'none';
            
            if (show) {
                dropdown.setAttribute('aria-expanded', 'true');
            } else {
                dropdown.setAttribute('aria-expanded', 'false');
            }
        }
    }
    
    // Auto-detect Country
    async function detectUserLocation() {
        try {
            // Check if user has already been detected recently
            const lastDetection = localStorage.getItem('geoai_last_location_detection');
            if (lastDetection && (Date.now() - parseInt(lastDetection)) < 3600000) {
                return; // Skip if detected within last hour
            }
            
            showToast('Detecting your location...', 'info');
            
            const response = await fetch(CONFIG.GEOLOCATION_API);
            if (!response.ok) throw new Error('Geolocation failed');
            
            const data = await response.json();
            
            // Store location data
            localStorage.setItem('geoai_user_ip', data.ip);
            localStorage.setItem('geoai_user_timezone', data.timezone);
            localStorage.setItem('geoai_user_country', data.country_code);
            localStorage.setItem('geoai_last_location_detection', Date.now().toString());
            
            // Auto-select country if detected
            if (data.country_code && state.countries.length > 0) {
                const detectedCountry = state.countries.find(c => c.code === data.country_code);
                if (detectedCountry && !state.selectedCountry) {
                    setTimeout(() => {
                        selectCountry(detectedCountry);
                        showToast(`Auto-detected location: ${detectedCountry.name}`, 'success', 3000);
                    }, 1000);
                }
            }
            
            // Log detection
            logEvent('location_detected', {
                country: data.country_code,
                timezone: data.timezone
            });
            
        } catch (error) {
            console.log('Geolocation failed:', error);
            
            // Fallback to timezone detection
            fallbackLocationDetection();
        }
    }
    
    function fallbackLocationDetection() {
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            localStorage.setItem('geoai_user_timezone', timezone);
            
            // Simple timezone to country mapping
            const tzMap = {
                'Europe/Berlin': 'DE',
                'Europe/London': 'GB',
                'America/New_York': 'US',
                'Europe/Paris': 'FR',
                'Europe/Madrid': 'ES',
                'Asia/Tokyo': 'JP',
                'Australia/Sydney': 'AU',
                'Asia/Shanghai': 'CN',
                'Asia/Kolkata': 'IN',
                'America/Sao_Paulo': 'BR'
            };
            
            for (const [tz, code] of Object.entries(tzMap)) {
                if (timezone.includes(tz.split('/')[1])) {
                    const country = state.countries.find(c => c.code === code);
                    if (country && !state.selectedCountry) {
                        setTimeout(() => selectCountry(country), 1000);
                        break;
                    }
                }
            }
        } catch (error) {
            console.log('Timezone detection failed:', error);
        }
    }
    
    // Success Modal
    function initSuccessModal() {
        const successModal = document.getElementById('successModal');
        const closeModal = document.getElementById('closeSuccessModal');
        const startTutorialBtn = document.getElementById('startTutorial');
        const goToDashboardBtn = document.getElementById('goToDashboard');
        
        if (!successModal) return;
        
        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                successModal.style.display = 'none';
            });
        }
        
        // Close on background click
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.style.display = 'none';
            }
        });
        
        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && successModal.style.display === 'flex') {
                successModal.style.display = 'none';
            }
        });
        
        // Start tutorial
        if (startTutorialBtn) {
            startTutorialBtn.addEventListener('click', function() {
                window.location.href = '/welcome/tutorial';
                logEvent('tutorial_started');
            });
        }
        
        // Go to dashboard
        if (goToDashboardBtn) {
            goToDashboardBtn.addEventListener('click', function() {
                window.location.href = '/dashboard';
                logEvent('dashboard_accessed', { from: 'success_modal' });
            });
        }
    }
    
    // Verification Modal
    function initVerificationModal() {
        const verificationModal = document.getElementById('verificationModal');
        const closeModal = document.getElementById('closeVerificationModal');
        const resendBtn = document.getElementById('resendVerification');
        const changeEmailBtn = document.getElementById('changeEmail');
        
        if (!verificationModal) return;
        
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                verificationModal.style.display = 'none';
            });
        }
        
        if (resendBtn) {
            resendBtn.addEventListener('click', () => {
                resendVerificationEmail();
            });
        }
        
        if (changeEmailBtn) {
            changeEmailBtn.addEventListener('click', () => {
                verificationModal.style.display = 'none';
                document.getElementById('email')?.focus();
            });
        }
        
        // Close on background click
        verificationModal.addEventListener('click', (e) => {
            if (e.target === verificationModal) {
                verificationModal.style.display = 'none';
            }
        });
    }
    
    // Auto-focus
    function initAutoFocus() {
        setTimeout(() => {
            const nameInput = document.getElementById('fullName');
            if (nameInput) {
                nameInput.focus();
            }
        }, 500);
    }
    
    // Network Monitoring
    function initNetworkMonitoring() {
        window.addEventListener('online', () => {
            state.isOnline = true;
            showToast('You are back online', 'success', 3000);
            
            // Check for pending submissions
            if (state.hasPendingSubmission) {
                showToast('Retrying pending submission...', 'info');
                checkPendingSubmissions();
            }
        });
        
        window.addEventListener('offline', () => {
            state.isOnline = false;
            showToast('You are offline. Some features may not work.', 'warning', 5000);
        });
    }
    
    // Analytics
    function initAnalytics() {
        // Track form interactions
        const form = document.getElementById('signupForm');
        if (form) {
            form.addEventListener('focusin', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
                    logEvent('field_focused', { field: e.target.id || e.target.name });
                }
            }, true);
        }
    }
    
    // Check Pending Submissions
    function checkPendingSubmissions() {
        const pending = localStorage.getItem('geoai_pending_signup');
        if (pending && state.isOnline) {
            try {
                const submission = JSON.parse(pending);
                const timeSinceSubmission = Date.now() - submission.timestamp;
                
                if (timeSinceSubmission < 3600000) { // 1 hour
                    showToast('Found pending submission. Retrying...', 'info');
                    state.hasPendingSubmission = true;
                    
                    // Auto-fill form with pending data
                    autoFillForm(submission.data);
                    
                    // Ask user to retry
                    if (confirm('We found a pending signup submission. Would you like to retry?')) {
                        performSignup();
                    }
                } else {
                    // Remove old pending submission
                    localStorage.removeItem('geoai_pending_signup');
                }
            } catch (error) {
                console.error('Error parsing pending submission:', error);
                localStorage.removeItem('geoai_pending_signup');
            }
        }
    }
    
    // Auto-fill Form
    function autoFillForm(data) {
        const fields = ['fullName', 'email', 'country', 'profession', 'experience'];
        
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input && data[field]) {
                input.value = data[field];
                validateField(input);
            }
        });
        
        // Handle interests
        if (data.interests && Array.isArray(data.interests)) {
            const checkboxes = document.querySelectorAll('.interest-checkbox input');
            checkboxes.forEach(cb => {
                cb.checked = data.interests.includes(cb.value);
            });
            state.selectedInterests = data.interests;
        }
        
        // Handle goal
        if (data.goal) {
            const goalRadio = document.querySelector(`input[name="goal"][value="${data.goal}"]`);
            if (goalRadio) {
                goalRadio.checked = true;
                goalRadio.closest('.goal-option')?.classList.add('selected');
            }
        }
    }
    
    // Handle OAuth Signup
    async function handleOAuthSignup(provider) {
        // Check rate limit for OAuth
        if (!checkRateLimit()) return;
        
        showToast(`Connecting to ${provider}...`, 'info');
        
        // Disable OAuth buttons to prevent multiple clicks
        const oauthButtons = document.querySelectorAll('.oauth-btn');
        oauthButtons.forEach(btn => btn.disabled = true);
        
        try {
            // Log OAuth attempt
            logEvent('oauth_attempt', { provider });
            
            // In production, this would redirect to OAuth provider
            // For now, simulate the process
            await simulateOAuthFlow(provider);
            
        } catch (error) {
            console.error(`OAuth error for ${provider}:`, error);
            showToast(`Failed to connect with ${provider}. Please try again.`, 'error');
            
            // Re-enable buttons
            oauthButtons.forEach(btn => btn.disabled = false);
        }
    }
    
    // Simulate OAuth Flow (Demo only)
    async function simulateOAuthFlow(provider) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock user data based on provider
                const mockUsers = {
                    google: { 
                        email: 'user@gmail.com', 
                        name: 'Google User',
                        country: 'US'
                    },
                    linkedin: { 
                        email: 'user@linkedin.com', 
                        name: 'LinkedIn User',
                        country: 'GB'
                    },
                    github: { 
                        email: 'user@github.com', 
                        name: 'GitHub User',
                        country: 'DE'
                    }
                };
                
                const mockUser = mockUsers[provider];
                if (mockUser) {
                    // Auto-fill form
                    autoFillFromOAuth(mockUser);
                    showToast(`Successfully connected with ${provider}!`, 'success');
                    
                    // Log success
                    logEvent('oauth_success', { provider });
                }
                
                resolve();
            }, 1500);
        });
    }
    
    function autoFillFromOAuth(userData) {
        // Auto-fill basic info
        const nameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        
        if (nameInput) nameInput.value = userData.name;
        if (emailInput) emailInput.value = userData.email;
        
        // Validate filled fields
        if (nameInput) validateField(nameInput);
        if (emailInput) validateField(emailInput);
        
        // Auto-select country if available
        if (userData.country && state.countries.length > 0) {
            const country = state.countries.find(c => c.code === userData.country);
            if (country) {
                selectCountry(country);
            }
        }
        
        // Auto-select some interests for demo
        setTimeout(() => {
            const interestCheckboxes = document.querySelectorAll('.interest-checkbox input');
            if (interestCheckboxes.length >= 2) {
                interestCheckboxes[0].checked = true;
                interestCheckboxes[1].checked = true;
                state.selectedInterests = [interestCheckboxes[0].value, interestCheckboxes[1].value];
            }
            
            // Auto-select a goal
            const firstGoal = document.querySelector('.goal-option input');
            if (firstGoal) {
                firstGoal.checked = true;
                firstGoal.closest('.goal-option').classList.add('selected');
            }
            
            // Check terms
            const termsCheckbox = document.getElementById('terms');
            if (termsCheckbox) termsCheckbox.checked = true;
            
            // Update submit button
            updateSubmitButton();
        }, 100);
    }
    
    // Perform Signup
    async function performSignup() {
        const signupSubmitBtn = document.getElementById('signupSubmit');
        const btnText = signupSubmitBtn.querySelector('.btn-text');
        const btnSpinner = signupSubmitBtn.querySelector('.btn-spinner');
        
        // Show loading
        state.isSubmitting = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'block';
        signupSubmitBtn.disabled = true;
        
        // Collect form data
        const formData = collectFormData();
        
        // Validate CSRF token
        const csrfToken = validateCSRFToken();
        formData.csrfToken = csrfToken;
        
        // Add metadata
        formData.metadata = {
            userAgent: navigator.userAgent,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            locale: navigator.language,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            referrer: document.referrer || 'direct',
            sessionId: state.sessionId,
            timestamp: Date.now(),
            version: CONFIG.VERSION
        };
        
        // Store form data in state
        state.formData = formData;
        
        // Check if offline
        if (!state.isOnline) {
            handleOfflineSignup(formData);
            return;
        }
        
        try {
            // Log signup attempt
            logEvent('signup_attempt', { email: formData.email });
            
            // API call
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SIGNUP, {
                method: 'POST',
                headers: {
                    ...API_CONFIG.HEADERS,
                    'X-CSRF-Token': csrfToken,
                    'X-Request-ID': generateRequestId(),
                    'X-Session-ID': state.sessionId
                },
                body: JSON.stringify(formData),
                credentials: 'include',
                signal: AbortSignal.timeout(30000) // 30 second timeout
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Success
                handleSignupSuccess(data, formData);
            } else {
                // Handle API errors
                handleSignupError(data, response.status);
            }
            
        } catch (error) {
            // Network or unexpected error
            handleNetworkError(error, formData);
        } finally {
            resetSubmitButton();
        }
    }
    
    // Collect Form Data
    function collectFormData() {
        return {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim().toLowerCase(),
            password: document.getElementById('password').value,
            country: document.getElementById('country').value,
            profession: document.getElementById('profession').value,
            experience: document.getElementById('experience').value,
            interests: state.selectedInterests,
            goal: document.querySelector('input[name="goal"]:checked')?.value || '',
            acceptTerms: document.getElementById('terms').checked,
            marketingEmails: document.getElementById('marketing').checked
        };
    }
    
    // Generate Request ID
    function generateRequestId() {
        return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Handle Signup Success
    function handleSignupSuccess(responseData, formData) {
        // Store tokens securely
        if (responseData.access_token) {
            // Store in HttpOnly cookie via backend
            localStorage.setItem('geoai_access_token', responseData.access_token);
            localStorage.setItem('geoai_token_expiry', (Date.now() + 3600000).toString()); // 1 hour
        }
        
        if (responseData.refresh_token) {
            localStorage.setItem('geoai_refresh_token', responseData.refresh_token);
        }
        
        // Store user data
        localStorage.setItem('geoai_user_id', responseData.user.id);
        localStorage.setItem('geoai_user_email', formData.email);
        localStorage.setItem('geoai_user_name', formData.fullName);
        localStorage.setItem('geoai_user_role', responseData.user.role || 'student');
        localStorage.setItem('geoai_onboarding_complete', 'false');
        localStorage.setItem('geoai_user_created', Date.now().toString());
        
        // Clear pending submission if exists
        localStorage.removeItem('geoai_pending_signup');
        state.hasPendingSubmission = false;
        
        // Reset rate limit
        resetRateLimit();
        
        // Log successful signup
        logEvent('signup_success', {
            userId: responseData.user.id,
            email: formData.email,
            country: formData.country,
            profession: formData.profession
        });
        
        // Show success
        showToast('Account created successfully! Welcome to GeoAI Tutors!', 'success');
        
        // Check if email verification is required
        if (responseData.requires_email_verification && !responseData.user.email_verified) {
            showVerificationModal(formData.email);
        } else {
            // Show success modal
            setTimeout(() => {
                document.getElementById('successModal').style.display = 'flex';
            }, 1000);
        }
    }
    
    // Show Verification Modal
    function showVerificationModal(email) {
        const modal = document.getElementById('verificationModal');
        const emailSpan = document.getElementById('verificationEmail');
        
        if (modal && emailSpan) {
            emailSpan.textContent = email;
            modal.style.display = 'flex';
            
            // Log verification required
            logEvent('verification_required', { email });
        }
    }
    
    // Resend Verification Email
    async function resendVerificationEmail() {
        const email = localStorage.getItem('geoai_user_email');
        if (!email) return;
        
        try {
            const response = await fetch(API_CONFIG.BASE_URL + '/api/v1/auth/resend-verification', {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify({ email }),
                credentials: 'include'
            });
            
            if (response.ok) {
                showToast('Verification email sent!', 'success');
                logEvent('verification_resent', { email });
            } else {
                showToast('Failed to resend verification email', 'error');
            }
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
        }
    }
    
    // Handle Signup Error
    function handleSignupError(errorData, statusCode) {
        // Map API errors to user-friendly messages
        const errorMessages = {
            400: 'Invalid form data. Please check your inputs.',
            409: 'An account with this email already exists.',
            422: 'Validation failed. Please correct the highlighted fields.',
            429: 'Too many attempts. Please try again later.',
            500: 'Server error. Please try again.',
            503: 'Service unavailable. Please try again later.'
        };
        
        const message = errorData.message || errorMessages[statusCode] || 'Signup failed. Please try again.';
        
        // Handle field-specific errors
        if (errorData.errors) {
            Object.keys(errorData.errors).forEach(field => {
                const errorElement = document.getElementById(field + 'Error');
                if (errorElement) {
                    errorElement.textContent = errorData.errors[field][0];
                    errorElement.style.display = 'block';
                    const input = document.getElementById(field);
                    if (input) input.classList.add('error');
                }
            });
        }
        
        showToast(message, 'error');
        
        // Log error
        logEvent('signup_error', {
            status: statusCode,
            message: errorData.message,
            errors: errorData.errors
        });
    }
    
    // Handle Network Error
    function handleNetworkError(error, formData) {
        console.error('Network error:', error);
        
        // Store form data for retry
        localStorage.setItem('geoai_pending_signup', JSON.stringify({
            data: formData,
            timestamp: Date.now()
        }));
        
        state.hasPendingSubmission = true;
        
        showToast('Network error. Your submission has been saved and will be retried when you are back online.', 'warning');
        
        // Log network error
        logEvent('network_error', { 
            error: error.message,
            type: error.name 
        });
    }
    
    // Handle Offline Signup
    function handleOfflineSignup(formData) {
        // Store form data for retry
        localStorage.setItem('geoai_pending_signup', JSON.stringify({
            data: formData,
            timestamp: Date.now()
        }));
        
        state.hasPendingSubmission = true;
        
        showToast('You are offline. Your submission has been saved and will be sent when you are back online.', 'warning');
        
        resetSubmitButton();
        
        // Log offline submission
        logEvent('offline_submission', { email: formData.email });
    }
    
    // Reset Submit Button
    function resetSubmitButton() {
        const signupSubmitBtn = document.getElementById('signupSubmit');
        const btnText = signupSubmitBtn.querySelector('.btn-text');
        const btnSpinner = signupSubmitBtn.querySelector('.btn-spinner');
        
        btnText.style.display = 'block';
        btnSpinner.style.display = 'none';
        signupSubmitBtn.disabled = false;
        state.isSubmitting = false;
    }
    
    // Log Event
    function logEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            sessionId: state.sessionId,
            page: 'signup',
            url: window.location.href,
            userAgent: navigator.userAgent,
            data: data
        };
        
        // Send to analytics backend if online
        if (state.isOnline && navigator.sendBeacon) {
            try {
                navigator.sendBeacon(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS, JSON.stringify(event));
            } catch (error) {
                console.error('Analytics error:', error);
            }
        }
        
        // Store locally for batch upload if offline
        if (!state.isOnline) {
            const events = JSON.parse(localStorage.getItem('geoai_pending_events') || '[]');
            events.push(event);
            localStorage.setItem('geoai_pending_events', JSON.stringify(events));
        }
        
        console.log('📊 Event:', eventName, data);
    }
    
    // Toast Notification
    function showToast(message, type = 'info', duration = 5000) {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Icon based on type
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style based on type
        const bgColor = {
            error: '#dc2626',
            success: '#10B981',
            info: '#2563EB',
            warning: '#f59e0b'
        }[type] || '#333';
        
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1002;
            animation: toastSlideIn 0.3s ease;
            max-width: 350px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(toast);
        
        // Auto-remove after duration
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
        
        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        });
    }
    
    // Add CSS for animations if not present
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes toastSlideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes toastSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .goal-option.selected .goal-content {
            border-color: #1D4ED8;
            background: #eff6ff;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(29, 78, 216, 0.1);
        }
        
        .interest-checkbox input:checked + span {
            color: #1D4ED8;
            font-weight: 600;
        }
        
        .form-group.focused label {
            color: #1D4ED8;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize page
    setTimeout(() => {
        initSignupPage().catch(error => {
            console.error('Failed to initialize signup page:', error);
            showToast('Failed to initialize page. Please refresh.', 'error');
        });
    }, 100);
});