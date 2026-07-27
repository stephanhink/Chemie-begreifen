@AGENTS.md

# Projekt: Chemie begreifen

## Ziel
Mobile App für Google Play (Android), die ein echtes Verständnis von
anorganischer und organischer Chemie vermittelt — nicht durch Auswendiglernen,
sondern indem man mit den Größen rechnet und sofort sieht, was passiert.

Zielgruppe: Gymnasiastinnen und Gymnasiasten der Oberstufe, 16–18 Jahre
(Q-Phase / Abiturvorbereitung). Das Niveau liegt bewusst über einer
Kinder-App: echte Formeln, korrekte Einheiten, keine vereinfachten
Näherungen — aber jeder Begriff wird an Ort und Stelle erklärt.

Aufgebaut analog zum Schwesterprojekt `finanz-kids` (gleicher Tech-Stack,
gleiche Ordnerstruktur, gleiches Info-Button-Konzept).

### Zum Namen
"Chemie begreifen" ist doppeldeutig gemeint: verstehen und anfassen. Das ist
gleichzeitig die Messlatte für jedes Feature — wenn man einen Wert nur
ablesen, aber nicht verändern und nicht nachvollziehen kann, fehlt etwas.
Technische Bezeichner weichen bewusst ab, weil sie kein Leerzeichen
vertragen:

| Wo                  | Wert                                            |
|---------------------|-------------------------------------------------|
| Store-/App-Name     | `Chemie begreifen` (in `app.json`)              |
| GitHub-Repository   | `stephanhink/Chemie-begreifen`                  |
| Lokaler Ordner      | `~/Documents/GitHub/Chemie`                     |
| Expo-Slug           | `chemie`                                        |
| Package-ID          | `com.hink.chemie`                               |

Der lokale Ordner heißt noch `Chemie` (so wurde er angelegt) — das stört
Git nicht, der Remote ist korrekt verknüpft. Die Package-ID bleibt so, wie
sie ist: Nach der ersten Play-Store-Veröffentlichung lässt sie sich nie
wieder ändern.

"Begreifen" ist allerdings kein Suchbegriff. Die Auffindbarkeit im Play
Store muss deshalb die Kurzbeschreibung tragen: Periodensystem, pH,
Stöchiometrie, Abitur, Oberstufe.

## Tech-Stack
- Expo / React Native, SDK 57
- Sprache: JavaScript (kein TypeScript, bewusst — niedrigere Einstiegshürde)
- Keine Navigations-Bibliothek: die Tab-Leiste ist in `App.js` von Hand
  gebaut (siehe Architektur)

### Expo Go: ggf. APK statt Play Store
Das Expo Go aus dem Play Store hinkt den SDK-Versionen hinterher. Lehnt es
das Projekt mit "Project is incompatible with this version of Expo Go" ab:
Store-Expo-Go deinstallieren und die passende APK von
`expo.dev/go?platform=android&device=true&sdkVersion=57` installieren.
Danach läuft der QR-Code-Workflow wie gewohnt.

> Achtung: Die sideloadete APK bekommt keine Play-Store-Updates mehr.
> Für iOS-Geräte gäbe es `eas go --sdk-version 57` (braucht Apple
> Developer Program).

## Architektur

```
App.js                  Tab-Leiste + Auswahl des aktiven Screens
screens/                Ein Screen pro Themengebiet (= ein Tab)
components/             Wiederverwendbare UI-Bausteine
utils/                  Fachlogik und Daten, komplett ohne UI
docs/                   Play-Store-Material + Datenschutzerklärung
                        (wird über GitHub Pages ausgeliefert)
```

Wichtigste Regel: **In `utils/` steht kein React.** Die Fachlogik
(Molmassen, pH-Werte, Nernst-Gleichung, Nomenklatur) ist reines JavaScript
und dadurch einzeln nachvollziehbar und testbar. Die Screens rufen sie nur
auf und stellen das Ergebnis dar.

### Tabs
Jeder Tab ist ein Eintrag im Array `TABS` in `App.js`: Schlüssel, Label und
Screen-Komponente. Ein neues Themengebiet bedeutet: neue Screen-Datei bauen
und hier einen Eintrag ergänzen — mehr nicht.

| Tab          | Screen                     | Inhalt                                          |
|--------------|----------------------------|-------------------------------------------------|
| PSE          | `PeriodensystemScreen.js`  | Interaktives Periodensystem, Atombau, Trends     |
| Stöchiometrie| `StoechiometrieScreen.js`  | Molare Masse, Stoffmenge, Reaktionsgleichungen   |
| Säure/Base   | `SaeureBaseScreen.js`      | pH, pKs, Puffer, Titration                       |
| Redox        | `RedoxScreen.js`           | Oxidationszahlen, Spannungsreihe, Nernst         |
| Organik      | `OrganikScreen.js`         | Stoffklassen, funktionelle Gruppen, Nomenklatur  |

