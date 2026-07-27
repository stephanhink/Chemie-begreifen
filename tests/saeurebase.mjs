// Prüft pH-Rechnung, Puffer und Titration gegen Tafelwerkwerte.
import { pruefung, wahr, zahl, gleich } from './pruefer.mjs';
import {
  phSaeure, phBase, phPuffer, titrationskurve, passenderIndikator,
} from '../utils/saeurebase.js';

pruefung('Säuren und Basen', () => {
  zahl('0,1 M Salzsäure', phSaeure(0.1, -6, true).genau, 1.0, 0.01);
  zahl('0,001 M Salzsäure', phSaeure(0.001, -6, true).genau, 3.0, 0.01);
  zahl('0,1 M Natronlauge', phBase(0.1, -1, true).genau, 13.0, 0.01);

  // Der Lehrbuchfall: Bei starker Verdünnung liefert die Schulformel
  // pH 8 — eine Säure kann aber niemals basisch werden.
  const duenn = phSaeure(1e-8, -6, true);
  zahl('10⁻⁸ M Salzsäure exakt', duenn.genau, 6.98, 0.02);
  zahl('Schulformel läge daneben', duenn.naeherung, 8.0, 0.01);
  wahr('Näherung wird als ungültig erkannt', !duenn.gueltig);
  wahr('bleibt sauer', duenn.genau < 7);

  const essig = phSaeure(0.1, 4.75, false);
  zahl('0,1 M Essigsäure', essig.genau, 2.88, 0.02);
  wahr('Näherung trägt hier', essig.gueltig);
  wahr('Protolysegrad klein', essig.protolysegrad < 0.05);

  const duenneEssig = phSaeure(0.001, 4.75, false);
  zahl('0,001 M Essigsäure', duenneEssig.genau, 3.9, 0.03);
  wahr('Näherung trägt hier nicht mehr', !duenneEssig.gueltig);

  zahl('0,1 M Ammoniak', phBase(0.1, 4.75, false).genau, 11.12, 0.03);

  // Ionenprodukt: c(H3O+) · c(OH-) muss immer 10^-14 sein
  for (const c of [0.1, 0.001, 1e-8]) {
    const r = phSaeure(c, -6, true);
    zahl(`Ionenprodukt bei c=${c}`, r.konzentrationH * r.konzentrationOH, 1e-14, 1e-16);
  }

  zahl('Puffer 1:1 ergibt den pKs', phPuffer(0.1, 0.1, 4.75).ph, 4.75, 1e-9);
  wahr('1:10 liegt noch im Pufferbereich', phPuffer(0.1, 0.01, 4.75).imPufferbereich);
  wahr('1:100 liegt außerhalb', !phPuffer(0.1, 0.001, 4.75).imPufferbereich);

  const stark = titrationskurve({ c0: 0.1, v0: 50, pks: -6, stark: true, cTitrant: 0.1, bisMl: 100 });
  zahl('stark/stark: Äquivalenzpunkt bei pH 7', stark.phAequivalenz, 7.0, 0.1);
  zahl('stark/stark: Äquivalenzvolumen', stark.vAequivalenz, 50, 1e-9);

  const schwach = titrationskurve({ c0: 0.1, v0: 50, pks: 4.75, stark: false, cTitrant: 0.1, bisMl: 100 });
  zahl('schwach/stark: Äquivalenzpunkt basisch', schwach.phAequivalenz, 8.72, 0.1);
  wahr('Äquivalenzpunkt liegt NICHT bei 7', schwach.phAequivalenz > 8);
  zahl('Halbäquivalenzpunkt ist der pKs', schwach.phHalb, 4.75, 0.05);

  let steigend = true;
  for (let i = 1; i < schwach.kurve.length; i++) {
    if (schwach.kurve[i].ph < schwach.kurve[i - 1].ph - 1e-9) steigend = false;
  }
  wahr('Titrationskurve steigt durchgehend', steigend);

  gleich('Indikator für pH 8,7', passenderIndikator(8.72).name, 'Phenolphthalein');
  gleich('Indikator für pH 7', passenderIndikator(7).name, 'Bromthymolblau');
});
