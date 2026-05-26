/**
 * Primary execution paths — subtle influence on mantra, protocol, challenges, tone.
 */

const PATH_IDS = ["discipline", "energy", "stabilization", "warrior", "recovery", "trading"];

/** Legacy onboarding keys → canonical path id */
const LEGACY_TO_PATH = {
  stabilization: "stabilization",
  emotional: "stabilization",
  discipline: "discipline",
  selfdev: "discipline",
  energy: "energy",
  spiritual: "energy",
  warrior: "warrior",
  physical: "warrior",
  recovery: "recovery",
  trading: "trading",
  business: "discipline",
  mixed: "stabilization"
};

const PATHS = {
  discipline: {
    id: "discipline",
    emoji: "⚔",
    activeMode: "discipline",
    mantraTags: ["discipline", "focus"],
    challengeCategories: ["discipline", "focus", "digital_detox"],
    panelFolder: "/discipline",
    atmosphere: "calm"
  },
  energy: {
    id: "energy",
    emoji: "🌙",
    activeMode: "energy",
    mantraTags: ["focus", "recovery"],
    challengeCategories: ["body", "awareness", "nervous_system"],
    panelFolder: "/energy",
    atmosphere: "grounded"
  },
  stabilization: {
    id: "stabilization",
    emoji: "🫀",
    activeMode: "stabilization",
    mantraTags: ["stabilization", "recovery"],
    challengeCategories: ["nervous_system", "awareness", "recovery"],
    panelFolder: "/stabilization",
    atmosphere: "grounded"
  },
  warrior: {
    id: "warrior",
    emoji: "🔥",
    activeMode: "warrior",
    mantraTags: ["warrior", "discipline", "focus"],
    challengeCategories: ["discipline", "focus", "body"],
    panelFolder: "/training",
    atmosphere: "warrior"
  },
  recovery: {
    id: "recovery",
    emoji: "🌊",
    activeMode: "recovery",
    mantraTags: ["recovery", "let_go"],
    challengeCategories: ["recovery", "nervous_system", "awareness"],
    panelFolder: "/recovery",
    atmosphere: "recovery"
  },
  trading: {
    id: "trading",
    emoji: "📈",
    activeMode: "trading",
    mantraTags: ["discipline", "focus"],
    challengeCategories: ["trading_discipline", "focus", "nervous_system"],
    panelFolder: "/trading",
    atmosphere: "calm"
  }
};

