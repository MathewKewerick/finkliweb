/* Finkli — minimal JS
   - Header scrolled state
   - Mobile menu open/close
   - Hero parallax (subtle, RAF-throttled, respects prefers-reduced-motion)
   - Close mobile menu on nav link click + Esc
   - Web3Forms submission for diagnostic + contact form (shared config below)
*/

/* ----- Web3Forms (shared by both lead forms — diagnostika + kontakt) -----
   Pokud se klíč v budoucnu změní, stačí přepsat hodnotu KEY na jednom místě
   a oba formuláře ji okamžitě používají. Endpoint zůstává.            */
const WEB3FORMS = {
  ENDPOINT: 'https://api.web3forms.com/submit',
  KEY: 'ceb00a21-2b48-4280-aaa9-b24f2fcf79d8',
};

(function () {
  'use strict';

  const header = document.getElementById('site-header');
  const burger = document.querySelector('.header__burger');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.querySelector('.mobile-menu__close');
  const heroDeco = document.querySelector('.hero__deco');
  const heroVisual = document.querySelector('.hero__visual');

  // Respect user's reduced-motion preference
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- Combined scroll handler (header state + parallax) -----
  let ticking = false;

  const updateOnScroll = () => {
    const y = window.scrollY;

    // Header scrolled state
    if (header) {
      if (y > 24) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    }

    // Hero deco parallax — subtle factor ~0.18
    // Only apply while hero is still influencing layout
    if (heroDeco && !prefersReducedMotion && y < 1200) {
      heroDeco.style.setProperty('--parallax-y', `${y * 0.18}px`);
    }

    // Hero visual (finklihero graphic) parallax — even more subtle, just a
    // gentle drift so the graphic feels alive without distracting from copy.
    if (heroVisual && !prefersReducedMotion && y < 1200) {
      heroVisual.style.setProperty('--parallax-y', `${y * 0.04}px`);
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  };

  updateOnScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ----- Mobile menu -----
  const openMenu = () => {
    if (!menu || !burger) return;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    if (!menu || !burger) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (burger) burger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on link click
  if (menu) {
    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeMenu);
    });
  }

  // ----- Mobile "O nás" submenu toggle (accordion) -----
  // Tap na šipku vedle "O nás" rozbalí/schová 3 pilíře, tap na samotný text
  // "O nás" pořád normálně naviguje (a mobile menu se zavře jako u ostatních
  // odkazů — closeMenu níže se váže jen na <a>, ne na toto tlačítko).
  document.querySelectorAll('.mobile-menu__nav-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const submenu = document.getElementById(toggle.getAttribute('aria-controls'));
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      if (submenu) submenu.classList.toggle('is-open', !isOpen);
    });
  });

  // Close on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ==========================================================================
     Diagnostic flow
     Chips → card with Q1 (→ Q2 → Q3) → result + lead form → thanks → chips.
     Pure vanilla JS, no dependencies. Lead form submituje na Web3Forms — viz
     submitLead() níže. Konfigurace (endpoint + key) je sdílená v konstantě
     WEB3FORMS nahoře v souboru.
     ========================================================================== */
  (function () {
    const root = document.getElementById('diagnostic');
    if (!root) return;

    // ----- Content data (1 entry per situation, in chip order) -----
    const SITUATIONS = [
      {
        title: 'Chci konečně přehled o svých financích',
        questions: [
          'Víte, kolik Vám měsíčně odchází na pravidelných platbách?',
          'Máte všechny smlouvy a finanční produkty na jednom místě?',
          'Máte jasno, co řešit jako první a co může počkat?',
        ],
        result: 'Přehled není jen seznam smluv. Je to schopnost vidět, kam peníze odchází, co dává smysl a jaké rozhodnutí má přijít jako další.',
      },
      {
        title: 'Řeším hypotéku, úvěr nebo refinancování',
        questions: [
          'Víte, jak velkou část Vašeho měsíčního příjmu tvoří splátky úvěrů?',
          'Máte rezervu pro případ výpadku příjmu nebo růstu výdajů?',
          'Víte, jak úvěr zapadá do dalších cílů, například investic, rodiny nebo důchodu?',
        ],
        result: 'Úvěr není jen o sazbě. Důležité je, aby splátka neohrozila zbytek finančního života a aby úvěr zapadal do celého plánu.',
      },
      {
        title: 'Čeká mě velké životní rozhodnutí',
        questions: [
          'Víte, jak toto rozhodnutí ovlivní Vaše měsíční výdaje?',
          'Máte připravenou rezervu pro přechodné období?',
          'Víte, které smlouvy nebo produkty bude potřeba upravit?',
        ],
        result: 'Velká životní změna často mění celý finanční plán. Nejde jen o jedno rozhodnutí, ale o to, jak se promítne do příjmů, výdajů, ochrany i dlouhodobých cílů.',
      },
      {
        title: 'Mám produkty, ale nevím, zda fungují správně',
        questions: [
          'Víte, proč máte každý produkt sjednaný?',
          'Kontroloval Vám někdo smlouvy v posledních 12–24 měsících?',
          'Navazují Vaše produkty na aktuální životní situaci a cíle?',
        ],
        result: 'Mít produkty nestačí. Důležité je, jestli dávají smysl dohromady, odpovídají Vaší situaci a nejsou jen historickým rozhodnutím, které už neplatí.',
      },
      {
        title: 'Podnikám a chci mít finance i důchod pod kontrolou',
        questions: [
          'Oddělujete osobní a firemní finance?',
          'Máte vyřešený výpadek příjmu, nemoc nebo delší pracovní pauzu?',
          'Vytváříte si dlouhodobý majetek mimo firmu?',
        ],
        result: 'U podnikatelů je důležité nespoléhat jen na firmu. Osobní rezerva, ochrana příjmu a budování majetku mimo podnikání vytváří stabilitu i svobodu do budoucna.',
      },
      {
        title: 'Začínám investovat',
        questions: [
          'Máte rezervu alespoň na 3–6 měsíců běžných výdajů?',
          'Víte, k jakému cíli investujete a kdy budete peníze potřebovat?',
          'Máte vyřešené základní zajištění příjmu a větších rizik?',
        ],
        result: 'Investování nezačíná výběrem produktu. Nejdřív je potřeba vědět, proč investujete, na jak dlouho a jestli Vás neohrozí nečekaná situace.',
      },
      {
        title: 'Mám pojištění, ale nevím, zda mě skutečně chrání',
        questions: [
          'Víte, jaké konkrétní situace Vaše pojištění kryje?',
          'Odpovídají pojistné částky Vašim příjmům, závazkům a rodině?',
          'Kontroloval někdo Vaše pojištění po změně práce, příjmu, hypotéky nebo rodiny?',
        ],
        result: 'Pojištění má chránit konkrétní rizika, ne jen existovat jako smlouva. Klíčové je, zda odpovídá Vaší aktuální situaci a tomu, co by se reálně stalo při problému.',
      },
      {
        title: 'Začínám a chci to dělat správně',
        questions: [
          'Máte vytvořenou základní rezervu?',
          'Víte, jak si rozdělit peníze mezi běžné výdaje, rezervu, cíle a budoucnost?',
          'Máte někoho, s kým můžete finanční rozhodnutí průběžně konzultovat?',
        ],
        result: 'Nejdůležitější je nezačít nahodile. Dobrý základ znamená přehled, rezervu, jasné priority a systém, který se dá postupně rozvíjet.',
      },
    ];

    // ----- Web3Forms config je sdílená v konstantě WEB3FORMS nahoře v souboru.
    //       Tady už nic ručně neplníme — kdyby se měnil klíč, jeden řádek nahoře.

    // ----- Validation helpers (sdílené i s kontaktním formulářem dole) -----
    const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const RE_PHONE_CZ = /^(\+420\s?)?\d{3}\s?\d{3}\s?\d{3}$/;

    // ----- DOM refs -----
    const viewChips  = root.querySelector('[data-view="chips"]');
    const viewCard   = root.querySelector('[data-view="card"]');
    const chipButtons = root.querySelectorAll('[data-situation]');

    const elBack     = root.querySelector('[data-action="back"]');
    const elProgress = root.querySelector('[data-progress]');
    const elSitLabel = root.querySelector('[data-situation-label]');

    const stepQuestion = root.querySelector('[data-step="question"]');
    const stepResult   = root.querySelector('[data-step="result"]');
    const stepThanks   = root.querySelector('[data-step="thanks"]');

    const elQuestion = root.querySelector('[data-question]');
    const elResult   = root.querySelector('[data-result]');
    const elAnswers  = root.querySelectorAll('[data-answer]');
    const elForm     = root.querySelector('[data-form]');
    const elFormError = elForm.querySelector('[data-error]');

    function showFormError(msg) {
      if (!elFormError) return;
      elFormError.textContent = msg;
      elFormError.hidden = false;
    }
    function clearFormError() {
      if (!elFormError) return;
      elFormError.textContent = '';
      elFormError.hidden = true;
    }

    // ----- State -----
    const state = {
      view: 'chips',            // 'chips' | 'card'
      step: 'question',         // 'question' | 'result' | 'thanks'
      situationIndex: null,
      currentQuestion: 0,
      answers: [],
      locked: false,            // prevents double-clicks mid-animation
      originalScroll: null,     // scrollY at the moment user clicked a chip
    };

    const TIMING = {
      viewSwap: 380,    // chips ↔ card transition
      stepSwap: 320,    // q1 → q2 → result transitions
      thanksHold: 2800, // how long "Děkujeme" sits before auto-closing
    };

    // ----- Helpers -----
    // Views and steps are grid-stacked — switching is a simple crossfade
    // via is-active class. The element NOT having is-active is invisible
    // but still in layout, so heights stay constant — no section jumping.
    function activateView(viewEl) {
      [viewChips, viewCard].forEach((v) => v.classList.toggle('is-active', v === viewEl));
    }

    function setStep(stepName) {
      state.step = stepName;
      [stepQuestion, stepResult, stepThanks].forEach((s) => {
        s.classList.toggle('is-active', s.dataset.step === stepName);
      });
    }

    function setProgress(currentStep, totalSteps) {
      // Update the segment-progress (1..totalSteps). Also updates the aria
      // label so screen readers announce progress changes.
      elProgress.setAttribute('data-current', String(currentStep));
      elProgress.setAttribute('aria-label', `Krok ${currentStep} ze ${totalSteps}`);
    }

    // Smooth-scroll the card into its "comfortable" viewport position —
    // top of the card at ~30% of viewport height (i.e. card occupies the
    // lower 2/3 of the screen). H1 + CTAs stay visible above the card.
    function scrollCardIntoView() {
      const card = root.querySelector('.diagnostic__card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardAbsTop = rect.top + window.scrollY;
      const targetScroll = cardAbsTop - (window.innerHeight * 0.30);
      window.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }

    function scrollToOriginalPosition() {
      if (state.originalScroll == null) return;
      window.scrollTo({
        top: state.originalScroll,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }

    function renderQuestion() {
      const sit = SITUATIONS[state.situationIndex];
      elSitLabel.textContent = sit.title;
      elQuestion.textContent = sit.questions[state.currentQuestion];
      setProgress(state.currentQuestion + 1, sit.questions.length);
    }

    function renderResult() {
      const sit = SITUATIONS[state.situationIndex];
      // For MVP: fixed result per situation. (Spec mentioned optional
      // "více Ne → edukativní / více Ano → pozitivní" variant — skipped now,
      // wire via state.answers in this function when ready.)
      elResult.textContent = sit.result;
      setProgress(sit.questions.length, sit.questions.length);  // all filled
    }

    const qContent = root.querySelector('[data-question-content]');

    // ----- Flow handlers -----
    function startDiagnostic(situationIndex) {
      if (state.locked) return;
      state.locked = true;

      // Remember where the user was so "Back" can return them there smoothly
      state.originalScroll = window.scrollY;

      state.situationIndex = situationIndex;
      state.currentQuestion = 0;
      state.answers = [];

      // Make sure card is on the question step before the crossfade
      setStep('question');
      renderQuestion();

      activateView(viewCard);
      state.view = 'card';

      // Plynulé sjetí: top karty se ocitne cca v 30% viewportu (lower 2/3)
      scrollCardIntoView();

      setTimeout(() => { state.locked = false; }, TIMING.viewSwap + 50);
    }

    function answer(value) {
      if (state.locked) return;
      const sit = SITUATIONS[state.situationIndex];
      state.answers.push({ question: sit.questions[state.currentQuestion], answer: value === 'yes' ? 'Ano' : 'Ne' });
      state.currentQuestion += 1;

      state.locked = true;

      if (state.currentQuestion < sit.questions.length) {
        // Same step, just swap the question content (fade text + answers)
        qContent.classList.add('is-fading');
        setTimeout(() => {
          renderQuestion();
          qContent.classList.remove('is-fading');
          setTimeout(() => { state.locked = false; }, TIMING.stepSwap);
        }, TIMING.stepSwap);
      } else {
        // Last question answered — animate to result step
        renderResult();
        setStep('result');
        state.step = 'result';
        setTimeout(() => { state.locked = false; }, TIMING.stepSwap + 50);
      }
    }

    function goBackToChips() {
      if (state.locked) return;
      state.locked = true;

      // Start crossfade back to chips
      activateView(viewChips);
      state.view = 'chips';

      // Plynulý návrat na pozici, kde uživatel byl před klikem na chip
      scrollToOriginalPosition();

      // After the fade has played, quietly reset internal state. We do it
      // late so the user doesn't see the card content change while it's
      // still partly visible.
      setTimeout(() => {
        state.situationIndex = null;
        state.currentQuestion = 0;
        state.answers = [];
        state.originalScroll = null;
        setStep('question');  // card reset for next open
        elForm.reset();       // wipe lead-form fields for next visitor
        clearFormError();     // hide any leftover network/error message
        state.locked = false;
      }, TIMING.viewSwap + 50);
    }

    async function submitLead(payload) {
      // Pošle payload do Web3Forms. Vrací true při úspěchu, false při chybě.
      // Pole jsou pojmenovaná česky — Web3Forms je posílá 1:1 do e-mailu,
      // takže příjemce uvidí přehledný "jméno / telefon / email / situace…" výpis.
      const qa = payload.answers
        .map((a, i) => `${i + 1}. ${a.question} → ${a.answer}`)
        .join('\n');

      const fd = new FormData();
      fd.append('access_key', WEB3FORMS.KEY);
      fd.append('subject', `Nový lead z diagnostiky – ${payload.name}`);
      fd.append('from_name', 'Finkli web — diagnostika');
      fd.append('replyto', payload.email);
      fd.append('jméno', payload.name);
      fd.append('telefon', payload.phone || '(nevyplněno)');
      fd.append('email', payload.email);
      fd.append('situace', payload.situation);
      fd.append('otázky_a_odpovědi', qa);
      fd.append('poznámka', payload.note || '(nevyplněno)');
      if (payload.botcheck) fd.append('botcheck', payload.botcheck);

      try {
        const res = await fetch(WEB3FORMS.ENDPOINT, { method: 'POST', body: fd });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json().catch(() => ({}));
        if (data && data.success === false) throw new Error(data.message || 'Web3Forms rejected');
        return true;
      } catch (err) {
        console.warn('[Finkli diagnostic] Web3Forms submission failed:', err);
        return false;
      }
    }

    // ----- Event wiring -----
    chipButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.situation);
        if (!Number.isNaN(idx)) {
          // Hide the hint arrow after first chip interaction — user clearly knows chips are clickable
          const hintArrow = root.querySelector('.chip-hint-arrow');
          if (hintArrow) hintArrow.classList.add('is-hidden');
          startDiagnostic(idx);
        }
      });
    });

    elAnswers.forEach((btn) => {
      btn.addEventListener('click', () => answer(btn.dataset.answer));
    });

    // ----- Auto-pulse chips (desktop only) -----
    // Randomly scales one chip at a time — same as hover, no hover needed.
    // Signals interactivity. Stops the moment user shows interest (mouseenter / click).
    (function initChipAutoPulse() {
      // Only on pointer devices (desktop) — touch users don't have hover affordance anyway
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      const chips = Array.from(chipButtons);
      let lastIdx = -1;
      let timer   = null;
      let active  = true;

      function stop() {
        active = false;
        clearTimeout(timer);
        // Clean up any lingering pulse class
        chips.forEach(c => c.classList.remove('chip--auto-pulse'));
      }

      function pulse() {
        if (!active) return;

        // Pick a random chip, never the same as last time
        let idx;
        do { idx = Math.floor(Math.random() * chips.length); }
        while (idx === lastIdx && chips.length > 1);
        lastIdx = idx;

        const chip = chips[idx];
        // Skip if user is already hovering this chip
        if (!chip.matches(':hover')) {
          chip.classList.add('chip--auto-pulse');
          setTimeout(() => chip.classList.remove('chip--auto-pulse'), 680);
        }

        // Next pulse: random 2.4 – 5 s gap
        timer = setTimeout(pulse, 2400 + Math.random() * 2600);
      }

      // Stop on any real user interaction with chips
      chips.forEach(c => c.addEventListener('mouseenter', stop, { once: true }));

      // First pulse after the page has settled
      timer = setTimeout(pulse, 2800);
    })();

    elBack.addEventListener('click', goBackToChips);

    elForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (state.locked) return;

      clearFormError();

      const elName  = elForm.querySelector('[name="name"]');
      const elPhone = elForm.querySelector('[name="phone"]');
      const elEmail = elForm.querySelector('[name="email"]');
      const elNote  = elForm.querySelector('[name="note"]');

      const name  = elName.value.trim();
      const phone = elPhone.value.trim();
      const email = elEmail.value.trim();
      const note  = elNote.value.trim();

      // Validace — najdi první neplatné pole, dej focus, end.
      if (name.length < 2) {
        elName.focus();
        return;
      }
      if (!email || !RE_EMAIL.test(email)) {
        elEmail.focus();
        return;
      }
      if (phone && !RE_PHONE_CZ.test(phone)) {
        elPhone.focus();
        return;
      }

      state.locked = true;

      const sit = SITUATIONS[state.situationIndex];
      const botcheck = elForm.querySelector('[name="botcheck"]');
      const payload = {
        situation: sit.title,
        answers: state.answers.slice(),
        result: sit.result,
        name,
        phone,
        email,
        note,
        botcheck: botcheck && botcheck.checked ? 'on' : '',
      };

      const submitBtn = elForm.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Odesílám…';
      submitBtn.disabled = true;

      const ok = await submitLead(payload);

      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;

      if (!ok) {
        // Síťová / API chyba — formulář zůstává vyplněný, ukážeme zprávu pod tlačítkem.
        showFormError('Něco se pokazilo, zkuste to prosím znovu nebo nám napište přímo na info@finkli.cz');
        state.locked = false;
        return;
      }

      // Show thanks
      setStep('thanks');
      state.step = 'thanks';

      // Unlock so the auto-close goBackToChips below isn't blocked
      setTimeout(() => { state.locked = false; }, TIMING.stepSwap + 50);

      // Auto-return to chips after the thanks hold
      setTimeout(() => {
        goBackToChips();
      }, TIMING.thanksHold + TIMING.stepSwap);
    });
  })();

  /* ==========================================================================
     Contact form (#contact-form)
     Wired to Web3Forms. Sdílí konstantu WEB3FORMS (endpoint + key) nahoře
     v souboru — stejný účet jako diagnostika, jeden řádek pro změnu klíče.
     ========================================================================== */
  (function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Card-level toggle: layout (head + form) ↔ card-thanks (přes celou kartu).
    // Stejné UX jako diagnostika — thanks viditelný ~3 s, pak návrat na form.
    const card       = form.closest('.contact-form-card');
    const layoutEl   = card && card.querySelector('[data-card-layout]');
    const thanksEl   = card && card.querySelector('[data-card-thanks]');
    const submitBtn  = form.querySelector('button[type="submit"]');
    const errorEl    = form.querySelector('[data-error]');

    // Match diagnostické TIMING.thanksHold (2800) + TIMING.stepSwap (320).
    const THANKS_DURATION_MS = 3120;
    let revertTimer = null;

    // ----- Validation (matchuje diagnostiku — stejné regexy) -----
    const RE_EMAIL    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const RE_PHONE_CZ = /^(\+420\s?)?\d{3}\s?\d{3}\s?\d{3}$/;

    function showError(msg) {
      if (!errorEl) return;
      errorEl.textContent = msg;
      errorEl.hidden = false;
    }
    function clearError() {
      if (!errorEl) return;
      errorEl.textContent = '';
      errorEl.hidden = true;
    }

    async function submitContact(payload) {
      const fd = new FormData();
      fd.append('access_key', WEB3FORMS.KEY);
      fd.append('subject', `Nový lead z webu – ${payload.name}`);
      fd.append('from_name', 'Finkli web — kontakt');
      fd.append('replyto', payload.email);
      fd.append('jméno', payload.name);
      fd.append('telefon', payload.phone || '(nevyplněno)');
      fd.append('email', payload.email);
      fd.append('zpráva', payload.message);
      if (payload.botcheck) fd.append('botcheck', payload.botcheck);

      try {
        const res = await fetch(WEB3FORMS.ENDPOINT, { method: 'POST', body: fd });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json().catch(() => ({}));
        if (data && data.success === false) throw new Error(data.message || 'Web3Forms rejected');
        return true;
      } catch (err) {
        console.warn('[Finkli contact] Web3Forms submission failed:', err);
        return false;
      }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError();

      const elName    = form.querySelector('[name="name"]');
      const elEmail   = form.querySelector('[name="email"]');
      const elPhone   = form.querySelector('[name="phone"]');
      const elMessage = form.querySelector('[name="message"]');

      const name    = elName.value.trim();
      const email   = elEmail.value.trim();
      const phone   = elPhone.value.trim();
      const message = elMessage.value.trim();

      // Inline validace — fokus na první neplatné pole.
      if (name.length < 2) {
        elName.focus();
        return;
      }
      if (!email || !RE_EMAIL.test(email)) {
        elEmail.focus();
        return;
      }
      if (phone && !RE_PHONE_CZ.test(phone)) {
        elPhone.focus();
        return;
      }
      if (!message) {
        elMessage.focus();
        return;
      }

      const botcheck = form.querySelector('[name="botcheck"]');

      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Odesílám…';
      submitBtn.disabled = true;

      const ok = await submitContact({
        name,
        email,
        phone,
        message,
        botcheck: botcheck && botcheck.checked ? 'on' : '',
      });

      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;

      if (!ok) {
        showError('Něco se pokazilo, zkuste to prosím znovu nebo nám napište přímo na info@finkli.cz');
        return;
      }

      // Úspěch — schovat celý layout (head + form), ukázat card-level thanks
      // přes celou šířku karty. Po ~3 s se vrátí původní form (stejné chování
      // jako diagnostika).
      form.reset();
      clearError();
      if (layoutEl && thanksEl) {
        layoutEl.hidden = true;
        thanksEl.hidden = false;

        if (revertTimer) clearTimeout(revertTimer);
        revertTimer = setTimeout(() => {
          thanksEl.hidden = true;
          layoutEl.hidden = false;
          revertTimer = null;
        }, THANKS_DURATION_MS);
      }
    });
  })();

  /* ==========================================================================
     Cycle reveal — DISABLED.
     Currently using static SVG (assets/kolecko.svg) for the cycle diagram.
     If we later switch back to the custom HTML/CSS cycle with step-by-step
     animation, restore this IntersectionObserver:

       const cycle = document.querySelector('.cycle');
       if (cycle) {
         if (prefersReducedMotion || !('IntersectionObserver' in window)) {
           cycle.classList.add('is-revealed');
         } else {
           const observer = new IntersectionObserver((entries) => {
             entries.forEach((entry) => {
               if (entry.isIntersecting) {
                 cycle.classList.add('is-revealed');
                 observer.disconnect();
               }
             });
           }, { threshold: 0.2 });
           observer.observe(cycle);
         }
       }
     ========================================================================== */

  /* ----- Cursor-following backdrop glow (ARCHIVED — kept for future use) -----
     Subtle spotlight in the background that lazily follows the mouse with
     RAF + lerp smoothing. Disabled on touch and reduced-motion.
     Decision: removed because it pulled attention. To re-enable, also
     re-add the matching radial layer in styles.css (search "ARCHIVED" or
     "cursor"). Uncomment the IIFE below.

  (function () {
    const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (coarsePointer || prefersReducedMotion) return;

    const body = document.body;
    let curX = 50, curY = 50;
    let tgtX = 50, tgtY = 50;
    let running = false;

    const step = () => {
      const dx = tgtX - curX;
      const dy = tgtY - curY;
      curX += dx * 0.08;
      curY += dy * 0.08;
      body.style.setProperty('--mx', curX.toFixed(2) + '%');
      body.style.setProperty('--my', curY.toFixed(2) + '%');
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        window.requestAnimationFrame(step);
      } else {
        running = false;
      }
    };

    window.addEventListener('mousemove', (e) => {
      tgtX = (e.clientX / window.innerWidth) * 100;
      tgtY = (e.clientY / window.innerHeight) * 100;
      if (!running) {
        running = true;
        window.requestAnimationFrame(step);
      }
    }, { passive: true });
  })();
  */

