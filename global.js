// NORUMAN Website GSAP Animations
// Make sure to include GSAP and ScrollTrigger in your HTML:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

gsap.registerPlugin(ScrollTrigger);

// =====================
// MAIN VISUAL ANIMATIONS
// =====================

// Hero image slideshow (if multiple images exist)
function initHeroSlideshow() {
    const heroImages = document.querySelectorAll('.header-img img');
    if (heroImages.length > 1) {
        let currentIndex = 0;

        // Hide all images except first
        gsap.set(heroImages, { opacity: 0 });
        gsap.set(heroImages[0], { opacity: 1 });

        setInterval(() => {
            const nextIndex = (currentIndex + 1) % heroImages.length;
            gsap.to(heroImages[currentIndex], { opacity: 0, duration: 1 });
            gsap.to(heroImages[nextIndex], { opacity: 1, duration: 1 });
            currentIndex = nextIndex;
        }, 4000);
    }
}

// =====================
// ABOUT US SECTION ANIMATIONS
// =====================

function initAboutAnimations() {
    // Main title and center cake image fade in first
    gsap.set('.about-title', { opacity: 0, y: 30 });
    gsap.set('.gallery-img-2', { opacity: 0, scale: 0.8 }); // Center strawberry cake

    // Surrounding images (delayed fade in)
    gsap.set(['.gallery-img-1', '.gallery-img-3', '.gallery-img-4', '.gallery-img-5', '.gallery-img-6'], {
        opacity: 0,
        y: 50,
        scale: 0.9
    });

    // Create timeline for About section
    const aboutTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%',
            once: true
        }
    });

    aboutTl
        .to('.about-title', { opacity: 1, y: 0, duration: 1 })
        .to('.gallery-img-2', { opacity: 1, scale: 1, duration: 1 }, "-=0.5")
        .to(['.gallery-img-1', '.gallery-img-3', '.gallery-img-4', '.gallery-img-5', '.gallery-img-6'], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.2
        }, "+=0.5");

    // Parallax effect for gallery images (only on desktop)
    if (window.innerWidth > 768) {
        gsap.utils.toArray('.about-gallery img').forEach(img => {
            gsap.to(img, {
                yPercent: -30,
                ease: "none",
                scrollTrigger: {
                    trigger: img,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });
        });
    }
}

// =====================
// STEPS SECTION ANIMATIONS
// =====================

