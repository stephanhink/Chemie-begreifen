// Prüft die Salzbildung: Stimmen Ladungs- und Atombilanz für JEDES
// herleitbare Metall-Nichtmetall-Paar?
import { pruefung, wahr, zahl, gleich } from './pruefer.mjs';
import { reagiere, alleSalzPaare, ladungsZeichen } from '../utils/ionen.js';
import { elementNachSymbol } from '../utils/elemente.js';

const TIEF = { '₀': 0, '₁': 1, '₂': 2, '₃': 3, '₄': 4, '₅': 5, '₆': 6, '₇': 7, '₈': 8, '₉': 9 };

function atome(term) {
  const m = term.trim().match(/^(\d+)?\s*(.*)$/);
  const koeff = m[1] ? Number(m[1]) : 1;
  const zaehler = {};
  for (const t of m[2].matchAll(/([A-Z][a-z]?)([₀-₉]*)/g)) {
    if (!t[1]) continue;
    const index = t[2] ? Number([...t[2]].map((c) => TIEF[c]).join('')) : 1;
    zaehler[t[1]] = (zaehler[t[1]] || 0) + koeff * index;
  }
  return zaehler;
}

const ggT = (a, b) => (b ? ggT(b, a % b) : a);

pruefung('Salzbildung', () => {
  const paare = alleSalzPaare();
  wahr('es gibt herleitbare Paare', paare.length > 250, `${paare.length} Paare`);

  for (const [metall, nichtmetall] of paare) {
    const r = reagiere(metall, nichtmetall);
    gleich(`${metall.sym}+${nichtmetall.sym}: ergibt ein Salz`, r.art, 'salz');
    if (r.art !== 'salz') continue;

    // Die Reihenfolge der beiden Elemente darf nichts ändern
    const rueck = reagiere(nichtmetall, metall);
    gleich(
      `${metall.sym}+${nichtmetall.sym}: reihenfolgeunabhängig`,
      rueck.ergebnisse[0].formel,
      r.ergebnisse[0].formel
    );

    for (const salz of r.ergebnisse) {
      zahl(
        `${salz.formel}: Ladungsbilanz null`,
        salz.anzahlKation * salz.kationLadung + salz.anzahlAnion * salz.anionLadung,
        0
      );
      zahl(`${salz.formel}: kleinstes Verhältnis`, ggT(salz.anzahlKation, salz.anzahlAnion), 1);

      const [links, rechts] = salz.gleichung.split('→');
      const l = {};
      for (const teil of links.split('+')) {
        const a = atome(teil);
        for (const k in a) l[k] = (l[k] || 0) + a[k];
      }
      const rt = atome(rechts);
      for (const sym of new Set([...Object.keys(l), ...Object.keys(rt)])) {
        zahl(`${salz.gleichung}: ${sym} ausgeglichen`, l[sym] || 0, rt[sym] || 0);
      }
    }
  }

  // Stichproben gegen bekannte Gleichungen
  const probe = (a, b, i) => reagiere(elementNachSymbol(a), elementNachSymbol(b)).ergebnisse[i || 0];
  gleich('Natrium + Chlor', probe('Na', 'Cl').gleichung, '2 Na + Cl₂ → 2 NaCl');
  gleich('Aluminium + Sauerstoff', probe('Al', 'O').gleichung, '4 Al + 3 O₂ → 2 Al₂O₃');
  gleich('Magnesium + Stickstoff', probe('Mg', 'N').gleichung, '3 Mg + N₂ → Mg₃N₂');
  gleich('Eisen(II)-oxid', probe('Fe', 'O', 0).name, 'Eisen(II)-oxid');
  gleich('Eisen(III)-oxid', probe('Fe', 'O', 1).name, 'Eisen(III)-oxid');
  gleich('Ionenladung dreifach', ladungsZeichen(3), '³⁺');
  gleich('Ionenladung einfach', ladungsZeichen(-1), '⁻');

  // Was sich nicht herleiten lässt, muss abgelehnt werden
  const nein = (a, b) => reagiere(elementNachSymbol(a), elementNachSymbol(b)).art;
  gleich('zwei Metalle', nein('Na', 'K'), 'keineReaktion');
  gleich('zwei Nichtmetalle', nein('C', 'O'), 'nichtHerleitbar');
  gleich('Edelgas', nein('He', 'Na'), 'keineReaktion');
  gleich('Element mit sich selbst', nein('Na', 'Na'), 'keineReaktion');
});
