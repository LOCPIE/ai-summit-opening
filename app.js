// Multi-Screen Ratio & Stage LED Presets
const SCREEN_RATIO_PRESETS = [
  // Màn hình LED sân khấu sự kiện
  {
    id: '9:4.5',
    category: 'led',
    categoryName: 'Màn hình LED Sân khấu',
    name: '9 × 4.5 m',
    ratioClass: 'ratio-9-45',
    ratioNum: 2 / 1,
    ratioText: '2 : 1',
    desc: 'Màn LED sân khấu chuẩn (Base Summit)',
    res: '3840 × 1920 / 1920 × 960'
  },
  {
    id: '9:3',
    category: 'led',
    categoryName: 'Màn hình LED Sân khấu',
    name: '9 × 3 m',
    ratioClass: 'ratio-9-3',
    ratioNum: 3 / 1,
    ratioText: '3 : 1',
    desc: 'Màn LED siêu rộng Panorama Keynote',
    res: '3840 × 1280 / 1920 × 640'
  },
  {
    id: '12:4',
    category: 'led',
    categoryName: 'Màn hình LED Sân khấu',
    name: '12 × 4 m',
    ratioClass: 'ratio-12-4',
    ratioNum: 3 / 1,
    ratioText: '3 : 1',
    desc: 'Màn LED đại sảnh & Hội nghị lớn',
    res: '3840 × 1280 / 2880 × 960'
  },
  {
    id: '8:4',
    category: 'led',
    categoryName: 'Màn hình LED Sân khấu',
    name: '8 × 4 m',
    ratioClass: 'ratio-8-4',
    ratioNum: 2 / 1,
    ratioText: '2 : 1',
    desc: 'Màn LED sự kiện vừa & Khách sạn',
    res: '1920 × 960 / 2560 × 1280'
  },
  {
    id: '10:4',
    category: 'led',
    categoryName: 'Màn hình LED Sân khấu',
    name: '10 × 4 m',
    ratioClass: 'ratio-10-4',
    ratioNum: 2.5 / 1,
    ratioText: '2.5 : 1',
    desc: 'Màn LED sân khấu rộng tầm trung',
    res: '2560 × 1024 / 3840 × 1536'
  },
  {
    id: '12:5',
    category: 'led',
    categoryName: 'Màn hình LED Sân khấu',
    name: '12 × 5 m',
    ratioClass: 'ratio-12-5',
    ratioNum: 2.4 / 1,
    ratioText: '2.4 : 1',
    desc: 'Màn LED ngang hội trường lớn',
    res: '2880 × 1200 / 3840 × 1600'
  },

  // Màn hình tiêu chuẩn & máy chiếu
  {
    id: '16:9',
    category: 'standard',
    categoryName: 'Màn hình tiêu chuẩn & Máy chiếu',
    name: '16 : 9',
    ratioClass: 'ratio-16-9',
    ratioNum: 16 / 9,
    ratioText: '16 : 9',
    desc: 'Chuẩn Full HD, 4K, Smart TV, Máy chiếu',
    res: '1920 × 1080 / 3840 × 2160'
  },
  {
    id: '16:10',
    category: 'standard',
    categoryName: 'Màn hình tiêu chuẩn & Máy chiếu',
    name: '16 : 10',
    ratioClass: 'ratio-16-10',
    ratioNum: 16 / 10,
    ratioText: '16 : 10',
    desc: 'Laptop, MacBook, Máy chiếu WUXGA',
    res: '1920 × 1200 / 2560 × 1600'
  },
  {
    id: '21:9',
    category: 'standard',
    categoryName: 'Màn hình tiêu chuẩn & Máy chiếu',
    name: '21 : 9',
    ratioClass: 'ratio-21-9',
    ratioNum: 21 / 9,
    ratioText: '2.33 : 1',
    desc: 'Màn hình máy tính Siêu rộng (Ultra-Wide)',
    res: '2560 × 1080 / 3440 × 1440'
  },
  {
    id: '4:3',
    category: 'standard',
    categoryName: 'Màn hình tiêu chuẩn & Máy chiếu',
    name: '4 : 3',
    ratioClass: 'ratio-4-3',
    ratioNum: 4 / 3,
    ratioText: '4 : 3',
    desc: 'Màn chiếu truyền thống, Hội thảo cổ điển',
    res: '1024 × 768 / 1600 × 1200'
  }
];

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

    // Screen Ratio & LED Control Panel Properties
    this.STORAGE_KEY_RATIO = 'summit2026_led_ratio';
    this.currentRatio = '16:9';
    this.slidesViewport = document.getElementById('slidesViewport');
    this.btnOpenScreenModal = document.getElementById('btnOpenScreenModal');
    this.screenRatioModal = document.getElementById('screenRatioModal');
    this.btnCloseScreenRatio = document.getElementById('btnCloseScreenRatio');
    this.btnApplyScreenRatio = document.getElementById('btnApplyScreenRatio');
    this.ledRatioTag = document.getElementById('ledRatioTag');
    this.isScreenRatioModalOpen = false;
    this.toastTimer = null;

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

    // Restore LED Ratio (16:9, 9:4.5, 9:3, etc.)
    let savedRatio = '16:9';
    const ratioParam = urlParams.get('ratio');
    if (ratioParam) {
      const match = SCREEN_RATIO_PRESETS.find(p => p.id === ratioParam || p.ratioClass === `ratio-${ratioParam.replace(':', '-')}`);
      if (match) {
        savedRatio = match.id;
      } else if (ratioParam === '9-45' || ratioParam === '9:4.5' || ratioParam === '9x4.5' || ratioParam === '9x4,5') {
        savedRatio = '9:4.5';
      } else if (ratioParam === '9-3' || ratioParam === '9:3' || ratioParam === '9x3') {
        savedRatio = '9:3';
      }
    } else {
      try {
        const storedRatio = localStorage.getItem(this.STORAGE_KEY_RATIO);
        if (storedRatio && SCREEN_RATIO_PRESETS.some(p => p.id === storedRatio)) {
          savedRatio = storedRatio;
        }
      } catch (e) {}
    }
    this.setLedRatio(savedRatio, true);
  }

  showToast(messageOrSlideNum) {
    if (!this.toastNotice) return;
    const toastMsgEl = document.getElementById('toastMessage');
    if (typeof messageOrSlideNum === 'number') {
      if (this.restoredSlideNumEl) this.restoredSlideNumEl.textContent = messageOrSlideNum;
      if (toastMsgEl) toastMsgEl.innerHTML = `Đã khôi phục tiến độ slide <strong>${messageOrSlideNum}</strong>`;
    } else if (typeof messageOrSlideNum === 'string') {
      if (toastMsgEl) toastMsgEl.innerHTML = messageOrSlideNum;
    }
    this.toastNotice.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastNotice.classList.remove('show');
    }, 2800);
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

    // Slide 5: Ensure all agenda blocks start collapsed, open only on click
    if (activeSlide && activeSlide.classList.contains('slide-agenda')) {
      document.querySelectorAll('.agenda-block').forEach(b => {
        b.classList.remove('expanded');
      });
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
    const activeSlide = this.slides[this.currentIndex - 1];
    if (!activeSlide) return;

    const metricEls = activeSlide.querySelectorAll('[data-target]');
    metricEls.forEach((el, idx) => {
      el.classList.remove('counted-finished');
      const targetStr = el.getAttribute('data-target');
      if (!targetStr) return;

      const suffix = el.getAttribute('data-suffix') || '';
      const separator = el.getAttribute('data-separator') || null;
      const targetVal = parseFloat(targetStr);
      const cardDelay = idx * 120;
      const duration = 1500;

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
          const ease = 1 - Math.pow(1 - progress, 3);
          const currentVal = ease * targetVal;

          el.textContent = formatNum(currentVal);

          if (progress < 1) {
            requestAnimationFrame(updateVal);
          } else {
            el.textContent = formatNum(targetVal);
            el.classList.add('counted-finished');
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

  buildScreenRatioModal() {
    const container = document.getElementById('screenRatioBody');
    if (!container) return;
    container.innerHTML = '';

    const categories = [
      { id: 'led', title: '🎪 MÀN HÌNH LED SÂN KHẤU SỰ KIỆN' },
      { id: 'standard', title: '🖥️ MÀN HÌNH TIÊU CHUẨN & MÁY CHIẾU' }
    ];

    categories.forEach(cat => {
      const section = document.createElement('div');
      section.className = 'screen-ratio-section';
      section.innerHTML = `<div class="screen-ratio-section-title">${cat.title}</div>`;

      const grid = document.createElement('div');
      grid.className = 'screen-ratio-grid';

      const items = SCREEN_RATIO_PRESETS.filter(p => p.category === cat.id);
      items.forEach(preset => {
        const card = document.createElement('div');
        const isActive = this.currentRatio === preset.id;
        card.className = `screen-ratio-card ${isActive ? 'active' : ''}`;
        card.setAttribute('data-ratio', preset.id);

        // Calculate proportional visual box (base width 48px)
        const boxW = 48;
        const boxH = Math.max(14, Math.min(36, Math.round(boxW / preset.ratioNum)));

        card.innerHTML = `
          <div class="screen-shape-box" title="Tỷ lệ: ${preset.ratioText}">
            <div class="screen-shape-inner" style="width: ${boxW}px; height: ${boxH}px;"></div>
          </div>
          <div class="screen-ratio-info">
            <div class="screen-ratio-topline">
              <span class="screen-ratio-name">${preset.name}</span>
              <span class="screen-ratio-pill">${preset.ratioText}</span>
            </div>
            <div class="screen-ratio-card-desc">${preset.desc}</div>
            <div class="screen-ratio-card-res">${preset.res}</div>
          </div>
          <div class="screen-ratio-check">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
        `;

        card.addEventListener('click', () => {
          this.setLedRatio(preset.id);
        });

        grid.appendChild(card);
      });

      section.appendChild(grid);
      container.appendChild(section);
    });
  }

  toggleScreenRatioModal(forceState) {
    if (!this.screenRatioModal) return;
    this.isScreenRatioModalOpen = typeof forceState === 'boolean' 
      ? forceState 
      : !this.isScreenRatioModalOpen;

    if (this.isScreenRatioModalOpen) {
      if (this.isOverviewOpen) this.toggleOverview(false);
      this.buildScreenRatioModal();
      this.screenRatioModal.classList.add('active');
    } else {
      this.screenRatioModal.classList.remove('active');
    }
  }

  setLedRatio(ratioId, isInitial = false) {
    const preset = SCREEN_RATIO_PRESETS.find(p => p.id === ratioId) || SCREEN_RATIO_PRESETS.find(p => p.id === '16:9');
    this.currentRatio = preset.id;

    try {
      localStorage.setItem(this.STORAGE_KEY_RATIO, preset.id);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    if (this.slidesViewport) {
      // Remove all ratio classes
      SCREEN_RATIO_PRESETS.forEach(p => {
        this.slidesViewport.classList.remove(p.ratioClass);
      });
      this.slidesViewport.classList.add(preset.ratioClass);
    }

    if (this.ledRatioTag) {
      this.ledRatioTag.textContent = preset.name;
    }

    // Update active card if modal is open
    document.querySelectorAll('.screen-ratio-card').forEach(card => {
      if (card.getAttribute('data-ratio') === preset.id) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    if (!isInitial) {
      this.showToast(`Đã chuyển sang: <strong>${preset.name} (${preset.ratioText})</strong>`);
    }
  }

  cycleLedRatio() {
    const cycleList = ['16:9', '9:4.5', '9:3', '12:4', '10:4', '21:9', '16:10', '4:3'];
    const currIdx = cycleList.indexOf(this.currentRatio);
    const nextRatio = cycleList[(currIdx + 1) % cycleList.length];
    this.setLedRatio(nextRatio);
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
      // If screen ratio modal is open, handle Esc
      if (this.isScreenRatioModalOpen) {
        if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') {
          this.toggleScreenRatioModal(false);
          e.preventDefault();
        }
        return;
      }

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

        case 'r':
        case 'R':
          e.preventDefault();
          this.cycleLedRatio();
          break;

        case 'm':
        case 'M':
          e.preventDefault();
          this.toggleScreenRatioModal();
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

    // Screen ratio modal controls
    if (this.btnOpenScreenModal) {
      this.btnOpenScreenModal.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleScreenRatioModal();
      });
    }

    if (this.btnCloseScreenRatio) {
      this.btnCloseScreenRatio.addEventListener('click', () => {
        this.toggleScreenRatioModal(false);
      });
    }

    if (this.btnApplyScreenRatio) {
      this.btnApplyScreenRatio.addEventListener('click', () => {
        this.toggleScreenRatioModal(false);
      });
    }

    // Close on backdrop click
    if (this.screenRatioModal) {
      this.screenRatioModal.addEventListener('click', (e) => {
        if (e.target === this.screenRatioModal) {
          this.toggleScreenRatioModal(false);
        }
      });
    }

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

