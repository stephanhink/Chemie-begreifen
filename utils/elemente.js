// Alle 118 Elemente mit den Daten, die im Unterricht der Oberstufe
// gebraucht werden.
//
// Kein React hier drin — reines JavaScript, damit sich die Daten auch
// außerhalb der App nachrechnen und prüfen lassen.
//
// Felder eines Eintrags:
//   z          Ordnungszahl (= Protonenzahl)
//   sym        Elementsymbol
//   name       deutscher Name
//   masse      molare Masse in g/mol. Für Elemente ohne stabiles Isotop
//              (Tc, Pm, ab Po) ist es die Massenzahl des langlebigsten
//              Isotops — deshalb dort eine glatte Zahl.
//   gruppe     1–18 nach IUPAC, null bei Lanthanoiden und Actinoiden
//   periode    1–7
//   block      s, p, d oder f — welches Orbital zuletzt besetzt wird
//   kategorie  Schlüssel aus KATEGORIEN (siehe unten)
//   en         Elektronegativität nach Pauling, null wo nicht sinnvoll
//              messbar (Edelgase ohne Verbindungen, viele Transurane)
//   konfig     Elektronenkonfiguration mit Edelgasrumpf, in schlichter
//              Schreibweise ("[Ar] 3d6 4s2"). Die hochgestellten Ziffern
//              macht formatiereKonfiguration() daraus — so bleibt die
//              Datenzeile lesbar und maschinell auswertbar.
//   aggregat   Zustand bei 25 °C: fest, fluessig, gas oder unbekannt
//
// Bewusst NICHT enthalten: der Atomradius. Für ihn gibt es mehrere
// konkurrierende Definitionen (kovalent, van der Waals, metallisch), die
// sich um bis zu 50 % unterscheiden. Eine einzelne Zahl ohne Angabe der
// Definition wäre eher irreführend als hilfreich. Der Trend wird
// stattdessen im Wissenstext erklärt.

