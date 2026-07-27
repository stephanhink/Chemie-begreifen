// Prüft, dass kein Info-Knopf ins Leere zeigt.
//
// Diese Prüfung liest den Quelltext der Screens und Komponenten, statt
// sie auszuführen — dafür bräuchte es React. Gesucht wird nach
// thema="..." und den thema-Feldern der Datentabellen.
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pruefung, wahr, zahl } from './pruefer.mjs';
import { THEMEN } from '../utils/wissen.js';
import { KATEGORIEN, STOFFKLASSEN } from '../utils/elemente.js';
import { REAKTIONEN } from '../utils/reaktionen.js';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');

pruefung('Wissenstexte', () => {
  const ids = new Set(Object.keys(THEMEN));
  const benutzt = new Set();

  for (const [id, t] of Object.entries(THEMEN)) {
    wahr(`${id}: hat Titel`, Boolean(t.titel));
    wahr(`${id}: hat Text`, Array.isArray(t.text) && t.text.length > 0);
    for (const ziel of t.mehr || []) {
      wahr(`${id}: Querverweis "${ziel}" existiert`, ids.has(ziel));
    }
  }

  for (const r of REAKTIONEN) {
    for (const ziel of r.mehr || []) {
      benutzt.add(ziel);
      wahr(`Reaktion ${r.id}: Verweis "${ziel}" existiert`, ids.has(ziel));
    }
  }

  for (const ordner of ['screens', 'components']) {
    for (const datei of readdirSync(join(wurzel, ordner))) {
      const quelle = readFileSync(join(wurzel, ordner, datei), 'utf8');
      for (const treffer of quelle.matchAll(/thema="([A-Za-z]+)"/g)) {
        benutzt.add(treffer[1]);
        wahr(`${ordner}/${datei}: thema="${treffer[1]}" hat einen Eintrag`, ids.has(treffer[1]));
      }
    }
  }

  for (const [name, tabelle] of [['KATEGORIEN', KATEGORIEN], ['STOFFKLASSEN', STOFFKLASSEN]]) {
    for (const [schluessel, wert] of Object.entries(tabelle)) {
      if (!wert.thema) continue;
      benutzt.add(wert.thema);
      wahr(`${name}.${schluessel}: "${wert.thema}" hat einen Eintrag`, ids.has(wert.thema));
    }
  }

  const ionenQuelle = readFileSync(join(wurzel, 'utils', 'ionen.js'), 'utf8');
  for (const treffer of ionenQuelle.matchAll(/thema: '([A-Za-z]+)'/g)) {
    benutzt.add(treffer[1]);
    wahr(`ionen.js: "${treffer[1]}" hat einen Eintrag`, ids.has(treffer[1]));
  }

  // Andersherum: Ein Text, den niemand erreichen kann, ist tote Arbeit.
  const verwaist = [...ids].filter((id) => !benutzt.has(id));
  wahr('kein Thema ohne Info-Knopf', verwaist.length === 0, verwaist.join(', '));

  zahl('Themen insgesamt', ids.size, ids.size);
});
