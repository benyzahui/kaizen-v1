/** Szimbolikus napi energia légkör (HU) — nem jóslat. */

module.exports = {
  energyAtmosphere: {
    atmosphere: {
      default: [
        "Ma a stabil végrehajtást részesíti előnyben a spike helyett.",
        "A mező semleges — a szerkezeted adja a hangot.",
        "A tempó fontosabb ma, mint a nyomás.",
        "A nyugodtabb ritmus többet visz, mint az erő.",
        "Ma karbantartási nap, nem indulási nap.",
        "Az intenzitás opcionális; a konzisztencia nem.",
        "A nap egy tiszta sávval nyílik.",
        "Légkör: földölt, nem drámai.",
        "Szimbolikus olvasat: egyensúly a robbanás helyett.",
        "Ma az első fél nap türelmet jutalmaz."
      ],
      low: [
        "Ma a lassabb végrehajtást részesíti előnyben az intenzitás helyett.",
        "A mező takarékosságot jelez, nem terjeszkedést.",
        "Lágyabb tempó védi az idegrendszert.",
        "Az energia vékony — szándékosan költsd.",
        "Szimbolikus légkör: felépülés push előtt."
      ],
      warrior: [
        "Ma az éles végrehajtást részesíti előnyben a komfort helyett.",
        "A mező a fegyelmet támogatja, nem a vitát.",
        "Az intenzitás elérhető — egy célra irányítsd.",
        "Szimbolikus légkör: él zaj nélkül.",
        "Egy fókuszált push jobb, mint szétszórt nap."
      ],
      overloaded: [
        "Ma a csökkentést részesíti előnyben a hozzáadás helyett.",
        "A mező zajos — szűkítsd az inputot.",
        "Szimbolikus légkör: nyugalom skála előtt.",
        "A túlstimuláció a fő kockázat ma.",
        "Védd az idegrendszert először."
      ]
    },
    nervous: {
      default: [
        "Az idegrendszer reagálhat a fragmentációra.",
        "Figyeld a stimuláció halmozódását — tab, értesítés, koffein.",
        "A test jelez, mielőtt az elme beismeri a túlterhelést.",
        "Légzés reguláció a terv regulációja előtt.",
        "Szimbolikus tendencia: érzékenység a sietségre."
      ],
      low: [
        "Az idegrendszer kimerültnek érezheti magát — tiszteld a pihenést.",
        "A fáradtság álcázhatja a fegyelem hiányát.",
        "Finom reguláció jobb, mint kényszerített push.",
        "Szimbolikus tendencia: alacsony tartalék — védd az alvást."
      ],
      warrior: [
        "Az idegrendszer bírja a terhelést, ha a scope szűk marad.",
        "Az intenzitást a testen át, ne a feeden át.",
        "Szimbolikus tendencia: kész, ha nem szétszórsz."
      ],
      overloaded: [
        "Az idegrendszer erősen reagálhat a túlstimulációra.",
        "Szimbolikus tendencia: túlterhelés — vágd az inputot korán.",
        "Hosszú kilélegzés új ígéret előtt.",
        "A csend ma is üzemanyag."
      ]
    },
    focus: {
      default: [
        "Védd a figyelmet a fragmentációtól.",
        "Egy elsődleges sáv jobb, mint három félig kész.",
        "Fókusz irány: zárd le, ami már nyitva van.",
        "Szimbolikus útmutatás: egy látható cél.",
        "Mélység egy feladaton — jobb, mint mozgás ötön."
      ],
      low: [
        "Védd a figyelmet — a scope illeszkedjen az üzemanyaghoz.",
        "Egy kis finish elég szimbolikus győzelem.",
        "Fókusz irány: a legkisebb őszinte cselekvés."
      ],
      warrior: [
        "Védd a figyelmet, mint fegyvert — egy él.",
        "Fókusz irány: elsődleges misszió, nincs melléksáv.",
        "Szimbolikus útmutatás: végrehajtás, ne böngészés."
      ],
      overloaded: [
        "Védd a figyelmet input csökkentéssel, nem akaraterő halmozással.",
        "Fókusz irány: stabilizálj, aztán egy munkasor.",
        "Szimbolikus útmutatás: nyugtasd a mezőt, aztán cselekedj."
      ]
    },
    discipline: {
      default: [
        "Fegyelmi figyelmeztetés: dél után ne alkudozz ok nélkül.",
        "Ne nyiss új kört, mielőtt egyet zársz.",
        "Szimbolikus óvás: a hangulat nem terv.",
        "Egy tiszta cselekvés elég bizonyíték.",
        "Figyeld a sodródást, ami kutatásnak álcázza magát."
      ],
      low: [
        "Fegyelmi figyelmeztetés: ne szégyeníts alacsony energiát — csökkentsd a scope-ot.",
        "Egy ígéret legyen kicsi és látható.",
        "Szimbolikus óvás: a hősködés megvonja a felépülést."
      ],
      warrior: [
        "Fegyelmi figyelmeztetés: a komfort hív — egyszer figyelmen kívül.",
        "Nincs új cél, amíg az elsődleges sor mozog.",
        "Szimbolikus óvás: intenzitás finish nélkül zaj."
      ],
      drifting: [
        "Fegyelmi figyelmeztetés: a sodródás a fő kockázat ma.",
        "Vissza egy nyitott körhöz új ötlet előtt.",
        "Szimbolikus óvás: a tervezés helyettesítheti a cselekvést."
      ]
    },
    recovery: {
      default: [
        "Felépülési emlékeztető: lefelé alvás előtt védi a holnapot.",
        "Üzemanyag és csend ma is szerkezet.",
        "Szimbolikus zárás: a pihenés nem jutalom — karbantartás.",
        "Védd az estét egy újabb sprinttől.",
        "A test emlékszik a nyomásra — engedj el ma éjjel."
      ],
      low: [
        "Felépülési emlékeztető: a pihenés ma délután is munka.",
        "Alvás és étel nem alkudozható szerkezet.",
        "Szimbolikus zárás: felépülés, mielőtt a holnap push-t kér."
      ],
      warrior: [
        "Felépülési emlékeztető: az él is csendes zárást kér.",
        "Időben állj meg — holnapi edzés ma éjjel indul.",
        "Szimbolikus zárás: a fegyelem tartalmazza a stopot."
      ]
    }
  }
};
