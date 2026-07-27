import { StyleSheet, Text, View } from 'react-native';

import { farben } from '../utils/konstanten';

// Platzhalter für Screens, deren Fachlogik noch nicht gebaut ist.
//
//   <Baustelle punkte={['Molare Masse aus Summenformel', 'Ausbeute']} />
//
// Zweck ist nicht Dekoration, sondern Planung: Was hier als Liste steht,
// ist die vereinbarte Aufgabenliste für diesen Screen. Wird ein Punkt
// umgesetzt, verschwindet er aus der Liste — ist die Liste leer, kann
// die Komponente aus dem Screen raus.
export default function Baustelle({ punkte }) {
  return (
    <View style={styles.kasten}>
      <Text style={styles.titel}>Noch nicht gebaut</Text>
      <Text style={styles.text}>
        Dieser Bereich ist geplant, aber noch leer. Vorgesehen ist:
      </Text>
      {punkte.map((punkt) => (
        <Text key={punkt} style={styles.punkt}>
          •  {punkt}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  kasten: {
    backgroundColor: farben.hintergrundHell,
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
  },
  titel: {
    fontSize: 12,
    fontWeight: '700',
    color: farben.primaer,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: farben.primaerDunkel,
    marginBottom: 10,
  },
  punkt: {
    fontSize: 15,
    lineHeight: 24,
    color: farben.primaerDunkel,
  },
});
