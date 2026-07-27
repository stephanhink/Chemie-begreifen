import { StyleSheet, Text, View } from 'react-native';

import InfoButton from './InfoButton';
import { farben } from '../utils/konstanten';
import { formatiereFormel } from '../utils/formel';
import { REAKTIONSTYPEN, gleichungText } from '../utils/reaktionen';
import { holeThema } from '../utils/wissen';

// Stellt eine Reaktion aus der Sammlung dar.
//
// Die Reihenfolge der Abschnitte folgt der Regel aus der CLAUDE.md:
// erst die Gleichung und was passiert, dann die Bedingungen, dann die
// Energie, zuletzt der Alltagsbezug. Wer nur wissen will, was entsteht,
// hört nach dem ersten Absatz auf.
export default function ReaktionsKarte({ reaktion }) {
  const typ = REAKTIONSTYPEN[reaktion.typ];

  return (
    <View style={styles.karte}>
      <Text style={styles.name}>{reaktion.name}</Text>

      <View style={styles.gleichungKasten}>
        <Text style={styles.gleichung}>
          {gleichungText(reaktion, formatiereFormel)}
        </Text>
      </View>

      <View style={styles.merkmale}>
        <Merkmal text={typ.label} />
        {reaktion.gleichgewicht ? <Merkmal text="Gleichgewicht" /> : null}
        {reaktion.enthalpie !== null && reaktion.enthalpie !== undefined ? (
          <Merkmal
            text={reaktion.enthalpie < 0 ? 'exotherm' : 'endotherm'}
            hervorgehoben={reaktion.enthalpie > 0}
          />
        ) : null}
      </View>

      {reaktion.text.map((absatz, i) => (
        <Text key={i} style={styles.absatz}>
          {absatz}
        </Text>
      ))}

      <Abschnitt titel="Was es dafür braucht">
        <Text style={styles.text}>{reaktion.bedingungen}</Text>
      </Abschnitt>

      {reaktion.enthalpie !== null && reaktion.enthalpie !== undefined ? (
        <Abschnitt titel="Energiebilanz" thema="exothermEndotherm">
          <Text style={styles.text}>
            ΔH = {reaktion.enthalpie > 0 ? '+' : '−'}
            {Math.abs(reaktion.enthalpie).toLocaleString('de-DE')} kJ
          </Text>
          <Text style={styles.hinweis}>
            {reaktion.enthalpie < 0
              ? 'Negativ bedeutet: Energie wird frei. Die Produkte sind energieärmer als die Ausgangsstoffe.'
              : 'Positiv bedeutet: Energie muss zugeführt werden. Ohne ständigen Nachschub kommt die Reaktion zum Stillstand.'}{' '}
            Der Wert gilt für die Gleichung genau so, wie sie oben steht — mit
            allen Koeffizienten.
          </Text>
        </Abschnitt>
      ) : null}

      {reaktion.elektronen ? (
        <Abschnitt titel="Was mit den Elektronen passiert" thema="redoxreaktion">
          <Text style={styles.text}>{reaktion.elektronen}</Text>
        </Abschnitt>
      ) : null}

      {reaktion.alltag ? (
        <Abschnitt titel="Wo dir das begegnet">
          <Text style={styles.text}>{reaktion.alltag}</Text>
        </Abschnitt>
      ) : null}

      {reaktion.mehr?.length ? (
        <View style={styles.mehrBereich}>
          <Text style={styles.mehrTitel}>Mehr dazu</Text>
          {/* Der Knopf trägt seinen Titel daneben — ein nacktes "i"
              verrät nicht, wohin es führt. */}
          {reaktion.mehr.map((id) => {
            const thema = holeThema(id);
            if (!thema) {
              return null;
            }
            return (
              <View key={id} style={styles.mehrZeile}>
                <InfoButton thema={id} />
                <Text style={styles.mehrText}>{thema.titel}</Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

function Merkmal({ text, hervorgehoben }) {
  return (
    <View style={[styles.merkmal, hervorgehoben && styles.merkmalHervor]}>
      <Text style={[styles.merkmalText, hervorgehoben && styles.merkmalTextHervor]}>
        {text}
      </Text>
    </View>
  );
}

function Abschnitt({ titel, thema, children }) {
  return (
    <View style={styles.abschnitt}>
      <View style={styles.abschnittKopf}>
        <Text style={styles.abschnittTitel}>{titel}</Text>
        {thema ? <InfoButton thema={thema} /> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  karte: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  name: {
    fontSize: 19,
    fontWeight: '700',
    color: farben.primaerDunkel,
  },
  gleichungKasten: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  gleichung: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#111',
    textAlign: 'center',
  },
  merkmale: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    marginBottom: 12,
  },
  merkmal: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    backgroundColor: farben.hintergrundHell,
  },
  merkmalHervor: {
    backgroundColor: farben.warnungHintergrund,
  },
  merkmalText: {
    fontSize: 11,
    fontWeight: '600',
    color: farben.primaerDunkel,
  },
  merkmalTextHervor: {
    color: farben.warnung,
  },
  absatz: {
    fontSize: 15,
    lineHeight: 22,
    color: farben.text,
    marginBottom: 10,
  },
  abschnitt: {
    marginTop: 12,
  },
  abschnittKopf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  abschnittTitel: {
    fontSize: 12,
    fontWeight: '700',
    color: farben.textLeise,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: farben.text,
  },
  hinweis: {
    fontSize: 12,
    lineHeight: 17,
    color: farben.textLeise,
    marginTop: 4,
  },
  mehrBereich: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  mehrZeile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
  },
  mehrText: {
    fontSize: 14,
    color: farben.primaer,
  },
  mehrTitel: {
    fontSize: 12,
    fontWeight: '700',
    color: farben.textLeise,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
});
