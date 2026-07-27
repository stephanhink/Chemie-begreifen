// Säure-Base-Chemie nach Brønsted.
//
// Leitlinie aus der CLAUDE.md: Wo im Unterricht eine Näherung benutzt
// wird, rechnet diese Datei ZUSÄTZLICH exakt und zeigt die Abweichung.
// Genau daran versteht man, unter welchen Bedingungen die Näherung
// trägt — und wann sie danebenliegt.
//
// Kein React hier drin.

import { KW_25 } from './konstanten';

// ---------------------------------------------------------------------
// pKs-Werte (25 °C)
// ---------------------------------------------------------------------
//
// Nach Brønsted ist jede Säure Teil eines korrespondierenden Paares:
// Die Säure gibt ein Proton ab und wird zur Base. Deshalb steht hier
// pro Zeile beides — und pKb ergibt sich als 14 − pKs.
//
// "stark" markiert Säuren, die in Wasser praktisch vollständig
// protolysieren. Ihr pKs-Wert lässt sich in Wasser gar nicht mehr
// messen (Nivellierungseffekt); die Zahlen sind Literaturwerte aus
// anderen Lösungsmitteln und stehen hier nur der Vollständigkeit halber.

export const SAEUREN = [
  { name: 'Salzsäure', formel: 'HCl', base: 'Cl⁻', pks: -6, stark: true },
  { name: 'Schwefelsäure (1. Stufe)', formel: 'H2SO4', base: 'HSO₄⁻', pks: -3, stark: true },
  { name: 'Salpetersäure', formel: 'HNO3', base: 'NO₃⁻', pks: -1.32, stark: true },
  { name: 'Oxonium-Ion', formel: 'H3O+', base: 'H₂O', pks: 0 },
  { name: 'Schwefelsäure (2. Stufe)', formel: 'HSO4-', base: 'SO₄²⁻', pks: 1.92 },
  { name: 'Phosphorsäure (1. Stufe)', formel: 'H3PO4', base: 'H₂PO₄⁻', pks: 2.13 },
  { name: 'Flusssäure', formel: 'HF', base: 'F⁻', pks: 3.14 },
  { name: 'Ameisensäure', formel: 'HCOOH', base: 'HCOO⁻', pks: 3.75 },
  { name: 'Benzoesäure', formel: 'C6H5COOH', base: 'C₆H₅COO⁻', pks: 4.2 },
  { name: 'Essigsäure', formel: 'CH3COOH', base: 'CH₃COO⁻', pks: 4.75 },
  { name: 'Kohlensäure (1. Stufe)', formel: 'H2CO3', base: 'HCO₃⁻', pks: 6.35 },
  { name: 'Dihydrogenphosphat', formel: 'H2PO4-', base: 'HPO₄²⁻', pks: 7.2 },
  { name: 'Blausäure', formel: 'HCN', base: 'CN⁻', pks: 9.21 },
  { name: 'Ammonium-Ion', formel: 'NH4+', base: 'NH₃', pks: 9.25 },
  { name: 'Hydrogencarbonat', formel: 'HCO3-', base: 'CO₃²⁻', pks: 10.33 },
  { name: 'Hydrogenphosphat', formel: 'HPO4 2-', base: 'PO₄³⁻', pks: 12.35 },
];

// Basen werden über ihre korrespondierende Säure beschrieben — so
// braucht es nur eine Konstante pro Paar.
export const BASEN = [
  { name: 'Natronlauge', formel: 'NaOH', saeure: 'Na⁺', pkb: -1, stark: true },
  { name: 'Kalilauge', formel: 'KOH', saeure: 'K⁺', pkb: -1, stark: true },
  { name: 'Ammoniak', formel: 'NH3', saeure: 'NH₄⁺', pkb: 4.75 },
  { name: 'Carbonat', formel: 'CO3 2-', saeure: 'HCO₃⁻', pkb: 3.67 },
  { name: 'Acetat', formel: 'CH3COO-', saeure: 'CH₃COOH', pkb: 9.25 },
  { name: 'Hydrogencarbonat', formel: 'HCO3-', saeure: 'H₂CO₃', pkb: 7.65 },
];

