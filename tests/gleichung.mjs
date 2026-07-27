// Prüft den Gleichungsausgleicher.
import { pruefung, wahr, zahl, gleich, wirft } from './pruefer.mjs';
import { gleicheAus, gleichungAlsText, atombilanz } from '../utils/gleichung.js';

pruefung('Gleichungen ausgleichen', () => {
  const faelle = [
    ['Fe + O2 -> Fe2O3', '4 Fe + 3 O2 → 2 Fe2O3'],
    ['H2 + O2 -> H2O', '2 H2 + O2 → 2 H2O'],
    ['C6H12O6 + O2 -> CO2 + H2O', 'C6H12O6 + 6 O2 → 6 CO2 + 6 H2O'],
    ['CH4 + O2 -> CO2 + H2O', 'CH4 + 2 O2 → CO2 + 2 H2O'],
    ['Al + HCl -> AlCl3 + H2', '2 Al + 6 HCl → 2 AlCl3 + 3 H2'],
    ['KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2',
     '2 KMnO4 + 16 HCl → 2 KCl + 2 MnCl2 + 8 H2O + 5 Cl2'],
    ['Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O', '3 Ca(OH)2 + 2 H3PO4 → Ca3(PO4)2 + 6 H2O'],
    ['NH3 + O2 -> NO + H2O', '4 NH3 + 5 O2 → 4 NO + 6 H2O'],
    ['Fe2O3 + CO -> Fe + CO2', 'Fe2O3 + 3 CO → 2 Fe + 3 CO2'],
    ['C2H5OH + O2 -> CO2 + H2O', 'C2H5OH + 3 O2 → 2 CO2 + 3 H2O'],
  ];

  for (const [eingabe, erwartet] of faelle) {
    const r = gleicheAus(eingabe);
    gleich(`"${eingabe}"`, gleichungAlsText(r), erwartet);
    // Unabhängig vom erwarteten Text muss die Bilanz stimmen
    for (const zeile of atombilanz(r)) {
      zahl(`${erwartet}: ${zeile.symbol}`, zeile.links, zeile.rechts);
    }
  }

  wirft('ohne Pfeil', () => gleicheAus('Fe + O2'));
  wirft('zwei Pfeile', () => gleicheAus('H2 + O2 -> H2O -> X'));
  wirft('Element nur rechts', () => gleicheAus('Fe -> Cu'));
  wirft('erfundenes Element', () => gleicheAus('Xx + O2 -> XxO'));
  wirft('links wie rechts', () => gleicheAus('H2O -> H2O'));
  wirft('leere Seite', () => gleicheAus('-> H2O'));
});
