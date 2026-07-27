import { ScrollView, StyleSheet, Text, View } from 'react-native';

import ElementKachel, { KACHEL_GROESSE, KACHEL_SCHRITT } from './ElementKachel';
import { farben } from '../utils/konstanten';
import { ELEMENTE } from '../utils/elemente';

// Das Gitter des Periodensystems — ohne eigene Meinung darüber, was die
// Farben bedeuten oder was beim Antippen passiert. Beides gibt der
// aufrufende Screen vor:
//
//   farbeFuer(element)      → { farbe, textfarbe }
//   onPress(element)        → was beim Antippen passiert
//   istAusgewaehlt(element) → schwarzer Rahmen
//   istAbgeblendet(element) → zurückgenommene Darstellung
//
// Dadurch kann der PSE-Screen nach Stoffklasse einfärben und das Labor
// nach "kann mitreagieren", ohne dass das Gitter zweimal existiert.

// Hauptblock: 7 Perioden × 18 Gruppen. Lanthanoide und Actinoide fehlen
// hier — sie stehen unten in eigenen Zeilen, sonst wäre die Tabelle 32
// Spalten breit.
const HAUPTBLOCK = Array.from({ length: 7 }, (_, p) =>
  Array.from(
    { length: 18 },
    (_, g) =>
      ELEMENTE.find((el) => el.periode === p + 1 && el.gruppe === g + 1) || null
  )
);

const LANTHANOIDE = ELEMENTE.filter((el) => el.kategorie === 'lanthanoid');
const ACTINOIDE = ELEMENTE.filter((el) => el.kategorie === 'actinoid');

// In Periode 6 und 7 sitzt auf Gruppenplatz 3 kein einzelnes Element,
// sondern der Verweis auf die f-Block-Zeile darunter.
function PlatzhalterKachel({ text }) {
  return (
    <View style={styles.platzhalter}>
      <Text style={styles.platzhalterText}>{text}</Text>
    </View>
  );
}

export default function PeriodensystemGitter({
  farbeFuer,
  onPress,
  istAusgewaehlt = () => false,
  istAbgeblendet = () => false,
}) {
  function kachel(element) {
    const { farbe, textfarbe } = farbeFuer(element);
    const abgeblendet = istAbgeblendet(element);

    return (
      <View key={element.z} style={abgeblendet ? styles.abgeblendet : null}>
        <ElementKachel
          element={element}
          farbe={farbe}
          textfarbe={textfarbe}
          ausgewaehlt={istAusgewaehlt(element)}
          onPress={onPress}
        />
      </View>
    );
  }

  return (
    // Statt die Kacheln zu schrumpfen, bis man sie weder lesen noch
    // treffen kann, wird waagerecht gescrollt.
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View style={styles.gitter}>
        <View style={styles.spaltenkopfZeile}>
          {Array.from({ length: 18 }, (_, i) => (
            <View key={i} style={styles.spaltenkopf}>
              <Text style={styles.spaltenkopfText}>{i + 1}</Text>
            </View>
          ))}
        </View>

        {HAUPTBLOCK.map((zeile, index) => (
          <View key={index} style={styles.zeile}>
            {zeile.map((element, spalte) => {
              if (element === null && spalte === 2 && index >= 5) {
                return (
                  <PlatzhalterKachel
                    key={`f-${index}`}
                    text={index === 5 ? '57–71' : '89–103'}
                  />
                );
              }
              return element === null ? (
                <View key={`leer-${index}-${spalte}`} style={styles.luecke} />
              ) : (
                kachel(element)
              );
            })}
          </View>
        ))}

        <View style={styles.fBlock}>
          <View style={styles.zeile}>
            <View style={styles.luecke} />
            <View style={styles.luecke} />
            {LANTHANOIDE.map(kachel)}
          </View>
          <View style={styles.zeile}>
            <View style={styles.luecke} />
            <View style={styles.luecke} />
            {ACTINOIDE.map(kachel)}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gitter: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  spaltenkopfZeile: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  spaltenkopf: {
    width: KACHEL_SCHRITT,
    alignItems: 'center',
  },
  spaltenkopfText: {
    fontSize: 9,
    color: farben.textSehrLeise,
  },
  zeile: {
    flexDirection: 'row',
  },
  luecke: {
    width: KACHEL_SCHRITT,
    height: KACHEL_SCHRITT,
  },
  platzhalter: {
    width: KACHEL_GROESSE,
    height: KACHEL_GROESSE,
    margin: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  platzhalterText: {
    fontSize: 9,
    color: farben.textLeise,
  },
  fBlock: {
    marginTop: 8,
  },
  abgeblendet: {
    opacity: 0.2,
  },
});
