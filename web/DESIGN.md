# Finkli Web — Design & Implementation Reference

Quick-start dokument pro AI agenty pracující na tomto projektu.
Přečtěte si tento soubor PRVNÍ, ušetří vám 90 % tokenů na "objevování" konvencí.

---

## Projekt v 1 odstavci

Finkli je moderní finanční služba (pozicovaná jako *finanční klinika*, ne klasický poradce).
Onepager / landing page sloužící jako vizitka — kam odkazovat klienty. Cíl: působit
moderně, prémiově, klidně, partnersky. Vyhnout se klasickému "fintech salesy" tónu
a vystoupit z davu finančních poradců.

---

## Tech stack

- **Čisté HTML + CSS + vanilla JS** — žádné dependencies, žádný build, žádný npm
- Funguje nahozením na jakýkoliv statický hosting (Netlify, GitHub Pages, FTP, atd.)
- **Google Sans Flex** přes Google Fonts CDN (jediný external resource)
- Žádné pluginy, žádné placené služby

**Workspace folder:** `/Users/matejkrejcik/Documents/Finkli web claude/web/`

**Struktura:**
```
web/
├── index.html        ← hlavní stránka
├── styles.css        ← veškerý styling (cca 1700+ řádků)
├── script.js         ← header scroll, mobile menu, diagnostika, hero parallax
├── DESIGN.md         ← tento soubor
└── assets/
    ├── logo SVG (finkli_logo_dark.svg, finkli_logo_light.svg)
    ├── favicon (ikona_favicon.svg)
    ├── hero deko (finkli_vector_line.svg)
    ├── kompas (kompas.png) — v Kdo jsme kartě
    ├── kolecko_text.svg — cyklus diagram (5 kroků + dashed return)
    ├── area ikony (cile_icon.png, pojisteni_icon.png, uvery_icon.png)
    ├── cyklus krok ikony (analyza, plan, nastaveni, realizace, pece)
    ├── balíček ikony (silver, silver+, gold)
    ├── EUCS ikona (eucs_icon.png)
    ├── balon ikona (finkli_baloon_icon.png) — pro Rodinu
    ├── myPlann image (myplann_image.png)
    └── profilovky týmu (finkli_profilovka_jarda.jpg, finkli_profilovka_matej.jpg)
```

---

## Design tokeny (v `:root` v styles.css)

**Tyhle hodnoty NEMĚŇTE — používejte je přes `var(--name)`:**

```css
:root {
  /* Brand */
  --brand-dark: #0B2E34;        /* primary dark (text, dark surfaces) */
  --brand-green: #03D98C;       /* signature green (CTAs, accents) */
  --brand-yellow: #FBD028;      /* golden accent (Gold balíček) */

  /* Surfaces */
  --bg-base: #F4FFF9;           /* page bg (mint) */
  --bg-mint-soft: #F3FCF8;
  --bg-mint-tint: #DDFBF0;      /* filled chip bg, soft mint highlights */
  --bg-mint-mid: #D8FAEC;
  --bg-mint-card: #EAFBF4;
  --bg-white: #FFFFFF;

  /* Text */
  --text-base: #0B2E34;
  --text-muted: rgba(11, 46, 52, 0.7);
  --text-soft: rgba(11, 46, 52, 0.55);

  /* Borders */
  --border-soft: rgba(11, 46, 52, 0.08);
  --border-green-soft: rgba(3, 217, 140, 0.16);

  /* Motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --hover-scale: 1.04;          /* global hover scale — tweak here, applies everywhere */
  --hover-duration: 0.28s;
}
```

---

## Klíčové patterns

### 1. Glass karta (used everywhere)

```css
background: rgba(255, 255, 255, 0.55);
border: 1px solid rgba(11, 46, 52, 0.05);
border-radius: 20px;
backdrop-filter: blur(20px) saturate(140%);
-webkit-backdrop-filter: blur(20px) saturate(140%);
box-shadow: 0 6px 22px rgba(11, 46, 52, 0.025);
padding: 28-40px (podle breakpointu);
```

Aplikováno na: `.coop-card`, `.area-card`, `.diagnostic__card`.
Light, vzdušné, sklo — ne těžký panel.

### 2. Hover na interaktivních prvcích