/* ---- Share tray (Poslat dál) — sdílená inicializační funkce ---- */
  function initShareTray(btnId, trayId, waId, fbId, emailId, copyId, copyLabelId) {
    const btn  = document.getElementById(btnId);
    const tray = document.getElementById(trayId);
    if (!btn || !tray) return;

    const url   = 'https://finkli.cz';
    const title = 'Finkli — finance s plánem a dlouhodobou péčí';
    const text  = 'Ahoj, své finance řeším ve Finkli. Můžeš se s nimi taky sejít na nezávaznou schůzku a probrat svou situaci. Přistupují ke každému klientovi opravdu komplexně a individuálně, ne jen jak ti prodat nějaký produkt.';

    document.getElementById(waId).href =
      'https://wa.me/?text=' + encodeURIComponent(text + ' ' + url);
    document.getElementById(fbId).href =
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    document.getElementById(emailId).href =
      'mailto:?subject=' + encodeURIComponent(title) +
      '&body=' + encodeURIComponent(text + '\n\n' + url);

    /* Portálovat do <body> — unikne stacking contextu backdrop-filter */
    document.body.appendChild(tray);

    function positionTray() {
      const r = btn.getBoundingClientRect();
      tray.style.top  = (r.bottom + window.scrollY + 8) + 'px';
      tray.style.left = (r.left  + window.scrollX) + 'px';
    }

    function openTray() {
      positionTray();
      tray.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => tray.classList.add('is-open'));
    }

    function closeTray() {
      tray.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      setTimeout(() => { tray.hidden = true; }, 180);
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      tray.hidden ? openTray() : closeTray();
    });

    window.addEventListener('scroll', () => { if (!tray.hidden) positionTray(); }, { passive: true });
    window.addEventListener('resize', () => { if (!tray.hidden) positionTray(); });

    document.addEventListener('click', (e) => {
      if (e.target !== btn && !tray.contains(e.target)) closeTray();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeTray();
    });

    document.getElementById(copyId).addEventListener('click', async () => {
      closeTray();
      const label = document.getElementById(copyLabelId);
      try {
        await navigator.clipboard.writeText(url);
        label.textContent = 'Zkopírováno ✓';
        setTimeout(() => { label.textContent = 'Kopírovat odkaz'; }, 2000);
      } catch { /* clipboard nedostupný */ }
    });
  }

  /* Inicializace — family note */
  initShareTray('shareBtn', 'shareTray', 'shareWa', 'shareFb', 'shareEmail', 'shareCopy', 'shareCopyLabel');

  // ----- Trust bar: count-up animace -----
  (function initTrustCountUp() {
    var nums = document.querySelectorAll('.hero__trust-number[data-target]');
    if (!nums.length) return;

    var duration = 1400; // ms
    var ease = function(t) { return 1 - Math.pow(1 - t, 3); }; // cubic ease-out

    function animateNum(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var start = performance.now();
      function step(now) {
        var t = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(ease(t) * target);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateNum(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    nums.forEach(function(el) { observer.observe(el); });
  })();

  // ----- Testimonials: avatar initials (automaticky z prvního písmene jména) -----
  document.querySelectorAll('.testimonial-card__avatar').forEach(function (avatar) {
    var nameEl = avatar.closest('.testimonial-card__author').querySelector('.testimonial-card__name');
    if (!nameEl) return;
    var firstLetter = nameEl.textContent.trim().charAt(0).toUpperCase();
    avatar.textContent = firstLetter;
  });

  // ----- Testimonials: line-clamp detekce + modal -----
  (function initTestimonialModal() {
    // Sestavíme modal DOM jednou (sdílený pro všechny karty)
    const overlay = document.createElement('div');
    overlay.className = 'testimonial-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Celá recenze');
    overlay.innerHTML =
      '<div class="testimonial-modal">' +
        '<button class="testimonial-modal__close" aria-label="Zavřít recenzi">Zavřít&nbsp;×</button>' +
        '<blockquote class="testimonial-modal__quote"><p></p></blockquote>' +
        '<footer class="testimonial-modal__author">' +
          '<span class="testimonial-modal__name"></span>' +
          '<span class="testimonial-modal__role"></span>' +
        '</footer>' +
      '</div>';
    document.body.appendChild(overlay);

    const modalP    = overlay.querySelector('.testimonial-modal__quote p');
    const modalName = overlay.querySelector('.testimonial-modal__name');
    const modalRole = overlay.querySelector('.testimonial-modal__role');
    const closeBtn  = overlay.querySelector('.testimonial-modal__close');

    // Uložíme si trigger (pro obnovení focusu po zavření)
    let lastTrigger = null;

    function openModal(text, name, role, trigger) {
      lastTrigger = trigger || null;
      modalP.textContent    = text;
      modalName.textContent = name;
      modalRole.textContent = role;
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
      lastTrigger = null;
    }

    // Zavření kliknutím na overlay (ne na samotný modal)
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    // Zavření klávesou Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });

    closeBtn.addEventListener('click', closeModal);

    // Pro každou testimonial kartu: zjistíme, zda text přeteče přes line-clamp.
    // Přetečení se může se změnou šířky okna (mobil ↔ desktop) měnit, proto se
    // kontrola opakuje i při resize — odkaz "Přečíst celou recenzi" se má
    // zobrazit jen tam, kde se recenze opravdu nevejde.
    document.querySelectorAll('.testimonial-card').forEach(function (card) {
      const p = card.querySelector('.testimonial-card__quote p');
      if (!p) return;

      const quote = card.querySelector('.testimonial-card__quote');
      const fullText = p.textContent;
      const name = (card.querySelector('.testimonial-card__name') || {}).textContent || '';
      const role = (card.querySelector('.testimonial-card__role') || {}).textContent || '';
      let btn = null;

      function setExpandable(isExpandable) {
        if (card._isExpandable === isExpandable) return; // beze změny
        card._isExpandable = isExpandable;

        if (isExpandable) {
          if (!btn) {
            btn = document.createElement('button');
            btn.className   = 'testimonial-read-more';
            btn.textContent = 'Přečíst celou recenzi →';
            btn.setAttribute('tabindex', '-1'); // fokus přebírá karta, ne button samotný
            btn.setAttribute('aria-hidden', 'true');

            // Klik na tlačítko — stopPropagation, aby se nespustil i card listener
            btn.addEventListener('click', function (e) {
              e.stopPropagation();
              openModal(fullText, name, role, card);
            });

            // Vložíme odkaz za <blockquote>, před <figcaption>
            if (quote && quote.nextSibling) {
              card.insertBefore(btn, quote.nextSibling);
            } else {
              card.appendChild(btn);
            }
          }
          btn.style.display = '';
          card.classList.add('is-expandable');
          card.setAttribute('role', 'button');
          card.setAttribute('tabindex', '0');
          card.setAttribute('aria-label', 'Přečíst celou recenzi — ' + name);
        } else {
          if (btn) btn.style.display = 'none';
          card.classList.remove('is-expandable');
          card.removeAttribute('role');
          card.removeAttribute('tabindex');
          card.removeAttribute('aria-label');
        }
      }

      // Klik kdekoliv na kartě otevře modal, ale jen pokud recenze skutečně přetéká
      card.addEventListener('click', function () {
        if (card._isExpandable) openModal(fullText, name, role, card);
      });
      // Klávesnice: Enter / Space na kartě
      card.addEventListener('keydown', function (e) {
        if (card._isExpandable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          openModal(fullText, name, role, card);
        }
      });

      function check() {
        setExpandable(p.scrollHeight > p.clientHeight + 2);
      }

      requestAnimationFrame(check);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(check);
      }

      let resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(check, 200);
      });
    });
  })();

  // ----- Smart store button — platform detection -----
  // iOS / macOS  → App Store   (Mac users have iPhones; iOS apps run on Apple Silicon)
  // Android      → Google Play
  // Windows / other → Google Play (most common non-Apple default)
  (function initStoreBtn() {
    const btn = document.getElementById('store-btn');
    if (!btn) return;

    const ua  = navigator.userAgent;
    const isIOS     = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isMac     = !isIOS && /Mac/i.test(ua);
    const useApple  = isIOS || isMac;

    btn.href = useApple ? btn.dataset.urlApple : btn.dataset.urlAndroid;
    btn.setAttribute('aria-label', useApple ? 'Stáhnout myPLANN z App Store' : 'Stáhnout myPLANN z Google Play');
  })();

  // ----- myPlann phone slider (crossfade) -----
  (function initPhoneSlider() {
    const phones = Array.from(document.querySelectorAll('.myplann__phone'));
    if (phones.length < 2) return;

    let current = 0;
    const INTERVAL = 3800;

    setInterval(() => {
      phones[current].classList.remove('is-active');
      current = (current + 1) % phones.length;
      phones[current].classList.add('is-active');
    }, INTERVAL);
  })();

