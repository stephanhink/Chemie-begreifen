// Prüft die kuratierte Reaktionsbibliothek. Hier zählt vor allem eines:
// Jede Gleichung muss ausgeglichen sein. Eine unausgeglichene Gleichung
// in einer Lern-App wäre schlimmer als gar keine.
import { pruefung, wahr, zahl, gleich } from './pruefer.mjs';
import {
  REAKTIONEN, REAKTIONSTYPEN, bilanz, gleichungText, findeReaktionen,
} from '../utils/reaktionen.js';
import { parseFormel, formatiereFormel } from '../utils/formel.js';
import { elementNachSymbol } from '../utils/elemente.js';

const ggT = (a, b) => (b ? ggT(b, a % b) : a);

pruefung('Reaktionsbibliothek', () => {
  wahr('Sammlung ist gefüllt', REAKTIONEN.length >= 20, `${REAKTIONEN.length} Reaktionen`);

  const ids = new Set();
  for (const r of REAKTIONEN) {
    wahr(`${r.id}: eindeutige Kennung`, !ids.has(r.id));
    ids.add(r.id);
    wahr(`${r.id}: bekannter Reaktionstyp`, Boolean(REAKTIONSTYPEN[r.typ]), r.typ);
    wahr(`${r.id}: hat Erklärtext`, Array.isArray(r.text) && r.text.length > 0);
    wahr(`${r.id}: nennt Bedingungen`, Boolean(r.bedingungen));

    for (const { formel } of [...r.edukte, ...r.produkte]) {
      for (const sym of Object.keys(parseFormel(formel))) {
        wahr(`${r.id}: "${sym}" in ${formel} ist ein Element`, Boolean(elementNachSymbol(sym)));
      }
    }

    const { links, rechts } = bilanz(r);
    for (const sym of new Set([...Object.keys(links), ...Object.keys(rechts)])) {
      zahl(
        `${gleichungText(r, formatiereFormel)}: ${sym}`,
        links[sym] || 0,
        rechts[sym] || 0
      );
    }

    const koeffizienten = [...r.edukte, ...r.produkte].map((s) => s.koeff);
    zahl(`${r.id}: Koeffizienten nicht kürzbar`, koeffizienten.reduce(ggT), 1);
  }

  // Das Labor muss die richtigen Reaktionen zu einem Elementpaar finden
  const namen = (...syms) => findeReaktionen(syms).map((r) => r.id);
  wahr('H+O findet Knallgas zuerst', namen('H', 'O')[0] === 'knallgas', namen('H', 'O').join(','));
  wahr('C+O findet beide Verbrennungen', namen('C', 'O').length === 2, namen('C', 'O').join(','));
  wahr('N+H findet Haber-Bosch', namen('N', 'H').includes('haberBosch'));
  zahl('Na+O findet nichts', findeReaktionen(['Na', 'O']).length, 0);
});
