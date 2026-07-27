import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

import InfoButton from '../components/InfoButton';
import Strukturformel from '../components/Strukturformel';
import { farben } from '../utils/konstanten';
import { formatiereFormel } from '../utils/formel';
import {
  ALKAN_ISOMERE,
  ALKAN_SIEDEPUNKTE,
  STAMMNAMEN,
  STOFFKLASSEN,
  verbindung,
} from '../utils/organik';

const BEREICHE = [
  { key: 'baukasten', label: 'Baukasten' },
  { key: 'klassen', label: 'Stoffklassen' },
  { key: 'reihe', label: 'Homologe Reihe' },
];

export default function OrganikScreen() {
  const [bereich, setBereich] = useState('baukasten');

  return (
    <View style={styles.flex}>
      <View style={styles.kopfbereich}>
        <View style={styles.titelZeile}>
          <Text style={styles.titel}>Organik</Text>
          <InfoButton thema="organischeChemie" />
        </View>
        <View style={styles.leiste}>
          {BEREICHE.map((b) => (
            <Pressable
              key={b.key}
              onPress={() => setBereich(b.key)}
              style={[styles.knopf, bereich === b.key && styles.knopfAktiv]}
            >
              <Text
                style={[styles.knopfText, bereich === b.key && styles.knopfTextAktiv]}
              >
                {b.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.inhalt}>
        {bereich === 'baukasten' ? <Baukasten /> : null}
        {bereich === 'klassen' ? <Klassen /> : null}
        {bereich === 'reihe' ? <HomologeReihe /> : null}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------

function Baukasten() {
  const [klasse, setKlasse] = useState('alkohol');
  const [n, setN] = useState(3);

  const ergebnis = verbindung(klasse, n);

  return (
    <View>
      <Text style={styles.label}>Stoffklasse</Text>
      <View style={styles.leiste}>
        {STOFFKLASSEN.map((k) => (
          <Pressable
            key={k.key}
            onPress={() => setKlasse(k.key)}
            style={[styles.knopfKlein, klasse === k.key && styles.knopfAktiv]}
          >
            <Text style={[styles.knopfText, klasse === k.key && styles.knopfTextAktiv]}>
              {k.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Kohlenstoffatome</Text>
      <View style={styles.leiste}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((zahl) => (
          <Pressable
            key={zahl}
            onPress={() => setN(zahl)}
            style={[styles.zahlKnopf, n === zahl && styles.knopfAktiv]}
          >
            <Text style={[styles.knopfText, n === zahl && styles.knopfTextAktiv]}>
              {zahl}
            </Text>
          </Pressable>
        ))}
      </View>

      {ergebnis.fehler ? (
        <View style={styles.fehlerKasten}>
          <Text style={styles.fehlerText}>{ergebnis.fehler}</Text>
        </View>
      ) : (
        <>
          <View style={styles.ergebnisKasten}>
            <Text style={styles.name}>{ergebnis.name}</Text>
            {ergebnis.trivialname ? (
              <Text style={styles.trivial}>auch: {ergebnis.trivialname}</Text>
            ) : null}
            <Text style={styles.summenformel}>
              {formatiereFormel(ergebnis.summenformel)}
            </Text>
            <Text style={styles.halbstruktur}>{ergebnis.halbstruktur}</Text>
            <Text style={styles.masse}>
              M ={' '}
              {ergebnis.molareMasse.toLocaleString('de-DE', {
                maximumFractionDigits: 2,
              })}{' '}
              g/mol
            </Text>
          </View>

          <Abschnitt titel="Skelettformel" thema="strukturformel">
            <Strukturformel klasseKey={klasse} kettenlaenge={n} />
          </Abschnitt>

          <Abschnitt titel="Wie der Name entsteht" thema="nomenklatur">
            <View style={styles.namensZeile}>
              <View style={styles.namensTeil}>
                <Text style={styles.namensWert}>{STAMMNAMEN[n - 1]}</Text>
                <Text style={styles.namensLabel}>
                  Stamm für {n} C-Atome
                </Text>
              </View>
              <Text style={styles.plus}>+</Text>
              <View style={styles.namensTeil}>
                <Text style={styles.namensWert}>{ergebnis.klasse.endung}</Text>
                <Text style={styles.namensLabel}>
                  Endung der {ergebnis.klasse.name}
                </Text>
              </View>
            </View>
            <Text style={styles.text}>
              Der Name ist keine Vokabel, sondern eine Bauanleitung: Wortstamm
              für die Kettenlänge, Endung für die Stoffklasse. Wer beides kennt,
              kann jeden Namen lesen und jeden Stoff benennen — auch einen, den
              er noch nie gesehen hat.
            </Text>
          </Abschnitt>

          <Abschnitt titel="Was die Gruppe bewirkt">
            <Text style={styles.text}>{ergebnis.klasse.wirkung}</Text>
            <Text style={styles.hinweis}>{ergebnis.klasse.beispiel}</Text>
          </Abschnitt>
        </>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------

function Klassen() {
  const [offen, setOffen] = useState('alkohol');

  return (
    <View>
      <Text style={styles.feldHinweis}>
        Die funktionelle Gruppe entscheidet über die Eigenschaften — das
        Kohlenstoffgerüst ist bei allen ähnlich.
      </Text>

      {STOFFKLASSEN.map((k) => {
        const istOffen = offen === k.key;
        const beispiel = verbindung(k.key, Math.max(k.minC, 2));
        return (
          <View key={k.key} style={styles.klasseKarte}>
            <Pressable
              style={styles.klasseKopf}
              onPress={() => setOffen(istOffen ? null : k.key)}
            >
              <View style={styles.klasseText}>
                <Text style={styles.klasseName}>{k.name}</Text>
                <Text style={styles.klasseGruppe}>
                  {k.gruppe} · Endung {k.endung}
                </Text>
              </View>
              <Text style={styles.pfeil}>{istOffen ? '−' : '+'}</Text>
            </Pressable>

            {istOffen ? (
              <View style={styles.klasseInhalt}>
                <Strukturformel
                  klasseKey={k.key}
                  kettenlaenge={Math.max(k.minC, 3)}
                />
                <Text style={styles.beispielName}>
                  {beispiel.name}
                  {beispiel.trivialname ? ` (${beispiel.trivialname})` : ''} ·{' '}
                  {beispiel.halbstruktur}
                </Text>
                <Text style={styles.text}>{k.wirkung}</Text>
                <Text style={styles.hinweis}>{k.beispiel}</Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------

function HomologeReihe() {
  return (
    <View>
      <Text style={styles.feldHinweis}>
        Eine homologe Reihe ist eine Folge von Stoffen, die sich jeweils um eine
        CH₂-Gruppe unterscheiden. Ihre Eigenschaften ändern sich dabei
        regelmäßig — und genau das macht sie vorhersagbar.
      </Text>

      <Abschnitt titel="Siedepunkte der Alkane" thema="homologeReihe">
        <Siedepunktkurve />
        <Text style={styles.text}>
          Von Methan bis Decan steigt der Siedepunkt um über 330 Grad — allein
          durch längere Ketten, ohne dass sich die Art der Bindung ändert.
        </Text>
        <Text style={styles.text}>
          Der Grund sind die Van-der-Waals-Kräfte. Sie wirken zwischen den
          Molekülen und werden stärker, je größer die Berührungsfläche ist. Eine
          lange Kette hat mehr davon als eine kurze — deshalb ist Methan ein Gas
          und Decan eine Flüssigkeit.
        </Text>
        <Text style={styles.hinweis}>
          Die ersten vier Alkane sind bei Raumtemperatur gasförmig, ab Pentan
          flüssig, ab etwa 17 Kohlenstoffatomen fest. Genau darauf beruht die
          Auftrennung von Erdöl in der Raffinerie.
        </Text>
      </Abschnitt>

      <Abschnitt titel="Wie viele Isomere gibt es?" thema="isomerie">
        <View style={styles.tabelleKopf}>
          <Text style={styles.spalteName}>Alkan</Text>
          <Text style={styles.spalteZahl}>C-Atome</Text>
          <Text style={styles.spalteZahl}>Isomere</Text>
        </View>
        {ALKAN_ISOMERE.map((anzahl, i) => (
          <View key={i} style={styles.tabelleZeile}>
            <Text style={styles.spalteName}>{STAMMNAMEN[i]}an</Text>
            <Text style={styles.spalteZahl}>{i + 1}</Text>
            <Text style={[styles.spalteZahl, anzahl > 100 && styles.fett]}>
              {anzahl.toLocaleString('de-DE')}
            </Text>
          </View>
        ))}
        <Text style={styles.text}>
          Bis Propan gibt es nur eine Möglichkeit. Ab Butan lässt sich die Kette
          verzweigen, und ab da explodiert die Zahl: Decan hat 75
          Konstitutionsisomere, Dodecan bereits 355.
        </Text>
        <Text style={styles.text}>
          Das ist die eigentliche Antwort auf die Frage, warum es Millionen
          organischer Verbindungen gibt, aber nur 118 Elemente. Die Vielfalt
          entsteht nicht aus vielen Bausteinen, sondern aus den vielen Arten,
          wenige Bausteine anzuordnen.
        </Text>
        <Text style={styles.hinweis}>
          Diese Zahlen sind abgezählt, nicht berechnet — eine geschlossene Formel
          dafür gibt es nicht.
        </Text>
      </Abschnitt>
    </View>
  );
}

// Der Siedepunktverlauf. Eine Datenreihe, deshalb keine Legende — die
// Überschrift benennt sie. Die Nulllinie ist eingezeichnet, weil sie
// hier eine Bedeutung hat: Darunter ist der Stoff bei Raumtemperatur
// gasförmig.
function Siedepunktkurve() {
  const breite = 300;
  const hoehe = 160;
  const rand = { links: 34, rechts: 10, oben: 10, unten: 22 };
  const plotB = breite - rand.links - rand.rechts;
  const plotH = hoehe - rand.oben - rand.unten;

  const min = -180;
  const max = 200;
  const x = (i) => rand.links + (i / (ALKAN_SIEDEPUNKTE.length - 1)) * plotB;
  const y = (t) => rand.oben + (1 - (t - min) / (max - min)) * plotH;

  return (
    <Svg width={breite} height={hoehe}>
      {[-100, 0, 100, 200].map((t) => (
        <Line
          key={t}
          x1={rand.links}
          y1={y(t)}
          x2={breite - rand.rechts}
          y2={y(t)}
          stroke={t === 0 ? '#c3c2b7' : '#e1e0d9'}
          strokeWidth={1}
        />
      ))}
      {[-100, 0, 100, 200].map((t) => (
        <SvgText
          key={t}
          x={rand.links - 5}
          y={y(t) + 4}
          fontSize={9}
          fill="#898781"
          textAnchor="end"
        >
          {/* Typografisches Minuszeichen statt des ASCII-Bindestrichs,
              den JavaScript für negative Zahlen liefert. */}
          {t < 0 ? `−${Math.abs(t)}` : t}
        </SvgText>
      ))}

      <Polyline
        points={ALKAN_SIEDEPUNKTE.map((t, i) => `${x(i)},${y(t)}`).join(' ')}
        fill="none"
        stroke={farben.primaer}
        strokeWidth={2}
      />
      {ALKAN_SIEDEPUNKTE.map((t, i) => (
        <Circle key={i} cx={x(i)} cy={y(t)} r={3} fill={farben.primaer} />
      ))}

      {/* Die äußeren Beschriftungen werden nach innen ausgerichtet —
          mittig zentriert ragten sie über den Bildrand hinaus. */}
      {[0, 4, 9].map((i, stelle) => (
        <SvgText
          key={i}
          x={x(i)}
          y={hoehe - 6}
          fontSize={9}
          fill="#898781"
          textAnchor={stelle === 0 ? 'start' : stelle === 2 ? 'end' : 'middle'}
        >
          {STAMMNAMEN[i]}an
        </SvgText>
      ))}
    </Svg>
  );
}

// ---------------------------------------------------------------------

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
  flex: { flex: 1 },
  kopfbereich: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  titelZeile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  titel: { fontSize: 26, fontWeight: '700' },
  leiste: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  knopf: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: farben.rand,
  },
  knopfKlein: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: farben.rand,
  },
  zahlKnopf: {
    width: 32,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: farben.rand,
  },
  knopfAktiv: { backgroundColor: farben.primaer, borderColor: farben.primaer },
  knopfText: { fontSize: 12, color: farben.textLeise },
  knopfTextAktiv: { color: farben.weiss, fontWeight: '700' },
  inhalt: { padding: 20, paddingTop: 12, paddingBottom: 48 },
  label: {
    fontSize: 13,
    color: farben.textLeise,
    marginBottom: 6,
    marginTop: 14,
  },
  feldHinweis: {
    fontSize: 13,
    lineHeight: 19,
    color: farben.textLeise,
    marginBottom: 4,
  },
  fehlerKasten: {
    marginTop: 18,
    padding: 12,
    borderRadius: 8,
    backgroundColor: farben.warnungHintergrund,
  },
  fehlerText: { fontSize: 14, lineHeight: 20, color: farben.warnung },
  ergebnisKasten: {
    marginTop: 18,
    padding: 16,
    borderRadius: 10,
    backgroundColor: farben.hintergrundHell,
  },
  name: { fontSize: 26, fontWeight: '700', color: farben.primaerDunkel },
  trivial: { fontSize: 13, color: farben.textLeise, marginTop: 2 },
  summenformel: {
    fontSize: 20,
    color: farben.primaerDunkel,
    marginTop: 10,
  },
  halbstruktur: {
    fontFamily: 'monospace',
    fontSize: 15,
    color: farben.primaerDunkel,
    marginTop: 6,
  },
  masse: { fontSize: 13, color: farben.textLeise, marginTop: 8 },
  abschnitt: { marginTop: 22 },
  abschnittKopf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  abschnittTitel: {
    fontSize: 12,
    fontWeight: '700',
    color: farben.textLeise,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  namensZeile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  namensTeil: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  namensWert: { fontSize: 17, fontWeight: '700', color: '#111' },
  namensLabel: { fontSize: 11, color: farben.textLeise, marginTop: 2 },
  plus: { fontSize: 18, fontWeight: '700', color: farben.textLeise },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: farben.text,
    marginTop: 8,
  },
  hinweis: {
    fontSize: 12,
    lineHeight: 17,
    color: farben.textLeise,
    marginTop: 8,
  },
  klasseKarte: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  klasseKopf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  klasseText: { flex: 1 },
  klasseName: { fontSize: 16, fontWeight: '700', color: farben.text },
  klasseGruppe: { fontSize: 13, color: farben.textLeise, marginTop: 2 },
  pfeil: { fontSize: 20, color: farben.primaer, width: 16, textAlign: 'center' },
  klasseInhalt: {
    paddingHorizontal: 14,
    paddingBottom: 16,
  },
  beispielName: {
    fontSize: 14,
    fontWeight: '600',
    color: farben.primaerDunkel,
    marginTop: 6,
  },
  tabelleKopf: {
    flexDirection: 'row',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tabelleZeile: { flexDirection: 'row', paddingVertical: 5 },
  spalteName: { flex: 1, fontSize: 14, color: farben.text },
  spalteZahl: {
    width: 72,
    textAlign: 'right',
    fontSize: 14,
    color: farben.text,
    fontVariant: ['tabular-nums'],
  },
  fett: { fontWeight: '700' },
});
