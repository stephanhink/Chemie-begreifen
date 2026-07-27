// Hintergrundwissen zu den Fachbegriffen, die in den Screens vorkommen.
//
// Alle Texte stehen hier zentral, nicht in den Screens — so bleiben die
// Screens beim Rechnen und die Texte lassen sich bearbeiten, ohne durch
// fünf Dateien zu suchen.
//
// Aufbau eines Eintrags:
//   titel     Überschrift im Info-Fenster
//   text      Array von Absätzen (ein Eintrag = ein Absatz)
//   formel    optional: die zugehörige Formel, wird abgesetzt und in
//             Monospace dargestellt
//   beispiel  optional: eine konkrete Rechnung zum Anfassen. Erklärungen
//             bleiben abstrakt, bis man sie einmal an echten Zahlen
//             gesehen hat.
//   mehr      optional: IDs verwandter Themen, erscheinen als Links am
//             Ende und öffnen das jeweilige Thema im selben Fenster
//
// Neues Thema: hier einen Eintrag ergänzen und im Screen ein
// <InfoButton thema="..." /> neben das Label setzen. Mehr ist nicht nötig.

export const THEMEN = {
  // -----------------------------------------------------------------
  // Stöchiometrie
  // -----------------------------------------------------------------

  stoffmenge: {
    titel: 'Stoffmenge und das Mol',
    text: [
      'Atome sind zu klein, um sie einzeln zu zählen oder zu wiegen. Die Chemie rechnet deshalb nicht in Stückzahlen, sondern in Portionen: Ein Mol ist die Stoffmenge, die aus 6,022·10²³ Teilchen besteht.',
      'Der Sinn dieser krummen Zahl: Sie verbindet die Teilchenwelt mit der Waage. Ein Mol eines Stoffes wiegt genau so viel Gramm, wie ein einzelnes Teilchen in der Einheit u wiegt. Ein Kohlenstoffatom hat die Masse 12 u — also wiegt ein Mol Kohlenstoff 12 g.',
      'Damit wird jede Reaktionsgleichung zu einer Wiegevorschrift. Die Koeffizienten in der Gleichung sind Teilchenverhältnisse, und über die molare Masse werden daraus Gramm, die man abwiegen kann.',
    ],
    formel: 'n = m / M',
    beispiel:
      '18 g Wasser: M(H₂O) = 18,02 g/mol, also n = 18 g ÷ 18,02 g/mol ≈ 1 mol. Das sind rund 6·10²³ Wassermoleküle — und passt in einen Esslöffel.',
    mehr: ['molareMasse'],
  },

  molareMasse: {
    titel: 'Die molare Masse',
    text: [
      'Die molare Masse M gibt an, wie viel Gramm ein Mol eines Stoffes wiegt. Ihre Einheit ist g/mol.',
      'Für ein Element steht sie im Periodensystem — es ist dieselbe Zahl wie die Atommasse in u. Für eine Verbindung addiert man die molaren Massen aller Atome in der Formel, jeweils mit ihrem Index multipliziert.',
      'Weil die Werte im Periodensystem Mittelwerte über die natürlichen Isotope sind, sind sie krumm. Chlor hat 35,45 g/mol, obwohl es kein einziges Chloratom mit dieser Masse gibt: Die Natur mischt ³⁵Cl und ³⁷Cl im Verhältnis von etwa 3 zu 1.',
    ],
    formel: 'M(H₂SO₄) = 2·1,008 + 32,06 + 4·15,999 = 98,08 g/mol',
    mehr: ['stoffmenge'],
  },

  // -----------------------------------------------------------------
  // Säure und Base
  // -----------------------------------------------------------------

  phWert: {
    titel: 'Der pH-Wert',
    text: [
      'Der pH-Wert ist der negative dekadische Logarithmus der Oxonium-Ionen-Konzentration. Der Logarithmus steckt darin, weil sich diese Konzentration über mehr als vierzehn Zehnerpotenzen erstreckt — auf einer linearen Skala wäre das nicht darstellbar.',
      'Wichtige Folge: Eine Änderung um eine pH-Einheit bedeutet den Faktor 10 in der Konzentration. Von pH 3 auf pH 1 ist nicht "etwas saurer", sondern hundertmal so sauer.',
    ],
    formel: 'pH = −lg c(H₃O⁺)',
    mehr: ['ionenprodukt'],
  },

  ionenprodukt: {
    titel: 'Das Ionenprodukt des Wassers',
    text: [
      'Wasser reagiert in geringem Maß mit sich selbst — die Autoprotolyse. Dabei entstehen gleich viele Oxonium- und Hydroxid-Ionen, bei 25 °C jeweils 10⁻⁷ mol/L. Das Produkt beider Konzentrationen ist eine Konstante.',
      'Daraus folgt die vertraute Regel pH + pOH = 14. Sie gilt aber nur bei 25 °C: Die Autoprotolyse ist endotherm, bei höherer Temperatur läuft sie weiter ab. Bei 100 °C liegt der Neutralpunkt bei pH 6,14 — neutral, nicht sauer.',
    ],
    formel: 'K_W = c(H₃O⁺) · c(OH⁻) = 10⁻¹⁴ mol²/L² (25 °C)',
    mehr: ['phWert'],
  },

  // -----------------------------------------------------------------
  // Weitere Themen folgen: Elektronegativität, Oxidationszahlen,
  // Nernst-Gleichung, Mesomerie, funktionelle Gruppen, …
  // -----------------------------------------------------------------
};

// Gibt ein Thema zurück oder null, wenn die ID nicht existiert. So führt
// ein Tippfehler im Screen nicht zum Absturz, sondern nur dazu, dass der
// Info-Knopf nichts anzeigt.
export function holeThema(id) {
  return THEMEN[id] || null;
}