export const PKW = 14;

// ---------------------------------------------------------------------
// Der exakte Weg
// ---------------------------------------------------------------------
//
// Statt für jeden Fall eine eigene Formel zu pflegen (starke Säure,
// schwache Säure, Puffer, Titration …), wird immer dieselbe Bedingung
// gelöst: die LADUNGSBILANZ. Eine Lösung ist nach außen elektrisch
// neutral, also muss die Summe aller positiven Ladungen der Summe aller
// negativen entsprechen.
//
// Für eine Säure HA mit zugesetzter starker Base:
//
//   c(Kation der Base) + c(H₃O⁺) = c(OH⁻) + c(A⁻)
//
// Darin sind c(OH⁻) = K_W / h und c(A⁻) = c_ges · K_S / (K_S + h),
// wobei h für c(H₃O⁺) steht. Übrig bleibt eine Gleichung in h allein.
//
// Sie ist streng monoton in h, deshalb findet ein Intervallhalbierungs-
// verfahren die Lösung sicher — ohne Startwert-Raterei und ohne dass
// man Fälle unterscheiden müsste. Eine sehr verdünnte starke Säure
// kommt damit automatisch richtig heraus, obwohl gerade dort die
// Schulformel versagt.
function loeseLadungsbilanz(cSaeureGesamt, ks, cStarkeBase, cStarkeSaeure = 0) {
  const f = (h) =>
    cStarkeBase +
    h -
    KW_25 / h -
    (cSaeureGesamt * ks) / (ks + h) -
    cStarkeSaeure;

  // pH zwischen −1 und 15 abdecken
  let unten = 1e-15;
  let oben = 10;

  for (let i = 0; i < 200; i++) {
    const mitte = Math.sqrt(unten * oben); // geometrisch halbieren: h läuft über Zehnerpotenzen
    if (f(mitte) > 0) {
      oben = mitte;
    } else {
      unten = mitte;
    }
  }
  return Math.sqrt(unten * oben);
}

export const phAus = (h) => -Math.log10(h);
export const hAusPh = (ph) => Math.pow(10, -ph);
export const ksAusPks = (pks) => Math.pow(10, -pks);

// ---------------------------------------------------------------------
// Säuren
// ---------------------------------------------------------------------

// pH einer Säurelösung.
//
//   c     Ausgangskonzentration in mol/L
//   pks   Säurestärke; für starke Säuren ein sehr kleiner Wert
//
// Gibt exakten Wert, Schulnäherung und die Abweichung zurück — samt der
// Angabe, ob die Näherung hier überhaupt zulässig ist.
export function phSaeure(c, pks, stark) {
  const ks = ksAusPks(pks);
  const hGenau = loeseLadungsbilanz(stark ? 0 : c, ks, 0, stark ? c : 0);
  const genau = phAus(hGenau);

  // Die Schulformeln:
  //   starke Säure   pH = −lg c₀        (vollständige Protolyse)
  //   schwache Säure pH = ½ (pKs − lg c₀)
  const naeherung = stark ? -Math.log10(c) : 0.5 * (pks - Math.log10(c));

  // Wann trägt die Näherung?
  // Bei starken Säuren: solange die Eigendissoziation des Wassers keine
  // Rolle spielt, also oberhalb von etwa 10⁻⁶ mol/L.
  // Bei schwachen Säuren: solange weniger als etwa 5 % protolysieren —
  // nur dann darf man c(HA) ≈ c₀ setzen.
  const protolysegrad = stark ? 1 : hGenau / c;
  const gueltig = stark ? c > 1e-6 : protolysegrad < 0.05;

  return {
    genau,
    naeherung,
    abweichung: naeherung - genau,
    protolysegrad,
    gueltig,
    konzentrationH: hGenau,
    konzentrationOH: KW_25 / hGenau,
  };
}

