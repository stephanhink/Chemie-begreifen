// Führt alle Prüfungen aus. Das ist der Einstiegspunkt von `npm test`.
//
// Die Reihenfolge folgt der Abhängigkeit: Erst die Grundlagen
// (Elemente, Formelparser), dann was darauf aufbaut. Schlägt der Parser
// fehl, sieht man das zuerst und muss nicht raten, woher die Folgefehler
// kommen.
import './elemente.mjs';
import './formel.mjs';
import './ionen.mjs';
import './reaktionen.mjs';
import './stoechiometrie.mjs';
import './gleichung.mjs';
import './saeurebase.mjs';
import './redox.mjs';
import './organik.mjs';
import './wissen.mjs';
