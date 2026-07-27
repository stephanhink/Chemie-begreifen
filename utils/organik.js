// Organische Chemie: Stoffklassen, homologe Reihen und Nomenklatur.
//
// Auch hier gilt die Trennung, die sich durch die ganze App zieht.
// HERGELEITET wird alles, was einer Regel folgt: Aus der Zahl der
// Kohlenstoffatome und der Stoffklasse ergeben sich Name, Summenformel,
// Halbstrukturformel und molare Masse zwingend.
// NACHGESCHLAGEN werden Siedepunkte, Trivialnamen und die Zahl der
// Isomere — die sind gemessen bzw. abgezählt, nicht ableitbar.

import { molareMasse } from './stoechiometrie.js';

// Die Wortstämme der Nomenklatur. Die ersten vier sind historisch
// gewachsen und muss man lernen, ab fünf zählt griechisch weiter —
// Pentan, Hexan, Heptan wie Pentagon, Hexagon, Heptagon.
export const STAMMNAMEN = [
  'Meth', 'Eth', 'Prop', 'But', 'Pent',
  'Hex', 'Hept', 'Oct', 'Non', 'Dec',
  'Undec', 'Dodec',
];

// ---------------------------------------------------------------------
// Die Stoffklassen
// ---------------------------------------------------------------------
//
//   endung        Was an den Wortstamm angehängt wird
//   gruppe        Die funktionelle Gruppe in Kurzschrift
//   minC          Ab wie vielen C-Atomen es die Klasse gibt
//   formel(n)     Summenformel in der Schreibweise des Parsers
//   struktur      Wie die Skelettformel gezeichnet wird (siehe unten)
//   wirkung       Was die Gruppe mit den Eigenschaften macht — der
//                 eigentliche Sinn der ganzen Einteilung

// In einer Summenformel schreibt man den Index 1 nicht: CH₄, nicht C₁H₄.
const idx = (n) => (n === 1 ? '' : String(n));

