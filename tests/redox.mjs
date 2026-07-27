// Prüft Oxidationszahlen, Spannungsreihe, Nernst und Faraday.
import { pruefung, wahr, zahl, gleich } from './pruefer.mjs';
import {
  oxidationszahlen, roemisch, analysiereRedox, zellspannung, nernst,
  elektrolyse, HALBZELLEN,
} from '../utils/redox.js';
import { gleicheAus } from '../utils/gleichung.js';

pruefung('Redox', () => {
  // Die Fälle, an denen sich zeigt, ob die Rangfolge der Regeln stimmt
  const faelle = [
    ['O2', 0, { O: 0 }],
    ['Fe', 0, { Fe: 0 }],
    ['H2O', 0, { H: 1, O: -2 }],
    ['H2O2', 0, { H: 1, O: -1 }],       // Peroxid: NICHT −II
    ['NaH', 0, { Na: 1, H: -1 }],       // Hydrid: NICHT +I
    ['NaOH', 0, { Na: 1, O: -2, H: 1 }], // hier aber doch +I
    ['OF2', 0, { O: 2, F: -1 }],        // Sauerstoff positiv
    ['H2SO4', 0, { H: 1, S: 6, O: -2 }],
    ['KMnO4', 0, { K: 1, Mn: 7, O: -2 }],
    ['NH3', 0, { N: -3, H: 1 }],
    ['CH4', 0, { C: -4, H: 1 }],
    ['C2H4O2', 0, { C: 0, H: 1, O: -2 }], // Essigsäure: C im Mittel 0
    ['Fe3O4', 0, { Fe: 8 / 3, O: -2 }],   // gebrochener Mittelwert
    ['Cr2O7', -2, { Cr: 6, O: -2 }],
    ['SO4', -2, { S: 6, O: -2 }],
    ['NO3', -1, { N: 5, O: -2 }],
    ['Fe', 3, { Fe: 3 }],
  ];
  for (const [formel, ladung, soll] of faelle) {
    const r = oxidationszahlen(formel, ladung);
    wahr(`${formel}: bestimmbar`, !r.fehler, r.fehler);
    if (r.fehler) continue;
    for (const [sym, wert] of Object.entries(soll)) {
      zahl(`${formel}: ${sym}`, r.zahlen[sym], wert, 1e-9);
    }
    wahr(`${formel}: Herleitung dokumentiert`, r.schritte.length > 0);
  }

  // Was nicht eindeutig ist, muss abgelehnt werden
  wahr('CuSO4 wird abgelehnt', Boolean(oxidationszahlen('CuSO4').fehler));

  gleich('römisch positiv', roemisch(7), '+VII');
  gleich('römisch negativ', roemisch(-2), '−II');
  gleich('römisch null', roemisch(0), '0');
  gleich('gebrochen', roemisch(8 / 3), '+8/3');

  const a = analysiereRedox(gleicheAus('Fe2O3 + CO -> Fe + CO2'));
  wahr('Hochofen ist eine Redoxreaktion', a.istRedox);
  const fe = a.aenderungen.find((c) => c.symbol === 'Fe');
  gleich('Eisen wird reduziert', fe.art, 'reduktion');
  zahl('Eisen von +III', fe.von, 3);
  zahl('Eisen auf 0', fe.nach, 0);
  const c = a.aenderungen.find((x) => x.symbol === 'C');
  gleich('Kohlenstoff wird oxidiert', c.art, 'oxidation');

  // Ein Element darf in mehreren Produkten stehen, solange der Wert gleich ist
  const methan = analysiereRedox(gleicheAus('CH4 + O2 -> CO2 + H2O'));
  wahr('Methanverbrennung erkennt auch den Sauerstoff',
    methan.aenderungen.some((x) => x.symbol === 'O'));

  const zn = HALBZELLEN.find((h) => h.red === 'Zn');
  const cu = HALBZELLEN.find((h) => h.red === 'Cu');
  const zelle = zellspannung(zn, cu);
  zahl('Daniell-Element', zelle.spannung, 1.1, 0.01);
  gleich('Kupfer ist der Pluspol', zelle.kathode.red, 'Cu');
  gleich('Zink ist der Minuspol', zelle.anode.red, 'Zn');

  zahl('bei c=1 gilt E = E°', nernst(0.34, 2, 1, 1).genau, 0.34, 1e-9);
  const n = nernst(0.34, 2, 0.001, 1);
  zahl('die Konstante bei 25 °C', n.faktorBei25, 0.0592, 0.0002);
  wahr('Verdünnung senkt das Potential', n.genau < 0.34);
  const heiss = nernst(0.34, 2, 0.001, 1, 80);
  wahr('bei 80 °C weicht die Schulformel ab', Math.abs(heiss.abweichung) > 0.01,
    `${(heiss.abweichung * 1000).toFixed(1)} mV`);

  const e = elektrolyse({ stromstaerke: 1, sekunden: 3600, z: 2, molareMasse: 63.546 });
  zahl('1 A über 1 h: Ladung', e.ladung, 3600);
  zahl('1 A über 1 h: Kupfer', e.masse, 1.185, 0.01);
});
