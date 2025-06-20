document.addEventListener('DOMContentLoaded', () => {
    console.log("Portfolio loaded!");

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const themeSwitch = document.getElementById('theme-switch');
    const projectsSection = document.querySelector('.projects');
    const projectCards = document.querySelectorAll('.project-card');
    const interestsSection = document.querySelector('.interests');
    const vlsiSection = document.querySelector('.vlsi');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsCard = document.getElementById('settings-card');
    const toolsToggle = document.getElementById('tools-toggle');
    const toolsCard = document.getElementById('tools-card');
    const languagesToggle = document.getElementById('languages-toggle');
    const languagesCard = document.getElementById('languages-card');
    const skillsToggle = document.getElementById('skills-toggle');
    const skillsCard = document.getElementById('skills-card');
    const colorButtons = document.querySelectorAll('.color-dot');
    const styleButtons = document.querySelectorAll('.style-btn');
    const visitorCount = document.getElementById('visitor-count');

    // Hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scroll with animation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                targetElement.style.animation = 'fadeIn 0.6s ease-in';
                setTimeout(() => {
                    targetElement.style.animation = '';
                }, 600);
            }
        });
    });

    // Feature detection for touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Dropdown Panel Toggle
    const toggles = [
        { toggle: settingsToggle, card: settingsCard },
        { toggle: toolsToggle, card: toolsCard },
        { toggle: languagesToggle, card: languagesCard },
        { toggle: skillsToggle, card: skillsCard }
    ];

    toggles.forEach(({ toggle, card }) => {
        if (toggle && card) {
            const eventType = isTouchDevice ? 'click' : 'click'; // Use click for consistency
            toggle.addEventListener(eventType, (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Close other dropdowns
                toggles.forEach(({ card: otherCard }) => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('active');
                    }
                });
                // Toggle current dropdown
                card.classList.toggle('active');
            });

            // Visual feedback for touch
            if (isTouchDevice) {
                toggle.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    toggle.classList.add('active-touch');
                });
                toggle.addEventListener('touchend', () => {
                    toggle.classList.remove('active-touch');
                });
            }
        } else {
            console.warn(`Toggle or card not found: ${toggle}, ${card}`);
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.settings-panel') && !e.target.closest('.settings-card, .tools-card, .languages-card, .skills-card')) {
            toggles.forEach(({ card }) => {
                card.classList.remove('active');
            });
        }
    });

    // Prevent closing when clicking inside dropdowns
    document.querySelectorAll('.settings-card, .tools-card, .languages-card, .skills-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Theme Toggle
    if (themeSwitch) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeSwitch.checked = true;
        }

        themeSwitch.addEventListener('change', () => {
            document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
    } else {
        console.warn("Theme switch element not found!");
    }

    // Accent Color Toggle
    colorButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const color = button.dataset.color;
            document.body.className = document.body.className.replace(/accent-[^\s]+/, '');
            document.body.classList.add(`accent-${color}`);
            localStorage.setItem('accent', color);
            colorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Load saved accent color
    const savedAccent = localStorage.getItem('accent') || 'cyber-cyan';
    document.body.classList.add(`accent-${savedAccent}`);
    colorButtons.forEach(btn => {
        if (btn.dataset.color === savedAccent) btn.classList.add('active');
    });

    // UI Style Toggle
    styleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const style = button.dataset.style;
            document.body.className = document.body.className.replace(/ui-[^\s]+/, '');
            document.body.classList.add(`ui-${style}`);
            localStorage.setItem('ui-style', style);
            styleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Load saved UI style
    const savedStyle = localStorage.getItem('ui-style') || 'flat';
    document.body.classList.add(`ui-${savedStyle}`);
    styleButtons.forEach(btn => {
        if (btn.dataset.style === savedStyle) btn.classList.add('active');
    });

    // Custom cursor (only for non-touch devices with larger screens)
    if (window.innerWidth > 768 && !isTouchDevice) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        document.querySelectorAll('a, .project-card, .toggle-label, .settings-icon, .color-dot, .style-btn').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    // Scroll-based project section animation
    if (projectsSection && projectCards) {
        window.addEventListener('scroll', () => {
            const projectsRect = projectsSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const projectsTop = projectsRect.top;
            const projectsHeight = projectsRect.height;

            if (projectsTop < windowHeight * 0.9 && projectsTop > -projectsHeight) {
                projectsSection.classList.add('enlarge');
            } else {
                projectsSection.classList.remove('enlarge');
            }

            if (projectsTop < windowHeight / 2 && projectsTop > -projectsHeight / 2) {
                projectsSection.classList.add('tab-effect');
            } else {
                projectsSection.classList.remove('tab-effect');
            }

            const scrollProgress = Math.max(0, Math.min(1, (windowHeight - projectsTop) / (projectsHeight * 1.1)));
            const visibleCards = Math.ceil(scrollProgress * projectCards.length);

            projectCards.forEach((card, index) => {
                if (index < visibleCards) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });

            if (projectsTop < -projectsHeight * 0.9) {
                projectsSection.classList.remove('enlarge', 'tab-effect');
            }
        });
    }

    // Ensure Interests and VLSI sections are visible
    if (interestsSection) {
        interestsSection.style.display = 'block';
        interestsSection.style.opacity = '1';
    }
    if (vlsiSection) {
        vlsiSection.style.display = 'block';
        vlsiSection.style.opacity = '1';
    }

    // Scroll-based section enlargement for other sections
    const sections = document.querySelectorAll('section:not(.projects)');
    const observerOptions = {
        threshold: 0.2
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('enlarge');
                entry.target.style.opacity = '1';
            } else {
                entry.target.classList.remove('enlarge');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Visitor count with increment
    const visitorNumber = document.getElementById('visitor-number');
    if (visitorNumber) {
        let visitorCount = parseInt(localStorage.getItem('visitorCount') || '0');
        visitorCount += 1;
        localStorage.setItem('visitorCount', visitorCount);
        visitorNumber.textContent = visitorCount;
    }
});