export const STOFFKLASSEN = [
  {
    key: 'alkan',
    name: 'Alkane',
    endung: '-an',
    gruppe: 'keine',
    minC: 1,
    formel: (n) => `C${idx(n)}H${idx(2 * n + 2)}`,
    struktur: {},
    wirkung:
      'Ohne funktionelle Gruppe. Alkane sind unpolar, deshalb wasserabweisend und untereinander nur durch schwache Van-der-Waals-Kräfte verbunden. Sie lösen sich in Fett, nicht in Wasser.',
    beispiel: 'Erdgas, Benzin, Kerzenwachs — alles Alkane verschiedener Kettenlänge.',
  },
  {
    key: 'alken',
    name: 'Alkene',
    endung: '-en',
    gruppe: 'C=C',
    minC: 2,
    formel: (n) => `C${idx(n)}H${idx(2 * n)}`,
    struktur: { bindung: 'doppel' },
    wirkung:
      'Die Doppelbindung ist eine Sollbruchstelle: Sie lässt sich aufbrechen, ohne dass etwas abgespalten werden muss. Deshalb sind Alkene der Ausgangsstoff für Additionsreaktionen und für Kunststoffe.',
    beispiel: 'Ethen ist der meistproduzierte organische Stoff der Welt — daraus wird Polyethylen.',
  },
  {
    key: 'alkin',
    name: 'Alkine',
    endung: '-in',
    gruppe: 'C≡C',
    minC: 2,
    formel: (n) => `C${idx(n)}H${idx(2 * n - 2)}`,
    struktur: { bindung: 'dreifach' },
    wirkung:
      'Noch reaktionsfreudiger als Alkene. Die Dreifachbindung steckt viel Energie in wenig Raum — deshalb wird Ethin zum Schweißen verwendet.',
    beispiel: 'Ethin (Acetylen) brennt mit Sauerstoff bei über 3000 °C.',
  },
  {
    key: 'halogenalkan',
    name: 'Halogenalkane',
    endung: 'Chlor… (Vorsilbe)',
    gruppe: '–Cl',
    minC: 1,
    formel: (n) => `C${idx(n)}H${idx(2 * n + 1)}Cl`,
    struktur: { endgruppe: 'Cl' },
    wirkung:
      'Das Halogen ist elektronegativer als Kohlenstoff und macht die Bindung polar. Genau dort greifen Nucleophile an — Halogenalkane sind die klassischen Ausgangsstoffe für Substitutionsreaktionen.',
    beispiel: 'Früher als Kältemittel und Treibgas verwendet (FCKW), bis sie die Ozonschicht zerstörten.',
  },
  {
    key: 'alkohol',
    name: 'Alkohole',
    endung: '-ol',
    gruppe: '–OH',
    minC: 1,
    formel: (n) => `C${idx(n)}H${idx(2 * n + 2)}O`,
    struktur: { endgruppe: 'OH' },
    wirkung:
      'Die OH-Gruppe kann Wasserstoffbrücken bilden — zu sich selbst und zu Wasser. Deshalb sieden Alkohole viel höher als Alkane gleicher Größe und lösen sich in Wasser. Mit wachsender Kette überwiegt aber der unpolare Rest, und die Löslichkeit bricht ein.',
    beispiel: 'Ethanol siedet bei 78 °C, das gleich schwere Propan bei −42 °C. Der Unterschied sind allein die Wasserstoffbrücken.',
  },
  {
    key: 'aldehyd',
    name: 'Aldehyde',
    endung: '-al',
    gruppe: '–CHO',
    minC: 1,
    formel: (n) => `C${idx(n)}H${idx(2 * n)}O`,
    struktur: { doppelO: 'ende' },
    wirkung:
      'Die Carbonylgruppe am Kettenende. Aldehyde lassen sich leicht weiter zur Carbonsäure oxidieren — darauf beruht ihr Nachweis mit der Fehling- oder Tollens-Probe.',
    beispiel: 'Der Geruch von Zimt, Vanille und frischem Gras stammt von Aldehyden.',
  },
  {
    key: 'keton',
    name: 'Ketone',
    endung: '-on',
    gruppe: '>C=O',
    minC: 3,
    formel: (n) => `C${idx(n)}H${idx(2 * n)}O`,
    struktur: { doppelO: 'mitte' },
    wirkung:
      'Dieselbe Carbonylgruppe wie beim Aldehyd, aber mitten in der Kette. Deshalb lässt sie sich NICHT weiter oxidieren — es fehlt das Wasserstoffatom dafür. Genau daran unterscheidet die Fehling-Probe die beiden.',
    beispiel: 'Propanon (Aceton) ist das gängigste Lösungsmittel für Lacke und Nagellackentferner.',
  },
  {
    key: 'carbonsaeure',
    name: 'Carbonsäuren',
    endung: '-säure',
    gruppe: '–COOH',
    minC: 1,
    formel: (n) => `C${idx(n)}H${idx(2 * n)}O2`,
    struktur: { doppelO: 'ende', endgruppe: 'OH' },
    wirkung:
      'Carbonyl und Hydroxyl am selben Kohlenstoff — zusammen ergibt das etwas Neues. Das Wasserstoffatom der OH-Gruppe lässt sich als Proton abgeben, weil das zurückbleibende Ion durch Mesomerie stabilisiert wird. Deshalb reagieren diese Stoffe sauer, einzelne OH-Gruppen aber nicht.',
    beispiel: 'Essig, Zitronensäure, Ameisensäure — und die Fettsäuren, aus denen alle Fette bestehen.',
  },
  {
    key: 'amin',
    name: 'Amine',
    endung: '-amin',
    gruppe: '–NH₂',
    minC: 1,
    formel: (n) => `C${idx(n)}H${idx(2 * n + 3)}N`,
    struktur: { endgruppe: 'NH2' },
    wirkung:
      'Das freie Elektronenpaar am Stickstoff kann ein Proton aufnehmen. Amine reagieren deshalb basisch — sie sind gewissermaßen das Gegenstück zu den Carbonsäuren.',
    beispiel: 'Aminosäuren tragen beide Gruppen zugleich: eine Carboxyl- und eine Aminogruppe. Daraus baut sich jedes Eiweiß auf.',
  },
];

// ---------------------------------------------------------------------
// Nachgeschlagenes
// ---------------------------------------------------------------------

