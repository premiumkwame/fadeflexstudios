/* =============================================
   FADE FLEX STUDIOS — product.js
   Services · Image Crossfade · Calendar · Booking
   ============================================= */

/* ============================================================
   SERVICES
   Add yours here. gender: 'male' | 'female' | 'both'
   img: relative path to image file e.g. images/fade.jpg
   ============================================================ */
const SERVICES = [
  { id: 'fade',   name: 'Fade Cut',    price: 'GH₵ 80',  gender: 'male',   img: 'images/fade.jpg'  },
  { id: 'lineup', name: 'Line Up',     price: 'GH₵ 50',  gender: 'male',   img: 'images/lineup.jpg' },
  { id: 'waves',  name: '360 Waves',   price: 'GH₵ 100', gender: 'male',   img: 'images/waves.jpg'  },
  { id: 'beard',  name: 'Beard Trim',  price: 'GH₵ 70',  gender: 'male',   img: 'images/beard.jpg'  },
  { id: 'shave',  name: 'Clean Shave', price: 'GH₵ 60',  gender: 'male',   img: 'images/shave.jpg'  },
  { id: 'pixie',  name: 'Pixie Cut',   price: 'GH₵ 60',  gender: 'female', img: 'images/pixie.jpg'  },                                    
  { id: 'braids', name: 'Braids',      price: 'GH₵ 150', gender: 'female', img: 'images/braids.jpg' },
  { id: 'rows',   name: 'Corn Rows',   price: 'GH₵ 30',  gender: 'female', img:  'images/cornrows.jpg'},
  { id: 'dye',    name: 'Hair Dye',    price: 'GH₵ 40', gender: 'female',   img: 'images/dyef.jpg'},
  { id: 'dye',    name: 'Men\'s Hair Dye', price: 'GH₵ 30', gender: 'male', img: 'images/dyem.jpg'},
  { id: 'loc',    name: 'Dreadlocks',  price: 'GH₵ 250', gender: 'male',   img: 'images/locks.jpg'  },
];

/* ============================================================
   OWNER CONFIG — change OWNER_EMAIL to your Gmail
   ============================================================ */
const OWNER_EMAIL           = 'kransly007@gmail.com';
const SHOP_NAME             = 'Fade Flex Studios';
const SHOP_LOCATION         = 'Accra, Ghana';
const BOOKING_DURATION_MINS = 60;

/* ============================================================
   STATE
   ============================================================ */
let selectedService = null;
let selectedDate    = null;
let selectedTime    = null;
let currentGender   = 'male';
let calYear, calMonth;

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  calYear  = now.getFullYear();
  calMonth = now.getMonth();

  setupGenderToggles();
  renderServiceBubbles();
  loadDefaultImage();
  renderCalendar('calendarCard');
  updateSummary();

  // Always show mobile calendar trigger — first service is shown by default
  const trigger = document.getElementById('calMobileTrigger');
  if (trigger) trigger.style.display = 'block';
});

/* ============================================================
   GENDER TOGGLES
   Two sets: desktop fixed bubble (#btnMale/#btnFemale)
             mobile inline (#btnMaleMobile/#btnFemaleMobile)
   ============================================================ */
function setupGenderToggles() {
  // Desktop bubble
  document.getElementById('btnMale')?.addEventListener('click',   () => setGender('male'));
  document.getElementById('btnFemale')?.addEventListener('click', () => setGender('female'));
  // Mobile inline
  document.getElementById('btnMaleMobile')?.addEventListener('click',   () => setGender('male'));
  document.getElementById('btnFemaleMobile')?.addEventListener('click', () => setGender('female'));
}

function setGender(gender) {
  currentGender = gender;

  // Sync all four buttons
  ['btnMale','btnMaleMobile'].forEach(id => {
    document.getElementById(id)?.classList.toggle('active', gender === 'male');
  });
  ['btnFemale','btnFemaleMobile'].forEach(id => {
    document.getElementById(id)?.classList.toggle('active', gender === 'female');
  });

  // Deselect service if it no longer fits this gender
  if (selectedService &&
      selectedService.gender !== 'both' &&
      selectedService.gender !== gender) {
    selectedService = null;
    updateSummary();
  }

  renderServiceBubbles();
  loadDefaultImage();
}

