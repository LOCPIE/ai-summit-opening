/**
 * Enterprise AI Summit 2026 - Slide Presentation Engine
 */

class PresentationApp {
  constructor() {
    this.STORAGE_KEY = 'summit2026_slide_index';
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.totalSlides = this.slides.length;
    this.currentIndex = 1;

    // DOM Elements
    this.progressBarFill = document.getElementById('progressBarFill');
    this.progressBarContainer = document.getElementById('progressBarContainer');
    this.currentSlideNumEl = document.getElementById('currentSlideNum');
    this.totalSlidesNumEl = document.getElementById('totalSlidesNum');
    this.currentSlideTitleEl = document.getElementById('currentSlideTitle');
    this.btnPrev = document.getElementById('btnPrev');
    this.btnNext = document.getElementById('btnNext');
    this.prevArrowBtn = document.getElementById('prevArrowBtn');
    this.nextArrowBtn = document.getElementById('nextArrowBtn');
    this.btnFullscreen = document.getElementById('btnFullscreen');
    this.btnOverview = document.getElementById('btnOverview');
    this.btnCloseOverview = document.getElementById('btnCloseOverview');
    this.btnResetProgress = document.getElementById('btnResetProgress');
    this.overviewModal = document.getElementById('overviewModal');
    this.overviewGrid = document.getElementById('overviewGrid');
    this.toastNotice = document.getElementById('toastNotice');
    this.restoredSlideNumEl = document.getElementById('restoredSlideNum');
    this.bottomDock = document.querySelector('.bottom-dock');
    this.dockHiddenHint = document.getElementById('dockHiddenHint');

    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isOverviewOpen = false;

    // Auto-hide dock properties (2 seconds)
    this.autoHideTimer = null;
    this.isDockHovered = false;
    this.isDockHidden = false;

    this.init();
  }

  init() {
    if (this.totalSlidesNumEl) {
      this.totalSlidesNumEl.textContent = this.totalSlides;
    }

    this.buildOverviewGrid();
    this.bindEvents();
    this.restoreProgress();
  }

  restoreProgress() {
    let savedIndex = 1;
    const urlParams = new URLSearchParams(window.location.search);
    const slideParam = urlParams.get('slide');
    if (slideParam) {
      const p = parseInt(slideParam, 10);
      if (!isNaN(p) && p >= 1 && p <= this.totalSlides) {
        savedIndex = p;
      }
    } else {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = parseInt(stored, 10);
          if (!isNaN(parsed) && parsed >= 1 && parsed <= this.totalSlides) {
            savedIndex = parsed;
          }
        }
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    }

    this.goToSlide(savedIndex, true);

