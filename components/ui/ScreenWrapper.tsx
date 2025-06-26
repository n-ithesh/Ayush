// components/ui/ScreenWrapper.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export default function ScreenWrapper({
  children,
  edges = ['top', 'left', 'right'],
}: Props) {
  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
