import ScreenGeruest from '../components/ScreenGeruest';
import Baustelle from '../components/Baustelle';

// Anorganik, Teil 1: das Periodensystem als Nachschlagewerk und als
// Werkzeug, um Trends zu verstehen.
//
// Die Elementdaten kommen später aus utils/elemente.js — dieser Screen
// stellt sie nur dar und rechnet selbst nichts.
export default function PeriodensystemScreen() {
  return (
    <ScreenGeruest
      titel="Periodensystem"
      untertitel="Atombau, Elektronenkonfiguration und die Trends im PSE"
    >
      <Baustelle
        punkte={[
          'Interaktives PSE, Elemente antippbar',
          'Detailansicht: Ordnungszahl, molare Masse, Elektronenkonfiguration, Elektronegativität, Aggregatzustand',
          'Einfärbung umschaltbar nach Kategorie, Elektronegativität, Atomradius',
          'Trends erklärt: warum EN nach rechts steigt und nach unten fällt',
          'Schalenmodell und Orbitalbesetzung zum ausgewählten Element',
        ]}
      />
    </ScreenGeruest>
  );
}