    if (savedIndex > 1) {
      this.showToast(savedIndex);
    }
  }

  showToast(slideNum) {
    if (!this.toastNotice) return;
    if (this.restoredSlideNumEl) {
      this.restoredSlideNumEl.textContent = slideNum;
    }
    this.toastNotice.classList.add('show');
    setTimeout(() => {
      this.toastNotice.classList.remove('show');
    }, 3800);
  }

  saveProgress(index) {
    try {
      localStorage.setItem(this.STORAGE_KEY, index);
    } catch (e) {
      console.warn('Cannot save to LocalStorage:', e);
    }
  }

  goToSlide(targetIndex, isInitial = false) {
    if (targetIndex < 1) targetIndex = 1;
    if (targetIndex > this.totalSlides) targetIndex = this.totalSlides;

    const previousIndex = this.currentIndex;
    const isForward = targetIndex >= previousIndex;

    this.slides.forEach((slide, idx) => {
      const slideNum = idx + 1;
      slide.classList.remove('active', 'prev-out', 'next-out');

      if (slideNum === targetIndex) {
        slide.classList.add('active');
      } else if (!isInitial) {
        if (slideNum === previousIndex) {
          slide.classList.add(isForward ? 'prev-out' : 'next-out');
        }
      }
    });

    this.currentIndex = targetIndex;
    this.saveProgress(this.currentIndex);
    this.updateUI();

    // Trigger metric counting if on metrics slide
    const activeSlide = this.slides[this.currentIndex - 1];
    if (activeSlide && activeSlide.classList.contains('slide-metrics')) {
      this.animateMetrics();
    }
  }

  nextSlide() {
    if (this.currentIndex < this.totalSlides) {
      this.goToSlide(this.currentIndex + 1);
    }
  }

  prevSlide() {
    if (this.currentIndex > 1) {
      this.goToSlide(this.currentIndex - 1);
    }
  }

  updateUI() {
    // Update counter
    if (this.currentSlideNumEl) {
      this.currentSlideNumEl.textContent = this.currentIndex;
    }

    // Update Progress Bar
    if (this.progressBarFill) {
      const percentage = (this.currentIndex / this.totalSlides) * 100;
      this.progressBarFill.style.width = `${percentage}%`;
    }

    // Update Slide Title
    const currentSlideEl = this.slides[this.currentIndex - 1];
    if (currentSlideEl && this.currentSlideTitleEl) {
      const title = currentSlideEl.getAttribute('data-title') || `Slide ${this.currentIndex}`;
      this.currentSlideTitleEl.textContent = title;
    }

    // Update Side Arrows State
    if (this.prevArrowBtn) {
      this.prevArrowBtn.style.opacity = this.currentIndex === 1 ? '0.2' : '0.6';
      this.prevArrowBtn.style.pointerEvents = this.currentIndex === 1 ? 'none' : 'auto';
    }
    if (this.nextArrowBtn) {
      this.nextArrowBtn.style.opacity = this.currentIndex === this.totalSlides ? '0.2' : '0.6';
      this.nextArrowBtn.style.pointerEvents = this.currentIndex === this.totalSlides ? 'none' : 'auto';
    }

    // Update Overview highlight
    if (this.overviewGrid) {
      const cards = this.overviewGrid.querySelectorAll('.overview-card');
      cards.forEach((c, idx) => {
        if (idx + 1 === this.currentIndex) {
          c.classList.add('current');
        } else {
          c.classList.remove('current');
        }
      });
    }
  }

  animateMetrics() {
    const cards = document.querySelectorAll('.slide.slide-metrics .metric-card');
    cards.forEach((card, idx) => {
      card.classList.remove('counted-finished');
      const el = card.querySelector('.metric-number');
      if (!el) return;

      const targetStr = el.getAttribute('data-target');
      if (!targetStr) return;

      const suffix = el.getAttribute('data-suffix') || '';
      const separator = el.getAttribute('data-separator') || null;
      const targetVal = parseFloat(targetStr);
      // Slight stagger per card
      const cardDelay = idx * 100;
      const duration = 1400;

      const formatNum = (val) => {
        const rounded = Math.floor(val);
        let str;
        if (separator) {
          str = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        } else {
          str = rounded.toLocaleString('vi-VN');
        }
        return str + suffix;
      };

      setTimeout(() => {
        const startTime = performance.now();

        const updateVal = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutCubic
          const ease = 1 - Math.pow(1 - progress, 3);
          const currentVal = ease * targetVal;

          el.textContent = formatNum(currentVal);

          if (progress < 1) {
            requestAnimationFrame(updateVal);
          } else {
            el.textContent = formatNum(targetVal);
            card.classList.add('counted-finished');
          }
        };

        requestAnimationFrame(updateVal);
      }, cardDelay);
    });
  }

  buildOverviewGrid() {
    if (!this.overviewGrid) return;
    this.overviewGrid.innerHTML = '';

    this.slides.forEach((slide, idx) => {
      const slideNum = idx + 1;
      const title = slide.getAttribute('data-title') || `Slide ${slideNum}`;

      const card = document.createElement('div');
      card.className = `overview-card ${slideNum === this.currentIndex ? 'current' : ''}`;
      card.innerHTML = `
        <span class="overview-card-number">SLIDE ${String(slideNum).padStart(2, '0')}</span>
        <h3 class="overview-card-title">${title}</h3>
      `;

      card.addEventListener('click', () => {
        this.goToSlide(slideNum);
        this.toggleOverview(false);
      });

      this.overviewGrid.appendChild(card);
    });
  }

  toggleOverview(forceState) {
    this.isOverviewOpen = typeof forceState === 'boolean' ? forceState : !this.isOverviewOpen;
    if (this.overviewModal) {
      if (this.isOverviewOpen) {
        this.overviewModal.classList.add('active');
      } else {
        this.overviewModal.classList.remove('active');
      }
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  resetProgress() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {}
    this.goToSlide(1);
  }

  showDock() {
    this.isDockHidden = false;
    if (this.bottomDock) {
      this.bottomDock.classList.remove('dock-hidden');
    }
    if (this.prevArrowBtn) {
      this.prevArrowBtn.classList.remove('nav-hidden');
    }
    if (this.nextArrowBtn) {
      this.nextArrowBtn.classList.remove('nav-hidden');
    }
    this.scheduleAutoHide(2000);
  }

  hideDock() {
    if (this.isDockHovered) return;
    this.isDockHidden = true;
    if (this.bottomDock) {
      this.bottomDock.classList.add('dock-hidden');
    }
    if (this.prevArrowBtn) {
      this.prevArrowBtn.classList.add('nav-hidden');
    }
    if (this.nextArrowBtn) {
      this.nextArrowBtn.classList.add('nav-hidden');
    }
  }

  toggleDock() {
    if (this.isDockHidden) {
      this.showDock();
    } else {
      this.hideDock();
    }
  }

  scheduleAutoHide(delay = 2000) {
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
    }
    this.autoHideTimer = setTimeout(() => {
      this.hideDock();
    }, delay);
  }

  bindEvents() {
    // Start initial 2-second auto-hide countdown
    this.scheduleAutoHide(2000);

    // Prevent auto-hide while mouse is hovering directly inside the dock
    if (this.bottomDock) {
      this.bottomDock.addEventListener('mouseenter', () => {
        this.isDockHovered = true;
        if (this.autoHideTimer) clearTimeout(this.autoHideTimer);
      });

      this.bottomDock.addEventListener('mouseleave', () => {
        this.isDockHovered = false;
        this.scheduleAutoHide(2000);
      });
    }

    // Click on floating hint or bottom edge shows dock
    if (this.dockHiddenHint) {
      this.dockHiddenHint.addEventListener('click', () => {
        this.showDock();
      });
    }

    // Keyboard Navigation
    window.addEventListener('keydown', (e) => {
      // If overview is open, handle Esc
      if (this.isOverviewOpen) {
        if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') {
          this.toggleOverview(false);
          e.preventDefault();
        }
        return;
      }

      switch (e.key) {
        // ONLY pressing H will display or toggle the control dock
        case 'h':
        case 'H':
          e.preventDefault();
          this.toggleDock();
          break;

        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // Spacebar
        case 'PageDown':
          e.preventDefault();
          this.nextSlide();
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault();
          this.prevSlide();
          break;

        case 'Home':
          e.preventDefault();
          this.goToSlide(1);
          break;

        case 'End':
          e.preventDefault();
          this.goToSlide(this.totalSlides);
          break;

        case 'f':
        case 'F':
          e.preventDefault();
          this.toggleFullscreen();
          break;

        case 'o':
        case 'O':
          e.preventDefault();
          this.toggleOverview();
          break;

        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
      }
    });

    // Button controls
    if (this.btnNext) this.btnNext.addEventListener('click', () => { this.nextSlide(); this.scheduleAutoHide(2000); });
    if (this.btnPrev) this.btnPrev.addEventListener('click', () => { this.prevSlide(); this.scheduleAutoHide(2000); });
    if (this.nextArrowBtn) this.nextArrowBtn.addEventListener('click', () => { this.nextSlide(); this.scheduleAutoHide(2000); });
    if (this.prevArrowBtn) this.prevArrowBtn.addEventListener('click', () => { this.prevSlide(); this.scheduleAutoHide(2000); });

    if (this.btnFullscreen) this.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    if (this.btnOverview) this.btnOverview.addEventListener('click', () => this.toggleOverview());
    if (this.btnCloseOverview) this.btnCloseOverview.addEventListener('click', () => this.toggleOverview(false));
    if (this.btnResetProgress) this.btnResetProgress.addEventListener('click', () => this.resetProgress());

    // Progress bar scrubber click
    if (this.progressBarContainer) {
      this.progressBarContainer.addEventListener('click', (e) => {
        const rect = this.progressBarContainer.getBoundingClientRect();
        const clickRatio = (e.clientX - rect.left) / rect.width;
        const targetIndex = Math.max(1, Math.min(this.totalSlides, Math.ceil(clickRatio * this.totalSlides)));
        this.goToSlide(targetIndex);
      });
    }

    // Touch Swipe Gesture
    window.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      const diff = this.touchEndX - this.touchStartX;
      if (Math.abs(diff) > 45) {
        if (diff < 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    }, { passive: true });
  }
}

// Global helper for toggling Slide 5 agenda sections (Accordion UX)
window.toggleAgenda = function(secNum) {
  const targetBlock = document.getElementById(`agenda-sec-${secNum}`);
  if (!targetBlock) return;
  const isCurrentlyExpanded = targetBlock.classList.contains('expanded');

  // Close all blocks
  document.querySelectorAll('.agenda-block').forEach(b => {
    b.classList.remove('expanded');
  });

  // If it was not already expanded, expand it
  if (!isCurrentlyExpanded) {
    targetBlock.classList.add('expanded');
  }
};

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new PresentationApp();
});

