/**
 * ISTIQAMAH — Modern Dark Product Website Script
 * Handcrafted vanilla JavaScript with zero external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initPrayerDemo();
  initThemeSwitcher();
  initHeroTilt();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. STICKY NAV BLUR ON SCROLL
   -------------------------------------------------------------------------- */
function initStickyNav() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   2. SIGNATURE INTERACTIVE FIVE-PRAYER DEMO
   -------------------------------------------------------------------------- */
function initPrayerDemo() {
  const nodeButtons = document.querySelectorAll('.prayer-node-btn');
  const ringBar = document.getElementById('demoRingBar');
  const percentText = document.getElementById('demoPercentText');
  const doneCounter = document.getElementById('demoDoneCounter');
  const trackFill = document.getElementById('prayerTrackFill');
  const feedbackMessage = document.getElementById('demoFeedbackMessage');
  const resetButton = document.getElementById('btnDemoReset');
  const voluntaryChips = document.querySelectorAll('.v-chip');

  if (!nodeButtons.length) return;

  // Encouraging warm & calm messages for each count (0 to 5)
  const messages = [
    'Begin your day with purpose. Consistency starts with intention.',
    'A steady first step. Consistency begins with the morning prayer.',
    'Daylight carries forward. Keep your heart anchored amidst the day.',
    'Past the midpoint. Peace found in pausing the afternoon rush.',
    'Sunset reflection. Almost home with today’s obligations.',
    'All five prayers fulfilled. A day consecrated with steadfast devotion.'
  ];

  // Circumference for r=26 is 2 * PI * 26 ≈ 163.3628
  const CIRCUMFERENCE = 163.36;

  function updateTrackerUI(animateMessage = true) {
    const doneNodes = Array.from(nodeButtons).filter(btn => btn.classList.contains('done'));
    const count = doneNodes.length;
    const total = nodeButtons.length;
    const percentage = Math.round((count / total) * 100);

    // 1. Update text counter & percentage
    if (doneCounter) {
      doneCounter.textContent = `${count} of ${total} done`;
    }
    if (percentText) {
      percentText.textContent = `${percentage}%`;
    }

    // 2. Update SVG progress ring
    if (ringBar) {
      const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;
      ringBar.style.strokeDashoffset = offset.toFixed(2);
    }

    // 3. Update timeline fill line
    if (trackFill) {
      if (count === 0) {
        trackFill.style.width = '0%';
      } else {
        // Find highest completed index for a natural fill
        let maxIndex = 0;
        nodeButtons.forEach((btn, idx) => {
          if (btn.classList.contains('done')) {
            maxIndex = idx;
          }
        });
        const fillPercent = (maxIndex / (total - 1)) * 100;
        trackFill.style.width = `${fillPercent}%`;
      }
    }

    // 4. Update calm encouraging feedback message with soft fade
    if (feedbackMessage) {
      const targetText = messages[count] || messages[0];
      if (animateMessage && feedbackMessage.textContent.trim() !== targetText) {
        feedbackMessage.style.opacity = '0';
        feedbackMessage.style.transform = 'translateY(4px)';
        setTimeout(() => {
          feedbackMessage.textContent = targetText;
          feedbackMessage.style.opacity = '1';
          feedbackMessage.style.transform = 'translateY(0)';
        }, 160);
      } else {
        feedbackMessage.textContent = targetText;
      }
    }
  }

  // Node toggle click handler
  nodeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDone = btn.classList.toggle('done');
      btn.setAttribute('aria-pressed', isDone ? 'true' : 'false');
      updateTrackerUI(true);
    });
  });

  // Voluntary chip toggles
  voluntaryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const isActive = chip.classList.toggle('active');
      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  });

  // Reset button
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      nodeButtons.forEach(btn => {
        btn.classList.remove('done');
        btn.setAttribute('aria-pressed', 'false');
      });
      voluntaryChips.forEach(chip => {
        chip.classList.remove('active');
        chip.setAttribute('aria-pressed', 'false');
      });
      updateTrackerUI(true);
    });
  }

  // Initialize with 3 of 5 completed to immediately showcase the lively design
  const initialDoneIndices = [0, 1, 2]; // Fajr, Dhuhr, Asr
  initialDoneIndices.forEach(idx => {
    if (nodeButtons[idx]) {
      nodeButtons[idx].classList.add('done');
      nodeButtons[idx].setAttribute('aria-pressed', 'true');
    }
  });

  // Pre-activate Sunnah chip
  const firstChip = voluntaryChips[0];
  if (firstChip) {
    firstChip.classList.add('active');
    firstChip.setAttribute('aria-pressed', 'true');
  }

  updateTrackerUI(false);
}

