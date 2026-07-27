// Naturkonstanten und Farben — beides steht hier zentral, damit es nicht
// in fünf Screens leicht unterschiedlich noch einmal auftaucht.
//
// In utils/ läuft grundsätzlich kein React: Diese Datei ist reines
// JavaScript und lässt sich deshalb auch außerhalb der App nachrechnen.

// ---------------------------------------------------------------------
// Naturkonstanten (CODATA 2022 bzw. SI-Definitionen)
// ---------------------------------------------------------------------

// Avogadro-Konstante N_A in 1/mol. Seit der SI-Reform 2019 ist sie exakt
// definiert und nicht mehr gemessen — daher die krumme, aber feste Zahl.
export const AVOGADRO = 6.02214076e23;

// Universelle Gaskonstante R in J/(mol·K).
export const GASKONSTANTE = 8.314462618;

// Faraday-Konstante F in C/mol — Ladung eines Mols Elektronen.
// Wird für die Nernst-Gleichung und die Elektrolyse gebraucht.
export const FARADAY = 96485.33212;

// Molares Volumen eines idealen Gases in L/mol.
// Achtung, zwei gebräuchliche Bezugszustände:
//   Normbedingungen  0 °C, 1013,25 hPa  →  22,414 L/mol
//   Standardbedingungen 25 °C, 1000 hPa →  24,789 L/mol
// Im deutschen Schulunterricht ist meist der erste gemeint.
export const MOLVOLUMEN_NORM = 22.414;
export const MOLVOLUMEN_STANDARD = 24.789;

// Ionenprodukt des Wassers K_W bei 25 °C in mol²/L².
// Daraus folgt pK_W = 14, also pH + pOH = 14 — aber eben nur bei 25 °C.
export const KW_25 = 1.0e-14;
export const PKW_25 = 14;

// Standardtemperatur in Kelvin (25 °C).
export const T_STANDARD = 298.15;

// Umrechnung Celsius → Kelvin.
export function kelvin(celsius) {
  return celsius + 273.15;
}

// ---------------------------------------------------------------------
// Farben
// ---------------------------------------------------------------------
// Ein Grün als Leitfarbe (das Schwesterprojekt finanz-kids nutzt Blau),
// dazu ein sehr helles Grün für Ergebniskästen.

export const farben = {
  primaer: '#1a7f5a',
  primaerDunkel: '#0f4d36',
  hintergrundHell: '#E3F5EC',
  trenner: '#B7DFCC',
  rand: '#ccc',
  text: '#333',
  textLeise: '#666',
  textSehrLeise: '#999',
  weiss: '#fff',
  // Für Warnhinweise, z. B. wenn eine Näherungsformel außerhalb ihres
  // Gültigkeitsbereichs benutzt wird.
  warnung: '#b45309',
  warnungHintergrund: '#FEF3C7',
};