export const ELEMENTE = [
  { z: 1, sym: 'H', name: 'Wasserstoff', masse: 1.008, gruppe: 1, periode: 1, block: 's', kategorie: 'nichtmetall', en: 2.2, konfig: '1s1', aggregat: 'gas' },
  { z: 2, sym: 'He', name: 'Helium', masse: 4.0026, gruppe: 18, periode: 1, block: 's', kategorie: 'edelgas', en: null, konfig: '1s2', aggregat: 'gas' },

  { z: 3, sym: 'Li', name: 'Lithium', masse: 6.94, gruppe: 1, periode: 2, block: 's', kategorie: 'alkalimetall', en: 0.98, konfig: '[He] 2s1', aggregat: 'fest' },
  { z: 4, sym: 'Be', name: 'Beryllium', masse: 9.0122, gruppe: 2, periode: 2, block: 's', kategorie: 'erdalkalimetall', en: 1.57, konfig: '[He] 2s2', aggregat: 'fest' },
  { z: 5, sym: 'B', name: 'Bor', masse: 10.81, gruppe: 13, periode: 2, block: 'p', kategorie: 'halbmetall', en: 2.04, konfig: '[He] 2s2 2p1', aggregat: 'fest' },
  { z: 6, sym: 'C', name: 'Kohlenstoff', masse: 12.011, gruppe: 14, periode: 2, block: 'p', kategorie: 'nichtmetall', en: 2.55, konfig: '[He] 2s2 2p2', aggregat: 'fest' },
  { z: 7, sym: 'N', name: 'Stickstoff', masse: 14.007, gruppe: 15, periode: 2, block: 'p', kategorie: 'nichtmetall', en: 3.04, konfig: '[He] 2s2 2p3', aggregat: 'gas' },
  { z: 8, sym: 'O', name: 'Sauerstoff', masse: 15.999, gruppe: 16, periode: 2, block: 'p', kategorie: 'nichtmetall', en: 3.44, konfig: '[He] 2s2 2p4', aggregat: 'gas' },
  { z: 9, sym: 'F', name: 'Fluor', masse: 18.998, gruppe: 17, periode: 2, block: 'p', kategorie: 'halogen', en: 3.98, konfig: '[He] 2s2 2p5', aggregat: 'gas' },
  { z: 10, sym: 'Ne', name: 'Neon', masse: 20.18, gruppe: 18, periode: 2, block: 'p', kategorie: 'edelgas', en: null, konfig: '[He] 2s2 2p6', aggregat: 'gas' },

  { z: 11, sym: 'Na', name: 'Natrium', masse: 22.99, gruppe: 1, periode: 3, block: 's', kategorie: 'alkalimetall', en: 0.93, konfig: '[Ne] 3s1', aggregat: 'fest' },
  { z: 12, sym: 'Mg', name: 'Magnesium', masse: 24.305, gruppe: 2, periode: 3, block: 's', kategorie: 'erdalkalimetall', en: 1.31, konfig: '[Ne] 3s2', aggregat: 'fest' },
  { z: 13, sym: 'Al', name: 'Aluminium', masse: 26.982, gruppe: 13, periode: 3, block: 'p', kategorie: 'metall', en: 1.61, konfig: '[Ne] 3s2 3p1', aggregat: 'fest' },
  { z: 14, sym: 'Si', name: 'Silicium', masse: 28.085, gruppe: 14, periode: 3, block: 'p', kategorie: 'halbmetall', en: 1.9, konfig: '[Ne] 3s2 3p2', aggregat: 'fest' },
  { z: 15, sym: 'P', name: 'Phosphor', masse: 30.974, gruppe: 15, periode: 3, block: 'p', kategorie: 'nichtmetall', en: 2.19, konfig: '[Ne] 3s2 3p3', aggregat: 'fest' },
  { z: 16, sym: 'S', name: 'Schwefel', masse: 32.06, gruppe: 16, periode: 3, block: 'p', kategorie: 'nichtmetall', en: 2.58, konfig: '[Ne] 3s2 3p4', aggregat: 'fest' },
  { z: 17, sym: 'Cl', name: 'Chlor', masse: 35.45, gruppe: 17, periode: 3, block: 'p', kategorie: 'halogen', en: 3.16, konfig: '[Ne] 3s2 3p5', aggregat: 'gas' },
  { z: 18, sym: 'Ar', name: 'Argon', masse: 39.95, gruppe: 18, periode: 3, block: 'p', kategorie: 'edelgas', en: null, konfig: '[Ne] 3s2 3p6', aggregat: 'gas' },

  { z: 19, sym: 'K', name: 'Kalium', masse: 39.098, gruppe: 1, periode: 4, block: 's', kategorie: 'alkalimetall', en: 0.82, konfig: '[Ar] 4s1', aggregat: 'fest' },
  { z: 20, sym: 'Ca', name: 'Calcium', masse: 40.078, gruppe: 2, periode: 4, block: 's', kategorie: 'erdalkalimetall', en: 1.0, konfig: '[Ar] 4s2', aggregat: 'fest' },
  { z: 21, sym: 'Sc', name: 'Scandium', masse: 44.956, gruppe: 3, periode: 4, block: 'd', kategorie: 'uebergangsmetall', en: 1.36, konfig: '[Ar] 3d1 4s2', aggregat: 'fest' },
  { z: 22, sym: 'Ti', name: 'Titan', masse: 47.867, gruppe: 4, periode: 4, block: 'd', kategorie: 'uebergangsmetall', en: 1.54, konfig: '[Ar] 3d2 4s2', aggregat: 'fest' },
  { z: 23, sym: 'V', name: 'Vanadium', masse: 50.942, gruppe: 5, periode: 4, block: 'd', kategorie: 'uebergangsmetall', en: 1.63, konfig: '[Ar] 3d3 4s2', aggregat: 'fest' },
  // Chrom bricht die Reihenfolge: statt 3d4 4s2 wird 3d5 4s1 besetzt.
  // Eine halb gefüllte d-Schale ist energetisch günstiger — dasselbe
  // Muster wiederholt sich bei Mo, und mit voller Schale bei Cu, Ag, Au.
  { z: 24, sym: 'Cr', name: 'Chrom', masse: 51.996, gruppe: 6, periode: 4, block: 'd', kategorie: 'uebergangsmetall', en: 1.66, konfig: '[Ar] 3d5 4s1', aggregat: 'fest' },
  { z: 25, sym: 'Mn', name: 'Mangan', masse: 54.938, gruppe: 7, periode: 4, block: 'd', kategorie: 'uebergangsmetall', en: 1.55, konfig: '[Ar] 3d5 4s2', aggregat: 'fest' },
  { z: 26, sym: 'Fe', name: 'Eisen', masse: 55.845, gruppe: 8, periode: 4, block: 'd', kategorie: 'uebergangsmetall', en: 1.83, konfig: '[Ar] 3d6 4s2', aggregat: 'fest' },
  { z: 27, sym: 'Co', name: 'Cobalt', masse: 58.933, gruppe: 9, periode: 4, block: 'd', kategorie: 'uebergangsmetall', en: 1.88, konfig: '[Ar] 3d7 4s2', aggregat: 'fest' },
  { z: 28, sym: 'Ni', name: 'Nickel', masse: 58.693, gruppe: 10, periode: 4, block: 'd', kategorie: 'uebergangsmetall', en: 1.91, konfig: '[Ar] 3d8 4s2', aggregat: 'fest' },
  { z: 29, sym: 'Cu', name: 'Kupfer', masse: 63.546, gruppe: 11, periode: 4, block: 'd', kategorie: 'uebergangsmetall', en: 1.9, konfig: '[Ar] 3d10 4s1', aggregat: 'fest' },
  { z: 30, sym: 'Zn', name: 'Zink', masse: 65.38, gruppe: 12, periode: 4, block: 'd', kategorie: 'uebergangsmetall', en: 1.65, konfig: '[Ar] 3d10 4s2', aggregat: 'fest' },
  { z: 31, sym: 'Ga', name: 'Gallium', masse: 69.723, gruppe: 13, periode: 4, block: 'p', kategorie: 'metall', en: 1.81, konfig: '[Ar] 3d10 4s2 4p1', aggregat: 'fest' },
  { z: 32, sym: 'Ge', name: 'Germanium', masse: 72.63, gruppe: 14, periode: 4, block: 'p', kategorie: 'halbmetall', en: 2.01, konfig: '[Ar] 3d10 4s2 4p2', aggregat: 'fest' },
  { z: 33, sym: 'As', name: 'Arsen', masse: 74.922, gruppe: 15, periode: 4, block: 'p', kategorie: 'halbmetall', en: 2.18, konfig: '[Ar] 3d10 4s2 4p3', aggregat: 'fest' },
  { z: 34, sym: 'Se', name: 'Selen', masse: 78.971, gruppe: 16, periode: 4, block: 'p', kategorie: 'nichtmetall', en: 2.55, konfig: '[Ar] 3d10 4s2 4p4', aggregat: 'fest' },
  { z: 35, sym: 'Br', name: 'Brom', masse: 79.904, gruppe: 17, periode: 4, block: 'p', kategorie: 'halogen', en: 2.96, konfig: '[Ar] 3d10 4s2 4p5', aggregat: 'fluessig' },
  { z: 36, sym: 'Kr', name: 'Krypton', masse: 83.798, gruppe: 18, periode: 4, block: 'p', kategorie: 'edelgas', en: 3.0, konfig: '[Ar] 3d10 4s2 4p6', aggregat: 'gas' },

  { z: 37, sym: 'Rb', name: 'Rubidium', masse: 85.468, gruppe: 1, periode: 5, block: 's', kategorie: 'alkalimetall', en: 0.82, konfig: '[Kr] 5s1', aggregat: 'fest' },
  { z: 38, sym: 'Sr', name: 'Strontium', masse: 87.62, gruppe: 2, periode: 5, block: 's', kategorie: 'erdalkalimetall', en: 0.95, konfig: '[Kr] 5s2', aggregat: 'fest' },
  { z: 39, sym: 'Y', name: 'Yttrium', masse: 88.906, gruppe: 3, periode: 5, block: 'd', kategorie: 'uebergangsmetall', en: 1.22, konfig: '[Kr] 4d1 5s2', aggregat: 'fest' },
  { z: 40, sym: 'Zr', name: 'Zirconium', masse: 91.224, gruppe: 4, periode: 5, block: 'd', kategorie: 'uebergangsmetall', en: 1.33, konfig: '[Kr] 4d2 5s2', aggregat: 'fest' },
  { z: 41, sym: 'Nb', name: 'Niob', masse: 92.906, gruppe: 5, periode: 5, block: 'd', kategorie: 'uebergangsmetall', en: 1.6, konfig: '[Kr] 4d4 5s1', aggregat: 'fest' },
  { z: 42, sym: 'Mo', name: 'Molybdän', masse: 95.95, gruppe: 6, periode: 5, block: 'd', kategorie: 'uebergangsmetall', en: 2.16, konfig: '[Kr] 4d5 5s1', aggregat: 'fest' },
  { z: 43, sym: 'Tc', name: 'Technetium', masse: 98, gruppe: 7, periode: 5, block: 'd', kategorie: 'uebergangsmetall', en: 1.9, konfig: '[Kr] 4d5 5s2', aggregat: 'fest' },
  { z: 44, sym: 'Ru', name: 'Ruthenium', masse: 101.07, gruppe: 8, periode: 5, block: 'd', kategorie: 'uebergangsmetall', en: 2.2, konfig: '[Kr] 4d7 5s1', aggregat: 'fest' },
  { z: 45, sym: 'Rh', name: 'Rhodium', masse: 102.91, gruppe: 9, periode: 5, block: 'd', kategorie: 'uebergangsmetall', en: 2.28, konfig: '[Kr] 4d8 5s1', aggregat: 'fest' },
  { z: 46, sym: 'Pd', name: 'Palladium', masse: 106.42, gruppe: 10, periode: 5, block: 'd', kategorie: 'uebergangsmetall', en: 2.2, konfig: '[Kr] 4d10', aggregat: 'fest' },
  { z: 47, sym: 'Ag', name: 'Silber', masse: 107.87, gruppe: 11, periode: 5, block: 'd', kategorie: 'uebergangsmetall', en: 1.93, konfig: '[Kr] 4d10 5s1', aggregat: 'fest' },
  { z: 48, sym: 'Cd', name: 'Cadmium', masse: 112.41, gruppe: 12, periode: 5, block: 'd', kategorie: 'uebergangsmetall', en: 1.69, konfig: '[Kr] 4d10 5s2', aggregat: 'fest' },
  { z: 49, sym: 'In', name: 'Indium', masse: 114.82, gruppe: 13, periode: 5, block: 'p', kategorie: 'metall', en: 1.78, konfig: '[Kr] 4d10 5s2 5p1', aggregat: 'fest' },
  { z: 50, sym: 'Sn', name: 'Zinn', masse: 118.71, gruppe: 14, periode: 5, block: 'p', kategorie: 'metall', en: 1.96, konfig: '[Kr] 4d10 5s2 5p2', aggregat: 'fest' },
  { z: 51, sym: 'Sb', name: 'Antimon', masse: 121.76, gruppe: 15, periode: 5, block: 'p', kategorie: 'halbmetall', en: 2.05, konfig: '[Kr] 4d10 5s2 5p3', aggregat: 'fest' },
  { z: 52, sym: 'Te', name: 'Tellur', masse: 127.6, gruppe: 16, periode: 5, block: 'p', kategorie: 'halbmetall', en: 2.1, konfig: '[Kr] 4d10 5s2 5p4', aggregat: 'fest' },
  { z: 53, sym: 'I', name: 'Iod', masse: 126.9, gruppe: 17, periode: 5, block: 'p', kategorie: 'halogen', en: 2.66, konfig: '[Kr] 4d10 5s2 5p5', aggregat: 'fest' },
  { z: 54, sym: 'Xe', name: 'Xenon', masse: 131.29, gruppe: 18, periode: 5, block: 'p', kategorie: 'edelgas', en: 2.6, konfig: '[Kr] 4d10 5s2 5p6', aggregat: 'gas' },

  { z: 55, sym: 'Cs', name: 'Caesium', masse: 132.91, gruppe: 1, periode: 6, block: 's', kategorie: 'alkalimetall', en: 0.79, konfig: '[Xe] 6s1', aggregat: 'fest' },
  { z: 56, sym: 'Ba', name: 'Barium', masse: 137.33, gruppe: 2, periode: 6, block: 's', kategorie: 'erdalkalimetall', en: 0.89, konfig: '[Xe] 6s2', aggregat: 'fest' },

  // Lanthanoide: gruppe bleibt null. Sie stehen in der Darstellung in
  // einer eigenen Zeile unter dem Hauptblock — sonst wäre die Tabelle
  // 32 Spalten breit und auf keinem Bildschirm mehr lesbar.
  { z: 57, sym: 'La', name: 'Lanthan', masse: 138.91, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.1, konfig: '[Xe] 5d1 6s2', aggregat: 'fest' },
  { z: 58, sym: 'Ce', name: 'Cer', masse: 140.12, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.12, konfig: '[Xe] 4f1 5d1 6s2', aggregat: 'fest' },
  { z: 59, sym: 'Pr', name: 'Praseodym', masse: 140.91, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.13, konfig: '[Xe] 4f3 6s2', aggregat: 'fest' },
  { z: 60, sym: 'Nd', name: 'Neodym', masse: 144.24, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.14, konfig: '[Xe] 4f4 6s2', aggregat: 'fest' },
  { z: 61, sym: 'Pm', name: 'Promethium', masse: 145, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.13, konfig: '[Xe] 4f5 6s2', aggregat: 'fest' },
  { z: 62, sym: 'Sm', name: 'Samarium', masse: 150.36, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.17, konfig: '[Xe] 4f6 6s2', aggregat: 'fest' },
  { z: 63, sym: 'Eu', name: 'Europium', masse: 151.96, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.2, konfig: '[Xe] 4f7 6s2', aggregat: 'fest' },
  { z: 64, sym: 'Gd', name: 'Gadolinium', masse: 157.25, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.2, konfig: '[Xe] 4f7 5d1 6s2', aggregat: 'fest' },
  { z: 65, sym: 'Tb', name: 'Terbium', masse: 158.93, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.1, konfig: '[Xe] 4f9 6s2', aggregat: 'fest' },
  { z: 66, sym: 'Dy', name: 'Dysprosium', masse: 162.5, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.22, konfig: '[Xe] 4f10 6s2', aggregat: 'fest' },
  { z: 67, sym: 'Ho', name: 'Holmium', masse: 164.93, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.23, konfig: '[Xe] 4f11 6s2', aggregat: 'fest' },
  { z: 68, sym: 'Er', name: 'Erbium', masse: 167.26, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.24, konfig: '[Xe] 4f12 6s2', aggregat: 'fest' },
  { z: 69, sym: 'Tm', name: 'Thulium', masse: 168.93, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.25, konfig: '[Xe] 4f13 6s2', aggregat: 'fest' },
  { z: 70, sym: 'Yb', name: 'Ytterbium', masse: 173.05, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.1, konfig: '[Xe] 4f14 6s2', aggregat: 'fest' },
  { z: 71, sym: 'Lu', name: 'Lutetium', masse: 174.97, gruppe: null, periode: 6, block: 'f', kategorie: 'lanthanoid', en: 1.27, konfig: '[Xe] 4f14 5d1 6s2', aggregat: 'fest' },

  { z: 72, sym: 'Hf', name: 'Hafnium', masse: 178.49, gruppe: 4, periode: 6, block: 'd', kategorie: 'uebergangsmetall', en: 1.3, konfig: '[Xe] 4f14 5d2 6s2', aggregat: 'fest' },
  { z: 73, sym: 'Ta', name: 'Tantal', masse: 180.95, gruppe: 5, periode: 6, block: 'd', kategorie: 'uebergangsmetall', en: 1.5, konfig: '[Xe] 4f14 5d3 6s2', aggregat: 'fest' },
  { z: 74, sym: 'W', name: 'Wolfram', masse: 183.84, gruppe: 6, periode: 6, block: 'd', kategorie: 'uebergangsmetall', en: 2.36, konfig: '[Xe] 4f14 5d4 6s2', aggregat: 'fest' },
  { z: 75, sym: 'Re', name: 'Rhenium', masse: 186.21, gruppe: 7, periode: 6, block: 'd', kategorie: 'uebergangsmetall', en: 1.9, konfig: '[Xe] 4f14 5d5 6s2', aggregat: 'fest' },
  { z: 76, sym: 'Os', name: 'Osmium', masse: 190.23, gruppe: 8, periode: 6, block: 'd', kategorie: 'uebergangsmetall', en: 2.2, konfig: '[Xe] 4f14 5d6 6s2', aggregat: 'fest' },
  { z: 77, sym: 'Ir', name: 'Iridium', masse: 192.22, gruppe: 9, periode: 6, block: 'd', kategorie: 'uebergangsmetall', en: 2.2, konfig: '[Xe] 4f14 5d7 6s2', aggregat: 'fest' },
  { z: 78, sym: 'Pt', name: 'Platin', masse: 195.08, gruppe: 10, periode: 6, block: 'd', kategorie: 'uebergangsmetall', en: 2.28, konfig: '[Xe] 4f14 5d9 6s1', aggregat: 'fest' },
  { z: 79, sym: 'Au', name: 'Gold', masse: 196.97, gruppe: 11, periode: 6, block: 'd', kategorie: 'uebergangsmetall', en: 2.54, konfig: '[Xe] 4f14 5d10 6s1', aggregat: 'fest' },
  { z: 80, sym: 'Hg', name: 'Quecksilber', masse: 200.59, gruppe: 12, periode: 6, block: 'd', kategorie: 'uebergangsmetall', en: 2.0, konfig: '[Xe] 4f14 5d10 6s2', aggregat: 'fluessig' },
  { z: 81, sym: 'Tl', name: 'Thallium', masse: 204.38, gruppe: 13, periode: 6, block: 'p', kategorie: 'metall', en: 1.62, konfig: '[Xe] 4f14 5d10 6s2 6p1', aggregat: 'fest' },
  { z: 82, sym: 'Pb', name: 'Blei', masse: 207.2, gruppe: 14, periode: 6, block: 'p', kategorie: 'metall', en: 2.33, konfig: '[Xe] 4f14 5d10 6s2 6p2', aggregat: 'fest' },
  { z: 83, sym: 'Bi', name: 'Bismut', masse: 208.98, gruppe: 15, periode: 6, block: 'p', kategorie: 'metall', en: 2.02, konfig: '[Xe] 4f14 5d10 6s2 6p3', aggregat: 'fest' },
  { z: 84, sym: 'Po', name: 'Polonium', masse: 209, gruppe: 16, periode: 6, block: 'p', kategorie: 'metall', en: 2.0, konfig: '[Xe] 4f14 5d10 6s2 6p4', aggregat: 'fest' },
  { z: 85, sym: 'At', name: 'Astat', masse: 210, gruppe: 17, periode: 6, block: 'p', kategorie: 'halogen', en: 2.2, konfig: '[Xe] 4f14 5d10 6s2 6p5', aggregat: 'fest' },
  { z: 86, sym: 'Rn', name: 'Radon', masse: 222, gruppe: 18, periode: 6, block: 'p', kategorie: 'edelgas', en: null, konfig: '[Xe] 4f14 5d10 6s2 6p6', aggregat: 'gas' },

  { z: 87, sym: 'Fr', name: 'Francium', masse: 223, gruppe: 1, periode: 7, block: 's', kategorie: 'alkalimetall', en: 0.7, konfig: '[Rn] 7s1', aggregat: 'fest' },
  { z: 88, sym: 'Ra', name: 'Radium', masse: 226, gruppe: 2, periode: 7, block: 's', kategorie: 'erdalkalimetall', en: 0.9, konfig: '[Rn] 7s2', aggregat: 'fest' },

  { z: 89, sym: 'Ac', name: 'Actinium', masse: 227, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.1, konfig: '[Rn] 6d1 7s2', aggregat: 'fest' },
  { z: 90, sym: 'Th', name: 'Thorium', masse: 232.04, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.3, konfig: '[Rn] 6d2 7s2', aggregat: 'fest' },
  { z: 91, sym: 'Pa', name: 'Protactinium', masse: 231.04, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.5, konfig: '[Rn] 5f2 6d1 7s2', aggregat: 'fest' },
  { z: 92, sym: 'U', name: 'Uran', masse: 238.03, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.38, konfig: '[Rn] 5f3 6d1 7s2', aggregat: 'fest' },
  { z: 93, sym: 'Np', name: 'Neptunium', masse: 237, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.36, konfig: '[Rn] 5f4 6d1 7s2', aggregat: 'fest' },
  { z: 94, sym: 'Pu', name: 'Plutonium', masse: 244, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.28, konfig: '[Rn] 5f6 7s2', aggregat: 'fest' },
  { z: 95, sym: 'Am', name: 'Americium', masse: 243, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.13, konfig: '[Rn] 5f7 7s2', aggregat: 'fest' },
  { z: 96, sym: 'Cm', name: 'Curium', masse: 247, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.28, konfig: '[Rn] 5f7 6d1 7s2', aggregat: 'fest' },
  { z: 97, sym: 'Bk', name: 'Berkelium', masse: 247, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.3, konfig: '[Rn] 5f9 7s2', aggregat: 'fest' },
  { z: 98, sym: 'Cf', name: 'Californium', masse: 251, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.3, konfig: '[Rn] 5f10 7s2', aggregat: 'fest' },
  { z: 99, sym: 'Es', name: 'Einsteinium', masse: 252, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.3, konfig: '[Rn] 5f11 7s2', aggregat: 'fest' },
  { z: 100, sym: 'Fm', name: 'Fermium', masse: 257, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.3, konfig: '[Rn] 5f12 7s2', aggregat: 'unbekannt' },
  { z: 101, sym: 'Md', name: 'Mendelevium', masse: 258, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.3, konfig: '[Rn] 5f13 7s2', aggregat: 'unbekannt' },
  { z: 102, sym: 'No', name: 'Nobelium', masse: 259, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.3, konfig: '[Rn] 5f14 7s2', aggregat: 'unbekannt' },
  { z: 103, sym: 'Lr', name: 'Lawrencium', masse: 266, gruppe: null, periode: 7, block: 'f', kategorie: 'actinoid', en: 1.3, konfig: '[Rn] 5f14 7s2 7p1', aggregat: 'unbekannt' },

  // Ab hier: künstlich erzeugte Elemente, oft nur wenige Atome und
  // Sekundenbruchteile lang. Eigenschaften sind größtenteils berechnet,
  // nicht gemessen — deshalb "unbekannt" beim Aggregatzustand und
  // keine Elektronegativität.
  { z: 104, sym: 'Rf', name: 'Rutherfordium', masse: 267, gruppe: 4, periode: 7, block: 'd', kategorie: 'uebergangsmetall', en: null, konfig: '[Rn] 5f14 6d2 7s2', aggregat: 'unbekannt' },
  { z: 105, sym: 'Db', name: 'Dubnium', masse: 268, gruppe: 5, periode: 7, block: 'd', kategorie: 'uebergangsmetall', en: null, konfig: '[Rn] 5f14 6d3 7s2', aggregat: 'unbekannt' },
  { z: 106, sym: 'Sg', name: 'Seaborgium', masse: 269, gruppe: 6, periode: 7, block: 'd', kategorie: 'uebergangsmetall', en: null, konfig: '[Rn] 5f14 6d4 7s2', aggregat: 'unbekannt' },
  { z: 107, sym: 'Bh', name: 'Bohrium', masse: 270, gruppe: 7, periode: 7, block: 'd', kategorie: 'uebergangsmetall', en: null, konfig: '[Rn] 5f14 6d5 7s2', aggregat: 'unbekannt' },
  { z: 108, sym: 'Hs', name: 'Hassium', masse: 269, gruppe: 8, periode: 7, block: 'd', kategorie: 'uebergangsmetall', en: null, konfig: '[Rn] 5f14 6d6 7s2', aggregat: 'unbekannt' },
  { z: 109, sym: 'Mt', name: 'Meitnerium', masse: 278, gruppe: 9, periode: 7, block: 'd', kategorie: 'unbekannt', en: null, konfig: '[Rn] 5f14 6d7 7s2', aggregat: 'unbekannt' },
  { z: 110, sym: 'Ds', name: 'Darmstadtium', masse: 281, gruppe: 10, periode: 7, block: 'd', kategorie: 'unbekannt', en: null, konfig: '[Rn] 5f14 6d8 7s2', aggregat: 'unbekannt' },
  { z: 111, sym: 'Rg', name: 'Roentgenium', masse: 282, gruppe: 11, periode: 7, block: 'd', kategorie: 'unbekannt', en: null, konfig: '[Rn] 5f14 6d9 7s2', aggregat: 'unbekannt' },
  { z: 112, sym: 'Cn', name: 'Copernicium', masse: 285, gruppe: 12, periode: 7, block: 'd', kategorie: 'unbekannt', en: null, konfig: '[Rn] 5f14 6d10 7s2', aggregat: 'unbekannt' },
  { z: 113, sym: 'Nh', name: 'Nihonium', masse: 286, gruppe: 13, periode: 7, block: 'p', kategorie: 'unbekannt', en: null, konfig: '[Rn] 5f14 6d10 7s2 7p1', aggregat: 'unbekannt' },
  { z: 114, sym: 'Fl', name: 'Flerovium', masse: 289, gruppe: 14, periode: 7, block: 'p', kategorie: 'unbekannt', en: null, konfig: '[Rn] 5f14 6d10 7s2 7p2', aggregat: 'unbekannt' },
  { z: 115, sym: 'Mc', name: 'Moscovium', masse: 290, gruppe: 15, periode: 7, block: 'p', kategorie: 'unbekannt', en: null, konfig: '[Rn] 5f14 6d10 7s2 7p3', aggregat: 'unbekannt' },
  { z: 116, sym: 'Lv', name: 'Livermorium', masse: 293, gruppe: 16, periode: 7, block: 'p', kategorie: 'unbekannt', en: null, konfig: '[Rn] 5f14 6d10 7s2 7p4', aggregat: 'unbekannt' },
  { z: 117, sym: 'Ts', name: 'Tenness', masse: 294, gruppe: 17, periode: 7, block: 'p', kategorie: 'unbekannt', en: null, konfig: '[Rn] 5f14 6d10 7s2 7p5', aggregat: 'unbekannt' },
  { z: 118, sym: 'Og', name: 'Oganesson', masse: 294, gruppe: 18, periode: 7, block: 'p', kategorie: 'unbekannt', en: null, konfig: '[Rn] 5f14 6d10 7s2 7p6', aggregat: 'unbekannt' },
];

