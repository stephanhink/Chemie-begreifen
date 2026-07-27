// Redoxchemie: Oxidationszahlen, Spannungsreihe, Nernst-Gleichung und
// die Faraday-Gesetze.
//
// Wie im Labor gilt auch hier die Trennung: Oxidationszahlen werden
// HERGELEITET (feste Regeln mit klarer Rangfolge), Standardpotentiale
// werden NACHGESCHLAGEN (sie sind gemessen, nicht ableitbar).

import { parseFormel } from './formel.js';
import { elementNachSymbol } from './elemente.js';
import { FARADAY, GASKONSTANTE, T_STANDARD } from './konstanten.js';

// ---------------------------------------------------------------------
// Oxidationszahlen
// ---------------------------------------------------------------------
//
// Die Regeln sind eine Rangfolge, keine Sammlung gleichberechtigter
// Aussagen — genau daran scheitern die meisten von Hand. Wer bei H₂O₂
// zuerst "Sauerstoff ist immer −II" anwendet, kommt auf einen
// Widerspruch. Richtig ist: Wasserstoff steht in der Rangfolge weiter
// oben, Sauerstoff ergibt sich danach aus der Summenbedingung.
//
// Umgesetzt ist das so: Erst werden die Elemente festgelegt, deren
// Oxidationszahl unverhandelbar ist. Bleibt danach genau ein Element
// übrig, folgt seine Zahl zwingend aus der Summe. Bleiben zwei übrig
// und eines davon ist Sauerstoff, wird für ihn die Regel −II ergänzt
// und erneut geprüft.

// Elemente mit fester Oxidationszahl, in der Reihenfolge ihrer Priorität.
const FESTE_ZAHLEN = [
  { symbole: ['F'], wert: -1 },
  { gruppe: 1, ausser: ['H'], wert: 1 },
  { gruppe: 2, wert: 2 },
  { symbole: ['Al'], wert: 3 },
];