// ----- Advisor profile modal -----
  (function initAdvisorModal() {
    const overlay = document.createElement('div');
    overlay.className = 'advisor-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Profil poradce');
    overlay.innerHTML =
      '<div class="advisor-modal">' +
        '<button class="advisor-modal__close" aria-label="Zavřít profil">Zavřít&nbsp;×</button>' +
        '<div class="advisor-modal__header">' +
          '<img class="advisor-modal__photo" src="" alt="" />' +
          '<div class="advisor-modal__identity">' +
            '<h3 class="advisor-modal__name"></h3>' +
            '<div class="advisor-modal__contacts">' +
              '<a class="advisor-modal__contact-link advisor-modal__email" href=""></a>' +
              '<a class="advisor-modal__contact-link advisor-modal__phone" href=""></a>' +
            '</div>' +
            '<p class="advisor-modal__ico"></p>' +
          '</div>' +
        '</div>' +
        '<p class="advisor-modal__bio"></p>' +
        '<a class="advisor-modal__efa" href="https://efpa.cz/zkousky/zkouska-efa" target="_blank" rel="noopener noreferrer">' +
          '<span class="advisor-modal__efa-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 15a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M13 17.5v4.5l2 -1.5l2 1.5v-4.5"/><path d="M10 19h-5a2 2 0 0 1 -2 -2v-10c0 -1.1 .9 -2 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -1 1.73"/><path d="M6 9l12 0"/><path d="M6 12l3 0"/><path d="M6 15l2 0"/></svg></span>' +
          '<span class="advisor-modal__efa-text">Certifikace EFA — European Financial Advisor' +
            '<span class="advisor-modal__efa-sub">Uděluje EFPA Czech Republic · efpa.cz</span>' +
          '</span>' +
        '</a>' +
        '<div class="advisor-modal__booking" hidden>' +
          '<p class="advisor-modal__booking-title">Rezervovat termín online</p>' +
          '<div class="advisor-modal__koalendar-wrap"><div id="advisor-koalendar-widget"></div></div>' +
        '</div>' +
        '<p class="advisor-modal__licenses-title">Licence a oprávnění</p>' +
        '<ul class="advisor-modal__licenses"></ul>' +
      '</div>';
    document.body.appendChild(overlay);

    const modalPhoto    = overlay.querySelector('.advisor-modal__photo');
    const modalName     = overlay.querySelector('.advisor-modal__name');
    const modalEmail    = overlay.querySelector('.advisor-modal__email');
    const modalPhone    = overlay.querySelector('.advisor-modal__phone');
    const modalIco      = overlay.querySelector('.advisor-modal__ico');
    const modalBio      = overlay.querySelector('.advisor-modal__bio');
    const modalEfa      = overlay.querySelector('.advisor-modal__efa');
    const modalLicenses = overlay.querySelector('.advisor-modal__licenses');
    const modalBooking  = overlay.querySelector('.advisor-modal__booking');
    const closeBtn      = overlay.querySelector('.advisor-modal__close');
    let lastTrigger     = null;

    function openModal(card) {
      lastTrigger = card;
      const d = card.dataset;
      modalPhoto.src         = d.photo || '';
      modalPhoto.alt         = d.name || '';
      modalName.textContent  = d.name || '';
      if (d.email) {
        modalEmail.href        = 'mailto:' + d.email;
        modalEmail.textContent = d.email;
        modalEmail.hidden      = false;
      } else {
        modalEmail.hidden = true;
      }
      if (d.phone) {
        var phoneDisplay = d.phone.replace(/(\+420)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
        modalPhone.href        = 'tel:' + d.phone;
        modalPhone.textContent = phoneDisplay;
        modalPhone.hidden      = false;
      } else {
        modalPhone.hidden = true;
      }
      modalIco.textContent  = d.ico ? 'IČO: ' + d.ico : '';
      modalBio.textContent  = d.bio || '';
      modalEfa.hidden = d.efa !== 'true';
      modalLicenses.innerHTML = '';
      (d.licenses || '').split('|').filter(Boolean).forEach(function (l) {
        const li = document.createElement('li');
        li.textContent = l.trim();
        modalLicenses.appendChild(li);
      });
      // Koalendar booking widget
      if (d.koalendar) {
        modalBooking.hidden = false;
        var kwrap = document.getElementById('advisor-koalendar-widget');
        kwrap.innerHTML = '';
        window.Koalendar = window.Koalendar || function () { (Koalendar.props = Koalendar.props || []).push(arguments); };
        if (!document.querySelector('script[src*="koalendar.com/assets/widget.js"]')) {
          var ks = document.createElement('script');
          ks.src = 'https://koalendar.com/assets/widget.js';
          ks.async = true;
          document.head.appendChild(ks);
        }
        Koalendar('inline', { url: 'https://koalendar.com/u/' + d.koalendar, selector: '#advisor-koalendar-widget' });
      } else {
        modalBooking.hidden = true;
      }
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
      lastTrigger = null;
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });
    closeBtn.addEventListener('click', closeModal);

    document.querySelectorAll('.contact-person[data-name]').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.contact-person__link')) return;
        if (e.target.closest('.contact-person__cta')) e.preventDefault();
        openModal(card);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card);
        }
      });
    });
  })();

  // ----- Předmět + zpráva kontaktního formuláře — předvyplnění podle origine -----
  (function initContactSubject() {
    const select = document.getElementById('contact-subject');
    if (!select) return;

    const MSG_EUCS = 'Dobrý den, líbí se mi služba Garance EUCS a chtěl bych se o ni dozvědět více, případně ji sjednat.';
    const MSG_PLAN = 'Dobrý den, mám zájem o spolupráci a rád bych využil nabídku prvního měsíce.';

    function setSubject(value) {
      select.value = value || 'Kontakt z webu';
    }

    function setMessage(text) {
      const textarea = document.querySelector('#contact-form [name="message"]');
      if (!textarea) return;
      textarea.value = text;
    }

    // Ruční přepnutí předmětu přímo v selectu (ne kliknutím na tlačítko) —
    // ať se zpráva přizpůsobí i tak, ne jen při příchodu z konkrétního CTA.
    const MESSAGE_BY_SUBJECT = {
      'První měsíc': MSG_PLAN,
      'Sjednání garance EUCS': MSG_EUCS,
      'Kontakt z webu': '',
    };
    select.addEventListener('change', function () {
      setMessage(MESSAGE_BY_SUBJECT[select.value] || '');
    });

    // EUCS button → Sjednání garance EUCS
    document.querySelectorAll('.btn--eucs-report').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setSubject('Sjednání garance EUCS');
        setMessage(MSG_EUCS);
      });
    });

    // Packages CTA "První měsíc" (line in #balicky) + sticky widget btn → První měsíc
    var planSelectors = [
      '#balicky a.btn--primary[href="#kontakt-form"]',
      '.cta-widget__btn',
    ];
    planSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (btn) {
        btn.addEventListener('click', function () {
          setSubject('První měsíc');
          setMessage(MSG_PLAN);
        });
      });
    });

    // Dynamicky přidaný widget se vytvoří až po tomto kódu — použijeme delegaci na body
    document.body.addEventListener('click', function (e) {
      if (e.target.closest('.cta-widget__btn')) {
        setSubject('První měsíc');
        setMessage(MSG_PLAN);
      }
    });

    // Všechny ostatní odkazy na formulář (header, mobilní menu, patička, hero
    // atd.) — vrátí výchozí předmět a smažou předvyplněnou zprávu, ať tam
    // nezůstane text z dřívějšího kliknutí na EUCS/První měsíc tlačítko.
    document.querySelectorAll('a[href="#kontakt-form"]').forEach(function (btn) {
      var isEucs = btn.classList.contains('btn--eucs-report');
      var isPlanPackage = btn.matches('#balicky a.btn--primary[href="#kontakt-form"]');
      var isCtaWidget = btn.classList.contains('cta-widget__btn');
      if (isEucs || isPlanPackage || isCtaWidget) return; // tyhle mají vlastní logiku výš

      btn.addEventListener('click', function () {
        setSubject('Kontakt z webu');
        setMessage('');
      });
    });
  })();

  // ----- Sticky CTA widget -----
  (function initCtaWidget() {
    const trigger = document.getElementById('balicky');
    if (!trigger) return;

    const widget = document.createElement('div');
    widget.className = 'cta-widget';
    widget.setAttribute('role', 'complementary');
    widget.setAttribute('aria-label', 'Nabídka pro nové klienty');
    widget.innerHTML =
      '<button class="cta-widget__minimize" aria-label="Minimalizovat">−</button>' +
      '<div class="cta-widget__body">' +
        '<p class="cta-widget__title">První měsíc spolupráce neúčtujeme</p>' +
        '<p class="cta-widget__sub">Nově příchozím klientům účtujeme spolupráci až od druhého měsíce. Budete tak mít dost času poznat, jak funguje, a pokud by Vám nesedla, můžete ji v prvním měsíci kdykoliv ukončit bez závazků.</p>' +
        '<a href="#kontakt-form" class="btn btn--primary cta-widget__btn">Chci začít spolupráci</a>' +
      '</div>' +
      '<span class="cta-widget__pill">První měsíc <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0"/><path d="M15 16l4 -4"/><path d="M15 8l4 4"/></svg></span>';
    document.body.appendChild(widget);

    const minBtn = widget.querySelector('.cta-widget__minimize');
    let minimized = false;
    let shown = false;

    function show() {
      if (shown) return;
      shown = true;
      // Small delay so the slide-in feels intentional, not instant
      setTimeout(function () { widget.classList.add('is-visible'); }, 120);
    }

    minBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      minimized = !minimized;
      widget.classList.toggle('is-minimized', minimized);
      minBtn.textContent = minimized ? '+' : '−';
      minBtn.setAttribute('aria-label', minimized ? 'Rozbalit' : 'Minimalizovat');
    });

    // Click on minimized pill → expand
    widget.addEventListener('click', function () {
      if (!minimized) return;
      minimized = false;
      widget.classList.remove('is-minimized');
      minBtn.textContent = '−';
      minBtn.setAttribute('aria-label', 'Minimalizovat');
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            show();
            observer.disconnect();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(trigger);
    } else {
      window.addEventListener('scroll', function onScroll() {
        var rect = trigger.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          show();
          window.removeEventListener('scroll', onScroll);
        }
      }, { passive: true });
    }
  })();

  // ----- Section reveal (fade + rise při scrollu) -----
  (function initSectionReveal() {
    if (prefersReducedMotion) return;
    if (!('IntersectionObserver' in window)) return;

    // Přidáme will-animate přes JS — bez JS sekce zůstanou viditelné (no flash)
    document.querySelectorAll('.section').forEach(function (s) {
      if (s.id === 'hero') return; // hero je above fold, neanimujeme
      s.classList.add('will-animate');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07 });

    document.querySelectorAll('.section.will-animate').forEach(function (s) {
      observer.observe(s);
    });
  })();


  // ----- Scroll-to-top tlačítko -----
  (function initScrollToTop() {
    var btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.setAttribute('aria-label', 'Zpět nahoru');
    btn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M9 13.5V4.5M9 4.5L4.5 9M9 4.5L13.5 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
    document.body.appendChild(btn);

    var shown = false;
    window.addEventListener('scroll', function () {
      var shouldShow = window.scrollY > 380;
      if (shouldShow === shown) return;
      shown = shouldShow;
      btn.classList.toggle('is-visible', shouldShow);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  })();

  // ----- Lazy image fade-in -----
  (function initLazyImageFade() {
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      function markLoaded() { img.classList.add('is-loaded'); }
      if (img.complete && img.naturalWidth > 0) {
        markLoaded();
      } else {
        img.addEventListener('load', markLoaded);
        img.addEventListener('error', markLoaded); // fade-in i při chybě (broken image)
      }
    });
  })();

  // ----- Propojovací šipky v diagramu cyklu (Realizace -> Pece a servis -> Analyza) -----
  // Pozice šipek počítáme z reálně vykreslené polohy karet, ne napevno,
  // protože výška karty "Péče a servis" se mění podle délky textu a šířky okna.
  // Šipky tak vždy trefí skutečný svislý střed karty, ne jen odhad.
  (function initCycleArrows() {
    var frame = document.querySelector('.cycle-bento');
    var wrap = document.querySelector('.cycle-bento__arrows');
    var svg = document.querySelector('.cycle-bento__arrows-svg');
    if (!frame || !wrap || !svg) return;

    var pathRight = svg.querySelector('.cycle-bento__arrow--right');
    var pathLeft = svg.querySelector('.cycle-bento__arrow--left');
    if (!pathRight || !pathLeft) return;

    function update() {
      if (getComputedStyle(wrap).display === 'none') return; // < 768px, šipky skryté

      var row = frame.querySelector('.cycle-bento__row');
      var cells = row ? row.querySelectorAll('.cycle-bento__cell') : [];
      var cardRealizace = cells[3];
      var cardAnalyza = cells[0];
      var cardPece = frame.querySelector('.cycle-bento__cell--wide');
      if (!cardRealizace || !cardAnalyza || !cardPece) return;

      var frameRect = frame.getBoundingClientRect();
      var rRect = cardRealizace.getBoundingClientRect();
      var aRect = cardAnalyza.getBoundingClientRect();
      var pRect = cardPece.getBoundingClientRect();

      svg.setAttribute('viewBox', '0 0 ' + frameRect.width + ' ' + frameRect.height);

      var peceCenterY = (pRect.top + pRect.height / 2) - frameRect.top;
      var peceRightX = pRect.right - frameRect.left;
      var peceLeftX = pRect.left - frameRect.left;

      var realizaceX = (rRect.left + rRect.width * 0.5) - frameRect.left;
      var realizaceBottomY = rRect.bottom - frameRect.top;

      var analyzaX = (aRect.left + aRect.width * 0.5) - frameRect.left;
      var analyzaBottomY = aRect.bottom - frameRect.top;

      // Malá mezera na obou koncích, ať se čára nedotýká/nepřekrývá s kartami,
      // a jednoduchý otevřený "hrot" (dvě čárky, žádná vyplněná trojúhelníková
      // šipka) na konci, orientovaný podle směru, kterým čára do karty vchází.
      var GAP = 22;
      var CHEVRON = 9;

      function chevron(tipX, tipY, ux, uy) {
        var backX = tipX - ux * CHEVRON;
        var backY = tipY - uy * CHEVRON;
        var perpX = -uy * CHEVRON;
        var perpY = ux * CHEVRON;
        var ax = backX + perpX, ay = backY + perpY;
        var bx = backX - perpX, by = backY - perpY;
        return ' M' + ax + ',' + ay + ' L' + tipX + ',' + tipY + ' L' + bx + ',' + by;
      }

      // ----- Šipka Realizace -> Péče a servis (vstup zprava) -----
      var rStartY = realizaceBottomY + GAP;
      var rTipX = peceRightX + GAP;
      pathRight.setAttribute(
        'd',
        'M' + realizaceX + ',' + rStartY +
        ' L' + realizaceX + ',' + peceCenterY +
        ' L' + rTipX + ',' + peceCenterY +
        chevron(rTipX, peceCenterY, -1, 0)
      );

      // ----- Šipka Péče a servis -> Analýza (vstup zdola) -----
      var lStartX = peceLeftX - GAP;
      var lTipY = analyzaBottomY + GAP;
      pathLeft.setAttribute(
        'd',
        'M' + lStartX + ',' + peceCenterY +
        ' L' + analyzaX + ',' + peceCenterY +
        ' L' + analyzaX + ',' + lTipY +
        chevron(analyzaX, lTipY, 0, -1)
      );
    }

    var scheduled = false;
    function scheduleUpdate() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        update();
      });
    }

    scheduleUpdate();
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleUpdate);
    }
    // Ikonky se dokreslí až po loadu, což může nepatrně změnit výšku karet.
    document.querySelectorAll('.cycle-bento__icon').forEach(function (img) {
      if (img.complete) return;
      img.addEventListener('load', scheduleUpdate);
    });
  })();

})();