function getFiltered() {
  return SERVICES.filter(s => s.gender === currentGender || s.gender === 'both');
}

/* ============================================================
   DEFAULT IMAGE — show first service image for current gender
   ============================================================ */
function loadDefaultImage() {
  const first = getFiltered()[0];
  if (!first) return;

  const img         = document.getElementById('serviceImg');
  const placeholder = document.getElementById('serviceImgPlaceholder');
  const label       = document.getElementById('serviceImgLabel');
  if (!img) return;

  img.classList.remove('visible');

  img.onload = () => {
    img.classList.add('visible');
    if (placeholder) placeholder.classList.add('hidden');
    if (label) {
      label.textContent = `${first.name} — ${first.price}`;
      label.classList.add('visible');
    }
  };
  img.onerror = () => {
    if (placeholder) {
      placeholder.textContent = `${first.name} — place image at: ${first.img}`;
      placeholder.classList.remove('hidden');
    }
    if (label) {
      label.textContent = `${first.name} — ${first.price}`;
      label.classList.add('visible');
    }
  };
  img.src = first.img;
  img.alt = first.name;

  // Always set label even if image cached/instant
  if (label) {
    label.textContent = `${first.name} — ${first.price}`;
    label.classList.add('visible');
  }
}

/* ============================================================
   SERVICE BUBBLES
   ============================================================ */
function renderServiceBubbles() {
  const container = document.getElementById('serviceBubbles');
  if (!container) return;

  container.innerHTML = getFiltered().map(s => `
    <button
      class="service-bubble${selectedService?.id === s.id ? ' active' : ''}"
      data-id="${s.id}"
      onclick="selectService('${s.id}')">
      <span>${s.name}</span>
      <span class="service-price">${s.price}</span>
    </button>
  `).join('');
}