// Bestimmt die Oxidationszahlen aller Elemente einer Formel.
//
//   oxidationszahlen('H2SO4')      → S +VI, O −II, H +I
//   oxidationszahlen('Cr2O7', -2)  → Cr +VI, O −II
//   oxidationszahlen('H2O2')       → O −I  (Peroxid!)
//   oxidationszahlen('Fe3O4')      → Fe +8/3 (ein Mittelwert)
//
// Gibt bei Erfolg { zahlen, schritte } zurück — die Schritte
// dokumentieren die Herleitung, damit man sie nachvollziehen kann.
// Lässt sich nichts eindeutig bestimmen, kommt { fehler } zurück.
export function oxidationszahlen(formel, ladung = 0) {
  const atome = parseFormel(formel);
  const symbole = Object.keys(atome);

  for (const sym of symbole) {
    if (!elementNachSymbol(sym)) {
      return { fehler: `"${sym}" ist kein Element des Periodensystems` };
    }
  }

  const schritte = [];

  // Sonderfall 1: ein Element allein, ungeladen — ein Reinstoff.
  // O₂, Fe, S₈: Die Atome sind alle gleich, keines kann dem anderen
  // Elektronen wegnehmen. Also null.
  if (symbole.length === 1 && ladung === 0) {
    schritte.push(
      'Ein Element in Reinform: Alle Atome sind gleich, keines zieht stärker. Die Oxidationszahl ist 0.'
    );
    return { zahlen: { [symbole[0]]: 0 }, schritte };
  }

  // Sonderfall 2: ein Element, geladen — ein einatomiges Ion.
  if (symbole.length === 1) {
    const wert = ladung / atome[symbole[0]];
    schritte.push(
      `Ein einatomiges Ion: Die Oxidationszahl ist gleich der Ladung, also ${roemisch(wert)}.`
    );
    return { zahlen: { [symbole[0]]: wert }, schritte };
  }

  const zahlen = {};

  for (const regel of FESTE_ZAHLEN) {
    for (const sym of symbole) {
      if (zahlen[sym] !== undefined) {
        continue;
      }
      const element = elementNachSymbol(sym);
      const trifft = regel.symbole
        ? regel.symbole.includes(sym)
        : element.gruppe === regel.gruppe && !(regel.ausser || []).includes(sym);
      if (trifft) {
        zahlen[sym] = regel.wert;
        schritte.push(`${element.name} ist immer ${roemisch(regel.wert)}.`);
      }
    }
  }

  // Wasserstoff: normalerweise +I. In einer zweielementigen Verbindung
  // mit einem Metall ist er dagegen der elektronegativere Partner und
  // wird zum Hydrid-Ion — dort ist er −I.
  if (atome.H !== undefined && zahlen.H === undefined) {
    const metallpartner =
      symbole.length === 2 &&
      symbole.some((s) => s !== 'H' && istMetall(elementNachSymbol(s)));
    zahlen.H = metallpartner ? -1 : 1;
    schritte.push(
      metallpartner
        ? 'Wasserstoff steht hier zusammen mit einem Metall: Er ist der elektronegativere Partner und deshalb −I (ein Hydrid).'
        : 'Wasserstoff ist +I.'
    );
  }

  const offen = () => symbole.filter((s) => zahlen[s] === undefined);

  // Bleiben zwei offen und Sauerstoff ist dabei, greift für ihn die
  // Regel −II. Das ist bewusst der spätere Schritt: Bei H₂O₂ ist die
  // Rechnung schon vorher eindeutig, und dort ist Sauerstoff −I.
  if (offen().length > 1 && zahlen.O === undefined) {
    zahlen.O = -2;
    schritte.push('Sauerstoff ist −II (außer in Peroxiden und gegenüber Fluor).');
  }

  const rest = offen();

  if (rest.length === 0) {
    const summe = symbole.reduce((s, sym) => s + zahlen[sym] * atome[sym], 0);
    if (Math.abs(summe - ladung) > 1e-9) {
      return {
        fehler: `Die festen Regeln ergeben zusammen ${summe}, die Formel trägt aber die Ladung ${ladung}. So kann die Verbindung nicht stimmen.`,
      };
    }
    schritte.push('Alle Oxidationszahlen liegen bereits durch die Regeln fest.');
    return { zahlen, schritte };
  }

  if (rest.length > 1) {
    return {
      fehler: `Hier bleiben mit ${rest.join(' und ')} zwei Elemente offen, deren Oxidationszahl sich nicht aus den Regeln ergibt. Aus der Summenformel allein ist das nicht zu entscheiden — dafür bräuchte man die Strukturformel.`,
    };
  }

  // Genau eines offen: Es folgt zwingend aus der Summenbedingung.
  const gesucht = rest[0];
  const bekannteSumme = symbole
    .filter((s) => s !== gesucht)
    .reduce((s, sym) => s + zahlen[sym] * atome[sym], 0);
  const wert = (ladung - bekannteSumme) / atome[gesucht];
  zahlen[gesucht] = wert;

  schritte.push(
    `Die Summe aller Oxidationszahlen muss ${
      ladung === 0 ? 'null' : mitVorzeichen(ladung)
    } ergeben. Der Rest bringt ${mitVorzeichen(bekannteSumme)}, also bleibt für ` +
      `${atome[gesucht]} × ${elementNachSymbol(gesucht).name} genau ${roemisch(wert)}.`
  );

  return { zahlen, schritte };
}

// JavaScript schreibt negative Zahlen mit dem ASCII-Bindestrich. Im
// Fließtext daneben steht überall das typografische Minuszeichen —
// nebeneinander sieht das aus wie ein Fehler.
function mitVorzeichen(wert) {
  if (wert === 0) {
    return '0';
  }
  return (wert > 0 ? '+' : '−') + Math.abs(wert);
}

function istMetall(element) {
  return ['alkalimetall', 'erdalkalimetall', 'uebergangsmetall', 'metall'].includes(
    element.kategorie
  );
}

const ROEMISCHE = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

// Oxidationszahlen schreibt man in römischen Ziffern mit Vorzeichen —
// so verwechselt man sie nicht mit Ionenladungen (Fe³⁺ gegen Fe +III).
export function roemisch(wert) {
  if (!Number.isInteger(wert)) {
    // Mittelwerte wie +8/3 bei Fe₃O₄ lassen sich nicht römisch
    // schreiben. Sie sind trotzdem richtig — im Kristall liegen dort
    // zwei Fe(III) und ein Fe(II) nebeneinander.
    return (wert > 0 ? '+' : '−') + bruchText(Math.abs(wert));
  }
  if (wert === 0) {
    return '0';
  }
  return (wert > 0 ? '+' : '−') + ROEMISCHE[Math.abs(wert)];
}

function bruchText(wert) {
  for (let nenner = 2; nenner <= 6; nenner++) {
    const zaehler = wert * nenner;
    if (Math.abs(zaehler - Math.round(zaehler)) < 1e-9) {
      return `${Math.round(zaehler)}/${nenner}`;
    }
  }
  return wert.toFixed(2).replace('.', ',');
}

