import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import InfoButton from '../components/InfoButton';
import PeriodensystemGitter from '../components/PeriodensystemGitter';
import ReaktionsKarte from '../components/ReaktionsKarte';
import { farben } from '../utils/konstanten';
import { STOFFKLASSEN, stoffklasseVon } from '../utils/elemente';
import {
  VORSCHLAEGE,
  istLaborfaehig,
  ladungsZeichen,
  reagiere,
} from '../utils/ionen';
import { findeReaktionen, istElementarreaktion } from '../utils/reaktionen';
import { REAKTIONEN, gleichungText } from '../utils/reaktionen';
import { formatiereFormel } from '../utils/formel';

// Das Labor: zwei Elemente antippen und sehen, was daraus wird.
//
// Bewusst Antippen statt Ziehen. Auf einem Handy trifft man damit
// zuverlässiger, es funktioniert mit Sprachsteuerung und Vorlesefunktion,
// und es spart zwei zusätzliche Bibliotheken. Das Gefühl von
// "zusammentun" bleibt: Die Elemente wandern sichtbar ins Gefäß.
export default function LaborScreen() {
  const [gewaehlt, setGewaehlt] = useState([]);

  const vollstaendig = gewaehlt.length === 2;

  // Zwei voneinander unabhängige Quellen — und beide dürfen etwas zu
  // sagen haben. Die Salzregel rechnet, die Bibliothek schlägt nach.
  const salz = vollstaendig ? reagiere(gewaehlt[0], gewaehlt[1]) : null;
  const bibliothek = vollstaendig
    ? findeReaktionen(gewaehlt.map((e) => e.sym))
    : [];

  function tippe(element) {
    setGewaehlt((alt) => {
      // Schon im Gefäß? Dann wieder herausnehmen.
      if (alt.some((e) => e.z === element.z)) {
        return alt.filter((e) => e.z !== element.z);
      }
      // Beim dritten Element rückt das ältere heraus. Alternative wäre,
      // den Tipp zu ignorieren — das fühlt sich aber wie ein Defekt an,
      // wenn nichts passiert.
      return alt.length < 2 ? [...alt, element] : [alt[1], element];
    });
  }

  return (
    <View style={styles.flex}>
      <View style={styles.kopfbereich}>
        <View style={styles.titelZeile}>
          <Text style={styles.titel}>Labor</Text>
          <InfoButton thema="ionenbindung" />
        </View>
        <Text style={styles.untertitel}>
          Tippe zwei Elemente an und sieh, was entsteht.
        </Text>
      </View>

      <ScrollView>
        <Gefaess
          gewaehlt={gewaehlt}
          onEntfernen={tippe}
          onLeeren={() => setGewaehlt([])}
        />

        {vollstaendig ? (
          <Ergebnis salz={salz} bibliothek={bibliothek} />
        ) : null}

        {gewaehlt.length === 0 ? (
          <Vorschlaege onWaehlen={(a, b) => setGewaehlt([a, b])} />
        ) : null}

        <PeriodensystemGitter
          farbeFuer={(element) =>
            istLaborfaehig(element)
              ? STOFFKLASSEN[stoffklasseVon(element)]
              : STOFFKLASSEN.unbekannt
          }
          onPress={tippe}
          istAusgewaehlt={(element) => gewaehlt.some((e) => e.z === element.z)}
          // Elemente, die an keiner herleitbaren Salzbildung teilnehmen,
          // werden zurückgenommen — aber nicht gesperrt. Wer sie antippt,
          // bekommt eine Begründung statt gar nichts.
          istAbgeblendet={(element) => !istLaborfaehig(element)}
        />

        <Text style={styles.fussnote}>
          Blass dargestellte Elemente bilden keine einfachen Ionen. Antippen
          geht trotzdem — dann erklärt die App, warum daraus kein Salz wird.
        </Text>

        {/* Die Sammlung steht bewusst ganz unten: Sie ist lang, und das
            Periodensystem darüber ist das, womit man eigentlich
            arbeitet. Sie enthält auch die Reaktionen, die man über zwei
            Elemente nie findet — Kalkbrennen oder Thermit fangen mit
            Verbindungen an, nicht mit Elementen. */}
        {gewaehlt.length === 0 ? <Sammlung /> : null}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------

function Gefaess({ gewaehlt, onEntfernen, onLeeren }) {
  return (
    <View style={styles.gefaess}>
      <View style={styles.gefaessKopf}>
        <Text style={styles.gefaessTitel}>Reaktionsgefäß</Text>
        {gewaehlt.length > 0 ? (
          <Pressable onPress={onLeeren} hitSlop={10}>
            <Text style={styles.leeren}>Leeren</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.gefaessInhalt}>
        {[0, 1].map((platz) => {
          const element = gewaehlt[platz];
          return (
            <View key={platz} style={styles.platzZeile}>
              {platz === 1 ? <Text style={styles.plus}>+</Text> : null}
              {element ? (
                <Pressable
                  style={[
                    styles.gewaehltesElement,
                    { backgroundColor: STOFFKLASSEN[stoffklasseVon(element)].farbe },
                  ]}
                  onPress={() => onEntfernen(element)}
                  accessibilityLabel={`${element.name} aus dem Gefäß nehmen`}
                >
                  <Text style={styles.gewaehltesSymbol}>{element.sym}</Text>
                  <Text style={styles.gewaehlterName}>{element.name}</Text>
                </Pressable>
              ) : (
                <View style={styles.leererPlatz}>
                  <Text style={styles.leererPlatzText}>
                    {platz === 0 ? 'erstes Element' : 'zweites Element'}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------

// Führt die beiden Quellen zusammen. Findet die Salzregel etwas, kommt
// das zuerst — es ist hergeleitet und damit die stärkere Aussage.
// Danach folgt, was die Bibliothek zusätzlich weiß.
function Ergebnis({ salz, bibliothek }) {
  const direkt = bibliothek.filter(istElementarreaktion);
  const verwandt = bibliothek.filter((r) => !istElementarreaktion(r));

  return (
    <View>
      {salz.art === 'salz' ? (
        <SalzErgebnis ergebnis={salz} />
      ) : bibliothek.length === 0 ? (
        // Weder Regel noch Sammlung: die ehrliche Absage.
        <View style={styles.keinErgebnis}>
          <Text style={styles.keinErgebnisTitel}>
            {salz.art === 'keineReaktion'
              ? 'Da passiert nichts'
              : 'Dazu weiß die App nichts'}
          </Text>
          <Text style={styles.keinErgebnisText}>{salz.grund}</Text>
          {salz.thema ? (
            <View style={styles.themaZeile}>
              <Text style={styles.themaText}>Mehr dazu</Text>
              <InfoButton thema={salz.thema} />
            </View>
          ) : null}
        </View>
      ) : null}

      {direkt.map((reaktion) => (
        <ReaktionsKarte key={reaktion.id} reaktion={reaktion} />
      ))}

      {verwandt.length ? (
        <>
          <Text style={styles.gruppenTitel}>
            Verwandte Reaktionen mit denselben Elementen
          </Text>
          {verwandt.map((reaktion) => (
            <ReaktionsKarte key={reaktion.id} reaktion={reaktion} />
          ))}
        </>
      ) : null}
    </View>
  );
}

function SalzErgebnis({ ergebnis }) {
  const { metall, nichtmetall, ergebnisse, mehrdeutig } = ergebnis;

  return (
    <View>
      {mehrdeutig ? (
        <View style={styles.mehrdeutigHinweis}>
          <Text style={styles.mehrdeutigText}>
            {metall.name} kann {ergebnisse.length === 2 ? 'zwei' : ergebnisse.length}{' '}
            verschiedene Ionen bilden — deshalb gibt es hier mehr als eine
            richtige Antwort. Welche entsteht, hängt von den Bedingungen ab.
          </Text>
          <InfoButton thema="nebengruppenIonen" />
        </View>
      ) : null}

      {ergebnisse.map((salz) => (
        <SalzKarte
          key={salz.formel}
          salz={salz}
          metall={metall}
          nichtmetall={nichtmetall}
        />
      ))}
    </View>
  );
}

function SalzKarte({ salz, metall, nichtmetall }) {
  return (
    <View style={styles.karte}>
      <Text style={styles.produktFormel}>{salz.formel}</Text>
      <Text style={styles.produktName}>{salz.name}</Text>

      <View style={styles.gleichungKasten}>
        <Text style={styles.gleichung}>{salz.gleichung}</Text>
      </View>

      <Abschnitt titel="Was mit den Elektronen passiert" thema="ionenbindung">
        <Text style={styles.text}>
          Jedes {metall.name}-Atom gibt{' '}
          {salz.kationLadung === 1 ? 'ein Elektron' : `${salz.kationLadung} Elektronen`}{' '}
          ab und wird zum Ion {metall.sym}
          {ladungsZeichen(salz.kationLadung)}
          {salz.kationEdelgas
            ? ` — damit hat es die Elektronenverteilung von ${salz.kationEdelgas}.`
            : '. Eine Edelgaskonfiguration erreicht es dabei nicht — das ist typisch für Nebengruppenmetalle.'}
        </Text>
        <Text style={styles.text}>
          Jedes {nichtmetall.name}-Atom nimmt{' '}
          {Math.abs(salz.anionLadung) === 1
            ? 'ein Elektron'
            : `${Math.abs(salz.anionLadung)} Elektronen`}{' '}
          auf und wird zum Ion {nichtmetall.sym}
          {ladungsZeichen(salz.anionLadung)}
          {salz.anionEdelgas
            ? ` — damit hat es die Elektronenverteilung von ${salz.anionEdelgas}.`
            : '.'}
        </Text>
      </Abschnitt>

      <Abschnitt titel="Warum genau dieses Verhältnis" thema="verhaeltnisformel">
        <Text style={styles.text}>
          Das Salz ist nach außen elektrisch neutral — die Ladungen müssen
          sich also aufheben.{' '}
          {salz.anzahlKation === 1 && salz.anzahlAnion === 1
            ? `Hier passt es direkt: ${metall.sym}${ladungsZeichen(salz.kationLadung)} und ${nichtmetall.sym}${ladungsZeichen(salz.anionLadung)} gleichen sich im Verhältnis 1:1 aus.`
            : `${salz.anzahlKation} · ${salz.kationLadung} = ${salz.anzahlKation * salz.kationLadung} positive und ${salz.anzahlAnion} · ${Math.abs(salz.anionLadung)} = ${salz.anzahlAnion * Math.abs(salz.anionLadung)} negative Ladungen — deshalb ${salz.anzahlKation === 1 ? 'ein' : salz.anzahlKation} ${metall.sym} auf ${salz.anzahlAnion === 1 ? 'ein' : salz.anzahlAnion} ${nichtmetall.sym}.`}
        </Text>
        <Text style={styles.text}>
          Insgesamt wechseln pro Formeleinheit {salz.elektronen}{' '}
          {salz.elektronen === 1 ? 'Elektron' : 'Elektronen'} den Besitzer.
        </Text>
        <Text style={styles.hinweis}>
          {salz.formel} ist eine Verhältnisformel, keine Molekülformel: Es gibt
          kein einzelnes {salz.formel}-Teilchen. Im Kristall sitzen unzählige
          Ionen in genau diesem Zahlenverhältnis.
        </Text>
      </Abschnitt>
    </View>
  );
}

function Abschnitt({ titel, thema, children }) {
  return (
    <View style={styles.abschnitt}>
      <View style={styles.abschnittKopf}>
        <Text style={styles.abschnittTitel}>{titel}</Text>
        <InfoButton thema={thema} />
      </View>
      {children}
    </View>
  );
}

function Vorschlaege({ onWaehlen }) {
  return (
    <View style={styles.vorschlaege}>
      <Text style={styles.vorschlaegeTitel}>Zum Ausprobieren</Text>
      {VORSCHLAEGE.map(({ a, b, hinweis }) => (
        <Pressable
          key={a.sym + b.sym}
          style={styles.vorschlag}
          onPress={() => onWaehlen(a, b)}
        >
          <Text style={styles.vorschlagFormel}>
            {a.sym} + {b.sym}
          </Text>
          <Text style={styles.vorschlagHinweis}>{hinweis}</Text>
        </Pressable>
      ))}
    </View>
  );
}

// Die ganze Sammlung zum Durchblättern — auch die Reaktionen, die man
// über zwei Elemente nie findet, weil ihre Ausgangsstoffe schon
// Verbindungen sind (Kalkbrennen, Thermit, Photosynthese).
function Sammlung() {
  const [offen, setOffen] = useState(null);

  return (
    <View style={styles.sammlung}>
      <Text style={styles.vorschlaegeTitel}>
        Alle {REAKTIONEN.length} Reaktionen der Sammlung
      </Text>
      {REAKTIONEN.map((reaktion) => {
        const istOffen = offen === reaktion.id;
        return (
          <View key={reaktion.id}>
            <Pressable
              style={styles.sammlungZeile}
              onPress={() => setOffen(istOffen ? null : reaktion.id)}
            >
              <View style={styles.sammlungText}>
                <Text style={styles.sammlungName}>{reaktion.name}</Text>
                <Text style={styles.sammlungGleichung}>
                  {gleichungText(reaktion, formatiereFormel)}
                </Text>
              </View>
              <Text style={styles.pfeil}>{istOffen ? '−' : '+'}</Text>
            </Pressable>
            {istOffen ? (
              <View style={styles.sammlungKarte}>
                <ReaktionsKarte reaktion={reaktion} />
              </View>
            ) : null}
          </View>
        );
      })}
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
    paddingBottom: 4,
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
  untertitel: {
    fontSize: 14,
    color: farben.textLeise,
    marginTop: 4,
  },
  gefaess: {
    margin: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: farben.trenner,
    borderRadius: 12,
    padding: 14,
    backgroundColor: farben.hintergrundHell,
  },
  gefaessKopf: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gefaessTitel: {
    fontSize: 12,
    fontWeight: '700',
    color: farben.primaer,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leeren: {
    fontSize: 13,
    color: farben.primaer,
    fontWeight: '600',
  },
  gefaessInhalt: {
    gap: 8,
  },
  platzZeile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  plus: {
    fontSize: 18,
    fontWeight: '700',
    color: farben.primaerDunkel,
    width: 14,
  },
  gewaehltesElement: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  gewaehltesSymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  gewaehlterName: {
    fontSize: 15,
    color: '#000000',
  },
  leererPlatz: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: farben.trenner,
    paddingHorizontal: 12,
    paddingVertical: 13,
  },
  leererPlatzText: {
    fontSize: 14,
    color: farben.textLeise,
  },
  karte: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  produktFormel: {
    fontSize: 30,
    fontWeight: '700',
    color: farben.primaerDunkel,
  },
  produktName: {
    fontSize: 15,
    color: farben.textLeise,
    marginTop: 2,
  },
  gleichungKasten: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  gleichung: {
    fontFamily: 'monospace',
    fontSize: 15,
    color: '#111',
    textAlign: 'center',
  },
  abschnitt: {
    marginTop: 16,
  },
  abschnittKopf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
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
    marginBottom: 8,
  },
  hinweis: {
    fontSize: 12,
    lineHeight: 17,
    color: farben.textLeise,
  },
  mehrdeutigHinweis: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: farben.warnungHintergrund,
  },
  mehrdeutigText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: farben.warnung,
  },
  keinErgebnis: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  keinErgebnisTitel: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  keinErgebnisText: {
    fontSize: 15,
    lineHeight: 22,
    color: farben.text,
  },
  themaZeile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  themaText: {
    fontSize: 13,
    color: farben.primaer,
    fontWeight: '600',
  },
  vorschlaege: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  vorschlaegeTitel: {
    fontSize: 12,
    fontWeight: '700',
    color: farben.textLeise,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  vorschlag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
  },
  vorschlagFormel: {
    fontSize: 15,
    fontWeight: '700',
    color: farben.primaer,
    width: 62,
  },
  vorschlagHinweis: {
    flex: 1,
    fontSize: 13,
    color: farben.textLeise,
  },
  fussnote: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 24,
    fontSize: 12,
    lineHeight: 17,
    color: farben.textSehrLeise,
  },
  gruppenTitel: {
    marginHorizontal: 20,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '700',
    color: farben.textLeise,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sammlung: {
    marginTop: 4,
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginHorizontal: 20,
  },
  sammlungZeile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  sammlungText: {
    flex: 1,
  },
  sammlungName: {
    fontSize: 15,
    color: farben.text,
  },
  sammlungGleichung: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: farben.textLeise,
    marginTop: 3,
  },
  pfeil: {
    fontSize: 20,
    color: farben.primaer,
    width: 16,
    textAlign: 'center',
  },
  // Die Karte steht innerhalb der Sammlung, die selbst schon 20 Punkte
  // Rand hat — den gleicht sie hier aus, damit sie nicht doppelt
  // eingerückt erscheint.
  sammlungKarte: {
    marginHorizontal: -20,
    marginTop: 8,
  },
});
