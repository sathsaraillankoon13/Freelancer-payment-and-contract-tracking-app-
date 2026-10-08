import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/** Soft, static color gives depth without scroll-time animation or extra touch targets. */
export function ScreenBackdrop() {
  return <LinearGradient pointerEvents="none" colors={['#E7D9FA', '#F5EEFC', '#FFF4EA']} locations={[0, 0.48, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />;
}
export function HeroGradient() {
  return <LinearGradient pointerEvents="none" colors={['#9771EB', '#7547D7', '#5B35AA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: 22 }]} />;
}