// ---------------------------------------------------------------------
// Redoxanalyse einer Reaktion
// ---------------------------------------------------------------------

// Vergleicht die Oxidationszahlen jedes Elements auf beiden Seiten und
// sagt, wer oxidiert und wer reduziert wird.
//
// ergebnis stammt aus gleicheAus() in utils/gleichung.js.
export function analysiereRedox(ergebnis) {
  const seite = (formeln) => {
    const werte = {};
    for (const formel of formeln) {
      const r = oxidationszahlen(formel);
      if (r.fehler) {
        return null;
      }
      for (const [sym, wert] of Object.entries(r.zahlen)) {
        // Kommt ein Element in mehreren Stoffen einer Seite vor
        // (Kohlenstoff in CO und CO₂), merken wir uns alle Werte.
        werte[sym] = werte[sym] || [];
        werte[sym].push({ formel, wert });
      }
    }
    return werte;
  };

  const links = seite(ergebnis.edukte);
  const rechts = seite(ergebnis.produkte);

  if (!links || !rechts) {
    return { fehler: 'Für mindestens einen Stoff lassen sich die Oxidationszahlen nicht eindeutig bestimmen.' };
  }

  const aenderungen = [];
  for (const sym of Object.keys(links)) {
    if (!rechts[sym]) {
      continue;
    }
    // Ein Element darf in mehreren Stoffen einer Seite vorkommen —
    // Sauerstoff steht bei der Methanverbrennung ja sowohl im CO₂ als
    // auch im H₂O. Solange er dort dieselbe Oxidationszahl trägt, ist
    // der Fall eindeutig. Nur wenn sich die Werte unterscheiden (etwa
    // bei einer Disproportionierung), lässt sich nicht sagen, was
    // woraus geworden ist.
    const vorher = eindeutig(links[sym]);
    const nachher = eindeutig(rechts[sym]);
    if (!vorher || !nachher) {
      continue;
    }
    if (Math.abs(vorher.wert - nachher.wert) > 1e-9) {
      aenderungen.push({
        symbol: sym,
        von: vorher.wert,
        nach: nachher.wert,
        vonFormel: vorher.formel,
        nachFormel: nachher.formel,
        art: nachher.wert > vorher.wert ? 'oxidation' : 'reduktion',
      });
    }
  }

  return {
    istRedox: aenderungen.length > 0,
    aenderungen,
  };
}

// Tragen alle Vorkommen eines Elements auf einer Seite dieselbe
// Oxidationszahl? Dann gib eines davon zurück, sonst null.
function eindeutig(vorkommen) {
  const werte = new Set(vorkommen.map((v) => v.wert));
  return werte.size === 1 ? vorkommen[0] : null;
}

// ---------------------------------------------------------------------
// Elektrochemische Spannungsreihe
// ---------------------------------------------------------------------
//
// Standardpotentiale in Volt, gemessen gegen die
// Standard-Wasserstoffelektrode bei 25 °C, 1 mol/L und 1013 hPa.
//
// Diese Werte sind NICHT herleitbar — sie sind gemessen. Deshalb stehen
// sie als Tabelle da und nicht als Rechnung.
//
//   z    Zahl der übertragenen Elektronen
//   e0   Standardpotential in Volt

