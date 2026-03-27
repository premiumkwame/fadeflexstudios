/* =============================================
   FADE FLEX STUDIOS — script.js
   Theme (no-flash), Hamburger, Image fallbacks
   ============================================= */

/* ---- THEME ----
   The <script> block in <head> already sets data-theme before paint.
   Here we handle the toggle button + OS preference changes.
------------------------------------------------------------ */

const html = document.documentElement;

// Set icon based on current theme
function updateToggleIcon() {
  const icon = document.querySelector('.toggle-icon');
  if (!icon) return;
  icon.textContent = html.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
}

// Apply theme and persist
function applyTheme(theme, persist) {
  html.setAttribute('data-theme', theme);
  if (persist) localStorage.setItem('ffs-theme', theme);
  updateToggleIcon();
}

// Theme toggle button
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    // Once user manually toggles, lock their preference
    applyTheme(next, true);
  });
}

// Listen for OS-level dark/light changes (only if user hasn't manually chosen)
const mq = window.matchMedia('(prefers-color-scheme: dark)');
mq.addEventListener('change', (e) => {
  // Only follow OS if user never manually set a preference
  if (!localStorage.getItem('ffs-theme')) {
    applyTheme(e.matches ? 'dark' : 'light', false);
  }
});

// Init icon on load
updateToggleIcon();

// Allow CSS transitions after first paint (prevents flash on load/back-nav)
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.classList.add('theme-ready');
  });
});

/* ---- HAMBURGER DRAWER ---- */
const hamburger     = document.getElementById('hamburger');
const mobileDrawer  = document.getElementById('mobileDrawer');
const mobileOverlay = document.getElementById('mobileOverlay');
const drawerClose   = document.getElementById('drawerClose');

function openDrawer() {
  if (!mobileDrawer) return;
  mobileDrawer.classList.add('open');
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  if (!mobileDrawer) return;
  mobileDrawer.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger)     hamburger.addEventListener('click', openDrawer);
if (drawerClose)   drawerClose.addEventListener('click', closeDrawer);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

/* ---- NAVBAR SHADOW ON SCROLL ---- */
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  navbar.style.boxShadow = window.scrollY > 30
    ? '0 4px 28px rgba(0,0,0,0.35)'
    : 'none';
}, { passive: true });

/* ---- IMAGE FALLBACKS ---- */

// Hero image
const heroImg  = document.getElementById('heroImg');
const heroCard = document.getElementById('heroImgCard');
if (heroImg && heroCard) {
  function checkHeroImg() {
    if (!heroImg.naturalWidth || heroImg.naturalWidth === 0) {
      heroCard.classList.add('img-error');
    } else {
      heroCard.classList.remove('img-error');
    }
  }
  heroImg.addEventListener('error',  () => heroCard.classList.add('img-error'));
  heroImg.addEventListener('load',   () => heroCard.classList.remove('img-error'));
  if (heroImg.complete) checkHeroImg();
}

// Owner image (about section)
const ownerImg  = document.getElementById('ownerImg');
const ownerWrap = ownerImg?.closest('.about-img-wrap');
if (ownerImg && ownerWrap) {
  function checkOwnerImg() {
    if (!ownerImg.naturalWidth || ownerImg.naturalWidth === 0) {
      ownerWrap.classList.add('img-error');
    } else {
      ownerWrap.classList.remove('img-error');
    }
  }
  ownerImg.addEventListener('error', () => ownerWrap.classList.add('img-error'));
  ownerImg.addEventListener('load',  () => ownerWrap.classList.remove('img-error'));
  if (ownerImg.complete) checkOwnerImg();
}