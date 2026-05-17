# Prompt pro nový chat — sekce „Ze světa Finkli"

> Krátký a fokusovaný brief. Postavit jen **veřejnou sekci** s aktualitami
> v bento gridu. Každá aktualita = hardcoded HTML blok přímo v `index.html`.
> Žádný JSON, žádný admin, žádný JS rendering. Nový článek = paste nového
> `<article>` bloku.

---

## TLDR

1. Vložit novou sekci **„Ze světa Finkli"** mezi kartu Týmu Finkli a kontaktní
   formulář.
2. Bento grid (různě velké karty: 1×1, 2×1, 3×1, 4×1, 1×2, 2×2).
3. Karty mají: nadpis, popisek, odkaz; volitelně obrázek **NEBO** barvu
   pozadí **NEBO** transparent (glass).
4. První článek je už hotový — **rozhovor v Marianne s Jaroslavem**. HTML
   blok je v sekci „První článek na zaplnění" níže, stačí ho vložit.

Stack zůstává čistý: HTML + CSS + vanilla JS, žádné dependencies, žádný
build. Funguje na statickém hostingu.

---

## Než cokoliv napíšeš — přečti

V tomto pořadí:

1. `/Users/matejkrejcik/Documents/Finkli web claude/web/DESIGN.md`
   Brand identita, design tokeny, patterns, co dělat / nedělat.
2. `/Users/matejkrejcik/Documents/Finkli web claude/web/index.html`
   Celá struktura. Hlavně sekce `#kontakt` na konci — to je místo, kde
   budeš zasahovat (`.contact-card` = mint glass s týmem, `.contact-form-card`
   = white glass s formulářem).
3. `/Users/matejkrejcik/Documents/Finkli web claude/web/styles.css`
   Relevantní patterns:
   - `.eucs-note` / `.contact-card` — mint glass recept
   - `.diagnostic__card` / `.contact-form-card` — white glass recept
   - `.area-card` — coordinated hover
   - `.package-card` — yellow accent (`--brand-yellow`)
   - `.btn` / `.btn--primary` / `.btn--secondary`
   - Glass recept (`rgba(255,255,255,0.55)` + `backdrop-filter`)
4. `/Users/matejkrejcik/Documents/Finkli web claude/web/script.js`
   Nezasahuješ tady, jen pro orientaci (jak jsou řešené existující IIFE).

---

## Kontext projektu

Finkli = finanční služba jako „finanční klinika". Onepager landing. Působit
moderně, prémiově, klidně, partnersky. Vyhnout se „fintech salesy" tónu.

**Stack:** Pure HTML + CSS + vanilla JS. Žádné dependencies, žádný build,
žádný framework.

**Brand voice:** partnerský, transparentní, dlouhodobý. Vy/Vám/Vaše velkým
V. Klidný, sebevědomý, bez žargonu.

**Design tokeny v `:root` styles.css — NEMĚŇ:**

- `--brand-dark: #0B2E34`
- `--brand-green: #03D98C`
- `--brand-yellow: #FBD028`
- `--bg-base: #F4FFF9`
- `--bg-mint-tint: #DDFBF0`
- `--hover-scale: 1.04`, `--hover-duration: 0.28s`

**Zlatá pravidla:**

- Glass karty (`rgba(255,255,255,0.55)` + `backdrop-filter: blur(20px)`)
- Hover = vždy `scale(var(--hover-scale))`, **NIKDY** `translateY`
- Sekce: `<section class="section section--xyz" id="xyz">` → `.container` → content
- `.section` má padding 64–110px (responzivní)
- **Levé zarovnání všeho** (texty, nadpisy, lead)
- Mobile-first, respektovat `prefers-reduced-motion`

---

## Stav webu na začátku tvé práce

Pořadí sekcí v `index.html`:

1. Header (floating glass)
2. `#hero` — H1 + lead + diagnostika
3. `#onas` — Jak spolupracujeme + cyklus
4. `#balicky` — Silver / Silver+ / Gold + family note + EUCS note
5. `#aplikace` — myPlann (open editorial)
6. **`#kontakt`** — tady zasahuješ:
   - `.contact-card` (mint glass, Tým Finkli)
   - `.contact-form-card` (white glass, formulář)

