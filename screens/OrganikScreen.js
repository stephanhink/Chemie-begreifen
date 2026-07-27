import ScreenGeruest from '../components/ScreenGeruest';
import Baustelle from '../components/Baustelle';

// Organische Chemie: Stoffklassen, Nomenklatur und die
// Reaktionsmechanismen, die im Abitur verlangt werden.
export default function OrganikScreen() {
  return (
    <ScreenGeruest
      titel="Organische Chemie"
      untertitel="Stoffklassen, funktionelle Gruppen und Nomenklatur"
    >
      <Baustelle
        punkte={[
          'Übersicht der Stoffklassen mit funktioneller Gruppe, Endung und Beispielstoff',
          'Homologe Reihe der Alkane, Alkene und Alkine',
          'IUPAC-Namen zusammensetzen und wieder zerlegen',
          'Isomerie: Konstitutions-, Stereo- und Spiegelbildisomerie',
          'Reaktionstypen: Substitution, Addition, Eliminierung, Veresterung',
          'Zusammenhang Struktur ↔ Eigenschaften (Siedepunkt, Löslichkeit)',
        ]}
      />
    </ScreenGeruest>
  );
}