function initStepsAnimations() {
    // Background color change on scroll
    const stepsSection = document.querySelector('.steps-section');
    if (stepsSection) {
        gsap.to(stepsSection, {
            backgroundColor: '#f8f5f0',
            scrollTrigger: {
                trigger: '.steps-section',
                start: 'top center',
                end: 'bottom center',
                scrub: true
            }
        });
    }

    // Get all step cards and the last step card
    const stepCards = gsap.utils.toArray('.step-card');
    const lastStepCard = document.querySelector('.step-card-last');
    const stepsRight = document.querySelector('.steps-right');
    const graphContainer = document.querySelector('.graph-container');
    const stepsLeft = document.querySelector('.steps-left');

    // ✅ Sticky behavior ONLY for screens wider than 375px
    ScrollTrigger.matchMedia({
        "(min-width: 376px)": function () {
            if (graphContainer && stepsLeft && lastStepCard && stepCards.length > 0) {
                ScrollTrigger.refresh();
                
                const stickyTrigger = ScrollTrigger.create({
                    trigger: stepsRight,
                    start: () => {
                        const graphRect = graphContainer.getBoundingClientRect();
                        const stepsRightRect = stepsRight.getBoundingClientRect();
                        const offset = graphRect.bottom - window.innerHeight;
                        return `+=${Math.max(0, offset)}`;
                    },
                    end: () => {
                        const step05Rect = lastStepCard.getBoundingClientRect();
                        const stepsRightRect = stepsRight.getBoundingClientRect();
                        const step05Top = lastStepCard.offsetTop;
                        const stepsRightTop = stepsRight.offsetTop;
                        return `+=${step05Top - stepsRightTop + 200}`;
                    },
                    pin: graphContainer,
                    pinSpacing: false,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onToggle: self => {
                        if (self.isActive) {
                            console.log('Graph is now sticky');
                            graphContainer.style.zIndex = '100';
                        } else {
                            console.log('Graph is no longer sticky');
                            graphContainer.style.zIndex = '';
                        }
                    }
                });

                let isSticky = false;
                
                ScrollTrigger.create({
                    trigger: stepsSection,
                    start: 'top bottom',
                    end: 'bottom top',
                    onUpdate: self => {
                        const scrollY = window.scrollY;
                        const graphRect = graphContainer.getBoundingClientRect();
                        const stepsRightRect = stepsRight.getBoundingClientRect();
                        const lastStepRect = lastStepCard.getBoundingClientRect();
                        const stepsSectionRect = stepsSection.getBoundingClientRect();
                        
                        const withinStepsSection = (
                            stepsSectionRect.top <= window.innerHeight && 
                            stepsSectionRect.bottom >= 0
                        );
                        
                        if (!withinStepsSection && isSticky) {
                            isSticky = false;
                            gsap.set(graphContainer, {
                                position: 'relative',
                                top: 'auto',
                                left: 'auto',
                                zIndex: 'auto'
                            });
                            console.log('Removed sticky - outside steps section');
                            return;
                        }
                        
                        const shouldBeSticky = withinStepsSection && (
                            graphRect.bottom <= window.innerHeight &&
                            lastStepRect.top > window.innerHeight * 0.5 &&
                            stepsSectionRect.top <= 0
                        );
                        
                        if (shouldBeSticky && !isSticky) {
                            isSticky = true;
                            // Use CSS centering approach
                            const currentStepsRightRect = stepsRight.getBoundingClientRect();
                            
                            gsap.set(graphContainer, {
                                position: 'fixed',
                                top: window.innerHeight - 480,
                                left: currentStepsRightRect.left,
                                right: 'auto',
                                zIndex: 100,
                                width: currentStepsRightRect.width,
                                height: '480px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            });
                            
                            // Center the actual graph content
                            const graphContent = graphContainer.querySelector('*');
                            if (graphContent) {
                                gsap.set(graphContent, {
                                    width: '480px',
                                    height: '480px'
                                });
                            }
                            
                            console.log('Made sticky and centered with flexbox');
                        } else if (!shouldBeSticky && isSticky) {
                            isSticky = false;
                            gsap.set(graphContainer, {
                                position: 'relative',
                                top: 'auto',
                                left: 'auto',
                                zIndex: 'auto'
                            });
                            console.log('Removed sticky');
                        }
                    }
                });
            }
        },

        // ✅ On small screens - ensure graph is never sticky
        "(max-width: 375px)": function () {
            if (graphContainer) {
                gsap.set(graphContainer, {
                    position: 'static',
                    top: 'auto',
                    left: 'auto',
                    zIndex: 'auto',
                    width: 'auto',
                    height: 'auto'
                });
                console.log('Graph is static for mobile - no sticky behavior');
            }
        }
    });

    // Responsive version - NO sticky behavior, keep it completely normal
    const responsiveGraph = document.querySelector('#graph-responsive');
    if (responsiveGraph) {
        // Always keep responsive version static (normal flow)
        gsap.set(responsiveGraph, {
            position: 'static',
            top: 'auto',
            left: 'auto',
            zIndex: 'auto'
        });
        console.log('Responsive graph is always static - no sticky behavior');
    }

    // Step cards animation - KEEP ALL ANIMATIONS
    const allStepCards = gsap.utils.toArray('.step-card, .step-card-last');
    
    allStepCards.forEach((card, index) => {
        gsap.set(card, { 
            opacity: 0, 
            x: -50,
            y: 20
        });

        gsap.to(card, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 60%',
                once: true,
                toggleActions: "play none none none"
            }
        });

        ScrollTrigger.create({
            trigger: card,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => {
                gsap.to(card, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            },
            onLeave: () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            },
            onEnterBack: () => {
                gsap.to(card, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            },
            onLeaveBack: () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });

    // ❌ REMOVED: Graph level animations for triangle chart on PC
    // This was causing text animation issues on the triangle chart
    
    // ✅ KEEP: Only apply graph animations for responsive/mobile version
    const responsiveGraphLevels = gsap.utils.toArray('#graph-responsive img:not(:first-child)');
    
    function animateGraphLevels(levels, cards) {
        levels.forEach((level, index) => {
            if (cards[index]) {
                gsap.set(level, { 
                    opacity: 0,
                    scale: 0.8
                });

                ScrollTrigger.create({
                    trigger: cards[index],
                    start: 'top 70%',
                    onEnter: () => {
                        gsap.to(level, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.6,
                            ease: "back.out(1.7)"
                        });
                    },
                    onLeaveBack: () => {
                        gsap.to(level, {
                            opacity: 0,
                            scale: 0.8,
                            duration: 0.4,
                            ease: "power2.inOut"
                        });
                    }
                });
            }
        });
    }

    // Apply graph animations ONLY for responsive version (mobile)
    if (responsiveGraphLevels.length > 0) {
        const responsiveStepsLeft = document.querySelector('.steps-content-responsive .steps-left');
        if (responsiveStepsLeft) {
            const responsiveCards = gsap.utils.toArray('.steps-content-responsive .step-card, .steps-content-responsive .step-card-last');
            animateGraphLevels(responsiveGraphLevels, responsiveCards);
        }
    }

    // Timeline line animation - KEEP ALL ANIMATIONS
    const timelineLine = document.querySelector('.timeline-line');
    if (timelineLine) {
        gsap.set(timelineLine, { scaleY: 0, transformOrigin: 'top' });
        
        gsap.to(timelineLine, {
            scaleY: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: timelineLine,
                start: 'top 80%',
                once: true
            }
        });
    }

    // Refresh ScrollTrigger on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
}
// =====================
// REQUEST SECTION ANIMATIONS
// =====================

function initRequestAnimations() {
    const requestCards = document.querySelectorAll('.request-card');

    requestCards.forEach((card, index) => {
        const img = card.querySelector('img');
        const overlay = card.querySelector('.card-overlay');
        const textContent = card.querySelector('.card-text-content');
        const toggleButton = card.querySelector('.toggle-button');
        const toggleIcon = toggleButton?.querySelector('img');
        const title = textContent.querySelector('h4');
        const subtitle = textContent.querySelector('h5');
        const description = textContent.querySelector('p');
        
        let isExpanded = false;

         // Set initial states
        gsap.set(card, { opacity: 0, y: "+=30"});
        
        // Set initial overlay opacity to 0.3
        if (overlay) {
            gsap.set(overlay, { opacity: 0.3 });
        }
        
        // Initially hide description text completely
        if (description) {
            gsap.set(description, { 
                opacity: 0, 
                height: 0, 
                overflow: 'hidden',
                marginTop: 0,
                paddingTop: 0,
                paddingBottom: 0,
                display: 'block'
            });
        }

        // Ensure toggle button starts with plus icon
        if (toggleIcon) {
            toggleIcon.src = "images/5_348.svg"; // plus icon
        }

        // Card reveal animation (fade in)
        gsap.to(card, { 
            opacity: 1, 
             y: "-=30",
            duration: 0.8,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                
                once: true
            },
            delay: index * 0.1
        });

        // Hover animations (only on desktop)
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', () => {
                if (img && !isExpanded) {
                    gsap.to(img, { scale: 1.05, duration: 0.3 });
                }
            });

            card.addEventListener('mouseleave', () => {
                if (img) {
                    gsap.to(img, { scale: 1, duration: 0.3 });
                }
            });
        }

        // Toggle functionality
        if (toggleButton) {
            toggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (!isExpanded) {
                    // Expand: Show description content
                    isExpanded = true;
                    
                    // Change button icon to minus
                    if (toggleIcon) {
                        toggleIcon.src = "images/5_365.svg"; // minus icon
                    }
                    
                    // Show description with animation
                    if (description) {
                        // Get natural height
                        gsap.set(description, { 
                            height: 'auto',
                            opacity: 0,
                            marginTop: 0
                        });
                        const naturalHeight = description.offsetHeight;
                        
                        // Reset to collapsed state
                        gsap.set(description, { 
                            height: 0,
                            opacity: 0,
                            marginTop: 0
                        });
                        
                        // Animate to expanded state
                        gsap.to(description, { 
                            opacity: 1,
                            height: naturalHeight,
                            marginTop: 10,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }
                    
                    // Change overlay opacity to 0.9 when expanded
                    if (overlay) {
                        gsap.to(overlay, { opacity: 0.9, duration: 0.3 });
                    }
                    
                } else {
                    // Collapse: Hide description content
                    isExpanded = false;
                    
                    // Change button icon back to plus
                    if (toggleIcon) {
                        toggleIcon.src = "images/5_348.svg"; // plus icon
                    }
                    
                    // Hide description with animation
                    if (description) {
                        gsap.to(description, { 
                            opacity: 0,
                            height: 0,
                            marginTop: 0,
                            duration: 0.3,
                            ease: "power2.in"
                        });
                    }
                    
                    // Reset overlay opacity to 0.3
                    if (overlay) {
                        gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
                    }
                }
            });
        }
    });

    // Animate the section title
    const requestIntro = document.querySelector('.request-intro h3');
    if (requestIntro) {
        gsap.set(requestIntro, { opacity: 0, y: 30 });
        gsap.to(requestIntro, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: '.request-section',
                start: 'top 70%',
                once: true
            }
        });
    }
}

