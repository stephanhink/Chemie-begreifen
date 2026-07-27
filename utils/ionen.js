// Salzbildung: Was entsteht, wenn ein Metall auf ein Nichtmetall trifft?
//
// Der Kern dieser Datei ist eine Behauptung, die man ernst nehmen muss:
// Alles, was hier herauskommt, ist HERGELEITET, nicht nachgeschlagen.
// Aus der Stellung im Periodensystem folgt die Ionenladung, aus den
// Ladungen folgt das Zahlenverhältnis, daraus die Formel und die
// ausgeglichene Reaktionsgleichung.
//
// Genau deshalb ist der Geltungsbereich eng gezogen. Wo sich etwas NICHT
// herleiten lässt — zwei Nichtmetalle, Nebengruppenmetalle ohne feste
// Ladung, exotische Verbindungen —, gibt diese Datei kein Ergebnis
// zurück, sondern eine Begründung. Eine plausibel aussehende, aber
// falsche Reaktionsgleichung wäre für jemanden in der Abiturvorbereitung
// schlimmer als gar keine.

import { ELEMENTE, elementNachSymbol } from './elemente';

// ---------------------------------------------------------------------
// Welche Ionen bilden sich?
// ---------------------------------------------------------------------

// Nichtmetalle, die einfache einatomige Anionen bilden. Die Ladung ist
// die Zahl der Elektronen, die zum vollen Oktett fehlen — also
// Gruppennummer minus 18.
//
// Gruppe 14 (Kohlenstoff, Silicium) fehlt hier bewusst: Carbide und
// Silicide existieren zwar, folgen aber nicht der einfachen Ionenregel
// und kommen in der Schule nicht vor.
const ANIONEN = {
  F: { ladung: -1, name: 'Fluorid' },
  Cl: { ladung: -1, name: 'Chlorid' },
  Br: { ladung: -1, name: 'Bromid' },
  I: { ladung: -1, name: 'Iodid' },
  O: { ladung: -2, name: 'Oxid' },
  S: { ladung: -2, name: 'Sulfid' },
  Se: { ladung: -2, name: 'Selenid' },
  Te: { ladung: -2, name: 'Tellurid' },
  N: { ladung: -3, name: 'Nitrid' },
  P: { ladung: -3, name: 'Phosphid' },
  // Wasserstoff ist der Sonderfall: Gegenüber Nichtmetallen teilt er
  // Elektronen (HCl ist ein Molekül, kein Salz). Nur gegenüber stark
  // elektropositiven Metallen nimmt er eines auf und wird zum Hydrid.
  H: { ladung: -1, name: 'Hydrid', nurMitGruppe: [1, 2] },
};

// Metalle, deren Ionenladung sich NICHT aus der Gruppennummer ergibt.
// Das sind die Nebengruppenmetalle sowie Zinn und Blei: Bei ihnen
// stehen mehrere Ladungen zur Verfügung, weil auch innere Elektronen
// abgegeben werden können.
//
// Diese Tabelle ist die einzige Stelle in dieser Datei, an der etwas
// nachgeschlagen statt hergeleitet wird — und das ist kein Mangel,
// sondern die Aussage: Bei Nebengruppen GEHT es nicht anders.
const NEBENGRUPPEN_LADUNGEN = {
  Ti: [4],
  Cr: [3],
  Mn: [2],
  Fe: [2, 3],
  Co: [2],
  Ni: [2],
  Cu: [1, 2],
  Zn: [2],
  Ag: [1],
  Cd: [2],
  Hg: [2],
  Au: [3],
  Sn: [2, 4],
  Pb: [2, 4],
};

// Ordnungszahlen der Edelgase — für die Frage, ob ein Ion die
// Edelgaskonfiguration erreicht.
const EDELGAS_Z = { 2: 'Helium', 10: 'Neon', 18: 'Argon', 36: 'Krypton', 54: 'Xenon', 86: 'Radon' };

