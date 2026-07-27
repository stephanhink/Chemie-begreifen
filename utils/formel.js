// Chemische Formeln lesen und schreiben.
//
// Formeln werden im Code in schlichter Schreibweise abgelegt ("Ca(OH)2",
// "CuSO4 * 5 H2O") und erst beim Anzeigen in die richtige Typografie
// gebracht ("Ca(OH)₂"). Zwei Gründe: Tiefgestellte Ziffern lassen sich
// nicht rechnen, und beim Eintippen von hundert Formeln wäre jeder
// Zahlendreher in einem ₂ unsichtbar.
//
// Diese Datei ist die Grundlage für zwei Dinge: die Prüfung, ob eine
// Reaktionsgleichung ausgeglichen ist, und später die Berechnung molarer
// Massen im Stöchiometrie-Screen.

// Zerlegt eine Formel in die Anzahl der Atome je Element.
//
//   parseFormel('H2O')        → { H: 2, O: 1 }
//   parseFormel('Ca(OH)2')    → { Ca: 1, O: 2, H: 2 }
//   parseFormel('CuSO4*5H2O') → { Cu: 1, S: 1, O: 9, H: 10 }
//
// Wirft bei ungültiger Eingabe einen Fehler, statt still etwas Falsches
// zurückzugeben — eine stillschweigend falsche Summenformel wäre in
// jeder Folgerechnung unsichtbar.
export function parseFormel(formel) {
  // Kristallwasser: "CuSO4 * 5 H2O" besteht aus zwei Teilen, der zweite
  // mit einem Vorfaktor.
  const teile = String(formel).split(/[*·]/);
  const gesamt = {};

  for (const teil of teile) {
    const bereinigt = teil.replace(/\s+/g, '');
    if (!bereinigt) {
      throw new Error(`Leerer Formelteil in "${formel}"`);
    }
    // Vorfaktor eines Hydratteils, z. B. die 5 in "5H2O"
    const mitFaktor = bereinigt.match(/^(\d+)(.*)$/);
    const faktor = mitFaktor ? Number(mitFaktor[1]) : 1;
    const rest = mitFaktor ? mitFaktor[2] : bereinigt;

    const atome = teilParsen(rest, formel);
    // Eine nackte Zahl ohne Elementsymbol ist keine Formel. Ohne diese
    // Prüfung käme dabei stillschweigend ein leeres Ergebnis heraus.
    if (Object.keys(atome).length === 0) {
      throw new Error(`Kein Elementsymbol in "${formel}"`);
    }

    addiere(gesamt, atome, faktor);
  }

  return gesamt;
}

function addiere(ziel, quelle, faktor) {
  for (const [element, anzahl] of Object.entries(quelle)) {
    ziel[element] = (ziel[element] || 0) + anzahl * faktor;
  }
}

// Der eigentliche Parser. Klammern werden über einen Stapel gelöst: Bei
// "(" beginnt eine neue Ebene, bei ")" wird sie mit ihrem Index
// multipliziert in die darunterliegende eingerechnet.
function teilParsen(text, ganzeFormel) {
  const stapel = [{}];
  let i = 0;

  while (i < text.length) {
    const zeichen = text[i];

    if (zeichen === '(') {
      stapel.push({});
      i++;
      continue;
    }

    if (zeichen === ')') {
      if (stapel.length === 1) {
        throw new Error(`Klammer schließt ohne zu öffnen in "${ganzeFormel}"`);
      }
      const ebene = stapel.pop();
      i++;
      const index = text.slice(i).match(/^\d+/);
      const anzahl = index ? Number(index[0]) : 1;
      if (index) {
        i += index[0].length;
      }
      addiere(stapel[stapel.length - 1], ebene, anzahl);
      continue;
    }

    // Elementsymbol: Großbuchstabe, optional ein Kleinbuchstabe
    const symbol = text.slice(i).match(/^[A-Z][a-z]?/);
    if (!symbol) {
      throw new Error(`Unerwartetes Zeichen "${zeichen}" in "${ganzeFormel}"`);
    }
    i += symbol[0].length;

    const index = text.slice(i).match(/^\d+/);
    const anzahl = index ? Number(index[0]) : 1;
    if (index) {
      i += index[0].length;
    }

    addiere(stapel[stapel.length - 1], { [symbol[0]]: anzahl }, 1);
  }

  if (stapel.length !== 1) {
    throw new Error(`Klammer wird nicht geschlossen in "${ganzeFormel}"`);
  }

  return stapel[0];
}

const TIEF = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };

// Bringt eine Formel in die richtige Typografie:
//
//   formatiereFormel('H2O')          → 'H₂O'
//   formatiereFormel('Ca(OH)2')      → 'Ca(OH)₂'
//   formatiereFormel('CuSO4*5H2O')   → 'CuSO₄ · 5 H₂O'
//
// Der Vorfaktor eines Hydratteils bleibt bewusst groß — er zählt ganze
// Moleküle und ist kein Index.
export function formatiereFormel(formel) {
  return String(formel)
    .split(/[*·]/)
    .map((teil) => {
      const bereinigt = teil.replace(/\s+/g, '');
      const mitFaktor = bereinigt.match(/^(\d+)(.*)$/);
      const vorne = mitFaktor ? `${mitFaktor[1]} ` : '';
      const rest = mitFaktor ? mitFaktor[2] : bereinigt;
      return vorne + rest.replace(/\d+/g, (zahl) =>
        zahl.split('').map((z) => TIEF[z]).join('')
      );
    })
    .join(' · ');
}

// Alle Elementsymbole, die in einer Formel vorkommen.
export function elementeIn(formel) {
  return Object.keys(parseFormel(formel));
}
