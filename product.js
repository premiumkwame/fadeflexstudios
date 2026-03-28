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
  { id: 'rows',   name: 'Corn Rows',   price: 'GH₵ 30',  gender: 'female', img: 'images/cornrows.jpg'},
  { id: 'dyef',   name: 'Hair Dye',        price: 'GH₵ 40', gender: 'female', img: 'images/dyef.jpg'},
  { id: 'dyem',   name: "Men's Hair Dye",  price: 'GH₵ 30', gender: 'male',   img: 'images/dyem.jpg'},
  { id: 'loc',    name: 'Dreadlocks',  price: 'GH₵ 250', gender: 'male',   img: 'images/locks.jpg'  },
];

/* ============================================================
   OWNER CONFIG
   ============================================================ */
const OWNER_EMAIL           = 'kransly007@gmail.com';
const SHOP_NAME             = 'Fade Flex Studios';
const SHOP_LOCATION         = 'Accra, Ghana';
const BOOKING_DURATION_MINS = 60;

/* ============================================================
   GRID LIMITS
   Mobile  (<=480px): max 8 tiles (4 rows × 2 cols) in grid
   Desktop (>480px):  max 8 tiles (4 rows × 2 cols) in grid
   Remaining tiles spill into a horizontal swipe row below
   ============================================================ */
const MOBILE_GRID_MAX  = 8;
const DESKTOP_GRID_MAX = 8;

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

  const trigger = document.getElementById('calMobileTrigger');
  if (trigger) trigger.style.display = 'block';
});

/* ============================================================
   GENDER TOGGLES
   ============================================================ */
function setupGenderToggles() {
  document.getElementById('btnMale')?.addEventListener('click',         () => setGender('male'));
  document.getElementById('btnFemale')?.addEventListener('click',       () => setGender('female'));
  document.getElementById('btnMaleMobile')?.addEventListener('click',   () => setGender('male'));
  document.getElementById('btnFemaleMobile')?.addEventListener('click', () => setGender('female'));
}

