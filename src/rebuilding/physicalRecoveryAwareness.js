/**
 * Physical recovery awareness — no medical advice, body return support.
 */

/** @type {Array<{ id: string, language: string, text: string }>} */
const PHYSICAL_RECOVERY_AWARENESS = [
  {
    id: "pra_hu_1",
    language: "hu",
    text: "Figyeld hogyan reagál ma a tested."
  },
  {
    id: "pra_hu_2",
    language: "hu",
    text: "Kis mozgás is számít."
  },
  {
    id: "pra_hu_3",
    language: "hu",
    text: "Ne a tökéletes napot keresd."
  },
  {
    id: "pra_hu_4",
    language: "hu",
    text: "Lassú légzés — egy perc elég."
  },
  {
    id: "pra_hu_5",
    language: "hu",
    text: "Mobilitás előbb, intenzitás később."
  },
  {
    id: "pra_hu_6",
    language: "hu",
    text: "A test jelzései fontosabbak mint a terv."
  },
  {
    id: "pra_en_1",
    language: "en",
    text: "Notice how your body responds today."
  },
  {
    id: "pra_en_2",
    language: "en",
    text: "Small movement still counts."
  },
  {
    id: "pra_en_3",
    language: "en",
    text: "Do not chase the perfect day."
  },
  {
    id: "pra_en_4",
    language: "en",
    text: "Slow breath — one minute is enough."
  },
  {
    id: "pra_en_5",
    language: "en",
    text: "Mobility first, intensity later."
  },
  {
    id: "pra_en_6",
    language: "en",
    text: "Body signals matter more than the plan."
  },
  {
    id: "pra_ro_1",
    language: "ro",
    text: "Observă cum răspunde corpul azi."
  },
  {
    id: "pra_ro_2",
    language: "ro",
    text: "Mișcarea mică contează."
  },
  {
    id: "pra_ro_3",
    language: "ro",
    text: "Nu căuta ziua perfectă."
  },
  {
    id: "pra_ro_4",
    language: "ro",
    text: "Respirație lentă — un minut e suficient."
  },
  {
    id: "pra_ro_5",
    language: "ro",
    text: "Mobilitate mai întâi, intensitate mai târziu."
  },
  {
    id: "pra_ro_6",
    language: "ro",
    text: "Semnalele corpului contează mai mult decât planul."
  }
];

const MEDICAL_ADVICE_RE =
  /\b(diagnos|prescri|gyógyszer|medication|dosage|surgery plan|operáció|see a doctor|orvos|consult.*physician|treatment for|kezelés erre)\b/i;

module.exports = { PHYSICAL_RECOVERY_AWARENESS, MEDICAL_ADVICE_RE };
