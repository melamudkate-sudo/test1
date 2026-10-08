'use strict';
const config = window.DEMIAND_CONFIG || {};
const shareText = (config.shareText || 'Кажется, ты поторопился с подачей. Доведи мысль до готовности с DEMIAND: {url}').replaceAll('{url}', config.shareUrl || 'https://example.com/digital-airfryer');
const toast = document.getElementById('toast');
let toastTimer;
function notify(message) { if (!toast) return; toast.textContent = message; toast.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 4200); }
document.querySelectorAll('[data-store]').forEach(link => { link.href = config.storeUrl || 'https://demiand.ru/'; });
const selectedImage = document.body.classList.contains('digital-only') ? config.digitalImage : config.heroImage;
if (selectedImage) { const projectRoot = new URL('./', document.querySelector('script[src*="config.js"]').src); document.querySelectorAll('.product').forEach(image => { image.src = new URL(selectedImage, projectRoot).href; }); }
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(shareText);
    notify('Готово! Вставьте текст в чат с ИИ.');
    const scene = document.querySelector('.reactor');
    if (scene) { scene.classList.add('is-cooking'); setTimeout(() => scene.classList.remove('is-cooking'), 3000); }
    button.classList.add('copied'); setTimeout(() => button.classList.remove('copied'), 2000);
  } catch {
    const dialog = document.getElementById('copy-dialog');
    const field = document.getElementById('manual-copy');
    field.value = shareText; dialog.showModal(); field.focus(); field.select();
  }
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
});
// The HTML src + preload starts fetching immediately, independently of scrolling.
// Playback starts when the film enters the viewport, without player controls.
const video = document.getElementById('campaign-video');
if (video && config.videoUrl) {
  video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'auto';
  if (video.getAttribute('src') !== config.videoUrl) video.src = config.videoUrl;
  if (config.videoPoster) video.poster = config.videoPoster;
  if (config.videoCaptions) { const track = document.createElement('track'); track.kind = 'captions'; track.srclang = 'ru'; track.label = 'Русский'; track.src = config.videoCaptions; track.default = true; video.append(track); }
  let inView = false;
  async function syncPlayback() {
    if (inView && !document.hidden) {
      try { await video.play(); } catch { /* Keep the poster if the browser blocks autoplay. */ }
      if (!inView || document.hidden) video.pause();
    } else video.pause();
  }
  const videoObserver = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting; syncPlayback();
  }, { threshold: 0, rootMargin: '-10% 0px -10% 0px' });
  videoObserver.observe(video);
  document.addEventListener('visibilitychange', syncPlayback);
  window.addEventListener('pageshow', syncPlayback);
  video.addEventListener('loadeddata', syncPlayback);
  video.addEventListener('error', () => { videoObserver.disconnect(); video.hidden = true; document.getElementById('film-poster').hidden = false; });
}

const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();

// Lightweight scene choreography; no continuous JavaScript animation loop.
const reactor = document.querySelector('.reactor');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (reactor && !reducedMotion.matches) {
  document.querySelectorAll('.campaign-intro, .section-heading, .steps li, .closing').forEach(section => section.classList.add('revealing'));
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }), { threshold: .08 });
  document.querySelectorAll('.revealing').forEach(section => revealObserver.observe(section));


}

