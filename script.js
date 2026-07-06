/* =========================================================
   Gabriel Rodriguez — Portfolio
   script.js
   ========================================================= */
 
/* EmailJS config — used by the contact form on contact.html.
   Public key is safe to expose client-side; it only allows sending
   through the specific service/template below, not reading account data. */
var EMAILJS_PUBLIC_KEY = 'DYt8cPRH3WNxMzAQW';
var EMAILJS_SERVICE_ID = 'service_6afy00u';
var EMAILJS_TEMPLATE_ID = 'template_2go9wkr';
 
document.addEventListener('DOMContentLoaded', function () {
 
    /* -----------------------------------------------------
       1. Mobile navigation
    ----------------------------------------------------- */
    var hamburger = document.querySelector('.hamburger');
    var mobilePanel = document.querySelector('.mobile-panel');
 
    if (hamburger && mobilePanel) {
        hamburger.addEventListener('click', function () {
            var isOpen = hamburger.classList.toggle('open');
            mobilePanel.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
 
        mobilePanel.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('open');
                mobilePanel.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }
 
    /* -----------------------------------------------------
       2. Active nav link (based on current page)
    ----------------------------------------------------- */
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-panel a').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
 
    /* -----------------------------------------------------
       3. Sticky nav — subtle background shift on scroll
    ----------------------------------------------------- */
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        var onScroll = function () {
            if (window.scrollY > 12) {
                navbar.style.background = 'rgba(5,8,22,.9)';
                navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,.35)';
            } else {
                navbar.style.background = 'rgba(5,8,22,.65)';
                navbar.style.boxShadow = 'none';
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
 
    /* -----------------------------------------------------
       4. Scroll-reveal animation
    ----------------------------------------------------- */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
 
        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }
 
    /* -----------------------------------------------------
       5. FAQ accordion (Contact page)
    ----------------------------------------------------- */
    document.querySelectorAll('.faq-item').forEach(function (item) {
        var question = item.querySelector('.faq-q');
        if (!question) return;
        question.addEventListener('click', function () {
            var wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
                openItem.classList.remove('open');
            });
            if (!wasOpen) item.classList.add('open');
        });
    });
 
    /* -----------------------------------------------------
       6. EmailJS init (only present on contact.html)
    ----------------------------------------------------- */
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
 
    /* -----------------------------------------------------
       7. Contact form — validation + live send via EmailJS
       (When migrating to GoHighLevel, swap this for a native
       GHL form embed or point the form action at a GHL endpoint.)
    ----------------------------------------------------- */
    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');
 
    if (form && status) {
        var submitBtn = form.querySelector('button[type="submit"]');
        var originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';
 
        form.addEventListener('submit', function (e) {
            e.preventDefault();
 
            var required = form.querySelectorAll('[required]');
            var valid = true;
            required.forEach(function (field) {
                if (!field.value.trim()) {
                    valid = false;
                    field.style.borderColor = '#F87171';
                } else {
                    field.style.borderColor = '';
                }
            });
 
            status.classList.remove('show', 'success');
 
            if (!valid) {
                status.textContent = 'Please fill in all required fields before sending.';
                status.classList.add('show');
                return;
            }
 
            if (typeof emailjs === 'undefined') {
                status.textContent = 'Email service failed to load. Please email me directly instead.';
                status.classList.add('show');
                return;
            }
 
            if (submitBtn) {
                submitBtn.setAttribute('disabled', 'true');
                submitBtn.textContent = 'Sending...';
            }
 
            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
                .then(function () {
                    status.textContent = 'Thanks — your message has been received. I will get back to you within 24 hours.';
                    status.classList.add('show', 'success');
                    form.reset();
                })
                .catch(function (error) {
                    status.textContent = 'Something went wrong sending your message. Please try again or email me directly.';
                    status.classList.add('show');
                    console.error('EmailJS error:', error);
                })
                .finally(function () {
                    if (submitBtn) {
                        submitBtn.removeAttribute('disabled');
                        submitBtn.textContent = originalBtnText;
                    }
                });
        });
    }
 
    /* -----------------------------------------------------
       8. Current year in footer
    ----------------------------------------------------- */
    document.querySelectorAll('.year').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });
 
});