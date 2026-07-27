# Chemie begreifen

Mobile App (Android/iOS), die anorganische und organische Chemie auf
Oberstufenniveau begreifbar macht — durch Rechnen und Ausprobieren statt
Auswendiglernen. Zielgruppe: Gymnasiastinnen und Gymnasiasten von 16 bis 18
Jahren in der Abiturvorbereitung.

Schwesterprojekt von [`finanz-kids`](https://github.com/stephanhink/finanz-kids):
gleicher Tech-Stack, gleiche Struktur, gleiches Info-Button-Konzept.

## Inhalt

| Bereich       | Themen                                          |
|---------------|-------------------------------------------------|
| PSE           | Periodensystem, Atombau, Elektronenkonfiguration |
| Stöchiometrie | Molare Masse, Stoffmenge, Reaktionsgleichungen   |
| Säure/Base    | pH, pKs, Puffer, Titration                       |
| Redox         | Oxidationszahlen, Spannungsreihe, Nernst         |
| Organik       | Stoffklassen, funktionelle Gruppen, Nomenklatur  |

Neben jedem Fachbegriff sitzt ein Info-Knopf, der ihn an Ort und Stelle
erklärt — mit Formel, konkretem Rechenbeispiel und Querverweisen.

## Entwicklung

```bash
npm install
npm start        # QR-Code mit Expo Go auf dem Handy scannen
```

Expo SDK 57, React Native, JavaScript. Details zu Architektur, Konventionen
und Stolperfallen stehen in [CLAUDE.md](CLAUDE.md).

## Builds

Über den GitHub-Actions-Workflow `EAS Build`
([Actions → EAS Build → Run workflow](https://github.com/stephanhink/Chemie-begreifen/actions/workflows/eas-build.yml)).
Braucht `EXPO_TOKEN` als Repository-Secret.

## Status

Projektgerüst steht, die Screens sind angelegt, die Fachlogik entsteht
gerade. Siehe "Offene Punkte" in CLAUDE.md.

## Hinweis

Lernhilfe für den Chemieunterricht. Ersetzt keine Sicherheitsunterweisung —
Versuche gehören unter fachkundige Aufsicht.

## Rechtliches

© 2026 Stephan Hink. Alle Rechte vorbehalten.

Dieses Repository steht bewusst unter keiner Open-Source-Lizenz. Der Code
ist einsehbar, darf aber ohne Zustimmung nicht weiterverwendet werden.

Das Projektgerüst stammt ursprünglich aus dem Expo-Blank-Template
(© 650 Industries, Inc., MIT-Lizenz).
