// Prüft Nomenklatur, Summenformeln und Halbstrukturformeln.
import { pruefung, wahr, zahl, gleich } from './pruefer.mjs';
import { verbindung, skelett, STOFFKLASSEN, ALKAN_ISOMERE } from '../utils/organik.js';
import { parseFormel } from '../utils/formel.js';

pruefung('Organik', () => {
  const faelle = [
    ['alkan', 1, 'Methan', 'CH4', 16.043],
    ['alkan', 2, 'Ethan', 'C2H6', 30.07],
    ['alkan', 8, 'Octan', 'C8H18', 114.23],
    ['alken', 2, 'Ethen', 'C2H4', 28.054],
    ['alkin', 2, 'Ethin', 'C2H2', 26.038],
    ['alkohol', 2, 'Ethanol', 'C2H6O', 46.069],
    ['aldehyd', 2, 'Ethanal', 'C2H4O', 44.053],
    ['keton', 3, 'Propanon', 'C3H6O', 58.08],
    ['carbonsaeure', 2, 'Ethansäure', 'C2H4O2', 60.052],
    ['amin', 1, 'Methanamin', 'CH5N', 31.058],
    ['halogenalkan', 1, 'Chlormethan', 'CH3Cl', 50.49],
  ];
  for (const [klasse, n, name, formel, masse] of faelle) {
    const v = verbindung(klasse, n);
    wahr(`${klasse}/${n}: baubar`, !v.fehler, v.fehler);
    if (v.fehler) continue;
    gleich(`${klasse}/${n}: Name`, v.name, name);
    gleich(`${klasse}/${n}: Summenformel`, v.summenformel, formel);
    zahl(`${klasse}/${n}: molare Masse`, v.molareMasse, masse, 0.05);
  }

  // Die Halbstrukturformel muss genauso viele C-Atome zeigen wie die
  // Summenformel nennt. Genau hier fiel auf, dass Ethen als CH₂=CH₃
  // ausgegeben wurde — ein Kohlenstoff mit fünf Bindungen.
  for (const klasse of STOFFKLASSEN) {
    for (let n = klasse.minC; n <= 8; n++) {
      const v = verbindung(klasse.key, n);
      if (v.fehler) continue;
      const soll = parseFormel(v.summenformel).C;
      const ist = (v.halbstruktur.match(/C(?![a-z])/g) || []).length;
      zahl(`${v.name}: C-Atome in "${v.halbstruktur}"`, ist, soll);
    }
  }

  gleich('Ethen', verbindung('alken', 2).halbstruktur, 'CH₂=CH₂');
  gleich('Ethin', verbindung('alkin', 2).halbstruktur, 'CH≡CH');
  gleich('Propen', verbindung('alken', 3).halbstruktur, 'CH₂=CH–CH₃');
  gleich('Propanol', verbindung('alkohol', 3).halbstruktur, 'CH₃–CH₂–CH₂–OH');
  gleich('Propanon', verbindung('keton', 3).halbstruktur, 'CH₃–CO–CH₃');
  gleich('Ameisensäure als Trivialname', verbindung('carbonsaeure', 1).trivialname, 'Ameisensäure');

  wahr('Keton mit 2 C wird abgelehnt', Boolean(verbindung('keton', 2).fehler));
  wahr('Alken mit 1 C wird abgelehnt', Boolean(verbindung('alken', 1).fehler));
  wahr('zu lange Kette wird abgelehnt', Boolean(verbindung('alkan', 20).fehler));

  const s = skelett('carbonsaeure', 3);
  zahl('Propansäure: Knicke', s.punkte.length, 3);
  zahl('Propansäure: Bindungen', s.bindungen.length, 2);
  zahl('Propansäure: Anhänge', s.anhaenge.length, 2);
  gleich('Buten hat eine Doppelbindung', skelett('alken', 4).bindungen[0].art, 'doppel');
  gleich('Butin hat eine Dreifachbindung', skelett('alkin', 4).bindungen[0].art, 'dreifach');

  zahl('Butan hat 2 Isomere', ALKAN_ISOMERE[3], 2);
  zahl('Decan hat 75 Isomere', ALKAN_ISOMERE[9], 75);
});
