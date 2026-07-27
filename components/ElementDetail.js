import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import InfoButton from './InfoButton';
import { farben } from '../utils/konstanten';
import {
  AGGREGATZUSTAENDE,
  GRUPPENNAMEN,
  KATEGORIEN,
  STOFFKLASSEN,
  aussenelektronen,
  elektronenSchalen,
  formatiereKonfiguration,
  stoffklasseVon,
} from '../utils/elemente';

// Eine Zeile "Beschriftung — Wert" mit Info-Knopf an der Beschriftung.
//
// Genau hier sitzt das Prinzip aus der CLAUDE.md: Jedes Wort, das man im
// Unterricht gelernt haben müsste, bekommt sein "i". Wer nicht weiß, was
// eine Ordnungszahl ist, findet die Antwort an der Ordnungszahl — und
// muss nicht erst wissen, wonach er suchen soll.
function Zeile({ label, thema, wert, hinweis }) {
  return (
    <View style={styles.zeile}>
      <View style={styles.zeileKopf}>
        <Text style={styles.label}>{label}</Text>
        {thema ? <InfoButton thema={thema} /> : null}
      </View>
      <Text style={styles.wert}>{wert}</Text>
      {hinweis ? <Text style={styles.hinweis}>{hinweis}</Text> : null}
    </View>
  );
}

export default function ElementDetail({ element, onClose }) {
  // Ohne Auswahl gar nichts rendern — spart das Modal komplett.
  if (!element) {
    return null;
  }

  const stoffklasse = STOFFKLASSEN[stoffklasseVon(element)];
  const kategorie = KATEGORIEN[element.kategorie];
  const aggregat = AGGREGATZUSTAENDE[element.aggregat];
  const schalen = elektronenSchalen(element);
  const gruppenname = GRUPPENNAMEN[element.gruppe];

  // Bei Nebengruppen führt die Zahl der Außenelektronen in die Irre
  // (sie ist fast immer 2, obwohl die d-Elektronen mitreagieren).
  // Deshalb wird sie dort gar nicht erst als Zahl behauptet.
  const hauptgruppe = element.gruppe !== null && (element.gruppe <= 2 || element.gruppe >= 13);
  const nebengruppe = element.gruppe !== null && !hauptgruppe;

  // Der Info-Knopf an der Gruppe muss zum Element passen: Wer bei Eisen
  // auf "Gruppe" tippt, darf keine Erklärung der Hauptgruppen bekommen.
  const gruppeThema = element.gruppe === null
    ? 'lanthanoide'
    : nebengruppe
      ? 'nebengruppe'
      : 'hauptgruppe';

  // Zusatz hinter der Gruppennummer: entweder der Familienname
  // (Alkalimetalle, Halogene …) oder wenigstens der Hinweis, dass es
  // eine Nebengruppe ist.
  const gruppeZusatz = gruppenname || (nebengruppe ? 'Nebengruppe' : null);

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.hintergrund}>
        <Pressable style={styles.freiFlaeche} onPress={onClose} />

        <View style={styles.blatt}>
          <View style={styles.kopf}>
            <View
              style={[styles.symbolKachel, { backgroundColor: stoffklasse.farbe }]}
            >
              <Text style={[styles.symbolGross, { color: stoffklasse.textfarbe }]}>
                {element.sym}
              </Text>
            </View>
            <View style={styles.kopfText}>
              <Text style={styles.name}>{element.name}</Text>
              <Text style={styles.kategorieText}>{kategorie.label}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.kopfAktion}>Fertig</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.inhalt}>
            <Zeile
              label="Ordnungszahl"
              thema="ordnungszahl"
              wert={String(element.z)}
              hinweis={`${element.z} Protonen im Kern — und im neutralen Atom ebenso viele Elektronen.`}
            />

            <Zeile
              label="Molare Masse"
              thema="molareMasse"
              wert={`${element.masse.toLocaleString('de-DE')} g/mol`}
              hinweis="So viel wiegt ein Mol dieses Elements, also 6,022·10²³ Atome."
            />

            <Zeile
              label={element.gruppe === null ? 'Stellung im PSE' : 'Gruppe'}
              thema={gruppeThema}
              wert={
                element.gruppe === null
                  ? `${kategorie.label}e, ${element.periode}. Periode`
                  : `${element.gruppe}${gruppeZusatz ? ` — ${gruppeZusatz}` : ''}`
              }
            />

            <Zeile
              label="Periode"
              thema="periode"
              wert={String(element.periode)}
              hinweis={`Die Elektronen verteilen sich auf ${schalen.length} Schale${
                schalen.length === 1 ? '' : 'n'
              }.`}
            />

            <Zeile
              label="Elektronenkonfiguration"
              thema="elektronenkonfiguration"
              wert={formatiereKonfiguration(element.konfig)}
            />

            <Zeile
              label="Elektronen je Schale"
              thema="schalenmodell"
              wert={schalen.join(' · ')}
              hinweis={
                hauptgruppe
                  ? aussenelektronen(element) === 1
                    ? 'Ein Außenelektron — das entscheidet, wie das Element reagiert.'
                    : `${aussenelektronen(element)} Außenelektronen — die entscheiden, wie das Element reagiert.`
                  : 'Bei den Nebengruppen reagieren auch die d-Elektronen mit. Die äußerste Schale allein sagt hier wenig aus.'
              }
            />

            <Zeile
              label="Elektronegativität"
              thema="elektronegativitaet"
              wert={
                element.en === null
                  ? 'kein Wert'
                  : element.en.toLocaleString('de-DE')
              }
              hinweis={
                element.en === null
                  ? 'Für dieses Element ist kein sinnvoller Wert bekannt — es bildet kaum oder gar keine Verbindungen.'
                  : null
              }
            />

            <Zeile
              label="Zustand bei 25 °C"
              wert={aggregat.label}
            />

            <Text style={styles.fusszeile}>
              Molare Massen nach IUPAC. Bei Elementen ohne stabiles Isotop
              steht die Massenzahl des langlebigsten Isotops.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  hintergrund: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  freiFlaeche: {
    flex: 1,
  },
  blatt: {
    backgroundColor: farben.weiss,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '88%',
  },
  kopf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  symbolKachel: {
    width: 52,
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolGross: {
    fontSize: 24,
    fontWeight: '700',
  },
  kopfText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  kategorieText: {
    fontSize: 13,
    color: farben.textLeise,
    marginTop: 2,
  },
  kopfAktion: {
    fontSize: 16,
    color: farben.primaer,
    fontWeight: '600',
  },
  inhalt: {
    padding: 20,
    paddingBottom: 40,
  },
  zeile: {
    marginBottom: 18,
  },
  zeileKopf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    color: farben.textLeise,
  },
  wert: {
    fontSize: 17,
    color: '#111',
  },
  hinweis: {
    fontSize: 12,
    lineHeight: 17,
    color: farben.textLeise,
    marginTop: 4,
  },
  fusszeile: {
    fontSize: 11,
    lineHeight: 16,
    color: farben.textSehrLeise,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
});
