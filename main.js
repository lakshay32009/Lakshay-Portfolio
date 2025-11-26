// Main JavaScript functionality for portfolio website
// Modern ES6+ implementation with interactive features

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initAnimations();
        this.setupInteractiveComponents();
        this.initScrollAnimations();
        this.loadDynamicContent();
    }

    async loadDynamicContent() {
        try {
            const response = await fetch('portfolio-data.json', { cache: 'no-store' });
            if (!response.ok) {
                return;
            }

            const data = await response.json();
            // Expose globally so other scripts/pages can reuse if needed
            window.portfolioData = data;

            if (data.personalInfo) {
                this.applyPersonalInfo(data.personalInfo);
            }
            if (data.contactInfo && data.personalInfo) {
                this.applyContactInfo(data);
            }
        } catch (error) {
            console.warn('Could not load portfolio-data.json (using static fallback content).', error);
        }
    }

    applyPersonalInfo(personalInfo) {
        // Update nav brand
        const navBrandLink = document.querySelector('.nav-glass .font-display.font-bold.text-xl a');
        const navBrandDiv = document.querySelector('.nav-glass .font-display.font-bold.text-xl:not(a)');
        if (navBrandLink) {
            navBrandLink.textContent = personalInfo.fullName;
        } else if (navBrandDiv) {
            navBrandDiv.textContent = personalInfo.fullName;
        }

        // Update hero name on home page (if present)
        const heroNameSpan = document.querySelector('#home .hero-title .text-electric');
        if (heroNameSpan) {
            heroNameSpan.textContent = personalInfo.fullName;
        }

        // Update hero description to use professional summary if available
        const heroDescription = document.querySelector('#home .hero-description');
        if (heroDescription && personalInfo.professionalSummary) {
            heroDescription.textContent = personalInfo.professionalSummary;
        }

        // Update About section intro paragraph (index page)
        const aboutIntro = document.querySelector('#about .text-center p.text-xl');
        if (aboutIntro && personalInfo.aboutMe) {
            aboutIntro.textContent = personalInfo.aboutMe;
        }
    }

    applyContactInfo(data) {
        const personalInfo = data.personalInfo;
        const contactInfo = data.contactInfo;

        // Update all contact items on any page that uses the .contact-item pattern
        document.querySelectorAll('.contact-item').forEach(item => {
            const labelEl = item.querySelector('.font-semibold');
            const valueEl = item.querySelector('.text-gray-600, .text-gray-300');
            const valueNode = valueEl || item.querySelector('div > div:last-child');

            if (!labelEl || !valueNode) return;

            const label = labelEl.textContent.trim().toLowerCase();

            if (label === 'email' && contactInfo.primaryEmail) {
                valueNode.textContent = contactInfo.primaryEmail;
            } else if (label === 'linkedin' && contactInfo.linkedinProfile) {
                valueNode.textContent = contactInfo.linkedinProfile;
            } else if (label === 'github' && contactInfo.githubProfile) {
                valueNode.textContent = contactInfo.githubProfile;
            } else if (label === 'location' && personalInfo.location) {
                valueNode.textContent = personalInfo.location;
            }
        });

        // Update contact CTA blurb on the dedicated contact section if present
        const contactHeroText = document.querySelector('#contact .text-center p.text-xl, section.pt-24.pb-16 .text-center p.text-xl');
        if (contactHeroText && contactInfo.responseTime) {
            contactHeroText.textContent = `I typically respond within ${contactInfo.responseTime} hours. The best way to reach me is via ${contactInfo.preferredContact || 'email'}.`;
        }
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }

        // Dark/light mode toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    initAnimations() {
        // Typewriter effect for hero text
        if (typeof Typed !== 'undefined' && document.querySelector('.typed-text')) {
            new Typed('.typed-text', {
                strings: [
                    'Cybersecurity Expert',
                    'AI/ML Specialist',
                    'Security Researcher',
                    'Community Impact Leader'
                ],
                typeSpeed: 80,
                backSpeed: 50,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }

        // Initialize particle background if p5.js is available
        if (typeof p5 !== 'undefined') {
            this.initParticleBackground();
        }
    }

    setupInteractiveComponents() {
        this.initSkillsRadar();
        this.initProjectFilters();
        this.initTimeline();
        this.initContactForm();
        this.initAchievementsCounter();
    }

    initSkillsRadar() {
        const skillsData = {
            labels: [
                'Cybersecurity',
                'AI/ML',
                'Python',
                'Risk Assessment',
                'Incident Response',
                'Threat Analysis',
                'Network Security',
                'Penetration Testing'
            ],
            datasets: [{
                label: 'Technical Skills',
                data: [95, 88, 92, 90, 85, 87, 89, 83],
                backgroundColor: 'rgba(0, 212, 255, 0.2)',
                borderColor: 'rgba(0, 212, 255, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(0, 255, 136, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(0, 255, 136, 1)'
            }]
        };

        const ctx = document.getElementById('skillsChart');
        if (ctx && typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: 'radar',
                data: skillsData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20,
                                color: '#8892b0'
                            },
                            grid: {
                                color: 'rgba(136, 146, 176, 0.2)'
                            },
                            angleLines: {
                                color: 'rgba(136, 146, 176, 0.2)'
                            },
                            pointLabels: {
                                color: '#ccd6f6',
                                font: {
                                    size: 12
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        const searchInput = document.querySelector('.project-search');

        // Filter by category
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter projects
                projectCards.forEach(card => {
                    const categories = card.dataset.categories.split(',');
                    const shouldShow = filter === 'all' || categories.includes(filter);
                    
                    if (shouldShow) {
                        card.style.display = 'block';
                        anime({
                            targets: card,
                            opacity: [0, 1],
                            translateY: [20, 0],
                            duration: 500,
                            easing: 'easeOutQuart'
                        });
                    } else {
                        anime({
                            targets: card,
                            opacity: 0,
                            translateY: -20,
                            duration: 300,
                            easing: 'easeInQuart',
                            complete: () => {
                                card.style.display = 'none';
                            }
                        });
                    }
                });
            });
        });

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                
                projectCards.forEach(card => {
                    const title = card.querySelector('.project-title').textContent.toLowerCase();
                    const description = card.querySelector('.project-description').textContent.toLowerCase();
                    const matches = title.includes(searchTerm) || description.includes(searchTerm);
                    
                    card.style.display = matches ? 'block' : 'none';
                });
            });
        }
    }

    initTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const details = item.querySelector('.timeline-details');
                const isExpanded = item.classList.contains('expanded');
                
                // Close all other items
                timelineItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('expanded');
                        const otherDetails = otherItem.querySelector('.timeline-details');
                        if (otherDetails) {
                            anime({
                                targets: otherDetails,
                                height: 0,
                                opacity: 0,
                                duration: 300,
                                easing: 'easeInQuart'
                            });
                        }
                    }
                });
                
                // Toggle current item
                if (isExpanded) {
                    item.classList.remove('expanded');
                    anime({
                        targets: details,
                        height: 0,
                        opacity: 0,
                        duration: 300,
                        easing: 'easeInQuart'
                    });
                } else {
                    item.classList.add('expanded');
                    anime({
                        targets: details,
                        height: 'auto',
                        opacity: 1,
                        duration: 500,
                        easing: 'easeOutQuart'
                    });
                }
            });
        });
    }

    initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea, select');
        const submitBtn = form.querySelector('.submit-btn');

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                this.submitForm(form, submitBtn);
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Update field state
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (isValid) {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
            }
        } else {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
        }

        return isValid;
    }

    async submitForm(form, submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual endpoint)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    initAchievementsCounter() {
        const counters = document.querySelectorAll('.achievement-counter');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    const suffix = counter.dataset.suffix || '';
                    
                    anime({
                        targets: { count: 0 },
                        count: target,
                        duration: 2000,
                        easing: 'easeOutQuart',
                        update: function(anim) {
                            counter.textContent = Math.floor(anim.animations[0].currentValue) + suffix;
                        }
                    });
                    
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    initScrollAnimations() {
        // Scroll-triggered animations
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    anime({
                        targets: element,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        duration: 800,
                        easing: 'easeOutQuart',
                        delay: anime.stagger(100)
                    });
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => observer.observe(element));
    }

    initParticleBackground() {
        // P5.js particle system for hero background
        const sketch = (p) => {
            let particles = [];
            const numParticles = 50;

            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('particle-bg');
                canvas.style('position', 'absolute');
                canvas.style('top', '0');
                canvas.style('left', '0');
                canvas.style('z-index', '-1');

                // Initialize particles
                for (let i = 0; i < numParticles; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-0.5, 0.5),
                        vy: p.random(-0.5, 0.5),
                        size: p.random(2, 6),
                        opacity: p.random(0.3, 0.8)
                    });
                }
            };

            p.draw = () => {
                p.clear();
                
                // Update and draw particles
                particles.forEach(particle => {
                    // Update position
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // Wrap around edges
                    if (particle.x < 0) particle.x = p.width;
                    if (particle.x > p.width) particle.x = 0;
                    if (particle.y < 0) particle.y = p.height;
                    if (particle.y > p.height) particle.y = 0;
                    
                    // Draw particle
                    p.fill(0, 212, 255, particle.opacity * 255);
                    p.noStroke();
                    p.circle(particle.x, particle.y, particle.size);
                });
                
                // Draw connections
                particles.forEach((particle, i) => {
                    particles.slice(i + 1).forEach(otherParticle => {
                        const distance = p.dist(particle.x, particle.y, otherParticle.x, otherParticle.y);
                        if (distance < 100) {
                            const opacity = p.map(distance, 0, 100, 0.3, 0);
                            p.stroke(0, 212, 255, opacity * 255);
                            p.strokeWeight(1);
                            p.line(particle.x, particle.y, otherParticle.x, otherParticle.y);
                        }
                    });
                });
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        };

        new p5(sketch);
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Animate theme transition
        anime({
            targets: 'body',
            duration: 300,
            easing: 'easeOutQuart'
        });
    }

    handleResize() {
        // Handle responsive adjustments
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('mobile', isMobile);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        anime({
            targets: notification,
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 300,
            easing: 'easeOutQuart'
        });
        
        setTimeout(() => {
            anime({
                targets: notification,
                opacity: 0,
                translateY: -20,
                duration: 300,
                easing: 'easeInQuart',
                complete: () => {
                    document.body.removeChild(notification);
                }
            });
        }, 5000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Utility functions
const utils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: (func, limit) => {
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
};