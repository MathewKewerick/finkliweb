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

  // ----- Bento cycle pulse (tablet/desktop only) -----
  // Loop badge (krok 5) pulzuje každých 4,5 s — pevný interval, hover neruší.
  // 1 s po badge pulzuje i karta 1 (Analýza) — vizuálně potvrzuje uzavření cyklu.
  (function initBentoPulse() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (prefersReducedMotion) return;

    const badge = document.querySelector('.cycle-bento__loop');
    const anal  = document.querySelector('.cycle-bento__row .cycle-bento__cell:first-child');
    if (!badge || !anal) return;

    const PULSE_MS = 680;   // délka pulzu (shodná s chipy)
    const DELAY_MS = 1500;  // prodleva mezi badge a kartou Analýzy
    const INTERVAL = 4500;  // pevný interval mezi cykly

    function pulse() {
      badge.classList.add('cycle-bento__loop--pulse');
      setTimeout(() => badge.classList.remove('cycle-bento__loop--pulse'), PULSE_MS);

      setTimeout(() => {
        anal.classList.add('cycle-bento__cell--pulse');
        setTimeout(() => anal.classList.remove('cycle-bento__cell--pulse'), PULSE_MS);
      }, DELAY_MS);
    }

    // První pulz po 3 s, interval startuje AŽ po něm — jinak by setInterval
    // tikal od spuštění a druhý pulz přišel za 1,5 s místo 4,5 s.
    setTimeout(() => {
      pulse();
      setInterval(pulse, INTERVAL);
    }, 3000);
  })();

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
  /* Inicializace — FAQ */
  initShareTray('shareBtnFaq', 'shareTrayFaq', 'shareWaFaq', 'shareFbFaq', 'shareEmailFaq', 'shareCopyFaq', 'shareCopyLabelFaq');

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

    // Pro každou testimonial kartu: zjistíme, zda text přeteče přes line-clamp
    document.querySelectorAll('.testimonial-card').forEach(function (card) {
      const p = card.querySelector('.testimonial-card__quote p');
      if (!p) return;

      // Počkáme na vykreslení layoutu, pak porovnáme výšky
      requestAnimationFrame(function () {
        if (p.scrollHeight <= p.clientHeight + 2) return; // Nepřetéká — link nepotřebujeme

        var fullText = p.textContent;
        var name = (card.querySelector('.testimonial-card__name') || {}).textContent || '';
        var role = (card.querySelector('.testimonial-card__role') || {}).textContent || '';

        var btn = document.createElement('button');
        btn.className   = 'testimonial-read-more';
        btn.textContent = 'Přečíst celou recenzi →';
        btn.setAttribute('tabindex', '-1'); // fokus přebírá karta, ne button samotný
        btn.setAttribute('aria-hidden', 'true');

        // Klik na tlačítko — stopPropagation, aby se nespustil i card listener
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          openModal(fullText, name, role, card);
        });

        // Klik kdekoliv na kartě otevře modal
        card.classList.add('is-expandable');
        card.addEventListener('click', function () {
          openModal(fullText, name, role, card);
        });
        // Klávesnice: Enter / Space na kartě
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Přečíst celou recenzi — ' + name);
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(fullText, name, role, card);
          }
        });

        // Vložíme odkaz za <blockquote>, před <figcaption>
        var quote = card.querySelector('.testimonial-card__quote');
        if (quote && quote.nextSibling) {
          card.insertBefore(btn, quote.nextSibling);
        } else {
          card.appendChild(btn);
        }
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

  // ----- Mobilní chip pulse -----
  // Stejný rytmus jako desktop badge, ale bez podmínky hover:hover.
  (function initMobileChipPulse() {
    if (prefersReducedMotion) return;
    const mobileChip = document.querySelector('.cycle-steps__loop');
    if (!mobileChip) return;

    const PULSE_MS = 680;
    const INTERVAL = 4500;

    function pulse() {
      mobileChip.classList.add('cycle-steps__loop--pulse');
      setTimeout(() => mobileChip.classList.remove('cycle-steps__loop--pulse'), PULSE_MS);
    }

    setTimeout(() => {
      pulse();
      setInterval(pulse, INTERVAL);
    }, 3000);
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

  // ----- Předmět kontaktního formuláře — předvyplnění podle origine -----
  (function initContactSubject() {
    const select = document.getElementById('contact-subject');
    if (!select) return;

    function setSubject(value) {
      select.value = value || 'Kontakt z webu';
    }

    // EUCS button → Sjednání garance EUCS
    document.querySelectorAll('.btn--eucs-report').forEach(function (btn) {
      btn.addEventListener('click', function () { setSubject('Sjednání garance EUCS'); });
    });

    // Packages CTA "Plán zdarma" (line in #balicky) + sticky widget btn → Plán zdarma
    // Identifikujeme je podle href="#kontakt-form" a přítomnosti třídy btn--primary
    // mimo hlavní nav (kde je jen obecné "Kontakt")
    var planSelectors = [
      '#balicky a.btn--primary[href="#kontakt-form"]',
      '.cta-widget__btn',
    ];
    planSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (btn) {
        btn.addEventListener('click', function () { setSubject('Plán zdarma'); });
      });
    });

    // Dynamicky přidaný widget se vytvoří až po tomto kódu — použijeme delegaci na body
    document.body.addEventListener('click', function (e) {
      if (e.target.closest('.cta-widget__btn')) { setSubject('Plán zdarma'); }
    });
  })();

  // ----- Sticky CTA widget -----
  (function initCtaWidget() {
    const trigger = document.getElementById('aplikace');
    if (!trigger) return;

    const widget = document.createElement('div');
    widget.className = 'cta-widget';
    widget.setAttribute('role', 'complementary');
    widget.setAttribute('aria-label', 'Nezávazný finanční plán zdarma');
    widget.innerHTML =
      '<button class="cta-widget__minimize" aria-label="Minimalizovat">−</button>' +
      '<div class="cta-widget__body">' +
        '<p class="cta-widget__title">Líbí se Vám náš koncept spolupráce?</p>' +
        '<p class="cta-widget__sub">Připravíme Vám ukázkový finanční plán zdarma. Žádný závazek, jen konkrétní představa.</p>' +
        '<a href="#kontakt-form" class="btn btn--primary cta-widget__btn">Chci zkusit plán zdarma</a>' +
      '</div>' +
      '<span class="cta-widget__pill">Plán zdarma <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0"/><path d="M15 16l4 -4"/><path d="M15 8l4 4"/></svg></span>';
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

})();
