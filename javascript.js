// Sample property data
const properties = [
    {
        id: 1,
        title: "Modern Family House",
        location: "Downtown District",
        price: 450000,
        type: "house",
        category: "sale",
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2500,
        image: "images/house1.jpg",
        featured: true
    },
    {
        id: 2,
        title: "Contemporary Villa",
        location: "Hillside Avenue",
        price: 650000,
        type: "villa",
        category: "sale",
        bedrooms: 5,
        bathrooms: 4,
        sqft: 3200,
        image: "images/house2.webp",
        featured: true
    },
    {
        id: 3,
        title: "Luxury Apartment",
        location: "City Center",
        price: 2800,
        type: "apartment",
        category: "rent",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        image: "images/interior1.jpg",
        featured: true
    },
    {
        id: 4,
        title: "Waterfront Condo",
        location: "Marina District",
        price: 380000,
        type: "condo",
        category: "sale",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1100,
        image: "images/interior2.jpg",
        featured: false
    },
    {
        id: 5,
        title: "Suburban Home",
        location: "Oak Street",
        price: 1800,
        type: "house",
        category: "rent",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1800,
        image: "images/interior3.jpg",
        featured: false
    },
    {
        id: 6,
        title: "Downtown Loft",
        location: "Business District",
        price: 295000,
        type: "apartment",
        category: "sale",
        bedrooms: 1,
        bathrooms: 1,
        sqft: 800,
        image: "images/house1.jpg",
        featured: false
    }
];

// Global variables
let currentSearchType = 'sale';
let filteredProperties = properties;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize website functionality
function initializeWebsite() {
    setupNavigation();
    setupSearchTabs();
    loadFeaturedProperties();
    setupGalleryFilter();
    setupContactForm();
    setupFAQ();
    setupAnimations();
    setupLightbox();
}

// Navigation functionality
function setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        }
    });
}

// Search tabs functionality
function setupSearchTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update current search type
            currentSearchType = this.dataset.type;
            
            // Update properties display if on home page
            if (document.getElementById('properties-grid')) {
                loadFeaturedProperties();
            }
        });
    });
}

// Property search functionality
function searchProperties() {
    const location = document.getElementById('location')?.value.toLowerCase() || '';
    const propertyType = document.getElementById('property-type')?.value || '';
    const priceRange = document.getElementById('price-range')?.value || '';

    // Filter properties based on search criteria
    filteredProperties = properties.filter(property => {
        const matchesCategory = property.category === currentSearchType;
        const matchesLocation = !location || property.location.toLowerCase().includes(location);
        const matchesType = !propertyType || property.type === propertyType;
        const matchesPrice = !priceRange || checkPriceRange(property.price, priceRange);

        return matchesCategory && matchesLocation && matchesType && matchesPrice;
    });

    // Display results
    displayProperties(filteredProperties);
    
    // Show search results message
    showSearchResults();
}

// Check if price matches range
function checkPriceRange(price, range) {
    switch(range) {
        case '0-100000':
            return price <= 100000;
        case '100000-300000':
            return price > 100000 && price <= 300000;
        case '300000-500000':
            return price > 300000 && price <= 500000;
        case '500000+':
            return price > 500000;
        default:
            return true;
    }
}

// Load featured properties
function loadFeaturedProperties() {
    const propertiesGrid = document.getElementById('properties-grid');
    if (!propertiesGrid) return;

    // Filter properties by current search type and featured status
    const featuredProps = properties.filter(property => 
        property.category === currentSearchType && property.featured
    );

    displayProperties(featuredProps);
}

