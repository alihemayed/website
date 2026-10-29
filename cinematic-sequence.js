/*
  Homepage cinematic sequence.

  Edit the frames below to change image order, timing, motion, transition,
  or focal position. Durations are milliseconds. Strength values should stay
  small (roughly 0.01–0.03) so the photography remains the artwork.
*/
window.CINEMATIC_SEQUENCE = {
  transitionDuration: 1300,
  frames: [
    {
      image: 'assets/cinematic/trident-facade-2200.jpg',
      mobileImage: 'assets/cinematic/trident-facade-1200.jpg',
      project: 'Trident',
      description: 'Trident facade at dusk',
      duration: 4600,
      motion: 'push',
      strength: 0.018,
      transition: 'dissolve',
      focalPoint: '50% 54%',
      focalPointMobile: '43% 50%',
      openingDelay: 1000
    },
    {
      image: 'assets/cinematic/kendall-entrance-2200.jpg',
      mobileImage: 'assets/cinematic/kendall-entrance-1200.jpg',
      project: 'Kendall',
      description: 'Curved brick entrance at Kendall',
      duration: 3200,
      motion: 'push',
      strength: 0.022,
      transition: 'light-opening',
      focalPoint: '51% 51%'
    },
    {
      image: 'assets/cinematic/harrington-hall-2200.jpg',
      mobileImage: 'assets/cinematic/harrington-hall-1200.jpg',
      project: 'Harrington',
      description: 'Harrington entrance hall',
      duration: 3200,
      motion: 'pan-left',
      strength: 0.016,
      transition: 'dissolve',
      focalPoint: '58% 50%'
    },
    {
      image: 'assets/cinematic/trident-corridor-2200.jpg',
      mobileImage: 'assets/cinematic/trident-corridor-1200.jpg',
      project: 'Trident',
      description: 'Long corridor at Trident',
      duration: 3600,
      motion: 'push',
      strength: 0.024,
      transition: 'dark-opening',
      focalPoint: '50% 51%'
    },
    {
      image: 'assets/cinematic/kernot-arch-2200.jpg',
      mobileImage: 'assets/cinematic/kernot-arch-1200.jpg',
      project: 'Kernot',
      description: 'Arched bedroom threshold at Kernot',
      duration: 3000,
      motion: 'still',
      strength: 0,
      transition: 'dark-opening',
      focalPoint: '51% 50%'
    },
    {
      image: 'assets/cinematic/webster-arches-2200.jpg',
      mobileImage: 'assets/cinematic/webster-arches-1200.jpg',
      project: 'Webster',
      description: 'Layered arches at Webster',
      duration: 3400,
      motion: 'push',
      strength: 0.021,
      transition: 'dark-opening',
      focalPoint: '50% 52%'
    },
    {
      image: 'assets/cinematic/webster-stair-2200.jpg',
      mobileImage: 'assets/cinematic/webster-stair-1200.jpg',
      project: 'Webster',
      description: 'Curved stair at Webster',
      duration: 3200,
      motion: 'rise',
      strength: 0.018,
      transition: 'dissolve',
      focalPoint: '50% 46%'
    },
    {
      image: 'assets/cinematic/trident-shadow-stair-2200.jpg',
      mobileImage: 'assets/cinematic/trident-shadow-stair-1200.jpg',
      project: 'Trident',
      description: 'Stair and afternoon shadow at Trident',
      duration: 3400,
      motion: 'rise',
      strength: 0.016,
      transition: 'dissolve',
      focalPoint: '52% 48%'
    },
    {
      image: 'assets/cinematic/kernot-light-timber-2200.jpg',
      mobileImage: 'assets/cinematic/kernot-light-timber-1200.jpg',
      project: 'Kernot',
      description: 'Light falling across timber at Kernot',
      duration: 3000,
      motion: 'still',
      strength: 0,
      transition: 'light-opening',
      focalPoint: '51% 50%'
    },
    {
      image: 'assets/cinematic/kendall-living-2200.jpg',
      mobileImage: 'assets/cinematic/kendall-living-1200.jpg',
      project: 'Kendall',
      description: 'Living and dining space at Kendall',
      duration: 3400,
      motion: 'pull',
      strength: 0.018,
      transition: 'light-opening',
      focalPoint: '52% 54%'
    },
    {
      image: 'assets/cinematic/callistemon-living-2200.jpg',
      mobileImage: 'assets/cinematic/callistemon-living-1200.jpg',
      project: 'Callistemon',
      description: 'A figure crossing the living room at Callistemon',
      duration: 3200,
      motion: 'still',
      strength: 0,
      transition: 'dissolve',
      focalPoint: '48% 52%'
    },
    {
      image: 'assets/cinematic/angul-window-pool-2200.jpg',
      mobileImage: 'assets/cinematic/angul-window-pool-1200.jpg',
      project: 'Angul',
      description: 'Bedroom opening to the pool at Angul',
      duration: 3400,
      motion: 'push',
      strength: 0.019,
      transition: 'light-opening',
      focalPoint: '55% 53%'
    },
    {
      image: 'assets/cinematic/webster-courtyard-2200.jpg',
      mobileImage: 'assets/cinematic/webster-courtyard-1200.jpg',
      project: 'Webster',
      description: 'Quiet courtyard at Webster',
      duration: 4400,
      motion: 'still',
      strength: 0,
      transition: 'dissolve',
      focalPoint: '54% 52%'
    }
  ]
};

