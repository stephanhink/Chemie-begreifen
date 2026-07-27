import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import InfoButton from '../components/InfoButton';
import ElementDetail from '../components/ElementDetail';
import ElementKachel, {
  KACHEL_GROESSE,
  KACHEL_SCHRITT,
} from '../components/ElementKachel';
import { farben } from '../utils/konstanten';
import {
  AGGREGATZUSTAENDE,
  ELEMENTE,
  GRUPPENNAMEN,
  STOFFKLASSEN,
  elementNachZ,
  enLegende,
  farbeFuerEN,
  stoffklasseVon,
  sucheElemente,
} from '../utils/elemente';

// Die drei Einfärbungen. Jede beantwortet eine andere Frage — deshalb
// umschaltbar statt alles gleichzeitig.
const MODI = [
  { key: 'stoffklasse', label: 'Stoffklasse', thema: 'metalleNichtmetalle' },
  { key: 'en', label: 'Elektronegativität', thema: 'elektronegativitaet' },
  { key: 'aggregat', label: 'Zustand', thema: null },
];

// Welche Farbe bekommt eine Kachel im gewählten Modus?
function farbeFuer(element, modus) {
  if (modus === 'en') {
    return farbeFuerEN(element.en);
  }
  if (modus === 'aggregat') {
    return AGGREGATZUSTAENDE[element.aggregat];
  }
  return STOFFKLASSEN[stoffklasseVon(element)];
}

// Der Hauptblock: 7 Perioden × 18 Gruppen. Lanthanoide und Actinoide
// fehlen hier — sie stehen unten in eigenen Zeilen, sonst wäre die
// Tabelle 32 Spalten breit.
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

export default function PeriodensystemScreen() {
  const [modus, setModus] = useState('stoffklasse');
  const [suche, setSuche] = useState('');
  const [auswahl, setAuswahl] = useState(null);

  // Trefferliste der Suche als Set von Ordnungszahlen: Alles, was nicht
  // passt, wird abgeblendet statt entfernt — so bleibt die Form des
  // Periodensystems erhalten und man sieht, WO der Treffer sitzt.
  const treffer = useMemo(() => {
    if (!suche.trim()) {
      return null;
    }
    return new Set(sucheElemente(suche).map((el) => el.z));
  }, [suche]);

  // Wird nur mit echten Elementen aufgerufen — die Lücken im Gitter
  // behandelt der Aufrufer, weil er weiß, an welcher Stelle er steht.
  function renderKachel(element) {
    const { farbe, textfarbe } = farbeFuer(element, modus);
    const abgeblendet = treffer !== null && !treffer.has(element.z);

    return (
      <View key={element.z} style={abgeblendet ? styles.abgeblendet : null}>
        <ElementKachel
          element={element}
          farbe={farbe}
          textfarbe={textfarbe}
          ausgewaehlt={auswahl?.z === element.z}
          onPress={setAuswahl}
        />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <View style={styles.kopfbereich}>
        <View style={styles.titelZeile}>
          <Text style={styles.titel}>Periodensystem</Text>
          <InfoButton thema="periodensystem" />
        </View>

        <TextInput
          style={styles.suchfeld}
          value={suche}
          onChangeText={setSuche}
          placeholder="Suchen: Eisen, Fe oder 26"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />

        <View style={styles.modusLeiste}>
          {MODI.map((m) => (
            <Pressable
              key={m.key}
              onPress={() => setModus(m.key)}
              style={[
                styles.modusKnopf,
                modus === m.key && styles.modusKnopfAktiv,
              ]}
            >
              <Text
                style={[
                  styles.modusText,
                  modus === m.key && styles.modusTextAktiv,
                ]}
              >
                {m.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView>
        {/* Statt die Kacheln zu schrumpfen, bis man sie weder lesen noch
            treffen kann, wird waagerecht gescrollt. */}
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
                  // Gruppe 3, Periode 6 und 7: Verweis auf den f-Block.
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
                    renderKachel(element)
                  );
                })}
              </View>
            ))}

            <View style={styles.fBlock}>
              <View style={styles.zeile}>
                <View style={styles.luecke} />
                <View style={styles.luecke} />
                {LANTHANOIDE.map(renderKachel)}
              </View>
              <View style={styles.zeile}>
                <View style={styles.luecke} />
                <View style={styles.luecke} />
                {ACTINOIDE.map(renderKachel)}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.unterbereich}>
          <Legende modus={modus} />

          <View style={styles.leseHilfe}>
            <View style={styles.leseHilfeZeile}>
              <Text style={styles.leseHilfeTitel}>Wie man das Gitter liest</Text>
            </View>
            <View style={styles.leseHilfeZeile}>
              <Text style={styles.leseHilfeText}>
                Eine Spalte ist eine Gruppe: gleiche Zahl an Außenelektronen,
                ähnliches chemisches Verhalten.
              </Text>
              <InfoButton thema="hauptgruppe" />
            </View>
            <View style={styles.leseHilfeZeile}>
              <Text style={styles.leseHilfeText}>
                Eine Zeile ist eine Periode: gleiche Zahl an Elektronenschalen.
              </Text>
              <InfoButton thema="periode" />
            </View>
            <View style={styles.leseHilfeZeile}>
              <Text style={styles.leseHilfeText}>
                Die Spalten 1, 2 und 13 bis 18 sind die Hauptgruppen, die
                Spalten 3 bis 12 die Nebengruppen.
              </Text>
              <InfoButton thema="nebengruppe" />
            </View>
          </View>
        </View>
      </ScrollView>

      <ElementDetail element={auswahl} onClose={() => setAuswahl(null)} />
    </View>
  );
}

