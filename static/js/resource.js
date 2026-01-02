// RESOURCE PAGE JAVASCRIPT - PROFESSIONAL VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 GeoAI Tutors Resource Platform loaded');
    
    // Resource data for demonstration
    const resources = [
        {
            id: 1,
            title: "QGIS Complete Tutorial Series",
            description: "Master QGIS from basics to advanced spatial analysis with this comprehensive tutorial series.",
            category: "tutorials",
            level: "beginner",
            format: "PDF",
            size: "25 MB",
            downloads: 3245,
            rating: 4.7,
            tags: ["QGIS", "GIS", "Tutorial"],
            featured: false
        },
        {
            id: 2,
            title: "Urban Heat Island Analysis Dataset",
            description: "High-resolution temperature data for 50 major cities worldwide with validation metrics.",
            category: "datasets",
            level: "intermediate",
            format: "GeoJSON",
            size: "320 MB",
            downloads: 1892,
            rating: 4.5,
            tags: ["Dataset", "Urban", "Climate"],
            featured: true
        },
        {
            id: 3,
            title: "Python Spatial Analysis Library Guide",
            description: "Comprehensive guide to geopandas, rasterio, and other essential Python spatial libraries.",
            category: "tutorials",
            level: "intermediate",
            format: "PDF",
            size: "18 MB",
            downloads: 2876,
            rating: 4.8,
            tags: ["Python", "Geopandas", "Spatial"],
            featured: false
        },
        {
            id: 4,
            title: "Sentinel-2 Processing Toolbox",
            description: "Automated toolbox for processing Sentinel-2 imagery in Python with cloud masking.",
            category: "tools",
            level: "advanced",
            format: "Python",
            size: "45 MB",
            downloads: 1542,
            rating: 4.9,
            tags: ["Sentinel", "Python", "Tool"],
            featured: false
        },
        {
            id: 5,
            title: "Deep Learning for Satellite Imagery",
            description: "Latest research paper on CNN architectures for satellite image classification.",
            category: "papers",
            level: "advanced",
            format: "PDF",
            size: "8 MB",
            downloads: 2109,
            rating: 4.6,
            tags: ["Research", "Deep Learning", "Satellite"],
            featured: false
        },
        {
            id: 6,
            title: "GIS Command Line Cheat Sheet",
            description: "Quick reference for GDAL/OGR command line tools with practical examples.",
            category: "cheatsheets",
            level: "intermediate",
            format: "PDF",
            size: "2 MB",
            downloads: 3987,
            rating: 4.8,
            tags: ["Cheat Sheet", "GDAL", "CLI"],
            featured: true
        },
        {
            id: 7,
            title: "Real-time GIS Web Applications",
            description: "Complete tutorial on building real-time GIS applications with WebSockets and Mapbox.",
            category: "tutorials",
            level: "advanced",
            format: "ZIP",
            size: "85 MB",
            downloads: 1324,
            rating: 4.7,
            tags: ["WebGIS", "Real-time", "Mapbox"],
            featured: false
        },
        {
            id: 8,
            title: "Global Elevation Dataset 2024",
            description: "30m resolution digital elevation model covering entire land surface.",
            category: "datasets",
            level: "beginner",
            format: "TIFF",
            size: "2.1 GB",
            downloads: 2876,
            rating: 4.9,
            tags: ["DEM", "Elevation", "Global"],
            featured: false
        }
    ];

    // Initialize background slider
    function initBackgroundSlider() {
        const bgSlider = document.querySelector('.bg-slider');
        const slides = [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
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

    // Initialize category filtering
    function initCategoryFiltering() {
        const categoryCards = document.querySelectorAll('.category-card');
        const searchTags = document.querySelectorAll('.search-tag');
        
        categoryCards.forEach(card => {
            card.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                filterResources(category, 'all');
                updateActiveCategory(category);
            });
        });
        
        searchTags.forEach(tag => {
            tag.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                filterResources('all', filter);
                updateSearchInput(filter);
            });
        });
    }

    // Initialize resource filters
    function initResourceFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const levelFilter = document.getElementById('level-filter');
        const sortFilter = document.getElementById('sort-filter');
        const searchInput = document.getElementById('resource-search');
        const searchBtn = document.querySelector('.search-btn');
        
        // Filter change handlers
        categoryFilter.addEventListener('change', applyFilters);
        levelFilter.addEventListener('change', applyFilters);
        sortFilter.addEventListener('change', applyFilters);
        
        // Search functionality
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Load more button
        const loadMoreBtn = document.getElementById('load-more');
        loadMoreBtn.addEventListener('click', loadMoreResources);
    }

    // Filter resources based on current filters
    function filterResources(category, tag) {
        const categoryFilter = document.getElementById('category-filter');
        const levelFilter = document.getElementById('level-filter');
        
        if (category !== 'all') {
            categoryFilter.value = category;
        }
        
        if (tag !== 'all') {
            document.getElementById('resource-search').value = tag;
        }
        
        applyFilters();
    }

    // Apply all active filters
    function applyFilters() {
        const category = document.getElementById('category-filter').value;
        const level = document.getElementById('level-filter').value;
        const sort = document.getElementById('sort-filter').value;
        const searchTerm = document.getElementById('resource-search').value.toLowerCase();
        
        let filteredResources = [...resources];
        
        // Filter by category
        if (category !== 'all') {
            filteredResources = filteredResources.filter(resource => 
                resource.category === category
            );
        }
        
        // Filter by level
        if (level !== 'all') {
            filteredResources = filteredResources.filter(resource => 
                resource.level === level
            );
        }
        
        // Filter by search term
        if (searchTerm) {
            filteredResources = filteredResources.filter(resource =>
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Sort resources
        filteredResources.sort((a, b) => {
            switch(sort) {
                case 'popular':
                    return b.downloads - a.downloads;
                case 'newest':
                    return b.id - a.id;
                case 'rating':
                    return b.rating - a.rating;
                case 'name':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
        
        // Display filtered resources
        displayResources(filteredResources.slice(0, 6));
    }

    // Display resources in the grid
    function displayResources(resourceList) {
        const grid = document.querySelector('.all-resources-grid');
        grid.innerHTML = '';
        
        if (resourceList.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No resources found</h3>
                    <p>Try adjusting your filters or search term</p>
                </div>
            `;
            return;
        }
        
        resourceList.forEach(resource => {
            const resourceCard = createResourceCard(resource);
            grid.appendChild(resourceCard);
        });
    }

    // Create resource card HTML
    function createResourceCard(resource) {
        const card = document.createElement('div');
        card.className = 'resource-card';
        if (resource.featured) {
            card.classList.add('featured');
        }
        
        card.innerHTML = `
            ${resource.featured ? '<div class="resource-badge">Featured</div>' : ''}
            <div class="resource-header">
                <div class="resource-icon">
                    <i class="fas fa-${getIconForCategory(resource.category)}"></i>
                </div>
                <div class="resource-meta">
                    <span class="resource-category">${resource.category}</span>
                    <span class="resource-level">${resource.level}</span>
                </div>
            </div>
            <div class="resource-body">
                <h3>${resource.title}</h3>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-tags">
                    ${resource.tags.map(tag => `<span class="resource-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="resource-footer">
                <div class="resource-stats">
                    <span><i class="fas fa-download"></i> ${resource.downloads.toLocaleString()}</span>
                    <span><i class="fas fa-star"></i> ${resource.rating}</span>
                    <span><i class="fas fa-file"></i> ${resource.size}</span>
                </div>
                <div class="resource-actions">
                    <button class="action-btn preview" data-resource-id="${resource.id}">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    <button class="action-btn download" data-resource-id="${resource.id}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    // Get icon for resource category
    function getIconForCategory(category) {
        const icons = {
            tutorials: 'graduation-cap',
            datasets: 'database',
            tools: 'tools',
            code: 'code',
            papers: 'file-alt',
            cheatsheets: 'clipboard-list'
        };
        return icons[category] || 'file';
    }

    // Update active category
    function updateActiveCategory(category) {
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('active');
        });
        
        const activeCard = document.querySelector(`[data-category="${category}"]`);
        if (activeCard) {
            activeCard.classList.add('active');
        }
    }

    // Update search input
    function updateSearchInput(value) {
        document.getElementById('resource-search').value = value;
    }

    // Perform search
    function performSearch() {
        applyFilters();
        showToast('Search completed');
    }

    // Load more resources
    function loadMoreResources() {
        const btn = document.getElementById('load-more');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        // Simulate API call
        setTimeout(() => {
            // In a real app, this would load more resources from the server
            showToast('More resources loaded');
            btn.innerHTML = '<i class="fas fa-plus"></i> Load More Resources';
            
            // For demo, just show a message
            const currentCount = document.querySelectorAll('.all-resources-grid .resource-card').length;
            const newCount = currentCount + 3;
            showToast(`Showing ${newCount} of ${resources.length} resources`);
        }, 1000);
    }

    // Initialize download functionality
    function initDownloadFunctionality() {
        const downloadButtons = document.querySelectorAll('.action-btn.download');
        const guideButtons = document.querySelectorAll('.guide-download-btn');
        const modal = document.getElementById('download-modal');
        const modalClose = document.querySelector('.modal-close');
        const modalCancel = document.querySelector('.modal-cancel');
        const downloadBtn = document.querySelector('.modal-download');
        const licenseCheckbox = document.getElementById('agree-license');
        
        // Handle resource download buttons
        downloadButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const resourceId = this.getAttribute('data-resource-id');
                const resource = resources.find(r => r.id == resourceId);
                
                if (resource) {
                    openDownloadModal(resource);
                }
            });
        });
        
        // Handle guide download buttons
        guideButtons.forEach(button => {
            button.addEventListener('click', function() {
                const guideTitle = this.closest('.guide-card').querySelector('h3').textContent;
                const resource = {
                    title: guideTitle,
                    format: 'ZIP',
                    size: this.textContent.match(/\(([^)]+)\)/)[1]
                };
                openDownloadModal(resource);
            });
        });
        
        // Handle preview buttons
        document.addEventListener('click', function(e) {
            if (e.target.closest('.action-btn.preview')) {
                const resourceId = e.target.closest('.action-btn').getAttribute('data-resource-id');
                const resource = resources.find(r => r.id == resourceId);
                
                if (resource) {
                    showPreviewModal(resource);
                }
            }
        });
        
        // Modal functionality
        modalClose.addEventListener('click', closeModal);
        modalCancel.addEventListener('click', closeModal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // License agreement toggle
        licenseCheckbox.addEventListener('change', function() {
            downloadBtn.disabled = !this.checked;
        });
        
        // Download button handler
        downloadBtn.addEventListener('click', function() {
            if (!licenseCheckbox.checked) return;
            
            const format = document.querySelector('input[name="format"]:checked').value;
            const resourceTitle = document.getElementById('modal-resource-title').textContent;
            
            simulateDownload(resourceTitle, format);
            closeModal();
        });
    }

    // Open download modal
    function openDownloadModal(resource) {
        const modal = document.getElementById('download-modal');
        const title = document.getElementById('modal-resource-title');
        const meta = document.querySelector('.modal-resource-meta');
        
        title.textContent = resource.title;
        meta.textContent = `${resource.format} • ${resource.size}`;
        
        // Reset modal state
        document.getElementById('agree-license').checked = false;
        document.querySelector('.modal-download').disabled = true;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Show preview modal
    function showPreviewModal(resource) {
        const modalContent = `
            <div class="preview-content">
                <h3>${resource.title}</h3>
                <div class="preview-info">
                    <p><strong>Category:</strong> ${resource.category}</p>
                    <p><strong>Level:</strong> ${resource.level}</p>
                    <p><strong>Format:</strong> ${resource.format}</p>
                    <p><strong>Size:</strong> ${resource.size}</p>
                </div>
                <div class="preview-description">
                    <h4>Description</h4>
                    <p>${resource.description}</p>
                </div>
                <div class="preview-stats">
                    <span><i class="fas fa-download"></i> ${resource.downloads.toLocaleString()} downloads</span>
                    <span><i class="fas fa-star"></i> ${resource.rating} rating</span>
                </div>
                <div class="preview-actions">
                    <button class="btn btn-secondary close-preview">Close</button>
                    <button class="btn btn-primary download-from-preview">Download</button>
                </div>
            </div>
        `;
        
        showCustomModal('Preview Resource', modalContent);
        
        // Add event listeners for the preview modal
        setTimeout(() => {
            document.querySelector('.close-preview').addEventListener('click', () => {
                document.querySelector('.custom-modal').remove();
            });
            
            document.querySelector('.download-from-preview').addEventListener('click', () => {
                openDownloadModal(resource);
                document.querySelector('.custom-modal').remove();
            });
        }, 100);
    }

    // Show custom modal
    function showCustomModal(title, content) {
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
            z-index: 1000;
            padding: 1rem;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="custom-modal-content" style="
                background: white;
                border-radius: 20px;
                padding: 2rem;
                max-width: 600px;
                width: 100%;
                animation: slideInUp 0.3s ease;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="color: #1D4ED8; margin: 0;">${title}</h3>
                    <button class="custom-modal-close" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: #666;
                    ">&times;</button>
                </div>
                ${content}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal handlers
        modal.querySelector('.custom-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Close modal
    function closeModal() {
        const modal = document.getElementById('download-modal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Simulate download
    function simulateDownload(title, format) {
        showToast(`Downloading ${title} in ${format.toUpperCase()} format...`);
        
        // In a real application, this would trigger an actual download
        setTimeout(() => {
            showToast('Download completed successfully!');
            
            // Update download count
            const resourceTitle = document.getElementById('modal-resource-title').textContent;
            const downloadCounts = document.querySelectorAll('.resource-stats span:first-child');
            
            downloadCounts.forEach(span => {
                if (span.closest('.resource-card')?.querySelector('h3')?.textContent === resourceTitle) {
                    const current = parseInt(span.textContent.replace(/,/g, ''));
                    span.innerHTML = `<i class="fas fa-download"></i> ${(current + 1).toLocaleString()}`;
                }
            });
        }, 2000);
    }

    // Initialize contribution button
    function initContributionButton() {
        const contributionBtn = document.querySelector('.contribution-btn');
        
        contributionBtn.addEventListener('click', function() {
            showCustomModal('Submit Resource', `
                <div class="contribution-form">
                    <div class="form-group">
                        <label for="resource-title">Resource Title</label>
                        <input type="text" id="resource-title" placeholder="Enter resource title">
                    </div>
                    
                    <div class="form-group">
                        <label for="resource-category">Category</label>
                        <select id="resource-category">
                            <option value="">Select category</option>
                            <option value="tutorials">Tutorial</option>
                            <option value="datasets">Dataset</option>
                            <option value="tools">Tool</option>
                            <option value="code">Code Sample</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="resource-description">Description</label>
                        <textarea id="resource-description" placeholder="Describe your resource" rows="4"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="resource-file">Upload File</label>
                        <input type="file" id="resource-file">
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-secondary cancel-submission">Cancel</button>
                        <button class="btn btn-primary submit-resource">Submit Resource</button>
                    </div>
                </div>
            `);
            
            // Add form submission handler
            setTimeout(() => {
                document.querySelector('.submit-resource').addEventListener('click', function() {
                    const title = document.getElementById('resource-title').value;
                    const category = document.getElementById('resource-category').value;
                    
                    if (title && category) {
                        showToast('Resource submitted for review!');
                        document.querySelector('.custom-modal').remove();
                    } else {
                        showToast('Please fill in all required fields');
                    }
                });
                
                document.querySelector('.cancel-submission').addEventListener('click', function() {
                    document.querySelector('.custom-modal').remove();
                });
            }, 100);
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

    // Add CSS animations for toast
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

    // Initialize everything
    function initResourcePage() {
        console.log('Initializing Resource Platform...');
        
        // Add animations
        addAnimations();
        
        // Initialize components
        initBackgroundSlider();
        initCategoryFiltering();
        initResourceFilters();
        initDownloadFunctionality();
        initContributionButton();
        
        // Load initial resources
        applyFilters();
        
        console.log('✅ Resource Platform initialized successfully');
    }
    
    // Start initialization
    setTimeout(initResourcePage, 100);
});