(function initialiseCinematicSequence() {
  const root = document.querySelector('[data-cinematic-sequence]');
  if (!root || !window.CINEMATIC_SEQUENCE) return;

  const config = window.CINEMATIC_SEQUENCE;
  const frames = config.frames || [];
  const layers = Array.from(root.querySelectorAll('.cinematic-layer'));
  const ending = root.querySelector('.cinematic-ending');
  const skip = root.querySelector('.cinematic-skip');
  const enter = root.querySelector('.cinematic-enter');
  const mobileQuery = window.matchMedia('(max-width: 700px)');
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeLayer = 0;
  let frameIndex = 0;
  let frameTimer = 0;
  let endingTimer = 0;
  let timerStartedAt = 0;
  let remainingTime = 0;
  let stopped = false;

  if (!frames.length || layers.length < 2) return;

  root.style.setProperty('--cinematic-fade', `${config.transitionDuration || 1300}ms`);

  const imageForViewport = frame => mobileQuery.matches ? frame.mobileImage : frame.image;

  function preloadFrame(index) {
    const frame = frames[index];
    if (!frame) return;
    const image = new Image();
    image.decoding = 'async';
    image.srcset = `${frame.mobileImage} 1200w, ${frame.image} 2200w`;
    image.sizes = '100vw';
    image.src = imageForViewport(frame);
  }

  function motionFrames(frame) {
    const amount = Number(frame.strength) || 0;
    const scale = 1 + amount;
    const shift = Math.max(.45, amount * 68);
    const motions = {
      push: [
        { transform: 'scale(1) translate3d(0, 0, 0)' },
        { transform: `scale(${scale}) translate3d(0, 0, 0)` }
      ],
      pull: [
        { transform: `scale(${scale}) translate3d(0, 0, 0)` },
        { transform: 'scale(1) translate3d(0, 0, 0)' }
      ],
      'pan-left': [
        { transform: `scale(${scale}) translate3d(${shift}%, 0, 0)` },
        { transform: `scale(${scale}) translate3d(-${shift}%, 0, 0)` }
      ],
      'pan-right': [
        { transform: `scale(${scale}) translate3d(-${shift}%, 0, 0)` },
        { transform: `scale(${scale}) translate3d(${shift}%, 0, 0)` }
      ],
      rise: [
        { transform: `scale(${1 + amount * .7}) translate3d(0, ${shift * .7}%, 0)` },
        { transform: `scale(${1 + amount * .7}) translate3d(0, -${shift * .7}%, 0)` }
      ]
    };
    return motions[frame.motion] || null;
  }

  function animateFrame(image, frame) {
    image.getAnimations().forEach(animation => animation.cancel());
    image.style.transform = 'none';
    if (frame.motion === 'still' || reducedQuery.matches || mobileQuery.matches) return;
    const keyframes = motionFrames(frame);
    if (!keyframes) return;
    image.animate(keyframes, {
      duration: Math.max(1200, frame.duration - (frame.openingDelay || 0) + 350),
      delay: frame.openingDelay || 0,
      easing: 'linear',
      fill: 'forwards'
    });
  }

  function pulseTransition(type) {
    root.classList.remove('transition-dark', 'transition-light');
    if (type !== 'dark-opening' && type !== 'light-opening') return;
    void root.offsetWidth;
    root.classList.add(type === 'dark-opening' ? 'transition-dark' : 'transition-light');
  }

  function applyFrame(layer, frame, priority) {
    const image = layer.querySelector('img');
    image.alt = frame.description || `${frame.project} architecture`;
    image.decoding = 'async';
    image.loading = priority ? 'eager' : 'lazy';
    image.fetchPriority = priority ? 'high' : 'auto';
    image.sizes = '100vw';
    image.srcset = `${frame.mobileImage} 1200w, ${frame.image} 2200w`;
    image.src = imageForViewport(frame);
    layer.style.setProperty('--cinematic-focal', frame.focalPoint || '50% 50%');
    layer.style.setProperty('--cinematic-focal-mobile', frame.focalPointMobile || frame.focalPoint || '50% 50%');
    animateFrame(image, frame);
  }

  function scheduleAdvance(duration) {
    remainingTime = duration;
    timerStartedAt = performance.now();
    frameTimer = window.setTimeout(advance, duration);
  }

  function completeSequence() {
    stopped = true;
    window.clearTimeout(frameTimer);
    window.clearTimeout(endingTimer);
    ending.classList.add('is-visible');
    root.classList.add('is-complete');
    skip.disabled = true;
    skip.setAttribute('aria-hidden', 'true');
    enter.removeAttribute('aria-hidden');
    enter.removeAttribute('tabindex');
  }

  function showEnding(frame) {
    window.clearTimeout(endingTimer);
    endingTimer = window.setTimeout(() => ending.classList.add('is-visible'), Math.max(900, frame.duration - 2600));
  }

  function advance() {
    if (stopped) return;
    if (frameIndex >= frames.length - 1) {
      completeSequence();
      return;
    }

    const nextIndex = frameIndex + 1;
    const nextLayer = activeLayer === 0 ? 1 : 0;
    const nextFrame = frames[nextIndex];
    const incoming = layers[nextLayer];
    const outgoing = layers[activeLayer];

    pulseTransition(nextFrame.transition);
    applyFrame(incoming, nextFrame, false);
    incoming.classList.add('is-visible');
    outgoing.classList.remove('is-visible');
    outgoing.querySelector('img').alt = '';
    activeLayer = nextLayer;
    frameIndex = nextIndex;
    preloadFrame(nextIndex + 1);

    if (frameIndex === frames.length - 1) showEnding(nextFrame);
    scheduleAdvance(nextFrame.duration);
  }

  function pauseSequence() {
    if (stopped || !frameTimer) return;
    window.clearTimeout(frameTimer);
    remainingTime = Math.max(0, remainingTime - (performance.now() - timerStartedAt));
    layers[activeLayer].querySelector('img').getAnimations().forEach(animation => animation.pause());
  }

  function resumeSequence() {
    if (stopped || document.hidden) return;
    layers[activeLayer].querySelector('img').getAnimations().forEach(animation => animation.play());
    scheduleAdvance(remainingTime || frames[frameIndex].duration);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseSequence();
    else resumeSequence();
  });

  skip.addEventListener('click', () => {
    stopped = true;
    window.clearTimeout(frameTimer);
    window.clearTimeout(endingTimer);
    document.querySelector('#work')?.scrollIntoView({ behavior: reducedQuery.matches ? 'auto' : 'smooth' });
  });

  enter.addEventListener('click', () => {
    stopped = true;
  });

  applyFrame(layers[0], frames[0], true);
  layers[0].classList.add('is-visible');
  layers[1].querySelector('img').alt = '';
  preloadFrame(1);
  scheduleAdvance(frames[0].duration);
})();