function setGender(gender) {
  currentGender = gender;

  ['btnMale','btnMaleMobile'].forEach(id =>
    document.getElementById(id)?.classList.toggle('active', gender === 'male'));
  ['btnFemale','btnFemaleMobile'].forEach(id =>
    document.getElementById(id)?.classList.toggle('active', gender === 'female'));

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
   DEFAULT IMAGE
   ============================================================ */
function loadDefaultImage() {
  const first = getFiltered()[0];
  if (!first) return;

  const img         = document.getElementById('serviceImg');
  const placeholder = document.getElementById('serviceImgPlaceholder');
  const label       = document.getElementById('serviceImgLabel');
  if (!img) return;

  img.onload  = null;
  img.onerror = null;
  img.classList.remove('visible');

  const preload = new Image();
  preload.onload = () => {
    img.onload  = null;
    img.onerror = null;
    img.src = first.img;
    img.alt = first.name;
    img.classList.add('visible');
    if (placeholder) placeholder.classList.add('hidden');
    if (label) { label.textContent = `${first.name} — ${first.price}`; label.classList.add('visible'); }
  };
  preload.onerror = () => {
    img.onload  = null;
    img.onerror = null;
    if (placeholder) { placeholder.textContent = `${first.name} — place image at: ${first.img}`; placeholder.classList.remove('hidden'); }
    if (label) { label.textContent = `${first.name} — ${first.price}`; label.classList.add('visible'); }
  };
  preload.src = first.img;

  if (label) { label.textContent = `${first.name} — ${first.price}`; label.classList.add('visible'); }
}

/* ============================================================
   SERVICE BUBBLES
   Grid tiles (up to GRID_MAX) + overflow horizontal row
   ============================================================ */
function renderServiceBubbles() {
  const container = document.getElementById('serviceBubbles');
  if (!container) return;

  const isMobile  = window.innerWidth <= 480;
  const gridMax   = isMobile ? MOBILE_GRID_MAX : DESKTOP_GRID_MAX;
  const all       = getFiltered();
  const gridTiles = all.slice(0, gridMax);
  const overflow  = all.slice(gridMax);

  function bubbleHTML(s) {
    return `<button class="service-bubble${selectedService?.id === s.id ? ' active' : ''}" data-id="${s.id}" onclick="selectService('${s.id}')"><span>${s.name}</span><span class="service-price">${s.price}</span></button>`;
  }

  container.innerHTML = gridTiles.map(bubbleHTML).join('');

  // Remove stale overflow row
  const stale = container.parentElement?.querySelector('.service-overflow-row');
  if (stale) stale.remove();

  if (overflow.length > 0) {
    const row = document.createElement('div');
    row.className = 'service-overflow-row';
    row.innerHTML = overflow.map(bubbleHTML).join('');
    container.parentElement?.appendChild(row);
  }
}

function selectService(id) {
  const found = SERVICES.find(s => s.id === id && (s.gender === currentGender || s.gender === 'both'));
  if (!found || selectedService?.id === id) return;

  selectedService = found;

  document.querySelectorAll('.service-bubble').forEach(b =>
    b.classList.toggle('active', b.dataset.id === id));

  crossfadeToImage(found);

  const trigger = document.getElementById('calMobileTrigger');
  if (trigger) trigger.style.display = 'block';

  updateSummary();
  refreshCalendars();

  // Scroll to service image card on BOTH mobile and desktop
  const card = document.getElementById('serviceImgCard');
  if (card) {
    const offset = card.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }
}

/* ============================================================
   BUTTERY IMAGE CROSSFADE
   ============================================================ */
let _crossfadeGen = 0;

function crossfadeToImage(service) {
  const imgA    = document.getElementById('serviceImg');
  const imgB    = document.getElementById('serviceImgNext');
  const shimmer = document.getElementById('serviceImgShimmer');
  const ph      = document.getElementById('serviceImgPlaceholder');
  const label   = document.getElementById('serviceImgLabel');
  if (!imgA || !imgB) return;

  const myGen = ++_crossfadeGen;
  if (shimmer) shimmer.classList.add('loading');

  const preload = new Image();

  preload.onload = () => {
    if (myGen !== _crossfadeGen) return;
    if (shimmer) shimmer.classList.remove('loading');
    if (ph) ph.classList.add('hidden');

    imgB.style.zIndex = '3';
    imgB.src = service.img;
    imgB.alt = service.name;
    imgB.classList.add('visible');

    setTimeout(() => {
      if (myGen !== _crossfadeGen) return;
      imgA.onload  = null;
      imgA.onerror = null;
      imgA.src = service.img;
      imgA.alt = service.name;
      imgA.classList.add('visible');
      imgB.classList.remove('visible');
      imgB.style.zIndex = '';
      setTimeout(() => { if (myGen !== _crossfadeGen) return; imgB.src = ''; }, 560);
    }, 560);

    if (label) {
      label.classList.remove('visible');
      setTimeout(() => {
        if (myGen !== _crossfadeGen) return;
        label.textContent = `${service.name} — ${service.price}`;
        label.classList.add('visible');
      }, 280);
    }
  };

  preload.onerror = () => {
    if (myGen !== _crossfadeGen) return;
    if (shimmer) shimmer.classList.remove('loading');
    if (ph) { ph.textContent = `${service.name} — place image at: ${service.img}`; ph.classList.remove('hidden'); }
    imgA.classList.remove('visible');
    if (label) { label.textContent = `${service.name} — ${service.price}`; label.classList.add('visible'); }
  };

  preload.src = service.img;
}

/* ============================================================
   CALENDAR HTML BUILDER
   ============================================================ */
function buildCalendarHTML() {
  const MONTHS = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];

  const today = new Date(); today.setHours(0,0,0,0);
  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  let cells = '';
  for (let i = 0; i < firstDay; i++) cells += `<div class="cal-day empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(calYear, calMonth, d); thisDate.setHours(0,0,0,0);
    let cls = 'cal-day';
    if (thisDate < today) {
      cls += ' past';
    } else {
      if (thisDate.getTime() === today.getTime()) cls += ' today';
      if (selectedDate &&
          selectedDate.getDate()     === d &&
          selectedDate.getMonth()    === calMonth &&
          selectedDate.getFullYear() === calYear) cls += ' selected';
    }
    const click = thisDate >= today ? `onclick="selectDay(${d})"` : '';
    cells += `<div class="${cls}" ${click}>${d}</div>`;
  }

  const times = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];

  return `
    <div class="calendar-header-bar">
      <h3 class="cal-title">&#128197; Book Your Date</h3>
      <p class="cal-sub">Event saved to your default calendar app</p>
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
        ${times.map(t => `<button class="time-slot${selectedTime === t ? ' active' : ''}" onclick="selectTime('${t}')">${t}</button>`).join('')}
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
          Downloads a .ics file — opens in your default calendar app (iOS Calendar, Google Calendar, Outlook, etc.)
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
  // Only re-render popup if it's actually open — prevents shiftMonth from closing it
  const popup = document.getElementById('calPopup');
  if (popup && popup.classList.contains('open')) {
    renderCalendar('calPopupContent');
  }
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
   CALENDAR POPUP (mobile bottom sheet)
   ============================================================ */
function openCalPopup() {
  renderCalendar('calPopupContent');
  document.getElementById('calOverlay')?.classList.add('open');
  const popup = document.getElementById('calPopup');
  if (popup) {
    // Reset any leftover transform from a previous swipe before opening
    popup.style.transform  = '';
    popup.style.transition = '';
    popup.classList.add('open');
  }
  document.body.style.overflow = 'hidden';
  initSwipeToClose(popup);
}

function closeCalPopup() {
  const popup = document.getElementById('calPopup');
  if (popup) {
    popup.style.transform  = '';
    popup.style.transition = '';
    popup.classList.remove('open');
  }
  document.getElementById('calOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* Swipe-down-to-close — only activates when popup is scrolled to top */
function initSwipeToClose(popup) {
  if (!popup || popup._swipeInit) return;
  popup._swipeInit = true;

  let startY     = 0;
  let currentY   = 0;
  let isDragging = false;

  popup.addEventListener('touchstart', (e) => {
    // Don't hijack if user is scrolling down through content
    if (popup.scrollTop > 10) return;
    startY     = e.touches[0].clientY;
    currentY   = startY;
    isDragging = true;
    popup.style.transition = 'none';
  }, { passive: true });

  popup.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const delta = currentY - startY;
    if (delta > 0) popup.style.transform = `translateY(${delta}px)`;
  }, { passive: true });

  const endSwipe = () => {
    if (!isDragging) return;
    isDragging = false;
    const delta = currentY - startY;
    popup.style.transition = '';          // restore CSS transition
    if (delta > 110) {
      popup.style.transform = `translateY(100%)`;
      setTimeout(() => {
        popup.style.transform = '';
        closeCalPopup();
      }, 380);
    } else {
      popup.style.transform = '';         // snap back
    }
  };

  popup.addEventListener('touchend',    endSwipe);
  popup.addEventListener('touchcancel', () => {
    isDragging = false;
    popup.style.transition = '';
    popup.style.transform  = '';
  });
}

/* ============================================================
   BOOKING SUMMARY
   ============================================================ */
function updateSummary() {
  const svc  = selectedService ? `<strong>${selectedService.name}</strong> — ${selectedService.price}` : '—';
  const date = selectedDate    ? `<strong>${selectedDate.toDateString()}</strong>` : '—';
  const time = selectedTime    ? `<strong>${selectedTime}</strong>` : '—';
  document.querySelectorAll('#bookingSummary').forEach(el =>
    el.innerHTML = `Service: ${svc}<br/>Date: ${date}<br/>Time: ${time}`);
}

/* ============================================================
   BOOKING — generates an .ics file so the user's DEFAULT
   calendar app opens (iOS Calendar, Google Calendar app,
   Samsung Calendar, Outlook, etc.) instead of a web page.
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

  const start = new Date(selectedDate); start.setHours(h, m, 0, 0);
  const end   = new Date(start);        end.setMinutes(end.getMinutes() + BOOKING_DURATION_MINS);

  // Local-time format (no Z) so device uses its own timezone
  const pad    = n => String(n).padStart(2, '0');
  const fmtLoc = d =>
    `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

  const uid  = `ffs-${Date.now()}@fadeflex.com`;
  const desc = [
    `Client: ${name}`, `Phone: ${phone}`, `Email: ${email || 'N/A'}`,
    `Service: ${selectedService.name} ${selectedService.price}`,
    `Gender: ${currentGender}`, `Booked via Fade Flex Studios`,
  ].join('\\n');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fade Flex Studios//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${fmtLoc(new Date())}`,
    `DTSTART:${fmtLoc(start)}`,
    `DTEND:${fmtLoc(end)}`,
    `SUMMARY:${SHOP_NAME} \u2014 ${selectedService.name} (${name})`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${SHOP_NAME}\\, ${SHOP_LOCATION}`,
    `ORGANIZER;CN=${SHOP_NAME}:mailto:${OWNER_EMAIL}`,
    ...(email ? [`ATTENDEE;CN=${name};RSVP=TRUE:mailto:${email}`] : []),
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  // Trigger download — mobile browsers/apps hand .ics off to the default calendar
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const burl = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href:     burl,
    download: `fadeFlex-${selectedDate.toISOString().slice(0,10)}.ics`,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(burl), 3000);
}