// Siedepunkte der unverzweigten Alkane in °C. Gemessene Werte, keine
// Rechnung — aber der Trend ist der Punkt: Je länger die Kette, desto
// größer die Berührungsfläche zwischen den Molekülen und desto stärker
// die Van-der-Waals-Kräfte.
export const ALKAN_SIEDEPUNKTE = [
  -162, -89, -42, -0.5, 36, 69, 98, 126, 151, 174,
];

// Zahl der Konstitutionsisomere unverzweigter und verzweigter Alkane.
// Diese Zahlen sind abgezählt, nicht berechnet — es gibt keine einfache
// Formel dafür. Genau das ist die Aussage: Die Vielfalt der organischen
// Chemie entsteht nicht aus vielen Elementen, sondern aus den vielen
// Arten, wenige Elemente anzuordnen.
export const ALKAN_ISOMERE = [1, 1, 1, 2, 3, 5, 9, 18, 35, 75, 159, 355];

// Trivialnamen, die im Alltag und im Unterricht vorkommen.
const TRIVIALNAMEN = {
  'Methansäure': 'Ameisensäure',
  'Ethansäure': 'Essigsäure',
  'Propanon': 'Aceton',
  'Methanal': 'Formaldehyd',
  'Ethanal': 'Acetaldehyd',
  'Ethin': 'Acetylen',
  'Methanol': 'Holzgeist',
};

// ---------------------------------------------------------------------
// Hergeleitetes
// ---------------------------------------------------------------------

// Alles, was sich aus Stoffklasse und Kettenlänge ergibt.
//
//   verbindung('alkohol', 2)
//     → { name: 'Ethanol', summenformel: 'C2H6O', halbstruktur: 'CH₃–CH₂–OH', … }
export function verbindung(klasseKey, n) {
  const klasse = STOFFKLASSEN.find((k) => k.key === klasseKey);
  if (!klasse) {
    return { fehler: `Unbekannte Stoffklasse "${klasseKey}"` };
  }
  if (n < klasse.minC) {
    return {
      fehler:
        klasse.key === 'keton'
          ? 'Ein Keton braucht mindestens drei Kohlenstoffatome — die Carbonylgruppe muss ja mitten in der Kette sitzen, mit einem C-Atom auf jeder Seite.'
          : `${klasse.name} gibt es erst ab ${klasse.minC} Kohlenstoffatomen.`,
    };
  }
  if (n > STAMMNAMEN.length) {
    return { fehler: `Diese App kennt Stammnamen bis ${STAMMNAMEN.length} Kohlenstoffatome.` };
  }

  const stamm = STAMMNAMEN[n - 1];
  const summenformel = klasse.formel(n);

  return {
    klasse,
    kettenlaenge: n,
    name: baueNamen(klasse, stamm, n),
    trivialname: TRIVIALNAMEN[baueNamen(klasse, stamm, n)] || null,
    summenformel,
    molareMasse: molareMasse(summenformel),
    halbstruktur: halbstrukturformel(klasse, n),
    siedepunkt:
      klasse.key === 'alkan' && n <= ALKAN_SIEDEPUNKTE.length
        ? ALKAN_SIEDEPUNKTE[n - 1]
        : null,
    isomere: klasse.key === 'alkan' && n <= ALKAN_ISOMERE.length ? ALKAN_ISOMERE[n - 1] : null,
  };
}

function baueNamen(klasse, stamm, n) {
  switch (klasse.key) {
    case 'alkan':
      return `${stamm}an`;
    case 'alken':
      return `${stamm}en`;
    case 'alkin':
      return `${stamm}in`;
    case 'alkohol':
      return `${stamm}anol`;
    case 'aldehyd':
      return `${stamm}anal`;
    case 'keton':
      return `${stamm}anon`;
    case 'carbonsaeure':
      return `${stamm}ansäure`;
    case 'amin':
      return `${stamm}anamin`;
    case 'halogenalkan':
      return `Chlor${stamm.toLowerCase()}an`;
    default:
      return stamm;
  }
}

const TIEF = { 2: '₂', 3: '₃', 4: '₄' };

