/**
 * Copy for Energy Intelligence (V1.7). Grounded, non-predictive.
 * @typedef {'en'|'hu'|'ro'} Lang
 * @typedef {'general'|'trading'|'body'|'emotion'|'work'} EnergyLens
 */

/** @type {Record<string, Record<Lang, string>>} */
const SIGN_QUALITY = {
  aries: {
    en: "This stretch favors clear starts and honest pacing — momentum without recklessness.",
    hu: "Ez az időszak tiszta rajtot és őszinte tempót kér — lendület felelőtlenség nélkül.",
    ro: "Această perioadă favorizează începuturi clare și ritm onest — fără imprudență."
  },
  taurus: {
    en: "This stretch asks for stability, the body, what you value, and patience.",
    hu: "A jelenlegi időszak stabilitást, testet, értéket és türelmet kér.",
    ro: "Perioada cere stabilitate, corp, valoare și răbdare."
  },
  gemini: {
    en: "This stretch highlights communication and context — listen twice, decide once.",
    hu: "Ez az időszak a kommunikációt és a kontextust emeli ki — kétszer figyelj, egyszer dönts.",
    ro: "Perioada pune accent pe comunicare și context — ascultă de două ori, decide o dată."
  },
  cancer: {
    en: "This stretch favors inner safety and honest needs before outward performance.",
    hu: "Most a belső biztonság és az őszinte szükségletek kerülnek előbbre, nem a látvány.",
    ro: "Acum contează siguranța interioară și nevoile oneste, nu spectacolul."
  },
  leo: {
    en: "This stretch rewards showing up with integrity — presence without performance.",
    hu: "Most a jelenlét számít tisztességgel — jelen lenni, nem játszani.",
    ro: "Acum contează prezența cu integritate — fără spectacol."
  },
  virgo: {
    en: "This stretch supports refinement: one useful correction instead of global perfection.",
    hu: "Most egy hasznos finomítás segít, nem minden tökéletesre húzása.",
    ro: "Acum ajută o ajustare utilă, nu perfecționarea tuturor."
  },
  libra: {
    en: "This stretch asks for balance you maintain — small honest tradeoffs, not avoidance.",
    hu: "Most az egyensúlyt te tartod fenn — apró, őszinte kompromisszumok, nem menekülés.",
    ro: "Echilibrul e menținut prin alegeri mici și oneste, nu prin evitare."
  },
  scorpio: {
    en: "This stretch favors honest depth and clean boundaries — no drama as a substitute.",
    hu: "Most a mélység és a tiszta határok segítenek — dráma ne legyen helyettesítő.",
    ro: "Adâncime onestă și limite curate — fără dramă ca înlocuitor."
  },
  sagittarius: {
    en: "This stretch pairs vision with ground — direction without overpromising.",
    hu: "Most a látás és a talaj együtt kell — irány, túlígéret nélkül.",
    ro: "Viziune ancorată în sol — direcție fără promisiuni exagerate."
  },
  capricorn: {
    en: "This stretch rewards discipline as care — repeatable steps, not heroic sprints.",
    hu: "Most a fegyelem gondoskodásként jelenik meg — ismételhető lépések, nem hős sprint.",
    ro: "Disciplina ca grijă — pași repeatabili, nu sprinturi eroice."
  },
  aquarius: {
    en: "This stretch favors fresh structure — originality that still respects the body.",
    hu: "Most friss szerkezet kell — újdonság, ami a testet is tiszteletben tartja.",
    ro: "Structură proaspătă — originalitate care respectă și corpul."
  },
  pisces: {
    en: "This stretch favors integration and rest — closure without dissolving boundaries.",
    hu: "Most az integráció és a pihenés — lezárás határok nélkül nem oldódunk el.",
    ro: "Integrare și odihnă — închidere fără a pierde limitele."
  }
};

/** @param {Lang} lang */
function signLine(sign, lang) {
  const k = String(sign || "").toLowerCase();
  const row = SIGN_QUALITY[k];
  if (!row) return null;
  return row[lang] || row.en;
}