// Display properties in grid
function displayProperties(propertiesToShow) {
    const propertiesGrid = document.getElementById('properties-grid');
    if (!propertiesGrid) return;

    if (propertiesToShow.length === 0) {
        propertiesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No Properties Found</h3>
                <p>Try adjusting your search criteria to find more properties.</p>
            </div>
        `;
        return;
    }

    propertiesGrid.innerHTML = propertiesToShow.map(property => `
        <div class="property-card fade-in">
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}" loading="lazy">
                <div class="property-badge">${property.category === 'sale' ? 'For Sale' : 'For Rent'}</div>
            </div>
            <div class="property-info">
                <div class="property-price">
                    $${property.price.toLocaleString()}${property.category === 'rent' ? '/month' : ''}
                </div>
                <h3 class="property-title">${property.title}</h3>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.location}
                </div>
                <div class="property-features">
                    <span><i class="fas fa-bed"></i> ${property.bedrooms} Bed</span>
                    <span><i class="fas fa-bath"></i> ${property.bathrooms} Bath</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.sqft} sq ft</span>
                </div>
                <div class="property-actions">
                    <a href="#" class="btn btn-primary" onclick="viewProperty(${property.id})">View Details</a>
                    <a href="#" class="btn btn-secondary" onclick="contactAboutProperty(${property.id})">Contact</a>
                </div>
            </div>
        </div>
    `).join('');

    // Trigger animations
    setTimeout(() => {
        document.querySelectorAll('.property-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    }, 100);
}

// View property details
function viewProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
        alert(`Viewing details for: ${property.title}\nLocation: ${property.location}\nPrice: $${property.price.toLocaleString()}`);
    }
}

// Contact about property
function contactAboutProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
        // Redirect to contact page with property info
        window.location.href = `contact.html?property=${property.id}`;
    }
}

// Show search results
function showSearchResults() {
    const resultsCount = filteredProperties.length;
    const message = `Found ${resultsCount} ${resultsCount === 1 ? 'property' : 'properties'} for ${currentSearchType}`;
    
    // Create or update results message
    let resultsMessage = document.querySelector('.search-results-message');
    if (!resultsMessage) {
        resultsMessage = document.createElement('div');
        resultsMessage.className = 'search-results-message';
        const propertiesSection = document.querySelector('.featured-properties .container');
        if (propertiesSection) {
            propertiesSection.insertBefore(resultsMessage, propertiesSection.querySelector('h2').nextSibling);
        }
    }
    
    resultsMessage.innerHTML = `<p style="text-align: center; color: #64748b; margin: 1rem 0;">${message}</p>`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (resultsMessage) {
            resultsMessage.style.opacity = '0';
            setTimeout(() => {
                resultsMessage.remove();
            }, 300);
        }
    }, 3000);
}

// Gallery filter functionality
function setupGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Lightbox functionality
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

// Open lightbox
function openLightbox(imageSrc, title) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    
    if (lightbox && lightboxImage && lightboxTitle) {
        lightboxImage.src = imageSrc;
        lightboxTitle.textContent = title;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Fade in effect
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
    }
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Contact form functionality
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (validateContactForm(data)) {
            submitContactForm(data);
        }
    });
}

// Validate contact form
function validateContactForm(data) {
    const errors = [];
    
    if (!data.firstName.trim()) errors.push('First name is required');
    if (!data.lastName.trim()) errors.push('Last name is required');
    if (!data.email.trim()) errors.push('Email is required');
    if (!isValidEmail(data.email)) errors.push('Please enter a valid email');
    if (!data.subject) errors.push('Please select a subject');
    if (!data.message.trim()) errors.push('Message is required');
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

// Check if email is valid
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form errors
function showFormErrors(errors) {
    const errorMessage = errors.join('\\n');
    alert('Please fix the following errors:\\n\\n' + errorMessage);
}

// Submit contact form
function submitContactForm(data) {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<div class="loading"></div> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showSuccessMessage('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        document.getElementById('contactForm').reset();
    }, 2000);
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    // Animate in
    setTimeout(() => {
        successDiv.style.opacity = '1';
        successDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateX(100px)';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 5000);
}

// FAQ functionality
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Toggle FAQ item
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Animation setup
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Get directions (placeholder)
function getDirections() {
    alert('Opening directions in your default map application...');
    // In a real application, this would open the user's map app
    window.open('https://maps.google.com/?q=123+Real+Estate+Street', '_blank');
}

// Newsletter signup
function subscribeNewsletter(email) {
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Simulate newsletter signup
    setTimeout(() => {
        showSuccessMessage('Thank you for subscribing to our newsletter!');
    }, 1000);
}

// Property comparison (placeholder)
function compareProperties(propertyIds) {
    alert(`Comparing ${propertyIds.length} properties...`);
    // In a real application, this would show a comparison view
}

// Save property to favorites (placeholder)
function saveToFavorites(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
        showSuccessMessage(`${property.title} saved to favorites!`);
    }
}

// Share property (placeholder)
function shareProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (property && navigator.share) {
        navigator.share({
            title: property.title,
            text: `Check out this property: ${property.title}`,
            url: window.location.href
        });
    } else {
        // Fallback for browsers without Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showSuccessMessage('Property link copied to clipboard!');
        });
    }
}

// Initialize map (placeholder)
function initializeMap() {
    // In a real application, this would initialize Google Maps or another map service
    console.log('Map would be initialized here');
}

// Handle window resize
window.addEventListener('resize', function() {
    // Recalculate layouts if needed
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (window.innerWidth > 768) {
        navMenu?.classList.remove('active');
        navToggle?.classList.remove('active');
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
        console.log('Page hidden');
    } else {
        // Page is visible
        console.log('Page visible');
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Performance monitoring
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for global access
window.searchProperties = searchProperties;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.toggleFAQ = toggleFAQ;
window.viewProperty = viewProperty;
window.contactAboutProperty = contactAboutProperty;
window.getDirections = getDirections;
window.subscribeNewsletter = subscribeNewsletter;
window.scrollToSection = scrollToSection;

