/** Scheduled daily rhythm message templates (EN / HU / RO). */

module.exports = {
  scheduledRhythm: {
    en: {
      morning: {
        title: "⚔ Morning activation",
        mantraLabel: "Mantra",
        startLabel: "Start",
        startLines: ["1. Water", "2. Breath", "3. One clean focus"],
        missionQuestion: "Today's question:\nWhat is the one task you will not let scatter today?",
        bodyAnchor: "Body: stand, breathe, move once."
      },
      midday: {
        title: "☀ Midday stabilization",
        mantraLabel: "Mantra",
        checkLabel: "Check",
        checkLines: [
          "- Did you eat / drink properly?",
          "- Did you move today?",
          "- What pulled focus away?"
        ],
        closeLine: "Back to one lane."
      },
      evening: {
        title: "🌘 Evening release",
        mantraLabel: "Mantra",
        closeLabel: "Close",
        closeLines: [
          "- What did you carry through today?",
          "- Where did energy leak?",
          "- What do you release tonight?"
        ],
        windDown: ["Less screen.", "Slower breath.", "Tomorrow we build again."]
      }
    },
    hu: {
      morning: {
        title: "⚔ Reggeli aktiválás",
        mantraLabel: "Mantra",
        startLabel: "Kezdés",
        startLines: ["1. Víz", "2. Légzés", "3. Egy tiszta fókusz"],
        missionQuestion:
          "Mai kérdés:\nMi az az egyetlen feladat, amit ma nem engedsz szétesni?",
        bodyAnchor: "Test: állj fel, lélegezz, mozogj egyszer."
      },
      midday: {
        title: "☀ Délközi stabilizálás",
        mantraLabel: "Mantra",
        checkLabel: "Ellenőrzés",
        checkLines: [
          "- Ettél / ittál rendesen?",
          "- Mozdultál ma?",
          "- Mi vitte el a fókuszt?"
        ],
        closeLine: "Vissza egy sávra."
      },
      evening: {
        title: "🌘 Esti elengedés",
        mantraLabel: "Mantra",
        closeLabel: "Zárás",
        closeLines: [
          "- Mit vittél ma végig?",
          "- Hol szivárgott el az energiád?",
          "- Mit engedsz el ma estére?"
        ],
        windDown: [
          "Kevesebb képernyő.",
          "Lassabb légzés.",
          "Holnap újra építünk."
        ]
      }
    },
    ro: {
      morning: {
        title: "⚔ Activare dimineață",
        mantraLabel: "Mantra",
        startLabel: "Start",
        startLines: ["1. Apă", "2. Respirație", "3. Un focus curat"],
        missionQuestion:
          "Întrebarea zilei:\nCare e singurul task pe care nu îl lași să se împrăștie azi?",
        bodyAnchor: "Corp: ridică-te, respiră, mișcă-te o dată."
      },
      midday: {
        title: "☀ Stabilizare prânz",
        mantraLabel: "Mantra",
        checkLabel: "Verificare",
        checkLines: [
          "- Ai mâncat / băut ok?",
          "- Te-ai mișcat azi?",
          "- Ce ți-a furat focusul?"
        ],
        closeLine: "Înapoi pe o bandă."
      },
      evening: {
        title: "🌘 Eliberare seară",
        mantraLabel: "Mantra",
        closeLabel: "Închidere",
        closeLines: [
          "- Ce ai dus azi până la capăt?",
          "- Unde a pierdut energia?",
          "- Ce eliberezi diseară?"
        ],
        windDown: [
          "Mai puțin ecran.",
          "Respirație mai lentă.",
          "Mâine construim din nou."
        ]
      }
    }
  }
};
