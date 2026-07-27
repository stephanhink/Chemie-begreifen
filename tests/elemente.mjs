// Prüft die Elementdaten: Sind die Elektronenkonfigurationen mit den
// Ordnungszahlen verträglich, ist das Gitter widerspruchsfrei?
import { pruefung, wahr, zahl, gleich } from './pruefer.mjs';
import {
  ELEMENTE, KATEGORIEN, STOFFKLASSEN, elektronenSchalen,
  formatiereKonfiguration, stoffklasseVon, sucheElemente,
} from '../utils/elemente.js';

pruefung('Elementdaten', () => {
  zahl('Anzahl der Elemente', ELEMENTE.length, 118);

  ELEMENTE.forEach((el, i) => {
    wahr(`Ordnungszahl lückenlos an Position ${i}`, el.z === i + 1, `z=${el.z}`);

    // Die eigentliche Prüfung: Die Konfiguration muss genau so viele
    // Elektronen ergeben, wie das Atom Protonen hat. Ein Zahlendreher
    // in "[Ar] 3d6 4s2" fällt hier sofort auf.
    const summe = elektronenSchalen(el).reduce((a, b) => a + b, 0);
    zahl(`${el.sym}: Elektronen aus "${el.konfig}"`, summe, el.z);

    wahr(`${el.sym}: Kategorie bekannt`, Boolean(KATEGORIEN[el.kategorie]), el.kategorie);
    wahr(`${el.sym}: Stoffklasse zugeordnet`, Boolean(STOFFKLASSEN[stoffklasseVon(el)]));
    wahr(`${el.sym}: Gruppe plausibel`, el.gruppe === null || (el.gruppe >= 1 && el.gruppe <= 18));
    wahr(`${el.sym}: Periode plausibel`, el.periode >= 1 && el.periode <= 7);
    wahr(`${el.sym}: molare Masse plausibel`, el.masse > 0 && el.masse < 300, String(el.masse));
    wahr(`${el.sym}: Elektronegativität plausibel`, el.en === null || (el.en >= 0.5 && el.en <= 4));
    wahr(`${el.sym}: ohne Gruppe nur im f-Block`, el.gruppe !== null || el.block === 'f');
  });

  const symbole = new Set();
  const namen = new Set();
  for (const el of ELEMENTE) {
    wahr(`Symbol ${el.sym} eindeutig`, !symbole.has(el.sym));
    wahr(`Name ${el.name} eindeutig`, !namen.has(el.name));
    symbole.add(el.sym);
    namen.add(el.name);
  }

  // Kein Gitterplatz darf doppelt belegt sein
  const platz = new Map();
  for (const el of ELEMENTE.filter((e) => e.gruppe !== null)) {
    const k = `${el.gruppe}/${el.periode}`;
    wahr(`Gitterplatz ${k} nur einmal belegt`, !platz.has(k), `${platz.get(k)} und ${el.sym}`);
    platz.set(k, el.sym);
  }

  zahl('Lanthanoide', ELEMENTE.filter((e) => e.kategorie === 'lanthanoid').length, 15);
  zahl('Actinoide', ELEMENTE.filter((e) => e.kategorie === 'actinoid').length, 15);

  // Stichproben gegen bekannte Schalenbesetzungen
  gleich('Eisen: Schalen', elektronenSchalen(ELEMENTE[25]).join('-'), '2-8-14-2');
  gleich('Gold: Schalen', elektronenSchalen(ELEMENTE[78]).join('-'), '2-8-18-32-18-1');
  gleich('Konfiguration formatiert', formatiereKonfiguration('[Ar] 3d6 4s2'), '[Ar] 3d⁶ 4s²');

  gleich('Suche "eisen"', sucheElemente('eisen')[0].sym, 'Fe');
  gleich('Suche "26"', sucheElemente('26')[0].sym, 'Fe');
  gleich('Suche "Fe"', sucheElemente('Fe')[0].sym, 'Fe');
  zahl('Suche ohne Treffer', sucheElemente('Xyz').length, 0);
});