Tvůj zásah: vložit novou sekci **mezi** tyto dvě karty.

---

## Struktura — jak to udělat čistě

`#kontakt` aktuálně obsahuje obojí (lidi i formulář). Pro „mezi" je nejčistší
**rozdělit na 3 sousední sekce:**

```html
<section class="section section--contact" id="kontakt">
  <div class="container">
    <article class="contact-card">… lidé …</article>
  </div>
</section>

<section class="section section--news" id="aktuality">
  <div class="container">
    <div class="news-head">
      <h2 class="h2 news-head__title">Ze světa Finkli</h2>
      <p class="news-head__lead">Novinky, články, rozhovory a metodiky, které přibližují, jak o financích přemýšlíme.</p>
    </div>
    <div class="news-bento">
      <!-- <article class="news-card">…</article> × N -->
    </div>
  </div>
</section>

<section class="section section--contact-form" id="napsat">
  <div class="container">
    <article class="contact-form-card">… formulář …</article>
  </div>
</section>
```

> Header CTA „Kontakt" (`href="#kontakt"`) zůstává a scrolluje na lidi.
> Uživatel pak vidí pod sebou aktuality a formulář.

Pokud se uživatel rozhodne pro lazy variantu (news jako `<article>` přímo
uvnitř `#kontakt` mezi obě karty), funguje to taky vizuálně, ale je to
semantically divné („aktuality uvnitř kontaktu"). **Default = refactor.**
Zeptej se uživatele jedním dotazem, zda souhlasí.

---

## Bento grid mechanika

CSS Grid, 4 sloupce desktop, kolaps na 2 / 1 sloupec dle viewportu:

```css
.news-bento {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(220px, auto);
  gap: 16px;
}
@media (min-width: 640px) {
  .news-bento { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .news-bento {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}
```

Velikosti karet přes utility třídy nebo `data-size` atribut:

- `news-card--1x1` (default, square-ish)
- `news-card--2x1` — 2 sloupce, 1 řádek
- `news-card--3x1`, `news-card--4x1` (široké)
- `news-card--1x2`, `news-card--2x2` (vyšší)

**Responsive collapse:**

- `≥1024px` — respektuj uživatelem zvolenou velikost (`grid-column: span N; grid-row: span M;`)
- `640–1023px` — 2-col grid: cokoliv `cols ≥ 2` → span 2, jinak span 1
- `<640px` — všechny karty span 1 (full width)

Implementuj přes CSS (utility třídy s media queries) — žádný JS.

---

## Karta — varianty

**A) S obrázkem (background):**
- `<img>` jako absolute v kartě (object-fit: cover) nebo CSS `background-image`
- Tmavý gradient overlay (`linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55))`)
- Text vrstva v bílé barvě, pozicovaná dole

**B) Solidní barva pozadí, žádný obrázek:**
- Barva z palety: `mint` (`var(--bg-mint-tint)`), `yellow` (`var(--brand-yellow)`),
  `green` (`var(--brand-green)`), `dark` (`var(--brand-dark)`), `white`
- Text color se přepíná podle pozadí: světlý text na dark/green, tmavý na yellow/mint/white
- Implementuj přes modifikátorové třídy: `news-card--bg-yellow`, `news-card--bg-dark`, …

**C) Transparent (glass):**
- Stejný recept jako `.eucs-note` (mint glass) nebo `.diagnostic__card` (white glass)
- Default pro karty bez obrázku i bez explicitní barvy

### Vizuál karty

- `border-radius: 18–22px`
- `padding: 24–32px` podle velikosti
- Title (`<h3 class="h3">`)
- Popisek (1–2 věty, font-size 14–16px, line-height 1.6)
- Volitelný **eyebrow / tag** vlevo nahoře (např. "Rozhovor", "Článek", "Metodika") —
  malý badge, brand-green nebo brand-dark