/** @type {Record<Lang, { title: string, lensTitles: Record<EnergyLens, string>, labels: Record<string, string>, moon: Record<string, string>, lensLead: Record<EnergyLens, string> }>} */
const FRAME = {
  en: {
    title: "Today's energy:",
    lensTitles: {
      general: "Today's energy:",
      trading: "Today's energy — trading lens:",
      body: "Today's energy — body & nervous system:",
      emotion: "Today's energy — emotional mirror:",
      work: "Today's energy — work & focus:"
    },
    labels: {
      numerology: "Numerology:",
      astrology: "Astrological quality:",
      moon: "Moon quality:",
      emotionalTone: "Emotional tone today:",
      watchToday: "Watch today:",
      bestDirection: "Best direction:",
      trading: "Trading:",
      body: "Body / nervous system:"
    },
    moon: {
      staticHonest:
        "Moon data is currently estimated / static mode. Exact phase will come later with a live API — not used for predictions here.",
      apiPending:
        "Live moon API is not wired yet; showing grounded static context until ephemeris is connected."
    },
    lensLead: {
      general: "",
      trading: "Same day-frame — read through risk, patience, and execution hygiene.",
      body: "Same day-frame — read through breath, load, and somatic honesty.",
      emotion: "Same day-frame — read through feeling without dramatizing it.",
      work: "Same day-frame — read through priorities, depth, and sustainable pace."
    }
  },
  hu: {
    title: "Mai energia:",
    lensTitles: {
      general: "A nap energiája:",
      trading: "A nap energiája — trading nézőpont:",
      body: "A nap energiája — test és idegrendszer:",
      emotion: "A nap energiája — érzelmi tükör:",
      work: "A nap energiája — munka és fókusz:"
    },
    labels: {
      numerology: "Numerológia:",
      astrology: "Asztrológiai minőség:",
      moon: "Hold minőség:",
      emotionalTone: "Mai érzelmi hang:",
      watchToday: "Ma figyelj:",
      bestDirection: "Legjobb irány:",
      trading: "Trading:",
      body: "Test / idegrendszer:"
    },
    moon: {
      staticHonest:
        "Holdadat jelenleg becsült / statikus módban van. A pontos holdfázis később élő API-val jön — itt nem jósolunk róla.",
      apiPending:
        "Az élő hold API még nincs bekötve; addig is földelt, statikus keretet adunk."
    },
    lensLead: {
      general: "",
      trading: "Ugyanaz a napi keret — most kockázat, türelem és fegyelmen keresztül olvasd.",
      body: "Ugyanaz a napi keret — légzés, terhelés és testi őszinteség felől.",
      emotion: "Ugyanaz a napi keret — érzés dráma nélkül.",
      work: "Ugyanaz a napi keret — prioritás, mélység és fenntartható tempó felől."
    }
  },
  ro: {
    title: "Energia zilei:",
    lensTitles: {
      general: "Energia zilei:",
      trading: "Energia zilei — lentilă trading:",
      body: "Energia zilei — corp și sistem nervos:",
      emotion: "Energia zilei — oglindă emoțională:",
      work: "Energia zilei — muncă și focus:"
    },
    labels: {
      numerology: "Numerologie:",
      astrology: "Calitate astrologică:",
      moon: "Calitate lunară:",
      emotionalTone: "Ton emoțional azi:",
      watchToday: "Azi fii atent la:",
      bestDirection: "Cea mai bună direcție:",
      trading: "Trading:",
      body: "Corp / sistem nervos:"
    },
    moon: {
      staticHonest:
        "Datele despre Lună sunt acum estimate / mod static. Faza exactă va veni ulterior printr-un API live — nu folosim asta pentru predicții.",
      apiPending:
        "API-ul live pentru Lună nu e încă conectat; până atunci rămânem ancorați, fără precizie falsă."
    },
    lensLead: {
      general: "",
      trading: "Același cadru zilnic — citește prin risc, răbdare și disciplină de execuție.",
      body: "Același cadru zilnic — citește prin respirație, încărcare și onestitate somatică.",
      emotion: "Același cadru zilnic — sentiment fără dramă.",
      work: "Același cadru zilnic — priorități, adâncime și ritm sustenabil."
    }
  }
};