// Die Halbstrukturformel: Sie zeigt, wie die Kette aufgebaut ist, ohne
// jede Bindung einzeln zu zeichnen. CH₃–CH₂–OH sagt mehr als C₂H₆O,
// weil man daraus die Struktur ablesen kann.
export function halbstrukturformel(klasse, n) {
  // Die mittleren Kettenglieder. Sie tragen zwei Wasserstoffatome,
  // weil links und rechts je ein Kohlenstoff sitzt.
  const mitte = (anzahl) => Array.from({ length: Math.max(0, anzahl) }, () => 'CH₂');
  const kette = (...teile) => teile.flat().join('–');

  switch (klasse.key) {
    case 'alkan':
      return n === 1 ? 'CH₄' : kette('CH₃', mitte(n - 2), 'CH₃');

    // Bei Ethen sind BEIDE Kohlenstoffe CH₂ — es gibt keine Kette, an
    // der noch etwas hinge. Genau hier lag der Fehler der ersten
    // Fassung: Sie hängte stur ein CH₃ ans Ende und machte daraus
    // CH₂=CH₃, was ein Kohlenstoff mit fünf Bindungen wäre.
    case 'alken':
      return n === 2 ? 'CH₂=CH₂' : `CH₂=CH–${kette(mitte(n - 3), 'CH₃')}`;
    case 'alkin':
      return n === 2 ? 'CH≡CH' : `CH≡C–${kette(mitte(n - 3), 'CH₃')}`;

    // Bei diesen dreien sitzt die Gruppe an einem Kohlenstoff der
    // Kette, zählt also nicht als eigenes Glied.
    case 'alkohol':
      return n === 1 ? 'CH₃–OH' : kette('CH₃', mitte(n - 1), 'OH');
    case 'amin':
      return n === 1 ? 'CH₃–NH₂' : kette('CH₃', mitte(n - 1), 'NH₂');
    case 'halogenalkan':
      return n === 1 ? 'CH₃–Cl' : kette('CH₃', mitte(n - 1), 'Cl');

    // Hier ist die Gruppe selbst ein Kohlenstoff und zählt mit.
    case 'aldehyd':
      return n === 1 ? 'H–CHO' : kette('CH₃', mitte(n - 2), 'CHO');
    case 'carbonsaeure':
      return n === 1 ? 'H–COOH' : kette('CH₃', mitte(n - 2), 'COOH');
    case 'keton':
      return kette('CH₃', 'CO', mitte(n - 3), 'CH₃');

    default:
      return klasse.formel(n);
  }
}

// ---------------------------------------------------------------------
// Geometrie der Skelettformel
// ---------------------------------------------------------------------
//
// In der Skelettformel zeichnet man nur das Kohlenstoffgerüst als
// Zickzacklinie. Jeder Knick ist ein C-Atom, die Wasserstoffatome
// denkt man sich dazu. Das ist keine Faulheit, sondern Absicht: So
// sieht man die Struktur, statt sie aus Buchstaben zusammenzusuchen.
//
// Gibt Punkte und Bindungen zurück, die die Zeichenkomponente
// unmittelbar verwenden kann.
export function skelett(klasseKey, n) {
  const klasse = STOFFKLASSEN.find((k) => k.key === klasseKey);
  if (!klasse || n < klasse.minC) {
    return null;
  }

  const punkte = Array.from({ length: n }, (_, i) => ({
    x: i,
    // Zickzack: gerade Indizes unten, ungerade oben
    y: i % 2 === 0 ? 1 : 0,
  }));

  const bindungen = [];
  for (let i = 0; i < n - 1; i++) {
    let art = 'einfach';
    if (i === 0 && klasse.struktur.bindung === 'doppel') {
      art = 'doppel';
    }
    if (i === 0 && klasse.struktur.bindung === 'dreifach') {
      art = 'dreifach';
    }
    bindungen.push({ von: i, nach: i + 1, art });
  }

  const anhaenge = [];
  if (klasse.struktur.endgruppe) {
    anhaenge.push({ an: n - 1, text: klasse.struktur.endgruppe.replace('2', '₂'), richtung: 'rechts' });
  }
  if (klasse.struktur.doppelO === 'ende') {
    anhaenge.push({ an: n - 1, text: 'O', richtung: 'oben', doppel: true });
  }
  if (klasse.struktur.doppelO === 'mitte') {
    anhaenge.push({ an: 1, text: 'O', richtung: 'oben', doppel: true });
  }

  return { punkte, bindungen, anhaenge };
}
