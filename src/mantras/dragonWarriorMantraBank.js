/**
 * Dragon Blueprint harcos mantra bank — figyelem, cél, erő, fájdalom, nevetés, út.
 * 300 egyedi bejegyzés (regiszter + köszöntő).
 */

const { pickSeeded } = require("../personality/kaizenVoice");

const THEMES = {
  attention: {
    hu: [
      "A figyelem energia — ne szóródj ma.",
      "Egy sáv. Egy feladat. Egy lélegzet.",
      "A zaj nem a te dolgod — a fókusz igen.",
      "A modern harcos védi a figyelmét.",
      "Ma kevesebb input, több irány.",
      "A figyelem ritkább erőforrás, mint az idő.",
      "Zárd a zajt. Nyisd az utat.",
      "Egy tiszta blokk elég a nap elején.",
      "Ne kövesd minden impulzust — kövesd a célt.",
      "A figyelem döntés, nem szerencse."
    ],
    en: [
      "Attention is energy — don't scatter today.",
      "One lane. One task. One breath.",
      "Noise isn't your job — focus is.",
      "The modern warrior protects attention.",
      "Less input today. More direction.",
      "Attention is rarer than time.",
      "Close the noise. Open the path.",
      "One clean block is enough to start.",
      "Don't follow every impulse — follow the goal.",
      "Attention is a decision, not luck."
    ],
    ro: [
      "Atenția e energie — nu te împrăștia azi.",
      "O bandă. O sarcină. O respirație.",
      "Zgomotul nu e treaba ta — focusul da.",
      "Războinicul modern își protejează atenția.",
      "Mai puțin input azi. Mai multă direcție.",
      "Atenția e mai rară decât timpul.",
      "Închide zgomotul. Deschide drumul.",
      "Un bloc curat e suficient la start.",
      "Nu urma fiecare impuls — urmează țelul.",
      "Atenția e decizie, nu noroc."
    ]
  },
  goal: {
    hu: [
      "Egy cél ma. Nem tíz.",
      "A cél tisztít — a bizonytalanság zaj.",
      "Ma egy lépés a cél felé.",
      "A harcos nem mindent akar — egyet igen.",
      "Cél nélkül sodródsz. Céllel építesz.",
      "Mi az egyetlen dolog, ami ma számít?",
      "A cél nem stressz — irány.",
      "Ma a célod védelme a fegyelem.",
      "Egy irány. Egy végrehajtás.",
      "A cél emlékeztet: miért vagy itt."
    ],
    en: [
      "One goal today. Not ten.",
      "Goals clarify — uncertainty is noise.",
      "One step toward the goal today.",
      "The warrior doesn't want everything — one thing yes.",
      "Without a goal you drift. With one you build.",
      "What is the one thing that matters today?",
      "A goal isn't stress — it's direction.",
      "Today discipline protects your goal.",
      "One direction. One execution.",
      "The goal reminds you why you're here."
    ],
    ro: [
      "Un țel azi. Nu zece.",
      "Țelul clarifică — incertitudinea e zgomot.",
      "Un pas spre țel azi.",
      "Războinicul nu vrea totul — un lucru da.",
      "Fără țel plutești. Cu țel construiești.",
      "Care e singurul lucru care contează azi?",
      "Țelul nu e stres — e direcție.",
      "Azi disciplina îți protejează țelul.",
      "O direcție. O execuție.",
      "Țelul îți amintește de ce ești aici."
    ]
  },
  strength: {
    hu: [
      "Az erő csendes végrehajtás.",
      "Ma nem hangosabb leszel — stabilabb.",
      "Az erő: megcsinálni, amit ígértél.",
      "A harcos nem panaszkodik — cselekszik.",
      "Erő = egy blokk végig.",
      "Ma a tested is része a pályának.",
      "Az erő nem üvöltés — következetesség.",
      "Egy kemény döntés ma elég.",
      "Az erő védi a határaidat.",
      "Ma építesz — nem bizonyítasz."
    ],
    en: [
      "Strength is quiet execution.",
      "Today you won't be louder — you'll be steadier.",
      "Strength: do what you promised.",
      "The warrior doesn't complain — acts.",
      "Strength = one block through to the end.",
      "Today your body is part of the path.",
      "Strength isn't shouting — it's consistency.",
      "One hard decision today is enough.",
      "Strength protects your boundaries.",
      "Today you build — you don't prove."
    ],
    ro: [
      "Puterea e execuție liniștită.",
      "Azi nu vei fi mai zgomotos — mai stabil.",
      "Putere: faci ce ai promis.",
      "Războinicul nu se plânge — acționează.",
      "Putere = un bloc până la capăt.",
      "Azi corpul tău e parte din drum.",
      "Puterea nu e strigăt — e consecvență.",
      "O decizie grea azi e suficientă.",
      "Puterea îți protejează limitele.",
      "Azi construiești — nu demonstrezi."
    ]
  },
  pain: {
    hu: [
      "A fájdalom adat — nem ítélet.",
      "Ma nem kerülöd — irányítod.",
      "A harcos nem tagadja a nehézet.",
      "Fájdalom után is van következő lépés.",
      "A kemény nap is a pálya része.",
      "Ma finoman, de őszintén.",
      "A fájdalom tanít — ha meghallod.",
      "Nem gyengeség érezni. Gyengeség futni.",
      "Ma egy kis lépés a fájdalom mellett is elég.",
      "A fájdalom nem állít meg — ha visszatérsz."
    ],
    en: [
      "Pain is data — not a verdict.",
      "Today you don't avoid it — you steer.",
      "The warrior doesn't deny the hard part.",
      "After pain there is still a next step.",
      "A hard day is still part of the path.",
      "Today gently, but honestly.",
      "Pain teaches — if you listen.",
      "Feeling isn't weakness. Running is.",
      "One small step beside pain is enough today.",
      "Pain doesn't stop you — if you return."
    ],
    ro: [
      "Durerea e informație — nu verdict.",
      "Azi nu o eviți — o conduci.",
      "Războinicul nu negă partea grea.",
      "După durere mai e un pas următor.",
      "O zi grea e tot parte din drum.",
      "Azi blând, dar sincer.",
      "Durerea învață — dacă asculți.",
      "A simți nu e slăbiciune. A fugi da.",
      "Un pas mic lângă durere e suficient azi.",
      "Durerea nu te oprește — dacă revii."
    ]
  },
  laughter: {
    hu: [
      "A nevetés is fegyelem — nem menekülés.",
      "Ma egy könnyű pillanat is része az útnak.",
      "A harcos nem komor — fókuszált.",
      "Nevess, aztán egy blokk.",
      "A könnyedség nem gyengeség — táplálék.",
      "Ma engedj egy mosolyt — maradj az úton.",
      "A nevetés leengedi a vállat — aztán dolgozol.",
      "Humor + fegyelem = tartós harcos.",
      "Egy rövid nevetés, aztán vissza a sávba.",
      "Ma emberi vagy — és mégis építesz."
    ],
    en: [
      "Laughter is discipline too — not escape.",
      "A light moment today is still part of the path.",
      "The warrior isn't grim — focused.",
      "Laugh, then one block.",
      "Lightness isn't weakness — it's fuel.",
      "Allow a smile today — stay on the path.",
      "Laughter drops the shoulders — then you work.",
      "Humor + discipline = lasting warrior.",
      "A short laugh, then back to the lane.",
      "Today you're human — and still building."
    ],
    ro: [
      "Râsul e și disciplină — nu evadare.",
      "Un moment ușor azi e tot parte din drum.",
      "Războinicul nu e posomorât — e focusat.",
      "Râzi, apoi un bloc.",
      "Ușurința nu e slăbiciune — e combustibil.",
      "Permite un zâmbet azi — rămâi pe drum.",
      "Râsul coboară umerii — apoi lucrezi.",
      "Umor + disciplină = războinic durabil.",
      "Un râs scurt, apoi înapoi pe bandă.",
      "Azi ești om — și tot construiești."
    ]
  },
  path: {
    hu: [
      "Vissza az útra. Ma is.",
      "A Dragon Blueprint nem tökéletesség — visszatérés.",
      "Egy lépés vissza az útra elég.",
      "Ma nem új élet — egy tiszta döntés.",
      "Az út minden nap újra kezdődik.",
      "A harcos visszatér — nem tökéletesedik.",
      "Ma a pálya fontosabb, mint a hangulat.",
      "Vissza az útra. Csendben. Erővel.",
      "Az út téged is formál — maradj rajta.",
      "Ma: út, víz, légzés, egy blokk."
    ],
    en: [
      "Return to the path. Today too.",
      "Dragon Blueprint isn't perfection — it's return.",
      "One step back on the path is enough.",
      "Today not a new life — one clear decision.",
      "The path restarts every day.",
      "The warrior returns — doesn't become perfect.",
      "Today the path matters more than mood.",
      "Return to the path. Quiet. Strong.",
      "The path shapes you too — stay on it.",
      "Today: path, water, breath, one block."
    ],
    ro: [
      "Înapoi pe drum. Și azi.",
      "Dragon Blueprint nu e perfecțiune — e revenire.",
      "Un pas înapoi pe drum e suficient.",
      "Azi nu viață nouă — o decizie clară.",
      "Drumul reîncepe în fiecare zi.",
      "Războinicul revine — nu devine perfect.",
      "Azi drumul contează mai mult decât starea.",
      "Înapoi pe drum. Liniștit. Puternic.",
      "Drumul te modelează — rămâi pe el.",
      "Azi: drum, apă, respirație, un bloc."
    ]
  }
};

