import { useEffect, useState } from "react";

const plans = [
  {
    name: "Finkli Silver",
    price: "550 Kč",
    desc: "Pro klienty bez pojištění – garanci EUCS a asistenci s nahlášením pojistných událostí přidáme, jakmile pojištění sjednáme.",
    featured: false,
    icon: "▱",
    items: [
      "Průběžné finanční plánování",
      "Optimalizace výdajů domácnosti",
      "Správa smluv v myPlann",
    ],
  },
  {
    name: "Finkli Silver+",
    price: "550 Kč",
    extra: "+ 149 Kč / měsíc za Garanci EUCS",
    desc: "Pro klienty s pojištěním – kompletní servis včetně asistence s nahlášením pojistných událostí zdarma od Finkli.",
    featured: true,
    icon: "✚",
    items: [
      "Průběžné finanční plánování",
      "Optimalizace výdajů domácnosti",
      "Správa smluv v myPlann",
      "Asistence s pojistnými událostmi",
      "Garance EUCS",
    ],
  },
  {
    name: "Finkli Gold",
    price: "990 Kč",
    extra: "+ 149 Kč / měsíc za Garanci EUCS",
    desc: "Pro klienty, kteří chtějí mít vše vyřešené – včetně daňového přiznání a garantovaného přístupu k poradci.",
    featured: false,
    icon: "▰",
    items: [
      "Průběžné finanční plánování",
      "Optimalizace výdajů domácnosti",
      "Správa smluv v myPlann",
      "Asistence s pojistnými událostmi",
      "Garance EUCS",
      "Hlídání termínů a povinností",
      "Asistence s daňovým přiznáním",
      "Poradce na telefonu",
      "Přednostní vyřízení e-mailu",
    ],
  },
];

const situations = [
  "Chci konečně přehled o svých financích",
  "Řeším hypotéku, úvěr nebo refinancování",
  "Čeká mě velké životní rozhodnutí",
  "Mám produkty, ale nevím zda fungují správně",
  "Podnikám a chci mít finance i důchod pod kontrolou",
  "Začínám investovat",
  "Mám pojištění, ale nevím zda mě skutečně chrání",
  "Začínám a chci to dělat správně",
];

function CheckIcon({ featured = false }) {
  const strokeColor = featured ? "#0B2E34" : "#ffffff";

  return (
    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 2.4C17.46 2.4 18.5 3.62 19.76 4.03C21.09 4.47 22.65 4.05 23.71 4.86C24.78 5.68 24.86 7.3 25.68 8.42C26.49 9.53 28 10.1 28.32 11.45C28.64 12.77 27.73 14.1 27.73 15.5C27.73 16.9 28.64 18.23 28.32 19.55C28 20.9 26.49 21.47 25.68 22.58C24.86 23.7 24.78 25.32 23.71 26.14C22.65 26.95 21.09 26.53 19.76 26.97C18.5 27.38 17.46 28.6 16 28.6C14.54 28.6 13.5 27.38 12.24 26.97C10.91 26.53 9.35 26.95 8.29 26.14C7.22 25.32 7.14 23.7 6.32 22.58C5.51 21.47 4 20.9 3.68 19.55C3.36 18.23 4.27 16.9 4.27 15.5C4.27 14.1 3.36 12.77 3.68 11.45C4 10.1 5.51 9.53 6.32 8.42C7.14 7.3 7.22 5.68 8.29 4.86C9.35 4.05 10.91 4.47 12.24 4.03C13.5 3.62 14.54 2.4 16 2.4Z"
          fill="#03D98C"
        />
        <path
          d="M10.2 16.4L14.1 20.2L22 12.4"
          stroke={strokeColor}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="Finkli" role="img">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 13.83C0 13.37 0.37 13 0.83 13H13V26H0V13.83Z" fill="#03D98C" />
        <path d="M13 0H25.17C25.63 0 26 0.37 26 0.83V12.17C26 12.63 25.63 13 25.17 13H13V0Z" fill="#03D98C" />
        <path d="M13 26H0L11.59 14.41C12.11 13.89 13 14.26 13 15V26Z" fill="#03D98C" />
        <path d="M13 0H2C1.26 0 0.89 0.89 1.41 1.41L13 13V0Z" fill="#03D98C" />
        <path d="M13 26V13L24.59 24.59C25.11 25.11 24.74 26 24 26H13Z" fill="#03D98C" />
      </svg>
      <span className="text-xl font-semibold tracking-tight text-[#0B2E34]">Finkli</span>
    </div>
  );
}