```css
.interactive {
  transition: transform var(--hover-duration) var(--ease);
}
.interactive:hover {
  transform: scale(var(--hover-scale));
}
```

**DŮLEŽITÉ — co NEdělat:**
- ❌ `transform: translateY(-Xpx)` — způsobí "skákání" layoutu a vizuální nekonzistenci
- ❌ Vlastní hover duration / scale — používejte globální `--hover-*` proměnné

**Coordinated hover** (více elementů reaguje na hover jednoho kontejneru):
- Příklad: `.area-card:hover` → pill border, divider color, icon scale všechny zároveň
- Důvod: jeden mouse event → 3-4 transitions → bohatší dojem bez šumu

### 3. Layout sekcí

Všechny sekce mají strukturu:
```html
<section class="section section--xyz" id="xyz">
  <div class="container">
    <div class="section__head">  <!-- pro hlavní H2 -->
      <h2 class="h2 section__title">Nadpis sekce</h2>
    </div>
    <!-- obsah -->
  </div>
</section>
```

- `.section` má padding 64-110px podle breakpointu
- `.container` má `max-width: 1200px` + auto margins
- `.section__head` má `max-width: 760px` (pro čitelnou délku řádků nadpisu)
- **Vše LEVO ZAROVNANÉ** — matchuje hero (H1 vlevo). Žádné `text-align: center` na H2/H3.
- Výjimka: `.section__head--center` modifier existuje pro centrované sekce, ale **na nových sekcích NEPOUŽÍVEJTE** — drží konzistenci.

### 4. Typografie

```css
.h1 { font-size: clamp(38px, 7.5vw, 64px); line-height: 1.02; font-weight: 600; }
.h2 { font-size: clamp(28px, 5vw, 44px);   line-height: 1.08; font-weight: 600; }
.h3 { font-size: clamp(22px, 3vw, 26px);   line-height: 1.18; font-weight: 600; }
.lead { font-size: 18px → 19px (768px+); line-height: 1.6; }
body  { font-size: 16px; line-height: 1.65; }
small { font-size: 14px; line-height: 1.6; color: var(--text-muted); }
strong { font-weight: 600; }  /* max bold — NIKDY ne ultra-bold */
```

- Pro nadpisy používejte `class="h1 / h2 / h3"` na příslušném `<h1/2/3>` elementu
- Lead paragraph (pod hlavním nadpisem): `class="lead"` — větší, prominent

### 5. Drifting backdrop (global)

V `body` jsou tři jemné zelené radial-gradient blobs, pomalu drftující (55s ease-in-out alternate). Vrstva `background-attachment: fixed` zajišťuje, že se vše chová jednotně napříč sekcemi — žádné zlomy mezi sekcemi.

Sekce by NEMĚLY mít vlastní solid background — nechte backdrop probleskovat.

---

## Brand voice

**Píšeme jako partner, ne prodejce:**
- "Finkli je Váš dlouhodobý partner ve financích" ✅
- "Začínáme tím, že spolu projdeme..." ✅
- "Nezačínáme produktem a nekončíme sjednáním" ✅
- ❌ Vyhnout se: "Kupte si...", "Naše služby zahrnují...", "Speciální nabídka..."

**Tone:**
- Klidný, sebevědomý, jasný
- Bez finančního žargonu (nebo s vysvětlením)
- Bez agresivního prodeje
- Partnersky, transparentně, dlouhodobě
- Formálně Vy/Vám/Vaše (s velkým V)

**Klíčové brand fráze (z letáku, můžete reuse):**
- "finance jsou příliš důležité na to, aby se řešily nahodile"
- "partnersky, transparentně a dlouhodobě"
- "Nezačínáme produktem a nekončíme sjednáním"
- "péče o finance je proces, ne jednorázová událost"
- "Většina poradců končí tam, kde my teprve začínáme"
- "s přehledem, systémem a klidem v rozhodování"

**Strong tag použití:**
- Zvýrazňujte jen klíčové fráze co jsou tvůj benefit nebo slib
- Ne na "důležité" nebo "pozor"
- Střídmě — max 1-2 strong na odstavec

---

## Sekce — stav

### ✅ Header (hotovo)
- Floating, glass, centered, max-width 640px
- Logo SVG vlevo, nav uprostřed (desktop), CTA Kontakt vpravo
- Mobile: hamburger menu → full-screen overlay
- Scroll state: header shadow se prohlubuje při scrollu

