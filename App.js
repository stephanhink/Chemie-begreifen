import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
// SafeAreaView kommt aus react-native-safe-area-context, nicht aus react-native:
// die eingebaute Variante ist auf Android wirkungslos und seit React Native 0.86
// abgekündigt. Seit Expo SDK 55 zeichnet Android verpflichtend "edge-to-edge",
// also bis unter Status- und Gestenleiste — ohne echte Insets würde die
// Tab-Leiste unten darunter rutschen.
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { farben } from './utils/konstanten';
import PeriodensystemScreen from './screens/PeriodensystemScreen';
import StoechiometrieScreen from './screens/StoechiometrieScreen';
import SaeureBaseScreen from './screens/SaeureBaseScreen';
import RedoxScreen from './screens/RedoxScreen';
import OrganikScreen from './screens/OrganikScreen';

// Jeder Tab bekommt einen Schlüssel, ein Label für die Tab-Leiste und
// die Screen-Komponente, die angezeigt wird. Ein neues Themengebiet
// (z. B. Energetik oder Kinetik) bedeutet: neue Screen-Datei bauen und
// hier einen Eintrag hinzufügen — mehr nicht.
//
// Die Labels sind bewusst kurz: Bei fünf Tabs nebeneinander bleibt auf
// einem Handy-Display pro Tab kaum mehr als ein Wort Platz.
const TABS = [
  { key: 'pse', label: 'PSE', Screen: PeriodensystemScreen },
  { key: 'stoechiometrie', label: 'Stöchio.', Screen: StoechiometrieScreen },
  { key: 'saeurebase', label: 'Säure/Base', Screen: SaeureBaseScreen },
  { key: 'redox', label: 'Redox', Screen: RedoxScreen },
  { key: 'organik', label: 'Organik', Screen: OrganikScreen },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const ActiveScreen = TABS.find((tab) => tab.key === activeTab).Screen;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        <StatusBar style="auto" />
        <View style={styles.inhalt}>
          <ActiveScreen />
        </View>
        <View style={styles.tabLeiste}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.key}
              style={styles.tab}
              onPress={() => setActiveTab(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab.key === activeTab }}
            >
              <Text
                style={[
                  styles.tabText,
                  tab.key === activeTab && styles.tabTextAktiv,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inhalt: {
    flex: 1,
  },
  tabLeiste: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#888',
  },
  tabTextAktiv: {
    color: farben.primaer,
    fontWeight: '700',
  },
});
