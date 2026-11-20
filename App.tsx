import React, { useState } from 'react';
import { StatusBar, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStore, useStore } from './src/storage/AppStore';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Loader, Onboarding } from './src/screens/Welcome';
import { Button } from './src/components/UI';
import { colors, styles } from './src/theme';
function Content() {
  const { ready, error, reload, state } = useStore();
  const [loaded, setLoaded] = useState(false);
  if (!loaded) {
    return <Loader onDone={() => setLoaded(true)} />;
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 24 }}>
        <Text style={styles.heading}>Couldn’t load your saved data</Text>
        <Text style={styles.body}>
          Please try again. Your existing data has not been replaced.
        </Text>
        <Button title="Try again" onPress={reload} />
      </View>
    );
  }
  if (!ready) {
    return <ActivityIndicator color={colors.pink} style={{ flex: 1 }} />;
  }
  return state.onboarded ? <AppNavigator /> : <Onboarding />;
}
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <AppStore>
          <Content />
        </AppStore>
      </View>
    </SafeAreaProvider>
  );
}