// pH einer Basenlösung — über die korrespondierende Säure.
//
// Eine Base B mit pKb entspricht einer Säure BH⁺ mit pKs = 14 − pKb.
// Statt eine zweite Rechnung zu pflegen, wird der Fall zurückgeführt:
// Wir lösen dieselbe Ladungsbilanz, nur mit der Base als Zusatz.
export function phBase(c, pkb, stark) {
  if (stark) {
    const hGenau = loeseLadungsbilanz(0, 1, c, 0);
    const genau = phAus(hGenau);
    return {
      genau,
      naeherung: PKW + Math.log10(c),
      abweichung: PKW + Math.log10(c) - genau,
      gueltig: c > 1e-6,
      protolysegrad: 1,
      konzentrationH: hGenau,
      konzentrationOH: KW_25 / hGenau,
    };
  }

  // Schwache Base: dieselbe Quadratgleichung wie bei der schwachen
  // Säure, nur mit OH⁻ statt H₃O⁺.
  const kb = ksAusPks(pkb);
  const oh = (-kb + Math.sqrt(kb * kb + 4 * kb * c)) / 2;
  const genau = PKW - phAus(oh);
  const naeherung = PKW - 0.5 * (pkb - Math.log10(c));

  return {
    genau,
    naeherung,
    abweichung: naeherung - genau,
    protolysegrad: oh / c,
    gueltig: oh / c < 0.05,
    konzentrationH: KW_25 / oh,
    konzentrationOH: oh,
  };
}

// ---------------------------------------------------------------------
// Puffer
// ---------------------------------------------------------------------

// Henderson-Hasselbalch: pH = pKs + lg( c(Base) / c(Säure) ).
//
// Ein Puffer ist ein Gemisch aus einer schwachen Säure und ihrer
// korrespondierenden Base. Gibt man Säure zu, fängt die Base sie ab;
// gibt man Base zu, die Säure. Der pH ändert sich dabei kaum.
export function phPuffer(cSaeure, cBase, pks) {
  const verhaeltnis = cBase / cSaeure;
  const ph = pks + Math.log10(verhaeltnis);

  // Die Faustregel: Ein Puffer wirkt im Bereich pKs ± 1, also solange
  // das Verhältnis zwischen 1:10 und 10:1 liegt. Außerhalb ist eine
  // Komponente so knapp, dass sie schnell aufgebraucht ist.
  //
  // Verglichen wird der pH-Abstand, nicht das Verhältnis selbst: In
  // Gleitkommazahlen ergibt 0,01 / 0,1 nämlich 0,09999999999999999, und
  // damit fiele der Grenzfall 1:10 fälschlich aus dem Bereich heraus.
  return {
    ph,
    verhaeltnis,
    imPufferbereich: Math.abs(ph - pks) <= 1 + 1e-9,
    // Kapazität: Wie viel Stoffmenge steht zum Abfangen bereit?
    kapazitaetSaeure: cSaeure,
    kapazitaetBase: cBase,
  };
}

// ---------------------------------------------------------------------
// Titration
// ---------------------------------------------------------------------

