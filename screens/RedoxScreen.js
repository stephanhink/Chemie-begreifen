import ScreenGeruest from '../components/ScreenGeruest';
import Baustelle from '../components/Baustelle';

// Elektronenübertragung und Elektrochemie — das zweite große
// Anorganik-Thema der Oberstufe.
export default function RedoxScreen() {
  return (
    <ScreenGeruest
      titel="Redox und Elektrochemie"
      untertitel="Oxidationszahlen, Spannungsreihe und Nernst-Gleichung"
    >
      <Baustelle
        punkte={[
          'Oxidationszahlen zu einer eingegebenen Formel bestimmen',
          'Redoxgleichungen in Teilgleichungen zerlegen und ausgleichen',
          'Elektrochemische Spannungsreihe zum Nachschlagen',
          'Zellspannung aus zwei Halbzellen berechnen',
          'Nernst-Gleichung: Einfluss von Konzentration und Temperatur',
          'Elektrolyse: abgeschiedene Masse über die Faraday-Gesetze',
        ]}
      />
    </ScreenGeruest>
  );
}
