/**
 * MANYBIRDS — Interactive Scripts
 * ================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initProjectCards();
    initBackButtons();
    initSmoothScroll();
    initLightbox();
});

/**
 * Navigation
 * - Updates active state based on scroll position
 * - Handles nav visibility
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const sections = document.querySelectorAll('.section:not(.section-project-detail)');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Update nav background on scroll
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Add/remove solid background based on scroll position
        if (currentScroll > 100) {
            nav.style.background = 'rgba(8, 9, 11, 0.95)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(8, 9, 11, 1) 0%, transparent 100%)';
            nav.style.backdropFilter = 'none';
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Update active nav link based on section in view
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px',
        threshold: 0
    };
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => navObserver.observe(section));
}

/**
 * Scroll Animations
 * - Fade in sections as they enter viewport
 */
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section:not(.section-home)');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                // sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Animate children with stagger effect
    const staggerContainers = document.querySelectorAll('.stagger-children');
    staggerContainers.forEach(container => {
        const childObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.2 });
        
        childObserver.observe(container);
    });
}

/**
 * Project Cards
 * - Click to view project detail page
 */
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    const mainSections = document.querySelectorAll('.section:not(.section-project-detail)');
    const projectSections = document.querySelectorAll('.section-project-detail');
    const birdMarquee = document.querySelector('.bird-marquee');
    
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.project;
            const targetSection = document.getElementById(`project-${projectId}`);
            
            if (targetSection) {
                // Hide main sections
                mainSections.forEach(section => {
                    section.style.display = 'none';
                });
                
                // Hide bird marquee
                if (birdMarquee) birdMarquee.style.display = 'none';
                
                // Hide other project details
                projectSections.forEach(section => {
                    section.classList.remove('active');
                    section.style.display = 'none';
                });
                
                // Show target project
                targetSection.style.display = 'block';
                targetSection.classList.add('active');
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'instant' });
                
                // Trigger entrance animation
                setTimeout(() => {
                    targetSection.classList.add('visible');
                }, 50);
                
                // Update URL without page reload
                history.pushState({ project: projectId }, '', `#project-${projectId}`);
            }
        });
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.project) {
            // Show project
            const targetSection = document.getElementById(`project-${event.state.project}`);
            if (targetSection) {
                mainSections.forEach(s => s.style.display = 'none');
                if (birdMarquee) birdMarquee.style.display = 'none';
                projectSections.forEach(s => {
                    s.classList.remove('active');
                    s.style.display = 'none';
                });
                targetSection.style.display = 'block';
                targetSection.classList.add('active', 'visible');
            }
        } else {
            // Show main site
            showMainSite();
        }
    });
    
    // Check initial URL for project hash
    if (window.location.hash.startsWith('#project-')) {
        const projectId = window.location.hash.replace('#project-', '');
        const targetSection = document.getElementById(`project-${projectId}`);
        if (targetSection) {
            mainSections.forEach(s => s.style.display = 'none');
            if (birdMarquee) birdMarquee.style.display = 'none';
            targetSection.style.display = 'block';
            targetSection.classList.add('active', 'visible');
        }
    }
}

/**
 * Back Buttons
 * - Return from project detail to main site
 */
function initBackButtons() {
    const backButtons = document.querySelectorAll('.back-btn');
    
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showMainSite();
            
            // Navigate to projects section
            const targetId = btn.dataset.back || 'projects';
            history.pushState(null, '', `#${targetId}`);
            
            setTimeout(() => {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        });
    });
}

/**
 * Show Main Site
 * - Utility function to return to main sections
 */
function showMainSite() {
    const mainSections = document.querySelectorAll('.section:not(.section-project-detail)');
    const projectSections = document.querySelectorAll('.section-project-detail');
    const birdMarquee = document.querySelector('.bird-marquee');
    
    // Hide all project details
    projectSections.forEach(section => {
        section.classList.remove('active', 'visible');
        section.style.display = 'none';
    });
    
    // Show main sections
    mainSections.forEach(section => {
        section.style.display = '';
    });
    
    // Show bird marquee
    if (birdMarquee) birdMarquee.style.display = '';
    
    // Re-trigger visibility for sections in view
    setTimeout(() => {
        mainSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add('visible');
            }
        });
    }, 50);
}

/**
 * Smooth Scroll
 * - Handle anchor links with smooth scrolling
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href^="#project-"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Check if we're on a project detail page
                const activeProject = document.querySelector('.section-project-detail.active');
                if (activeProject) {
                    showMainSite();
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Update URL
                history.pushState(null, '', href);
            }
        });
    });
}

/**
 * Parallax Effect (Optional Enhancement)
 * - Subtle parallax on home section
 */
function initParallax() {
    const homeSection = document.querySelector('.section-home');
    const orbs = document.querySelectorAll('.gradient-orb');
    
    if (homeSection && orbs.length) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;
            
            orbs.forEach((orb, index) => {
                const direction = index % 2 === 0 ? 1 : -1;
                orb.style.transform = `translateY(${rate * direction}px)`;
            });
        }, { passive: true });
    }
}

/**
 * Cursor Effect (Optional Enhancement)
 * - Custom cursor that follows mouse
 */
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Grow cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-grow'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-grow'));
    });
}

/**
 * Lightbox
 * - Click gallery images to view larger
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    if (!lightbox || !lightboxImg) return;
    
    // Open lightbox when clicking gallery images
    galleryItems.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close on background click
    lightbox.addEventListener('click', closeLightbox);
    
    // Close on X button click
    if (lightboxClose) {
        lightboxClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // Prevent closing when clicking the image itself
    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Initialize parallax (uncomment if desired)
// initParallax();