// Die Legende ist Pflicht, nicht Zierde: Ohne sie wäre die Farbe die
// einzige Information, die niemand entschlüsseln kann.
function Legende({ modus }) {
  if (modus === 'en') {
    const stufen = enLegende();
    return (
      <View style={styles.legende}>
        <View style={styles.legendeKopf}>
          <Text style={styles.legendeTitel}>Elektronegativität</Text>
          <InfoButton thema="elektronegativitaet" />
        </View>
        <View style={styles.rampe}>
          {stufen.map((stufe) => (
            <View
              key={stufe.farbe}
              style={[styles.rampenStufe, { backgroundColor: stufe.farbe }]}
            />
          ))}
        </View>
        <View style={styles.rampenBeschriftung}>
          <Text style={styles.legendeText}>0,7 — zieht kaum an</Text>
          <Text style={styles.legendeText}>3,98 — zieht am stärksten</Text>
        </View>
        <Text style={styles.legendeHinweis}>
          Grau: kein Wert bekannt. Das ist etwas anderes als ein kleiner
          Wert — diese Elemente gehen kaum Verbindungen ein.
        </Text>
      </View>
    );
  }

  const eintraege =
    modus === 'aggregat'
      ? Object.values(AGGREGATZUSTAENDE)
      : Object.values(STOFFKLASSEN);

  return (
    <View style={styles.legende}>
      <View style={styles.legendeKopf}>
        <Text style={styles.legendeTitel}>
          {modus === 'aggregat' ? 'Zustand bei 25 °C' : 'Stoffklasse'}
        </Text>
        {modus === 'aggregat' ? null : (
          <InfoButton thema="metalleNichtmetalle" />
        )}
      </View>
      <View style={styles.legendeListe}>
        {eintraege.map((eintrag) => (
          <View key={eintrag.label} style={styles.legendeEintrag}>
            <View
              style={[styles.legendePunkt, { backgroundColor: eintrag.farbe }]}
            />
            <Text style={styles.legendeText}>{eintrag.label}</Text>
          </View>
        ))}
      </View>
      {modus === 'stoffklasse' ? (
        <Text style={styles.legendeHinweis}>
          Die Grenze zwischen Metallen und Nichtmetallen verläuft als Treppe
          quer durchs Periodensystem. Genau auf dieser Treppe sitzen die
          Halbmetalle.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  kopfbereich: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  titelZeile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titel: {
    fontSize: 26,
    fontWeight: '700',
  },
  suchfeld: {
    borderWidth: 1,
    borderColor: farben.rand,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 15,
    marginTop: 12,
  },
  modusLeiste: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  modusKnopf: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: farben.rand,
  },
  modusKnopfAktiv: {
    backgroundColor: farben.primaer,
    borderColor: farben.primaer,
  },
  modusText: {
    fontSize: 12,
    color: farben.textLeise,
  },
  modusTextAktiv: {
    color: farben.weiss,
    fontWeight: '700',
  },
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
  // Nicht-Treffer bei aktiver Suche: sichtbar, aber zurückgenommen.
  abgeblendet: {
    opacity: 0.2,
  },
  unterbereich: {
    padding: 20,
    paddingTop: 12,
  },
  legende: {
    backgroundColor: farben.hintergrundHell,
    borderRadius: 10,
    padding: 14,
  },
  legendeKopf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  legendeTitel: {
    fontSize: 12,
    fontWeight: '700',
    color: farben.primaer,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  legendeListe: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  legendeEintrag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendePunkt: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendeText: {
    fontSize: 13,
    color: farben.primaerDunkel,
  },
  legendeHinweis: {
    fontSize: 12,
    lineHeight: 17,
    color: farben.textLeise,
    marginTop: 10,
  },
  rampe: {
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
  },
  rampenStufe: {
    flex: 1,
    height: 16,
  },
  rampenBeschriftung: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  leseHilfe: {
    marginTop: 16,
  },
  leseHilfeZeile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  leseHilfeTitel: {
    fontSize: 12,
    fontWeight: '700',
    color: farben.textLeise,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leseHilfeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: farben.text,
  },
});