// Source-only prompt page: the visual scene never renders the prompt.
document.querySelectorAll('.binary-field:not(.hero-binary)').forEach(binaryField => {
  for (let i = 0; i < 12; i++) { const column = document.createElement('span'); column.className = 'binary-column'; column.textContent = '01 0010 101 0100 110 0001 1010 01'; column.style.left = (i * 9) + '%'; column.style.setProperty('--speed', (18 + i % 6 * 3) + 's'); column.style.animationDelay = (-i * 2) + 's'; binaryField.append(column); }

});
// Use cross-document View Transitions where supported, with a short exit fallback elsewhere.
if (!CSS.supports('view-transition-name: airfryer') && !reducedMotion.matches) {
  document.querySelectorAll('a[href]').forEach(link => link.addEventListener('click', event => {
    const url = new URL(link.href); if (url.origin !== location.origin || url.pathname === location.pathname || link.download || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault(); document.body.classList.add('page-leaving'); setTimeout(() => location.assign(url.href), 180);
  }));
}
window.addEventListener('pageshow', () => document.body.classList.remove('page-leaving'));

const codeCloud = document.querySelector('.binary-cloud');
if (codeCloud) {
  const points = [[2,4],[12,9],[24,3],[76,4],[86,10],[93,3],[1,24],[7,35],[2,51],[5,69],[1,82],[94,22],[89,37],[94,53],[91,71],[95,84],[3,94],[14,87],[26,95],[38,91],[62,95],[75,90],[85,96],[92,91]];
  const words = ['10101','010010','00110','1010010','0101','11001'];
  points.forEach(([x,y], index) => { const bit = document.createElement('span'); bit.textContent = words[index % words.length]; bit.style.left = x + '%'; bit.style.top = y + '%'; bit.style.fontSize = (13 + index % 3 * 3) + 'px'; bit.style.setProperty('--characters', String(words[index % words.length].length)); bit.style.setProperty('--duration',(3.2 + index % 4 * .35) + 's'); bit.style.setProperty('--delay',(-index * .47) + 's'); bit.style.setProperty('--strength', String(.14 + index % 4 * .035)); codeCloud.append(bit); });
}
if (reactor && config.heroVideo) {
  const projectRoot = new URL('./', document.querySelector('script[src*="config.js"]').src);
  const link = reactor.querySelector('.product-link'); const still = link.querySelector('img');
  const motion = document.createElement('video'); motion.className = 'hero-video'; motion.muted = true; motion.loop = true; motion.playsInline = true; motion.preload = 'auto'; motion.setAttribute('aria-hidden','true'); motion.disablePictureInPicture = true; motion.disableRemotePlayback = true;
  const ua = navigator.userAgent;
  const applePlayback = /iPhone|iPad|iPod/.test(ua) || (/Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua));
  const selectedVideo = applePlayback && config.heroVideoSafari ? config.heroVideoSafari : (matchMedia('(max-width: 700px)').matches && config.heroVideoMobile ? config.heroVideoMobile : config.heroVideo);
  if (config.heroVideoPoster) { motion.poster = new URL(config.heroVideoPoster, projectRoot).href; still.src = motion.poster; }
  motion.src = new URL(selectedVideo, projectRoot).href;
  link.append(motion);
  let visible = false;
  function showStill() { link.classList.remove('video-ready'); }
  function revealFrame() {
    if (!motion.paused && !reducedMotion.matches) link.classList.add('video-ready');
  }
  // Keep the image in place; fade in only after a decoded frame is presented.
  motion.addEventListener('playing', () => {
    if ('requestVideoFrameCallback' in motion) motion.requestVideoFrameCallback(revealFrame);
    else requestAnimationFrame(revealFrame);
  });
  async function updateHeroVideo() {
    if (visible && !document.hidden && !reducedMotion.matches) {
      if (!motion.getAttribute('src')) motion.src = new URL(selectedVideo, projectRoot).href;
      try { await motion.play(); } catch { showStill(); }
    } else { motion.pause(); if (reducedMotion.matches) showStill(); }
  }
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; updateHeroVideo(); },{threshold:.1}); observer.observe(reactor);
  document.addEventListener('visibilitychange',updateHeroVideo);
  reducedMotion.addEventListener('change',updateHeroVideo);
  motion.addEventListener('error',()=>{ observer.disconnect(); showStill(); });
  if (reducedMotion.matches) showStill();
}

// Suspend decorative loops outside the viewport and while the tab is hidden.
// Small heat particles and code share the same light transform/opacity animation.
document.querySelectorAll('.ember-field').forEach((field, sceneIndex) => {
  const particleCount = field.classList.contains('digital-embers') ? 80 : field.classList.contains('hero-embers') ? 64 : 48;
  for (let i = 0; i < particleCount; i++) {
    const ember = document.createElement('span');
    const isCode = i % 5 === 0;
    ember.className = isCode ? 'ember code-ember' : 'ember';
    if (isCode) ember.textContent = ['01', '1', '010', '0'][i % 4];
    const seed = (i * 37 + sceneIndex * 19) % 101;
    ember.style.setProperty('--x', seed + '%');
    ember.style.setProperty('--size', (1.2 + i % 3 * .7) + 'px');
    ember.style.setProperty('--life', (4.7 + i % 7 * .63) + 's');
    ember.style.setProperty('--wait', (-i * .79) + 's');
    ember.style.setProperty('--light', String(.5 + i % 4 * .13));
    ember.style.setProperty('--drift', (i % 2 ? 25 + seed : -20 - seed) + 'px');
    ember.style.setProperty('--rise', (300 + seed * 4) + 'px');
    ember.style.setProperty('--turn', (isCode ? 0 : i % 2 ? 38 : -32) + 'deg');
    field.append(ember);
  }
});
const animatedScenes = [...document.querySelectorAll('.hero-v3, .campaign-intro, .how, .film, .ticker, .closing, .digital-stage')];
const sceneVisibility = new Map();
function syncSceneAnimations() { animatedScenes.forEach(scene => scene.classList.toggle('scene-asleep', document.hidden || !sceneVisibility.get(scene))); }
const animationObserver = new IntersectionObserver(entries => { entries.forEach(entry => sceneVisibility.set(entry.target, entry.isIntersecting)); syncSceneAnimations(); }, {threshold: 0});
animatedScenes.forEach(scene => animationObserver.observe(scene));
document.addEventListener('visibilitychange', syncSceneAnimations);

