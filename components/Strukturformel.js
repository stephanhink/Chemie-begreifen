import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Text as SvgText } from 'react-native-svg';

import { farben } from '../utils/konstanten';
import { skelett } from '../utils/organik';

// Zeichnet die Skelettformel: nur das Kohlenstoffgerüst als
// Zickzacklinie. Jeder Knick ist ein C-Atom, die Wasserstoffatome denkt
// man sich dazu.
//
// Das ist keine Faulheit, sondern die übliche Darstellung ab der
// Oberstufe — und sie hat einen Sinn: Man sieht die Struktur auf einen
// Blick, statt sie aus Buchstaben zusammenzusuchen. Was übrig bleibt,
// ist genau das Interessante: die funktionellen Gruppen.

const DX = 26;
const DY = 18;
const RAND = 26;
const STRICH = '#0b0b0b';

export default function Strukturformel({ klasseKey, kettenlaenge }) {
  const geruest = skelett(klasseKey, kettenlaenge);
  if (!geruest) {
    return null;
  }

  const { punkte, bindungen, anhaenge } = geruest;

  // Ein einzelnes Kohlenstoffatom ergibt keine Zickzacklinie — da
  // bleibt nur die Formel selbst.
  if (punkte.length < 2) {
    return (
      <View style={styles.einzeln}>
        <Text style={styles.einzelnText}>
          Bei nur einem Kohlenstoffatom gibt es keine Kette zu zeichnen.
        </Text>
      </View>
    );
  }

  const x = (p) => RAND + p.x * DX;
  const y = (p) => RAND + p.y * DY;

  // Hat die Verbindung einen Anhang nach rechts, braucht es Platz dafür
  const platzRechts = anhaenge.some((a) => a.richtung === 'rechts') ? DX + 20 : 0;
  const breite = RAND * 2 + (punkte.length - 1) * DX + platzRechts;
  const hoehe = RAND * 2 + DY;

  return (
    <View>
      <Svg width={breite} height={hoehe}>
        {bindungen.map((b, i) => {
          const a = punkte[b.von];
          const c = punkte[b.nach];
          // Mehrfachbindungen: parallele Striche. Der Versatz steht
          // senkrecht auf der Bindungsrichtung.
          const anzahl = b.art === 'doppel' ? 2 : b.art === 'dreifach' ? 3 : 1;
          const versaetze =
            anzahl === 1 ? [0] : anzahl === 2 ? [-2.5, 2.5] : [-3.5, 0, 3.5];

          const dx = x(c) - x(a);
          const dy = y(c) - y(a);
          const laenge = Math.hypot(dx, dy);
          const nx = -dy / laenge;
          const ny = dx / laenge;

          return versaetze.map((v, j) => (
            <Line
              key={`${i}-${j}`}
              x1={x(a) + nx * v}
              y1={y(a) + ny * v}
              x2={x(c) + nx * v}
              y2={y(c) + ny * v}
              stroke={STRICH}
              strokeWidth={1.6}
            />
          ));
        })}

        {anhaenge.map((anhang, i) => {
          const p = punkte[anhang.an];

          if (anhang.richtung === 'oben') {
            // Die Carbonylgruppe: Doppelbindung senkrecht nach oben.
            const yStart = y(p);
            const yEnde = RAND - 12;
            return (
              <React.Fragment key={i}>
                {[-2.5, 2.5].map((v) => (
                  <Line
                    key={v}
                    x1={x(p) + v}
                    y1={yStart}
                    x2={x(p) + v}
                    y2={yEnde + 6}
                    stroke={STRICH}
                    strokeWidth={1.6}
                  />
                ))}
                <SvgText
                  x={x(p)}
                  y={yEnde}
                  fontSize={13}
                  fontWeight="600"
                  fill={STRICH}
                  textAnchor="middle"
                >
                  {anhang.text}
                </SvgText>
              </React.Fragment>
            );
          }

          // Anhang nach rechts: Die Bindung setzt den Zickzack fort.
          const zielX = x(p) + DX;
          const zielY = y(p) + (p.y === 1 ? -DY : DY);
          return (
            <React.Fragment key={i}>
              <Line
                x1={x(p)}
                y1={y(p)}
                x2={zielX}
                y2={zielY}
                stroke={STRICH}
                strokeWidth={1.6}
              />
              <SvgText
                x={zielX + 4}
                y={zielY + 5}
                fontSize={13}
                fontWeight="600"
                fill={STRICH}
                textAnchor="start"
              >
                {anhang.text}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      <Text style={styles.legende}>
        Jeder Knick ist ein Kohlenstoffatom. Die Wasserstoffatome sind nicht
        gezeichnet — man ergänzt sie im Kopf, bis jedes C vier Bindungen hat.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  einzeln: {
    paddingVertical: 12,
  },
  einzelnText: {
    fontSize: 13,
    color: farben.textLeise,
  },
  legende: {
    fontSize: 11,
    lineHeight: 16,
    color: farben.textSehrLeise,
    marginTop: 4,
  },
});
