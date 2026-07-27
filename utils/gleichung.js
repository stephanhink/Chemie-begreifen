// Reaktionsgleichungen ausgleichen.
//
// Eingabe ist Text, wie man ihn hinschreibt: "Fe + O2 -> Fe2O3".
// Ausgabe sind die kleinsten ganzzahligen Koeffizienten.
//
// Das Verfahren ist lineare Algebra, kein Probieren. Jedes Element
// liefert eine Gleichung ("links so viele Eisenatome wie rechts"), jeder
// Stoff eine Unbekannte. Gesucht ist eine Lösung des homogenen
// Gleichungssystems A · x = 0 mit möglichst kleinen positiven ganzen
// Zahlen.
//
// Gerechnet wird mit Brüchen, nicht mit Kommazahlen. Bei einer Gleichung
// wie C₆H₁₂O₆ + O₂ → CO₂ + H₂O entstehen beim Eliminieren Zwischenwerte
// wie 1/3 — mit Gleitkommazahlen käme am Ende 5,999999 statt 6 heraus,
// und man müsste raten, ob das eine 6 sein soll.

import { parseFormel } from './formel';
import { elementNachSymbol } from './elemente';

// ---------------------------------------------------------------------
// Brüche
// ---------------------------------------------------------------------

function ggT(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function kgV(a, b) {
  return Math.abs(a * b) / ggT(a, b);
}

// Ein Bruch ist [Zähler, Nenner], immer gekürzt und mit positivem Nenner.
function bruch(zaehler, nenner = 1) {
  if (nenner === 0) {
    throw new Error('Division durch null');
  }
  if (nenner < 0) {
    zaehler = -zaehler;
    nenner = -nenner;
  }
  const t = ggT(zaehler, nenner) || 1;
  return [zaehler / t, nenner / t];
}

const minus = ([a, b], [c, d]) => bruch(a * d - c * b, b * d);
const mal = ([a, b], [c, d]) => bruch(a * c, b * d);
const geteilt = ([a, b], [c, d]) => bruch(a * d, b * c);
const istNull = ([a]) => a === 0;

// ---------------------------------------------------------------------
// Eingabe zerlegen
// ---------------------------------------------------------------------

// Zerlegt "2 Fe + O2 -> Fe2O3" in Edukte und Produkte.
// Vorhandene Koeffizienten werden verworfen — sie sollen ja gerade
// berechnet werden.
export function parseGleichung(text) {
  const seiten = String(text).split(/->|→|=|⇌/);
  if (seiten.length !== 2) {
    throw new Error('Die Gleichung braucht genau einen Pfeil, z. B. "Fe + O2 -> Fe2O3"');
  }

  const seite = (roh) =>
    roh
      .split('+')
      .map((s) => s.trim().replace(/^\d+\s*/, ''))
      .filter(Boolean);

  const edukte = seite(seiten[0]);
  const produkte = seite(seiten[1]);

  if (!edukte.length || !produkte.length) {
    throw new Error('Auf beiden Seiten des Pfeils muss mindestens ein Stoff stehen');
  }

  // Jede Formel einmal durch den Parser schicken: So kommen Tippfehler
  // sofort ans Licht und nicht erst als unlösbares Gleichungssystem.
  //
  // Der Parser prüft nur die Schreibweise. "Xx" sieht für ihn aus wie
  // ein Elementsymbol — deshalb wird hier zusätzlich gegen das
  // Periodensystem geprüft. Sonst würde die App eine Gleichung mit
  // einem erfundenen Element bereitwillig ausgleichen.
  for (const formel of [...edukte, ...produkte]) {
    for (const symbol of Object.keys(parseFormel(formel))) {
      if (!elementNachSymbol(symbol)) {
        throw new Error(`"${symbol}" in ${formel} ist kein Element des Periodensystems`);
      }
    }
  }

  // Stehen links und rechts dieselben Stoffe, passiert nichts. Rein
  // rechnerisch ginge die Bilanz auf — als Reaktion ist es Unsinn.
  const gleicheStoffe =
    edukte.length === produkte.length &&
    [...edukte].sort().join('|') === [...produkte].sort().join('|');
  if (gleicheStoffe) {
    throw new Error(
      'Links und rechts stehen dieselben Stoffe — dann findet keine Reaktion statt'
    );
  }

  return { edukte, produkte };
}

// ---------------------------------------------------------------------
// Ausgleichen
// ---------------------------------------------------------------------

export function gleicheAus(text) {
  const { edukte, produkte } = parseGleichung(text);
  const stoffe = [...edukte, ...produkte];

  const atome = stoffe.map(parseFormel);
  const elemente = [...new Set(atome.flatMap(Object.keys))].sort();

  // Prüfen, ob überhaupt beide Seiten dieselben Elemente enthalten.
  // Sonst ist die Gleichung nicht auszugleichen, und der Grund dafür
  // lässt sich viel besser benennen als "keine Lösung gefunden".
  const linkeElemente = new Set(atome.slice(0, edukte.length).flatMap(Object.keys));
  const rechteElemente = new Set(atome.slice(edukte.length).flatMap(Object.keys));
  for (const el of elemente) {
    if (!linkeElemente.has(el)) {
      throw new Error(`${el} kommt nur rechts vor — aus dem Nichts entstehen keine Atome`);
    }
    if (!rechteElemente.has(el)) {
      throw new Error(`${el} kommt nur links vor — Atome verschwinden nicht`);
    }
  }

  // Matrix aufbauen: eine Zeile je Element, eine Spalte je Stoff.
  // Produkte zählen negativ, damit die Summe je Element null werden muss.
  const matrix = elemente.map((element) =>
    atome.map((formel, i) => {
      const anzahl = formel[element] || 0;
      return bruch(i < edukte.length ? anzahl : -anzahl);
    })
  );

  const koeffizienten = loeseNullraum(matrix, stoffe.length);

  return {
    edukte,
    produkte,
    koeffizienten,
    eduktKoeffizienten: koeffizienten.slice(0, edukte.length),
    produktKoeffizienten: koeffizienten.slice(edukte.length),
  };
}

// Sucht einen Vektor x ≠ 0 mit A · x = 0 und macht daraus die kleinsten
// positiven ganzen Zahlen.
function loeseNullraum(matrix, spalten) {
  const zeilen = matrix.length;
  const a = matrix.map((z) => [...z]);

  // Gauß-Jordan bis zur reduzierten Stufenform
  const pivotSpalten = [];
  let zeile = 0;

  for (let spalte = 0; spalte < spalten && zeile < zeilen; spalte++) {
    let pivot = -1;
    for (let r = zeile; r < zeilen; r++) {
      if (!istNull(a[r][spalte])) {
        pivot = r;
        break;
      }
    }
    if (pivot === -1) {
      continue;
    }

    [a[zeile], a[pivot]] = [a[pivot], a[zeile]];

    const teiler = a[zeile][spalte];
    for (let s = 0; s < spalten; s++) {
      a[zeile][s] = geteilt(a[zeile][s], teiler);
    }

    for (let r = 0; r < zeilen; r++) {
      if (r !== zeile && !istNull(a[r][spalte])) {
        const faktor = a[r][spalte];
        for (let s = 0; s < spalten; s++) {
          a[r][s] = minus(a[r][s], mal(faktor, a[zeile][s]));
        }
      }
    }

    pivotSpalten.push(spalte);
    zeile++;
  }

  const freie = [];
  for (let s = 0; s < spalten; s++) {
    if (!pivotSpalten.includes(s)) {
      freie.push(s);
    }
  }

  if (freie.length === 0) {
    throw new Error(
      'Diese Gleichung hat nur die triviale Lösung — so lässt sie sich nicht ausgleichen'
    );
  }
  if (freie.length > 1) {
    throw new Error(
      'Diese Gleichung lässt sich auf mehrere Arten ausgleichen. Sie beschreibt vermutlich mehrere Reaktionen gleichzeitig.'
    );
  }

  // Die eine freie Variable auf 1 setzen und rückwärts einsetzen.
  const x = Array.from({ length: spalten }, () => bruch(0));
  x[freie[0]] = bruch(1);
  pivotSpalten.forEach((spalte, i) => {
    x[spalte] = mal(bruch(-1), a[i][freie[0]]);
  });

  // Brüche zu ganzen Zahlen: mit dem kleinsten gemeinsamen Nenner
  // multiplizieren, dann durch den größten gemeinsamen Teiler kürzen.
  const nenner = x.reduce((acc, [, n]) => kgV(acc, n), 1);
  let ganze = x.map(([z, n]) => (z * nenner) / n);

  const teiler = ganze.reduce((acc, w) => ggT(acc, w), 0);
  if (teiler > 1) {
    ganze = ganze.map((w) => w / teiler);
  }

  // Alle negativ? Dann liegt es nur am Vorzeichen der freien Variablen.
  if (ganze.every((w) => w <= 0)) {
    ganze = ganze.map((w) => -w);
  }

  if (ganze.some((w) => w <= 0)) {
    throw new Error(
      'Für diese Gleichung gibt es keine Lösung mit positiven Koeffizienten — vermutlich stehen die Stoffe auf der falschen Seite'
    );
  }

  return ganze;
}

// Setzt die ausgeglichene Gleichung als Text zusammen.
export function gleichungAlsText(ergebnis, formatiere = (f) => f) {
  const seite = (formeln, koeffizienten) =>
    formeln
      .map((formel, i) => (koeffizienten[i] === 1 ? '' : `${koeffizienten[i]} `) + formatiere(formel))
      .join(' + ');

  return `${seite(ergebnis.edukte, ergebnis.eduktKoeffizienten)} → ${seite(
    ergebnis.produkte,
    ergebnis.produktKoeffizienten
  )}`;
}

// Zählt die Atome je Element auf beiden Seiten — für die Anzeige der
// Kontrolle, mit der man das Ergebnis selbst nachprüfen kann.
export function atombilanz(ergebnis) {
  const zaehle = (formeln, koeffizienten) => {
    const summe = {};
    formeln.forEach((formel, i) => {
      for (const [sym, anzahl] of Object.entries(parseFormel(formel))) {
        summe[sym] = (summe[sym] || 0) + anzahl * koeffizienten[i];
      }
    });
    return summe;
  };

  const links = zaehle(ergebnis.edukte, ergebnis.eduktKoeffizienten);
  const rechts = zaehle(ergebnis.produkte, ergebnis.produktKoeffizienten);

  return [...new Set([...Object.keys(links), ...Object.keys(rechts)])]
    .sort()
    .map((symbol) => ({
      symbol,
      links: links[symbol] || 0,
      rechts: rechts[symbol] || 0,
    }));
}
