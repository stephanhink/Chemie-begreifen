// Prüft molare Massen, Umrechnungen und Konzentrationen gegen
// Tafelwerkwerte.
import { pruefung, wahr, zahl, gleich, wirft } from './pruefer.mjs';
import {
  molareMasse, zusammensetzung, rechneUm, konzentration,
  verduennungsVolumen, formatiereZahl, formatiereZehnerpotenz,
} from '../utils/stoechiometrie.js';

pruefung('Stöchiometrie', () => {
  const massen = [
    ['H2O', 18.015], ['H2SO4', 98.07], ['CaCO3', 100.09], ['C6H12O6', 180.16],
    ['NaCl', 58.44], ['Ca(OH)2', 74.09], ['CuSO4*5H2O', 249.68], ['Fe2O3', 159.69],
    ['NH3', 17.03], ['CO2', 44.01],
  ];
  for (const [formel, soll] of massen) {
    zahl(`M(${formel})`, molareMasse(formel), soll, 0.05);
  }
  wirft('erfundenes Element', () => molareMasse('Xx2O'));

  const z = zusammensetzung('H2O');
  zahl('H2O: Massenanteile ergeben 100 %', z.reduce((s, e) => s + e.anteil, 0), 100, 0.01);
  gleich('H2O: größter Anteil zuerst', z[0].symbol, 'O');
  zahl('H2O: Sauerstoffanteil', z[0].anteil, 88.81, 0.02);

  // Ein Mol Wasser wiegt genau die molare Masse
  const w = rechneUm('H2O', 'masse', 18.015);
  zahl('18,015 g Wasser sind 1 mol', w.stoffmenge, 1, 1e-6);
  zahl('1 mol enthält N_A Teilchen', w.teilchen, 6.02214076e23, 1e18);
  const g = rechneUm('CO2', 'volumen', 22.414);
  zahl('22,414 L Gas sind 1 mol', g.stoffmenge, 1, 1e-6);
  zahl('1 mol CO2 wiegt 44 g', g.masse, 44.009, 0.01);
  wirft('unbekannte Größe', () => rechneUm('H2O', 'quatsch', 1));

  zahl('c = n/V', konzentration(0.05, 0.5), 0.1, 1e-9);
  zahl('Verdünnung auf ein Zehntel', verduennungsVolumen(0.1, 0.5, 0.01), 5, 1e-9);

  gleich('kleine Zahl als Zehnerpotenz', formatiereZehnerpotenz(1.32e-3), '1,32 · 10⁻³');
  gleich('große Zahl', formatiereZahl(6.022e23), '6,022 · 10²³');
  gleich('normale Zahl bleibt lesbar', formatiereZahl(58.44), '58,44');
});