// Elemente, die als Reinstoff zweiatomig vorliegen. Wichtig für die
// Reaktionsgleichung: Sauerstoff ist O₂, nicht O.
const ZWEIATOMIG = ['H', 'N', 'O', 'F', 'Cl', 'Br', 'I'];

// Mögliche Kationenladungen eines Elements, oder null wenn es keine
// bildet.
export function kationenLadungen(element) {
  if (NEBENGRUPPEN_LADUNGEN[element.sym]) {
    return NEBENGRUPPEN_LADUNGEN[element.sym];
  }
  // Hauptgruppenmetalle: Die Gruppennummer ist die Zahl der
  // Außenelektronen — und die werden alle abgegeben.
  if (element.gruppe === 1 && element.sym !== 'H') {
    return [1];
  }
  if (element.gruppe === 2) {
    return [2];
  }
  if (['Al', 'Ga', 'In'].includes(element.sym)) {
    return [3];
  }
  return null;
}

export function anionLadung(element, partnerGruppe) {
  const eintrag = ANIONEN[element.sym];
  if (!eintrag) {
    return null;
  }
  if (eintrag.nurMitGruppe && !eintrag.nurMitGruppe.includes(partnerGruppe)) {
    return null;
  }
  return eintrag;
}

// ---------------------------------------------------------------------
// Hilfsrechnungen
// ---------------------------------------------------------------------

function ggT(a, b) {
  return b === 0 ? a : ggT(b, a % b);
}

function kgV(a, b) {
  return (a * b) / ggT(a, b);
}

const TIEF = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };

// Macht aus 2 die tiefgestellte ₂. Die Zahl 1 wird in chemischen
// Formeln nicht geschrieben.
export function tiefgestellt(n) {
  if (n === 1) {
    return '';
  }
  return String(n).split('').map((z) => TIEF[z]).join('');
}

const HOCH = { 1: '¹', 2: '²', 3: '³', 4: '⁴' };

// Die Ladung eines Ions: hochgestellte Zahl, dann das Vorzeichen.
// Bei einfacher Ladung wird die 1 weggelassen — Na⁺, nicht Na¹⁺.
export function ladungsZeichen(ladung) {
  const betrag = Math.abs(ladung);
  const zahl = betrag === 1 ? '' : HOCH[betrag];
  return zahl + (ladung > 0 ? '⁺' : '⁻');
}

// Welche Edelgaskonfiguration erreicht das Ion — oder keine?
function edelgasNach(element, ladung) {
  const elektronen = element.z - ladung;
  return EDELGAS_Z[elektronen] || null;
}

// ---------------------------------------------------------------------
// Die eigentliche Reaktion
// ---------------------------------------------------------------------