/** Deep numerology + emotional lines per vibration @type {Record<Lang, Record<number, { num: string, body: string, emotion: string }>>} */
const CORE = {
  en: {
    1: {
      num: "Day vibration: 1",
      body: "Clean initiation energy — name one direction and protect it from noise.",
      emotion: "Direct, slightly sharp — channel it into clarity, not pressure on others."
    },
    2: {
      num: "Day vibration: 2",
      body: "Cooperation and pacing — progress through listening and small agreements.",
      emotion: "Sensitive to friction — soften tone, keep boundaries intact."
    },
    3: {
      num: "Day vibration: 3",
      body: "Expression day — say the useful truth; skip clever performance.",
      emotion: "Social voltage can rise — keep honesty kind and concrete."
    },
    4: {
      num: "Day vibration: 4",
      body: "Structure day — boring steps build the real foundation.",
      emotion: "Craves steadiness — reduce variables; one brick at a time."
    },
    5: {
      num: "Day vibration: 5",
      body: "Movement and adaptation — change is fine if your feet stay on the ground.",
      emotion: "Restless edge — move the body before rewriting big decisions."
    },
    6: {
      num: "Day vibration: 6",
      body: "Care with boundaries — help where it does not erase you.",
      emotion: "Protective undertone — care for yourself first, then others."
    },
    7: {
      num: "Day vibration: 7",
      body: "Inner clearing, observation, focus — fewer open loops, more depth.",
      emotion: "Inward and precise — honor quiet without isolating as punishment."
    },
    8: {
      num: "Day vibration: 8",
      body: "Execution where leverage is real — cause and effect, without theatrics.",
      emotion: "Serious tone — use it for integrity, not cold self-attack."
    },
    9: {
      num: "Day vibration: 9",
      body: "Integration and closure — finish what is already done; release the rest.",
      emotion: "Completion energy — grief and relief can sit together; keep it simple."
    },
    11: {
      num: "Day vibration: 11",
      body: "Insight day — translate one vision into a small grounded action.",
      emotion: "Heightened intuition — anchor with breath and one measurable step."
    },
    22: {
      num: "Day vibration: 22",
      body: "Builder day — quiet foundational work beats announcements.",
      emotion: "Pressure to perform big — choose one durable hour instead."
    },
    33: {
      num: "Day vibration: 33",
      body: "Service with center — lead calmly without dissolving yourself.",
      emotion: "Warm intensity — help without carrying everyone’s weight."
    }
  },
  hu: {
    1: {
      num: "A nap rezgése: 1",
      body: "Tiszta kezdés — nevezz meg egy irányt, és óvd a zajtól.",
      emotion: "Egyenes, éles lehet a hang — tisztaságba fordítsd, ne másra nyomásba."
    },
    2: {
      num: "A nap rezgése: 2",
      body: "Együttműködés és tempó — haladj figyeléssel és kis egyezésekkel.",
      emotion: "Érzékeny a súrlódásra — lágyíts a hangon, a határokat tartsd."
    },
    3: {
      num: "A nap rezgése: 3",
      body: "Kifejezés napja — mondd a hasznos igazat; kerüld a játszást.",
      emotion: "Társas feszültség nőhet — az őszinteség legyen kedves és konkrét."
    },
    4: {
      num: "A nap rezgése: 4",
      body: "Szerkezet napja — az unalmas lépések építik a valódi alapot.",
      emotion: "Stabilitást kér — csökkents változót; egy téglányi lépés."
    },
    5: {
      num: "A nap rezgése: 5",
      body: "Mozgás és alkalmazkodás — a változás oké, ha a lábad a földön van.",
      emotion: "Nyugtalan él — mozgasd a testet, mielőtt nagy döntést írsz át."
    },
    6: {
      num: "A nap rezgése: 6",
      body: "Gondoskodás határral — segíts ott, ahol nem tűnsz el.",
      emotion: "Védő alhang — először magad, aztán más."
    },
    7: {
      num: "A nap rezgése: 7",
      body: "Ez inkább belső tisztulás, megfigyelés, fókusz.",
      emotion: "Befelé figyelő, pontos — tiszteld a csendet, ne büntetésként zárkózz el."
    },
    8: {
      num: "A nap rezgése: 8",
      body: "Végrehajtás ott, ahol a fogaskerék valódi — ok és következmény, dráma nélkül.",
      emotion: "Komoly hang — integritásra használd, ne önmarcanglásra."
    },
    9: {
      num: "A nap rezgése: 9",
      body: "Integráció és lezárás — fejezd be, ami kész; engedd el a többit.",
      emotion: "Befejezés energiája — gyász és megkönnyebbülés együtt — maradj egyszerű."
    },
    11: {
      num: "A nap rezgése: 11",
      body: "Érzékelés napja — egy látást üss át egy kis, földelt lépésbe.",
      emotion: "Éles intuíció — légzés + egy mérhető lépés horgonyként."
    },
    22: {
      num: "A nap rezgése: 22",
      body: "Építő nap — a csendes alapmunka veri a bejelentést.",
      emotion: "Nyomás a nagy teljesítményre — egy tartós órát válassz inkább."
    },
    33: {
      num: "A nap rezgése: 33",
      body: "Szolgálat középponttal — vezess nyugodtan anélkül, hogy elvesznél.",
      emotion: "Meleg intenzitás — segíts anélkül, hogy minden súlyát cipelnéd."
    }
  },
  ro: {
    1: {
      num: "Vibrația zilei: 1",
      body: "Inițiere curată — numește o direcție și protejeaz-o de zgomot.",
      emotion: "Directă, puțin tăioasă — canalizează spre claritate, nu spre presiune pe alții."
    },
    2: {
      num: "Vibrația zilei: 2",
      body: "Cooperare și ritm — progresează prin ascultare și mici acorduri.",
      emotion: "Sensibilă la fricțiune — înmoaie tonul, păstrează limitele."
    },
    3: {
      num: "Vibrația zilei: 3",
      body: "Zi de expresie — spune adevărul util; fără spectacol.",
      emotion: "Tensiune socială poate crește — onestitatea să fie blândă și concretă."
    },
    4: {
      num: "Vibrația zilei: 4",
      body: "Zi de structură — pașii plictisitori construiesc fundația reală.",
      emotion: "Cere stabilitate — reduce variabile; câte un pas."
    },
    5: {
      num: "Vibrația zilei: 5",
      body: "Mișcare și adaptare — schimbarea e ok dacă rămâi ancorat.",
      emotion: "Margine neliniștită — mișcă corpul înainte să rescrii decizii mari."
    },
    6: {
      num: "Vibrația zilei: 6",
      body: "Grijă cu limite — ajută unde nu te ștergi.",
      emotion: "Subton protector — mai întâi tu, apoi ceilalți."
    },
    7: {
      num: "Vibrația zilei: 7",
      body: "Clarificare interioară, observație, focus — mai puține bucle, mai multă adâncime.",
      emotion: "În interior și precis — respectă liniștea fără izolare ca pedeapsă."
    },
    8: {
      num: "Vibrația zilei: 8",
      body: "Execuție unde levierul e real — cauză și efect, fără teatru.",
      emotion: "Ton serios — folosește-l pentru integritate, nu pentru autoatac rece."
    },
    9: {
      num: "Vibrația zilei: 9",
      body: "Integrare și închidere — termină ce e gata; eliberează restul.",
      emotion: "Energie de final — durerea și ușurarea pot coexista; rămâi simplu."
    },
    11: {
      num: "Vibrația zilei: 11",
      body: "Zi de insight — traduce o viziune într-o acțiune mică, ancorată.",
      emotion: "Intuiție ridicată — ancorează cu respirație și un pas măsurabil."
    },
    22: {
      num: "Vibrația zilei: 22",
      body: "Zi de constructor — munca de bază în liniște bate anunțul.",
      emotion: "Presiune să „faci mare” — alege o oră durabilă."
    },
    33: {
      num: "Vibrația zilei: 33",
      body: "Serviciu cu centru — condu calm fără să te dizolvi.",
      emotion: "Intensitate caldă — ajută fără să cari toată greutatea."
    }
  }
};