### ✅ Hero (hotovo) — `id="hero"`
- H1 vlevo, sub paragraph (lead style), 2 CTAs (Zjistit jak / Nezávazná konzultace)
- Brand vector deco vpravo (finkli_vector_line.svg) s parallax při scrollu
- Pod CTA: situations title + interaktivní diagnostika (8 chips)

### ✅ Diagnostika (hotovo, uvnitř hero) — `id="situace"`
- Klik na chip → karta s 3 yes/no otázkami → výsledek + lead form → thanks
- Grid-stacked views (chips vs karta) — žádné jumpy
- Auto-scroll karty do dolní 2/3 viewportu při kliku
- Lead form: Jméno (req) → Telefon (opt, CZ regex) → E-mail (req) → Poznámka (opt) + honeypot
- **Submission: napojeno na Web3Forms** — sdílená konstanta `WEB3FORMS` nahoře v `script.js`
  (endpoint + key). Subject: "Nový lead z diagnostiky – ${name}". Payload obsahuje
  jméno, telefon, email, situaci, číslovaný seznam Q&A a poznámku.
- Validace: jméno ≥ 2 znaky, email regex, telefon (pokud vyplněn) CZ formát
  `/^(\+420\s?)?\d{3}\s?\d{3}\s?\d{3}$/`. Při chybě = focus na první neplatné pole.