// =====================
// MESSAGE SECTION ANIMATIONS
// =====================

function initMessageAnimations() {
    // Auto-scrolling "Message" background text
    const messageImg = document.querySelector('.message-section img[src*="Message"]');
    if (messageImg) {
        gsap.to(messageImg, {
            x: '-100%',
            duration: 20,
            repeat: -1,
            ease: 'none'
        });
    }

    // Message content fade in
    gsap.set('.message-vertical-title, .message-body', { opacity: 0, y: 30 });

    gsap.to('.message-vertical-title, .message-body', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        scrollTrigger: {
            trigger: '.message-section',
            start: 'top 70%',
            once: true
        }
    });
}

// =====================
// GALLERY SECTION ANIMATIONS
// =====================

function initGalleryAnimations() {
    const galleryContainer = document.querySelector('.gallery-scroll-container');
    if (galleryContainer) {
        const images = Array.from(galleryContainer.querySelectorAll('img'));

        // Duplicate the images for infinite loop effect
        images.forEach(img => {
            const clone = img.cloneNode(true);
            galleryContainer.appendChild(clone);
        });

        // Calculate full scroll width after duplication
        const totalWidth = galleryContainer.scrollWidth / 2; // half because we duplicated

        // Continuous infinite scrolling
        gsap.to(galleryContainer, {
            x: -totalWidth,
            duration: 15,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % -totalWidth) // loop seamlessly
            }
        });

        // Optional: fade/scale images on section enter
        images.forEach((img, index) => {
            gsap.set(img, { opacity: 0, scale: 0.8 });

            gsap.to(img, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                scrollTrigger: {
                    trigger: '.gallery-section',
                    start: 'top 80%',
                    once: true
                },
                delay: index * 0.2
            });
        });
    }
}