/** Trading discipline lines @type {Record<Lang, Record<number, string>>} */
const TRADING = {
  en: {
    1: "Only clean setups. If you are tired, there is no trade.",
    2: "Wait for confirmation — patience is not missing the move.",
    3: "Avoid narrative trades; one rule, one size, one session.",
    4: "Process over hype — checklist before click.",
    5: "Volatility is not permission to improvise risk.",
    6: "Protect the account first; help your future self.",
    7: "Silence the feed — decisions from plan, not mood.",
    8: "Size to survive being wrong twice.",
    9: "Flat is a position — closure includes not trading.",
    11: "If the thesis is fuzzy, reduce or skip.",
    22: "Boring execution beats clever revenge.",
    33: "No martyrdom in size — discipline is kindness to capital."
  },
  hu: {
    1: "Csak tiszta setup. Ha fáradt vagy, nincs trade.",
    2: "Várj megerősítésre — a türelem nem egyenlő a kihagyott mozdulattal.",
    3: "Kerüld a narratív trade-eket; egy szabály, egy méret, egy szesszió.",
    4: "Folyamat a hype helyett — checklist a kattintás előtt.",
    5: "A volatilitás nem engedély a kockázat improvizálására.",
    6: "Először a számla — segíts a jövőbeli énednek.",
    7: "Némítsd a feedet — döntés tervből, nem hangulatból.",
    8: "Méretezz úgy, hogy kétszer tévedve is túléld.",
    9: "A flat is pozíció — a lezárás lehet nem tradelni.",
    11: "Ha a tézis homályos, csökkints vagy kihagyod.",
    22: "Unalmas végrehajtás veri az okos bosszút.",
    33: "Nincs mártíromkodás méretben — a fegyelem kedvesség a tőkéhez."
  },
  ro: {
    1: "Doar setup-uri curate. Dacă ești obosit, nu există trade.",
    2: "Așteaptă confirmarea — răbdarea nu înseamnă ratat mișcarea.",
    3: "Evită trade-urile de poveste; o regulă, o mărime, o sesiune.",
    4: "Proces în loc de hype — checklist înainte de click.",
    5: "Volatilitatea nu e voie să improvizezi riscul.",
    6: "Protejează contul mai întâi.",
    7: "Reduce feed-ul — decizii din plan, nu din stare.",
    8: "Dimensiunea să supraviețuiască a doua greșeli.",
    9: "Flat e poziție — închiderea include și a nu tranzacționa.",
    11: "Dacă teza e neclară, redu sau sari.",
    22: "Execuția plictisitoare bate răzbunarea isteață.",
    33: "Fără martiriu în sizing — disciplina e grijă față de capital."
  }
};

