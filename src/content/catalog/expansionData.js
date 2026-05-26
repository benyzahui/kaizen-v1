/**
 * Expansion copy — add rows here to grow pools without architecture changes.
 */

const STABILIZATION_ROWS = [
  { hu: "Víz. Légzés. Egy lépés.", en: "Water. Breath. One step.", ro: "Apă. Respirație. Un pas." },
  { hu: "Előbb csökkentsd a zajt.", en: "Lower the noise first.", ro: "Mai întâi mai puțin zgomot." },
  { hu: "A tested jelez — hallgasd meg.", en: "Your body signals — listen.", ro: "Corpul semnalează — ascultă." },
  { hu: "Egy horgony elég most.", en: "One anchor is enough now.", ro: "O ancoră e suficientă acum." },
  { hu: "Nem lustaság. Túl nyitott a rendszer.", en: "Not laziness. System too open.", ro: "Nu e lene. Sistemul e prea deschis." },
  { hu: "Lassú kilélegzés. Aztán döntés.", en: "Slow exhale. Then decide.", ro: "Expirație lentă. Apoi decizia." },
  { hu: "Stabilitás az intenzitás előtt.", en: "Stability before intensity.", ro: "Stabilitate înainte de intensitate." },
  { hu: "Egy nyitott kör zárása.", en: "Close one open loop.", ro: "Închide o buclă deschisă." },
  { hu: "Mai kevesebb input.", en: "Less input.", ro: "Mai puțin input." },
  { hu: "Talaj. Légzés. Irány.", en: "Ground. Breath. Direction.", ro: "Pământ. Respirație. Direcție." },
  { hu: "Ne építs új rendszert most.", en: "Do not build a new system now.", ro: "Nu construi sistem nou acum." },
  { hu: "A figyelem szétesik — egy sáv.", en: "Attention scattered — one lane.", ro: "Atenția e împrăștiată — o bandă." },
  { hu: "Váll le. Egy perc csend.", en: "Shoulders down. One minute quiet.", ro: "Umerii jos. Un minut liniște." },
  { hu: "Ma elég egy stabil lépés.", en: "One stable step is enough today.", ro: "Un pas stabil e suficient azi." }
];

const DISCIPLINE_ROWS = [
  { hu: "Egy blokk. Teljes jelenlét.", en: "One block. Full presence.", ro: "Un bloc. Prezență totală." },
  { hu: "Egy sáv — amíg kész.", en: "One lane — until done.", ro: "O bandă — până e gata." },
  { hu: "Telefon le. 25 perc.", en: "Phone down. 25 minutes.", ro: "Telefon jos. 25 minute." },
  { hu: "Ma nincs mellékküldetés.", en: "No side quests today.", ro: "Fără side quest-uri azi." },
  { hu: "A fegyelem csendes végrehajtás.", en: "Discipline is quiet execution.", ro: "Disciplina e execuție liniștită." },
  { hu: "Egy ígéret. Nincs alkudozás.", en: "One promise. No negotiation.", ro: "O promisiune. Fără negociere." },
  { hu: "Zárd a legkisebb kört.", en: "Close the smallest loop.", ro: "Închide cel mai mic cerc." },
  { hu: "Struktúra nyer a hangulat ellen.", en: "Structure beats mood.", ro: "Structura bate starea." },
  { hu: "Egy cél — kész.", en: "One target — done.", ro: "O țintă — gata." },
  { hu: "Ne szivárogjon el a nap.", en: "Do not leak the day away.", ro: "Nu lăsa ziua să se scurgă." },
  { hu: "Védd a fókuszt most.", en: "Protect focus now.", ro: "Protejează focusul acum." },
  { hu: "Egy tiszta blokk elég.", en: "One clean block is enough.", ro: "Un bloc curat e suficient." },
  { hu: "Végrehajtás, nem tervezés.", en: "Execution, not planning.", ro: "Execuție, nu planificare." },
  { hu: "Ma egy dolog legyen kész.", en: "Let one thing be finished today.", ro: "Un lucru să fie gata azi." }
];