function PrimaryButton({ children, href = "#kontakt" }) {
  return (
    <a
      href={href}
      className="finkli-btn rounded-[9px] bg-[#03D98C] px-7 py-3.5 text-center text-base font-semibold text-[#0B2E34] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(3,217,140,0.24)] sm:py-3 sm:text-sm"
    >
      {children}
    </a>
  );
}

function SecondaryButton({ children, href = "#" }) {
  return (
    <a
      href={href}
      className="finkli-btn rounded-[9px] border border-[#0B2E34]/10 bg-white px-7 py-3.5 text-center text-base font-semibold text-[#0B2E34] transition hover:-translate-y-0.5 hover:bg-[#F6FBF8] sm:py-3 sm:text-sm"
    >
      {children}
    </a>
  );
}

function PlanCard({ plan, mobile = false }) {
  const cardClass = [
    "relative rounded-[12px] border p-6 transition duration-300 flex flex-col h-full",
    mobile ? "min-w-[330px]" : "w-full",
    plan.featured
      ? "overflow-visible shadow-[0_28px_90px_rgba(3,217,140,0.28)] md:-translate-y-4 md:scale-[1.04] "
      : "overflow-hidden shadow-[0_10px_34px_rgba(11,46,52,0.05)]",
  ].join(" ");

  return (
    <div
      className={cardClass}
      style={{
        backgroundColor: plan.featured ? "#0B2E34" : "rgba(255,255,255,0.9)",
        borderColor: plan.featured ? "rgba(3,217,140,0.25)" : "rgba(11,46,52,0.08)",
        color: plan.featured ? "white" : "#0B2E34",
      }}
    >
      {plan.featured ? (
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-[10px] bg-[#03D98C] px-4 py-1.5 text-sm font-semibold text-[#0B2E34] shadow">
          Nejoblíbenější
        </div>
      ) : null}

      <div className="absolute right-5 top-5 text-4xl opacity-70" style={{ color: plan.featured ? "#03D98C" : "#0B2E34" }}>
        {plan.icon}
      </div>

      <h3 className="text-[22px] font-semibold tracking-tight">{plan.name}</h3>
      <div className="mt-4 flex items-end gap-2">
        <div className="text-5xl font-semibold leading-none">{plan.price}</div>
        <div className={`pb-1 text-sm ${plan.featured ? "text-white/70" : "text-[#0B2E34]"}`}>/ měsíčně</div>
      </div>
      {plan.extra ? <div className={`mt-3 text-sm ${plan.featured ? "text-white/70" : "text-[#0B2E34]"}`}>{plan.extra}</div> : null}

      <div className="mt-7 space-y-3 flex-1">
        {plan.items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <CheckIcon featured={plan.featured} />
            <div className={`text-[14px] leading-5 ${plan.featured ? "text-white/90" : "text-[#0B2E34]"}`}>{item}</div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <div
          className="rounded-[10px] border px-4 py-4 text-[13px] leading-5"
          style={{
            backgroundColor: plan.featured ? "rgba(255,255,255,0.07)" : "#F3FCF8",
            borderColor: plan.featured ? "rgba(255,255,255,0.10)" : "rgba(3,217,140,0.16)",
            color: plan.featured ? "white" : "#0B2E34",
          }}
        >
          {plan.desc}
        </div>
      </div>
    </div>
  );
}

export default function FinkliOnepager() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4FFF9] text-[#0B2E34]" style={{ fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@8..144,100..1000&display=swap');

        @media (max-width: 1280px) {
          html, body {
            overflow-x: hidden;
          }

          .finkli-header {
            width: calc(100vw - 24px) !important;
            max-width: none !important;
            padding: 10px 12px !important;
            border-radius: 16px !important;
          }

          .finkli-nav { display: none !important; }
          .finkli-logo svg { height: 28px !important; width: 28px !important; }
          .finkli-logo span { font-size: 18px !important; }

          .finkli-hero {
            min-height: 100svh !important;
            padding: 86px 14px 24px !important;
            align-items: stretch !important;
          }

          .finkli-hero-inner {
            max-width: none !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-end !important;
          }

          .finkli-hero-copy {
            max-width: none !important;
            width: 100% !important;
            border: 1px solid rgba(3,217,140,0.12) !important;
            background: rgba(255,255,255,0.48) !important;
            backdrop-filter: blur(18px) !important;
            border-radius: 24px !important;
            padding: 24px 20px !important;
            box-shadow: 0 18px 55px rgba(11,46,52,0.06) !important;
          }

          .finkli-hero h1 {
            font-size: clamp(34px, 8vw, 42px) !important;
            line-height: 0.98 !important;
            letter-spacing: -0.05em !important;
          }

          .finkli-hero p {
            margin-top: 18px !important;
            font-size: 16px !important;
            line-height: 1.55 !important;
          }

          .finkli-hero-buttons {
            margin-top: 22px !important;
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }

          .finkli-btn {
            width: 100% !important;
            min-height: 50px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 15px !important;
            border-radius: 12px !important;
          }

          .finkli-situations {
            margin-top: 18px !important;
            border: 1px solid rgba(11,46,52,0.08) !important;
            background: rgba(255,255,255,0.34) !important;
            backdrop-filter: blur(16px) !important;
            border-radius: 24px !important;
            padding: 20px !important;
            box-shadow: 0 18px 55px rgba(11,46,52,0.045) !important;
          }

          .finkli-situations-title {
            font-size: 26px !important;
            line-height: 1.05 !important;
            letter-spacing: -0.04em !important;
          }

          .finkli-situations-grid {
            margin-top: 16px !important;
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }

          .finkli-situation-chip {
            width: 100% !important;
            border-radius: 14px !important;
            padding: 13px 14px !important;
            font-size: 15px !important;
            line-height: 1.25 !important;
          }

          .finkli-main {
            max-width: none !important;
            width: 100% !important;
            padding-left: 14px !important;
            padding-right: 14px !important;
          }

          .finkli-two-col,
          .finkli-family,
          .finkli-contact,
          .finkli-footer-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
          }

          .finkli-desktop-plans { display: none !important; }
          .finkli-mobile-plans { display: block !important; }

          .finkli-section-title {
            font-size: 30px !important;
            line-height: 1.06 !important;
            letter-spacing: -0.04em !important;
          }

          .finkli-card,
          .finkli-panel,
          .finkli-contact {
            padding: 22px !important;
            border-radius: 22px !important;
          }
        }
      `}</style>

      <div className="fixed left-0 right-0 top-4 z-50 flex justify-center px-4">
        <div
          className={`finkli-header flex w-full max-w-[620px] items-center justify-between gap-4 rounded-[12px] border px-4 py-2 backdrop-blur-xl transition-all duration-300 ${
            scrolled ? "shadow-[0_18px_50px_rgba(11,46,52,0.14)]" : "shadow-[0_8px_24px_rgba(11,46,52,0.08)]"
          }`}
          style={{ backgroundColor: "rgba(255,255,255,0.82)", borderColor: "rgba(11,46,52,0.08)" }}
        >
          <div className="finkli-logo"><Logo /></div>
          <nav className="finkli-nav hidden items-center gap-1 md:flex">
            <a href="#onas" className="rounded-[9px] px-3 py-2 text-xs text-[#0B2E34] transition hover:bg-[#EAFBF4]">O nás</a>
            <a href="#sluzby" className="rounded-[9px] px-3 py-2 text-xs text-[#0B2E34] transition hover:bg-[#EAFBF4]">Co děláme</a>
            <a href="#balicky" className="rounded-[9px] px-3 py-2 text-xs text-[#0B2E34] transition hover:bg-[#EAFBF4]">Balíčky</a>
            <a href="#premysleni" className="rounded-[9px] px-3 py-2 text-xs text-[#0B2E34] transition hover:bg-[#EAFBF4]">Přístup</a>
          </nav>
          <a href="#kontakt" className="rounded-[9px] bg-[#03D98C] px-4 py-2 text-xs font-semibold text-[#0B2E34] transition hover:opacity-90">Kontakt</a>
        </div>
      </div>

      <section className="finkli-hero relative flex min-h-[100svh] items-center overflow-hidden px-4 py-24 sm:min-h-screen sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(3,217,140,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(3,217,140,0.10),transparent_34%)]" />
        <div className="absolute right-[-80px] top-20 hidden h-[260px] w-[420px] rotate-[25deg] rounded-[18px] border-2 border-[#03D98C]/65 lg:block" />
        <div className="absolute right-[40px] top-36 hidden h-[180px] w-[280px] rotate-[25deg] rounded-[16px] border-2 border-[#03D98C]/65 lg:block" />

        <div className="finkli-hero-inner relative mx-auto w-full max-w-[430px] sm:max-w-7xl">
          <div className="finkli-hero-copy max-w-[390px] sm:max-w-3xl">
            <h1 className="text-[44px] font-semibold leading-[0.98] tracking-tight text-[#0B2E34] sm:text-5xl sm:leading-[1.02] lg:text-[64px]">
              Finance postavené na plánu, systému a péči v čase.
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-7 text-[#0B2E34] sm:text-base sm:leading-7">
              Na finance se díváme jako na dlouhodobý proces, ne jednorázové rozhodnutí. Nejsme postavení na prodeji produktů, ale na dlouhodobé spolupráci a péči.
            </p>
            <div className="finkli-hero-buttons mt-8 flex flex-col gap-3 sm:flex-row">
              <SecondaryButton href="#premysleni">Zjistit, jak spolupráce funguje</SecondaryButton>
              <PrimaryButton href="#kontakt">Nezávazná konzultace</PrimaryButton>
            </div>
          </div>

          <div className="finkli-situations mt-20 sm:mt-24">
            <h2 className="finkli-situations-title finkli-section-title text-[30px] font-semibold leading-[1.04] tracking-tight text-[#0B2E34] sm:text-[44px]">
              Poznáváte se v některé z těchto situací?
            </h2>

            <div className="finkli-situations-grid mt-8 flex flex-wrap gap-3">
              {situations.map((item, index) => {
                const filled = [0, 3, 5, 7].includes(index);

                return (
                  <div
                    key={item}
                    className={`finkli-situation-chip rounded-[14px] border px-5 py-3 text-[15px] font-medium leading-tight text-[#0B2E34] transition-all duration-200 ${
                      filled
                        ? "border-[#03D98C] bg-[#DDFBF0] shadow-[0_6px_18px_rgba(3,217,140,0.04)]"
                        : "border-[#03D98C]/85 bg-transparent"
                    }`}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <main className="finkli-main mx-auto max-w-[430px] px-4 pb-24 sm:max-w-7xl sm:px-8 sm:pb-28 lg:px-10">
        <section id="onas" className="pt-20 sm:pt-20 lg:pt-28">
          <div className="max-w-5xl">
            <h2 className="finkli-section-title text-[30px] font-semibold leading-[1.08] tracking-tight text-[#0B2E34] sm:text-[44px]">
              Jak ve Finkli s klienty spolupracujeme
            </h2>

            <p className="mt-6 max-w-4xl text-[16px] leading-7 text-[#0B2E34] sm:text-base sm:leading-7">
              Finkli vzniklo z jednoduché myšlenky – <strong>finance jsou příliš důležité na to, aby se řešily nahodile.</strong> A také z přesvědčení, že se dají dělat jinak. Partnersky, transparentně a dlouhodobě.
            </p>

            <p className="mt-5 max-w-5xl text-[16px] leading-7 text-[#0B2E34] sm:text-base sm:leading-7">
              Naším cílem je být Vaším dlouhodobým partnerem pro finanční život. Pomáhat Vám vytvářet systém, chránit majetek, pracovat s časem i inflací a dělat rozhodnutí s větším klidem a jistotou.
            </p>
          </div>

          <div className="finkli-two-col mt-10 grid gap-5 md:grid-cols-2 md:gap-6">
            <div className="finkli-card rounded-[18px] border border-[#0B2E34]/10 bg-white/80 p-6 shadow-[0_12px_40px_rgba(11,46,52,0.05)] sm:p-8">
              <h3 className="text-[22px] font-semibold leading-[1.15] tracking-tight text-[#0B2E34] sm:text-[26px]">
                Kdo jsme
              </h3>

              <p className="mt-4 text-[16px] leading-7 text-[#0B2E34] sm:text-base sm:leading-7">
                Nechtěli jsme být čistými prodejci produktů. Chtěli jsme vytvořit službu, která klientům přinese větší přehled, systém a klid v rozhodování.
              </p>

              <p className="mt-4 text-[16px] leading-7 text-[#0B2E34] sm:text-base sm:leading-7">
                Většina poradců končí tam, kde my teprve začínáme. <strong>Dlouhodobá péče je pro nás základ celé spolupráce</strong>, protože bez ní plán postupně ztrácí aktuálnost a důležitá rozhodnutí vznikají nahodile.
              </p>
            </div>

            <div id="sluzby" className="finkli-card rounded-[18px] border border-[#0B2E34]/10 bg-white/80 p-6 shadow-[0_12px_40px_rgba(11,46,52,0.05)] sm:p-8">
              <h3 className="text-[22px] font-semibold leading-[1.15] tracking-tight text-[#0B2E34] sm:text-[26px]">
                Co děláme
              </h3>

              <p className="mt-4 text-[16px] leading-7 text-[#0B2E34] sm:text-base sm:leading-7">
                Nezačínáme produktem a nekončíme sjednáním. Nejprve potřebujeme pochopit Vaši situaci jako celek a až potom hledáme konkrétní řešení.
              </p>

              <p className="mt-4 text-[16px] leading-7 text-[#0B2E34] sm:text-base sm:leading-7">
                Věříme, že finance nejsou jednorázová událost, ale dlouhodobý proces. Proto s klienty spolupracujeme průběžně a řešení vybíráme podle toho, co dává smysl v čase – ne podle toho, co se zrovna nejlépe prodává.
              </p>
            </div>
          </div>

          
        </section>

        <section id="premysleni" className="finkli-panel relative mt-6 overflow-hidden rounded-[22px] bg-[#D8FAEC] p-6 shadow-[0_18px_50px_rgba(3,217,140,0.10)] sm:p-9">
          

          <h3 className="text-[22px] font-semibold leading-[1.15] tracking-tight text-[#0B2E34] sm:text-[26px]">
            Jak to děláme
          </h3>

          <p className="mt-5 max-w-5xl text-[16px] leading-7 text-[#0B2E34] sm:text-base">
            Většina poradců skončí tam, kde my teprve začínáme. <strong>Péče je to, co odlišuje skutečného dlouhodobého partnera od jednorázového poradce.</strong> Bez ní plán postupně ztrácí aktuálnost, souvislosti i schopnost reagovat na změny v čase.
          </p>

          <p className="mt-5 max-w-5xl text-[16px] leading-7 text-[#0B2E34] sm:text-base">
            My nejsme jen u sjednání. S klienty spolupracujeme dlouhodobě, pravidelně jejich situaci vyhodnocujeme a pomáháme jim dělat rozhodnutí v kontextu celého finančního života.
          </p>

          <p className="mt-5 max-w-5xl text-[16px] leading-7 text-[#0B2E34] sm:text-base">
            Spolupráce je postavená na dlouhodobé péči, ne na jednorázovém prodeji. Proto funguje na <strong>měsíční platbě přímo za servis a péči.</strong>
          </p>

          <p className="mt-5 max-w-5xl text-[16px] leading-7 text-[#0B2E34] sm:text-base">
            Provize z produktů jsou ze své podstaty jednorázové a vytvářejí tlak na prodej. Přímá platba tento tlak odstraňuje, spolupráce je tak dlouhodobá, bez skrytých motivací a řešení vybíráme podle Vašich potřeb, ne podle výše provize.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_0.62fr]">
            <PrimaryButton href="#kontakt">Nezávazná konzultace</PrimaryButton>
            <SecondaryButton href="#balicky">Jak fungují balíčky</SecondaryButton>
          </div>
        </section>

        <section className="pt-16 sm:pt-20 lg:pt-24">
          <div className="rounded-[22px] border border-[#0B2E34]/10 bg-white/70 p-6 shadow-[0_12px_40px_rgba(11,46,52,0.04)] sm:p-10">
            <div className="max-w-3xl">
              <h3 className="text-[22px] font-semibold leading-[1.15] tracking-tight text-[#0B2E34] sm:text-[26px]">
                Jak probíhá spolupráce
              </h3>

              <p className="mt-4 text-[16px] leading-7 text-[#0B2E34]">
                Nejde jen o jednorázové sjednání produktu. Cílem je dlouhodobá spolupráce, ve které se plán pravidelně vyhodnocuje, upravuje a reaguje na změny ve Vašem životě.
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-[18px] border border-[#03D98C]/10 bg-[#F8FFFB] p-4 sm:p-8">
              <img
                src="/diagram-finkli-spoluprace.png"
                alt="Diagram dlouhodobé spolupráce Finkli"
                className="mx-auto w-full max-w-5xl"
              />
            </div>

            <p className="mt-6 max-w-4xl text-[15px] leading-7 text-[#0B2E34]/80">
              Přerušovaná část znázorňuje rozdíl oproti klasickému modelu finančního poradenství, kde spolupráce často končí realizací produktu. Ve Finkli naopak pokračuje dlouhodobou péčí a pravidelnou prací s plánem.
            </p>
          </div>
        </section>

        <section className="pt-20 sm:pt-24 lg:pt-28">
          <div className="text-center">
            <h2 className="finkli-section-title text-[30px] font-semibold leading-[1.08] tracking-tight text-[#0B2E34] sm:text-[44px]">
              V jakých oblastech vám pomáháme
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-6">
            <div className="rounded-[18px] border border-[#03D98C]/14 bg-white/75 p-6 text-center shadow-[0_12px_40px_rgba(11,46,52,0.04)]">
              <div className="text-4xl">🎯</div>

              <div className="mt-5 inline-flex rounded-[10px] border border-[#03D98C] bg-[#DDFBF0] px-4 py-2 text-[18px] font-semibold tracking-tight text-[#0B2E34]">
                Přání a cíle
              </div>

              <div className="mt-5 text-[18px] font-medium tracking-tight text-[#0B2E34]">
                Investice, Penze
              </div>

              <div className="mx-auto mt-5 h-px w-20 bg-[#03D98C]" />

              <p className="mt-5 text-[15px] leading-7 text-[#0B2E34]">
                Skrze investice budujeme majetek a kapitál, který postupně plní vaše cíle a přání. Ať už je to vlastní bydlení, finanční nezávislost nebo klidný důchod.
              </p>
            </div>

            <div className="rounded-[18px] border border-[#0B2E34]/10 bg-white/75 p-6 text-center shadow-[0_12px_40px_rgba(11,46,52,0.04)]">
              <div className="text-4xl">🛡️</div>

              <div className="mt-5 inline-flex rounded-[10px] border border-[#0B2E34]/20 bg-transparent px-4 py-2 text-[18px] font-semibold tracking-tight text-[#0B2E34]">
                Ochrana
              </div>

              <div className="mt-5 text-[18px] font-medium tracking-tight text-[#0B2E34]">
                Pojištění
              </div>

              <div className="mx-auto mt-5 h-px w-20 bg-[#0B2E34]/20" />

              <p className="mt-5 text-[15px] leading-7 text-[#0B2E34]">
                Majetek, příjmy i lidé, na kterých vám záleží, je potřeba chránit. Pojištění zajišťuje, abyste o to, co budujete, nepřišli vlivem neočekávaných událostí.
              </p>
            </div>

            <div className="rounded-[18px] border border-[#0B2E34]/10 bg-white/75 p-6 text-center shadow-[0_12px_40px_rgba(11,46,52,0.04)]">
              <div className="text-4xl">💰</div>

              <div className="mt-5 inline-flex rounded-[10px] border border-[#0B2E34]/20 bg-transparent px-4 py-2 text-[18px] font-semibold tracking-tight text-[#0B2E34]">
                Financování
              </div>

              <div className="mt-5 text-[18px] font-medium tracking-tight text-[#0B2E34]">
                Úvěry
              </div>

              <div className="mx-auto mt-5 h-px w-20 bg-[#0B2E34]/20" />

              <p className="mt-5 text-[15px] leading-7 text-[#0B2E34]">
                Správně nastavený úvěr umožňuje dosáhnout cíle dříve, zatímco vaše vlastní peníze dál pracují ve váš prospěch. Cizí kapitál jako nástroj, ne jako zátěž.
              </p>
            </div>
          </div>
        </section>

        <section id="balicky" className="pb-8 pt-20 sm: sm:pt-24 lg:pb-12 lg:pt-32">
          <div className="max-w-5xl">
            <h2 className="finkli-section-title text-[30px] font-semibold leading-[1.08] tracking-tight text-[#0B2E34] sm:text-[44px]">Přehled balíčků</h2>
            <p className="mt-4 text-[16px] leading-7 text-[#0B2E34] sm:text-base sm:leading-7">
              <strong>Jak si balíček vybrat?</strong> Není cílem si teď vybírat konkrétní variantu. Balíčky slouží hlavně jako orientační přehled toho, jaké služby poskytujeme.
            </p>
            <p className="mt-4 text-[16px] leading-7 text-[#0B2E34] sm:text-base sm:leading-7">
              Na nezávazné schůzce spolu v klidu projdeme Vaši situaci a ukážeme si, jaká cesta pro Vás dává největší smysl.
            </p>
          </div>

          <div className="finkli-mobile-plans mt-9 md:hidden">
            <div className="flex gap-4 overflow-x-auto pb-3 pt-4">
              {plans.map((plan) => <PlanCard key={plan.name} plan={plan} mobile />)}
            </div>
          </div>

          <div className="finkli-desktop-plans mt-16 hidden gap-6 overflow-visible md:grid md:grid-cols-3 md:items-stretch">
            {plans.map((plan) => (
              <div key={plan.name} className="h-full">
                <PlanCard plan={plan} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[22px] border border-[#03D98C]/20 bg-[#F3FCF8] p-7 shadow-[0_18px_50px_rgba(3,217,140,0.08)] sm:p-9">
          <div className="max-w-4xl">
            <h3 className="text-[22px] font-semibold leading-[1.15] tracking-tight text-[#0B2E34] sm:text-[26px]">
              Získejte více peněz z pojistné události 💸
            </h3>
            <p className="mt-4 text-[16px] leading-7 text-[#0B2E34] sm:text-base">
              Pojišťovny ne vždy vyplatí to, na co máte skutečný nárok. <strong>EUCS je specializovaná služba, která stojí na vaší straně</strong> – tým advokátů, soudních znalců a lékařů se postará o to, abyste dostali vše, co vám právem patří.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <CheckIcon />
                <div className="text-[16px] leading-7">
                  Prověří váš případ a <strong>zastoupí vás vůči pojišťovně</strong>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckIcon />
                <div className="text-[16px] leading-7">
                  <strong>Zajistí maximální plnění</strong>, bez zbytečných starostí z vaší strany
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckIcon />
                <div className="text-[16px] leading-7">
                  Pomůže s jakoukoliv pojistnou událostí – úraz, nemovitost, auto i životní pojištění
                </div>
              </div>
            </div>

            <a href="https://www.eucs.cz" target="_blank" className="mt-6 inline-block text-sm font-semibold text-[#0B2E34] underline underline-offset-4">
              www.eucs.cz
            </a>
          </div>
        </section>

        <section className="finkli-family -mt-2 grid items-center gap-8 rounded-[22px] border border-[#03D98C]/16 bg-[#EAFBF4]/70 p-6 shadow-[0_14px_44px_rgba(3,217,140,0.08)] sm:mt-0 sm:p-8 md:grid-cols-[1.05fr_0.5fr]">
          <div>
            <div className="mb-3 inline-flex rounded-[9px] bg-white/70 px-3 py-1.5 text-sm font-semibold text-[#0B2E34]">Doplněk k balíčkům</div>
            <h3 className="text-[22px] font-semibold leading-[1.15] tracking-tight text-[#0B2E34] sm:text-[26px]">Myslíme i na rodinu ❤️</h3>
            <p className="mt-4 text-[16px] leading-7 text-[#0B2E34] sm:text-base sm:leading-7">
              Spolupráce je vždy navázaná na konkrétní finanční plán. Pokud řeší finance jedna domácnost společně, funguje to jako jeden plán a jeden balíček.
            </p>
            <p className="mt-4 text-[16px] leading-7 text-[#0B2E34] sm:text-base sm:leading-7">
              V případě, že chce více členů rodiny řešit finance samostatně, má každý vlastní plán i balíček. U rodinného doporučení nabízíme zvýhodněný balíček o <strong>1200 Kč ročně</strong>, i když spolu nebydlíte.
            </p>
            <p className="mt-4 text-base font-semibold text-[#0B2E34]">Neplatí pro doporučení mezi kamarády a známými.</p>
          </div>
          <div className="relative mx-auto h-48 w-56">
            <div className="absolute bottom-0 left-8 h-28 w-28 rounded-full bg-[#0B2E34] shadow-[0_18px_45px_rgba(11,46,52,0.22)]" />
            <div className="absolute bottom-0 right-2 h-24 w-24 rounded-full bg-[#03D98C] shadow-[0_18px_45px_rgba(3,217,140,0.24)]" />
            <div className="absolute bottom-10 left-28 h-20 w-20 rounded-full bg-[#B8F5D9] shadow-[0_18px_45px_rgba(3,217,140,0.18)]" />
          </div>
        </section>

        <section className="mt-20 border-t border-[#0B2E34]/10 py-16 sm:mt-24 sm:py-20">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.18em] text-[#0B2E34]">Tým Finkli</div>
            <h2 className="finkli-section-title mt-3 text-[30px] font-semibold leading-[1.08] tracking-tight text-[#0B2E34] sm:text-[44px]">
              Lidé, se kterými budete finance řešit.
            </h2>
            <p className="mt-4 text-[16px] leading-7 text-[#0B2E34] sm:text-base sm:leading-7">
              Za Finkli stojí konkrétní poradci, se kterými můžete vše v klidu probrat. Nejdřív si projdeme Vaši situaci a až potom společně vybereme cestu, která dává smysl.
            </p>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <article className="group">
              <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-start">
                <div className="min-h-[260px] rounded-[18px] bg-gradient-to-br from-[#03D98C]/10 to-transparent" />
                <div>
                  <h3 className="text-[22px] font-semibold leading-[1.15] tracking-tight text-[#0B2E34] sm:text-[26px]">Jaroslav Nedvěd</h3>
                  <p className="mt-3 text-base leading-7 text-[#0B2E34]/80">
                    Dlouhodobá spolupráce, plánování a péče o klienty v čase.
                  </p>
                  <div className="mt-6 flex flex-col gap-2 text-base">
                    <a href="mailto:jaroslav.nedved@finkli.cz" className="text-[#0B2E34] underline-offset-4 hover:underline">jaroslav.nedved@finkli.cz</a>
                    <a href="tel:+420739237615" className="text-[#0B2E34] underline-offset-4 hover:underline">+420 739 237 615</a>
                  </div>
                </div>
              </div>
            </article>

            <article className="group">
              <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-start">
                <div className="min-h-[260px] rounded-[18px] bg-gradient-to-br from-[#0B2E34]/5 to-transparent" />
                <div>
                  <h3 className="text-[22px] font-semibold leading-[1.15] tracking-tight text-[#0B2E34] sm:text-[26px]">Matěj Krejčík</h3>
                  <p className="mt-3 text-base leading-7 text-[#0B2E34]/80">
                    Systém ve financích, dlouhodobý plán a praktické kroky v čase.
                  </p>
                  <div className="mt-6 flex flex-col gap-2 text-base">
                    <a href="mailto:matej.krejcik@finkli.cz" className="text-[#0B2E34] underline-offset-4 hover:underline">matej.krejcik@finkli.cz</a>
                    <a href="tel:+420777193373" className="text-[#0B2E34] underline-offset-4 hover:underline">+420 777 193 373</a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="kontakt" className="finkli-contact mt-4 grid gap-7 rounded-[22px] border border-[#0B2E34]/10 bg-white/90 p-7 shadow-[0_18px_60px_rgba(11,46,52,0.08)] sm:p-9 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="text-sm uppercase tracking-[0.18em] text-[#0B2E34]">Kontakty</div>
            <h2 className="finkli-section-title mt-3 text-[30px] font-semibold leading-[1.08] tracking-tight text-[#0B2E34] sm:text-[44px]">Pojďme se spojit.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#0B2E34]">
              Tady bude prostor pro konkrétní kontakt, který bude působit přirozeně a důvěryhodně. Může tu být e-mail, telefon, sociální sítě i jednoduchá výzva k akci.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-[10px] border border-[#03D98C]/15 bg-[#F3FCF8] p-4">
              <div className="text-sm text-[#0B2E34]">E-mail</div>
              <div className="mt-1 text-base font-semibold text-[#0B2E34]">info@finkli.cz</div>
            </div>
            <div className="rounded-[10px] border border-[#03D98C]/15 bg-[#F3FCF8] p-4">
              <div className="text-sm text-[#0B2E34]">Telefon</div>
              <div className="mt-1 text-base font-semibold text-[#0B2E34]">+420 000 000 000</div>
            </div>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="mailto:info@finkli.cz">Napsat e-mail</PrimaryButton>
              <SecondaryButton href="#">LinkedIn</SecondaryButton>
            </div>
          </div>
        </section>

        <footer className="mt-24 border-t border-[#0B2E34]/10 pt-10">
          <div className="finkli-footer-grid grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
            <div>
              <Logo />
              <p className="mt-5 max-w-sm text-base leading-7 text-[#0B2E34]">Finkli pomáhá lidem i firmám dělat finanční rozhodnutí s větším klidem, přehledem a jistotou.</p>
              <div className="mt-5 text-sm text-[#0B2E34]">© 2026 Finkli. Všechna práva vyhrazena.</div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em]">Mapa webu</div>
              <div className="mt-5 flex flex-col gap-3 text-base text-[#0B2E34]">
                <a href="#onas">Kdo jsme</a>
                <a href="#sluzby">Co děláme</a>
                <a href="#balicky">Balíčky</a>
                <a href="#premysleni">Jak přemýšlíme</a>
                <a href="#kontakt">Kontakt</a>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em]">Kontakty</div>
              <div className="mt-5 flex flex-col gap-3 text-base text-[#0B2E34]">
                <a href="mailto:info@finkli.cz">info@finkli.cz</a>
                <a href="tel:+420000000000">+420 000 000 000</a>
                <a href="#">LinkedIn</a>
                <a href="#">Instagram</a>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em]">Praktické</div>
              <div className="mt-5 flex flex-col gap-3 text-base text-[#0B2E34]">
                <a href="#">Zpracování osobních údajů</a>
                <a href="#">Obchodní podmínky</a>
                <a href="#">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