/** Body / nervous system @type {Record<Lang, Record<number, string>>} */
const BODY = {
  en: {
    1: "Ground through one slow exhale and one deliberate walk.",
    2: "Soften jaw and shoulders — nervous system likes gentle rhythm today.",
    3: "Shake out arms, hydrate — speech and nerves share a wire.",
    4: "Meal timing and sleep debt matter more than intensity.",
    5: "Five minutes of movement before caffeine decisions.",
    6: "Warm shower or sunlight on skin — regulate before helping others.",
    7: "Lower stimulation: dim screens, slower speech, fewer tabs.",
    8: "Heavy training only if sleep was real; otherwise mobility.",
    9: "Stretch and long exhale — completion in the body too.",
    11: "Eyes rest, feet on floor — insight needs a body anchor.",
    22: "Spine long, breath low — durability is physical patience.",
    33: "Heart rate steady first; generosity second."
  },
  hu: {
    1: "Földelés: egy lassú kilégzés, egy tudatos séta.",
    2: "Állkapocs és váll lazítása — az idegrendszer ma a gyengéd ritmust szereti.",
    3: "Rázd ki a karokat, hidratálj — a beszéd és az ideg egy vezetéken fut.",
    4: "Étkezés időzítése és alvásadósság fontosabb ma, mint az intenzitás.",
    5: "Öt perc mozgás a koffein-döntések előtt.",
    6: "Meleg zuhany vagy napfény a bőrön — szabályozz, mielőtt másokat segítesz.",
    7: "Csökkentsd az ingereket: tompíts képernyőt, lassabb beszéd, kevesebb lap.",
    8: "Kemény edzés csak ha az alvás rendben; különben mobilitás.",
    9: "Nyújtás és hosszú kilégzés — a lezárás a testben is.",
    11: "Szem pihen, láb a földön — az érzékeléshez test kell.",
    22: "Hosszú gerinc, mély légzés — a tartósság fizikai türelem.",
    33: "Előbb stabil pulzus; aztán a nagyvonalúság."
  },
  ro: {
    1: "Ancorare: o expirație lentă, o plimbare conștientă.",
    2: "Relaxează maxilarul și umerii — sistemul nervos preferă ritm blând azi.",
    3: "Scutură brațele, hidratează — vocea și nervii împart același fir.",
    4: "Mese și somn contează mai mult decât intensitatea.",
    5: "Cinci minute de mișcare înainte de decizii cu cofeină.",
    6: "Duș cald sau soare pe piele — reglează-te înainte să ajuți pe alții.",
    7: "Mai puțin stimul: ecrane, voce mai lentă, mai puține tab-uri.",
    8: "Antrenament greu doar dacă somnul a fost real; altfel mobilitate.",
    9: "Întinderi și expirație lungă — închidere și în corp.",
    11: "Ochii odihnă, picioarele pe podea — insight-ul cere corp.",
    22: "Coloană lungă, respirație jos — durabilitatea e răbdare fizică.",
    33: "Mai întâi puls stabil; apoi generozitate."
  }
};