// ---------------------------------------------------------------------
// Kategorien (Text, nicht Farbe)
// ---------------------------------------------------------------------
// Diese feine Einteilung erscheint als Wort in der Detailansicht.
// Eingefärbt wird das Gitter danach NICHT — siehe STOFFKLASSEN.
//
// label   für die Detailansicht
// thema   ID des Wissens-Eintrags, der die Kategorie erklärt (darf fehlen,
//         der InfoButton blendet sich dann selbst aus)

export const KATEGORIEN = {
  nichtmetall: { label: 'Nichtmetall', thema: 'metalleNichtmetalle' },
  edelgas: { label: 'Edelgas', thema: 'edelgase' },
  alkalimetall: { label: 'Alkalimetall', thema: 'hauptgruppe' },
  erdalkalimetall: { label: 'Erdalkalimetall', thema: 'hauptgruppe' },
  uebergangsmetall: { label: 'Übergangsmetall', thema: 'nebengruppe' },
  metall: { label: 'Metall', thema: 'metalleNichtmetalle' },
  halbmetall: { label: 'Halbmetall', thema: 'halbmetalle' },
  halogen: { label: 'Halogen', thema: 'halogene' },
  lanthanoid: { label: 'Lanthanoid', thema: 'lanthanoide' },
  actinoid: { label: 'Actinoid', thema: 'lanthanoide' },
  unbekannt: { label: 'Eigenschaften unbekannt', thema: null },
};