export const HALBZELLEN = [
  { ox: 'Li⁺', red: 'Li', z: 1, e0: -3.04, name: 'Lithium' },
  { ox: 'K⁺', red: 'K', z: 1, e0: -2.93, name: 'Kalium' },
  { ox: 'Ca²⁺', red: 'Ca', z: 2, e0: -2.87, name: 'Calcium' },
  { ox: 'Na⁺', red: 'Na', z: 1, e0: -2.71, name: 'Natrium' },
  { ox: 'Mg²⁺', red: 'Mg', z: 2, e0: -2.37, name: 'Magnesium' },
  { ox: 'Al³⁺', red: 'Al', z: 3, e0: -1.66, name: 'Aluminium' },
  { ox: 'Zn²⁺', red: 'Zn', z: 2, e0: -0.76, name: 'Zink' },
  { ox: 'Fe²⁺', red: 'Fe', z: 2, e0: -0.44, name: 'Eisen(II)' },
  { ox: 'Ni²⁺', red: 'Ni', z: 2, e0: -0.26, name: 'Nickel' },
  { ox: 'Sn²⁺', red: 'Sn', z: 2, e0: -0.14, name: 'Zinn' },
  { ox: 'Pb²⁺', red: 'Pb', z: 2, e0: -0.13, name: 'Blei' },
  { ox: '2 H⁺', red: 'H₂', z: 2, e0: 0.0, name: 'Wasserstoff (Bezugspunkt)' },
  { ox: 'Cu²⁺', red: 'Cu', z: 2, e0: 0.34, name: 'Kupfer' },
  { ox: 'I₂', red: '2 I⁻', z: 2, e0: 0.54, name: 'Iod' },
  { ox: 'Fe³⁺', red: 'Fe²⁺', z: 1, e0: 0.77, name: 'Eisen(III)/Eisen(II)' },
  { ox: 'Ag⁺', red: 'Ag', z: 1, e0: 0.8, name: 'Silber' },
  { ox: 'Br₂', red: '2 Br⁻', z: 2, e0: 1.07, name: 'Brom' },
  { ox: 'O₂', red: 'H₂O', z: 4, e0: 1.23, name: 'Sauerstoff' },
  { ox: 'Cr₂O₇²⁻', red: '2 Cr³⁺', z: 6, e0: 1.33, name: 'Dichromat' },
  { ox: 'Cl₂', red: '2 Cl⁻', z: 2, e0: 1.36, name: 'Chlor' },
  { ox: 'MnO₄⁻', red: 'Mn²⁺', z: 5, e0: 1.51, name: 'Permanganat' },
  { ox: 'F₂', red: '2 F⁻', z: 2, e0: 2.87, name: 'Fluor' },
];

// Spannung einer galvanischen Zelle aus zwei Halbzellen.
//
// Die Halbzelle mit dem höheren Potential nimmt die Elektronen auf, ist
// also der Pluspol (Kathode). Die andere gibt sie ab (Anode, Minuspol).
// Die Zellspannung ist die Differenz — und sie ist immer positiv, wenn
// man richtig herum zuordnet.
export function zellspannung(a, b) {
  const kathode = a.e0 >= b.e0 ? a : b;
  const anode = a.e0 >= b.e0 ? b : a;
  return {
    kathode,
    anode,
    spannung: kathode.e0 - anode.e0,
    laeuftFreiwillig: kathode.e0 !== anode.e0,
  };
}

// ---------------------------------------------------------------------
// Nernst-Gleichung
// ---------------------------------------------------------------------

// Das Standardpotential gilt nur bei 1 mol/L. Weicht die Konzentration
// ab, verschiebt sich das Potential — die Nernst-Gleichung sagt, um
// wie viel.
//
// Im Unterricht benutzt man meist die Kurzform mit der Konstanten
// 0,059 V. Die gilt aber nur bei genau 25 °C, denn in ihr steckt die
// Temperatur. Diese Funktion rechnet beides und zeigt die Abweichung.
export function nernst(e0, z, cOx, cRed, temperaturCelsius = 25) {
  const T = temperaturCelsius + 273.15;
  const verhaeltnis = cOx / cRed;

  // Exakt: E = E° + (R·T)/(z·F) · ln(c(Ox)/c(Red))
  const genau = e0 + ((GASKONSTANTE * T) / (z * FARADAY)) * Math.log(verhaeltnis);

  // Schulformel: E = E° + (0,059 V / z) · lg(c(Ox)/c(Red))
  const naeherung = e0 + (0.059 / z) * Math.log10(verhaeltnis);

  // Woher kommt die 0,059? Aus (R·T)/F · ln(10) bei 25 °C.
  const faktorBeiT = ((GASKONSTANTE * T) / FARADAY) * Math.LN10;

  return {
    genau,
    naeherung,
    abweichung: naeherung - genau,
    faktorBeiT,
    faktorBei25: ((GASKONSTANTE * T_STANDARD) / FARADAY) * Math.LN10,
    verhaeltnis,
  };
}

// ---------------------------------------------------------------------
// Elektrolyse: die Faraday-Gesetze
// ---------------------------------------------------------------------

// Wie viel Stoff scheidet ein Strom in einer bestimmten Zeit ab?
//
// Ladung Q = I · t. Ein Mol Elektronen trägt die Ladung F. Für ein Mol
// Substanz braucht es z Mol Elektronen — daraus folgt alles Weitere.
export function elektrolyse({ stromstaerke, sekunden, z, molareMasse }) {
  const ladung = stromstaerke * sekunden;
  const molElektronen = ladung / FARADAY;
  const stoffmenge = molElektronen / z;

  return {
    ladung,
    molElektronen,
    stoffmenge,
    masse: stoffmenge * molareMasse,
  };
}