/**
 * @param {Lang} lang
 * @param {string} lens
 */
function getFrame(lang, lens) {
  const l = lang === "hu" ? "hu" : lang === "ro" ? "ro" : "en";
  const f = FRAME[l];
  const title = f.lensTitles[lens] || f.title;
  return { ...f, title, lang: l };
}

/**
 * @param {Lang} lang
 * @param {number} vib
 */
function pickVib(lang, vib) {
  const l = lang === "hu" ? "hu" : lang === "ro" ? "ro" : "en";
  return CORE[l][vib] || CORE[l][7];
}

function pickTrading(lang, vib) {
  const l = lang === "hu" ? "hu" : lang === "ro" ? "ro" : "en";
  return TRADING[l][vib] || TRADING[l][7];
}

function pickBody(lang, vib) {
  const l = lang === "hu" ? "hu" : lang === "ro" ? "ro" : "en";
  return BODY[l][vib] || BODY[l][7];
}

/** @type {Record<Lang, Record<string, string>>} */
const LENS_TAIL = {
  en: {
    general: "",
    trading: "If the body is wired, size goes to zero — no hero trades.",
    body: "Regulation beats motivation: breath, food, sleep order first.",
    emotion: "Name the feeling in one word before you fix anything.",
    work: "One deep block beats five shallow ones — protect the calendar."
  },
  hu: {
    general: "",
    trading: "Ha a test pörög, a méret nulla — nincs hős trade.",
    body: "Szabályozás motiváció helyett: légzés, étel, alvás sorrendje előbb.",
    emotion: "Nevezd meg egy szóval az érzést, mielőtt javítanál bármit.",
    work: "Egy mély blokk ver öt sekélyet — védd a naptárat."
  },
  ro: {
    general: "",
    trading: "Dacă corpul e agitat, sizing la zero — fără trade-uri eroice.",
    body: "Reglarea bate motivația: respirație, mâncare, somn mai întâi.",
    emotion: "Numeste sentimentul într-un cuvânt înainte să repari.",
    work: "Un bloc adânc bate cinci superficiale — protejează calendarul."
  }
};

/**
 * @param {Lang} lang
 * @param {string} lens
 */
function getLensTail(lang, lens) {
  const l = lang === "hu" ? "hu" : lang === "ro" ? "ro" : "en";
  const row = LENS_TAIL[l] || LENS_TAIL.en;
  return row[lens] || "";
}

module.exports = {
  getFrame,
  pickVib,
  pickTrading,
  pickBody,
  signLine,
  getLensTail,
  CORE,
  FRAME
};