// Berechnet die Titrationskurve: pH gegen zugegebenes Volumen an
// Maßlösung.
//
//   c0        Konzentration der vorgelegten Säure in mol/L
//   v0        vorgelegtes Volumen in mL
//   pks       Stärke der vorgelegten Säure
//   stark     ist die vorgelegte Säure stark?
//   cTitrant  Konzentration der zugegebenen starken Base in mol/L
//   bisMl     bis zu welchem Volumen gerechnet wird
//
// Es wird an jedem Punkt dieselbe Ladungsbilanz gelöst wie oben — keine
// abschnittsweisen Formeln. Dadurch stimmt die Kurve auch genau am
// Äquivalenzpunkt, wo die Schulformeln unstetig aneinanderstoßen.
export function titrationskurve({ c0, v0, pks, stark, cTitrant, bisMl, punkte = 240 }) {
  const ks = ksAusPks(pks);
  const kurve = [];

  for (let i = 0; i <= punkte; i++) {
    const vb = (bisMl * i) / punkte;
    const gesamtVolumen = v0 + vb;
    const cSaeure = (c0 * v0) / gesamtVolumen;
    const cBase = (cTitrant * vb) / gesamtVolumen;

    const h = stark
      ? loeseLadungsbilanz(0, 1, cBase, cSaeure)
      : loeseLadungsbilanz(cSaeure, ks, cBase, 0);

    kurve.push({ volumen: vb, ph: phAus(h) });
  }

  // Äquivalenzpunkt: Dort ist genau so viel Base zugegeben, wie Säure
  // vorgelegt war. Er liegt NICHT bei pH 7, außer bei starker Säure mit
  // starker Base — bei einer schwachen Säure entsteht dort die
  // korrespondierende Base, und die reagiert basisch.
  const vAequivalenz = (c0 * v0) / cTitrant;
  const phAequivalenz = werteBei(kurve, vAequivalenz);

  // Halbäquivalenzpunkt: Hier liegt die Hälfte der Säure als Base vor,
  // das Verhältnis ist 1:1 — nach Henderson-Hasselbalch ist der pH dort
  // gleich dem pKs. Das ist die übliche Methode, einen pKs-Wert zu
  // bestimmen.
  const vHalb = vAequivalenz / 2;

  return {
    kurve,
    vAequivalenz,
    phAequivalenz,
    vHalb,
    phHalb: werteBei(kurve, vHalb),
  };
}

// Linear zwischen den berechneten Punkten interpolieren.
function werteBei(kurve, volumen) {
  if (volumen <= kurve[0].volumen) {
    return kurve[0].ph;
  }
  for (let i = 1; i < kurve.length; i++) {
    if (kurve[i].volumen >= volumen) {
      const a = kurve[i - 1];
      const b = kurve[i];
      const anteil = (volumen - a.volumen) / (b.volumen - a.volumen);
      return a.ph + anteil * (b.ph - a.ph);
    }
  }
  return kurve[kurve.length - 1].ph;
}

// ---------------------------------------------------------------------
// Indikatoren
// ---------------------------------------------------------------------
//
// Ein Indikator ist selbst eine schwache Säure, deren Säure- und
// Basenform verschiedene Farben haben. Er schlägt dort um, wo sein
// eigener pKs liegt.

export const INDIKATOREN = [
  { name: 'Methylorange', von: 3.1, bis: 4.4, farbeSauer: '#d03b3b', farbeBasisch: '#eda100' },
  { name: 'Bromthymolblau', von: 6.0, bis: 7.6, farbeSauer: '#eda100', farbeBasisch: '#2a78d6' },
  { name: 'Lackmus', von: 5.0, bis: 8.0, farbeSauer: '#d03b3b', farbeBasisch: '#2a78d6' },
  { name: 'Phenolphthalein', von: 8.2, bis: 10.0, farbeSauer: '#f0efec', farbeBasisch: '#e87ba4' },
];

// Welcher Indikator passt zu einem Äquivalenzpunkt? Sein Umschlags-
// bereich muss im steilen Teil der Kurve liegen, also möglichst dicht
// am Äquivalenzpunkt.
export function passenderIndikator(phAequivalenz) {
  return INDIKATOREN.reduce((bester, kandidat) => {
    const mitte = (kandidat.von + kandidat.bis) / 2;
    const besteMitte = (bester.von + bester.bis) / 2;
    return Math.abs(mitte - phAequivalenz) < Math.abs(besteMitte - phAequivalenz)
      ? kandidat
      : bester;
  });
}