- Při fetch chybě = `.diagnostic__error` zpráva pod tlačítkem, formulář zůstává vyplněný.
- Po úspěchu: thanks ~2.8 s → auto `goBackToChips()` (zároveň resetuje error state).
- Progress: 3 segmenty místo "1/3"
- "Ano" zelený fill, "Ne" tmavý fill (#0B2E34)
- Karta centrovaná layoutem (Zpět vlevo, ostatní centrované)
- Result step: aha + CTA text nahoře přes celou šířku, form pod tím
  (1-col stacking, levé zarovnání). Form: jméno + telefon + email jako 3-col
  řada (`.diagnostic__form-row`) na ≥640px, na mobilu stack. Poznámka
  textarea pod tím přes celou šířku, nízká defaultní výška (52–140 px).

### ✅ Sekce "Jak ve Finkli s klienty spolupracujeme" (hotovo) — `id="onas"`
**3 sub-sekce uvnitř:**

1. **Wide karta "Kdo jsme a co děláme"** (`.coop-card--wide`)
   - Editorial 2-col grid: 1fr 1.7fr
   - Levý sloupec: H3 + kompas.png ikona
   - Pravý sloupec: 3 odstavce textu (brand voice z letáku)

2. **3 area karty "V jakých oblastech Vám pomáháme"** (`#oblasti`)
   - Card 1: Přání a cíle (Investice, Penze) → cile_icon.png
   - Card 2: Ochrana (Pojištění) → pojisteni_icon.png
   - Card 3: Financování (Úvěry) → uvery_icon.png
   - Centrované content uvnitř karty (icon → pill → sub → divider → text)
   - Coordinated hover: pill greens, divider greens, icon scales

3. **Cyklus diagram "Spolupráce ve Finkli v čase"**
   - Statické SVG (kolecko_text.svg) loaded jako `<img>`
   - Hover hotspoty: 5 invisible spans nad ikonami, decentní zelený soft halo na hover
   - Pod diagramem: cycle-note vysvětlující dashed green line

### ✅ News „Ze světa Finkli" (hotovo) — `id="aktuality"`
- Bento grid sekce mezi týmem (`#kontakt`) a formulářem (`#napsat`).
- H2 „Ze světa Finkli" + lead, levé zarovnání (stejný rytmus jako ostatní sekce).
- 4-col desktop / 2-col tablet / 1-col mobile. CSS Grid, žádný JS.
- Karty = hardcoded `<a class="news-card">` bloky (žádný JSON, žádný admin, žádné rendering JS).
- **Varianty pozadí:**
  - `news-card--with-image` — background `<img>` + dark gradient overlay, bílý text
  - `news-card--bg-mint` / `--bg-yellow` / `--bg-green` / `--bg-dark` / `--bg-white` — solid color
  - default = white glass (mirrors `.diagnostic__card`)
- **Velikosti (utility třídy):** `--1x1` (default), `--2x1`, `--3x1`, `--4x1`, `--1x2`, `--2x2`.
  Responsive collapse v CSS: na tabletu ≥2-col span → 2, na mobilu vše full-width.
- Hover = `scale(var(--hover-scale))` + shadow lift. U image karet i jemný zoom obrázku.
- Eyebrow chip vlevo nahoře (např. „Rozhovor", „Článek", „Metodika") — small green pill, barva
  se přepíná podle pozadí karty.
- První karta = rozhovor Jaroslava v Marianne (2×1). Obrázek `assets/news/marianne-zeny-investovani.jpg`
  je třeba stáhnout z Marianne (viz „Workflow pro přidání nové aktuality" níže).
- Placeholder karty (Metodika / Spouštíme Gold / Proč není péče jednorázová) — smazat/přepsat
  při přidání skutečných aktualit.

### ✅ Kontakt (hotovo) — `id="kontakt"` + `id="napsat"`
- **Po refactoru:** rozděleno na 2 sousedící sekce kvůli vložení `#aktuality` mezi tým a form:
  - `#kontakt` — `.contact-card` (mint glass, tým Finkli — Jaroslav, Matěj)
  - `#napsat` — `.contact-form-card` (white glass, formulář)
- Header CTA „Kontakt" (`href="#kontakt"`) stále scrolluje na tým.
- 2-col contact card s týmem + samostatná `.contact-form-card` (jméno / email / telefon / zpráva)
- **Submission: napojeno na Web3Forms** — používá sdílenou konstantu `WEB3FORMS`.
  Subject: "Nový lead z webu – ${name}". Payload: jméno, telefon, email, zpráva.
- Stejná validace jako diagnostika (jméno ≥ 2 znaky, email regex, telefon CZ regex).
- Honeypot pole `botcheck` pro Web3Forms spam protection.
- Po úspěchu: skryje se celý `.contact-form-card__layout` (head + form) a zobrazí se
  `.contact-form-card__thanks` přes celou šířku karty (mirror diagnostické UX).
  Po ~3,12 s (stejně jako diagnostika: `thanksHold 2800 + stepSwap 320`) se vrátí
  zpět původní form. Form je před tím `form.reset()`-nutý.
- Při chybě: `.contact-form__error` pod tlačítkem, form zůstává vyplněný.

### 🚧 TODO sekce

- **Přehled balíčků** (Silver / Silver+ / Gold) — připraveno texty
- **EUCS** sekce (Získejte více peněz z pojistné události)
- **Myslíme i na rodinu** (doplněk k balíčkům)
- **Tým Finkli** (Jaroslav, Matěj) — profilovky v assets
- **Footer** s mapou webu, kontakty, právními odkazy

---

## Klíčová rozhodnutí (proč jsme to udělali takhle)

1. **Hero chips → interaktivní diagnostika**
   Místo pasivního výpisu situací jsou chips entry point do diagnostiky.
   Cíl: hook + lead capture + edukace ("finance jsou propojené").

2. **Custom check ikona (organický badge tvar, ne kolečko)**
   Brand-specific tvar pro check itemy v balíčkách. SVG path je v původní ChatGPT JSX
   verzi (finkli_onepager_landing_page.jsx) — viewBox `0 0 32 32`, fill `#03D98C`,
   fajfka stroke je `#0B2E34` na světlé kartě a `#FFFFFF` na tmavé.

3. **Cyklus jako statické SVG, ne custom HTML/CSS**
   Zkoušeli jsme custom HTML/CSS pentagon s animacemi — uživatel preferoval statický
   SVG z Figmy (kolecko_text.svg). Custom verze v styles.css zůstává jako DEAD CODE
   pro případnou budoucí revival (sekce `.cycle__step--*` atd.).

4. **Levé zarovnání všeho**
   Hero je vlevo → web pro konzistenci levo-zarovnán napříč všemi sekcemi.
   Cyklus diagram je výjimka — figure pattern, vystředěný horizontálně.

5. **Cursor-following backdrop glow — vypnutý**
   Bylo to subjektivně rušivé, zakomentováno v `script.js` (search "Cursor-following
   backdrop glow"). Lze obnovit pokud bys to chtěl zpět.

6. **Email submission pro diagnostiku i kontakt → Web3Forms (napojeno)**
   Sdílená konfigurace nahoře v `script.js`:
   ```js
   const WEB3FORMS = {
     ENDPOINT: 'https://api.web3forms.com/submit',
     KEY: 'ceb00a21-2b48-4280-aaa9-b24f2fcf79d8',
   };
   ```
   Oba formuláře (diagnostika v hero + kontakt v `#kontakt`) ji používají.
   **Pokud se klíč v budoucnu změní, stačí přepsat jednu konstantu** — nic
   jiného se v kódu nemění. Web3Forms doc: https://docs.web3forms.com/.

7. **Velikost SVG kolecka**
   Texty v kolecko_text.svg jsou `<text>` elementy s font-size 8 (titles) a 6 (description).
   Velikost diagramu se ovládá přes max-width `.cycle-figure` (560/640/720px podle breakpointu).
   Font-family je "Google Sans Flex" ale prohlížeč může fallbacknout na system font, protože
   SVG loaded jako `<img>` runs in isolated mode.

---

## Konvence pro nové sekce / agenty

**Co DĚLAT:**
- Začněte přečtením `index.html` (jaké sekce existují) + relevantní časti `styles.css`
- Použijte existující design tokeny a patterns (glass karta, hover scale, levé zarovnání)
- Vlož novou `<section class="section section--xyz" id="xyz">` na správné místo v HTML
- Přidávejte nová CSS pravidla na konec souboru s komentářem ` =Section: XYZ= `
- Při nejasnosti se zeptejte uživatele 1× radši než iterovat 5×
- Mobile-first ve smyslu testovat mobile breakpoint (< 559px)
- Respektujte `prefers-reduced-motion` u animací

**Co NEDĚLAT:**
- ❌ Neměňte design tokeny v `:root`
- ❌ Nepoužívejte `transform: translateY(-Xpx)` pro hover (jen `scale`)
- ❌ Nepřidávejte JS framework (React, Vue, jQuery)
- ❌ Nepřidávejte CSS framework (Tailwind via CDN, Bootstrap)
- ❌ Nevymýšlejte nové hover patterns — používejte `--hover-scale` / `--hover-duration`
- ❌ Necentrujte text v hlavních nadpisech sekcí
- ❌ Nedělejte ultra-bold (font-weight 700+) — max semibold 600
- ❌ Nepřidávejte emoji do textů (pokud uživatel explicitně neřekne)

---

## Workflow pro přidání nové aktuality (sekce `#aktuality`)

Karty v `#aktuality` jsou hardcoded HTML bloky. Žádný build, žádný admin.
**Jak přidat novou aktualitu:**

1. **Obrázek** (pokud má karta být image varianta) → ulož do `/web/assets/news/{slug}.jpg`
   (např. `marianne-zeny-investovani.jpg`). Nepoužívej hot-linking — externí URL
   se mění.
2. **Otevři** `index.html`, najdi `<div class="news-bento">` v sekci `#aktuality`.
3. **Paste nový `<a class="news-card">` blok** podle existujícího vzoru. Tři varianty:
   - **Image:** `news-card--with-image` + `<img class="news-card__image">` + `<div class="news-card__overlay">`
   - **Solid color:** `news-card--bg-{mint|yellow|green|dark|white}`
   - **Glass (default):** žádný modifikátor — automaticky white glass
4. **Velikost** přes utility třídu na `<a>`: `--1x1` (default), `--2x1`, `--3x1`, `--4x1`, `--1x2`, `--2x2`.
5. **Eyebrow / title / desc** — uprav texty, drž brand voice (Vy/Vám, partnersky).
6. **Externí link** → vždy `target="_blank" rel="noopener noreferrer"`.
7. **Ulož, commit, deploy** — to je vše. Žádné další kroky.

Pokud začne karet být moc (10+), zvaž návrat k JSON/admin variantě
(viz původní `AKTUALITY_PROMPT.md`).

---

## Asi nejdůležitější:

**Pokud váháte mezi 2 návrhy, zeptejte se uživatele dřív než stavíte.**

Uživatel má dobrý vkus, jasnou vizi, a preferuje 1 vyladěnou variantu před 3 polovičatými iteracemi.
