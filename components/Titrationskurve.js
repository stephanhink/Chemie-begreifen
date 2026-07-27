import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

import { farben } from '../utils/konstanten';

// Die Titrationskurve: pH gegen zugegebenes Volumen.
//
// Eine einzelne Datenreihe, deshalb keine Legende — die Überschrift
// benennt sie. Achsen und Hilfslinien treten zurück, die Kurve selbst
// ist die kräftigste Linie im Bild. Die beiden Punkte, auf die es
// ankommt, sind direkt beschriftet statt über eine Legende erklärt.

const HOEHE = 220;
const RAND = { links: 30, rechts: 14, oben: 14, unten: 26 };

export default function Titrationskurve({
  kurve,
  vAequivalenz,
  phAequivalenz,
  vHalb,
  phHalb,
  breite,
  indikator,
}) {
  const plotBreite = breite - RAND.links - RAND.rechts;
  const plotHoehe = HOEHE - RAND.oben - RAND.unten;

  const maxVolumen = kurve[kurve.length - 1].volumen;
  const x = (v) => RAND.links + (v / maxVolumen) * plotBreite;
  // pH läuft von 0 unten bis 14 oben — die feste Skala macht Kurven
  // verschiedener Säuren unmittelbar vergleichbar.
  const y = (ph) => RAND.oben + (1 - ph / 14) * plotHoehe;

  const punkte = kurve.map((p) => `${x(p.volumen)},${y(p.ph)}`).join(' ');

  return (
    <View>
      <Svg width={breite} height={HOEHE}>
        {/* Waagerechte Hilfslinien alle 2 pH-Einheiten */}
        {[0, 2, 4, 6, 8, 10, 12, 14].map((ph) => (
          <Line
            key={ph}
            x1={RAND.links}
            y1={y(ph)}
            x2={breite - RAND.rechts}
            y2={y(ph)}
            stroke="#e1e0d9"
            strokeWidth={1}
          />
        ))}

        {/* Der Umschlagsbereich des Indikators als Band */}
        {indikator ? (
          <Line
            x1={RAND.links}
            y1={(y(indikator.von) + y(indikator.bis)) / 2}
            x2={breite - RAND.rechts}
            y2={(y(indikator.von) + y(indikator.bis)) / 2}
            stroke={indikator.farbeBasisch}
            strokeWidth={Math.abs(y(indikator.von) - y(indikator.bis))}
            opacity={0.22}
          />
        ) : null}

        {/* pH 7 ist die einzige Linie mit Bedeutung — deshalb kräftiger */}
        <Line
          x1={RAND.links}
          y1={y(7)}
          x2={breite - RAND.rechts}
          y2={y(7)}
          stroke="#c3c2b7"
          strokeWidth={1}
          strokeDasharray="3 3"
        />

        {[0, 2, 4, 6, 8, 10, 12, 14].map((ph) => (
          <SvgText
            key={ph}
            x={RAND.links - 6}
            y={y(ph) + 4}
            fontSize={9}
            fill="#898781"
            textAnchor="end"
          >
            {ph}
          </SvgText>
        ))}

        <Line
          x1={RAND.links}
          y1={RAND.oben}
          x2={RAND.links}
          y2={HOEHE - RAND.unten}
          stroke="#c3c2b7"
          strokeWidth={1}
        />
        <Line
          x1={RAND.links}
          y1={HOEHE - RAND.unten}
          x2={breite - RAND.rechts}
          y2={HOEHE - RAND.unten}
          stroke="#c3c2b7"
          strokeWidth={1}
        />

        {[0, 0.25, 0.5, 0.75, 1].map((anteil) => (
          <SvgText
            key={anteil}
            x={RAND.links + anteil * plotBreite}
            y={HOEHE - RAND.unten + 14}
            fontSize={9}
            fill="#898781"
            textAnchor="middle"
          >
            {Math.round(anteil * maxVolumen)}
          </SvgText>
        ))}

        <Polyline
          points={punkte}
          fill="none"
          stroke={farben.primaer}
          strokeWidth={2}
        />

        {/* Halbäquivalenzpunkt: hier ist pH = pKs */}
        <Circle cx={x(vHalb)} cy={y(phHalb)} r={4} fill="#fff" stroke="#0b0b0b" strokeWidth={2} />

        {/* Äquivalenzpunkt: der steilste Punkt der Kurve */}
        <Circle
          cx={x(vAequivalenz)}
          cy={y(phAequivalenz)}
          r={5}
          fill="#0b0b0b"
        />
      </Svg>

      <Text style={styles.achse}>zugegebene Maßlösung in mL</Text>

      <View style={styles.punkteListe}>
        <View style={styles.punktZeile}>
          <View style={styles.punktGefuellt} />
          <Text style={styles.punktText}>
            Äquivalenzpunkt bei {vAequivalenz.toLocaleString('de-DE', {
              maximumFractionDigits: 1,
            })} mL, pH {phAequivalenz.toLocaleString('de-DE', { maximumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.punktZeile}>
          <View style={styles.punktHohl} />
          <Text style={styles.punktText}>
            Halbäquivalenzpunkt bei {vHalb.toLocaleString('de-DE', {
              maximumFractionDigits: 1,
            })} mL, pH {phHalb.toLocaleString('de-DE', { maximumFractionDigits: 2 })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  achse: {
    fontSize: 10,
    color: '#898781',
    textAlign: 'center',
    marginTop: 2,
  },
  punkteListe: {
    marginTop: 10,
    gap: 6,
  },
  punktZeile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  punktGefuellt: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0b0b0b',
  },
  punktHohl: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0b0b0b',
  },
  punktText: {
    flex: 1,
    fontSize: 13,
    color: farben.text,
  },
});