// Erzeugt für ein Ladungspaar die Verhältnisformel und die
// ausgeglichene Reaktionsgleichung.
//
// Verhältnisformel: Das Salz ist nach außen neutral, also muss die
// Summe der Ladungen null sein. Das kleinste gemeinsame Vielfache der
// beiden Ladungsbeträge liefert das kleinste Verhältnis, das das
// leistet — genau die "Kreuzregel" aus dem Unterricht.
function baueSalz(metall, nichtmetall, kationLadung, anionInfo) {
  const a = kationLadung;
  const b = Math.abs(anionInfo.ladung);
  const gemeinsam = kgV(a, b);
  const anzahlKation = gemeinsam / a;
  const anzahlAnion = gemeinsam / b;

  const formel =
    metall.sym + tiefgestellt(anzahlKation) + nichtmetall.sym + tiefgestellt(anzahlAnion);

  // Reaktionsgleichung: k · Metall + n · X(₂) → p · Salz
  //
  // Liegt das Nichtmetall zweiatomig vor, müssen seine Atome paarweise
  // aufgehen — deshalb muss p ein Vielfaches sein, das anzahlAnion · p
  // gerade macht.
  const molekuelGroesse = ZWEIATOMIG.includes(nichtmetall.sym) ? 2 : 1;
  let p = molekuelGroesse / ggT(anzahlAnion, molekuelGroesse);
  let k = p * anzahlKation;
  let n = (p * anzahlAnion) / molekuelGroesse;

  const teiler = ggT(ggT(k, n), p);
  k /= teiler;
  n /= teiler;
  p /= teiler;

  const vor = (zahl) => (zahl === 1 ? '' : `${zahl} `);
  const nichtmetallForm =
    nichtmetall.sym + (molekuelGroesse === 2 ? '₂' : '');

  const gleichung =
    `${vor(k)}${metall.sym} + ${vor(n)}${nichtmetallForm} → ${vor(p)}${formel}`;

  return {
    formel,
    gleichung,
    anzahlKation,
    anzahlAnion,
    kationLadung: a,
    anionLadung: anionInfo.ladung,
    // Wie viele Elektronen wechseln pro Formeleinheit den Besitzer?
    elektronen: gemeinsam,
    name: salzName(metall, nichtmetall, a, anionInfo),
    kationEdelgas: edelgasNach(metall, a),
    anionEdelgas: edelgasNach(nichtmetall, anionInfo.ladung),
  };
}

const ROEMISCH = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };

function salzName(metall, nichtmetall, kationLadung, anionInfo) {
  // Kann das Metall mehrere Ladungen bilden, muss die gemeinte in
  // römischen Ziffern dabeistehen — sonst wäre "Eisenoxid" mehrdeutig.
  const mehrdeutig = (NEBENGRUPPEN_LADUNGEN[metall.sym] || []).length > 1;
  // "Eisenoxid" wäre mehrdeutig — es gibt zwei davon. Die römische
  // Ziffer nennt die Ladung des Metallions: Eisen(II)-oxid.
  const zusatz = mehrdeutig ? `(${ROEMISCH[kationLadung]})-` : '';
  return `${metall.name}${zusatz}${anionInfo.name.toLowerCase()}`;
}

// ---------------------------------------------------------------------
// Öffentliche Schnittstelle
// ---------------------------------------------------------------------