// ---------------------------------------------------------------------
// Einfärbung des Gitters
// ---------------------------------------------------------------------
// Warum nur drei Farben statt der elf Kategorien oben?
//
// Erstens Lesbarkeit: Elf blasse Farbtöne, die man gegen eine Legende
// abgleichen muss, sind für jemanden mit Wissenslücken zusätzliche
// Arbeit statt Hilfe. Geprüft mit dem Palettenvalidator waren die elf
// Töne weder bei Rot-Grün-Sehschwäche noch bei normalem Farbsehen
// zuverlässig auseinanderzuhalten.
//
// Zweitens Redundanz: Die feinen Kategorien stehen ohnehin schon in der
// POSITION. Alkalimetalle sind Spalte 1, Halogene Spalte 17, Edelgase
// Spalte 18 — sie noch einmal einzufärben, sagt nichts Neues. Die
// Einteilung Metall/Halbmetall/Nichtmetall dagegen verläuft als
// "Treppe" quer durchs Periodensystem und ist die einzige wichtige
// Grenze, die man der Position NICHT ansieht.
//
// Die drei Farben stammen aus einer validierten kategorialen Palette
// (Blau/Orange/Aqua, alle Paare geprüft). Textfarbe ist reines Schwarz:
// Damit erreicht auch die kleine Ordnungszahl auf jeder Kachel mehr als
// 4,5:1 Kontrast.

