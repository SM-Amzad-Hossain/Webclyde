document.addEventListener('DOMContentLoaded', () => {


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
  window.initContactForm = function() {
    const contactForm = document.getElementById('consultation-form');
    const formCard = document.querySelector('.contact-form-card');

    if (contactForm && formCard) {
      if (contactForm.dataset.initialized) return;
      contactForm.dataset.initialized = 'true';

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
  };

  // Run on page load if the form is statically present
  window.initContactForm();

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

  // ==========================================
  // About Gallery Step-by-step Carousel (Timed movement)
  // ==========================================
  const aboutContainer = document.querySelector('.about-carousel-container');
  const aboutTrack = document.querySelector('.about-carousel-track');
  
  if (aboutContainer && aboutTrack) {
    // Clone cards to create 5 sets (original + 4 clones)
    const originalCards = Array.from(aboutTrack.children);
    for (let i = 0; i < 4; i++) {
      originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        aboutTrack.appendChild(clone);
      });
    }

    const cardWidth = 240; // width of card
    const gap = 16; // 1rem gap
    const step = cardWidth + gap;
    const singleSetWidth = originalCards.length * step;

    // Calculate and update which card is currently active (centered in the viewport)
    const updateActiveCard = () => {
      const containerCenter = aboutContainer.scrollLeft + aboutContainer.clientWidth / 2;
      const cards = Array.from(aboutTrack.children);
      
      let closestCard = null;
      let minDistance = Infinity;
      
      cards.forEach((card, index) => {
        const cardCenter = (index * step) + (cardWidth / 2);
        const distance = Math.abs(cardCenter - containerCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestCard = card;
        }
      });
      
      if (closestCard) {
        cards.forEach(c => c.classList.remove('active-slide'));
        closestCard.classList.add('active-slide');
        
        // Find if this card is even or odd based on its class
        const isEven = closestCard.classList.contains('even');
        
        if (isEven) {
          aboutContainer.classList.add('even-active');
          aboutContainer.classList.remove('odd-active');
        } else {
          aboutContainer.classList.add('odd-active');
          aboutContainer.classList.remove('even-active');
        }
      }
    };

    // Set scroll position to the start of the third set (middle)
    const initScroll = () => {
      aboutContainer.scrollLeft = singleSetWidth * 2;
      updateActiveCard();
    };
    window.addEventListener('load', initScroll);
    setTimeout(initScroll, 100);

    let isDown = false;
    let isPaused = false;
    let lastX;
    let startScrollLeft;
    let animationFrameId = null;
    let isAnimating = false;

    // Custom smooth scroll function
    const smoothScrollTo = (targetLeft, duration, callback) => {
      isAnimating = true;
      const startLeft = aboutContainer.scrollLeft;
      const change = targetLeft - startLeft;
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: easeOutQuad
        const ease = progress * (2 - progress);
        aboutContainer.scrollLeft = startLeft + change * ease;
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          isAnimating = false;
          if (callback) callback();
        }
      };
      
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(animate);
    };

    const snapToNearest = () => {
      const currentScroll = aboutContainer.scrollLeft;
      const nearestIndex = Math.round(currentScroll / step);
      const targetScroll = nearestIndex * step;
      
      smoothScrollTo(targetScroll, 300, () => {
        warpCheck();
      });
    };

    const warpCheck = () => {
      if (aboutContainer.scrollLeft >= singleSetWidth * 3) {
        aboutContainer.scrollLeft -= singleSetWidth;
      } else if (aboutContainer.scrollLeft <= singleSetWidth) {
        aboutContainer.scrollLeft += singleSetWidth;
      }
      updateActiveCard();
    };

    // Mouse Drag/Touch Swipe
    aboutContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      lastX = e.pageX;
      startScrollLeft = aboutContainer.scrollLeft;
      aboutContainer.classList.add('active');
    });

    aboutContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const deltaX = e.pageX - lastX;
      aboutContainer.scrollLeft = startScrollLeft - deltaX;
    });

    const handleRelease = () => {
      if (!isDown) return;
      isDown = false;
      aboutContainer.classList.remove('active');
      snapToNearest();
    };

    aboutContainer.addEventListener('mouseup', handleRelease);
    aboutContainer.addEventListener('mouseleave', handleRelease);

    aboutContainer.addEventListener('touchstart', (e) => {
      isDown = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      lastX = e.touches[0].pageX;
      startScrollLeft = aboutContainer.scrollLeft;
    });

    aboutContainer.addEventListener('touchend', handleRelease);

    aboutContainer.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const deltaX = e.touches[0].pageX - lastX;
      aboutContainer.scrollLeft = startScrollLeft - deltaX;
    });

    // Hover Pause
    aboutContainer.addEventListener('mouseenter', () => { isPaused = true; });
    aboutContainer.addEventListener('mouseleave', () => { isPaused = false; });

    // Step auto-slide
    const stepSlide = () => {
      if (!isDown && !isPaused) {
        const targetScroll = aboutContainer.scrollLeft + step;
        smoothScrollTo(targetScroll, 600, () => {
          warpCheck();
        });
      }
    };

    let slideInterval = setInterval(stepSlide, 3000); // Step every 3 seconds

    // Track active card and warp during scroll events (e.g. manual drag/swipe)
    aboutContainer.addEventListener('scroll', () => {
      updateActiveCard();
      if (!isAnimating) {
        if (aboutContainer.scrollLeft >= singleSetWidth * 3) {
          aboutContainer.scrollLeft -= singleSetWidth;
        } else if (aboutContainer.scrollLeft <= singleSetWidth) {
          aboutContainer.scrollLeft += singleSetWidth;
        }
      }
    });
  }

  // ==========================================
  // 7. HERO MOCKUPS PARALLAX SCROLL EFFECT (SMOOTH LERP)
  // ==========================================
  const mockupLeft = document.querySelector('.hero-mockup-left');
  const mockupRight = document.querySelector('.hero-mockup-right');

  if (mockupLeft || mockupRight) {
    let currentY = 0;
    let targetY = 0;
    const ease = 0.08; // Butter smooth damping factor

    window.addEventListener('scroll', () => {
      if (window.innerWidth > 1200) {
        targetY = window.scrollY;
      }
    }, { passive: true });

    const smoothParallax = () => {
      if (window.innerWidth > 1200) {
        currentY += (targetY - currentY) * ease;

        if (mockupLeft) {
          mockupLeft.style.transform = `translateY(calc(-50% + ${currentY * 0.25}px))`;
        }
        if (mockupRight) {
          mockupRight.style.transform = `translateY(calc(-50% + ${currentY * 0.25}px))`;
        }
      }
      requestAnimationFrame(smoothParallax);
    };

    smoothParallax();
  }

  // ==========================================
  // 8. FAQ ACCORDION INTERACTION
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Remove active class from all items
        faqItems.forEach(i => i.classList.remove('active'));
        
        // Toggle active class on current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ==========================================
  // 9. BLOG CATEGORIES & SEARCH FILTER
  // ==========================================
  const filterButtons = document.querySelectorAll('.categories-filter-row .filter-btn');
  const blogCards = document.querySelectorAll('.blog-grid .blog-card');
  const searchWrap = document.querySelector('.filter-search-wrap');
  const searchInput = document.querySelector('.filter-search-input');
  const searchBtn = document.querySelector('.filter-search-btn');

  if (blogCards.length > 0) {
    let activeCategory = 'all';
    let searchQuery = '';

    // Function to apply both filters
    const applyFilters = () => {
      blogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardTitle = card.querySelector('h3').textContent.toLowerCase();
        const cardDesc = card.querySelector('p').textContent.toLowerCase();

        const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
        const matchesSearch = (searchQuery === '' || cardTitle.includes(searchQuery) || cardDesc.includes(searchQuery));

        if (matchesCategory && matchesSearch) {
          // Fade in
          if (card.style.display !== 'flex') {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            card.offsetHeight; // force reflow
          }
          card.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          // Fade out
          card.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          
          const onTransitionEnd = () => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
            card.removeEventListener('transitionend', onTransitionEnd);
          };
          card.addEventListener('transitionend', onTransitionEnd);
        }
      });
    };

    // Category button click listener
    if (filterButtons.length > 0) {
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          activeCategory = button.getAttribute('data-filter');
          applyFilters();
        });
      });
    }

    // Search Toggle listener
    if (searchWrap && searchBtn && searchInput) {
      searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCurrentlyActive = searchWrap.classList.contains('active');
        
        if (!isCurrentlyActive) {
          searchWrap.classList.add('active');
          searchInput.focus();
        } else if (searchInput.value.trim() === '') {
          searchWrap.classList.remove('active');
          searchQuery = '';
          applyFilters();
        } else {
          // If search button is clicked with text, perform search and blur
          searchQuery = searchInput.value.trim().toLowerCase();
          applyFilters();
          searchInput.blur();
        }
      });

      // Close search input if clicked outside
      document.addEventListener('click', (e) => {
        if (!searchWrap.contains(e.target) && searchInput.value.trim() === '') {
          searchWrap.classList.remove('active');
        }
      });

      // Search typing input listener
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.trim().toLowerCase();
        applyFilters();
      });

      // Search Enter key listener
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          searchQuery = searchInput.value.trim().toLowerCase();
          applyFilters();
          searchInput.blur();
        }
      });

      // Prevent closing when clicking input
      searchInput.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }
});
