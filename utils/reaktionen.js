// Die Reaktionsbibliothek: Reaktionen, die sich NICHT aus der Stellung
// im Periodensystem herleiten lassen.
//
// utils/ionen.js kann Salzbildung berechnen, weil dort eine Regel gilt.
// Für alles andere gibt es keine Regel: Kohlenstoff und Sauerstoff
// ergeben je nach Sauerstoffangebot CO oder CO₂, Schwefel und Sauerstoff
// SO₂ oder SO₃. Solche Reaktionen müssen deshalb von Hand gepflegt
// werden — und genau das passiert hier.
//
// Aufbau eines Eintrags:
//   id            eindeutiger Schlüssel
//   name          Überschrift
//   edukte        Ausgangsstoffe: [{ formel, koeff }]
//   produkte      Reaktionsprodukte, gleiche Form
//   typ           Schlüssel aus REAKTIONSTYPEN
//   bedingungen   Was es zum Ablaufen braucht (Zündung, Katalysator …)
//   gleichgewicht true, wenn die Reaktion in beide Richtungen läuft
//   enthalpie     Reaktionsenthalpie in kJ FÜR DIE GLEICHUNG WIE
//                 GESCHRIEBEN — also inklusive der Koeffizienten.
//                 Negativ = exotherm. null, wenn kein verlässlicher
//                 Standardwert bekannt ist.
//   text          Erklärung, Array von Absätzen. Erster Absatz in
//                 Alltagssprache (siehe CLAUDE.md).
//   elektronen    optional: was bei der Reaktion mit den Elektronen
//                 passiert
//   alltag        optional: wo einem das begegnet
//   mehr          optional: IDs aus utils/wissen.js
//
// Bewusst NICHT enthalten sind Ionengleichungen (NH₃ + H₂O ⇌ NH₄⁺ + OH⁻).
// Die gehören in den Säure-Base-Screen und würden hier die
// Bilanzprüfung um eine Ladungsrechnung erweitern, ohne dass es dem
// Labor nützt.

import { elementeIn, parseFormel } from './formel';

export const REAKTIONSTYPEN = {
  synthese: { label: 'Synthese', beschreibung: 'Aus mehreren Stoffen wird einer.' },
  verbrennung: { label: 'Verbrennung', beschreibung: 'Reaktion mit Sauerstoff, meist stark exotherm.' },
  zersetzung: { label: 'Zersetzung', beschreibung: 'Aus einem Stoff werden mehrere.' },
  redox: { label: 'Redoxreaktion', beschreibung: 'Elektronen wechseln den Besitzer.' },
  saeureBase: { label: 'Säure-Base-Reaktion', beschreibung: 'Protonen wechseln den Besitzer.' },
  organisch: { label: 'Organische Reaktion', beschreibung: 'Umbau an Kohlenstoffverbindungen.' },
};

