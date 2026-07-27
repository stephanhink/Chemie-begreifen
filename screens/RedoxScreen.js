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
} from 'react-native';

import InfoButton from '../components/InfoButton';
import { farben } from '../utils/konstanten';
import { formatiereFormel } from '../utils/formel';
import { formatiereZahl, molareMasse } from '../utils/stoechiometrie';
import { gleicheAus, gleichungAlsText } from '../utils/gleichung';
import {
  HALBZELLEN,
  analysiereRedox,
  elektrolyse,
  nernst,
  oxidationszahlen,
  roemisch,
  zellspannung,
} from '../utils/redox';

const BEREICHE = [
  { key: 'zahlen', label: 'Oxidationszahlen' },
  { key: 'reihe', label: 'Spannungsreihe' },
  { key: 'nernst', label: 'Nernst' },
  { key: 'elektrolyse', label: 'Elektrolyse' },
];

const zahl = (text) => parseFloat(String(text).replace(',', '.'));

export default function RedoxScreen() {
  const [bereich, setBereich] = useState('zahlen');

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.kopfbereich}>
        <View style={styles.titelZeile}>
          <Text style={styles.titel}>Redox</Text>
          <InfoButton thema="redoxreaktion" />
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
        {bereich === 'zahlen' ? <Oxidationszahlen /> : null}
        {bereich === 'reihe' ? <Spannungsreihe /> : null}
        {bereich === 'nernst' ? <Nernst /> : null}
        {bereich === 'elektrolyse' ? <Elektrolyse /> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------

function Oxidationszahlen() {
  const [formel, setFormel] = useState('KMnO4');
  const [ladung, setLadung] = useState(0);
  const [gleichung, setGleichung] = useState('Fe2O3 + CO -> Fe + CO2');

  const ergebnis = useMemo(() => {
    if (!formel.trim()) {
      return null;
    }
    try {
      return oxidationszahlen(formel, ladung);
    } catch (f) {
      return { fehler: f.message };
    }
  }, [formel, ladung]);

  const reaktion = useMemo(() => {
    if (!gleichung.trim()) {
      return null;
    }
    try {
      const ausgeglichen = gleicheAus(gleichung);
      return { ausgeglichen, analyse: analysiereRedox(ausgeglichen) };
    } catch (f) {
      return { fehler: f.message };
    }
  }, [gleichung]);

  return (
    <View>
      <Text style={styles.label}>Formel</Text>
      <TextInput
        style={styles.eingabe}
        value={formel}
        onChangeText={setFormel}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="z. B. KMnO4 oder H2O2"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Ladung des Teilchens</Text>
      <View style={styles.leiste}>
        {[-3, -2, -1, 0, 1, 2, 3].map((l) => (
          <Pressable
            key={l}
            onPress={() => setLadung(l)}
            style={[styles.knopfKlein, ladung === l && styles.knopfAktiv]}
          >
            <Text style={[styles.knopfText, ladung === l && styles.knopfTextAktiv]}>
              {l === 0 ? 'neutral' : `${l > 0 ? '+' : '−'}${Math.abs(l)}`}
            </Text>
          </Pressable>
        ))}
      </View>

      {ergebnis?.fehler ? <Fehler text={ergebnis.fehler} /> : null}

      {ergebnis?.zahlen ? (
        <>
          <View style={styles.ergebnisKasten}>
            <Text style={styles.ergebnisFormel}>
              {formatiereFormel(formel)}
              {ladung !== 0
                ? ` ${Math.abs(ladung) === 1 ? '' : Math.abs(ladung)}${ladung > 0 ? '⁺' : '⁻'}`
                : ''}
            </Text>
            <View style={styles.zahlenListe}>
              {Object.entries(ergebnis.zahlen).map(([symbol, wert]) => (
                <View key={symbol} style={styles.zahlKachel}>
                  <Text style={styles.zahlSymbol}>{symbol}</Text>
                  <Text style={styles.zahlWert}>{roemisch(wert)}</Text>
                </View>
              ))}
            </View>
          </View>

          <Abschnitt titel="Wie das hergeleitet wird" thema="oxidationszahl">
            {ergebnis.schritte.map((schritt, i) => (
              <View key={i} style={styles.schrittZeile}>
                <Text style={styles.schrittNummer}>{i + 1}</Text>
                <Text style={styles.schrittText}>{schritt}</Text>
              </View>
            ))}
          </Abschnitt>
        </>
      ) : null}

      <Abschnitt titel="Zum Ausprobieren">
        {[
          { f: 'H2O2', l: 0, warum: 'Peroxid — hier ist Sauerstoff −I' },
          { f: 'NaH', l: 0, warum: 'Hydrid — hier ist Wasserstoff −I' },
          { f: 'OF2', l: 0, warum: 'Sauerstoff wird positiv' },
          { f: 'Fe3O4', l: 0, warum: 'ein gebrochener Mittelwert' },
          { f: 'Cr2O7', l: -2, warum: 'Dichromat, mit Ladung −2' },
          { f: 'C2H4O2', l: 0, warum: 'Essigsäure — Kohlenstoff im Mittel 0' },
        ].map((b) => (
          <Pressable
            key={b.f + b.l}
            style={styles.beispielZeile}
            onPress={() => {
              setFormel(b.f);
              setLadung(b.l);
            }}
          >
            <Text style={styles.beispielFormel}>{formatiereFormel(b.f)}</Text>
            <Text style={styles.beispielWarum}>{b.warum}</Text>
          </Pressable>
        ))}
      </Abschnitt>

      <View style={styles.trenner} />

      <Text style={styles.label}>Reaktion untersuchen</Text>
      <TextInput
        style={styles.eingabe}
        value={gleichung}
        onChangeText={setGleichung}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text style={styles.feldHinweis}>
        Wer wird oxidiert, wer reduziert? Die App gleicht die Gleichung aus und
        vergleicht die Oxidationszahlen auf beiden Seiten.
      </Text>

      {reaktion?.fehler ? <Fehler text={reaktion.fehler} /> : null}

      {reaktion?.ausgeglichen ? (
        <View style={styles.ergebnisKasten}>
          <Text style={styles.gleichung}>
            {gleichungAlsText(reaktion.ausgeglichen, formatiereFormel)}
          </Text>

          {reaktion.analyse.fehler ? (
            <Text style={styles.hinweis}>{reaktion.analyse.fehler}</Text>
          ) : reaktion.analyse.istRedox ? (
            <View style={styles.aenderungen}>
              {reaktion.analyse.aenderungen.map((a) => (
                <View key={a.symbol} style={styles.aenderungZeile}>
                  <View
                    style={[
                      styles.aenderungMarke,
                      {
                        backgroundColor:
                          a.art === 'oxidation' ? '#eb6834' : '#2a78d6',
                      },
                    ]}
                  />
                  <Text style={styles.aenderungText}>
                    <Text style={styles.fett}>{a.symbol}</Text> geht von{' '}
                    {roemisch(a.von)} in {formatiereFormel(a.vonFormel)} auf{' '}
                    {roemisch(a.nach)} in {formatiereFormel(a.nachFormel)} —{' '}
                    {a.art === 'oxidation'
                      ? 'gibt Elektronen ab, wird oxidiert'
                      : 'nimmt Elektronen auf, wird reduziert'}
                    .
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.hinweis}>
              Keine Oxidationszahl ändert sich — das ist keine Redoxreaktion.
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------

function Spannungsreihe() {
  const [a, setA] = useState(6); // Zink
  const [b, setB] = useState(12); // Kupfer

  const zelle = zellspannung(HALBZELLEN[a], HALBZELLEN[b]);

  // Es sind immer genau zwei Halbzellen gewählt. Tippt man eine dritte
  // an, rückt die ältere heraus — so muss man nie erst etwas abwählen.
  function waehle(i) {
    if (i === a || i === b) {
      return;
    }
    setA(b);
    setB(i);
  }

  return (
    <View>
      <Text style={styles.feldHinweis}>
        Zwei Halbzellen antippen. Die mit dem höheren Potential wird zum
        Pluspol.
      </Text>

      <View style={styles.reiheKasten}>
        {HALBZELLEN.map((h, i) => {
          const gewaehlt = i === a || i === b;
          return (
            <Pressable
              key={h.name}
              style={[styles.reiheZeile, gewaehlt && styles.reiheZeileAktiv]}
              onPress={() => waehle(i)}
            >
              <Text style={[styles.reihePaar, gewaehlt && styles.fett]}>
                {h.ox} / {h.red}
              </Text>
              <Text style={[styles.reiheWert, gewaehlt && styles.fett]}>
                {h.e0 > 0 ? '+' : h.e0 < 0 ? '−' : '±'}
                {Math.abs(h.e0).toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                })} V
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.ergebnisKasten}>
        <Text style={styles.spannungGross}>
          ΔE = {zelle.spannung.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} V
        </Text>
        <Text style={styles.ergebnisHinweis}>
          {zelle.anode.name} / {zelle.kathode.name}
        </Text>
      </View>

      <Abschnitt titel="Wer macht was" thema="spannungsreihe">
        <View style={styles.polZeile}>
          <View style={[styles.polMarke, { backgroundColor: '#eb6834' }]} />
          <Text style={styles.polText}>
            <Text style={styles.fett}>Minuspol (Anode): {zelle.anode.red}</Text>{' '}
            gibt Elektronen ab und wird oxidiert. Das unedlere Metall geht in
            Lösung.
          </Text>
        </View>
        <View style={styles.polZeile}>
          <View style={[styles.polMarke, { backgroundColor: '#2a78d6' }]} />
          <Text style={styles.polText}>
            <Text style={styles.fett}>Pluspol (Kathode): {zelle.kathode.ox}</Text>{' '}
            nimmt Elektronen auf und wird reduziert. Hier scheidet sich Stoff
            ab.
          </Text>
        </View>
        <View style={styles.formelKasten}>
          <Text style={styles.formelText}>ΔE = E(Kathode) − E(Anode)</Text>
        </View>
        <Text style={styles.text}>
          Die Reihe sagt außerdem voraus, was miteinander reagiert: Ein Metall
          kann immer die Ionen jedes Partners verdrängen, der weiter unten in
          der Tabelle steht. Zink löst Kupfer aus seiner Lösung heraus,
          umgekehrt passiert nichts.
        </Text>
        <Text style={styles.hinweis}>
          Die Werte sind gemessen, nicht berechenbar — sie gelten bei 25 °C,
          1 mol/L und 1013 hPa. Weichen die Konzentrationen ab, hilft die
          Nernst-Gleichung.
        </Text>
      </Abschnitt>
    </View>
  );
}

// ---------------------------------------------------------------------

function Nernst() {
  const [index, setIndex] = useState(12); // Kupfer
  const [cOx, setCOx] = useState('0,001');
  const [cRed, setCRed] = useState('1');
  const [temperatur, setTemperatur] = useState('25');

  const halbzelle = HALBZELLEN[index];
  const werte = [zahl(cOx), zahl(cRed), zahl(temperatur)];
  const gueltig =
    Number.isFinite(werte[0]) &&
    werte[0] > 0 &&
    Number.isFinite(werte[1]) &&
    werte[1] > 0 &&
    Number.isFinite(werte[2]);

  const ergebnis = gueltig
    ? nernst(halbzelle.e0, halbzelle.z, werte[0], werte[1], werte[2])
    : null;

  return (
    <View>
      <Text style={styles.label}>Halbzelle</Text>
      <View style={styles.leiste}>
        {HALBZELLEN.map((h, i) => (
          <Pressable
            key={h.name}
            onPress={() => setIndex(i)}
            style={[styles.knopfKlein, i === index && styles.knopfAktiv]}
          >
            <Text style={[styles.knopfText, i === index && styles.knopfTextAktiv]}>
              {h.ox}/{h.red}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.paarZeile}>
        <View style={styles.flex}>
          <Text style={styles.label}>c(oxidiert)</Text>
          <TextInput
            style={styles.eingabe}
            value={cOx}
            onChangeText={setCOx}
            keyboardType="decimal-pad"
          />
          <Text style={styles.feldHinweis}>{halbzelle.ox} in mol/L</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.label}>c(reduziert)</Text>
          <TextInput
            style={styles.eingabe}
            value={cRed}
            onChangeText={setCRed}
            keyboardType="decimal-pad"
          />
          <Text style={styles.feldHinweis}>{halbzelle.red} in mol/L</Text>
        </View>
      </View>

      <Text style={styles.label}>Temperatur in °C</Text>
      <TextInput
        style={styles.eingabe}
        value={temperatur}
        onChangeText={setTemperatur}
        keyboardType="numbers-and-punctuation"
      />

      {ergebnis ? (
        <>
          <View style={styles.ergebnisKasten}>
            <Text style={styles.spannungGross}>
              E = {ergebnis.genau.toLocaleString('de-DE', {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })} V
            </Text>
            <Text style={styles.ergebnisHinweis}>
              Standardpotential E° ={' '}
              {halbzelle.e0.toLocaleString('de-DE', {
                minimumFractionDigits: 2,
              })} V · z = {halbzelle.z}
            </Text>
          </View>

          <Abschnitt titel="Näherung und exakter Wert" thema="nernstThema">
            <View style={styles.formelKasten}>
              <Text style={styles.formelText}>
                exakt:  E = E° + (R·T)/(z·F) · ln( c(Ox)/c(Red) )
              </Text>
              <Text style={styles.formelText}>
                Schule: E = E° + (0,059 V/z) · lg( c(Ox)/c(Red) )
              </Text>
            </View>
            <View style={styles.vergleichZeile}>
              <Text style={styles.vergleichLabel}>Schulformel</Text>
              <Text style={styles.vergleichWert}>
                {ergebnis.naeherung.toLocaleString('de-DE', {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                })} V
              </Text>
            </View>
            <View style={styles.vergleichZeile}>
              <Text style={styles.vergleichLabel}>exakt gerechnet</Text>
              <Text style={styles.vergleichWert}>
                {ergebnis.genau.toLocaleString('de-DE', {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                })} V
              </Text>
            </View>
            <View style={styles.vergleichZeile}>
              <Text style={styles.vergleichLabel}>Abweichung</Text>
              <Text style={styles.vergleichWert}>
                {(ergebnis.abweichung * 1000).toLocaleString('de-DE', {
                  maximumFractionDigits: 1,
                })} mV
              </Text>
            </View>

            <View
              style={[
                styles.urteil,
                Math.abs(werte[2] - 25) > 5 && styles.urteilWarnung,
              ]}
            >
              <Text
                style={[
                  styles.urteilText,
                  Math.abs(werte[2] - 25) > 5 && styles.urteilTextWarnung,
                ]}
              >
                {Math.abs(werte[2] - 25) > 5
                  ? `Die 0,059 V der Schulformel gelten nur bei 25 °C — bei ${werte[2].toLocaleString(
                      'de-DE'
                    )} °C sind es ${ergebnis.faktorBeiT.toLocaleString('de-DE', {
                      maximumFractionDigits: 4,
                    })} V. Deshalb die Abweichung.`
                  : `Die 0,059 V sind keine Naturkonstante, sondern (R·T)/F · ln 10 bei 25 °C: ${ergebnis.faktorBei25.toLocaleString(
                      'de-DE',
                      { maximumFractionDigits: 4 }
                    )} V. Bei dieser Temperatur trägt die Näherung.`}
              </Text>
            </View>
          </Abschnitt>
        </>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------

function Elektrolyse() {
  const [formel, setFormel] = useState('Cu');
  const [z, setZ] = useState(2);
  const [strom, setStrom] = useState('1');
  const [minuten, setMinuten] = useState('60');

  const ergebnis = useMemo(() => {
    const i = zahl(strom);
    const t = zahl(minuten);
    if (!Number.isFinite(i) || !Number.isFinite(t) || i <= 0 || t <= 0) {
      return null;
    }
    try {
      const M = molareMasse(formel);
      return {
        M,
        ...elektrolyse({ stromstaerke: i, sekunden: t * 60, z, molareMasse: M }),
      };
    } catch (f) {
      return { fehler: f.message };
    }
  }, [formel, z, strom, minuten]);

  return (
    <View>
      <Text style={styles.label}>Abgeschiedener Stoff</Text>
      <TextInput
        style={styles.eingabe}
        value={formel}
        onChangeText={setFormel}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Übertragene Elektronen z</Text>
      <View style={styles.leiste}>
        {[1, 2, 3, 4].map((n) => (
          <Pressable
            key={n}
            onPress={() => setZ(n)}
            style={[styles.knopfKlein, z === n && styles.knopfAktiv]}
          >
            <Text style={[styles.knopfText, z === n && styles.knopfTextAktiv]}>
              {n}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.feldHinweis}>
        So viele Elektronen braucht ein Teilchen: Cu²⁺ zwei, Ag⁺ eines, Al³⁺
        drei.
      </Text>

      <View style={styles.paarZeile}>
        <View style={styles.flex}>
          <Text style={styles.label}>Stromstärke in A</Text>
          <TextInput
            style={styles.eingabe}
            value={strom}
            onChangeText={setStrom}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.flex}>
          <Text style={styles.label}>Dauer in Minuten</Text>
          <TextInput
            style={styles.eingabe}
            value={minuten}
            onChangeText={setMinuten}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {ergebnis?.fehler ? <Fehler text={ergebnis.fehler} /> : null}

      {ergebnis && !ergebnis.fehler ? (
        <>
          <View style={styles.ergebnisKasten}>
            <Text style={styles.spannungGross}>
              {formatiereZahl(ergebnis.masse)} g
            </Text>
            <Text style={styles.ergebnisHinweis}>
              scheiden sich ab · {formatiereZahl(ergebnis.stoffmenge)} mol
            </Text>
          </View>

          <Abschnitt titel="Der Rechenweg" thema="faraday">
            <View style={styles.vergleichZeile}>
              <Text style={styles.vergleichLabel}>Ladung Q = I · t</Text>
              <Text style={styles.vergleichWert}>
                {formatiereZahl(ergebnis.ladung, 0)} C
              </Text>
            </View>
            <View style={styles.vergleichZeile}>
              <Text style={styles.vergleichLabel}>Elektronen Q / F</Text>
              <Text style={styles.vergleichWert}>
                {formatiereZahl(ergebnis.molElektronen)} mol
              </Text>
            </View>
            <View style={styles.vergleichZeile}>
              <Text style={styles.vergleichLabel}>Stoffmenge geteilt durch z</Text>
              <Text style={styles.vergleichWert}>
                {formatiereZahl(ergebnis.stoffmenge)} mol
              </Text>
            </View>
            <View style={styles.formelKasten}>
              <Text style={styles.formelText}>m = (M · I · t) / (z · F)</Text>
            </View>
            <Text style={styles.text}>
              Ein Mol Elektronen trägt die Ladung F = 96 485 C. Für ein Mol
              Kupfer braucht es zwei Mol Elektronen — daraus folgt alles Weitere.
            </Text>
          </Abschnitt>
        </>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------

function Fehler({ text }) {
  return (
    <View style={styles.fehlerKasten}>
      <Text style={styles.fehlerText}>{text}</Text>
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
    marginTop: 6,
    lineHeight: 17,
  },
  fehlerKasten: {
    marginTop: 14,
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
  ergebnisFormel: {
    fontSize: 24,
    fontWeight: '700',
    color: farben.primaerDunkel,
  },
  ergebnisHinweis: { fontSize: 13, color: farben.textLeise, marginTop: 2 },
  spannungGross: {
    fontSize: 30,
    fontWeight: '700',
    color: farben.primaerDunkel,
  },
  zahlenListe: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  zahlKachel: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: farben.weiss,
  },
  zahlSymbol: { fontSize: 18, fontWeight: '700', color: '#111' },
  zahlWert: { fontSize: 15, color: farben.primaer, fontWeight: '700' },
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
  schrittZeile: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  schrittNummer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: farben.hintergrundHell,
    color: farben.primaer,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  schrittText: { flex: 1, fontSize: 14, lineHeight: 20, color: farben.text },
  beispielZeile: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 7 },
  beispielFormel: {
    fontSize: 15,
    fontWeight: '700',
    color: farben.primaer,
    width: 76,
  },
  beispielWarum: { flex: 1, fontSize: 13, color: farben.textLeise },
  trenner: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginTop: 26,
  },
  gleichung: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: farben.primaerDunkel,
    textAlign: 'center',
  },
  aenderungen: { marginTop: 14, gap: 10 },
  aenderungZeile: { flexDirection: 'row', gap: 8 },
  aenderungMarke: { width: 4, borderRadius: 2 },
  aenderungText: { flex: 1, fontSize: 14, lineHeight: 20, color: farben.text },
  fett: { fontWeight: '700' },
  reiheKasten: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  reiheZeile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  reiheZeileAktiv: { backgroundColor: farben.hintergrundHell },
  reihePaar: { fontSize: 14, color: farben.text },
  reiheWert: {
    fontSize: 14,
    color: farben.text,
    fontVariant: ['tabular-nums'],
  },
  polZeile: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  polMarke: { width: 4, borderRadius: 2 },
  polText: { flex: 1, fontSize: 14, lineHeight: 20, color: farben.text },
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
  urteilText: { fontSize: 13, lineHeight: 19, color: farben.primaerDunkel },
  urteilTextWarnung: { color: farben.warnung },
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
  formelKasten: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 4,
    gap: 4,
  },
  formelText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#111',
    textAlign: 'center',
  },
});
