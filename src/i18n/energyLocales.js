/**
 * Localized /energy line maps (static). Season line stays English (shared).
 */

const EN = Object.freeze({
  energy: {
    1: "Today supports clean beginnings and honest direction.",
    2: "Today supports patience, listening, and quiet cooperation.",
    3: "Today supports honest expression — words have weight.",
    4: "Today supports structure and steady, repeatable work.",
    5: "Today supports adaptable movement without scattering.",
    6: "Today supports caring with clear boundaries.",
    7: "Today supports simplification and emotional honesty.",
    8: "Today supports execution where the ground is already laid.",
    9: "Today supports integration — closing what is already done.",
    11: "Today supports vision anchored by simple structure.",
    22: "Today supports quiet building of something durable.",
    33: "Today supports calm leadership without losing yourself."
  },
  watch: {
    1: "Don't confuse a new idea with a finished plan.",
    2: "Don't override your intuition to keep the peace.",
    3: "Watch for performance instead of truth.",
    4: "Don't mistake stiffness for discipline.",
    5: "Don't let movement become avoidance.",
    6: "Watch for over-giving that drains you.",
    7: "Do not scatter your attention.",
    8: "Don't force outcomes through pressure.",
    9: "Don't keep carrying what is already complete.",
    11: "Watch for inspiration without a grounded step.",
    22: "Don't announce work that isn't done yet.",
    33: "Watch the line between helping and self-erasure."
  },
  action: {
    1: "Take one clean first step. Quietly.",
    2: "Listen fully to one person before responding.",
    3: "Say the true thing you've been softening.",
    4: "Build one small structural piece, then stop.",
    5: "Move your body, then re-decide from a steadier place.",
    6: "Honor one boundary you've been bending.",
    7: "Finish one thing fully before opening a new loop.",
    8: "Execute the next obvious step. No theatrics.",
    9: "Close one open loop before adding anything new.",
    11: "Translate one insight into a 10-minute action.",
    22: "Do an hour of the boring foundational work.",
    33: "Help where it costs you nothing essential."
  },
  reminder: {
    1: "Beginnings deserve patience, not pressure.",
    2: "Strength can be soft.",
    3: "Honest words land deeper than clever ones.",
    4: "Structure is care, repeated.",
    5: "Anchored people move faster, in the end.",
    6: "You can care and still say no.",
    7: "Your energy is not here to be wasted on noise.",
    8: "Discipline compounds quietly.",
    9: "Letting go is also a form of mastery.",
    11: "Vision without ground burns out.",
    22: "The boring work is the real work.",
    33: "Calm leadership starts inside."
  }
});

const HU = Object.freeze({
  energy: {
    1: "Ma tiszta kezdés és őszinte irány támogat.",
    2: "Ma a türelem, a figyelés és a csendes együttműködés kap teret.",
    3: "Ma az őszinte szónak van súlya — ne játszd meg.",
    4: "Ma a szerkezet és az ismételhető, nyugodt munka a fő téma.",
    5: "Ma alkalmazkodhatsz anélkül, hogy szétesnél.",
    6: "Ma a gondoskodás határokkal párosuljon.",
    7: "Ma az egyszerűsítés és az érzelmi őszinteség segít.",
    8: "Ma ott haladj, ahol már megvan a talaj.",
    9: "Ma lezárni valót zárj le — ne cipelj tovább.",
    11: "Ma a látás legyen szerkezettel alátámasztva.",
    22: "Ma csendben építs valami maradandót.",
    33: "Ma a nyugodt vezetés önmagad elvesztése nélkül."
  },
  watch: {
    1: "Ne keverd össze az új ötletet a kész tervvel.",
    2: "Ne nyomd el az intuíciódat a béke kedvéért.",
    3: "Figyelj: igazság helyett előadás?",
    4: "A merevség nem ugyanaz, mint a fegyelem.",
    5: "A mozgás ne váljon meneküléssé.",
    6: "Túl sok adás kifáraszt — figyelj erre.",
    7: "Ne szórd szét a figyelmed.",
    8: "Ne erővel kényszeríts eredményt.",
    9: "Ne cipelj tovább, ami már kész.",
    11: "Inspiráció lépés nélkül hamar elfárad.",
    22: "Ne hirdesd a munkát, amíg nincs meg.",
    33: "Segíts úgy, hogy ne tűnj el közben."
  },
  action: {
    1: "Egy tiszta első lépés. Csendben.",
    2: "Hallgasd végig az embert, mielőtt válaszolsz.",
    3: "Mondd ki az igazat, amit lágyítottál.",
    4: "Építs egy kis szerkezeti elemet, aztán állj.",
    5: "Mozgasd a tested, aztán dönts nyugodtabban.",
    6: "Tarts egy határt, amit hajlítgattál.",
    7: "Fejezz be egy dolgot, mielőtt újat nyitsz.",
    8: "A következő nyilvánvaló lépés. Fölösleges dráma nélkül.",
    9: "Zárj le egy nyitott hurkot, mielőtt újat hoznál.",
    11: "Egy felismerés → 10 perc tett.",
    22: "Egy óra unalmas alapmunka.",
    33: "Segíts ott, ahol nem veszíted el magad."
  },
  reminder: {
    1: "A kezdésnek türelem kell, nem nyomás.",
    2: "Az erő lehet lágy is.",
    3: "Az őszinte szó mélyebben ül, mint az okos.",
    4: "A szerkezet is gondoskodás, ismételve.",
    5: "Aki ankorolt, végül gyorsabban halad.",
    6: "Gondoskodhatsz és mondhatsz nemet is.",
    7: "Az energiád nem zajra való.",
    8: "A fegyelem csendben kamatozik.",
    9: "Az elengedés is mesterség.",
    11: "Látás talaj nélkül kiég.",
    22: "Az unalmas munka a valódi munka.",
    33: "A nyugodt vezetés belülről indul."
  }
});