export const REAKTIONEN = [
  // -------------------------------------------------------------------
  // Wasserstoff und Sauerstoff
  // -------------------------------------------------------------------
  {
    id: 'knallgas',
    name: 'Knallgasreaktion',
    edukte: [{ formel: 'H2', koeff: 2 }, { formel: 'O2', koeff: 1 }],
    produkte: [{ formel: 'H2O', koeff: 2 }],
    typ: 'redox',
    bedingungen: 'Zündung durch Funke oder Flamme',
    enthalpie: -572,
    text: [
      'Wasserstoff und Sauerstoff verbinden sich zu Wasser. Die Mischung heißt Knallgas, und der Name ist Programm: Die Reaktion läuft mit einem lauten Knall ab, weil sehr viel Energie in sehr kurzer Zeit frei wird.',
      'Bemerkenswert ist, was vorher passiert — nämlich nichts. Ein Gemisch aus Wasserstoff und Sauerstoff kann jahrelang stehen, ohne zu reagieren, obwohl die Reaktion enorm viel Energie liefern würde. Es fehlt der Anstoß: die Aktivierungsenergie. Ein einziger Funke genügt, dann trägt sich die Reaktion selbst.',
      'Das ist ein Muster, das in der ganzen Chemie wiederkehrt. Ob eine Reaktion Energie liefert, und ob sie von allein losgeht, sind zwei völlig verschiedene Fragen.',
    ],
    elektronen:
      'Wasserstoff gibt Elektronen ab und wird oxidiert (Oxidationszahl 0 → +I), Sauerstoff nimmt sie auf und wird reduziert (0 → −II). Beides geschieht gleichzeitig — deshalb Redoxreaktion.',
    alltag:
      'Genau diese Reaktion läuft in einer Brennstoffzelle ab, nur langsam und kontrolliert: Statt zu knallen, liefert sie elektrischen Strom. Und sie treibt Raketen an — die Hauptstufe der Ariane 6 verbrennt flüssigen Wasserstoff mit flüssigem Sauerstoff.',
    mehr: ['aktivierungsenergie', 'exothermEndotherm', 'redoxreaktion'],
  },
  {
    id: 'wasserElektrolyse',
    name: 'Elektrolyse von Wasser',
    edukte: [{ formel: 'H2O', koeff: 2 }],
    produkte: [{ formel: 'H2', koeff: 2 }, { formel: 'O2', koeff: 1 }],
    typ: 'zersetzung',
    bedingungen: 'elektrische Spannung, mindestens 1,23 V',
    enthalpie: 572,
    text: [
      'Die Knallgasreaktion rückwärts: Mit elektrischem Strom lässt sich Wasser wieder in Wasserstoff und Sauerstoff zerlegen.',
      'Weil die Hinreaktion Energie liefert, muss die Rückreaktion genauso viel Energie kosten — die Zahl ist dieselbe, nur mit umgekehrtem Vorzeichen. Das ist kein Zufall, sondern der Energieerhaltungssatz.',
      'An den beiden Elektroden entsteht dabei doppelt so viel Wasserstoff wie Sauerstoff. Das sieht man an den aufsteigenden Bläschen direkt, und es ist der Grund, warum die Formel H₂O heißt und nicht HO.',
    ],
    alltag:
      '"Grüner Wasserstoff" wird genau so hergestellt: Strom aus Wind oder Sonne zerlegt Wasser, der Wasserstoff speichert die Energie und gibt sie später in einer Brennstoffzelle wieder ab.',
    mehr: ['exothermEndotherm'],
  },

  // -------------------------------------------------------------------
  // Kohlenstoff
  // -------------------------------------------------------------------
  {
    id: 'kohlenstoffVollstaendig',
    name: 'Vollständige Verbrennung von Kohlenstoff',
    edukte: [{ formel: 'C', koeff: 1 }, { formel: 'O2', koeff: 1 }],
    produkte: [{ formel: 'CO2', koeff: 1 }],
    typ: 'verbrennung',
    bedingungen: 'Zündung, ausreichend Sauerstoff',
    enthalpie: -394,
    text: [
      'Bei genügend Sauerstoff verbrennt Kohlenstoff vollständig zu Kohlenstoffdioxid. Das passiert in jedem Lagerfeuer, in jedem Kohlekraftwerk und im Grunde bei jeder Verbrennung von Holz, Kohle oder Benzin.',
      'Vollständig heißt: Jedes Kohlenstoffatom bekommt zwei Sauerstoffatome ab. Mehr geht nicht — der Kohlenstoff ist danach maximal oxidiert und liefert keine Energie mehr.',
    ],
    alltag:
      'CO₂ ist geruchlos und ungiftig, aber das wichtigste Treibhausgas. Pro Kilogramm verbranntem Kohlenstoff entstehen rund 3,7 Kilogramm CO₂ — mehr als das Dreifache, weil der Sauerstoff aus der Luft dazukommt.',
    mehr: ['exothermEndotherm', 'redoxreaktion'],
  },
  {
    id: 'kohlenstoffUnvollstaendig',
    name: 'Unvollständige Verbrennung von Kohlenstoff',
    edukte: [{ formel: 'C', koeff: 2 }, { formel: 'O2', koeff: 1 }],
    produkte: [{ formel: 'CO', koeff: 2 }],
    typ: 'verbrennung',
    bedingungen: 'Sauerstoffmangel',
    enthalpie: -221,
    text: [
      'Fehlt es an Sauerstoff, bekommt jedes Kohlenstoffatom nur eines statt zwei ab. Dann entsteht Kohlenstoffmonoxid — dieselben Ausgangsstoffe, ein völlig anderes Produkt.',
      'Das ist der Grund, warum die App bei Kohlenstoff und Sauerstoff nicht einfach eine Antwort ausrechnen kann: Es gibt zwei, und welche entsteht, hängt allein von den Bedingungen ab.',
      'Kohlenstoffmonoxid ist farb- und geruchlos und hochgiftig. Es bindet an das Hämoglobin im Blut, und zwar rund 200-mal fester als Sauerstoff — der Sauerstofftransport bricht zusammen, ohne dass man etwas bemerkt.',
    ],
    alltag:
      'Deshalb sind Gasthermen und Kaminöfen so gefährlich, wenn die Luftzufuhr verstopft ist, und deshalb gibt es CO-Melder. Ein Holzkohlegrill gehört aus demselben Grund niemals in geschlossene Räume.',
    mehr: ['exothermEndotherm'],
  },
  {
    id: 'methanVerbrennung',
    name: 'Verbrennung von Methan',
    edukte: [{ formel: 'CH4', koeff: 1 }, { formel: 'O2', koeff: 2 }],
    produkte: [{ formel: 'CO2', koeff: 1 }, { formel: 'H2O', koeff: 2 }],
    typ: 'verbrennung',
    bedingungen: 'Zündung',
    enthalpie: -890,
    text: [
      'Methan ist der Hauptbestandteil von Erdgas. Bei der Verbrennung entstehen Kohlenstoffdioxid und Wasser — mehr nicht, wenn genug Sauerstoff da ist.',
      'Die Gleichung ist ein gutes Beispiel fürs Ausgleichen: Links steht ein Kohlenstoff und vier Wasserstoff, rechts muss dasselbe herauskommen. Vier Wasserstoff ergeben zwei Wassermoleküle, und zusammen mit dem CO₂ braucht es dafür vier Sauerstoffatome, also zwei O₂.',
    ],
    alltag:
      'Das ist die Reaktion in jeder Gasheizung und auf jedem Gasherd. Erdgas setzt pro Kilowattstunde weniger CO₂ frei als Kohle, weil ein Teil der Energie aus dem Wasserstoff stammt und nicht aus dem Kohlenstoff.',
    mehr: ['exothermEndotherm'],
  },

  // -------------------------------------------------------------------
  // Stickstoff
  // -------------------------------------------------------------------
  {
    id: 'haberBosch',
    name: 'Ammoniaksynthese (Haber-Bosch-Verfahren)',
    edukte: [{ formel: 'N2', koeff: 1 }, { formel: 'H2', koeff: 3 }],
    produkte: [{ formel: 'NH3', koeff: 2 }],
    typ: 'synthese',
    bedingungen: 'Eisen-Katalysator, etwa 450 °C und 200 bar',
    gleichgewicht: true,
    enthalpie: -92,
    text: [
      'Aus Stickstoff und Wasserstoff entsteht Ammoniak — der Ausgangsstoff für fast allen Kunstdünger. Ohne diese Reaktion könnte die Erde ihre Bevölkerung nicht ernähren; Schätzungen zufolge hängt die Nahrung von etwa der Hälfte aller Menschen daran.',
      'Der Haken: Stickstoff ist in der Luft im Überfluss vorhanden, aber extrem reaktionsträge. Die Dreifachbindung im N₂-Molekül ist eine der stabilsten Bindungen überhaupt, und sie aufzubrechen kostet sehr viel Energie.',
      'Die Reaktion ist ein Gleichgewicht und exotherm. Das führt zu einem Zielkonflikt, der im Unterricht immer wieder auftaucht: Kälte würde die Ausbeute erhöhen, macht die Reaktion aber unerträglich langsam. Man wählt deshalb einen Kompromiss — hohe Temperatur für die Geschwindigkeit, hoher Druck und ein Katalysator, um die Ausbeute trotzdem brauchbar zu halten.',
    ],
    alltag:
      'Rund ein Prozent des weltweiten Energieverbrauchs geht in dieses eine Verfahren. Fritz Haber bekam dafür 1918 den Nobelpreis — derselbe Haber, der im Ersten Weltkrieg den Giftgaseinsatz organisierte.',
    mehr: ['katalysator', 'chemischesGleichgewicht', 'exothermEndotherm'],
  },
  {
    id: 'stickoxid',
    name: 'Bildung von Stickstoffmonoxid',
    edukte: [{ formel: 'N2', koeff: 1 }, { formel: 'O2', koeff: 1 }],
    produkte: [{ formel: 'NO', koeff: 2 }],
    typ: 'synthese',
    bedingungen: 'sehr hohe Temperatur, über 1000 °C',
    gleichgewicht: true,
    enthalpie: 181,
    text: [
      'Stickstoff und Sauerstoff sind die beiden Hauptbestandteile der Luft — und sie reagieren normalerweise überhaupt nicht miteinander. Zum Glück, sonst wäre die Atmosphäre nicht stabil.',
      'Erst bei sehr hohen Temperaturen läuft die Reaktion an. Sie ist endotherm: Sie verbraucht Energie, statt welche zu liefern. Deshalb kommt sie nur dort vor, wo es sehr heiß wird — im Motor, in der Gasturbine, im Blitzkanal.',
      'Das ist einer der wenigen endothermen Fälle in dieser Sammlung und zeigt, dass "Reaktion" nicht automatisch "Energie wird frei" heißt.',
    ],
    alltag:
      'Die Stickoxide aus Verbrennungsmotoren stammen nicht aus dem Kraftstoff, sondern aus der Luft selbst — sie entstehen, weil es im Zylinder heiß genug dafür wird. Genau deshalb hilft besserer Kraftstoff nichts und man braucht eine Abgasnachbehandlung.',
    mehr: ['exothermEndotherm', 'chemischesGleichgewicht'],
  },

  // -------------------------------------------------------------------
  // Halogene
  // -------------------------------------------------------------------
  {
    id: 'chlorknallgas',
    name: 'Chlorknallgasreaktion',
    edukte: [{ formel: 'H2', koeff: 1 }, { formel: 'Cl2', koeff: 1 }],
    produkte: [{ formel: 'HCl', koeff: 2 }],
    typ: 'redox',
    bedingungen: 'Licht oder Wärme als Auslöser',
    enthalpie: -185,
    text: [
      'Wasserstoff und Chlor verbinden sich zu Chlorwasserstoff. Das Besondere: Hier genügt Licht als Auslöser — ein Blitzlicht reicht, und das Gemisch explodiert.',
      'Anders als bei der Salzbildung wechseln hier keine Elektronen vollständig den Besitzer. Wasserstoff und Chlor sind beides Nichtmetalle; sie teilen sich das Elektronenpaar. Weil Chlor stärker daran zieht, wird die Bindung aber ungleich verteilt — eine polare Atombindung.',
      'In Wasser gelöst heißt der Stoff Salzsäure. Erst dort gibt der Wasserstoff sein Elektron wirklich ab und liegt als Ion vor.',
    ],
    elektronen:
      'Die Elektronegativitätsdifferenz beträgt 3,16 − 2,20 = 0,96. Das liegt im Bereich der polaren Atombindung: geteilt, aber ungleich.',
    mehr: ['elektronegativitaet', 'halogene', 'aktivierungsenergie'],
  },

  // -------------------------------------------------------------------
  // Schwefel
  // -------------------------------------------------------------------
  {
    id: 'schwefelVerbrennung',
    name: 'Verbrennung von Schwefel',
    edukte: [{ formel: 'S', koeff: 1 }, { formel: 'O2', koeff: 1 }],
    produkte: [{ formel: 'SO2', koeff: 1 }],
    typ: 'verbrennung',
    bedingungen: 'Zündung',
    enthalpie: -297,
    text: [
      'Schwefel verbrennt mit blauer Flamme zu Schwefeldioxid, einem stechend riechenden Gas.',
      'In Wasser gelöst ergibt Schwefeldioxid schweflige Säure. Genau das ist der Mechanismus hinter dem sauren Regen: Schwefelhaltige Kohle verbrennt, das Schwefeldioxid steigt auf, löst sich in Wolkentröpfchen und kommt als Säure wieder herunter.',
    ],
    alltag:
      'Die Rauchgasentschwefelung in Kraftwerken hat dieses Problem in Europa weitgehend gelöst — der saure Regen der 1980er Jahre, der ganze Wälder zerstörte, ist heute kaum noch ein Thema. Ein seltener Fall, in dem Umweltpolitik sichtbar funktioniert hat.',
    mehr: ['exothermEndotherm'],
  },
  {
    id: 'kontaktverfahren',
    name: 'Kontaktverfahren (Schwefeltrioxid)',
    edukte: [{ formel: 'SO2', koeff: 2 }, { formel: 'O2', koeff: 1 }],
    produkte: [{ formel: 'SO3', koeff: 2 }],
    typ: 'synthese',
    bedingungen: 'Vanadiumpentoxid als Katalysator, etwa 450 °C',
    gleichgewicht: true,
    enthalpie: -198,
    text: [
      'Schwefeldioxid nimmt noch ein Sauerstoffatom auf und wird zu Schwefeltrioxid. Das ist der zentrale Schritt bei der Herstellung von Schwefelsäure, der meistproduzierten Chemikalie der Welt.',
      'Ohne Katalysator läuft die Reaktion viel zu langsam. Das Vanadiumpentoxid beschleunigt sie, ohne selbst verbraucht zu werden — es geht am Ende unverändert wieder aus der Reaktion hervor.',
      'Auch hier derselbe Zielkonflikt wie beim Haber-Bosch-Verfahren: exotherm und ein Gleichgewicht, also wäre Kälte gut für die Ausbeute und schlecht für die Geschwindigkeit.',
    ],
    mehr: ['katalysator', 'chemischesGleichgewicht'],
  },

  // -------------------------------------------------------------------
  // Metalle und Wasser, Säuren
  // -------------------------------------------------------------------
  {
    id: 'natriumWasser',
    name: 'Natrium in Wasser',
    edukte: [{ formel: 'Na', koeff: 2 }, { formel: 'H2O', koeff: 2 }],
    produkte: [{ formel: 'NaOH', koeff: 2 }, { formel: 'H2', koeff: 1 }],
    typ: 'redox',
    bedingungen: 'läuft von selbst, sehr heftig',
    enthalpie: -368,
    text: [
      'Ein Stück Natrium auf Wasser zischt umher, schmilzt zu einer Kugel und entzündet sich oft. Es entstehen Natronlauge und Wasserstoff.',
      'Natrium hat genau ein Außenelektron und wird es außerordentlich bereitwillig los. Hier nimmt es das Wasser auf — jedes Wassermolekül gibt dafür ein Wasserstoffatom ab, das sich mit einem zweiten zu H₂ verbindet.',
      'Die Heftigkeit steigt in der Gruppe nach unten: Lithium reagiert noch gemächlich, Kalium entzündet den Wasserstoff sofort, bei Caesium wird es eine Explosion. Der Grund ist derselbe wie bei der Elektronegativität — je weiter außen das Elektron sitzt, desto leichter geht es weg.',
    ],
    alltag:
      'Deshalb wird Natrium unter Petroleum aufbewahrt: Schon die Luftfeuchtigkeit würde reichen. Und deshalb darf man einen Metallbrand niemals mit Wasser löschen.',
    mehr: ['hauptgruppe', 'redoxreaktion', 'elektronegativitaet'],
  },
  {
    id: 'zinkSalzsaeure',
    name: 'Zink in Salzsäure',
    edukte: [{ formel: 'Zn', koeff: 1 }, { formel: 'HCl', koeff: 2 }],
    produkte: [{ formel: 'ZnCl2', koeff: 1 }, { formel: 'H2', koeff: 1 }],
    typ: 'redox',
    bedingungen: 'läuft von selbst',
    enthalpie: -153,
    text: [
      'Gibt man Zink in Salzsäure, perlt Wasserstoff auf. Das ist die Standardmethode, um im Labor schnell Wasserstoff zu erzeugen.',
      'Das Zink gibt zwei Elektronen ab und geht als Zn²⁺ in Lösung. Die Elektronen nehmen die Wasserstoff-Ionen der Säure auf und werden zu Wasserstoffgas.',
      'Nicht jedes Metall kann das. Kupfer zum Beispiel reagiert nicht mit Salzsäure — es gibt seine Elektronen nicht so bereitwillig her. Welche Metalle es tun, verrät die elektrochemische Spannungsreihe.',
    ],
    mehr: ['redoxreaktion', 'metalleNichtmetalle'],
  },
  {
    id: 'thermit',
    name: 'Thermitreaktion',
    edukte: [{ formel: 'Al', koeff: 2 }, { formel: 'Fe2O3', koeff: 1 }],
    produkte: [{ formel: 'Al2O3', koeff: 1 }, { formel: 'Fe', koeff: 2 }],
    typ: 'redox',
    bedingungen: 'Zündung mit Magnesiumband, sehr hohe Aktivierungsenergie',
    enthalpie: -852,
    text: [
      'Aluminium reißt dem Eisenoxid den Sauerstoff weg. Dabei wird so viel Energie frei, dass das entstehende Eisen flüssig ist — die Reaktion erreicht über 2000 °C.',
      'Warum gewinnt das Aluminium? Weil es den Sauerstoff stärker bindet als das Eisen. Man kann das als Wettbewerb lesen: Von zwei Metallen bekommt das unedlere den Sauerstoff.',
      'Zum Starten braucht es trotzdem sehr viel Energie — ein brennendes Magnesiumband. Wieder derselbe Punkt wie beim Knallgas: Eine Reaktion, die enorm viel Energie liefert, kann trotzdem beliebig lange nicht von selbst losgehen.',
    ],
    alltag:
      'So werden Eisenbahnschienen an Ort und Stelle verschweißt: Eine Form um die Stoßstelle, Thermit hinein, zünden — das flüssige Eisen läuft in den Spalt.',
    mehr: ['aktivierungsenergie', 'redoxreaktion', 'nebengruppenIonen'],
  },

  // -------------------------------------------------------------------
  // Kalk
  // -------------------------------------------------------------------
  {
    id: 'kalkbrennen',
    name: 'Kalkbrennen',
    edukte: [{ formel: 'CaCO3', koeff: 1 }],
    produkte: [{ formel: 'CaO', koeff: 1 }, { formel: 'CO2', koeff: 1 }],
    typ: 'zersetzung',
    bedingungen: 'etwa 900 °C, dauerhaft zugeführte Wärme',
    enthalpie: 178,
    text: [
      'Erhitzt man Kalkstein stark genug, zerfällt er in gebrannten Kalk und Kohlenstoffdioxid. Das ist eine der ältesten chemischen Reaktionen, die Menschen technisch nutzen — seit Jahrtausenden.',
      'Die Reaktion ist endotherm: Sie läuft nur, solange man Energie zuführt. Nimmt man die Wärme weg, hört sie auf.',
    ],
    alltag:
      'Das ist der erste Schritt jeder Zementherstellung — und ein handfestes Klimaproblem. Das CO₂ entsteht hier nicht durch das Verbrennen von Brennstoff, sondern aus dem Kalkstein selbst. Man kann es also nicht durch erneuerbare Energie vermeiden. Die Zementindustrie verursacht dadurch rund 8 % der weltweiten CO₂-Emissionen.',
    mehr: ['exothermEndotherm'],
  },
  {
    id: 'kalkloeschen',
    name: 'Kalklöschen',
    edukte: [{ formel: 'CaO', koeff: 1 }, { formel: 'H2O', koeff: 1 }],
    produkte: [{ formel: 'Ca(OH)2', koeff: 1 }],
    typ: 'synthese',
    bedingungen: 'läuft von selbst, stark exotherm',
    enthalpie: -65,
    text: [
      'Gibt man Wasser auf gebrannten Kalk, reagiert er heftig zu gelöschtem Kalk. Es zischt, dampft und wird so heiß, dass das Wasser kocht.',
      'Der Name "löschen" hat nichts mit Feuerlöschen zu tun — im Gegenteil, hier entsteht Hitze. Gemeint ist, dass der aggressive gebrannte Kalk dadurch entschärft wird.',
    ],
    alltag:
      'Gelöschter Kalk ist der klassische Mörtel. Er härtet aus, indem er wieder CO₂ aus der Luft aufnimmt und zu Kalkstein wird — der Kreis schließt sich, und das Mauerwerk hält Jahrhunderte.',
    mehr: ['exothermEndotherm'],
  },
  {
    id: 'kalkwasserprobe',
    name: 'Kalkwasserprobe (Nachweis von CO₂)',
    edukte: [{ formel: 'Ca(OH)2', koeff: 1 }, { formel: 'CO2', koeff: 1 }],
    produkte: [{ formel: 'CaCO3', koeff: 1 }, { formel: 'H2O', koeff: 1 }],
    typ: 'saeureBase',
    bedingungen: 'läuft von selbst',
    enthalpie: -113,
    text: [
      'Leitet man Kohlenstoffdioxid in klares Kalkwasser, trübt es sich milchig. Das ist der Standardnachweis für CO₂ und funktioniert schon mit der eigenen Atemluft.',
      'Die Trübung besteht aus feinen Kalksteinkristallen, die aus der Lösung ausfallen. Leitet man weiter CO₂ ein, klärt sich die Lösung übrigens wieder auf — dann entsteht lösliches Calciumhydrogencarbonat.',
    ],
    alltag:
      'Genau dieses Wechselspiel formt Tropfsteinhöhlen: CO₂-haltiges Wasser löst Kalk aus dem Gestein, an der Decke entweicht das CO₂ wieder, und der Kalk fällt Tropfen für Tropfen aus.',
    mehr: ['phWert'],
  },

  // -------------------------------------------------------------------
  // Eisen
  // -------------------------------------------------------------------
  {
    id: 'hochofen',
    name: 'Eisengewinnung im Hochofen',
    edukte: [{ formel: 'Fe2O3', koeff: 1 }, { formel: 'CO', koeff: 3 }],
    produkte: [{ formel: 'Fe', koeff: 2 }, { formel: 'CO2', koeff: 3 }],
    typ: 'redox',
    bedingungen: 'etwa 1200 °C im Hochofen',
    enthalpie: -25,
    text: [
      'Eisen kommt in der Natur nicht als Metall vor, sondern als Erz — chemisch gebunden an Sauerstoff. Um Eisen zu gewinnen, muss man ihm diesen Sauerstoff wegnehmen.',
      'Das übernimmt Kohlenstoffmonoxid: Es ist "sauerstoffhungriger" als Eisen und wird dabei selbst zu CO₂. Man sagt, das Eisenoxid wird reduziert und das CO oxidiert.',
      'Das CO entsteht im Hochofen selbst, aus Koks und der eingeblasenen heißen Luft. Deshalb braucht ein Hochofen so gewaltige Mengen Kohle — nicht nur als Brennstoff, sondern als Reaktionspartner.',
    ],
    alltag:
      'Die Stahlindustrie verursacht rund 7 % der weltweiten CO₂-Emissionen, vor allem wegen dieser Reaktion. Die "grüne" Alternative ersetzt das CO durch Wasserstoff — dann entsteht Wasser statt Kohlenstoffdioxid.',
    mehr: ['redoxreaktion', 'nebengruppenIonen'],
  },

  // -------------------------------------------------------------------
  // Biologie und Organik
  // -------------------------------------------------------------------
  {
    id: 'photosynthese',
    name: 'Photosynthese',
    edukte: [{ formel: 'CO2', koeff: 6 }, { formel: 'H2O', koeff: 6 }],
    produkte: [{ formel: 'C6H12O6', koeff: 1 }, { formel: 'O2', koeff: 6 }],
    typ: 'redox',
    bedingungen: 'Licht, Chlorophyll',
    enthalpie: 2803,
    text: [
      'Pflanzen bauen aus Kohlenstoffdioxid und Wasser Traubenzucker auf und geben Sauerstoff ab. Das ist die wichtigste chemische Reaktion auf diesem Planeten: Praktisch die gesamte Nahrung und praktisch der gesamte Sauerstoff der Atmosphäre stammen daraus.',
      'Die Reaktion ist stark endotherm — sie braucht sehr viel Energie, und die kommt vom Sonnenlicht. Eine Pflanze ist damit im Kern ein Gerät, das Lichtenergie in chemische Energie umwandelt und speichert.',
      'Die Summengleichung verschweigt allerdings viel: In Wirklichkeit ist das ein Dutzend Einzelschritte in zwei getrennten Abschnitten. Sie stimmt in der Bilanz, nicht im Ablauf.',
    ],
    alltag:
      'Kohle, Erdöl und Erdgas sind gespeicherte Photosynthese aus Jahrmillionen. Wenn wir sie verbrennen, geben wir in wenigen Jahrhunderten das CO₂ zurück, das über sehr lange Zeit gebunden wurde.',
    mehr: ['exothermEndotherm', 'redoxreaktion'],
  },
  {
    id: 'zellatmung',
    name: 'Zellatmung',
    edukte: [{ formel: 'C6H12O6', koeff: 1 }, { formel: 'O2', koeff: 6 }],
    produkte: [{ formel: 'CO2', koeff: 6 }, { formel: 'H2O', koeff: 6 }],
    typ: 'redox',
    bedingungen: 'Enzyme, läuft in jeder Körperzelle',
    enthalpie: -2803,
    text: [
      'Die Photosynthese rückwärts: Traubenzucker wird mit Sauerstoff zu Kohlenstoffdioxid und Wasser abgebaut, und die gespeicherte Energie wird wieder frei. Das passiert gerade in jeder deiner Zellen.',
      'Chemisch ist das eine Verbrennung — dieselbe Bilanz und dieselbe Energiemenge wie beim Verbrennen von Zucker in einer Flamme. Der Unterschied liegt nur im Ablauf: Der Körper zerlegt sie in viele winzige Schritte, damit die Energie nutzbar wird, statt als Hitzestoß zu verpuffen.',
      'Genau dafür sind Enzyme da. Sie senken die Aktivierungsenergie so weit, dass die Reaktion bei 37 °C abläuft statt bei mehreren hundert Grad.',
    ],
    alltag:
      'Die 2803 kJ pro Mol Traubenzucker sind rund 670 Kilokalorien — die Größenordnung, die auf Lebensmittelverpackungen steht.',
    mehr: ['katalysator', 'exothermEndotherm'],
  },
  {
    id: 'alkoholischeGaerung',
    name: 'Alkoholische Gärung',
    edukte: [{ formel: 'C6H12O6', koeff: 1 }],
    produkte: [{ formel: 'C2H5OH', koeff: 2 }, { formel: 'CO2', koeff: 2 }],
    typ: 'organisch',
    bedingungen: 'Hefe, ohne Sauerstoff',
    enthalpie: -218,
    text: [
      'Ohne Sauerstoff bauen Hefezellen Zucker nicht vollständig ab, sondern nur bis zum Ethanol. Aus einem Molekül Traubenzucker werden zwei Moleküle Alkohol und zwei Moleküle Kohlenstoffdioxid.',
      'Der Energiegewinn ist dabei winzig im Vergleich zur Zellatmung — gut 200 statt 2800 kJ. Der Rest steckt noch im Alkohol, weshalb der ja auch brennbar ist. Für die Hefe ist es trotzdem ein gutes Geschäft: Sie kann Energie gewinnen, wo andere ersticken.',
    ],
    alltag:
      'Bier, Wein und Sauerteig beruhen darauf. Beim Brot ist es das CO₂, das den Teig aufgehen lässt — der Alkohol verdampft beim Backen.',
    mehr: ['exothermEndotherm'],
  },
  {
    id: 'veresterung',
    name: 'Veresterung',
    edukte: [{ formel: 'CH3COOH', koeff: 1 }, { formel: 'C2H5OH', koeff: 1 }],
    produkte: [{ formel: 'CH3COOC2H5', koeff: 1 }, { formel: 'H2O', koeff: 1 }],
    typ: 'organisch',
    bedingungen: 'konzentrierte Schwefelsäure als Katalysator, Erwärmen',
    gleichgewicht: true,
    enthalpie: null,
    text: [
      'Eine Carbonsäure und ein Alkohol verbinden sich zu einem Ester, dabei wird Wasser abgespalten. Hier sind es Essigsäure und Ethanol, es entsteht Essigsäureethylester.',
      'Die Reaktion ist ein Gleichgewicht und läuft nie vollständig ab. Man kann sie aber in die gewünschte Richtung schieben, indem man das entstehende Wasser laufend entfernt — dann muss immer weiter Ester nachgebildet werden.',
      'Ester riechen fast immer fruchtig. Welche Frucht, hängt davon ab, welche Säure und welchen Alkohol man kombiniert.',
    ],
    alltag:
      'Die meisten künstlichen Fruchtaromen sind Ester. Und Fette sind Ester aus Glycerin und langkettigen Fettsäuren — dieselbe Bindung, nur größer.',
    mehr: ['chemischesGleichgewicht', 'katalysator'],
  },

  // -------------------------------------------------------------------
  // Katalyse
  // -------------------------------------------------------------------
  {
    id: 'wasserstoffperoxid',
    name: 'Zerfall von Wasserstoffperoxid',
    edukte: [{ formel: 'H2O2', koeff: 2 }],
    produkte: [{ formel: 'H2O', koeff: 2 }, { formel: 'O2', koeff: 1 }],
    typ: 'zersetzung',
    bedingungen: 'läuft langsam von selbst, mit Katalysator schlagartig',
    enthalpie: -196,
    text: [
      'Wasserstoffperoxid zerfällt in Wasser und Sauerstoff. Von selbst passiert das so langsam, dass man eine Flasche davon jahrelang im Schrank haben kann.',
      'Gibt man aber Braunstein oder etwas Blut hinzu, schäumt es sofort auf. Der Katalysator wird dabei nicht verbraucht — man kann dieselbe Prise für die nächste Portion wiederverwenden.',
      'Das macht diese Reaktion zum Schulversuch schlechthin für Katalyse: Man sieht unmittelbar, dass ein Stoff die Geschwindigkeit dramatisch ändert, ohne selbst an der Bilanz teilzunehmen.',
    ],
    alltag:
      'Das Enzym Katalase in unseren Zellen tut genau das. Deshalb schäumt Wasserstoffperoxid auf einer Wunde — es trifft dort auf Blut.',
    mehr: ['katalysator', 'aktivierungsenergie'],
  },
];

