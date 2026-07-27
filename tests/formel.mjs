// Prüft den Formelparser — die Grundlage aller Bilanzrechnungen.
import { pruefung, wahr, zahl, gleich, wirft } from './pruefer.mjs';
import { parseFormel, formatiereFormel } from '../utils/formel.js';

pruefung('Formelparser', () => {
  const faelle = [
    ['H2O', { H: 2, O: 1 }],
    ['Ca(OH)2', { Ca: 1, O: 2, H: 2 }],
    ['CuSO4*5H2O', { Cu: 1, S: 1, O: 9, H: 10 }],
    ['C6H12O6', { C: 6, H: 12, O: 6 }],
    ['CH3COOC2H5', { C: 4, H: 8, O: 2 }],
    ['Al2(SO4)3', { Al: 2, S: 3, O: 12 }],
    ['Fe', { Fe: 1 }],
  ];
  for (const [formel, soll] of faelle) {
    const ist = parseFormel(formel);
    for (const [sym, anzahl] of Object.entries(soll)) {
      zahl(`${formel}: ${sym}`, ist[sym], anzahl);
    }
    zahl(`${formel}: keine zusätzlichen Elemente`, Object.keys(ist).length, Object.keys(soll).length);
  }

  // Ungültiges muss abgelehnt werden, nicht stillschweigend etwas
  // Falsches liefern — ein leeres Ergebnis wäre in jeder Folgerechnung
  // unsichtbar.
  wirft('offene Klammer "H2(O"', () => parseFormel('H2(O'));
  wirft('überzählige Klammer "H2O)"', () => parseFormel('H2O)'));
  wirft('Kleinbuchstabe am Anfang "h2o"', () => parseFormel('h2o'));
  wirft('nackte Zahl "2"', () => parseFormel('2'));
  wirft('leere Formel', () => parseFormel(''));

  gleich('Tiefstellung H2O', formatiereFormel('H2O'), 'H₂O');
  gleich('Tiefstellung Ca(OH)2', formatiereFormel('Ca(OH)2'), 'Ca(OH)₂');
  gleich('Kristallwasser', formatiereFormel('CuSO4*5H2O'), 'CuSO₄ · 5 H₂O');
});