const RECOVERY_ROWS = [
  { hu: "A regeneráció nem gyengeség.", en: "Recovery is not weakness.", ro: "Recuperarea nu e slăbiciune." },
  { hu: "Ma nem push kell.", en: "No push needed today.", ro: "Azi nu e push." },
  { hu: "Víz. Étkezés. Pihenés.", en: "Water. Food. Rest.", ro: "Apă. Masă. Odihnă." },
  { hu: "A pihenés is a program része.", en: "Rest is part of the program.", ro: "Odihna e parte din program." },
  { hu: "Lassabb tempó elég.", en: "Slower pace is enough.", ro: "Ritm lent e suficient." },
  { hu: "Ne húzd tovább ma.", en: "Do not carry today further.", ro: "Nu mai duce ziua mai departe." },
  { hu: "Elengedés este.", en: "Release tonight.", ro: "Eliberare diseară." },
  { hu: "Holnap építünk.", en: "We build tomorrow.", ro: "Mâine construim." },
  { hu: "A tested pihenjen.", en: "Let your body rest.", ro: "Lasă corpul să se odihnească." },
  { hu: "Egy kör zárása — aztán stop.", en: "Close one loop — then stop.", ro: "Închide un ciclu — apoi stop." }
];

const TRADING_ROWS = [
  { hu: "Szabály előbb, képernyő utána.", en: "Rules before screen.", ro: "Reguli înainte de ecran." },
  { hu: "Setup vagy impulse?", en: "Setup or impulse?", ro: "Setup sau impuls?" },
  { hu: "Nyugodt vagy vagy bizonyítani akarsz?", en: "Calm or proving something?", ro: "Calm sau demonstrezi ceva?" },
  { hu: "Trade előtt milyen a tested?", en: "How is your body before trade?", ro: "Cum e corpul înainte de trade?" },
  { hu: "Ma nincs revenge trade.", en: "No revenge trade today.", ro: "Fără revenge trade azi." },
  { hu: "Egy session. Plafon. Stop.", en: "One session. Cap. Stop.", ro: "O sesiune. Plafon. Stop." },
  { hu: "A terv írva van?", en: "Is the plan written?", ro: "Planul e scris?" },
  { hu: "Impulzus nem setup.", en: "Impulse is not a setup.", ro: "Impulsul nu e setup." },
  { hu: "Légzés trade után.", en: "Breath after the trade.", ro: "Respirație după trade." },
  { hu: "Disciplina a képernyő előtt dől el.", en: "Discipline is decided before the screen.", ro: "Disciplina se decide înainte de ecran." }
];

const AWARENESS_EXTRA_ROWS = [
  { hu: "Ma szétesett vagy inkább fókuszált voltál?", en: "Today — scattered or focused?", ro: "Azi — împrăștiat sau focus?" },
  { hu: "Energia vagy zaj dominált ma?", en: "Energy or noise dominated today?", ro: "Energia sau zgomotul a dominat?" },
  { hu: "Mi húzta szét ma a figyelmed?", en: "What pulled your attention apart?", ro: "Ce ți-a împrăștiat atenția?" },
  { hu: "Még azon a sávon vagy?", en: "Still on your lane?", ro: "Încă pe banda ta?" },
  { hu: "Valóban pihentél ma?", en: "Did you actually rest today?", ro: "Chiar te-ai odihnit azi?" },
  { hu: "Mit próbálsz túl sokáig kontrollálni?", en: "What are you controlling too long?", ro: "Ce controlezi prea mult timp?" },
  { hu: "Tested vagy fejed fáradtabb?", en: "Body or mind more tired?", ro: "Corp sau cap mai obosit?" },
  { hu: "Mi az egy dolog, amit elkerülsz?", en: "What is the one thing you avoid?", ro: "Ce eviți în mod conștient?" },
  { hu: "Őszinte: mi szívta el az energiát?", en: "Honest: what drained energy?", ro: "Onest: ce ți-a scurs energia?" },
  { hu: "Most küldetés vagy menekülés?", en: "Mission now — or escape?", ro: "Misiune acum — sau evitare?" },
  { hu: "Mi a legkisebb következő lépés?", en: "What is the smallest next step?", ro: "Care e cel mai mic pas următor?" },
  { hu: "Hol szivárog el a napod?", en: "Where is your day leaking?", ro: "Unde se scurge ziua?" }
];