- Celá karta = `<a>` wrap, `href="…"`. Pokud externí: `target="_blank" rel="noopener noreferrer"`

### Hover

- `transform: scale(var(--hover-scale))` (1.04)
- `box-shadow` lift
- `transition: var(--hover-duration) var(--ease)`
- Respekt `prefers-reduced-motion`
- **NIKDY** `translateY`

---

## První článek na zaplnění — rozhovor v Marianne

Tohle paste jako první `<article>` v bento gridu. Velikost doporučená **2×1**
(širší, ať se na úvod sekce vyjímá). Pokud uživatel chce, můžete použít i 2×2.

**Source data:**
- URL: https://www.marianne.cz/zivotni-styl/zeny-byly-v-investovani-lepsi-nez-muzi-ale-neveri-si-odbornik-radi-jak-bezpracne
- Title (Marianne): „Ženy by byly v investování lepší než muži, ale nevěří si. Odborník radí, jak bezpracně udělat z tisícovky dvě"
- Image: https://www.marianne.cz/sites/default/files/public/styles/facebook/public/2026-04/shutterstock_2691191197.jpg.webp?itok=9i8PZ5XX
- Datum: 27. 4. 2026
- Autor: Marina Pilařová (Marianne.cz), rozhovor s Jaroslavem Nedvědem (Finkli)

**Doporučený obsah karty (Finkli voice):**

- Eyebrow: `Rozhovor v Marianne`
- Title: `Ženy by byly v investování lepší než muži`
  *(zkrácená verze originálu — vejde se na 2 řádky)*
- Description: `Jaroslav v Marianne.cz o tom, proč mají ženy v investování přirozený náskok — a co je trpělivosti, plánu a "nudě" v investování bránit nemusí.`
- Link: plná URL na článek (externí, `target="_blank"`)

**Image strategy:**
- **Doporučeno:** stáhnout Marianne hero (`shutterstock_2691191197.jpg.webp`) do
  `/web/assets/news/marianne-zeny-investovani.jpg` a referencovat lokálně.
  Hot-linking je křehký a marianne.cz může změnit URL.
- Pokud uživatel nestáhne, lze dočasně použít přímou URL — funguje, ale je to
  technický dluh.

**Hotový HTML blok (paste ho jako první kartu v `.news-bento`):**

```html
<a class="news-card news-card--2x1 news-card--with-image"
   href="https://www.marianne.cz/zivotni-styl/zeny-byly-v-investovani-lepsi-nez-muzi-ale-neveri-si-odbornik-radi-jak-bezpracne"
   target="_blank" rel="noopener noreferrer">
  <img src="assets/news/marianne-zeny-investovani.jpg" alt="" class="news-card__image" />
  <div class="news-card__overlay"></div>
  <div class="news-card__body">
    <span class="news-card__eyebrow">Rozhovor v&nbsp;Marianne</span>
    <h3 class="h3 news-card__title">Ženy by byly v&nbsp;investování lepší než muži</h3>
    <p class="news-card__desc">Jaroslav v&nbsp;Marianne.cz o&nbsp;tom, proč mají ženy v&nbsp;investování přirozený náskok — a&nbsp;proč investování má být nuda, ne hra.</p>
  </div>
</a>
```

---

## Patterns, které musíš dodržet

### Glass karty
- White glass: `rgba(255, 255, 255, 0.55)` + `border: 1px solid rgba(11, 46, 52, 0.05)` + `backdrop-filter: blur(20px) saturate(140%)`
- Mint glass: `rgba(221, 251, 240, 0.85)` + `border: 1px solid rgba(3, 217, 140, 0.18)` + `backdrop-filter: blur(20px) saturate(140%)`

### Hover
- Vždy `transform: scale(var(--hover-scale))` (1.04)
- **NIKDY** `translateY`
- `@media (prefers-reduced-motion: reduce) { transform: none; }`

### Typografie
- H2: `<h2 class="h2 ...">` — clamp 28–44px
- H3: `<h3 class="h3 ...">` — clamp 22–26px
- Lead: 17–19px, line-height 1.65–1.7
- Strong tag střídmě (1–2× per odstavec max), `font-weight: 600`

