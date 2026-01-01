// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 GeoAI Tutors Login Page loaded');
    
    // State Management
    let state = {
        isSubmitting: false,
        capsLockOn: false
    };
    
    // Initialize all components
    function initLoginPage() {
        console.log('Initializing Login Page...');
        
        // Initialize form validation
        initFormValidation();
        
        // Initialize password toggle
        initPasswordToggle();
        
        // Initialize OAuth buttons
        initOAuthButtons();
        
        // Initialize forgot password flow
        initForgotPasswordFlow();
        
        // Initialize magic link flow
        initMagicLinkFlow();
        
        // Initialize demo accounts
        initDemoAccounts();
        
        // Initialize auto-focus
        initAutoFocus();
        
        console.log('✅ Login Page initialized successfully');
    }
    
    // Form Validation
    function initFormValidation() {
        const loginForm = document.getElementById('loginForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const loginSubmitBtn = document.getElementById('loginSubmit');
        
        if (!loginForm) return;
        
        // Real-time email validation
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                validateEmail(this.value);
            });
            
            emailInput.addEventListener('blur', function() {
                validateEmail(this.value);
            });
        }
        
        // Real-time password validation
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                validatePassword(this.value);
            });
            
            passwordInput.addEventListener('blur', function() {
                validatePassword(this.value);
            });
            
            // Caps lock detection
            passwordInput.addEventListener('keyup', function(e) {
                state.capsLockOn = e.getModifierState && e.getModifierState('CapsLock');
            });
        }
        
        // Form submission
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (state.isSubmitting) return;
            
            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            
            // Validate all fields
            const isEmailValid = validateEmail(email);
            const isPasswordValid = validatePassword(password);
            
            if (!isEmailValid || !isPasswordValid) {
                showToast('Please fix the errors in the form', 'error');
                return;
            }
            
            // Start login process
            await performLogin(email, password);
        });
        
        function validateEmail(email) {
            const errorElement = document.getElementById('emailError');
            if (!errorElement) return false;
            
            errorElement.textContent = '';
            
            if (!email) {
                errorElement.textContent = 'Email is required';
                if (emailInput) emailInput.classList.add('error');
                return false;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorElement.textContent = 'Please enter a valid email address';
                if (emailInput) emailInput.classList.add('error');
                return false;
            }
            
            if (emailInput) emailInput.classList.remove('error');
            return true;
        }
        
        function validatePassword(password) {
            const errorElement = document.getElementById('passwordError');
            if (!errorElement) return false;
            
            errorElement.textContent = '';
            
            if (!password) {
                errorElement.textContent = 'Password is required';
                if (passwordInput) passwordInput.classList.add('error');
                return false;
            }
            
            if (password.length < 8) {
                errorElement.textContent = 'Password must be at least 8 characters';
                if (passwordInput) passwordInput.classList.add('error');
                return false;
            }
            
            if (passwordInput) passwordInput.classList.remove('error');
            return true;
        }
    }
    
    // Password Toggle
    function initPasswordToggle() {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        
        if (!toggleBtn || !passwordInput) return;
        
        toggleBtn.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.innerHTML = type === 'password' ? 
                '<i class="fas fa-eye"></i>' : 
                '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // OAuth Buttons
    function initOAuthButtons() {
        const oauthButtons = {
            google: document.getElementById('googleLogin'),
            linkedin: document.getElementById('linkedinLogin'),
            github: document.getElementById('githubLogin')
        };
        
        Object.keys(oauthButtons).forEach(provider => {
            const button = oauthButtons[provider];
            if (button) {
                button.addEventListener('click', function() {
                    handleOAuthLogin(provider);
                });
            }
        });
    }
    
    // Forgot Password Flow
    function initForgotPasswordFlow() {
        const forgotLink = document.getElementById('forgotPasswordLink');
        const forgotModal = document.getElementById('forgotPasswordModal');
        const closeModal = document.getElementById('closeForgotModal');
        const resetForm = document.getElementById('resetForm');
        
        if (!forgotLink || !forgotModal) return;
        
        // Open modal
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotModal.style.display = 'flex';
        });
        
        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                forgotModal.style.display = 'none';
            });
        }
        
        // Close on background click
        forgotModal.addEventListener('click', function(e) {
            if (e.target === forgotModal) {
                forgotModal.style.display = 'none';
            }
        });
        
        // Reset form submission
        if (resetForm) {
            resetForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const emailInput = document.getElementById('resetEmail');
                const submitBtn = this.querySelector('.submit-btn');
                const btnText = submitBtn.querySelector('.btn-text');
                const btnSpinner = submitBtn.querySelector('.btn-spinner');
                
                const email = emailInput ? emailInput.value.trim() : '';
                
                // Validate email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email || !emailRegex.test(email)) {
                    showToast('Please enter a valid email address', 'error');
                    return;
                }
                
                // Show loading
                btnText.style.display = 'none';
                btnSpinner.style.display = 'block';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Reset form
                    resetForm.reset();
                    
                    // Show success
                    showToast('Password reset link sent to your email', 'success');
                    
                    // Close modal
                    forgotModal.style.display = 'none';
                    
                    // Reset button
                    btnText.style.display = 'block';
                    btnSpinner.style.display = 'none';
                    submitBtn.disabled = false;
                }, 1500);
            });
        }
    }
    
    // Magic Link Flow
    function initMagicLinkFlow() {
        const magicBtn = document.getElementById('magicLinkBtn');
        const magicModal = document.getElementById('magicLinkModal');
        const closeModal = document.getElementById('closeMagicModal');
        const magicForm = document.getElementById('magicForm');
        
        if (!magicBtn || !magicModal) return;
        
        // Open modal
        magicBtn.addEventListener('click', function() {
            magicModal.style.display = 'flex';
            
            // Pre-fill with email if available
            const emailInput = document.getElementById('email');
            const magicEmailInput = document.getElementById('magicEmail');
            if (emailInput && magicEmailInput && emailInput.value) {
                magicEmailInput.value = emailInput.value;
            }
        });
        
        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                magicModal.style.display = 'none';
            });
        }
        
        // Close on background click
        magicModal.addEventListener('click', function(e) {
            if (e.target === magicModal) {
                magicModal.style.display = 'none';
            }
        });
        
        // Magic form submission
        if (magicForm) {
            magicForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const emailInput = document.getElementById('magicEmail');
                const submitBtn = this.querySelector('.submit-btn');
                const btnText = submitBtn.querySelector('.btn-text');
                const btnSpinner = submitBtn.querySelector('.btn-spinner');
                
                const email = emailInput ? emailInput.value.trim() : '';
                
                // Validate email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email || !emailRegex.test(email)) {
                    showToast('Please enter a valid email address', 'error');
                    return;
                }
                
                // Show loading
                btnText.style.display = 'none';
                btnSpinner.style.display = 'block';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Reset form
                    magicForm.reset();
                    
                    // Show success
                    showToast('Magic link sent! Check your email', 'success');
                    
                    // Close modal
                    magicModal.style.display = 'none';
                    
                    // Reset button
                    btnText.style.display = 'block';
                    btnSpinner.style.display = 'none';
                    submitBtn.disabled = false;
                }, 1500);
            });
        }
    }
    
    // Demo Accounts
    function initDemoAccounts() {
        const demoButtons = document.querySelectorAll('.demo-btn');
        
        demoButtons.forEach(button => {
            button.addEventListener('click', function() {
                const email = this.getAttribute('data-email');
                const password = this.getAttribute('data-password');
                
                // Fill form
                const emailInput = document.getElementById('email');
                const passwordInput = document.getElementById('password');
                
                if (emailInput) emailInput.value = email;
                if (passwordInput) passwordInput.value = password;
                
                // Trigger validation
                if (emailInput) emailInput.dispatchEvent(new Event('input'));
                if (passwordInput) passwordInput.dispatchEvent(new Event('input'));
                
                // Show confirmation
                showToast('Demo credentials filled!', 'info');
                
                // Focus on submit button
                const submitBtn = document.getElementById('loginSubmit');
                if (submitBtn) submitBtn.focus();
            });
        });
    }
    
    // Auto-focus
    function initAutoFocus() {
        setTimeout(() => {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.focus();
            }
        }, 300);
    }
    
    // Perform Login
    async function performLogin(email, password) {
        const loginSubmitBtn = document.getElementById('loginSubmit');
        const btnText = loginSubmitBtn.querySelector('.btn-text');
        const btnSpinner = loginSubmitBtn.querySelector('.btn-spinner');
        const rememberMe = document.getElementById('rememberMe');
        
        // Show loading
        state.isSubmitting = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'block';
        loginSubmitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Mock authentication
            const demoAccounts = {
                'student@demo.com': { password: 'demo123', admin: false },
                'admin@demo.com': { password: 'admin123', admin: true }
            };
            
            const user = demoAccounts[email];
            
            if (user && user.password === password) {
                // Successful login
                localStorage.setItem('geoai_logged_in', 'true');
                localStorage.setItem('geoai_user_email', email);
                localStorage.setItem('geoai_user_admin', user.admin.toString());
                
                if (rememberMe && rememberMe.checked) {
                    localStorage.setItem('geoai_remember_me', 'true');
                }
                
                showToast('Login successful! Redirecting...', 'success');
                
                // Redirect
                setTimeout(() => {
                    window.location.href = user.admin ? '/admin' : '/dashboard';
                }, 1500);
            } else {
                // Failed login
                showToast('Invalid email or password', 'error');
                
                // Reset form
                const passwordInput = document.getElementById('password');
                if (passwordInput) passwordInput.value = '';
                
                // Focus password field
                if (passwordInput) passwordInput.focus();
                
                // Reset button
                btnText.style.display = 'block';
                btnSpinner.style.display = 'none';
                loginSubmitBtn.disabled = false;
                state.isSubmitting = false;
            }
        }, 1500);
    }
    
    // Handle OAuth Login
    function handleOAuthLogin(provider) {
        showToast(`Connecting to ${provider}...`, 'info');
        
        // Simulate OAuth flow
        setTimeout(() => {
            showToast(`Successfully connected with ${provider}!`, 'success');
            
            // For demo purposes, auto-fill a mock user
            const mockUsers = {
                google: { email: 'user@gmail.com', name: 'Google User' },
                linkedin: { email: 'user@linkedin.com', name: 'LinkedIn User' },
                github: { email: 'user@github.com', name: 'GitHub User' }
            };
            
            const mockUser = mockUsers[provider];
            if (mockUser) {
                const emailInput = document.getElementById('email');
                if (emailInput) emailInput.value = mockUser.email;
            }
        }, 1000);
    }
    
    // Toast Notification
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
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1002;
            animation: toastSlideIn 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        
        document.body.appendChild(toast);
        
        // Add animation if not present
        if (!document.querySelector('#toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
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
            `;
            document.head.appendChild(style);
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
    
    // Initialize page
    setTimeout(initLoginPage, 100);
});