/* --------------------------------------------------------------------------
   3. THEMES SWITCHER (Live Accent Transformation)
   -------------------------------------------------------------------------- */
function initThemeSwitcher() {
  const swatchButtons = document.querySelectorAll('.swatch-btn');
  if (!swatchButtons.length) return;

  function applyTheme(themeKey) {
    document.documentElement.setAttribute('data-theme', themeKey);

    swatchButtons.forEach(btn => {
      const isCurrent = btn.dataset.themeChoice === themeKey;
      btn.classList.toggle('active', isCurrent);
      btn.setAttribute('aria-checked', isCurrent ? 'true' : 'false');

      const statusSpan = btn.querySelector('.swatch-status');
      if (statusSpan) {
        statusSpan.textContent = isCurrent ? 'Active' : 'Select';
      }
    });

    try {
      localStorage.setItem('istiqamah_theme', themeKey);
    } catch (_) {
      // LocalStorage might be disabled in sandboxed contexts
    }
  }

  swatchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const chosenTheme = btn.dataset.themeChoice;
      if (chosenTheme) {
        applyTheme(chosenTheme);
      }
    });
  });

  // Restore saved theme or default to amethyst
  try {
    const saved = localStorage.getItem('istiqamah_theme');
    if (saved && ['amethyst', 'rose', 'emerald', 'crimson', 'ocean', 'sahara'].includes(saved)) {
      applyTheme(saved);
    }
  } catch (_) {}
}

/* --------------------------------------------------------------------------
   4. 3D PERSPECTIVE TILT EFFECT ON HERO MOCKUP
   -------------------------------------------------------------------------- */
function initHeroTilt() {
  const wrapper = document.getElementById('heroMockupWrapper');
  const windowEl = document.getElementById('heroMockupWindow');
  if (!wrapper || !windowEl) return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Only apply tilt on desktop screens
  if (window.innerWidth < 768) {
    return;
  }

  let isHovered = false;
  let rafId = null;
  let currentRotateX = 6;
  let currentRotateY = -2;
  let targetRotateX = 6;
  let targetRotateY = -2;

  function updateTransform() {
    currentRotateX += (targetRotateX - currentRotateX) * 0.12;
    currentRotateY += (targetRotateY - currentRotateY) * 0.12;

    windowEl.style.transform = `rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;

    if (isHovered || Math.abs(targetRotateX - currentRotateX) > 0.05 || Math.abs(targetRotateY - currentRotateY) > 0.05) {
      rafId = requestAnimationFrame(updateTransform);
    }
  }

  wrapper.addEventListener('mouseenter', () => {
    isHovered = true;
    if (!rafId) rafId = requestAnimationFrame(updateTransform);
  });

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle tilt: max ±5 degrees
    targetRotateX = -((y - centerY) / centerY) * 5;
    targetRotateY = ((x - centerX) / centerX) * 5;

    if (!rafId) rafId = requestAnimationFrame(updateTransform);
  });

  wrapper.addEventListener('mouseleave', () => {
    isHovered = false;
    // Ease back to gentle default resting tilt
    targetRotateX = 6;
    targetRotateY = -2;
  });
}

/* --------------------------------------------------------------------------
   5. SCROLL REVEAL ANIMATIONS (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => observer.observe(el));
}
