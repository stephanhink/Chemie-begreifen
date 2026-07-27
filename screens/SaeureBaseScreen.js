import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import InfoButton from '../components/InfoButton';
import Titrationskurve from '../components/Titrationskurve';
import { farben } from '../utils/konstanten';
import { formatiereZehnerpotenz } from '../utils/stoechiometrie';
import {
  BASEN,
  INDIKATOREN,
  SAEUREN,
  passenderIndikator,
  phBase,
  phPuffer,
  phSaeure,
  titrationskurve,
} from '../utils/saeurebase';

const BEREICHE = [
  { key: 'ph', label: 'pH-Wert' },
  { key: 'puffer', label: 'Puffer' },
  { key: 'titration', label: 'Titration' },
];

const zahl = (text) => parseFloat(String(text).replace(',', '.'));

export default function SaeureBaseScreen() {
  const [bereich, setBereich] = useState('ph');

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.kopfbereich}>
        <View style={styles.titelZeile}>
          <Text style={styles.titel}>Säuren und Basen</Text>
          <InfoButton thema="phWert" />
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

      <ScrollView
        contentContainerStyle={styles.inhalt}
        keyboardShouldPersistTaps="handled"
      >
        {bereich === 'ph' ? <PhRechner /> : null}
        {bereich === 'puffer' ? <Puffer /> : null}
        {bereich === 'titration' ? <Titration /> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------

function PhRechner() {
  const [istSaeure, setIstSaeure] = useState(true);
  const [index, setIndex] = useState(9); // Essigsäure
  const [basenIndex, setBasenIndex] = useState(2); // Ammoniak
  const [c, setC] = useState('0,1');

  const stoff = istSaeure ? SAEUREN[index] : BASEN[basenIndex];
  const cWert = zahl(c);

  const ergebnis = useMemo(() => {
    if (!Number.isFinite(cWert) || cWert <= 0) {
      return null;
    }
    return istSaeure
      ? phSaeure(cWert, stoff.pks, stoff.stark)
      : phBase(cWert, stoff.pkb, stoff.stark);
  }, [istSaeure, stoff, cWert]);

  return (
    <View>
      <View style={styles.umschalter}>
        {[true, false].map((wert) => (
          <Pressable
            key={String(wert)}
            onPress={() => setIstSaeure(wert)}
            style={[styles.halbKnopf, istSaeure === wert && styles.knopfAktiv]}
          >
            <Text
              style={[styles.knopfText, istSaeure === wert && styles.knopfTextAktiv]}
            >
              {wert ? 'Säure' : 'Base'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Stoff</Text>
      <View style={styles.stoffListe}>
        {(istSaeure ? SAEUREN : BASEN).map((s, i) => {
          const aktiv = istSaeure ? i === index : i === basenIndex;
          return (
            <Pressable
              key={s.name}
              onPress={() => (istSaeure ? setIndex(i) : setBasenIndex(i))}
              style={[styles.stoffKnopf, aktiv && styles.knopfAktiv]}
            >
              <Text style={[styles.knopfText, aktiv && styles.knopfTextAktiv]}>
                {s.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Konzentration c₀ in mol/L</Text>
      <TextInput
        style={styles.eingabe}
        value={c}
        onChangeText={setC}
        keyboardType="decimal-pad"
      />

      {ergebnis ? (
        <>
          <View style={styles.ergebnisKasten}>
            <Text style={styles.phGross}>
              pH = {ergebnis.genau.toLocaleString('de-DE', {
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text style={styles.ergebnisHinweis}>
              {stoff.name} ·{' '}
              {istSaeure
                ? `pKs ${stoff.pks.toLocaleString('de-DE')}`
                : `pKb ${stoff.pkb.toLocaleString('de-DE')}`}
              {stoff.stark ? ' · starke ' + (istSaeure ? 'Säure' : 'Base') : ''}
            </Text>
            <View style={styles.skala}>
              <View style={styles.skalaSpur}>
                <View
                  style={[
                    styles.skalaMarke,
                    { left: `${(Math.max(0, Math.min(14, ergebnis.genau)) / 14) * 100}%` },
                  ]}
                />
              </View>
              <View style={styles.skalaBeschriftung}>
                <Text style={styles.skalaText}>0 sauer</Text>
                <Text style={styles.skalaText}>7 neutral</Text>
                <Text style={styles.skalaText}>14 basisch</Text>
              </View>
            </View>
          </View>

          <Abschnitt titel="Näherung und exakter Wert" thema="naeherungPh">
            <View style={styles.vergleichZeile}>
              <Text style={styles.vergleichLabel}>Schulformel</Text>
              <Text style={styles.vergleichWert}>
                {ergebnis.naeherung.toLocaleString('de-DE', {
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View style={styles.vergleichZeile}>
              <Text style={styles.vergleichLabel}>exakt gerechnet</Text>
              <Text style={styles.vergleichWert}>
                {ergebnis.genau.toLocaleString('de-DE', {
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View style={styles.vergleichZeile}>
              <Text style={styles.vergleichLabel}>Abweichung</Text>
              <Text style={styles.vergleichWert}>
                {Math.abs(ergebnis.abweichung) < 0.005
                  ? 'keine'
                  : `${ergebnis.abweichung > 0 ? '+' : '−'}${Math.abs(
                      ergebnis.abweichung
                    ).toLocaleString('de-DE', { maximumFractionDigits: 2 })}`}
              </Text>
            </View>

            <View
              style={[
                styles.urteil,
                !ergebnis.gueltig && styles.urteilWarnung,
              ]}
            >
              <Text
                style={[
                  styles.urteilText,
                  !ergebnis.gueltig && styles.urteilTextWarnung,
                ]}
              >
                {ergebnis.gueltig
                  ? stoff.stark
                    ? 'Die Näherung trägt hier: Die Lösung ist konzentriert genug, dass die Eigendissoziation des Wassers nicht ins Gewicht fällt.'
                    : `Die Näherung trägt hier: Nur ${(ergebnis.protolysegrad * 100).toLocaleString('de-DE', { maximumFractionDigits: 1 })} % protolysieren, man darf also c(HA) ≈ c₀ setzen.`
                  : stoff.stark
                    ? 'Hier versagt die Näherung. Bei so hoher Verdünnung liefert das Wasser selbst mehr Oxonium-Ionen als die Säure — und eine Säure kann niemals basisch werden, egal wie stark man verdünnt.'
                    : `Hier versagt die Näherung: ${(ergebnis.protolysegrad * 100).toLocaleString('de-DE', { maximumFractionDigits: 1 })} % protolysieren. Die Annahme c(HA) ≈ c₀ unterschlägt einen zu großen Teil.`}
              </Text>
            </View>
          </Abschnitt>

          <Abschnitt titel="Die Ionenkonzentrationen" thema="ionenprodukt">
            <View style={styles.vergleichZeile}>
              <Text style={styles.vergleichLabel}>c(H₃O⁺)</Text>
              <Text style={styles.vergleichWert}>
                {formatiereZehnerpotenz(ergebnis.konzentrationH)} mol/L
              </Text>
            </View>
            <View style={styles.vergleichZeile}>
              <Text style={styles.vergleichLabel}>c(OH⁻)</Text>
              <Text style={styles.vergleichWert}>
                {formatiereZehnerpotenz(ergebnis.konzentrationOH)} mol/L
              </Text>
            </View>
            <Text style={styles.hinweis}>
              Das Produkt beider ist immer 10⁻¹⁴ — auch in der sauersten Lösung
              sind Hydroxid-Ionen vorhanden, nur sehr wenige.
            </Text>
          </Abschnitt>
        </>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------

function Puffer() {
  const [index, setIndex] = useState(9);
  const [cSaeure, setCSaeure] = useState('0,1');
  const [cBase, setCBase] = useState('0,1');

  const stoff = SAEUREN[index];
  const s = zahl(cSaeure);
  const b = zahl(cBase);
  const gueltig = Number.isFinite(s) && Number.isFinite(b) && s > 0 && b > 0;
  const ergebnis = gueltig ? phPuffer(s, b, stoff.pks) : null;

  return (
    <View>
      <Text style={styles.label}>Korrespondierendes Paar</Text>
      <View style={styles.stoffListe}>
        {SAEUREN.filter((x) => !x.stark).map((s2) => {
          const i = SAEUREN.indexOf(s2);
          return (
            <Pressable
              key={s2.name}
              onPress={() => setIndex(i)}
              style={[styles.stoffKnopf, i === index && styles.knopfAktiv]}
            >
              <Text style={[styles.knopfText, i === index && styles.knopfTextAktiv]}>
                {s2.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.paarZeile}>
        <View style={styles.flex}>
          <Text style={styles.label}>c(Säure)</Text>
          <TextInput
            style={styles.eingabe}
            value={cSaeure}
            onChangeText={setCSaeure}
            keyboardType="decimal-pad"
          />
          <Text style={styles.feldHinweis}>{stoff.formel}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.label}>c(Base)</Text>
          <TextInput
            style={styles.eingabe}
            value={cBase}
            onChangeText={setCBase}
            keyboardType="decimal-pad"
          />
          <Text style={styles.feldHinweis}>{stoff.base}</Text>
        </View>
      </View>

      {ergebnis ? (
        <>
          <View style={styles.ergebnisKasten}>
            <Text style={styles.phGross}>
              pH = {ergebnis.ph.toLocaleString('de-DE', {
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text style={styles.ergebnisHinweis}>
              Verhältnis Base zu Säure ={' '}
              {ergebnis.verhaeltnis.toLocaleString('de-DE', {
                maximumFractionDigits: 2,
              })}
              {' '}· pKs {stoff.pks.toLocaleString('de-DE')}
            </Text>
          </View>

          <Abschnitt titel="Henderson-Hasselbalch" thema="puffer">
            <View style={styles.formelKasten}>
              <Text style={styles.formelText}>pH = pKs + lg( c(Base) / c(Säure) )</Text>
            </View>
            <Text style={styles.text}>
              Sind beide Konzentrationen gleich, wird der Logarithmus null — dann
              ist der pH exakt gleich dem pKs. Das ist der wirksamste Punkt eines
              Puffers, weil er nach beiden Seiten gleich viel abfangen kann.
            </Text>
            <View
              style={[styles.urteil, !ergebnis.imPufferbereich && styles.urteilWarnung]}
            >
              <Text
                style={[
                  styles.urteilText,
                  !ergebnis.imPufferbereich && styles.urteilTextWarnung,
                ]}
              >
                {ergebnis.imPufferbereich
                  ? 'Das liegt im Pufferbereich (pKs ± 1). Hier hält die Lösung den pH auch bei Zugabe von Säure oder Lauge weitgehend fest.'
                  : 'Außerhalb des Pufferbereichs (pKs ± 1). Eine der beiden Komponenten ist so knapp, dass sie schnell aufgebraucht ist — die Pufferwirkung bricht dann zusammen.'}
              </Text>
            </View>
          </Abschnitt>
        </>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------

function Titration() {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(9);
  const [c0, setC0] = useState('0,1');
  const [v0, setV0] = useState('50');
  const [cTitrant, setCTitrant] = useState('0,1');

  const stoff = SAEUREN[index];
  const werte = [zahl(c0), zahl(v0), zahl(cTitrant)];
  const gueltig = werte.every((w) => Number.isFinite(w) && w > 0);

  const ergebnis = useMemo(() => {
    if (!gueltig) {
      return null;
    }
    const [c, v, ct] = werte;
    const aequivalenz = (c * v) / ct;
    return titrationskurve({
      c0: c,
      v0: v,
      pks: stoff.pks,
      stark: !!stoff.stark,
      cTitrant: ct,
      // Bis gut zum Doppelten des Äquivalenzpunkts, damit der Sprung
      // in der Mitte des Bildes liegt.
      bisMl: aequivalenz * 2,
    });
  }, [stoff, c0, v0, cTitrant]);

  const indikator = ergebnis ? passenderIndikator(ergebnis.phAequivalenz) : null;

  return (
    <View>
      <Text style={styles.label}>Vorgelegte Säure</Text>
      <View style={styles.stoffListe}>
        {SAEUREN.map((s, i) => (
          <Pressable
            key={s.name}
            onPress={() => setIndex(i)}
            style={[styles.stoffKnopf, i === index && styles.knopfAktiv]}
          >
            <Text style={[styles.knopfText, i === index && styles.knopfTextAktiv]}>
              {s.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.paarZeile}>
        <View style={styles.flex}>
          <Text style={styles.label}>c₀ in mol/L</Text>
          <TextInput
            style={styles.eingabe}
            value={c0}
            onChangeText={setC0}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.flex}>
          <Text style={styles.label}>V₀ in mL</Text>
          <TextInput
            style={styles.eingabe}
            value={v0}
            onChangeText={setV0}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <Text style={styles.label}>Maßlösung (starke Base) in mol/L</Text>
      <TextInput
        style={styles.eingabe}
        value={cTitrant}
        onChangeText={setCTitrant}
        keyboardType="decimal-pad"
      />

      {ergebnis ? (
        <>
          <View style={styles.diagrammKasten}>
            <Titrationskurve
              {...ergebnis}
              breite={width - 72}
              indikator={indikator}
            />
          </View>

          <Abschnitt titel="Was die Kurve zeigt" thema="titration">
            <Text style={styles.text}>
              {stoff.stark
                ? 'Bei einer starken Säure mit starker Base liegt der Äquivalenzpunkt bei pH 7 — es entstehen nur Wasser und ein Salz, das den pH nicht beeinflusst.'
                : `Der Äquivalenzpunkt liegt bei pH ${ergebnis.phAequivalenz.toLocaleString(
                    'de-DE',
                    { maximumFractionDigits: 2 }
                  )}, also im Basischen — nicht bei 7. Dort ist die gesamte Säure in ihre korrespondierende Base ${stoff.base} umgewandelt, und die reagiert selbst basisch.`}
            </Text>
            <Text style={styles.text}>
              Am Halbäquivalenzpunkt liegen Säure und Base im Verhältnis 1:1 vor.
              Nach Henderson-Hasselbalch ist der pH dort gleich dem pKs — genau so
              bestimmt man pKs-Werte im Labor.
            </Text>
          </Abschnitt>

          <Abschnitt titel="Passender Indikator" thema="indikatoren">
            <Text style={styles.text}>
              {indikator.name} schlägt zwischen pH{' '}
              {indikator.von.toLocaleString('de-DE')} und{' '}
              {indikator.bis.toLocaleString('de-DE')} um — das liegt im steilen
              Teil dieser Kurve und markiert den Äquivalenzpunkt deshalb genau.
            </Text>
            <View style={styles.indikatorListe}>
              {INDIKATOREN.map((ind) => (
                <View key={ind.name} style={styles.indikatorZeile}>
                  <View
                    style={[styles.indikatorPunkt, { backgroundColor: ind.farbeSauer }]}
                  />
                  <View
                    style={[styles.indikatorPunkt, { backgroundColor: ind.farbeBasisch }]}
                  />
                  <Text
                    style={[
                      styles.indikatorText,
                      ind.name === indikator.name && styles.indikatorAktiv,
                    ]}
                  >
                    {ind.name}: pH {ind.von.toLocaleString('de-DE')} bis{' '}
                    {ind.bis.toLocaleString('de-DE')}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.hinweis}>
              Ein Indikator ist selbst eine schwache Säure, deren Säure- und
              Basenform verschieden gefärbt sind. Er schlägt dort um, wo sein
              eigener pKs liegt.
            </Text>
          </Abschnitt>
        </>
      ) : null}
    </View>
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
  kopfbereich: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
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
  knopfAktiv: {
    backgroundColor: farben.primaer,
    borderColor: farben.primaer,
  },
  knopfText: { fontSize: 12, color: farben.textLeise },
  knopfTextAktiv: { color: farben.weiss, fontWeight: '700' },
  inhalt: { padding: 20, paddingTop: 12, paddingBottom: 48 },
  umschalter: { flexDirection: 'row', gap: 8 },
  halbKnopf: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: farben.rand,
  },
  label: {
    fontSize: 13,
    color: farben.textLeise,
    marginBottom: 6,
    marginTop: 14,
  },
  stoffListe: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  stoffKnopf: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: farben.rand,
  },
  eingabe: {
    borderWidth: 1,
    borderColor: farben.rand,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  paarZeile: { flexDirection: 'row', gap: 12 },
  feldHinweis: {
    fontSize: 12,
    color: farben.textSehrLeise,
    marginTop: 4,
  },
  ergebnisKasten: {
    marginTop: 18,
    padding: 16,
    borderRadius: 10,
    backgroundColor: farben.hintergrundHell,
  },
  phGross: {
    fontSize: 30,
    fontWeight: '700',
    color: farben.primaerDunkel,
  },
  ergebnisHinweis: {
    fontSize: 13,
    color: farben.textLeise,
    marginTop: 2,
  },
  skala: { marginTop: 14 },
  skalaSpur: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d8d8d5',
    justifyContent: 'center',
  },
  skalaMarke: {
    position: 'absolute',
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#0b0b0b',
    marginLeft: -2,
  },
  skalaBeschriftung: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  skalaText: { fontSize: 10, color: farben.textLeise },
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
  vergleichZeile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  vergleichLabel: { fontSize: 14, color: farben.text },
  vergleichWert: {
    fontSize: 15,
    fontWeight: '600',
    color: farben.text,
    fontVariant: ['tabular-nums'],
  },
  urteil: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: farben.hintergrundHell,
  },
  urteilWarnung: { backgroundColor: farben.warnungHintergrund },
  urteilText: {
    fontSize: 13,
    lineHeight: 19,
    color: farben.primaerDunkel,
  },
  urteilTextWarnung: { color: farben.warnung },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: farben.text,
    marginBottom: 8,
  },
  hinweis: {
    fontSize: 12,
    lineHeight: 17,
    color: farben.textLeise,
    marginTop: 6,
  },
  formelKasten: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  formelText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#111',
    textAlign: 'center',
  },
  diagrammKasten: {
    marginTop: 18,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  indikatorListe: { marginTop: 10, gap: 7 },
  indikatorZeile: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  indikatorPunkt: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(11,11,11,0.10)',
  },
  indikatorText: { fontSize: 13, color: farben.textLeise, marginLeft: 4 },
  indikatorAktiv: { color: farben.text, fontWeight: '700' },
});