export const STOFFKLASSEN = {
  metall: { label: 'Metall', farbe: '#2a78d6', textfarbe: '#000000', thema: 'metalleNichtmetalle' },
  halbmetall: { label: 'Halbmetall', farbe: '#eb6834', textfarbe: '#000000', thema: 'halbmetalle' },
  nichtmetall: { label: 'Nichtmetall', farbe: '#1baf7a', textfarbe: '#000000', thema: 'metalleNichtmetalle' },
  unbekannt: { label: 'unbekannt', farbe: '#d8d8d5', textfarbe: '#000000', thema: null },
};

// Ordnet die feine Kategorie der groben Stoffklasse zu.
const STOFFKLASSE_VON_KATEGORIE = {
  alkalimetall: 'metall',
  erdalkalimetall: 'metall',
  uebergangsmetall: 'metall',
  metall: 'metall',
  lanthanoid: 'metall',
  actinoid: 'metall',
  halbmetall: 'halbmetall',
  nichtmetall: 'nichtmetall',
  halogen: 'nichtmetall',
  edelgas: 'nichtmetall',
  unbekannt: 'unbekannt',
};

export function stoffklasseVon(element) {
  return STOFFKLASSE_VON_KATEGORIE[element.kategorie] || 'unbekannt';
}

export const AGGREGATZUSTAENDE = {
  fest: { label: 'fest', farbe: '#2a78d6', textfarbe: '#000000' },
  fluessig: { label: 'flüssig', farbe: '#eb6834', textfarbe: '#000000' },
  gas: { label: 'gasförmig', farbe: '#1baf7a', textfarbe: '#000000' },
  unbekannt: { label: 'unbekannt', farbe: '#d8d8d5', textfarbe: '#000000' },
};