/** @type {Array<object>} */
let REGISTRY_CACHE = null;

function buildWarriorMantraRegistry() {
  if (REGISTRY_CACHE) return REGISTRY_CACHE;
  const out = [];
  const themeKeys = Object.keys(THEMES);
  const phases = ["morning", "midday", "evening"];
  let idx = 0;

  for (let round = 0; round < 10; round++) {
    for (const theme of themeKeys) {
      for (let v = 0; v < 5; v++) {
        const slot = phases[idx % 3];
        const t = THEMES[theme];
        const vi = (v + round) % 10;
        out.push({
          id: `warrior_${String(idx + 1).padStart(3, "0")}`,
          category: "warrior_mantra",
          phase: slot,
          timeOfDay: [slot],
          tags: [theme, "warrior", "dragon_path"],
          en: t.en[vi],
          hu: t.hu[vi],
          ro: t.ro[vi],
          level: ["beginner", "intermediate", "advanced"],
          energy_state: ["low", "stable", "high", "exhausted"]
        });
        idx += 1;
        if (idx >= 300) break;
      }
      if (idx >= 300) break;
    }
    if (idx >= 300) break;
  }

  REGISTRY_CACHE = out;
  return out;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {'morning'|'midday'|'evening'} phase
 */
function pickWarriorMantra(lang, session, userId, dateKey, phase = "morning") {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const used = new Set(session?.recentWarriorMantraIds || []);
  let pool = buildWarriorMantraRegistry().filter(
    (e) => e.timeOfDay.includes(phase) && !used.has(e.id)
  );
  if (!pool.length) {
    pool = buildWarriorMantraRegistry().filter((e) => e.timeOfDay.includes(phase));
  }
  const entry = pickSeeded(pool, `${userId}|wm|${dateKey}|${phase}`);
  if (!entry) return null;
  const text = entry[locked] || entry.en;
  const { updateSession } = require("../session/sessionStore");
  updateSession(userId, {
    recentWarriorMantraIds: [...used, entry.id].slice(-48)
  });
  return text;
}

function getWarriorMantraCount() {
  return buildWarriorMantraRegistry().length;
}

module.exports = {
  THEMES,
  buildWarriorMantraRegistry,
  pickWarriorMantra,
  getWarriorMantraCount
};
