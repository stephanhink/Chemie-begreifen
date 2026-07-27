import ScreenGeruest from '../components/ScreenGeruest';
import Baustelle from '../components/Baustelle';

// Das Rechenhandwerk der Chemie: von der Summenformel zur Masse und
// zurück, und von der Reaktionsgleichung zur Ausbeute.
//
// Kern wird ein Formelparser in utils/molmasse.js, der auch Klammern
// und Kristallwasser (CuSO₄ · 5 H₂O) versteht.
export default function StoechiometrieScreen() {
  return (
    <ScreenGeruest
      titel="Stöchiometrie"
      untertitel="Molare Masse, Stoffmenge und Reaktionsgleichungen"
    >
      <Baustelle
        punkte={[
          'Molare Masse aus einer eingegebenen Summenformel, inkl. Klammern und Kristallwasser',
          'Umrechnung n ↔ m ↔ V (Gase) ↔ Teilchenzahl',
          'Massenanteile der Elemente in der Verbindung',
          'Reaktionsgleichungen automatisch ausgleichen',
          'Ausbeute und limitierender Reaktionspartner',
          'Konzentration c = n/V und Verdünnungen',
        ]}
      />
    </ScreenGeruest>
  );
}