const PATH_COPY = {
  hu: {
    discipline: {
      label: "Fegyelem",
      cues: {
        morning: ["⚔ Védd a fókuszt.", "⚔ Egy tiszta blokk ma."],
        midday: ["⚔ Egy sáv. Ne szivárogjon el.", "⚔ Vissza a végrehajtáshoz."],
        evening: ["⚔ Ma elég egy lezárt kör.", "⚔ Holnap folytatjuk — ma zárd le."]
      }
    },
    energy: {
      label: "Energia",
      cues: {
        morning: ["🌙 A figyelem is energia.", "🫀 Víz és légzés előbb."],
        midday: ["🌙 Lassíts mielőtt szétesel.", "🫀 Mozgás + víz most."],
        evening: ["🌙 Kevesebb stimuláció este.", "🫀 A tested jelezzen, ne a feed."]
      }
    },
    stabilization: {
      label: "Stabilizálás",
      cues: {
        morning: ["🌊 Most az alapokat stabilizáljuk.", "🫀 Kis lépés, tiszta jelenlét."],
        midday: ["🌊 Egy horgony elég.", "🫀 Légzés, víz, egy irány."],
        evening: ["🌘 Nem kell ma túlterhelni magad.", "🌊 Ma elengedés, nem új harc."]
      }
    },
    warrior: {
      label: "Harcos",
      cues: {
        morning: ["🔥 Momentum mozgásból épül.", "⚔ Kevesebb zaj. Több végrehajtás."],
        midday: ["🔥 Egy blokk. Teljes jelenlét.", "⚔ A standardod ma: egy cél."],
        evening: ["🔥 Ma zárd a kört.", "⚔ Holnap építünk tovább."]
      }
    },
    recovery: {
      label: "Felépülés",
      cues: {
        morning: ["🌊 A regeneráció nem gyengeség.", "🌘 Ma nem push kell."],
        midday: ["🌊 Lassú tempó elég.", "🫀 Víz, légzés, séta."],
        evening: ["🌘 A pihenés is a program része.", "🌊 Ma elengedés prioritás."]
      }
    },
    trading: {
      label: "Trading fókusz",
      cues: {
        morning: ["📉 Szabály előbb, képernyő utána.", "🫀 Trade előtt milyen a tested?"],
        midday: ["📉 Setup vagy impulse?", "⚔ Nyugodt vagy vagy bizonyítani akarsz?"],
        evening: ["📉 Ma zárj — nincs revenge.", "🌊 Trade után légzés."]
      }
    }
  },
  en: {
    discipline: {
      label: "Discipline",
      cues: {
        morning: ["⚔ Protect focus.", "⚔ One clean block today."],
        midday: ["⚔ One lane. Do not leak.", "⚔ Back to execution."],
        evening: ["⚔ One closed loop is enough.", "⚔ Tomorrow continues — close today."]
      }
    },
    energy: {
      label: "Energy",
      cues: {
        morning: ["🌙 Attention is energy.", "🫀 Water and breath first."],
        midday: ["🌙 Slow down before scatter.", "🫀 Move + hydrate now."],
        evening: ["🌙 Less stimulation tonight.", "🫀 Let the body signal, not the feed."]
      }
    },
    stabilization: {
      label: "Stabilization",
      cues: {
        morning: ["🌊 Stabilize the basics now.", "🫀 Small step, clear presence."],
        midday: ["🌊 One anchor is enough.", "🫀 Breath, water, one direction."],
        evening: ["🌘 Do not overload yourself today.", "🌊 Release tonight, not new fights."]
      }
    },
    warrior: {
      label: "Warrior",
      cues: {
        morning: ["🔥 Momentum builds from movement.", "⚔ Less noise. More execution."],
        midday: ["🔥 One block. Full presence.", "⚔ Today's standard: one target."],
        evening: ["🔥 Close the loop today.", "⚔ We build again tomorrow."]
      }
    },
    recovery: {
      label: "Recovery",
      cues: {
        morning: ["🌊 Recovery is not weakness.", "🌘 No push needed today."],
        midday: ["🌊 Slow pace is enough.", "🫀 Water, breath, walk."],
        evening: ["🌘 Rest is part of the program.", "🌊 Release comes first."]
      }
    },
    trading: {
      label: "Trading focus",
      cues: {
        morning: ["📉 Rules before screen.", "🫀 How is your body before trade?"],
        midday: ["📉 Setup or impulse?", "⚔ Calm or proving something?"],
        evening: ["📉 Close today — no revenge.", "🌊 Breath after the session."]
      }
    }
  },
  ro: {
    discipline: {
      label: "Disciplină",
      cues: {
        morning: ["⚔ Protejează focusul.", "⚔ Un bloc curat azi."],
        midday: ["⚔ O bandă. Fără scurgeri.", "⚔ Înapoi la execuție."],
        evening: ["⚔ Un ciclu închis e suficient.", "⚔ Mâine continuăm — închide azi."]
      }
    },
    energy: {
      label: "Energie",
      cues: {
        morning: ["🌙 Atenția e energie.", "🫀 Apă și respirație întâi."],
        midday: ["🌙 Încetinește înainte de haos.", "🫀 Mișcare + apă acum."],
        evening: ["🌙 Mai puțin stimul diseară.", "🫀 Corpul semnalează, nu feed-ul."]
      }
    },
    stabilization: {
      label: "Stabilizare",
      cues: {
        morning: ["🌊 Stabilizăm bazele acum.", "🫀 Pas mic, prezență clară."],
        midday: ["🌊 O ancoră e suficientă.", "🫀 Respirație, apă, o direcție."],
        evening: ["🌘 Nu te supraîncărca azi.", "🌊 Eliberare diseară, nu luptă nouă."]
      }
    },
    warrior: {
      label: "Warrior",
      cues: {
        morning: ["🔥 Momentum din mișcare.", "⚔ Mai puțin zgomot. Mai multă execuție."],
        midday: ["🔥 Un bloc. Prezență totală.", "⚔ Standardul de azi: o țintă."],
        evening: ["🔥 Închide ciclul azi.", "⚔ Mâine construim din nou."]
      }
    },
    recovery: {
      label: "Recuperare",
      cues: {
        morning: ["🌊 Recuperarea nu e slăbiciune.", "🌘 Azi nu e push."],
        midday: ["🌊 Ritm lent e suficient.", "🫀 Apă, respirație, mers."],
        evening: ["🌘 Odihna e parte din program.", "🌊 Eliberarea are prioritate."]
      }
    },
    trading: {
      label: "Trading focus",
      cues: {
        morning: ["📉 Reguli înainte de ecran.", "🫀 Cum e corpul înainte de trade?"],
        midday: ["📉 Setup sau impuls?", "⚔ Calm sau demonstrezi ceva?"],
        evening: ["📉 Închide azi — fără revenge.", "🌊 Respirație după sesiune."]
      }
    }
  }
};

const PATH_MENU = {
  hu: {
    title: "🐉 Elsődleges út",
    current: "Aktív út: {path}",
    hint: "Váltás: /path discipline | energy | stabilization | warrior | recovery | trading",
    switched: "Út frissítve: {path}\n{emoji} {cue}",
    invalid: "Ismeretlen út. Használd: discipline, energy, stabilization, warrior, recovery, trading"
  },
  en: {
    title: "🐉 Primary path",
    current: "Active path: {path}",
    hint: "Switch: /path discipline | energy | stabilization | warrior | recovery | trading",
    switched: "Path updated: {path}\n{emoji} {cue}",
    invalid: "Unknown path. Use: discipline, energy, stabilization, warrior, recovery, trading"
  },
  ro: {
    title: "🐉 Cale principală",
    current: "Cale activă: {path}",
    hint: "Schimbă: /path discipline | energy | stabilization | warrior | recovery | trading",
    switched: "Cale actualizată: {path}\n{emoji} {cue}",
    invalid: "Cale necunoscută. Folosește: discipline, energy, stabilization, warrior, recovery, trading"
  }
};

module.exports = {
  PATH_IDS,
  PATHS,
  LEGACY_TO_PATH,
  PATH_COPY,
  PATH_MENU
};
