// Wrap in a function that can be called once components are loaded
function initializePortfolio() {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. EmailJS Initialization
    (function() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init({
                publicKey: "v_E42cW_yHq58XFk_"
            });
        }
    })();

    // 3. Navigation Logic
    const header = document.querySelector('.site-header');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navBackdrop = document.getElementById('nav-backdrop');
    const body = document.body;

    if (!header || !navToggle || !navLinks) return; 

    // Mobile Toggle
    const toggleNav = () => {
        const isOpen = body.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', isOpen);
    };

    navToggle.addEventListener('click', toggleNav);
    if (navBackdrop) {
        navBackdrop.addEventListener('click', toggleNav);
    }

    // Close on link click with a small delay for better transition
    if (navLinks) {
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                setTimeout(() => {
                    body.classList.remove('nav-open');
                    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
                }, 150);
            }
        });
    }

    // 4. Reveal Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Animate progress bars if in skills section
                const progressBars = entry.target.querySelectorAll('.skill-progress-fill');
                progressBars.forEach((bar, index) => {
                    const percent = bar.getAttribute('data-percent');
                    setTimeout(() => {
                        bar.style.width = percent + '%';
                    }, index * 100);
                });

                // Add staggered animation to children
                const staggeredElements = entry.target.querySelectorAll('.skill-card, .project-card, .from-left, .from-right');
                staggeredElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translate(0, 0)';
                    }, index * 150);
                });

                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        revealObserver.observe(section);
    });

    // 5. Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit');
    
    // 6. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validation
            const emailInput = document.getElementById('email');
            if (emailInput && !emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                alert('Please enter a valid email address.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span>';

            const nameInput = document.getElementById('name');
            const messageInput = document.getElementById('message');

            const templateParams = {
                from_name: nameInput ? nameInput.value : '',
                from_email: emailInput ? emailInput.value : '',
                reply_to: emailInput ? emailInput.value : '',
                message: messageInput ? messageInput.value : '',
                to_name: "Safdar Ali"
            };

            emailjs.send('service_5z3y786', 'template_as28e67', templateParams)
                .then(() => {
                    alert('Thank you! Your message has been sent successfully.');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('EmailJS Error:', error);
                    alert('Something went wrong. Please reach out via WhatsApp instead.');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Send Message</span><i data-lucide="send"></i>';
                    lucide.createIcons();
                });
        });
    }
}

// Listen for custom event or fallback to DOMContentLoaded
window.addEventListener('componentsLoaded', initializePortfolio);
document.addEventListener('DOMContentLoaded', () => {
    // If components are already loaded or being handled by the script in index.html,
    // we wait for 'componentsLoaded'. 
    // If not using the loader, we initialize immediately.
});
