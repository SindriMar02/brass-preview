/* PANEL CHROME - engine behaviour.
   Three jobs: reveal on enter, the hover peek, the voice field.
   No scroll listeners anywhere. IntersectionObserver only. */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. the opening.
        The counter tracks real work: every image on the page reports in as it
        decodes. A floor keeps it from flashing past on a warm cache, a ceiling
        keeps a slow image from holding the door shut. */
  var loader = document.querySelector('[data-load]');

  function open() {
    document.documentElement.classList.remove('is-loading');
    document.documentElement.classList.add('is-ready');
  }

  if (!loader || reduce) {
    open();
  } else {
    var fill = loader.querySelector('[data-load-fill]');
    var num = loader.querySelector('[data-load-num]');
    /* Only the work that actually gates the first screen counts: the eager
       images and the webfonts. Lazy images below the fold never load until you
       scroll, so counting them would leave the meter stuck short forever. */
    var images = Array.prototype.slice.call(document.images).filter(function (img) {
      return img.loading !== 'lazy';
    });
    var total = images.length + 1;        // + the fonts
    var done = 0;
    var shown = 0;
    var started = Date.now();
    var MIN_MS = 900;                 // the mark deserves a beat on screen
    var MAX_MS = 5000;                // never let one slow image trap a visitor
    var finished = false;

    images.forEach(function (img) {
      if (img.complete) { done++; return; }
      var tick = function () { done++; };
      img.addEventListener('load', tick, { once: true });
      img.addEventListener('error', tick, { once: true });
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { done++; });
    } else {
      done++;
    }

    function paint() {
      var real = Math.round((done / total) * 100);
      var elapsed = Date.now() - started;
      /* the bar creeps on its own so it never looks frozen on a slow line, but
         it cannot claim 100 until the images have actually decoded. */
      var creep = Math.min(90, Math.round((elapsed / 2400) * 90));
      /* on a warm cache the work finishes in milliseconds; the mark still gets
         its beat on screen rather than flashing past. */
      var floor = Math.round((elapsed / MIN_MS) * 100);
      var target = real >= 100 ? Math.min(100, floor) : Math.max(Math.min(real, 96), creep);
      shown = Math.max(shown, target);     // the number never walks backwards
      num.textContent = shown;
      fill.style.width = shown + '%';

      if (!finished && ((shown >= 100 && elapsed >= MIN_MS) || elapsed > MAX_MS)) {
        finish();
        return;
      }
      if (!finished) window.requestAnimationFrame(paint);
    }

    function finish() {
      if (finished) return;
      finished = true;
      num.textContent = 100;
      fill.style.width = '100%';
      setTimeout(function () {
        loader.classList.add('is-done');
        open();
        setTimeout(function () { loader.remove(); }, 1000);
      }, 260);
    }

    window.requestAnimationFrame(paint);

    /* A background tab pauses requestAnimationFrame, so the loop above can
       stall at 100 and leave a visitor stuck behind the curtain when they come
       back. Timers keep running, so this is the door that always opens. */
    setTimeout(finish, MAX_MS + 400);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && !finished) {
        window.requestAnimationFrame(paint);
      }
    });
  }

  /* 2. reveal on enter */
  var targets = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* 3. the peek: a menu row hands you the dish it names */
  var rows = document.querySelectorAll('[data-peek]');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (rows.length && finePointer && !reduce) {
    var peek = document.createElement('img');
    peek.className = 'pc-peek';
    peek.alt = '';
    peek.setAttribute('aria-hidden', 'true');
    peek.decoding = 'async';
    document.body.appendChild(peek);

    var frame = 0, px = 0, py = 0;

    function place() {
      frame = 0;
      peek.style.translate = px + 'px ' + py + 'px';
    }

    rows.forEach(function (row) {
      row.addEventListener('pointerenter', function () {
        peek.src = row.getAttribute('data-peek');
        peek.classList.add('is-on');
      });
      row.addEventListener('pointerleave', function () {
        peek.classList.remove('is-on');
      });
      row.addEventListener('pointermove', function (event) {
        px = event.clientX + 150;
        py = event.clientY;
        // keep the frame on screen near the right edge
        if (px > window.innerWidth - 130) px = event.clientX - 150;
        if (!frame) frame = window.requestAnimationFrame(place);
      }, { passive: true });
    });
  }

  /* 4. voice field: real states, no fake success */
  var form = document.querySelector('[data-signup]');
  if (form) {
    var msg = form.querySelector('[data-signup-msg]');
    var input = form.querySelector('input');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var value = (input.value || '').trim();
      if (!value || value.indexOf('@') < 1 || value.indexOf('.') < 0) {
        msg.textContent = form.getAttribute('data-msg-invalid') || 'That address is missing something.';
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }
      input.removeAttribute('aria-invalid');
      msg.textContent = form.getAttribute('data-msg-ok') || 'On the list. See you soon.';
      form.reset();
    });
  }
})();

/* the slim bar arrives once the hero is behind you */
(function () {
  var bar = document.querySelector('[data-bar]');
  /* the hero is sticky, so its own rect never leaves the viewport. A zero-height
     sentinel sitting directly below it is what actually crosses the top edge. */
  var sentinel = document.querySelector('[data-sentinel]');
  if (!bar || !sentinel || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      bar.classList.toggle('is-on', e.boundingClientRect.top <= 0 && !e.isIntersecting);
    });
  }, { threshold: 0 });
  io.observe(sentinel);
})();

/* the pinned course sequence: three spacer steps decide which course is lit */
(function () {
  var stage = document.querySelector('[data-stage]');
  if (!stage || !('IntersectionObserver' in window)) return;

  var steps = document.querySelectorAll('[data-step]');
  var count = stage.querySelector('[data-count]');
  if (!steps.length) return;

  /* no-JS and reduced-motion readers get all three courses stacked, so the
     sequence must never be the only way to reach two thirds of the menu. */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var i = e.target.getAttribute('data-step');
      stage.setAttribute('data-active', i);
      if (count) count.textContent = String(Number(i) + 1).padStart(2, '0');
    });
  }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

  steps.forEach(function (s) { io.observe(s); });
})();
