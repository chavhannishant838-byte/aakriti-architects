const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const backToTop = document.querySelector('.back-to-top');
const revealItems = document.querySelectorAll('.reveal');
const progressBar = document.querySelector('.progress-bar');
const loadingScreen = document.querySelector('.loading-screen');
const counters = document.querySelectorAll('.counter');
const sections = document.querySelectorAll('main section[id]');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

const setActiveNav = () => {
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${section.id}`);
            });
        }
    });
};

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        header.classList.toggle('open');
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!expanded));
    });
}

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        header.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
    });
});

const updateHeader = () => {
    if (window.scrollY > 30) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }

    if (window.scrollY > 600) {
        backToTop?.classList.add('visible');
    } else {
        backToTop?.classList.remove('visible');
    }

    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (progressBar) {
        progressBar.style.width = `${Math.max(0, Math.min(100, scrollPercentage))}%`;
    }

    setActiveNav();
};

window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('load', updateHeader);

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.16,
});

revealItems.forEach((item) => observer.observe(item));

const animateCounter = (counter) => {
    const target = Number(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = `${value}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            counter.textContent = `${target}${suffix}`;
        }
    };

    requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            counters.forEach((counter) => animateCounter(counter));
            counterObserver.disconnect();
        }
    });
}, {
    threshold: 0.4,
});

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    counterObserver.observe(aboutSection);
}

const createRipple = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.className = 'ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 700);
};

document.querySelectorAll('.btn, .nav-btn, .project-info a, .logo').forEach((element) => {
    element.addEventListener('click', createRipple);
});

backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
        lightboxImage.src = item.dataset.src || item.src;
        lightboxImage.alt = item.alt;
        lightboxCaption.textContent = item.alt;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    });

    item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            item.click();
        }
    });
});

const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeLightbox();
    }
});

window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen?.classList.add('hidden');
    }, 900);
});