const PROTOCOL_TEMPLATES = [
  {
    key: "water_anchor",
    category: "stabilization",
    intensity: "low",
    emotionalTone: "grounded",
    phases: ["morning", "midday", "evening"],
    energy: ["low", "exhausted", "stable"],
    modes: ["stabilization", "recovery", "energy"],
    title: { hu: "🫀 Víz + horgony", en: "🫀 Water anchor", ro: "🫀 Ancoră apă" },
    actions: {
      hu: ["egy pohár víz", "5 lassú kilélegzés", "állj fel egyszer"],
      en: ["one glass of water", "5 slow exhales", "stand once"],
      ro: ["un pahar de apă", "5 expirații lente", "ridică-te o dată"]
    }
  },
  {
    key: "breath_reset",
    category: "stabilization",
    intensity: "low",
    emotionalTone: "calm",
    phases: ["midday", "evening"],
    energy: ["low", "exhausted", "stable"],
    modes: ["stabilization", "recovery"],
    title: { hu: "🌊 Légzés reset", en: "🌊 Breath reset", ro: "🌊 Reset respirație" },
    actions: {
      hu: ["4-7-8 légzés ×3", "váll le", "egy perc csend"],
      en: ["4-7-8 breath ×3", "shoulders down", "one minute quiet"],
      ro: ["respirație 4-7-8 ×3", "umeri jos", "un minut liniște"]
    }
  },
  {
    key: "walk_spark",
    category: "movement",
    intensity: "medium",
    emotionalTone: "grounded",
    phases: ["morning", "midday"],
    energy: ["stable", "low", "high"],
    modes: ["energy", "discipline", "warrior"],
    title: { hu: "🔥 Séta szikra", en: "🔥 Walk spark", ro: "🔥 Scânteie mers" },
    actions: {
      hu: ["5 perc séta", "víz", "egy feladat kiválasztása"],
      en: ["5 min walk", "water", "pick one task"],
      ro: ["5 min mers", "apă", "alege un task"]
    }
  },
  {
    key: "focus_sprint",
    category: "focus",
    intensity: "high",
    emotionalTone: "focus",
    phases: ["morning", "midday"],
    energy: ["stable", "high"],
    modes: ["discipline", "warrior", "trading"],
    title: { hu: "⚔ Fókusz sprint", en: "⚔ Focus sprint", ro: "⚔ Sprint focus" },
    actions: {
      hu: ["telefon le", "20 perc", "egy sáv"],
      en: ["phone down", "20 minutes", "one lane"],
      ro: ["telefon jos", "20 minute", "o bandă"]
    }
  },
  {
    key: "deep_lane",
    category: "discipline",
    intensity: "high",
    emotionalTone: "focus",
    phases: ["morning", "midday"],
    energy: ["stable", "high"],
    modes: ["discipline", "warrior"],
    title: { hu: "⚔ Mély sáv", en: "⚔ Deep lane", ro: "⚔ Bandă adâncă" },
    actions: {
      hu: ["értesítések ki", "45 perc", "egy cél kész"],
      en: ["notifications off", "45 minutes", "one target done"],
      ro: ["notificări off", "45 minute", "o țintă gata"]
    }
  },
  {
    key: "screen_break",
    category: "stabilization",
    intensity: "low",
    emotionalTone: "calm",
    phases: ["midday"],
    energy: ["stable", "high", "low"],
    modes: ["stabilization", "discipline", "energy"],
    title: { hu: "📵 Képernyő szünet", en: "📵 Screen break", ro: "📵 Pauză ecran" },
    actions: {
      hu: ["10 perc képernyő nélkül", "víz", "ablak / séta"],
      en: ["10 min no screen", "water", "window or walk"],
      ro: ["10 min fără ecran", "apă", "fereastră sau mers"]
    }
  },
  {
    key: "trade_prep",
    category: "trading",
    intensity: "medium",
    emotionalTone: "calm",
    phases: ["morning", "midday"],
    energy: ["stable", "high"],
    modes: ["trading"],
    title: { hu: "📉 Trade prep", en: "📉 Trade prep", ro: "📉 Pregătire trade" },
    actions: {
      hu: ["szabályok olvasása", "test scan", "max kockázat rögzítve"],
      en: ["read rules", "body scan", "max risk set"],
      ro: ["citește regulile", "scan corp", "risc max setat"]
    }
  },
  {
    key: "trade_pause",
    category: "trading",
    intensity: "low",
    emotionalTone: "grounded",
    phases: ["midday", "evening"],
    energy: ["stable", "high", "low"],
    modes: ["trading"],
    title: { hu: "📉 Trade szünet", en: "📉 Trade pause", ro: "📉 Pauză trade" },
    actions: {
      hu: ["lépj el a képernyőtől", "5 légzés", "van-e revenge?"],
      en: ["step off screen", "5 breaths", "any revenge urge?"],
      ro: ["ieși de pe ecran", "5 respirații", "urgență revenge?"]
    }
  },
  {
    key: "evening_release",
    category: "letting_go",
    intensity: "low",
    emotionalTone: "release",
    phases: ["evening", "late_night"],
    energy: ["low", "exhausted", "stable"],
    modes: ["recovery", "stabilization"],
    title: { hu: "🌘 Esti elengedés", en: "🌘 Evening release", ro: "🌘 Eliberare seară" },
    actions: {
      hu: ["egy bucla zárása", "fény csökkentés", "lassú légzés"],
      en: ["close one loop", "dim lights", "slow breath"],
      ro: ["închide o buclă", "lumini mai jos", "respirație lentă"]
    }
  },
  {
    key: "sleep_prep",
    category: "recovery",
    intensity: "low",
    emotionalTone: "safety",
    phases: ["evening", "late_night"],
    energy: ["low", "exhausted"],
    modes: ["recovery", "stabilization"],
    title: { hu: "🌘 Alvás prep", en: "🌘 Sleep prep", ro: "🌘 Pregătire somn" },
    actions: {
      hu: ["képernyő le", "3 lassú kilélegzés", "holnap egy irány"],
      en: ["screen off", "3 slow exhales", "one direction tomorrow"],
      ro: ["ecran off", "3 expirații lente", "o direcție mâine"]
    }
  },
  {
    key: "body_scan",
    category: "recovery",
    intensity: "low",
    emotionalTone: "safety",
    phases: ["evening"],
    energy: ["exhausted", "low", "stable"],
    modes: ["recovery", "stabilization"],
    title: { hu: "🫀 Test scan", en: "🫀 Body scan", ro: "🫀 Scan corp" },
    actions: {
      hu: ["váll, állkapocs lazítás", "has légzés", "víz"],
      en: ["shoulders, jaw soft", "belly breath", "water"],
      ro: ["umeri, maxilar relax", "respirație buric", "apă"]
    }
  },
  {
    key: "loop_close",
    category: "discipline",
    intensity: "medium",
    emotionalTone: "focus",
    phases: ["midday", "evening"],
    energy: ["stable", "high"],
    modes: ["discipline", "stabilization"],
    title: { hu: "📉 Kör zárás", en: "📉 Loop close", ro: "📉 Închidere buclă" },
    actions: {
      hu: ["válaszd ki a kört", "zárj 10 perc alatt", "pipálj"],
      en: ["pick the loop", "close in 10 min", "check off"],
      ro: ["alege bucla", "închide în 10 min", "bifează"]
    }
  },
  {
    key: "posture_reset",
    category: "stabilization",
    intensity: "low",
    emotionalTone: "grounded",
    phases: ["midday"],
    energy: ["stable", "low"],
    modes: ["stabilization", "energy", "discipline"],
    title: { hu: "🫀 Postúra", en: "🫀 Posture", ro: "🫀 Postură" },
    actions: {
      hu: ["állj fel", "váll hátra", "5 légzés"],
      en: ["stand up", "shoulders back", "5 breaths"],
      ro: ["ridică-te", "umeri înapoi", "5 respirații"]
    }
  },
  {
    key: "single_task",
    category: "discipline",
    intensity: "medium",
    emotionalTone: "focus",
    phases: ["morning", "midday"],
    energy: ["stable", "high"],
    modes: ["discipline", "warrior", "trading"],
    title: { hu: "⚔ Egy feladat", en: "⚔ Single task", ro: "⚔ Un singur task" },
    actions: {
      hu: ["írd ki", "időzítsd", "kezdd el most"],
      en: ["write it", "timebox it", "start now"],
      ro: ["scrie-l", "cronometrează", "începe acum"]
    }
  },
  {
    key: "nervous_down",
    category: "overload",
    intensity: "low",
    emotionalTone: "safety",
    phases: ["midday", "evening"],
    energy: ["exhausted", "low"],
    modes: ["stabilization", "recovery"],
    title: { hu: "🫀 Idegrendszer le", en: "🫀 Nervous down", ro: "🫀 Coborâre nervoasă" },
    actions: {
      hu: ["3 hosszú kilélegzés", "víz", "kevesebb input 15 perc"],
      en: ["3 long exhales", "water", "less input 15 min"],
      ro: ["3 expirații lungi", "apă", "mai puțin input 15 min"]
    }
  },
  {
    key: "warrior_rep",
    category: "warrior",
    intensity: "high",
    emotionalTone: "warrior",
    phases: ["morning", "midday"],
    energy: ["high", "stable"],
    modes: ["warrior"],
    title: { hu: "🔥 Warrior rep", en: "🔥 Warrior rep", ro: "🔥 Rep warrior" },
    actions: {
      hu: ["10 perc mozgás", "víz", "egy cél"],
      en: ["10 min movement", "water", "one target"],
      ro: ["10 min mișcare", "apă", "o țintă"]
    }
  },
  {
    key: "recovery_rest",
    category: "recovery",
    intensity: "low",
    emotionalTone: "release",
    phases: ["midday", "evening"],
    energy: ["exhausted", "low"],
    modes: ["recovery"],
    title: { hu: "🌊 Recovery blokk", en: "🌊 Recovery block", ro: "🌊 Bloc recuperare" },
    actions: {
      hu: ["20 perc pihenő", "víz + étel", "nincs új commit"],
      en: ["20 min rest", "water + food", "no new commits"],
      ro: ["20 min odihnă", "apă + masă", "fără commit nou"]
    }
  },
  {
    key: "journal_line",
    category: "letting_go",
    intensity: "low",
    emotionalTone: "reflective",
    phases: ["evening"],
    energy: ["stable", "low", "exhausted"],
    modes: ["recovery", "stabilization"],
    title: { hu: "🌘 Egy sor", en: "🌘 One line", ro: "🌘 O linie" },
    actions: {
      hu: ["mi maradt nyitva?", "egy sor őszintén", "holnap egy irány"],
      en: ["what stayed open?", "one honest line", "one direction tomorrow"],
      ro: ["ce a rămas deschis?", "o linie onestă", "o direcție mâine"]
    }
  },
  {
    key: "calm_desk",
    category: "stabilization",
    intensity: "low",
    emotionalTone: "calm",
    phases: ["morning", "midday"],
    energy: ["stable", "low"],
    modes: ["stabilization", "discipline", "trading"],
    title: { hu: "🫀 Nyugodt asztal", en: "🫀 Calm desk", ro: "🫀 Birou calm" },
    actions: {
      hu: ["tiszta asztal", "egy eszköz", "víz"],
      en: ["clear desk", "one tool", "water"],
      ro: ["birou curat", "un instrument", "apă"]
    }
  },
  {
    key: "energy_sip",
    category: "movement",
    intensity: "low",
    emotionalTone: "grounded",
    phases: ["morning", "midday"],
    energy: ["low", "stable"],
    modes: ["energy", "recovery", "stabilization"],
    title: { hu: "🌙 Energia sip", en: "🌙 Energy sip", ro: "🌙 Sorbit energie" },
    actions: {
      hu: ["víz", "3 perc mozgás", "egy döntés"],
      en: ["water", "3 min movement", "one decision"],
      ro: ["apă", "3 min mișcare", "o decizie"]
    }
  },
  {
    key: "phone_away",
    category: "focus",
    intensity: "medium",
    emotionalTone: "focus",
    phases: ["morning", "midday"],
    energy: ["stable", "high"],
    modes: ["discipline", "warrior", "trading"],
    title: { hu: "📵 Telefon távol", en: "📵 Phone away", ro: "📵 Telefon departe" },
    actions: {
      hu: ["másik szobába", "időzítő", "egy feladat"],
      en: ["another room", "timer", "one task"],
      ro: ["altă cameră", "timer", "un task"]
    }
  },
  {
    key: "stretch_micro",
    category: "recovery",
    intensity: "low",
    emotionalTone: "safety",
    phases: ["evening"],
    energy: ["low", "exhausted", "stable"],
    modes: ["recovery", "stabilization"],
    title: { hu: "🌘 Mini nyújtás", en: "🌘 Mini stretch", ro: "🌘 Mini stretch" },
    actions: {
      hu: ["nyak", "hát", "3 lassú légzés"],
      en: ["neck", "back", "3 slow breaths"],
      ro: ["gât", "spate", "3 respirații lente"]
    }
  },
  {
    key: "fasting_anchor",
    category: "fasting",
    intensity: "medium",
    emotionalTone: "grounded",
    phases: ["morning", "midday"],
    energy: ["stable", "low"],
    modes: ["stabilization", "discipline"],
    title: { hu: "🫀 Böjt horgony", en: "🫀 Fasting anchor", ro: "🫀 Ancoră post" },
    actions: {
      hu: ["víz", "egy étkezési ablak", "nincs impulzus snack"],
      en: ["water", "one eating window", "no impulse snack"],
      ro: ["apă", "o fereastră masă", "fără snack impuls"]
    }
  }
];

module.exports = {
  STABILIZATION_ROWS,
  DISCIPLINE_ROWS,
  RECOVERY_ROWS,
  TRADING_ROWS,
  AWARENESS_EXTRA_ROWS,
  PROTOCOL_TEMPLATES
};
