document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. HEADER SCROLL EFFECT
  // ==========================================
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // ==========================================
  // 2. MOBILE NAV DRAWER
  // ==========================================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    // Create mobile menu container if needed, or toggle class
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
      
      // Dynamic mobile navigation menu transitions
      if (isExpanded) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(3, 22, 18, 0.95)';
        navLinks.style.backdropFilter = 'blur(10px)';
        navLinks.style.padding = '2rem';
        navLinks.style.borderBottom = '1px solid rgba(0, 194, 133, 0.1)';
        navLinks.style.gap = '1.5rem';
        navLinks.style.zIndex = '99';
      } else {
        navLinks.style.display = '';
      }
    });
  }

  // ==========================================
  // 3. PROCESS STEP ROWS INTERACTIONS
  // ==========================================
  const stepRows = document.querySelectorAll('.step-row');
  
  stepRows.forEach(row => {
    // Hover event to switch active step row
    row.addEventListener('mouseenter', () => {
      if (row.classList.contains('active')) return;
      stepRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');
    });
    
    // Click event for accessibility/mobile devices
    row.addEventListener('click', () => {
      if (row.classList.contains('active')) return;
      stepRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');
    });
  });

  // ==========================================
  // 4. TESTIMONIALS DRAG TO SCROLL & AUTOPLAY (INFINITE LOOP)
  // ==========================================
  const trackContainer = document.querySelector('.testimonials-track-container');
  const track = document.querySelector('.testimonials-track');
  
  if (trackContainer && track) {
    // Clone cards to create 4 identical sets (original + 3 clones)
    const originalCards = Array.from(track.children);
    for (let i = 0; i < 3; i++) {
      originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
      });
    }

    let isDown = false;
    let isPaused = false;
    let lastX;
    let autoplaySpeed = 0.6; // Auto-scroll speed
    let autoplayInterval;

    // Helper to calculate a single set width
    const getSingleSetWidth = () => {
      return track.scrollWidth / 4;
    };

    // Set scroll position to the start of the second set
    const initScrollPosition = () => {
      const singleSetWidth = getSingleSetWidth();
      if (singleSetWidth > 0) {
        trackContainer.scrollLeft = singleSetWidth;
      }
    };

    // Initialize position after load or a short delay
    window.addEventListener('load', initScrollPosition);
    setTimeout(initScrollPosition, 100);

    // Infinite wrapping logic on scroll (keep scroll position within middle sets)
    trackContainer.addEventListener('scroll', () => {
      const singleSetWidth = getSingleSetWidth();
      if (singleSetWidth <= 0) return;

      if (trackContainer.scrollLeft >= singleSetWidth * 2) {
        trackContainer.scrollLeft -= singleSetWidth;
      } else if (trackContainer.scrollLeft <= 0) {
        trackContainer.scrollLeft += singleSetWidth;
      }
    });

    // Autoplay scroll animation loop
    const scrollStep = () => {
      if (!isDown && !isPaused) {
        trackContainer.scrollLeft += autoplaySpeed;
      }
      autoplayInterval = requestAnimationFrame(scrollStep);
    };
    autoplayInterval = requestAnimationFrame(scrollStep);

    // Pause on hover
    trackContainer.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    trackContainer.addEventListener('mouseleave', () => {
      isPaused = false;
      isDown = false;
    });

    // Mouse Drag Interactions
    trackContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      trackContainer.classList.add('active');
      lastX = e.pageX;
    });
    
    trackContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const deltaX = e.pageX - lastX;
      lastX = e.pageX;
      trackContainer.scrollLeft -= deltaX * 1.2;
    });
    
    trackContainer.addEventListener('mouseup', () => {
      isDown = false;
      trackContainer.classList.remove('active');
    });

    // Touch Swipe Interactions
    trackContainer.addEventListener('touchstart', (e) => {
      isDown = true;
      lastX = e.touches[0].pageX;
    });
    
    trackContainer.addEventListener('touchend', () => {
      isDown = false;
    });
    
    trackContainer.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const deltaX = e.touches[0].pageX - lastX;
      lastX = e.touches[0].pageX;
      trackContainer.scrollLeft -= deltaX * 1.2;
    });
  }

  // ==========================================
  // 5. CONTACT FORM INTERACTIVE SUCCESS
  // ==========================================
  const contactForm = document.getElementById('consultation-form');
  const formCard = document.querySelector('.contact-form-card');
  
  if (contactForm && formCard) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation checking
      const name = document.getElementById('full-name').value.trim();
      const email = document.getElementById('email-address').value.trim();
      
      if (!name || !email) {
        alert('Please fill out the required fields.');
        return;
      }
      
      // Show smooth sending state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending message...';
      
      setTimeout(() => {
        // Form success animation replacing content
        formCard.style.opacity = '0';
        formCard.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          formCard.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
              <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(0, 194, 133, 0.1); border: 2px solid var(--primary); display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 2.2rem; margin-bottom: 0.5rem; animation: pulse 2s infinite;">
                ✓
              </div>
              <h3 style="font-size: 1.8rem; font-weight: 700; color: var(--text-light);">Message Sent!</h3>
              <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; max-width: 320px;">
                Thank you, <strong>${name}</strong>. We have received your message and will get back to you within 24 hours.
              </p>
              <button class="btn btn-primary" onclick="window.location.reload()" style="margin-top: 1rem;">
                Send Another Message
              </button>
            </div>
          `;
          formCard.style.opacity = '1';
          formCard.style.transform = 'scale(1)';
        }, 300);
        
      }, 1500);
    });
  }

  // ==========================================
  // 6. PORTFOLIO CAROUSEL DOUBLE AUTO-SCROLL (LEFT & RIGHT)
  // ==========================================
  const leftContainer = document.querySelector('.track-left-container');
  const leftTrack = document.querySelector('.track-left');
  const rightContainer = document.querySelector('.track-right-container');
  const rightTrack = document.querySelector('.track-right');
  
  const setupInfiniteCarousel = (container, track, direction) => {
    if (!container || !track) return;
    
    // Clone cards to create 4 sets (original + 3 clones)
    const originalCards = Array.from(track.children);
    for (let i = 0; i < 3; i++) {
      originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
      });
    }
    
    const getSingleSetWidth = () => {
      return track.scrollWidth / 4;
    };
    
    const initScroll = () => {
      const singleSetWidth = getSingleSetWidth();
      if (singleSetWidth > 0) {
        if (direction === 'left') {
          container.scrollLeft = singleSetWidth;
        } else {
          container.scrollLeft = singleSetWidth * 2;
        }
      }
    };
    
    window.addEventListener('load', initScroll);
    setTimeout(initScroll, 100);
    
    // Wrapping logic on manual or auto scroll
    container.addEventListener('scroll', () => {
      const singleSetWidth = getSingleSetWidth();
      if (singleSetWidth <= 0) return;
      
      if (direction === 'left') {
        if (container.scrollLeft >= singleSetWidth * 2) {
          container.scrollLeft -= singleSetWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += singleSetWidth;
        }
      } else {
        if (container.scrollLeft <= singleSetWidth) {
          container.scrollLeft += singleSetWidth;
        } else if (container.scrollLeft >= singleSetWidth * 3) {
          container.scrollLeft -= singleSetWidth;
        }
      }
    });
    
    let isDown = false;
    let isPaused = false;
    let lastX;
    let speed = 0.6; // Scroll speed
    
    const scrollStep = () => {
      if (!isDown && !isPaused) {
        if (direction === 'left') {
          container.scrollLeft += speed;
        } else {
          container.scrollLeft -= speed;
        }
      }
      requestAnimationFrame(scrollStep);
    };
    requestAnimationFrame(scrollStep);
    
    // Pause on hover
    container.addEventListener('mouseenter', () => { isPaused = true; });
    container.addEventListener('mouseleave', () => { isPaused = false; isDown = false; });
    
    // Drag/Touch Interactions
    container.addEventListener('mousedown', (e) => {
      isDown = true;
      lastX = e.pageX;
    });
    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const deltaX = e.pageX - lastX;
      lastX = e.pageX;
      container.scrollLeft -= deltaX * 1.2;
    });
    container.addEventListener('mouseup', () => { isDown = false; });
    
    container.addEventListener('touchstart', (e) => {
      isDown = true;
      lastX = e.touches[0].pageX;
    });
    container.addEventListener('touchend', () => { isDown = false; });
    container.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const deltaX = e.touches[0].pageX - lastX;
      lastX = e.touches[0].pageX;
      container.scrollLeft -= deltaX * 1.2;
    });
  };
  
  setupInfiniteCarousel(leftContainer, leftTrack, 'left');
  setupInfiniteCarousel(rightContainer, rightTrack, 'right');
});