function selectService(id) {
  const found = SERVICES.find(s => s.id === id);
  // Cannot deselect by tapping the same one
  if (!found || selectedService?.id === id) return;

  selectedService = found;

  // Update bubble states
  document.querySelectorAll('.service-bubble').forEach(b => {
    b.classList.toggle('active', b.dataset.id === id);
  });

  // Crossfade image
  crossfadeToImage(found);

  // Show mobile calendar trigger
  const trigger = document.getElementById('calMobileTrigger');
  if (trigger) trigger.style.display = 'block';

  updateSummary();
  refreshCalendars();

  // On mobile: scroll to the service image card
  if (window.innerWidth <= 960) {
    const card = document.getElementById('serviceImgCard');
    if (card) {
      const offset = card.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }
}

/* ============================================================
   BUTTERY IMAGE CROSSFADE
   Uses a generation counter so rapid taps never glitch back
   ============================================================ */
let _crossfadeGen = 0; // increments on every call — stale timeouts check this

function crossfadeToImage(service) {
  const imgA    = document.getElementById('serviceImg');
  const imgB    = document.getElementById('serviceImgNext');
  const shimmer = document.getElementById('serviceImgShimmer');
  const ph      = document.getElementById('serviceImgPlaceholder');
  const label   = document.getElementById('serviceImgLabel');
  if (!imgA || !imgB) return;

  // Bump generation — any in-flight timeout from a previous call will see a
  // stale gen and bail out, preventing the "snap back" glitch
  const myGen = ++_crossfadeGen;

  if (shimmer) shimmer.classList.add('loading');

  const preload = new Image();

  preload.onload = () => {
    // If another crossfade started while this one was loading, abort
    if (myGen !== _crossfadeGen) return;

    if (shimmer) shimmer.classList.remove('loading');
    if (ph) ph.classList.add('hidden');

    // Bring next image in behind current
    imgB.src = service.img;
    imgB.alt = service.name;
    imgB.classList.add('visible');

    // Fade out current
    imgA.classList.remove('visible');

    // After transition settle, promote imgB → imgA
    setTimeout(() => {
      // Guard: abort if superseded
      if (myGen !== _crossfadeGen) return;
      imgA.src = service.img;
      imgA.alt = service.name;
      imgA.classList.add('visible');
      imgB.classList.remove('visible');
      imgB.src = '';
    }, 580);

    // Update label with slight delay
    if (label) {
      label.classList.remove('visible');
      setTimeout(() => {
        if (myGen !== _crossfadeGen) return;
        label.textContent = `${service.name} — ${service.price}`;
        label.classList.add('visible');
      }, 220);
    }
  };

  preload.onerror = () => {
    if (myGen !== _crossfadeGen) return;
    if (shimmer) shimmer.classList.remove('loading');
    if (ph) {
      ph.textContent = `${service.name} — place image at: ${service.img}`;
      ph.classList.remove('hidden');
    }
    imgA.classList.remove('visible');
    // Still show label even when image is missing
    if (label) {
      label.textContent = `${service.name} — ${service.price}`;
      label.classList.add('visible');
    }
  };

  preload.src = service.img;
}

/* ============================================================
   CALENDAR — builds HTML injected into any container
   ============================================================ */
function buildCalendarHTML() {
  const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  const today = new Date();
  today.setHours(0,0,0,0);

  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  let cells = '';
  for (let i = 0; i < firstDay; i++) {
    cells += `<div class="cal-day empty"></div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(calYear, calMonth, d);
    thisDate.setHours(0,0,0,0);
    let cls = 'cal-day';
    if (thisDate < today) {
      cls += ' past';
    } else {
      if (thisDate.getTime() === today.getTime()) cls += ' today';
      if (selectedDate &&
          selectedDate.getDate()     === d &&
          selectedDate.getMonth()    === calMonth &&
          selectedDate.getFullYear() === calYear) {
        cls += ' selected';
      }
    }
    const click = thisDate >= today ? `onclick="selectDay(${d})"` : '';
    cells += `<div class="${cls}" ${click}>${d}</div>`;
  }

  const times = [
    '9:00 AM','10:00 AM','11:00 AM','12:00 PM',
    '2:00 PM','3:00 PM','4:00 PM','5:00 PM'
  ];

  return `
    <div class="calendar-header-bar">
      <h3 class="cal-title">&#128197; Book Your Date</h3>
      <p class="cal-sub">Slots confirmed via Google Calendar</p>
    </div>
    <div class="cal-nav">
      <button class="cal-nav-btn" onclick="shiftMonth(-1)">&#8592;</button>
      <span class="cal-month-label">${MONTHS[calMonth]} ${calYear}</span>
      <button class="cal-nav-btn" onclick="shiftMonth(1)">&#8594;</button>
    </div>
    <div class="cal-days-header">
      <span>Su</span><span>Mo</span><span>Tu</span>
      <span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
    </div>
    <div class="cal-grid">${cells}</div>
    <div class="time-slots-section">
      <h4 class="time-slots-title">Available Times</h4>
      <div class="time-slots">
        ${times.map(t => `
          <button class="time-slot${selectedTime === t ? ' active' : ''}"
                  onclick="selectTime('${t}')">${t}</button>
        `).join('')}
      </div>
    </div>
    <div class="booking-form-section">
      <h4 class="form-title">Your Details</h4>
      <div class="booking-form">
        <input type="text"  class="form-input" id="clientName"  placeholder="Full Name"     value="${window._name  || ''}" oninput="window._name=this.value"/>
        <input type="tel"   class="form-input" id="clientPhone" placeholder="Phone Number"  value="${window._phone || ''}" oninput="window._phone=this.value"/>
        <input type="email" class="form-input" id="clientEmail" placeholder="Email Address" value="${window._email || ''}" oninput="window._email=this.value"/>
        <div class="booking-summary" id="bookingSummary"></div>
        <button class="btn-primary btn-book" onclick="submitBooking()">
          Confirm &amp; Add to Calendar
        </button>
        <p class="booking-note">
          Opens Google Calendar — the owner is automatically invited.
        </p>
      </div>
    </div>
  `;
}

function renderCalendar(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = buildCalendarHTML();
  updateSummary();
}

function refreshCalendars() {
  renderCalendar('calendarCard');
  renderCalendar('calPopupContent');
}

function shiftMonth(dir) {
  calMonth += dir;
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  if (calMonth > 11) { calMonth = 0;  calYear++; }
  refreshCalendars();
}

function selectDay(d) {
  selectedDate = new Date(calYear, calMonth, d);
  refreshCalendars();
}

function selectTime(t) {
  selectedTime = t;
  refreshCalendars();
}

/* ============================================================
   CALENDAR POPUP (mobile)
   ============================================================ */
function openCalPopup() {
  renderCalendar('calPopupContent');
  document.getElementById('calOverlay')?.classList.add('open');
  const popup = document.getElementById('calPopup');
  if (popup) popup.classList.add('open');
  document.body.style.overflow = 'hidden';
  initSwipeToClose(popup);
}

function closeCalPopup() {
  document.getElementById('calOverlay')?.classList.remove('open');
  document.getElementById('calPopup')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* Swipe-down to close — mobile bottom sheet */
function initSwipeToClose(popup) {
  if (!popup) return;
  // Avoid attaching multiple listeners
  if (popup._swipeInit) return;
  popup._swipeInit = true;

  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  popup.addEventListener('touchstart', (e) => {
    // Only trigger if scrolled to top of popup content
    if (popup.scrollTop > 0) return;
    startY = e.touches[0].clientY;
    isDragging = true;
    popup.style.transition = 'none';
  }, { passive: true });

  popup.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    if (deltaY > 0) {
      popup.style.transform = `translateY(${deltaY}px)`;
    }
  }, { passive: true });

  popup.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    popup.style.transition = '';
    const deltaY = currentY - startY;
    if (deltaY > 100) {
      popup.style.transform = '';
      closeCalPopup();
    } else {
      popup.style.transform = '';
    }
  });
}

/* ============================================================
   BOOKING SUMMARY
   ============================================================ */
function updateSummary() {
  const svc  = selectedService
    ? `<strong>${selectedService.name}</strong> — ${selectedService.price}`
    : '—';
  const date = selectedDate
    ? `<strong>${selectedDate.toDateString()}</strong>`
    : '—';
  const time = selectedTime
    ? `<strong>${selectedTime}</strong>`
    : '—';
  const html = `Service: ${svc}<br/>Date: ${date}<br/>Time: ${time}`;
  document.querySelectorAll('#bookingSummary').forEach(el => {
    el.innerHTML = html;
  });
}

/* ============================================================
   GOOGLE CALENDAR BOOKING
   ============================================================ */
function submitBooking() {
  const name  = (window._name  || document.getElementById('clientName')?.value  || '').trim();
  const phone = (window._phone || document.getElementById('clientPhone')?.value || '').trim();
  const email = (window._email || document.getElementById('clientEmail')?.value || '').trim();

  if (!name)            return alert('Please enter your name.');
  if (!phone)           return alert('Please enter your phone number.');
  if (!selectedService) return alert('Please select a service.');
  if (!selectedDate)    return alert('Please select a date.');
  if (!selectedTime)    return alert('Please select a time slot.');

  const [timePart, period] = selectedTime.split(' ');
  let [h, m] = timePart.split(':').map(Number);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h  = 0;

  const start = new Date(selectedDate);
  start.setHours(h, m, 0, 0);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + BOOKING_DURATION_MINS);

  const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0];

  const url = [
    'https://calendar.google.com/calendar/render?action=TEMPLATE',
    `&text=${encodeURIComponent(`${SHOP_NAME} — ${selectedService.name} (${name})`)}`,
    `&dates=${fmt(start)}/${fmt(end)}`,
    `&details=${encodeURIComponent(
      `Client: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\n` +
      `Service: ${selectedService.name} ${selectedService.price}\nGender: ${currentGender}`
    )}`,
    `&location=${encodeURIComponent(`${SHOP_NAME}, ${SHOP_LOCATION}`)}`,
    `&add=${encodeURIComponent(OWNER_EMAIL)}`,
  ].join('');

  window.open(url, '_blank');
}