// Sequenzielle Rampe für die Elektronegativität: EIN Farbton, hell nach
// dunkel. Ein Regenbogen wäre hier falsch — die Elektronegativität ist
// eine Größe mit Richtung ("mehr davon"), keine Sammlung von Kategorien,
// und Regenbogenskalen erfinden Grenzen, wo keine sind.
const EN_RAMPE = [
  { farbe: '#cde2fb', textfarbe: '#000000' },
  { farbe: '#9ec5f4', textfarbe: '#000000' },
  { farbe: '#6da7ec', textfarbe: '#000000' },
  { farbe: '#3987e5', textfarbe: '#000000' },
  { farbe: '#256abf', textfarbe: '#ffffff' },
  { farbe: '#184f95', textfarbe: '#ffffff' },
  { farbe: '#0d366b', textfarbe: '#ffffff' },
];

// Kleinste und größte vorkommende Elektronegativität: Francium 0,7 und
// Fluor 3,98. Die Rampe wird über genau diese Spanne aufgezogen.
export const EN_MIN = 0.7;
export const EN_MAX = 3.98;

// Ordnet einem EN-Wert eine Stufe der Rampe zu. Elemente ohne Wert
// (Edelgase, die meisten Transurane) bleiben grau — "kein Wert" darf
// nicht wie "kleiner Wert" aussehen.
export function farbeFuerEN(en) {
  if (en === null || en === undefined) {
    return STOFFKLASSEN.unbekannt;
  }
  const anteil = (en - EN_MIN) / (EN_MAX - EN_MIN);
  const stufe = Math.min(
    EN_RAMPE.length - 1,
    Math.max(0, Math.round(anteil * (EN_RAMPE.length - 1)))
  );
  return EN_RAMPE[stufe];
}

