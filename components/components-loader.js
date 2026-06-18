
async function loadComponent(placeholderId, filePath) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load ${filePath}`);
    let html = await response.text();
    
    // Strip live-server script if it was injected into the fragment
    html = html.replace(/<!-- Code injected by live-server -->[\s\S]*?<\/script>/g, '');
    
    placeholder.outerHTML = html;
  } catch (error) {
    console.error('Component load error:', error);
  }
}

async function initComponents() {
  // Header ও Footer load করো
  await loadComponent('header-placeholder', 'components/header.html');

  // Check if current page is contact.html
  const isContactPage = window.location.pathname.toLowerCase().endsWith('contact.html') || window.location.pathname.toLowerCase().includes('/contact');
  if (!isContactPage) {
    await loadComponent('cta-placeholder', 'components/cta.html');
    if (typeof window.initContactForm === 'function') {
      window.initContactForm();
    }
  }

  await loadComponent('footer-placeholder', 'components/footer.html');

  // Header load হওয়ার পর burger menu re-initialize করো
  initBurgerMenu();

  // Scroll background class handle করো
  initHeaderScroll();

  // Active nav link set করো
  setActiveNavLink();
}

function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
}

function initBurgerMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');
    navToggle.setAttribute('aria-expanded', isExpanded);
  });

  // Nav link click করলে menu বন্ধ হবে
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setActiveNavLink() {
  const currentHash = window.location.hash;
  const fullPathname = window.location.pathname.split('/').pop() || 'index.html';
  
  const allLinks = document.querySelectorAll('.nav-links a, .footer-links a');
  
  allLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    
    if (!href) return;
    
    // Match logic:
    // 1. If we have a hash, match exact href (e.g. #services or index.html#services)
    // 2. If no hash, match the page filename (e.g. residential.html)
    // 3. Handle index.html cases
    if (currentHash && (href === currentHash || href.endsWith(currentHash))) {
      link.classList.add('active');
    } else if (!currentHash) {
      if (href === fullPathname || (fullPathname === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    }
  });
}

// Update active links when hash changes (on click)
window.addEventListener('hashchange', setActiveNavLink);

// ScrollSpy: Update active links on scroll
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const options = {
    threshold: 0.3,
    rootMargin: "-20% 0px -70% 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const allLinks = document.querySelectorAll('.nav-links a, .footer-links a');
        
        allLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href === `#${id}` || href === `index.html#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, options);

  sections.forEach(section => observer.observe(section));
}

// DOM ready হলে components load করো
document.addEventListener('DOMContentLoaded', async () => {
  await initComponents();
  initScrollSpy();
});
