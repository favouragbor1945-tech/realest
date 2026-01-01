// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication
    function checkAdminAuth() {
        const isAdmin = localStorage.getItem('geoai_admin') === 'true';
        const isLoggedIn = localStorage.getItem('geoai_logged_in') === 'true';
        
        if (!isLoggedIn || !isAdmin) {
            alert('Admin access required. Redirecting to login...');
            window.location.href = '/login';
            return false;
        }
        return true;
    }

    // Verify admin access
    if (!checkAdminAuth()) {
        return;
    }

    // Navigation handling
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const adminSections = document.querySelectorAll('.admin-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(nav => nav.classList.remove('nav-active'));
            adminSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('nav-active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Stats data (mock)
    const statsData = {
        totalUsers: 1247,
        activeCourses: 8,
        revenue: 42380,
        completionRate: 78
    };

    // Animate stats counting
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current).toLocaleString();
            }, 30);
        });
    }

    // Initialize stats animation when dashboard section is active
    const dashboardSection = document.getElementById('dashboard');
    if (dashboardSection.classList.contains('active')) {
        animateStats();
    }

    // User management functionality
    const userTable = document.querySelector('.users-table tbody');
    
    // Mock user data
    const mockUsers = [
        { id: 1, name: 'Anna Kowalski', email: 'anna.k@email.com', status: 'active', courses: 3, joinDate: '2024-11-15' },
        { id: 2, name: 'Luca Bianchi', email: 'luca.b@email.com', status: 'pending', courses: 0, joinDate: '2024-12-01' },
        { id: 3, name: 'Marie Dubois', email: 'marie.d@email.com', status: 'active', courses: 2, joinDate: '2024-10-22' }
    ];

    // Populate user table
    function populateUserTable() {
        userTable.innerHTML = '';
        mockUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
                <td>${user.courses} ${user.courses === 1 ? 'course' : 'courses'}</td>
                <td>${user.joinDate}</td>
                <td>
                    <button class="action-btn edit" data-user="${user.id}">Edit</button>
                    ${user.status === 'pending' ? 
                      `<button class="action-btn approve" data-user="${user.id}">Approve</button>` : 
                      `<button class="action-btn delete" data-user="${user.id}">Delete</button>`}
                </td>
            `;
            userTable.appendChild(row);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-user');
                editUser(userId);
            });
        });

        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-user');
                deleteUser(userId);
            });
        });

        document.querySelectorAll('.action-btn.approve').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-user');
                approveUser(userId);
            });
        });
    }

    function editUser(userId) {
        const user = mockUsers.find(u => u.id == userId);
        alert(`Edit user: ${user.name}\n\nThis would open an edit modal in a real application.`);
    }

    function deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            alert(`User ${userId} deleted (mock operation)`);
            // In real app: Remove from mockUsers array and update table
        }
    }

    function approveUser(userId) {
        const user = mockUsers.find(u => u.id == userId);
        if (user) {
            user.status = 'active';
            populateUserTable();
            alert(`User ${user.name} approved successfully!`);
        }
    }

    // Course management
    const courseActions = document.querySelectorAll('.course-actions .btn');
    courseActions.forEach(btn => {
        btn.addEventListener('click', function() {
            const courseCard = this.closest('.course-admin-card');
            const courseName = courseCard.querySelector('h3').textContent;
            
            if (this.textContent.includes('Edit')) {
                alert(`Edit course: ${courseName}`);
            } else {
                alert(`View analytics for: ${courseName}`);
            }
        });
    });

    // Export functionality
    const exportBtn = document.querySelector('.btn-secondary');
    if (exportBtn && exportBtn.textContent.includes('Export')) {
        exportBtn.addEventListener('click', function() {
            alert('Exporting user data... This would download a CSV file in a real application.');
        });
    }

    // Add new user functionality
    const addUserBtn = document.querySelector('.btn-primary');
    if (addUserBtn && addUserBtn.textContent.includes('Add New User')) {
        addUserBtn.addEventListener('click', function() {
            alert('Add New User modal would open here in a real application.');
        });
    }

    // Initialize user table
    populateUserTable();

    // Logout functionality (could be added to header)
    function setupAdminLogout() {
        // This would typically be in the header
        console.log('Admin logout functionality ready');
    }

    setupAdminLogout();

    // Real-time updates simulation
    function simulateRealTimeUpdates() {
        setInterval(() => {
            // Simulate new user registration
            if (Math.random() > 0.7) {
                const newUserCount = Math.floor(Math.random() * 3) + 1;
                console.log(`Simulated ${newUserCount} new user(s) registered`);
                
                // Update dashboard in real-time
                const userStat = document.querySelector('.stat-card:first-child .stat-number');
                if (userStat) {
                    const current = parseInt(userStat.textContent.replace(',', ''));
                    userStat.textContent = (current + newUserCount).toLocaleString();
                }
            }
        }, 10000); // Every 10 seconds
    }

    simulateRealTimeUpdates();

    console.log('GeoAI Tutors Admin Dashboard loaded successfully');
});