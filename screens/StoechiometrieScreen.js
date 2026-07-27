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
import {
  formatiereZahl,
  molareMasse,
  rechneUm,
  verduennungsVolumen,
  zusammensetzung,
} from '../utils/stoechiometrie';
import { atombilanz, gleicheAus, gleichungAlsText } from '../utils/gleichung';

const BEREICHE = [
  { key: 'masse', label: 'Molare Masse' },
  { key: 'umrechnen', label: 'Umrechnen' },
  { key: 'konzentration', label: 'Konzentration' },
  { key: 'ausgleichen', label: 'Ausgleichen' },
];

export default function StoechiometrieScreen() {
  const [bereich, setBereich] = useState('masse');

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.kopfbereich}>
        <View style={styles.titelZeile}>
          <Text style={styles.titel}>Stöchiometrie</Text>
          <InfoButton thema="stoffmenge" />
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
        {bereich === 'masse' ? <MolareMasse /> : null}
        {bereich === 'umrechnen' ? <Umrechner /> : null}
        {bereich === 'konzentration' ? <Konzentration /> : null}
        {bereich === 'ausgleichen' ? <Ausgleicher /> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------

// Nimmt eine Formel entgegen und gibt entweder das Ergebnis oder die
// Fehlermeldung des Parsers zurück. Weil während des Tippens fast immer
// ein unfertiger Zustand vorliegt ("Ca(" ), wird der Fehler erst
// angezeigt, wenn das Feld nicht leer ist — sonst blinkt bei jedem
// Zeichen eine rote Meldung auf.
function versuche(formel, rechnung) {
  if (!formel.trim()) {
    return { leer: true };
  }
  try {
    return { wert: rechnung() };
  } catch (fehler) {
    return { fehler: fehler.message };
  }
}

function MolareMasse() {
  const [formel, setFormel] = useState('H2SO4');

  const ergebnis = useMemo(
    () => versuche(formel, () => ({
      masse: molareMasse(formel),
      teile: zusammensetzung(formel),
    })),
    [formel]
  );

  return (
    <View>
      <FormelFeld
        wert={formel}
        onChange={setFormel}
        platzhalter="z. B. H2SO4 oder Ca(OH)2"
      />
      <Text style={styles.feldHinweis}>
        Klammern und Kristallwasser gehen auch: Ca(OH)2, CuSO4*5H2O
      </Text>

      {ergebnis.fehler ? <Fehler text={ergebnis.fehler} /> : null}

      {ergebnis.wert ? (
        <>
          <View style={styles.ergebnisKasten}>
            <Text style={styles.ergebnisFormel}>{formatiereFormel(formel)}</Text>
            <Text style={styles.ergebnisWert}>
              M = {formatiereZahl(ergebnis.wert.masse, 3)} g/mol
            </Text>
            <View style={styles.zeileMitInfo}>
              <Text style={styles.ergebnisHinweis}>
                So viel wiegt ein Mol dieses Stoffes.
              </Text>
              <InfoButton thema="molareMasse" />
            </View>
          </View>

          <Abschnitt titel="Wie sich das zusammensetzt">
            {ergebnis.wert.teile.map((teil) => (
              <View key={teil.symbol} style={styles.teilZeile}>
                <Text style={styles.teilRechnung}>
                  {teil.anzahl} × {formatiereZahl(teil.molareMasse, 3)}{' '}
                  <Text style={styles.teilName}>({teil.name})</Text>
                </Text>
                <Text style={styles.teilBeitrag}>
                  {formatiereZahl(teil.beitrag, 3)} g/mol
                </Text>
              </View>
            ))}
            <View style={styles.summenZeile}>
              <Text style={styles.summenText}>Summe</Text>
              <Text style={styles.summenWert}>
                {formatiereZahl(ergebnis.wert.masse, 3)} g/mol
              </Text>
            </View>
          </Abschnitt>

          <Abschnitt titel="Massenanteile" thema="massenanteil">
            {ergebnis.wert.teile.map((teil) => (
              <View key={teil.symbol} style={styles.anteilZeile}>
                <Text style={styles.anteilLabel}>
                  {teil.name} ({teil.symbol})
                </Text>
                <View style={styles.balkenSpur}>
                  <View style={[styles.balken, { width: `${teil.anteil}%` }]} />
                </View>
                <Text style={styles.anteilWert}>
                  {teil.anteil.toLocaleString('de-DE', {
                    maximumFractionDigits: 1,
                  })} %
                </Text>
              </View>
            ))}
          </Abschnitt>
        </>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------

const GROESSEN = [
  { key: 'masse', label: 'Masse', einheit: 'g' },
  { key: 'stoffmenge', label: 'Stoffmenge', einheit: 'mol' },
  { key: 'teilchen', label: 'Teilchen', einheit: 'Stück' },
  { key: 'volumen', label: 'Volumen (Gas)', einheit: 'L' },
];

function Umrechner() {
  const [formel, setFormel] = useState('CO2');
  const [groesse, setGroesse] = useState('masse');
  const [eingabe, setEingabe] = useState('44');

  const zahl = parseFloat(eingabe.replace(',', '.'));

  const ergebnis = useMemo(
    () => versuche(formel, () => rechneUm(formel, groesse, Number.isFinite(zahl) ? zahl : 0)),
    [formel, groesse, zahl]
  );

  return (
    <View>
      <FormelFeld wert={formel} onChange={setFormel} platzhalter="z. B. CO2" />

      <Text style={styles.label}>Was ist gegeben?</Text>
      <View style={styles.leiste}>
        {GROESSEN.map((g) => (
          <Pressable
            key={g.key}
            onPress={() => setGroesse(g.key)}
            style={[styles.knopfKlein, groesse === g.key && styles.knopfAktiv]}
          >
            <Text
              style={[styles.knopfText, groesse === g.key && styles.knopfTextAktiv]}
            >
              {g.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.eingabeZeile}>
        <TextInput
          style={[styles.eingabe, styles.flex]}
          value={eingabe}
          onChangeText={setEingabe}
          keyboardType="decimal-pad"
        />
        <Text style={styles.einheit}>
          {GROESSEN.find((g) => g.key === groesse).einheit}
        </Text>
      </View>

      {ergebnis.fehler ? <Fehler text={ergebnis.fehler} /> : null}

      {ergebnis.wert ? (
        <>
          <View style={styles.ergebnisKasten}>
            {GROESSEN.filter((g) => g.key !== groesse).map((g) => (
              <View key={g.key} style={styles.umrechnungZeile}>
                <Text style={styles.umrechnungLabel}>{g.label}</Text>
                <Text style={styles.umrechnungWert}>
                  {formatiereZahl(ergebnis.wert[g.key])} {g.einheit}
                </Text>
              </View>
            ))}
          </View>

          <Abschnitt titel="Der Rechenweg" thema="stoffmenge">
            <Text style={styles.text}>
              Alles hängt über die Stoffmenge n zusammen. Aus der Formel
              {' '}{formatiereFormel(formel)} folgt M ={' '}
              {formatiereZahl(ergebnis.wert.molareMasse, 3)} g/mol, daraus n ={' '}
              {formatiereZahl(ergebnis.wert.stoffmenge)} mol — und von n aus
              lässt sich alles andere ausrechnen.
            </Text>
            <View style={styles.formelKasten}>
              <Text style={styles.formelText}>
                n = m / M      N = n · N_A      V = n · V_m
              </Text>
            </View>
            <View style={styles.zeileMitInfo}>
              <Text style={styles.hinweis}>
                Das Gasvolumen gilt nur für Gase und nur bei Normbedingungen
                (0 °C, 1013 hPa). Bei einem Feststoff ist die Zeile ohne
                Bedeutung.
              </Text>
              <InfoButton thema="molaresVolumen" />
            </View>
          </Abschnitt>
        </>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------

// Wie viel Substanz muss ich einwiegen, um eine Lösung bestimmter
// Konzentration zu bekommen? Und auf welches Volumen muss ich
// verdünnen? Das sind die beiden Fragen, die im Praktikum ständig
// auftauchen.
function Konzentration() {
  const [formel, setFormel] = useState('NaCl');
  const [c, setC] = useState('0,1');
  const [v, setV] = useState('0,5');
  const [zielC, setZielC] = useState('0,01');

  const zahl = (text) => parseFloat(String(text).replace(',', '.'));
  const cWert = zahl(c);
  const vWert = zahl(v);
  const zielWert = zahl(zielC);

  const ergebnis = useMemo(
    () =>
      versuche(formel, () => {
        const M = molareMasse(formel);
        const n = cWert * vWert;
        return {
          molareMasse: M,
          stoffmenge: n,
          einwaage: n * M,
          zielVolumen: verduennungsVolumen(cWert, vWert, zielWert),
        };
      }),
    [formel, cWert, vWert, zielWert]
  );

  const gueltig =
    Number.isFinite(cWert) && Number.isFinite(vWert) && cWert > 0 && vWert > 0;

  return (
    <View>
      <FormelFeld wert={formel} onChange={setFormel} platzhalter="z. B. NaCl" />

      <View style={styles.paarZeile}>
        <View style={styles.flex}>
          <Text style={styles.label}>Konzentration c</Text>
          <TextInput
            style={styles.eingabe}
            value={c}
            onChangeText={setC}
            keyboardType="decimal-pad"
          />
          <Text style={styles.feldHinweis}>mol/L</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.label}>Volumen V</Text>
          <TextInput
            style={styles.eingabe}
            value={v}
            onChangeText={setV}
            keyboardType="decimal-pad"
          />
          <Text style={styles.feldHinweis}>Liter</Text>
        </View>
      </View>

      {ergebnis.fehler ? <Fehler text={ergebnis.fehler} /> : null}

      {ergebnis.wert && gueltig ? (
        <>
          <View style={styles.ergebnisKasten}>
            <Text style={styles.ergebnisWert}>
              {formatiereZahl(ergebnis.wert.einwaage)} g einwiegen
            </Text>
            <Text style={styles.ergebnisHinweis}>
              und mit Wasser auf {formatiereZahl(vWert)} L auffüllen.
            </Text>
          </View>

          <Abschnitt titel="Der Rechenweg" thema="konzentrationThema">
            <Text style={styles.text}>
              c = n / V, also n = c · V = {formatiereZahl(cWert)} mol/L ·{' '}
              {formatiereZahl(vWert)} L = {formatiereZahl(ergebnis.wert.stoffmenge)}{' '}
              mol. Mal der molaren Masse von{' '}
              {formatiereZahl(ergebnis.wert.molareMasse, 3)} g/mol ergibt das die
              Einwaage.
            </Text>
            <Text style={styles.hinweis}>
              „Auf 0,5 L auffüllen" ist nicht dasselbe wie „0,5 L Wasser
              zugeben": Der Feststoff nimmt selbst Platz ein. Deshalb arbeitet
              man mit einem Messkolben.
            </Text>
          </Abschnitt>

          <Abschnitt titel="Verdünnen" thema="konzentrationThema">
            <View style={styles.eingabeZeile}>
              <Text style={styles.verduennenText}>Verdünnen auf</Text>
              <TextInput
                style={[styles.eingabe, styles.kleinesFeld]}
                value={zielC}
                onChangeText={setZielC}
                keyboardType="decimal-pad"
              />
              <Text style={styles.einheit}>mol/L</Text>
            </View>
            {Number.isFinite(zielWert) && zielWert > 0 && zielWert < cWert ? (
              <Text style={styles.text}>
                Auf {formatiereZahl(ergebnis.wert.zielVolumen)} L auffüllen —
                also {formatiereZahl(ergebnis.wert.zielVolumen - vWert)} L Wasser
                dazugeben.
              </Text>
            ) : (
              <Text style={styles.hinweis}>
                Die Zielkonzentration muss kleiner als die Ausgangskonzentration
                sein. Durch Zugabe von Wasser wird eine Lösung nie stärker.
              </Text>
            )}
            <View style={styles.formelKasten}>
              <Text style={styles.formelText}>c₁ · V₁ = c₂ · V₂</Text>
            </View>
            <Text style={styles.hinweis}>
              Beim Verdünnen ändert sich das Volumen, die Stoffmenge aber nicht
              — daraus folgt die Formel unmittelbar.
            </Text>
          </Abschnitt>
        </>
      ) : null}
    </View>
  );
}

function Ausgleicher() {
  const [text, setText] = useState('Fe + O2 -> Fe2O3');

  const ergebnis = useMemo(
    () => versuche(text, () => gleicheAus(text)),
    [text]
  );

  return (
    <View>
      <Text style={styles.label}>Reaktionsgleichung</Text>
      <TextInput
        style={styles.eingabe}
        value={text}
        onChangeText={setText}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Fe + O2 -> Fe2O3"
        placeholderTextColor="#999"
      />
      <Text style={styles.feldHinweis}>
        Ohne Koeffizienten eingeben — die werden ja gerade gesucht. Pfeil als
        -&gt; oder →.
      </Text>

      {ergebnis.fehler ? <Fehler text={ergebnis.fehler} /> : null}

      {ergebnis.wert ? (
        <>
          <View style={styles.ergebnisKasten}>
            <Text style={styles.gleichung}>
              {gleichungAlsText(ergebnis.wert, formatiereFormel)}
            </Text>
          </View>

          <Abschnitt titel="Die Probe" thema="reaktionsgleichung">
            <Text style={styles.text}>
              Links und rechts muss von jedem Element gleich viel stehen —
              Atome verschwinden nicht und entstehen nicht.
            </Text>
            <View style={styles.bilanzKopf}>
              <Text style={styles.bilanzSpalte}>Element</Text>
              <Text style={styles.bilanzZahl}>links</Text>
              <Text style={styles.bilanzZahl}>rechts</Text>
            </View>
            {atombilanz(ergebnis.wert).map((zeile) => (
              <View key={zeile.symbol} style={styles.bilanzZeile}>
                <Text style={styles.bilanzSpalte}>{zeile.symbol}</Text>
                <Text style={styles.bilanzZahl}>{zeile.links}</Text>
                <Text style={styles.bilanzZahl}>{zeile.rechts}</Text>
              </View>
            ))}
          </Abschnitt>

          <Abschnitt titel="Wie das gerechnet wird">
            <Text style={styles.text}>
              Nicht durch Probieren. Jedes Element liefert eine Bedingung, jeder
              Stoff eine Unbekannte — daraus entsteht ein lineares
              Gleichungssystem, das exakt gelöst wird. Gerechnet wird dabei mit
              Brüchen statt mit Kommazahlen, sonst käme am Ende 5,999999 heraus,
              wo eine 6 stehen muss.
            </Text>
          </Abschnitt>
        </>
      ) : null}

      <Abschnitt titel="Zum Ausprobieren">
        {[
          'C6H12O6 + O2 -> CO2 + H2O',
          'Al + HCl -> AlCl3 + H2',
          'NH3 + O2 -> NO + H2O',
          'KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2',
        ].map((beispiel) => (
          <Pressable key={beispiel} onPress={() => setText(beispiel)}>
            <Text style={styles.beispiel}>{beispiel}</Text>
          </Pressable>
        ))}
      </Abschnitt>
    </View>
  );
}

// ---------------------------------------------------------------------

function FormelFeld({ wert, onChange, platzhalter }) {
  return (
    <>
      <Text style={styles.label}>Summenformel</Text>
      <TextInput
        style={styles.eingabe}
        value={wert}
        onChangeText={onChange}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={platzhalter}
        placeholderTextColor="#999"
      />
    </>
  );
}

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
  leiste: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
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
  knopfAktiv: {
    backgroundColor: farben.primaer,
    borderColor: farben.primaer,
  },
  knopfText: { fontSize: 12, color: farben.textLeise },
  knopfTextAktiv: { color: farben.weiss, fontWeight: '700' },
  inhalt: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 48,
  },
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
  eingabeZeile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  einheit: {
    fontSize: 15,
    color: farben.textLeise,
    width: 48,
  },
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
  fehlerText: {
    fontSize: 14,
    lineHeight: 20,
    color: farben.warnung,
  },
  ergebnisKasten: {
    marginTop: 18,
    padding: 16,
    borderRadius: 10,
    backgroundColor: farben.hintergrundHell,
  },
  ergebnisFormel: {
    fontSize: 26,
    fontWeight: '700',
    color: farben.primaerDunkel,
  },
  ergebnisWert: {
    fontSize: 20,
    fontWeight: '700',
    color: farben.primaerDunkel,
    marginTop: 6,
  },
  ergebnisHinweis: {
    flex: 1,
    fontSize: 12,
    color: farben.textLeise,
  },
  zeileMitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
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
  teilZeile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  teilRechnung: { fontSize: 14, color: farben.text },
  teilName: { color: farben.textSehrLeise },
  teilBeitrag: {
    fontSize: 14,
    color: farben.text,
    fontVariant: ['tabular-nums'],
  },
  summenZeile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    marginTop: 6,
    paddingTop: 8,
  },
  summenText: { fontSize: 14, fontWeight: '700' },
  summenWert: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  anteilZeile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  anteilLabel: { fontSize: 13, color: farben.text, width: 118 },
  balkenSpur: {
    flex: 1,
    height: 10,
    borderRadius: 3,
    backgroundColor: '#ececec',
    overflow: 'hidden',
  },
  balken: {
    height: 10,
    backgroundColor: farben.primaer,
  },
  anteilWert: {
    fontSize: 13,
    width: 52,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  umrechnungZeile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: 5,
  },
  umrechnungLabel: { fontSize: 14, color: farben.primaerDunkel },
  umrechnungWert: {
    fontSize: 17,
    fontWeight: '700',
    color: farben.primaerDunkel,
  },
  gleichung: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: farben.primaerDunkel,
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: farben.text,
  },
  hinweis: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: farben.textLeise,
  },
  formelKasten: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  formelText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#111',
    textAlign: 'center',
  },
  bilanzKopf: {
    flexDirection: 'row',
    marginTop: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  bilanzZeile: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  bilanzSpalte: {
    flex: 1,
    fontSize: 14,
    color: farben.text,
  },
  bilanzZahl: {
    width: 62,
    textAlign: 'right',
    fontSize: 14,
    color: farben.text,
    fontVariant: ['tabular-nums'],
  },
  paarZeile: {
    flexDirection: 'row',
    gap: 12,
  },
  kleinesFeld: {
    width: 96,
  },
  verduennenText: {
    fontSize: 15,
    color: farben.text,
  },
  beispiel: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: farben.primaer,
    paddingVertical: 7,
  },
});
