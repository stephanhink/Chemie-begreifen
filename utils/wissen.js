// Hintergrundwissen zu den Fachbegriffen, die in den Screens vorkommen.
//
// Alle Texte stehen hier zentral, nicht in den Screens — so bleiben die
// Screens beim Rechnen und die Texte lassen sich bearbeiten, ohne durch
// fünf Dateien zu suchen.
//
// Aufbau eines Eintrags:
//   titel     Überschrift im Info-Fenster
//   text      Array von Absätzen (ein Eintrag = ein Absatz)
//   formel    optional: die zugehörige Formel, wird abgesetzt und in
//             Monospace dargestellt
//   beispiel  optional: eine konkrete Rechnung zum Anfassen. Erklärungen
//             bleiben abstrakt, bis man sie einmal an echten Zahlen
//             gesehen hat.
//   mehr      optional: IDs verwandter Themen, erscheinen als Links am
//             Ende und öffnen das jeweilige Thema im selben Fenster
//
// Neues Thema: hier einen Eintrag ergänzen und im Screen ein
// <InfoButton thema="..." /> neben das Label setzen. Mehr ist nicht nötig.

export const THEMEN = {
  // -----------------------------------------------------------------
  // Periodensystem und Atombau
  // -----------------------------------------------------------------

  periodensystem: {
    titel: 'Das Periodensystem',
    text: [
      'Das Periodensystem ist eine Sortiertabelle für alle Elemente, aus denen die Welt besteht. Entscheidend ist: Es ist nicht alphabetisch oder zufällig sortiert. Elemente, die sich chemisch ähnlich verhalten, stehen untereinander in derselben Spalte.',
      'Sortiert wird nach der Zahl der Protonen im Kern, die von links oben nach rechts unten um eins zunimmt. Eine Spalte heißt Gruppe, eine Zeile heißt Periode. Innerhalb einer Gruppe haben alle Elemente gleich viele Außenelektronen — und weil genau die für Reaktionen zuständig sind, verhalten sie sich ähnlich.',
      'Daraus folgt der eigentliche Wert der Tabelle: Sie ist kein Nachschlagewerk, sondern ein Vorhersagegerät. Wer weiß, wo ein Element steht, weiß ungefähr, wie es reagiert — auch ohne es je gesehen zu haben.',
    ],
    beispiel:
      'Mendelejew ließ 1869 in seiner Tabelle Lücken frei und sagte die Eigenschaften der fehlenden Elemente voraus. Fünfzehn Jahre später wurde Germanium entdeckt — mit fast genau den Werten, die er aufgeschrieben hatte.',
    mehr: ['ordnungszahl', 'hauptgruppe', 'periode', 'metalleNichtmetalle'],
  },

  ordnungszahl: {
    titel: 'Die Ordnungszahl',
    text: [
      'Die Ordnungszahl sagt, wie viele Protonen im Kern eines Atoms stecken. Sie ist so etwas wie die Hausnummer des Elements: Sie allein legt fest, um welches Element es sich handelt.',
      'Protonen sind positiv geladen. Damit ein Atom nach außen neutral ist, muss es genauso viele negative Elektronen besitzen — die Ordnungszahl nennt also gleichzeitig die Elektronenzahl des neutralen Atoms. Ändert man die Protonenzahl, entsteht ein anderes Element; das passiert nur bei Kernreaktionen, nie bei chemischen.',
      'Die Zahl der Neutronen darf dagegen schwanken. Atome desselben Elements mit unterschiedlicher Neutronenzahl heißen Isotope. Sie verhalten sich chemisch gleich, wiegen aber verschieden — der Grund, warum die molaren Massen im Periodensystem so krumme Zahlen sind.',
    ],
    beispiel:
      'Kohlenstoff hat die Ordnungszahl 6, also immer 6 Protonen. Das häufige ¹²C hat zusätzlich 6 Neutronen, das radioaktive ¹⁴C hat 8 — beides ist Kohlenstoff, beides verbrennt zu CO₂.',
    mehr: ['molareMasse', 'schalenmodell', 'periodensystem'],
  },

  hauptgruppe: {
    titel: 'Gruppen und Hauptgruppen',
    text: [
      'Eine Gruppe ist eine Spalte im Periodensystem. Alle Elemente einer Spalte haben gleich viele Außenelektronen — und weil bei einer chemischen Reaktion nur die Außenelektronen mitmachen, reagieren sie alle ähnlich.',
      'Hauptgruppen sind die Spalten 1 und 2 sowie 13 bis 18. Bei ihnen lässt sich die Zahl der Außenelektronen direkt ablesen: In Gruppe 1 ist es eines, in Gruppe 2 sind es zwei, ab Gruppe 13 zieht man 10 ab — Gruppe 13 hat also drei, Gruppe 17 sieben und Gruppe 18 acht.',
      'Vier Hauptgruppen haben eigene Namen, weil sie sich besonders typisch verhalten: Alkalimetalle (1), Erdalkalimetalle (2), Halogene (17) und Edelgase (18).',
    ],
    formel: 'Außenelektronen = Gruppennummer (Gruppe 1–2) bzw. Gruppennummer − 10 (Gruppe 13–18)',
    beispiel:
      'Natrium und Kalium stehen beide in Gruppe 1 und haben beide genau ein Außenelektron. Beide reagieren deshalb heftig mit Wasser — Kalium noch heftiger als Natrium, weil sein Außenelektron weiter vom Kern entfernt sitzt.',
    mehr: ['nebengruppe', 'schalenmodell', 'edelgase', 'halogene'],
  },

  nebengruppe: {
    titel: 'Die Nebengruppen',
    text: [
      'Die Nebengruppen sind der breite Block in der Mitte, die Spalten 3 bis 12. Dort stehen die Metalle, die man aus dem Alltag kennt: Eisen, Kupfer, Zink, Silber, Gold.',
      'Der Unterschied zu den Hauptgruppen: Bei ihnen wird nicht die äußerste Schale weiter gefüllt, sondern eine Schale darunter. Außen bleiben fast immer zwei Elektronen. Deshalb ändern sich die Eigenschaften von links nach rechts viel weniger stark als bei den Hauptgruppen — alle Nebengruppenelemente sind Metalle und einander recht ähnlich.',
      'Weil auch die inneren Elektronen an Reaktionen teilnehmen können, haben Nebengruppenmetalle oft mehrere mögliche Oxidationszahlen und bilden farbige Verbindungen. Genau das macht sie als Katalysatoren und Farbpigmente so nützlich.',
    ],
    beispiel:
      'Eisen tritt als Fe²⁺ und als Fe³⁺ auf. In wässriger Lösung ist Fe²⁺ blassgrün, Fe³⁺ gelbbraun — dieselbe Sorte Atome, zwei verschiedene Farben.',
    mehr: ['hauptgruppe', 'elektronenkonfiguration', 'schalenmodell'],
  },

  periode: {
    titel: 'Die Periode',
    text: [
      'Eine Periode ist eine Zeile im Periodensystem. Ihre Nummer sagt, auf wie viele Schalen sich die Elektronen des Atoms verteilen.',
      'Am Anfang jeder Zeile fängt eine neue Schale an. Deshalb sind die Zeilen unterschiedlich lang: Die erste Schale fasst nur zwei Elektronen, die zweite und dritte je acht, danach kommen die Nebengruppen dazu und die Zeilen werden 18 und schließlich 32 Elemente lang.',
      'Innerhalb einer Periode passiert etwas Systematisches: Die Kernladung wächst von links nach rechts, die Elektronen bleiben aber auf derselben Schale. Der Kern zieht sie deshalb immer fester an. Die Atome werden nach rechts kleiner, und die Elektronegativität steigt.',
    ],
    beispiel:
      'Natrium steht in der 3. Periode und hat drei Schalen: 2 · 8 · 1. Chlor steht in derselben Zeile und hat ebenfalls drei Schalen — aber 2 · 8 · 7, und einen viel stärker ziehenden Kern.',
    mehr: ['schalenmodell', 'elektronegativitaet', 'hauptgruppe'],
  },

  schalenmodell: {
    titel: 'Das Schalenmodell',
    text: [
      'Die Elektronen schwirren nicht wild um den Kern, sondern halten sich in Bereichen mit festem Abstand auf — den Schalen. Man kann sie sich wie die Ringe einer Zwiebel vorstellen. Für die Chemie zählt fast nur die äußerste.',
      'Jede Schale fasst eine begrenzte Zahl von Elektronen: die erste zwei, die zweite acht, die dritte 18, die vierte 32. Erst wenn eine Schale voll ist, beginnt die nächste. Die Elektronen auf der äußersten Schale heißen Außenelektronen oder Valenzelektronen — sie allein bestimmen, wie ein Element reagiert.',
      'Daraus folgt die Oktettregel: Atome sind dann besonders stabil, wenn sie außen acht Elektronen haben. Genau diesen Zustand erreichen sie, indem sie Elektronen abgeben, aufnehmen oder mit anderen teilen — und das ist im Kern schon die ganze Chemie.',
      'Wo das Modell an seine Grenze kommt: Bei den Nebengruppen füllt sich eine innere Schale weiter auf, während außen alles gleich bleibt. Dafür braucht man das genauere Bild der Orbitale.',
    ],
    formel: 'Kapazität der n-ten Schale = 2 · n²',
    beispiel:
      'Chlor hat die Besetzung 2 · 8 · 7. Ihm fehlt genau ein Elektron zum vollen Oktett — deshalb nimmt es so bereitwillig eines auf und wird zum Chlorid-Ion Cl⁻.',
    mehr: ['elektronenkonfiguration', 'hauptgruppe', 'edelgase'],
  },

  elektronenkonfiguration: {
    titel: 'Die Elektronenkonfiguration',
    text: [
      'Die Elektronenkonfiguration schreibt genau auf, wo sich die Elektronen eines Atoms aufhalten. Sie ist die Feinversion des Schalenmodells: Statt nur "acht Elektronen auf Schale 2" sagt sie, in welchen Unterbereichen dieser Schale sie sitzen.',
      'Zu lesen ist sie so: Die Zahl vorn nennt die Schale, der Buchstabe den Orbitaltyp, die Hochzahl die Anzahl der Elektronen darin. Es gibt vier Typen mit fester Kapazität — s fasst 2 Elektronen, p fasst 6, d fasst 10 und f fasst 14. Ein Edelgassymbol in eckigen Klammern ist eine Abkürzung für alles, was das davorstehende Edelgas schon hat.',
      'Eine Überraschung steckt in der Reihenfolge: Gefüllt wird nach steigender Energie, und die läuft nicht streng nach Schalennummer. Das 4s-Orbital liegt energetisch unter dem 3d-Orbital und wird deshalb zuerst besetzt. Genau daher rührt die Form des Periodensystems mit seinem breiten Mittelblock.',
    ],
    formel: '[Ar] 3d⁶ 4s²   —   Eisen: Argon-Rumpf, 6 Elektronen im 3d, 2 im 4s',
    beispiel:
      'Chrom fällt aus der Reihe: Statt 3d⁴ 4s² besetzt es 3d⁵ 4s¹. Eine halb gefüllte d-Schale ist energetisch günstiger — dasselbe Muster zeigt Kupfer mit voller d-Schale (3d¹⁰ 4s¹).',
    mehr: ['schalenmodell', 'nebengruppe', 'ordnungszahl'],
  },

  elektronegativitaet: {
    titel: 'Die Elektronegativität',
    text: [
      'Die Elektronegativität sagt, wie stark ein Atom an den Elektronen zieht, die es sich in einer Bindung mit einem anderen Atom teilt. Je größer der Wert, desto gieriger das Atom.',
      'Gemessen wird auf der Pauling-Skala von 0,7 (Francium, zieht am schwächsten) bis 3,98 (Fluor, zieht am stärksten). Im Periodensystem folgt sie einem klaren Muster: Nach rechts steigt sie, weil der Kern stärker wird; nach unten fällt sie, weil die Außenelektronen weiter weg sitzen und von den inneren Schalen abgeschirmt werden. Der gierigste Punkt ist also rechts oben.',
      'Nützlich ist sie, weil man aus der Differenz zweier Werte die Art der Bindung vorhersagen kann. Ziehen beide gleich stark, teilen sie fair — unpolare Atombindung. Zieht einer deutlich stärker, wird die Bindung polar. Ist der Unterschied sehr groß, nimmt der Stärkere das Elektron ganz weg, und es entstehen Ionen.',
      'Die Grenzwerte unten sind Faustregeln, keine Naturgesetze. Der Übergang ist fließend — es gibt kein Molekül, das bei 1,70 plötzlich zum Salz wird.',
    ],
    formel: 'ΔEN < 0,4 unpolar  ·  0,4–1,7 polar  ·  > 1,7 ionisch',
    beispiel:
      'Chlorwasserstoff HCl: 3,16 − 2,20 = 0,96 → polare Atombindung, das Chlor zieht stärker. Kochsalz NaCl: 3,16 − 0,93 = 2,23 → das Elektron wechselt ganz den Besitzer, es entstehen Na⁺ und Cl⁻.',
    mehr: ['periode', 'metalleNichtmetalle', 'hauptgruppe'],
  },

  metalleNichtmetalle: {
    titel: 'Metalle, Nichtmetalle und die Treppe',
    text: [
      'Die wichtigste Trennlinie im Periodensystem: Links und in der Mitte stehen die Metalle, rechts oben die Nichtmetalle. Dazwischen verläuft eine Grenze, die wie eine Treppe von oben nach rechts unten führt.',
      'Metalle haben wenige Außenelektronen und geben sie leicht ab. Deshalb bilden sie positive Ionen, leiten Strom und Wärme, glänzen und lassen sich verformen. Nichtmetalle haben viele Außenelektronen und nehmen lieber welche auf. Sie bilden negative Ionen, leiten meist nicht und sind spröde oder gasförmig.',
      'Warum das so ist, verrät ein Blick aufs Zählen: Wer nur ein Elektron loswerden muss, um eine volle Schale zu erreichen, hat es leichter als jemand, der sieben abgeben müsste — der nimmt lieber eines auf. Genau deshalb haben Metalle niedrige und Nichtmetalle hohe Elektronegativität.',
      'Diese Grenze ist die einzige wichtige Einteilung, die man der Position im Periodensystem NICHT direkt ansieht — die Gruppen stehen ja ohnehin in Spalten. Deshalb ist sie hier die Standardfärbung.',
    ],
    beispiel:
      'Natrium gibt sein eines Außenelektron ab und wird zu Na⁺. Chlor nimmt genau dieses Elektron auf und wird zu Cl⁻. Die beiden Ionen ziehen sich an — fertig ist das Kochsalz.',
    mehr: ['halbmetalle', 'elektronegativitaet', 'hauptgruppe'],
  },

  halbmetalle: {
    titel: 'Die Halbmetalle',
    text: [
      'Halbmetalle sitzen genau auf der Treppe zwischen Metallen und Nichtmetallen — und verhalten sich, wie der Name sagt, von beidem ein bisschen.',
      'Es sind sechs Stück: Bor, Silicium, Germanium, Arsen, Antimon und Tellur. Sie glänzen oft wie Metalle, sind aber spröde wie Nichtmetalle. Am wichtigsten ist ihre elektrische Eigenschaft: Sie leiten Strom schlechter als Metalle, aber besser als Nichtmetalle — sie sind Halbleiter.',
      'Genau diese Zwischenstellung macht sie technisch unersetzlich. Ein Material, das mal leitet und mal nicht, ist ein Schalter — und Millionen solcher Schalter ergeben einen Prozessor.',
    ],
    beispiel:
      'Reines Silicium leitet kaum. Baut man gezielt winzige Mengen Fremdatome ein (Dotierung), wird es leitfähig — und zwar steuerbar. Auf diesem Trick beruht jeder Transistor und damit jeder Computer.',
    mehr: ['metalleNichtmetalle', 'periodensystem'],
  },

  edelgase: {
    titel: 'Die Edelgase',
    text: [
      'Die Edelgase sind die Spalte ganz rechts: Helium, Neon, Argon, Krypton, Xenon, Radon. Ihre Besonderheit ist, dass sie so gut wie gar nicht reagieren. Chemisch gesehen sind sie satt.',
      'Der Grund steht in ihrer Elektronenverteilung: Ihre äußerste Schale ist voll besetzt — mit acht Elektronen, bei Helium mit zwei. Sie müssen nichts abgeben und nichts aufnehmen, um stabil zu sein.',
      'Damit sind sie der Maßstab für alle anderen: Der Zustand, den jedes andere Atom durch Abgeben, Aufnehmen oder Teilen von Elektronen zu erreichen versucht, ist genau die Elektronenverteilung des nächstgelegenen Edelgases. Das ist der eigentliche Inhalt der Oktettregel.',
      'Weil sie keine Bindungen brauchen, kommen sie als einzelne Atome vor — alle anderen Gase treten paarweise auf (O₂, N₂, Cl₂).',
    ],
    beispiel:
      'Natrium gibt sein eines Außenelektron ab und hat danach exakt die Elektronenverteilung von Neon. Chlor nimmt eines auf und hat dann die von Argon. Beide sind auf dem Weg zum nächsten Edelgas.',
    mehr: ['schalenmodell', 'hauptgruppe', 'halogene'],
  },

  halogene: {
    titel: 'Die Halogene',
    text: [
      'Die Halogene sind die vorletzte Spalte: Fluor, Chlor, Brom, Iod. Der Name kommt aus dem Griechischen und heißt "Salzbildner" — genau das tun sie.',
      'Sie haben sieben Außenelektronen, ihnen fehlt also genau eines zum vollen Oktett. Das macht sie extrem reaktionsfreudig: Ein einzelnes Elektron aufzunehmen ist die kürzeste Strecke zum stabilen Zustand. Dabei entstehen einfach negativ geladene Ionen — Fluorid, Chlorid, Bromid, Iodid.',
      'Die Reaktionsfreude nimmt nach unten ab. Fluor ist das reaktivste Element überhaupt, Iod schon deutlich zahmer. Der Grund ist derselbe wie bei der Elektronegativität: Je weiter außen die aufnehmende Schale liegt, desto schwächer zieht der Kern.',
    ],
    beispiel:
      'Chlor und Natrium sind eine perfekte Paarung: Natrium will genau ein Elektron loswerden, Chlor will genau eines haben. Das Ergebnis ist Kochsalz — aus einem hochgiftigen Gas und einem Metall, das in Wasser brennt.',
    mehr: ['edelgase', 'metalleNichtmetalle', 'elektronegativitaet'],
  },

  lanthanoide: {
    titel: 'Lanthanoide und Actinoide',
    text: [
      'Das sind die beiden Zeilen, die abgesetzt unter dem Periodensystem stehen. Sie sind nicht weniger wichtig als der Rest — sie gehören eigentlich mitten hinein, in die Lücke zwischen Gruppe 2 und 3. Stünden sie dort, wäre die Tabelle fast doppelt so breit und auf keinem Bildschirm mehr lesbar.',
      'Bei ihnen füllt sich eine Schale auf, die noch weiter innen liegt als bei den Nebengruppen (die f-Orbitale). Außen ändert sich dabei praktisch nichts — deshalb ähneln sich die 15 Lanthanoide untereinander so stark, dass man sie chemisch nur mit großem Aufwand trennen kann.',
      'Die Lanthanoide heißen auch Seltene Erden. Der Name führt in die Irre: Sie sind gar nicht so selten, nur schwer voneinander zu trennen. Die Actinoide sind fast alle radioaktiv; ab Ordnungszahl 93 kommen sie in der Natur nicht mehr vor, sondern werden künstlich erzeugt.',
    ],
    beispiel:
      'Neodym steckt in den stärksten Dauermagneten, die es gibt — in Kopfhörern, Festplatten und den Generatoren von Windrädern. Ohne diese "seltene Erde" gäbe es keine Elektromotoren dieser Leistungsdichte.',
    mehr: ['nebengruppe', 'elektronenkonfiguration', 'periodensystem'],
  },

  // -----------------------------------------------------------------
  // Chemische Bindung
  // -----------------------------------------------------------------

  ionenbindung: {
    titel: 'Die Ionenbindung',
    text: [
      'Wenn ein Metall auf ein Nichtmetall trifft, wechseln Elektronen den Besitzer. Das Metall gibt ab, das Nichtmetall nimmt auf. Übrig bleiben geladene Teilchen — Ionen —, und weil Plus und Minus sich anziehen, halten sie zusammen. Das ist die Ionenbindung.',
      'Warum diese Aufgabenteilung? Beide wollen die volle Außenschale erreichen. Für ein Metall mit ein bis drei Außenelektronen ist der kürzeste Weg dorthin, sie loszuwerden. Für ein Nichtmetall, dem ein bis drei fehlen, ist es der kürzeste Weg, welche aufzunehmen. Die beiden passen also perfekt zusammen.',
      'Das Ergebnis ist kein Molekül, sondern ein Kristall: Millionen von Ionen, die sich in einem regelmäßigen Gitter abwechseln. Jedes positive Ion ist von negativen umgeben und umgekehrt. Genau deshalb sind Salze hart, spröde und haben hohe Schmelzpunkte — man muss sehr viele Anziehungskräfte gleichzeitig überwinden.',
      'Zwei Metalle bilden übrigens keine Ionenbindung: Beide wollen abgeben, keiner nimmt. Zwei Nichtmetalle auch nicht — die teilen sich Elektronen, das ist dann eine Atombindung.',
    ],
    beispiel:
      'Kochsalz löst sich in Wasser, weil die Wassermoleküle die Ionen einzeln aus dem Gitter herauslösen. Deshalb leitet Salzwasser Strom, festes Salz aber nicht: Erst in Lösung sind die Ladungen frei beweglich.',
    mehr: ['verhaeltnisformel', 'metalleNichtmetalle', 'edelgase', 'elektronegativitaet'],
  },

  verhaeltnisformel: {
    titel: 'Verhältnisformel und Kreuzregel',
    text: [
      'Ein Salz ist nach außen elektrisch neutral. Die positiven und negativen Ladungen müssen sich also genau aufheben — und daraus ergibt sich zwingend, in welchem Zahlenverhältnis die Ionen im Kristall stehen.',
      'Bei Natrium und Chlor ist es einfach: Na⁺ und Cl⁻ gleichen sich eins zu eins aus, die Formel ist NaCl. Bei Magnesium und Chlor nicht mehr: Mg²⁺ trägt zwei positive Ladungen, Cl⁻ nur eine negative. Es braucht also zwei Chlorid-Ionen pro Magnesium-Ion — MgCl₂.',
      'Allgemein sucht man das kleinste gemeinsame Vielfache der beiden Ladungszahlen. Bei Aluminium (3+) und Sauerstoff (2−) ist das sechs: zwei Aluminium-Ionen bringen sechs positive, drei Oxid-Ionen sechs negative Ladungen. Al₂O₃. Als Merkhilfe kennt man das als Kreuzregel — die Ladungszahl des einen wird zum Index des anderen.',
      'Wichtig ist, was so eine Formel bedeutet: Sie beschreibt ein Verhältnis, kein Teilchen. Es gibt kein einzelnes NaCl-Molekül, das man herausgreifen könnte. Im Kristall gibt es nur "auf jedes Natrium-Ion kommt ein Chlorid-Ion".',
    ],
    formel: 'Al³⁺ und O²⁻ → kleinstes gemeinsames Vielfaches 6 → Al₂O₃',
    beispiel:
      'Magnesium und Stickstoff: Mg²⁺ und N³⁻, kleinstes gemeinsames Vielfaches ist 6. Drei Magnesium-Ionen (6+) auf zwei Stickstoff-Ionen (6−) — die Formel lautet Mg₃N₂.',
    mehr: ['ionenbindung', 'hauptgruppe', 'edelgase'],
  },

  nebengruppenIonen: {
    titel: 'Warum Eisen zwei Ionen bildet',
    text: [
      'Bei Hauptgruppenmetallen ist die Ionenladung eindeutig: Natrium gibt genau ein Elektron ab, Magnesium genau zwei. Man kann sie an der Gruppennummer ablesen. Bei Nebengruppenmetallen geht das nicht — Eisen bildet Fe²⁺ und Fe³⁺, Kupfer Cu⁺ und Cu²⁺.',
      'Der Grund liegt in der Elektronenverteilung. Bei Nebengruppenmetallen liegen die äußeren s-Elektronen und die darunterliegenden d-Elektronen energetisch sehr dicht beieinander. Es kostet deshalb kaum mehr Energie, zusätzlich zu den zwei Außenelektronen noch ein d-Elektron abzugeben. Beide Varianten sind möglich.',
      'Welche entsteht, hängt von den Bedingungen ab: von der Menge des Reaktionspartners, von der Temperatur, davon wie stark oxidierend die Umgebung ist. Aus der Stellung im Periodensystem allein lässt sich das nicht vorhersagen — deshalb zeigt die App hier alle Möglichkeiten statt einer auszuwählen.',
      'Damit der Name eindeutig bleibt, schreibt man die Ladung in römischen Ziffern dazu: Eisen(II)-oxid ist FeO, Eisen(III)-oxid ist Fe₂O₃. "Eisenoxid" allein wäre mehrdeutig.',
    ],
    beispiel:
      'Rost ist überwiegend Eisen(III)-oxid. Verbrennt Eisenwolle dagegen bei begrenztem Sauerstoff, entsteht auch Eisen(II)-oxid — dasselbe Metall, derselbe Partner, zwei verschiedene Produkte.',
    mehr: ['nebengruppe', 'ionenbindung', 'elektronenkonfiguration'],
  },

  // -----------------------------------------------------------------
  // Reaktionen: Energie, Geschwindigkeit, Gleichgewicht
  // -----------------------------------------------------------------

  exothermEndotherm: {
    titel: 'Exotherm und endotherm',
    text: [
      'Bei manchen Reaktionen wird Wärme frei — ein Feuer wärmt, eine Batterie wird warm. Bei anderen ist es umgekehrt: Sie kühlen ihre Umgebung ab und laufen nur, solange man Energie zuführt. Das Erste heißt exotherm, das Zweite endotherm.',
      'Dahinter steckt eine Bilanz. Chemische Bindungen aufzubrechen kostet Energie, neue zu knüpfen liefert welche. Sind die neuen Bindungen zusammen stabiler als die alten, bleibt etwas übrig und wird frei — exotherm. Sind sie schwächer, muss man zuzahlen — endotherm.',
      'Gemessen wird das als Reaktionsenthalpie ΔH. Das Vorzeichen ist aus Sicht des Reaktionsgemisches zu lesen, nicht aus deiner: Negativ heißt, das Gemisch gibt Energie ab — für dich wird es wärmer. Das verwirrt am Anfang fast jeden.',
      'Wichtig: ΔH gilt immer für die Gleichung genau so, wie sie aufgeschrieben ist. Verdoppelt man alle Koeffizienten, verdoppelt sich auch ΔH.',
    ],
    formel: 'ΔH < 0 → exotherm, Energie wird frei · ΔH > 0 → endotherm, Energie wird gebraucht',
    beispiel:
      'Die Knallgasreaktion liefert 572 kJ, wenn zwei Mol Wasserstoff verbrennen. Die Elektrolyse von Wasser — dieselbe Reaktion rückwärts — kostet exakt dieselben 572 kJ. Das ist kein Zufall, sondern der Energieerhaltungssatz.',
    mehr: ['aktivierungsenergie', 'chemischesGleichgewicht'],
  },

  aktivierungsenergie: {
    titel: 'Die Aktivierungsenergie',
    text: [
      'Ein Gemisch aus Wasserstoff und Sauerstoff kann jahrelang stehen, ohne etwas zu tun — obwohl die Reaktion enorm viel Energie liefern würde. Ein einziger Funke, und es knallt. Was fehlt, ist der Anstoß: die Aktivierungsenergie.',
      'Damit zwei Teilchen reagieren, müssen sie erst einmal ihre bestehenden Bindungen lockern. Das kostet Energie, bevor welche zurückkommt. Man kann sich das als Hügel vorstellen, der zwischen den Ausgangsstoffen und den Produkten liegt: Auch wenn es dahinter steil bergab geht, muss man erst hinauf.',
      'Daraus folgt die vielleicht wichtigste Unterscheidung der Reaktionslehre: Ob eine Reaktion Energie liefert und ob sie von allein losgeht, sind zwei völlig verschiedene Fragen. Benzin in der Tankstelle liefert Energie und tut trotzdem nichts. Zum Glück.',
      'Wärme hilft, weil sie die Teilchen schneller macht und damit mehr von ihnen über den Hügel bringt. Ein Katalysator hilft anders: Er senkt den Hügel.',
    ],
    beispiel:
      'Die Thermitreaktion liefert 852 kJ und wird über 2000 °C heiß — losgehen tut sie aber erst, wenn man ein brennendes Magnesiumband hineinhält. Ohne das passiert gar nichts.',
    mehr: ['katalysator', 'exothermEndotherm'],
  },

  katalysator: {
    titel: 'Katalysatoren',
    text: [
      'Ein Katalysator ist ein Stoff, der eine Reaktion beschleunigt, ohne dabei verbraucht zu werden. Am Ende ist er unverändert wieder da und kann sofort von vorn anfangen.',
      'Er wirkt, indem er der Reaktion einen anderen Weg anbietet — einen mit niedrigerer Aktivierungsenergie. Statt über den hohen Hügel geht es durch einen Tunnel. Deshalb reichen oft winzige Mengen für riesige Stoffumsätze.',
      'Zwei Dinge kann ein Katalysator nicht: Er verschiebt kein Gleichgewicht, und er macht aus einer endothermen Reaktion keine exotherme. Er ändert nur, wie schnell der Zustand erreicht wird, nicht welcher es ist. Bei einem Gleichgewicht beschleunigt er beide Richtungen gleich stark.',
      'In der Biologie heißen Katalysatoren Enzyme. Sie sind der Grund, warum in unseren Zellen bei 37 °C Reaktionen ablaufen, für die man im Labor mehrere hundert Grad bräuchte.',
    ],
    beispiel:
      'Wasserstoffperoxid zerfällt von selbst so langsam, dass eine Flasche jahrelang hält. Eine Spur Braunstein — oder ein Tropfen Blut — und es schäumt sofort auf. Der Braunstein lässt sich danach abfiltrieren und wiederverwenden.',
    mehr: ['aktivierungsenergie', 'chemischesGleichgewicht'],
  },

  chemischesGleichgewicht: {
    titel: 'Das chemische Gleichgewicht',
    text: [
      'Viele Reaktionen laufen nicht vollständig ab. Sobald genug Produkt entstanden ist, beginnt es, wieder zu den Ausgangsstoffen zurückzureagieren — und irgendwann sind Hin- und Rückreaktion gleich schnell. Dann ändert sich nichts mehr an den Mengen.',
      'Von außen sieht das aus wie Stillstand, ist aber keiner. Beide Reaktionen laufen weiter, nur eben gleich schnell in beide Richtungen. Deshalb spricht man von einem dynamischen Gleichgewicht und schreibt einen Doppelpfeil ⇌ statt eines einfachen.',
      'Stört man das Gleichgewicht, weicht es aus — und zwar so, dass es der Störung entgegenwirkt. Das ist das Prinzip von Le Chatelier. Nimmt man ein Produkt weg, wird nachproduziert. Erhöht man den Druck, weicht es auf die Seite mit weniger Gasteilchen aus. Erwärmt man eine exotherme Reaktion, weicht sie zurück zu den Ausgangsstoffen.',
      'Daraus entsteht der Zielkonflikt, der in jeder technischen Synthese auftaucht: Was die Ausbeute verbessert, macht die Reaktion oft zu langsam — und umgekehrt.',
    ],
    beispiel:
      'Beim Haber-Bosch-Verfahren wäre Kälte gut für die Ausbeute, weil die Reaktion exotherm ist. Bei Kälte dauert sie aber Jahre. Also arbeitet man bei 450 °C, gleicht die schlechtere Ausbeute mit 200 bar Druck aus und beschleunigt zusätzlich mit einem Katalysator.',
    mehr: ['katalysator', 'exothermEndotherm'],
  },

  redoxreaktion: {
    titel: 'Oxidation und Reduktion',
    text: [
      'Eine Redoxreaktion ist eine Reaktion, bei der Elektronen den Besitzer wechseln. Wer Elektronen abgibt, wird oxidiert. Wer sie aufnimmt, wird reduziert.',
      'Beides geht immer zusammen — Elektronen können nicht einfach verschwinden. Wo einer abgibt, muss ein anderer aufnehmen, und zwar genau gleich viele. Daher der zusammengesetzte Name: Reduktion und Oxidation.',
      'Der Begriff "Oxidation" kommt vom Sauerstoff, weil das die ersten untersuchten Fälle waren: Rosten, Verbrennen, Atmen. Er ist heute aber weiter gefasst. Auch die Reaktion von Natrium mit Chlor ist eine Oxidation, obwohl kein Sauerstoff beteiligt ist — entscheidend ist die Elektronenabgabe, nicht der Reaktionspartner.',
      'Praktisch erkennt man Redoxreaktionen an den Oxidationszahlen: Ändert sich mindestens eine, handelt es sich um eine Redoxreaktion.',
    ],
    beispiel:
      'Bei der Thermitreaktion gibt Aluminium Elektronen ab (0 → +III) und wird oxidiert. Eisen nimmt sie auf (+III → 0) und wird reduziert. Das Aluminium reißt dem Eisen den Sauerstoff regelrecht weg.',
    mehr: ['ionenbindung', 'elektronegativitaet', 'metalleNichtmetalle'],
  },

  // -----------------------------------------------------------------
  // Stöchiometrie
  // -----------------------------------------------------------------

  stoffmenge: {
    titel: 'Stoffmenge und das Mol',
    text: [
      'Atome sind zu klein, um sie einzeln zu zählen oder zu wiegen. Die Chemie rechnet deshalb nicht in Stückzahlen, sondern in Portionen: Ein Mol ist die Stoffmenge, die aus 6,022·10²³ Teilchen besteht.',
      'Der Sinn dieser krummen Zahl: Sie verbindet die Teilchenwelt mit der Waage. Ein Mol eines Stoffes wiegt genau so viel Gramm, wie ein einzelnes Teilchen in der Einheit u wiegt. Ein Kohlenstoffatom hat die Masse 12 u — also wiegt ein Mol Kohlenstoff 12 g.',
      'Damit wird jede Reaktionsgleichung zu einer Wiegevorschrift. Die Koeffizienten in der Gleichung sind Teilchenverhältnisse, und über die molare Masse werden daraus Gramm, die man abwiegen kann.',
    ],
    formel: 'n = m / M',
    beispiel:
      '18 g Wasser: M(H₂O) = 18,02 g/mol, also n = 18 g ÷ 18,02 g/mol ≈ 1 mol. Das sind rund 6·10²³ Wassermoleküle — und passt in einen Esslöffel.',
    mehr: ['molareMasse'],
  },

  molaresVolumen: {
    titel: 'Das molare Volumen',
    text: [
      'Ein Mol eines Gases nimmt immer ungefähr denselben Raum ein — rund 22,4 Liter. Und zwar unabhängig davon, um welches Gas es sich handelt.',
      'Das klingt zunächst unglaublich: Ein Mol Wasserstoff wiegt 2 Gramm, ein Mol Kohlenstoffdioxid 44 Gramm, und trotzdem füllen beide dieselbe Kiste. Der Grund ist, dass in einem Gas fast nur leerer Raum ist. Die Teilchen selbst nehmen kaum Platz ein — es zählt nur, wie viele es sind und wie weit sie auseinanderfliegen.',
      'Wichtig ist der Bezugszustand, denn Gase dehnen sich bei Wärme aus. Bei Normbedingungen (0 °C und 1013 hPa) sind es 22,4 L/mol, bei Standardbedingungen (25 °C und 1000 hPa) rund 24,8 L/mol. Im deutschen Unterricht ist meist der erste Wert gemeint.',
      'Für Feststoffe und Flüssigkeiten gilt das alles nicht — dort berühren sich die Teilchen, und das Volumen hängt sehr wohl davon ab, welcher Stoff es ist.',
    ],
    formel: 'V = n · V_m   mit V_m = 22,4 L/mol (0 °C, 1013 hPa)',
    beispiel:
      'Ein Luftballon mit 22,4 Litern Helium enthält ein Mol Helium — also 6·10²³ Atome, die zusammen nur 4 Gramm wiegen.',
    mehr: ['stoffmenge', 'molareMasse'],
  },

  massenanteil: {
    titel: 'Der Massenanteil',
    text: [
      'Der Massenanteil sagt, welcher Bruchteil der Masse einer Verbindung auf ein bestimmtes Element entfällt. Man gibt ihn meist in Prozent an.',
      'Er wird oft mit der Anzahl der Atome verwechselt, ist aber etwas anderes. In Wasser stecken doppelt so viele Wasserstoff- wie Sauerstoffatome — trotzdem macht Wasserstoff nur 11 % der Masse aus. Sauerstoffatome sind eben sechzehnmal schwerer.',
      'Praktisch braucht man das, um von einer Analyse zur Formel zu kommen: Ein Labor bestimmt die Massenanteile, und daraus lässt sich rückwärts das Atomverhältnis und damit die Verhältnisformel berechnen.',
    ],
    formel: 'w(Element) = (Anzahl · M(Element)) / M(Verbindung)',
    beispiel:
      'In Wasser: 2 · 1,008 g/mol = 2,016 g/mol Wasserstoff bei 18,015 g/mol insgesamt — also 11,2 %. Der Rest, 88,8 %, ist Sauerstoff.',
    mehr: ['molareMasse', 'stoffmenge'],
  },

  konzentrationThema: {
    titel: 'Konzentration und Verdünnen',
    text: [
      'Die Stoffmengenkonzentration sagt, wie viel Stoff in einem Liter Lösung steckt. Ihre Einheit ist mol/L, und man schreibt sie mit dem Stoff in Klammern: c(NaCl) = 0,1 mol/L.',
      'Um eine solche Lösung anzusetzen, rechnet man in zwei Schritten. Erst c · V, das ergibt die Stoffmenge. Dann mal der molaren Masse, das ergibt die Gramm, die man abwiegt.',
      'Ein Detail, das im Praktikum zählt: „auf 500 mL auffüllen" ist nicht dasselbe wie „500 mL Wasser dazugeben". Der gelöste Stoff nimmt selbst Platz ein. Deshalb wiegt man ihn in einen Messkolben ein und füllt bis zur Markierung auf.',
      'Beim Verdünnen ändert sich das Volumen, die Stoffmenge aber nicht — es kommt ja nur Wasser dazu. Daraus folgt unmittelbar c₁ · V₁ = c₂ · V₂. Wer eine Lösung auf ein Zehntel verdünnen will, füllt sie auf das Zehnfache auf.',
    ],
    formel: 'c = n / V   ·   Verdünnen: c₁ · V₁ = c₂ · V₂',
    beispiel:
      'Für 500 mL einer 0,1-molaren Kochsalzlösung: n = 0,1 mol/L · 0,5 L = 0,05 mol. Mal 58,44 g/mol ergibt 2,92 g Kochsalz, im Messkolben auf 500 mL aufgefüllt.',
    mehr: ['stoffmenge', 'molareMasse'],
  },

  reaktionsgleichung: {
    titel: 'Reaktionsgleichungen ausgleichen',
    text: [
      'Bei einer chemischen Reaktion werden Atome nur neu angeordnet — es entsteht keines aus dem Nichts, und es verschwindet keines. Deshalb muss von jedem Element links genauso viel stehen wie rechts.',
      'Verändern darf man dabei nur die Zahlen VOR den Formeln, die Koeffizienten. Die Indizes innerhalb einer Formel sind tabu: Aus H₂O eine H₂O₂ zu machen, damit es aufgeht, wäre ein anderer Stoff — Wasser gegen Wasserstoffperoxid.',
      'Von Hand geht man meist der Reihe nach vor: erst die Elemente, die nur in einer Verbindung auf jeder Seite vorkommen, zuletzt Sauerstoff und Wasserstoff, die überall auftauchen. Am Ende kürzt man die Koeffizienten so weit wie möglich.',
      'Diese App probiert nicht herum, sondern rechnet: Jedes Element liefert eine Gleichung, jeder Stoff eine Unbekannte, und das entstehende lineare Gleichungssystem wird exakt gelöst.',
    ],
    formel: 'Fe + O₂ → Fe₂O₃  wird zu  4 Fe + 3 O₂ → 2 Fe₂O₃',
    beispiel:
      'Bei 4 Fe + 3 O₂ → 2 Fe₂O₃ stehen links 4 Eisen und 6 Sauerstoff, rechts 2 · 2 = 4 Eisen und 2 · 3 = 6 Sauerstoff. Die Probe ist genau diese Zählung.',
    mehr: ['stoffmenge', 'molareMasse'],
  },

  molareMasse: {
    titel: 'Die molare Masse',
    text: [
      'Die molare Masse M gibt an, wie viel Gramm ein Mol eines Stoffes wiegt. Ihre Einheit ist g/mol.',
      'Für ein Element steht sie im Periodensystem — es ist dieselbe Zahl wie die Atommasse in u. Für eine Verbindung addiert man die molaren Massen aller Atome in der Formel, jeweils mit ihrem Index multipliziert.',
      'Weil die Werte im Periodensystem Mittelwerte über die natürlichen Isotope sind, sind sie krumm. Chlor hat 35,45 g/mol, obwohl es kein einziges Chloratom mit dieser Masse gibt: Die Natur mischt ³⁵Cl und ³⁷Cl im Verhältnis von etwa 3 zu 1.',
    ],
    formel: 'M(H₂SO₄) = 2·1,008 + 32,06 + 4·15,999 = 98,08 g/mol',
    mehr: ['stoffmenge'],
  },

  // -----------------------------------------------------------------
  // Säure und Base
  // -----------------------------------------------------------------

  phWert: {
    titel: 'Der pH-Wert',
    text: [
      'Der pH-Wert ist der negative dekadische Logarithmus der Oxonium-Ionen-Konzentration. Der Logarithmus steckt darin, weil sich diese Konzentration über mehr als vierzehn Zehnerpotenzen erstreckt — auf einer linearen Skala wäre das nicht darstellbar.',
      'Wichtige Folge: Eine Änderung um eine pH-Einheit bedeutet den Faktor 10 in der Konzentration. Von pH 3 auf pH 1 ist nicht "etwas saurer", sondern hundertmal so sauer.',
    ],
    formel: 'pH = −lg c(H₃O⁺)',
    mehr: ['ionenprodukt'],
  },

  ionenprodukt: {
    titel: 'Das Ionenprodukt des Wassers',
    text: [
      'Wasser reagiert in geringem Maß mit sich selbst — die Autoprotolyse. Dabei entstehen gleich viele Oxonium- und Hydroxid-Ionen, bei 25 °C jeweils 10⁻⁷ mol/L. Das Produkt beider Konzentrationen ist eine Konstante.',
      'Daraus folgt die vertraute Regel pH + pOH = 14. Sie gilt aber nur bei 25 °C: Die Autoprotolyse ist endotherm, bei höherer Temperatur läuft sie weiter ab. Bei 100 °C liegt der Neutralpunkt bei pH 6,14 — neutral, nicht sauer.',
    ],
    formel: 'K_W = c(H₃O⁺) · c(OH⁻) = 10⁻¹⁴ mol²/L² (25 °C)',
    mehr: ['phWert'],
  },

  // -----------------------------------------------------------------
  // Weitere Themen folgen: Elektronegativität, Oxidationszahlen,
  // Nernst-Gleichung, Mesomerie, funktionelle Gruppen, …
  // -----------------------------------------------------------------
};

// Gibt ein Thema zurück oder null, wenn die ID nicht existiert. So führt
// ein Tippfehler im Screen nicht zum Absturz, sondern nur dazu, dass der
// Info-Knopf nichts anzeigt.
export function holeThema(id) {
  return THEMEN[id] || null;
}