const RO = Object.freeze({
  energy: {
    1: "Azi susține începuturi curate și direcție onestă.",
    2: "Azi susține răbdarea, ascultarea și cooperarea liniștită.",
    3: "Azi cuvintele au greutate — fără spectacol.",
    4: "Azi structura și munca repetabilă contează.",
    5: "Azi te poți mișca adaptiv fără să te risipești.",
    6: "Azi grija merge cu limite clare.",
    7: "Azi simplificarea și onestitatea emoțională ajută.",
    8: "Azi execuția acolo unde există deja teren.",
    9: "Azi închide ce e deja închis — nu mai căra.",
    11: "Azi viziunea are nevoie de structură simplă.",
    22: "Azi construiește în liniște ceva durabil.",
    33: "Azi condu calm fără să te pierzi."
  },
  watch: {
    1: "Nu confunda ideea nouă cu planul gata.",
    2: "Nu îți anula intuiția ca să păstrezi pacea.",
    3: "Atenție la spectacol în loc de adevăr.",
    4: "Rigiditatea nu e aceeași cu disciplina.",
    5: "Mișcarea să nu devină evitare.",
    6: "Prea multă dăruire te golește.",
    7: "Nu îți risipi atenția.",
    8: "Nu forța rezultatul cu presiune.",
    9: "Nu căra ce e deja terminat.",
    11: "Inspirație fără pas ancorat — obosește repede.",
    22: "Nu anunța munca care nu e făcută.",
    33: "Ajută fără să te dizolvi."
  },
  action: {
    1: "Un prim pas curat. În liniște.",
    2: "Ascultă până la capăt înainte să răspunzi.",
    3: "Spune adevărul pe care l-ai înmuiat.",
    4: "Construiește o bucată mică de structură, apoi stop.",
    5: "Mișcă corpul, apoi decide mai stabil.",
    6: "Respectă o limită pe care ai îndoit-o.",
    7: "Termină un lucru înainte să deschizi altul.",
    8: "Pasul evident următor. Fără teatru.",
    9: "Închide o buclă deschisă înainte să adaugi altceva.",
    11: "Un insight → 10 minute de acțiune.",
    22: "O oră de muncă plictisitoare de bază.",
    33: "Ajută unde nu te costă esențialul."
  },
  reminder: {
    1: "Începuturile merită răbdare, nu presiune.",
    2: "Puterea poate fi și moale.",
    3: "Cuvintele oneste cântăresc mai mult decât cele istețe.",
    4: "Structura e grijă, repetată.",
    5: "Ancorat, te miști mai repede la final.",
    6: "Poți avea grijă și poți spune nu.",
    7: "Energia ta nu e pentru zgomot.",
    8: "Disciplina se acumulează în liniște.",
    9: "A lăsa merge e tot o formă de stăpânire.",
    11: "Viziunea fără sol se arde.",
    22: "Munca plictisitoare e munca reală.",
    33: "Conducerea calmă începe dinăuntru."
  }
});

const BY_LANG = Object.freeze({ en: EN, hu: HU, ro: RO });

function getEnergyMaps(lang) {
  return BY_LANG[lang] || EN;
}

module.exports = { getEnergyMaps, EN, HU, RO };