// Die Stufen der EN-Rampe mit ihren Wertebereichen — für die Legende.
export function enLegende() {
  const spanne = (EN_MAX - EN_MIN) / EN_RAMPE.length;
  return EN_RAMPE.map((stufe, i) => ({
    ...stufe,
    von: EN_MIN + i * spanne,
    bis: EN_MIN + (i + 1) * spanne,
  }));
}

// Trivialnamen der Hauptgruppen. Nur die Gruppen, die im Unterricht
// einen eigenen Namen tragen — für 13 bis 16 sind die Bezeichnungen
// ("Bor-Gruppe" usw.) wenig gebräuchlich und bleiben deshalb leer.
export const GRUPPENNAMEN = {
  1: 'Alkalimetalle',
  2: 'Erdalkalimetalle',
  17: 'Halogene',
  18: 'Edelgase',
};

// ---------------------------------------------------------------------
// Zugriffsfunktionen
// ---------------------------------------------------------------------

// Element über die Ordnungszahl holen. Gibt null zurück, wenn es die
// Zahl nicht gibt — so stürzt ein Tippfehler nirgends ab.
export function elementNachZ(z) {
  return ELEMENTE.find((el) => el.z === z) || null;
}

export function elementNachSymbol(symbol) {
  const gesucht = String(symbol).trim().toLowerCase();
  return ELEMENTE.find((el) => el.sym.toLowerCase() === gesucht) || null;
}

