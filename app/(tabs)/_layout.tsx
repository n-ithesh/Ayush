import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import CustomTabBar from '../../components/CustomTabBar';
import ScreenWrapper from '../../components/ui/ScreenWrapper';

export default function TabsLayout() {
  return (
    
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* ✅ Custom App Header */}
      <AppHeader />

      {/* ✅ This renders the active tab screen */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* ✅ Custom Bottom Bar */}
      <CustomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    // Note: no paddingTop here — header is outside Slot already!
  },
});