// Irregular, brief chromatic splits of real image/text fragments.
// The source content never moves; only two clipped, inert copies appear.
const glitchTargets = [...document.querySelectorAll('.reactor .product, .hero-v3 .binary-cloud span, #hero-title, .story-part h2, .story-part p, .section-heading h2, .step-name, .steps p, .film-placeholder-label p, .closing h2, .closing .button-outline, footer p, .digital-product')];
let glitchTimer;
let previousGlitchTarget;
function chromaticBurst() {
  if (document.hidden || reducedMotion.matches) return;
  const visible = glitchTargets.filter(target => {
    const r = target.getBoundingClientRect();
    const style = getComputedStyle(target);
    return !target.hidden && r.width > 0 && style.visibility !== 'hidden' && Number(style.opacity) > .05 && r.top > 65 && r.bottom < innerHeight + 20;
  });
  const alternatives = visible.filter(target => target !== previousGlitchTarget);
  const candidates = alternatives.length ? alternatives : visible;
  const target = candidates[Math.floor(Math.random() * candidates.length)];
  if (target) {
    previousGlitchTarget = target;
    const rect = target.getBoundingClientRect();
    const style = getComputedStyle(target);
    const overlay = document.createElement('div');
    overlay.className = 'rgb-burst';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.inert = true;
    Object.assign(overlay.style, {left:rect.left+'px', top:rect.top+'px', width:rect.width+'px', height:rect.height+'px'});
    const slice = 10 + Math.random() * 72;
    const sliceLeft = 8 + Math.random() * 45;
    const sliceRight = Math.min(96, sliceLeft + 16 + Math.random() * 22);
    const thickness = target.tagName === 'IMG' ? 2 + Math.random()*3 : 8 + Math.random()*9;
    const offset = 2 + Math.random()*2.5;
    ['#ff3155', '#568dff'].forEach((color, index) => {
      const fragment = target.cloneNode(true);
      fragment.removeAttribute('id');
      fragment.removeAttribute('fetchpriority');
      fragment.querySelectorAll('[id]').forEach(child => child.removeAttribute('id'));
      fragment.className = 'rgb-fragment';
      Object.assign(fragment.style, {
        width:rect.width+'px',height:rect.height+'px',fontFamily:style.fontFamily,
        fontSize:style.fontSize,fontWeight:style.fontWeight,fontStyle:style.fontStyle,
        lineHeight:style.lineHeight,letterSpacing:style.letterSpacing,textAlign:style.textAlign,
        clipPath:`polygon(${sliceLeft}% ${slice}%,${sliceRight}% ${slice}%,${sliceRight}% ${slice+thickness}%,${sliceLeft}% ${slice+thickness}%)`
      });
      fragment.style.setProperty('--split',(index ? -offset : offset)+'px');
      fragment.style.setProperty('--rgb-color',color);
      fragment.style.setProperty('--rgb-filter',`sepia(1) saturate(6) hue-rotate(${index ? 175 : 305}deg)`);
      overlay.append(fragment);
    });
    document.body.append(overlay);
    setTimeout(() => overlay.remove(), 190);
  }
  glitchTimer = setTimeout(chromaticBurst, 1700 + Math.random()*3700);
}
function restartGlitches() {
  clearTimeout(glitchTimer);
  document.querySelectorAll('.rgb-burst').forEach(overlay => overlay.remove());
  if (!document.hidden && !reducedMotion.matches) glitchTimer = setTimeout(chromaticBurst, 900);
}
document.addEventListener('visibilitychange', restartGlitches);
reducedMotion.addEventListener('change', restartGlitches);
restartGlitches();

// Keep one copy button, positioned after the product on portrait phones.
const mobileHeroLayout = matchMedia('(max-width: 700px) and (orientation: portrait)');
const heroCopyAction = document.querySelector('.hero-cta');
const heroHeading = document.querySelector('.hero-heading');
function positionHeroAction() {
  if (!heroCopyAction || !heroHeading || !reactor) return;
  if (mobileHeroLayout.matches) reactor.after(heroCopyAction);
  else heroHeading.append(heroCopyAction);
}
mobileHeroLayout.addEventListener('change', positionHeroAction);
positionHeroAction();

// Reveal complete letters in the brand font, preserving the full line's geometry.
const typedInvitation = document.querySelector('.typed-text');
if (typedInvitation) {
  const phrase = 'Дожарь его';
  let typingTimer;
  let charIndex = 0;
  function typeInvitation() {
    clearTimeout(typingTimer);
    if (reducedMotion.matches) { typedInvitation.textContent = phrase; return; }
    const hero = document.querySelector('.hero');
    if (document.hidden || hero?.classList.contains('scene-asleep')) {
      typingTimer = setTimeout(typeInvitation, 600); return;
    }
    typedInvitation.textContent = phrase.slice(0, charIndex);
    if (charIndex < phrase.length) { charIndex++; typingTimer = setTimeout(typeInvitation, 95); }
    else { charIndex = 0; typingTimer = setTimeout(typeInvitation, 3400); }
  }
  reducedMotion.addEventListener('change', typeInvitation);
  document.addEventListener('visibilitychange', typeInvitation);
  typeInvitation();
}
