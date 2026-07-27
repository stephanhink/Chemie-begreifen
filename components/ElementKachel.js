import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

// Eine Kachel im Periodensystem-Gitter.
//
// Größe und Abstand stehen hier als Konstanten, weil der Screen sie zum
// Rechnen braucht (Gesamtbreite = 18 Spalten × KACHEL_SCHRITT). Läge die
// Zahl nur im StyleSheet, müsste sie an zwei Stellen gepflegt werden.
export const KACHEL_GROESSE = 44;
export const KACHEL_ABSTAND = 2;
export const KACHEL_SCHRITT = KACHEL_GROESSE + KACHEL_ABSTAND;

// memo(), weil beim Umschalten der Einfärbung sonst alle 118 Kacheln neu
// gerendert würden, obwohl sich meist nur die Farbe ändert.
function ElementKachel({ element, farbe, textfarbe, ausgewaehlt, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(element)}
      style={[
        styles.kachel,
        { backgroundColor: farbe },
        ausgewaehlt && styles.ausgewaehlt,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${element.name}, Symbol ${element.sym}, Ordnungszahl ${element.z}`}
    >
      <Text style={[styles.ordnungszahl, { color: textfarbe }]}>
        {element.z}
      </Text>
      <Text style={[styles.symbol, { color: textfarbe }]}>{element.sym}</Text>
    </Pressable>
  );
}

export default memo(ElementKachel);

const styles = StyleSheet.create({
  kachel: {
    width: KACHEL_GROESSE,
    height: KACHEL_GROESSE,
    margin: KACHEL_ABSTAND / 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Der Rahmen liegt innen (borderWidth ohne Größenänderung), damit die
  // ausgewählte Kachel das Gitter nicht verschiebt.
  ausgewaehlt: {
    borderWidth: 3,
    borderColor: '#0b0b0b',
  },
  ordnungszahl: {
    fontSize: 9,
    fontWeight: '600',
    lineHeight: 11,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 19,
  },
});
