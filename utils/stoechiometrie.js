// Das Rechenhandwerk der Chemie: von der Summenformel zur Masse und
// zurück.
//
// Alles hier stützt sich auf zwei Bausteine, die schon da sind: den
// Formelparser aus utils/formel.js und die molaren Massen aus
// utils/elemente.js. Kein React, reines JavaScript.

import { parseFormel } from './formel';
import { elementNachSymbol } from './elemente';
import { AVOGADRO, MOLVOLUMEN_NORM } from './konstanten';

// Molare Masse einer Verbindung in g/mol.
//
//   molareMasse('H2SO4') → 98.076
//
// Wirft, wenn ein Symbol kein Element ist — eine erfundene molare Masse
// wäre in jeder Folgerechnung unsichtbar falsch.
export function molareMasse(formel) {
  const atome = parseFormel(formel);
  let summe = 0;
  for (const [symbol, anzahl] of Object.entries(atome)) {
    const element = elementNachSymbol(symbol);
    if (!element) {
      throw new Error(`"${symbol}" ist kein Element`);
    }
    summe += element.masse * anzahl;
  }
  return summe;
}

// Die Rechnung aufgeschlüsselt — damit man sie nachvollziehen kann,
// statt nur ein Ergebnis zu bekommen.
//
// Gibt je Element zurück: Anzahl der Atome, molare Masse des Elements,
// deren Beitrag zur Gesamtmasse und der Massenanteil in Prozent.
export function zusammensetzung(formel) {
  const atome = parseFormel(formel);
  const gesamt = molareMasse(formel);

  return Object.entries(atome)
    .map(([symbol, anzahl]) => {
      const element = elementNachSymbol(symbol);
      const beitrag = element.masse * anzahl;
      return {
        symbol,
        name: element.name,
        anzahl,
        molareMasse: element.masse,
        beitrag,
        anteil: (beitrag / gesamt) * 100,
      };
    })
    // Größter Massenanteil zuerst — das beantwortet die Frage, woraus
    // ein Stoff hauptsächlich besteht, auf den ersten Blick.
    .sort((a, b) => b.beitrag - a.beitrag);
}

// ---------------------------------------------------------------------
// Umrechnungen zwischen Masse, Stoffmenge, Teilchenzahl und Gasvolumen
// ---------------------------------------------------------------------
//
// Alle vier Größen hängen über die Stoffmenge n zusammen. Deshalb
// rechnet diese Funktion immer erst auf n um und von dort auf alles
// andere — statt zwölf einzelne Umrechnungen zu pflegen.
//
//   groesse   'masse' | 'stoffmenge' | 'teilchen' | 'volumen'
//   wert      Zahlenwert in g, mol, Stück bzw. Liter
//
// Das Gasvolumen gilt nur für Gase und nur bei Normbedingungen
// (0 °C, 1013 hPa). Bei Feststoffen ist es sinnlos — der Screen blendet
// es dort aus.
export function rechneUm(formel, groesse, wert) {
  const M = molareMasse(formel);

  let n;
  switch (groesse) {
    case 'masse':
      n = wert / M;
      break;
    case 'stoffmenge':
      n = wert;
      break;
    case 'teilchen':
      n = wert / AVOGADRO;
      break;
    case 'volumen':
      n = wert / MOLVOLUMEN_NORM;
      break;
    default:
      throw new Error(`Unbekannte Größe "${groesse}"`);
  }

  return {
    molareMasse: M,
    stoffmenge: n,
    masse: n * M,
    teilchen: n * AVOGADRO,
    volumen: n * MOLVOLUMEN_NORM,
  };
}

// ---------------------------------------------------------------------
// Konzentration
// ---------------------------------------------------------------------

// Stoffmengenkonzentration c = n / V, mit V in Litern.
export function konzentration(stoffmenge, volumenLiter) {
  return stoffmenge / volumenLiter;
}

// Verdünnung: Beim Verdünnen ändert sich das Volumen, die Stoffmenge
// aber nicht. Daraus folgt c₁ · V₁ = c₂ · V₂.
//
// Gibt zurück, auf welches Volumen man auffüllen muss.
export function verduennungsVolumen(c1, v1, c2) {
  return (c1 * v1) / c2;
}

// ---------------------------------------------------------------------
// Zahlen fürs Anzeigen
// ---------------------------------------------------------------------

// Formatiert eine Zahl deutsch und mit sinnvoller Genauigkeit.
// Sehr große und sehr kleine Werte kommen in Zehnerpotenzschreibweise —
// "602214076000000000000000" liest niemand.
export function formatiereZahl(wert, nachkommastellen = 3) {
  if (!Number.isFinite(wert)) {
    return '—';
  }
  if (wert !== 0 && (Math.abs(wert) >= 1e5 || Math.abs(wert) < 1e-3)) {
    const exponent = Math.floor(Math.log10(Math.abs(wert)));
    const mantisse = wert / Math.pow(10, exponent);
    return `${mantisse.toLocaleString('de-DE', {
      maximumFractionDigits: 3,
    })} · 10${hochgestellt(exponent)}`;
  }
  return wert.toLocaleString('de-DE', {
    maximumFractionDigits: nachkommastellen,
  });
}

const HOCH = {
  0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴',
  5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻',
};

function hochgestellt(zahl) {
  return String(zahl)
    .split('')
    .map((z) => HOCH[z] ?? z)
    .join('');
}