// =====================
// CTA FIXED POSITION
// =====================

// =====================
// CTA FIXED POSITION
// =====================

function initFixedCTA() {
    // Create a fixed CTA element matching your simple design
    const fixedCTA = document.createElement('div');
    fixedCTA.className = 'fixed-cta';
    fixedCTA.innerHTML = `
        <div class="fixed-cta-container">
            <div class="link-bg-white1">
                <a href="#section-details" class="link-recruit1">
                    <img src="./images/ico_form.png" alt="Form Icon" />
                    <div class="recruit-text1">募集要項を見る</div>
                </a>
                <div class="link-border1"></div>
                <a href="#section-entry" class="link-entry1">
                    <img src="./images/ico_entry.png" alt="Entry Icon" />
                    <div class="entry-text1">応募する</div>
                </a>
            </div>
        </div>
    `;

    // Add comprehensive styles to match your design exactly
    const style = document.createElement('style');
    style.textContent = `
        .fixed-cta {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100%);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .fixed-cta-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .link-bg-white1 {
            position: relative;
            background: #FFFFFF;
            box-shadow: 5px 20px 40px rgba(40, 40, 40, 0.08);
            border-radius: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px 30px;
            gap: 20px;
            min-width: 400px;
            height: 70px;
        }
        
        .link-border1 {
            width: 1px;
            height: 40px;
            background: #E8E8E8;
            flex-shrink: 0;
        }
        
        .link-recruit1,
        .link-entry1 {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            text-decoration: none;
            color: #282828;
            font-family: 'Noto Sans JP', sans-serif;
            font-weight: 500;
            font-size: 16px;
            transition: all 0.3s ease;
            flex: 1;
        }
        
        .link-recruit1:hover,
        .link-entry1:hover {
            transform: scale(1.05);
            color: #8B4513;
        }
        
        .link-recruit1 img,
        .link-entry1 img {
            width: 30px;
            height: 30px;
            object-fit: contain;
        }
        
        .recruit-text1,
        .entry-text1 {
            white-space: nowrap;
            margin: 0;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .link-bg-white1 {
                min-width: 350px;
                height: 60px;
                padding: 10px 20px;
                gap: 15px;
            }
            
            .link-recruit1,
            .link-entry1 {
                font-size: 14px;
                gap: 8px;
            }
            
            .link-recruit1 img,
            .link-entry1 img {
                width: 24px;
                height: 24px;
            }
            
            .link-border1 {
                height: 30px;
            }
        }
        
        @media (max-width: 480px) {
            .link-bg-white1 {
                min-width: 300px;
                height: 55px;
                padding: 8px 15px;
                gap: 10px;
            }
            
            .link-recruit1,
            .link-entry1 {
                font-size: 12px;
                gap: 6px;
            }
            
            .link-recruit1 img,
            .link-entry1 img {
                width: 20px;
                height: 20px;
            }
            
            .link-border1 {
                height: 25px;
            }
        }
        
        /* Animation states */
        .fixed-cta.show {
            transform: translateX(-50%) translateY(0);
        }
        
        .fixed-cta.hide {
            transform: translateX(-50%) translateY(100%);
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(fixedCTA);

    // Show CTA when hero is half scrolled
    ScrollTrigger.create({
        trigger: '.header',
        start: 'bottom 50%',
        onEnter: () => {
            fixedCTA.classList.add('show');
            gsap.to(fixedCTA, {
                y: 0,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        },
        onLeaveBack: () => {
            fixedCTA.classList.remove('show');
            gsap.to(fixedCTA, {
                y: '100%',
                duration: 0.5,
                ease: "power2.in"
            });
        }
    });

    // Add click tracking for analytics if needed
    const recruitLink = fixedCTA.querySelector('.link-recruit1');
    const entryLink = fixedCTA.querySelector('.link-entry1');

    recruitLink.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: "#section-details",
                offsetY: 100
            },
            ease: "power2.out"
        });
    });

    entryLink.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: "#section-entry",
                offsetY: 100
            },
            ease: "power2.out"
        });
    });
}

// =====================
// MODAL FUNCTIONALITY
// =====================

// =====================
// MODAL FUNCTIONALITY
// =====================
function initModals() {
    const lineButton = document.querySelector('a[href*="line"], .entry-button:nth-child(2)');
    const instagramButton = document.querySelector('a[href*="instagram"], .entry-button:nth-child(3)');

    function createModal(qrImageSrc, caption) {
        const modal = document.createElement('div');
        modal.className = 'qr-modal';
        modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-box">
        <button class="modal-close"><img src="./images/close.png"/></button>
        <div class="qr-container">
          <img src="${qrImageSrc}" alt="QR Code" />
        </div>
        <p class="modal-caption">${caption}</p>
      </div>
    `;

        // ===== CSS styling to match the screenshot =====
        const style = document.createElement('style');
        style.textContent = `
      .qr-modal {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        pointer-events: none;
      }
      .qr-modal .modal-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(4px);
      }
      .qr-modal .modal-box {
        position: relative;
        background: #fff;
        padding: 30px 20px 20px;
        
        width: 29%;
        height: 60%;
        text-align: center;
        z-index: 1;
      }
      .qr-modal .modal-close img{
        position: absolute;
        top: -30px;
        right: -30px;
        font-size: 28px;
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
      }
     .qr-modal .qr-container {
    display: flex
;
    justify-content: center;
    margin-bottom: 20px;
    height: 75%;
}
     .qr-modal .qr-container img {
    margin-top: 44px;
    max-width: 62%;
    width: 96%;
    height: 78%;
    background: #f0f0f0;
}
      .qr-modal .modal-caption {
        font-size: 14px;
        color: #000;
      }
    `;
        document.head.appendChild(style);

        document.body.appendChild(modal);

        // Close functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            gsap.to(modal, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    modal.style.pointerEvents = 'none';
                }
            });
        });

        return modal;
    }

    if (window.innerWidth > 768) {
        if (lineButton) {
            const lineModal = createModal(
                'line-qr.png', // Replace with actual QR code image path
                'NORUMANを友だち登録して、ご応募ください。'
            );
            lineButton.addEventListener('click', (e) => {
                e.preventDefault();
                lineModal.style.pointerEvents = 'auto';
                gsap.to(lineModal, { opacity: 1, duration: 0.3 });
            });
        }

        if (instagramButton) {
            const igModal = createModal(
                'instagram-qr.png', // Replace with actual QR code image path
                'Instagramでフォローしてご応募ください。'
            );
            instagramButton.addEventListener('click', (e) => {
                e.preventDefault();
                igModal.style.pointerEvents = 'auto';
                gsap.to(igModal, { opacity: 1, duration: 0.3 });
            });
        }
    }
}


// =====================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// =====================

function initSmoothScrolling() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: targetElement,
                        offsetY: 100
                    },
                    ease: "power2.out"
                });
            }
        });
    });
}

// =====================
// INITIALIZATION
// =====================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all animations
    initHeroSlideshow();
    initAboutAnimations();
    initStepsAnimations();
    initRequestAnimations();
    initMessageAnimations();
    initGalleryAnimations();
    initFixedCTA();
    initModals();
    initSmoothScrolling();

    // General fade-in animations for other elements
    gsap.utils.toArray('.details-section, .entry-section').forEach(section => {
        gsap.set(section.children, { opacity: 0, y: 30 });

        gsap.to(section.children, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                once: true
            }
        });
    });
});

// =====================
// RESPONSIVE ADJUSTMENTS
// =====================

// Disable some animations on mobile for performance
if (window.innerWidth <= 768) {
    // Disable parallax on mobile
    ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars && trigger.vars.scrub) {
            trigger.kill();
        }
    });
}