### Das Info-Button-Konzept
Neben jedem Fachbegriff sitzt ein kleiner runder `i`-Knopf
(`components/InfoButton.js`), der eine Erklärung als Modal öffnet. Alle
Erklärungstexte stehen zentral in `utils/wissen.js` — nicht in den Screens.
So bleiben die Screens beim Rechnen, und Texte lassen sich bearbeiten, ohne
durch fünf Dateien zu suchen.

Aufbau eines Wissens-Eintrags: `titel`, `text` (Array von Absätzen),
optional `beispiel` (konkrete Zahl zum Anfassen), `mehr` (IDs verwandter
Themen, erscheinen als Links) und `formel`.

Neues Thema: Eintrag in `utils/wissen.js` ergänzen und im Screen ein
`<InfoButton thema="..." />` neben das Label setzen.

## Workflow
- Code wird per Prompt hier in Claude Code geschrieben, nicht von Hand getippt
- Live-Test über Expo Go auf dem eigenen Handy (QR-Code scannen), nicht über
  Xcode/Simulator
- Xcode wird nur für den finalen iOS-Build/App-Store-Upload gebraucht
- Commits/Push über GitHub Desktop
- Builds über den GitHub-Actions-Workflow `.github/workflows/eas-build.yml`
  (manuell auslösbar, braucht `EXPO_TOKEN` als Repository-Secret)

### Keine Lizenzdatei
Das Repository hat bewusst **keine** `LICENSE`. Damit gilt das normale
Urheberrecht: Der Code ist einsehbar, darf aber nicht ohne Zustimmung
weiterverwendet werden — passend für eine App, die verkauft bzw.
veröffentlicht werden soll.

Die von `create-expo-app` mitgelieferte MIT-Lizenz (© 650 Industries,
Inc. — die Firma hinter Expo) wurde entfernt: Sie hätte fälschlich Expo
als Rechteinhaber des Chemie-Codes ausgewiesen und jedem erlaubt, die App
zu kopieren und zu verkaufen. Falls ein neues Scaffolding sie wieder
anlegt: wieder löschen.

## Fachliche Leitlinien
- **Korrektheit vor Vereinfachung.** Wo eine Näherung üblich ist (z. B.
  pH = ½·(pKs − lg c₀) bei schwachen Säuren), wird zusätzlich exakt gerechnet
  und der Unterschied gezeigt. Genau daran versteht man die Voraussetzung
  der Näherung.
- **Einheiten immer mitführen** und im Ergebnis anzeigen.
- **Ans deutsche Curriculum halten**: Bezeichnungen, Symbole und
  Schreibweisen so, wie sie in der Oberstufe und im Abitur verwendet werden
  (z. B. `c(HCl)`, `n`, `M`, `pKs` statt `pKa`).
- **Erklären, nicht nur ausgeben**: Zwischenschritte einer Rechnung sichtbar
  machen, damit man die Rechnung nachvollziehen und selbst wiederholen kann.
- Konstanten (molare Masse, Avogadro, Ionenprodukt des Wassers …) stehen
  einmal zentral in `utils/konstanten.js`, nicht verstreut in den Screens.

## Bekannte Stolperfallen
- Tunnel-Modus (`--tunnel`) der Expo-CLI kann fehlerhaft sein, im Zweifel
  ohne starten
- Bei Versions-Warnungen: `npx expo install --fix`
- Handy nicht gleichzeitig als Hotspot UND Testgerät nutzen
- `SafeAreaView` muss aus `react-native-safe-area-context` kommen, nicht aus
  `react-native` — die eingebaute Variante ist auf Android wirkungslos und
  seit RN 0.86 abgekündigt

## Offene Punkte
- App-Icon/Branding noch nicht gestaltet (Standard-Expo-Icons als Platzhalter)
- EAS-Projekt: `eas.json` ist vorbereitet, aber noch nicht mit einem echten
  Expo-Account verknüpft (passiert beim ersten `eas build`) — danach trägt
  Expo `extra.eas.projectId` und `owner` in `app.json` ein
- GitHub Pages für die Datenschutzerklärung noch nicht aktiviert
  (Repo-Settings → Pages → Branch `main`, Ordner `/docs`). Die URL lautet
  danach
  `https://stephanhink.github.io/Chemie-begreifen/datenschutz.html` und
  wird im Play-Store-Listing verlangt.
- Google-Play-Konto/Erstveröffentlichung noch nicht eingerichtet
- Umfang je Screen im Detail noch offen — siehe Tabelle oben als Rahmen

## Status
Stand 2026-07-27: Projektgerüst steht (Expo SDK 57, blank template,
Tab-Navigation, Ordnerstruktur, Info-Button-Infrastruktur, EAS- und
GitHub-Actions-Konfiguration). Die fünf Screens sind angelegt, aber noch
Platzhalter — die Fachlogik in `utils/` ist der nächste Schritt.