### Section struktura
```html
<section class="section section--xyz" id="xyz">
  <div class="container"><!-- content --></div>
</section>
```

### Naming
- BEM-light: `news-bento`, `news-card`, `news-card__title`, `news-card--2x1`
- Stejný styl jako `.area-card`, `.coop-card--wide`, `.contact-card` v projektu

### CSS umístění
Nová pravidla na **konec** `styles.css` s komentářem:

```css
/* =Section: News (Ze světa Finkli)= ========================================
   …
   ========================================================================== */
```

---

## Acceptance criteria

- [ ] Sekce `#aktuality` vložená mezi (refactor) `#kontakt` (lidé) a `#napsat`
      (formulář). Nebo dle dohody s uživatelem.
- [ ] H2 „Ze světa Finkli" + lead pod ním, levé zarovnání
- [ ] Bento grid: 4 col desktop / 2 col tablet / 1 col mobile
- [ ] Karty respektují velikost (1×1 / 2×1 / 3×1 / 4×1 / 1×2 / 2×2)
- [ ] 3 varianty pozadí: image, solid color (5 barev), transparent glass
- [ ] Hover = scale(1.04), bez translateY
- [ ] Celá karta klikatelná (`<a>` wrap), externí linky `target="_blank" rel="noopener"`
- [ ] Marianne článek je první karta (2×1), s lokálním obrázkem v
      `/assets/news/marianne-zeny-investovani.jpg` (image download mu připomeň)
- [ ] Mobile layout funguje (test ~360px)
- [ ] Respekt `prefers-reduced-motion`
- [ ] DESIGN.md aktualizován — přidej sekci „News (Ze světa Finkli)" do
      „Sekce — stav"
- [ ] Žádný JS rendering, žádný JSON, žádný admin

---

## Pořadí kroků

1. **Read** DESIGN.md, index.html, styles.css (relevantní bloky).
2. **Ask user** (1 zpráva, max 2 dotazy):
   - Refactor `#kontakt` na 3 sekce, nebo nest aktuality jako `<article>`
     dovnitř? (doporučeno: refactor)
   - Marianne článek jako 2×1 nebo 2×2?
3. **Refactor** (pokud schválen) — vystrnaďit `.contact-form-card` z `#kontakt`
   do vlastní `<section id="napsat">`.
4. **Build sekci `#aktuality`** — HTML strukturu, CSS bento grid + card patterns.
5. **Paste Marianne article** jako první kartu. Připomeň uživateli stáhnout
   obrázek do `/assets/news/`.
6. **Přidej 2–3 placeholder karty** s různými velikostmi a variantami (image,
   barva, transparent) jako demo — uživatel je pak smaže / přepíše až bude
   přidávat skutečné aktuality.
7. **Update DESIGN.md** — přidej sekci do „Sekce — stav" + workflow
   „jak přidat novou aktualitu" (paste nového `<article>` bloku).
8. **Hotovo** — ukaž uživateli a iteruj na vizuální feedback.

---

## Workflow pro budoucí aktuality (po dokončení)

Uživatel přidá novou aktualitu takto:

1. Stáhne nebo nahraje obrázek do `/web/assets/news/{slug}.jpg`
2. Otevře `index.html`, najde `<div class="news-bento">`
3. Paste nový `<article>` blok podle existujícího vzoru
4. Změní `href`, `src`, eyebrow / title / description, případně velikost
   (`news-card--2x1` atd.)
5. Uloží, deploye

Tak jednoduché. Žádný build, žádný admin, žádný JS. Když to později začne
být moc položek, vrátíme se k AKTUALITY_PROMPT.md verzi s adminem.

---

## Kontakt s uživatelem

Uživatel preferuje 1 vyladěnou variantu před 3 polovičatými iteracemi. Když
si nejsi jistý, zeptej se. AskUserQuestion = max 2–3 otázky v jednom message.

Komunikace v češtině. Tone: kolegiální, věcný, partner ne servisman.

**Hodně štěstí.** 🤝
