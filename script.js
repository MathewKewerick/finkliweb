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

})();