// ---------------------------------------------------------------------
// Zugriff
// ---------------------------------------------------------------------

// Formatiert eine Seite der Gleichung: "2 H₂ + O₂"
function seite(stoffe, formatiere) {
  return stoffe
    .map(({ formel, koeff }) => (koeff === 1 ? '' : `${koeff} `) + formatiere(formel))
    .join(' + ');
}

// Die vollständige Reaktionsgleichung als Text.
export function gleichungText(reaktion, formatiere) {
  const pfeil = reaktion.gleichgewicht ? '⇌' : '→';
  return `${seite(reaktion.edukte, formatiere)} ${pfeil} ${seite(reaktion.produkte, formatiere)}`;
}

// Alle Elemente, die in den Ausgangsstoffen vorkommen.
export function eduktElemente(reaktion) {
  const menge = new Set();
  for (const { formel } of reaktion.edukte) {
    for (const sym of elementeIn(formel)) {
      menge.add(sym);
    }
  }
  return menge;
}

// Findet Reaktionen, deren Ausgangsstoffe GENAU aus den gewählten
// Elementen bestehen.
//
// "Genau" ist wichtig: Natrium und Wasser ergeben zwar eine schöne
// Reaktion, aber ihre Edukte enthalten drei Elemente (Na, H, O). Wer im
// Labor Natrium und Sauerstoff antippt, hat sie nicht gemeint und soll
// sie auch nicht angeboten bekommen.
export function findeReaktionen(symbole) {
  const gesucht = new Set(symbole);
  const treffer = REAKTIONEN.filter((r) => {
    const vorhanden = eduktElemente(r);
    return (
      vorhanden.size === gesucht.size &&
      [...gesucht].every((sym) => vorhanden.has(sym))
    );
  });

  // Direkte Antwort zuerst. Wer Wasserstoff und Sauerstoff antippt,
  // will als Erstes die Knallgasreaktion sehen — die Elektrolyse von
  // Wasser besteht zwar aus denselben Elementen, beantwortet aber eine
  // andere Frage.
  return treffer.sort(
    (a, b) => Number(istElementarreaktion(b)) - Number(istElementarreaktion(a))
  );
}

// Bestehen die Ausgangsstoffe aus reinen Elementen (H₂, O₂, Fe), oder
// aus Verbindungen (H₂O, Fe₂O₃)? Nur im ersten Fall ist die Reaktion
// die unmittelbare Antwort auf "was wird aus diesen beiden Elementen".
export function istElementarreaktion(reaktion) {
  return reaktion.edukte.every(
    ({ formel }) => Object.keys(parseFormel(formel)).length === 1
  );
}

export function reaktionNachId(id) {
  return REAKTIONEN.find((r) => r.id === id) || null;
}

// Prüft, ob eine Gleichung ausgeglichen ist. Wird vom Prüfskript für
// alle Einträge aufgerufen — und ist der Grund, warum man dieser
// Sammlung trauen kann.
export function bilanz(reaktion) {
  const zaehle = (stoffe) => {
    const summe = {};
    for (const { formel, koeff } of stoffe) {
      for (const [sym, anzahl] of Object.entries(parseFormel(formel))) {
        summe[sym] = (summe[sym] || 0) + anzahl * koeff;
      }
    }
    return summe;
  };
  return { links: zaehle(reaktion.edukte), rechts: zaehle(reaktion.produkte) };
}