// Nimmt zwei Elemente und sagt, was passiert.
//
// Rückgabe immer als Objekt mit "art":
//   'salz'        → es entsteht ein Salz, Details unter "ergebnisse"
//   'keineReaktion' / 'nichtHerleitbar' → "grund" erklärt, warum nicht
//
// Die Reihenfolge der beiden Elemente ist egal.
export function reagiere(elementA, elementB) {
  if (!elementA || !elementB) {
    return { art: 'unvollstaendig' };
  }

  if (elementA.z === elementB.z) {
    return {
      art: 'keineReaktion',
      grund:
        'Ein Element reagiert nicht mit sich selbst zu einer neuen Verbindung. Viele Nichtmetalle verbinden sich allerdings paarweise zu Molekülen wie O₂ oder Cl₂.',
    };
  }

  if (elementA.kategorie === 'edelgas' || elementB.kategorie === 'edelgas') {
    const edelgas = elementA.kategorie === 'edelgas' ? elementA : elementB;
    return {
      art: 'keineReaktion',
      grund: `${edelgas.name} ist ein Edelgas: Seine äußerste Schale ist bereits voll besetzt. Es muss weder Elektronen abgeben noch aufnehmen und geht deshalb praktisch keine Verbindungen ein.`,
      thema: 'edelgase',
    };
  }

  // Wer ist Metall, wer Nichtmetall? Beide Zuordnungen durchprobieren.
  for (const [metall, nichtmetall] of [
    [elementA, elementB],
    [elementB, elementA],
  ]) {
    const ladungen = kationenLadungen(metall);
    if (!ladungen) {
      continue;
    }
    const anionInfo = anionLadung(nichtmetall, metall.gruppe);
    if (!anionInfo) {
      continue;
    }

    return {
      art: 'salz',
      metall,
      nichtmetall,
      // Bei Eisen, Kupfer, Zinn und Blei entstehen mehrere mögliche
      // Salze. Alle zeigen, statt eines willkürlich auszuwählen.
      ergebnisse: ladungen.map((l) => baueSalz(metall, nichtmetall, l, anionInfo)),
      mehrdeutig: ladungen.length > 1,
    };
  }

  // Kein Metall-Nichtmetall-Paar. Warum nicht?
  const istMetallA = kationenLadungen(elementA) !== null;
  const istMetallB = kationenLadungen(elementB) !== null;

  if (istMetallA && istMetallB) {
    return {
      art: 'keineReaktion',
      grund:
        'Zwei Metalle geben beide Elektronen ab — es ist niemand da, der sie aufnimmt. Deshalb entsteht kein Salz. Zusammengeschmolzen ergeben sie eine Legierung: ein Gemisch, keine chemische Verbindung.',
      thema: 'ionenbindung',
    };
  }

  const beideNichtmetalle =
    ['nichtmetall', 'halogen'].includes(elementA.kategorie) &&
    ['nichtmetall', 'halogen'].includes(elementB.kategorie);

  if (beideNichtmetalle) {
    return {
      art: 'nichtHerleitbar',
      grund:
        'Zwei Nichtmetalle geben keine Elektronen ab, sondern teilen sie sich — es entsteht eine Atombindung, kein Salz. Welches Molekül dabei herauskommt, lässt sich nicht aus der Stellung im Periodensystem ableiten: Kohlenstoff und Sauerstoff ergeben je nach Bedingungen CO oder CO₂. Für diese Kombination steht auch nichts in der geprüften Reaktionssammlung — deshalb zeigt die App hier lieber nichts, als etwas zu erfinden.',
      thema: 'ionenbindung',
    };
  }

  return {
    art: 'nichtHerleitbar',
    grund:
      'Für diese Kombination lässt sich das Produkt nicht aus der Stellung im Periodensystem herleiten. Die App zeigt hier bewusst nichts an, statt etwas zu erfinden.',
  };
}

// Alle Elemente, die überhaupt an einer herleitbaren Salzbildung
// teilnehmen können — für die Einfärbung des Gitters im Labor.
export function istLaborfaehig(element) {
  return kationenLadungen(element) !== null || ANIONEN[element.sym] !== undefined;
}

// Ein paar Paare, die sich zum Ausprobieren lohnen. Bewusst so gewählt,
// dass sie verschiedene Fälle zeigen: 1:1, 1:2, 2:3 und ein Metall mit
// zwei möglichen Ladungen.
export const VORSCHLAEGE = [
  { a: 'Na', b: 'Cl', hinweis: 'Kochsalz — das einfachste Verhältnis' },
  { a: 'Mg', b: 'Cl', hinweis: 'Hier braucht es zwei Chlor pro Magnesium' },
  { a: 'Al', b: 'O', hinweis: 'Verhältnis 2:3 — das kleinste, das aufgeht' },
  { a: 'Mg', b: 'N', hinweis: 'Nitride: drei Elektronen wandern' },
  { a: 'Fe', b: 'O', hinweis: 'Eisen kann zwei verschiedene Ionen bilden' },
  { a: 'Ca', b: 'F', hinweis: 'Flussspat' },
].map(({ a, b, hinweis }) => ({
  a: elementNachSymbol(a),
  b: elementNachSymbol(b),
  hinweis,
}));

// Für Tests und Prüfskripte: alle herleitbaren Paare durchgehen.
export function alleSalzPaare() {
  const paare = [];
  for (const metall of ELEMENTE) {
    if (!kationenLadungen(metall)) {
      continue;
    }
    for (const nichtmetall of ELEMENTE) {
      if (anionLadung(nichtmetall, metall.gruppe)) {
        paare.push([metall, nichtmetall]);
      }
    }
  }
  return paare;
}