// Sucht über Symbol, Name und Ordnungszahl gleichzeitig. Gedacht für das
// Suchfeld im Screen: Wer "26", "Fe" oder "eisen" eingibt, soll dasselbe
// finden.
//
// Das Symbol wird nur bei exakter Übereinstimmung gewertet, der Name
// dagegen auch als Anfang. Sonst würde die Eingabe "c" halb Europa
// treffen, statt zuerst Kohlenstoff zu zeigen.
export function sucheElemente(begriff) {
  const q = String(begriff).trim().toLowerCase();
  if (!q) {
    return [];
  }

  const alsZahl = Number(q);
  if (Number.isInteger(alsZahl) && alsZahl >= 1 && alsZahl <= 118) {
    return [elementNachZ(alsZahl)];
  }

  return ELEMENTE.filter(
    (el) => el.sym.toLowerCase() === q || el.name.toLowerCase().startsWith(q)
  );
}

// ---------------------------------------------------------------------
// Elektronenkonfiguration
// ---------------------------------------------------------------------

// Wie viele Elektronen pro Schale stecken in einem Edelgasrumpf?
// Diese sechs Zeilen ersparen es, die Schalenbesetzung für alle 118
// Elemente von Hand einzutragen — sie wird stattdessen ausgerechnet.
const RUMPF_SCHALEN = {
  He: [2],
  Ne: [2, 8],
  Ar: [2, 8, 8],
  Kr: [2, 8, 18, 8],
  Xe: [2, 8, 18, 18, 8],
  Rn: [2, 8, 18, 32, 18, 8],
};

// Rechnet die Konfiguration in die Elektronenzahl pro Schale um.
//
//   elektronenSchalen(Eisen)  →  [2, 8, 14, 2]
//
// Genau das ist das Schalenmodell aus der Mittelstufe: Die letzte Zahl
// sind die Außenelektronen. Bei den Nebengruppen weicht sie von der
// Gruppennummer ab — der Grund, warum das einfache Schalenmodell dort
// an seine Grenze kommt.
export function elektronenSchalen(element) {
  const schalen = [];

  function addiere(schale, anzahl) {
    // Array bei Bedarf verlängern; Schale 1 steht an Index 0.
    while (schalen.length < schale) {
      schalen.push(0);
    }
    schalen[schale - 1] += anzahl;
  }

  const teile = element.konfig.split(/\s+/);

  for (const teil of teile) {
    const rumpf = teil.match(/^\[(\w+)\]$/);
    if (rumpf) {
      const vorlage = RUMPF_SCHALEN[rumpf[1]];
      vorlage.forEach((anzahl, i) => addiere(i + 1, anzahl));
      continue;
    }

    // z. B. "3d6" → Hauptquantenzahl 3, sechs Elektronen
    const orbital = teil.match(/^(\d)[spdf](\d+)$/);
    if (orbital) {
      addiere(Number(orbital[1]), Number(orbital[2]));
    }
  }

  return schalen;
}

// Zahl der Außenelektronen (Valenzelektronen) — die Elektronen auf der
// äußersten besetzten Schale.
//
// Achtung, bewusste Vereinfachung: Bei den Nebengruppen zählen auch die
// d-Elektronen zu den Valenzelektronen. Diese Funktion gibt dort nur die
// s-Elektronen der äußersten Schale zurück, also fast immer 2. Für die
// Hauptgruppen — und nur dort wird die Zahl im Unterricht gebraucht —
// stimmt sie.
export function aussenelektronen(element) {
  const schalen = elektronenSchalen(element);
  return schalen[schalen.length - 1];
}

const HOCHGESTELLT = {
  0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴',
  5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹',
};

// Macht aus "[Ar] 3d6 4s2" die Schreibweise "[Ar] 3d⁶ 4s²".
//
// Warum nicht gleich so in den Daten? Weil hochgestellte Ziffern sich
// nicht rechnen lassen: elektronenSchalen() müsste sie erst wieder
// zurückübersetzen, und beim Eintippen von 118 Zeilen wäre jeder
// Zahlendreher unsichtbar.
export function formatiereKonfiguration(konfig) {
  return konfig.replace(/([spdf])(\d+)/g, (_, orbital, anzahl) => {
    const ziffern = String(anzahl)
      .split('')
      .map((ziffer) => HOCHGESTELLT[ziffer])
      .join('');
    return orbital + ziffern;
  });
}
