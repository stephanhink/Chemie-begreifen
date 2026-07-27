import ScreenGeruest from '../components/ScreenGeruest';
import Baustelle from '../components/Baustelle';

// Säure-Base-Chemie nach Brønsted — eines der großen Abiturthemen.
//
// Leitlinie aus CLAUDE.md: Wo die Schulnäherung
// pH = ½·(pKs − lg c₀) gilt, wird zusätzlich exakt gerechnet und die
// Abweichung angezeigt. Genau daran versteht man die Voraussetzung der
// Näherung.
export default function SaeureBaseScreen() {
  return (
    <ScreenGeruest
      titel="Säuren und Basen"
      untertitel="pH-Wert, pKs, Puffer und Titration"
    >
      <Baustelle
        punkte={[
          'pH starker Säuren und Basen aus der Konzentration',
          'pH schwacher Säuren: Schulnäherung und exakte Lösung im Vergleich',
          'pKs-Tabelle der gängigen Säuren zum Auswählen',
          'Pufferlösungen nach Henderson-Hasselbalch',
          'Titrationskurve mit Äquivalenz- und Halbäquivalenzpunkt',
          'Indikatoren und ihre Umschlagsbereiche',
        ]}
      />
    </ScreenGeruest>
  );
}
