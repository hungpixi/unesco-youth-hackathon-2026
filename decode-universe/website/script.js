/* ================================================
   DECODE UNIVERSE — JavaScript
   Animations, Interactions, Number Counter
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar scroll behavior ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // --- Mobile menu toggle ---
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // --- Smooth scroll for nav links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Animated number counter ---
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => {
        counterObserver.observe(el);
    });

    function animateCounter(el, target) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const current = Math.round(start + (target - start) * eased);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // --- Scroll reveal animations ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    // Problem cards
    document.querySelectorAll('.problem-card').forEach(card => {
        revealObserver.observe(card);
    });

    // Framework steps
    document.querySelectorAll('.fw-step').forEach((step, index) => {
        step.setAttribute('data-delay', index * 100);
        revealObserver.observe(step);
    });

    // --- Character selector ---
    const characterData = {
        minh: {
            flag: '🇻🇳',
            name: 'Minh',
            role: 'The Accidental Spreader',
            story: 'Minh is a 19-year-old computer science student in Hanoi. Smart, curious, always online. One day he shares a shocking health article without checking — it goes viral, causes panic, and his university gets involved. His journey from careless sharer to critical thinker is the heart of DECODE.',
            arc: { start: '📱 Spreader', middle: '🔍 Investigator', end: '🔓 Decoder' },
            media: ['📺 Video Ep.1', '🎲 Content Card Set A', '📖 Chapter 1']
        },
        aisha: {
            flag: '🇳🇬',
            name: 'Aisha',
            role: 'The Truth Seeker',
            story: 'Aisha is a 22-year-old journalism student in Lagos. Passionate about uncovering truth, she discovers that a popular campus news page is actually run by bots pushing political propaganda. Her investigation reveals a complex web of fake accounts and monetized misinformation.',
            arc: { start: '📝 Student', middle: '🕵️ Investigator', end: '📰 Journalist' },
            media: ['📺 Video Ep.2', '🎲 Content Card Set B', '📖 Chapter 2']
        },
        kai: {
            flag: '🇯🇵',
            name: 'Kai',
            role: 'The AI Detective',
            story: 'Kai is a 20-year-old gamer and AI enthusiast in Tokyo. When deepfake videos of his favorite idol surface, he dives deep into understanding how AI generates synthetic media. He builds tools to detect AI-generated content and becomes an advocate for AI literacy.',
            arc: { start: '🎮 Gamer', middle: '🤖 AI Learner', end: '🛡️ AI Detective' },
            media: ['📺 Video Ep.3', '🎲 Content Card Set C', '📖 Chapter 3']
        },
        luna: {
            flag: '🇧🇷',
            name: 'Luna',
            role: 'The Privacy Warrior',
            story: 'Luna is a 21-year-old content creator in São Paulo. When her photos are stolen and used in scam ads without consent, she discovers the dark world of data harvesting and learns about digital rights, privacy laws, and the true cost of "free" social media.',
            arc: { start: '📸 Creator', middle: '😡 Victim', end: '⚖️ Advocate' },
            media: ['📺 Video Ep.5', '🎲 Content Card Set D', '📖 Chapter 4']
        },
        sam: {
            flag: '🇺🇸',
            name: 'Sam',
            role: 'The Resilient Voice',
            story: 'Sam is an 18-year-old high school student in Chicago. After a manipulated screenshot of a conversation goes viral, Sam faces cyberbullying and social isolation. Through the ordeal, Sam learns how misinformation weaponizes emotions and becomes an anti-bullying advocate.',
            arc: { start: '😔 Target', middle: '💪 Fighter', end: '🗣️ Advocate' },
            media: ['📺 Video Ep.4', '🎲 Content Card Set E', '📖 Chapter 5']
        },
        priya: {
            flag: '🇮🇳',
            name: 'Priya',
            role: 'The Builder',
            story: 'Priya is a 23-year-old computer science graduate in Bangalore. Frustrated by the lack of tools to fight misinformation in local languages, she builds the "DECODE Tool" — an open-source fact-checking assistant. She represents the creator mindset: don\'t just consume, build solutions.',
            arc: { start: '👩‍💻 Coder', middle: '🔧 Builder', end: '🌍 Changemaker' },
            media: ['📺 Video Ep.6', '🎲 Content Card Set F', '📖 Chapter 6']
        }
    };

    const charButtons = document.querySelectorAll('.char-btn');
    const charDetail = document.getElementById('char-minh');

    charButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const charKey = btn.getAttribute('data-char');
            const data = characterData[charKey];

            if (!data) return;

            // Update active button
            charButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update character display
            charDetail.innerHTML = `
                <div class="char-info">
                    <div class="char-flag">${data.flag}</div>
                    <h3 class="char-name">${data.name}</h3>
                    <p class="char-role">${data.role}</p>
                    <p class="char-story">${data.story}</p>
                    <div class="char-arc">
                        <span class="arc-start">${data.arc.start}</span>
                        <span class="arc-arrow">→</span>
                        <span class="arc-middle">${data.arc.middle}</span>
                        <span class="arc-arrow">→</span>
                        <span class="arc-end">${data.arc.end}</span>
                    </div>
                    <div class="char-media">
                        ${data.media.map(m => `<span class="media-tag">${m}</span>`).join('')}
                    </div>
                </div>
            `;
        });
    });

    // --- Active nav link highlighting ---
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});
