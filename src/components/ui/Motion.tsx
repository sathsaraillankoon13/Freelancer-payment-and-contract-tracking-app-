import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Animated, Easing, Modal, ModalProps, TouchableOpacity, TouchableOpacityProps,
  ViewProps, StyleProp, ViewStyle, StyleSheet,
} from 'react-native';
import { useReducedMotion } from '@/context/MotionContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const easeOut = Easing.out(Easing.cubic);

export function MotionTabIcon({ active, children }: React.PropsWithChildren<{ active: boolean }>) {
  const reducedMotion = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(active ? 1 : 0));
  useEffect(() => {
    if (reducedMotion) {
      progress.setValue(active ? 1 : 0);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: active ? 1 : 0, duration: 180, easing: easeOut,
      useNativeDriver: true, isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [active, reducedMotion, progress]);
  return (
    <Animated.View style={{ width: 46, height: 32, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View pointerEvents="none" style={{
        position: 'absolute', width: 44, height: 28, borderRadius: 12, backgroundColor: '#E9DDFB',
        opacity: progress,
        transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
      }} />
      {children}
    </Animated.View>
  );
}

/** Same layout and touch behavior as TouchableOpacity, with a restrained press response. */
export function MotionTouchable({
  style, onPressIn, onPressOut, disabled, activeOpacity = 0.8, gradient = false, children, ...props
}: TouchableOpacityProps & { gradient?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [scale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (reducedMotion || disabled) {
      scale.stopAnimation();
      scale.setValue(1);
    }
    return () => scale.stopAnimation();
  }, [reducedMotion, disabled, scale]);

  const respond = (pressed: boolean) => {
    scale.stopAnimation();
    if (reducedMotion || disabled) {
      scale.setValue(1);
      return;
    }
    Animated.timing(scale, {
      toValue: pressed ? 0.975 : 1,
      duration: pressed ? 90 : 160,
      easing: easeOut,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  };

  return (
    <AnimatedTouchable
      accessibilityRole="button"
      {...props}
      disabled={disabled}
      activeOpacity={reducedMotion ? 1 : activeOpacity}
      style={[style, { transform: [{ scale }] }]}
      onPressIn={(event) => { respond(true); onPressIn?.(event); }}
      onPressOut={(event) => { respond(false); onPressOut?.(event); }}
    >
      {gradient && <LinearGradient pointerEvents="none" colors={['#9470EC', '#7547D7', '#5F39B1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: StyleSheet.flatten(style)?.borderRadius || 16 }]} />}
      {children}
    </AnimatedTouchable>
  );
}

/** Only mount/key changes replay an entrance; ordinary data updates keep the view intact. */
export function MotionView({
  delay = 0, style, children, ...props
}: ViewProps & { delay?: number }) {
  const reducedMotion = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(reducedMotion ? 1 : 0));

  useEffect(() => {
    if (reducedMotion) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 240,
      delay: Math.min(Math.max(delay, 0), 180),
      easing: easeOut,
      useNativeDriver: true,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reducedMotion, delay]);

  return (
    <Animated.View {...props} style={[style, {
      opacity: progress,
      transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
    }]}>
      {children}
    </Animated.View>
  );
}

/** Retain native sheet presentation and back-button behavior, respecting reduced motion. */
export function MotionModal({ animationType = 'slide', ...props }: ModalProps) {
  const reducedMotion = useReducedMotion();
  return <Modal {...props} animationType={reducedMotion ? 'none' : animationType} />;
}

/** A left-anchored, native-driven fill that animates when the underlying value changes. */
export function MotionProgress({ value, style }: { value: number; style?: StyleProp<ViewStyle> }) {
  const reducedMotion = useReducedMotion();
  const target = Number.isFinite(value) ? Math.max(0, Math.min(value, 100)) / 100 : 0;
  const [progress] = useState(() => new Animated.Value(reducedMotion ? target : 0));
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      progress.setValue(target);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: target, duration: 300, easing: easeOut,
      useNativeDriver: true, isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reducedMotion, target]);

  return (
    <Animated.View
      accessibilityRole="progressbar"
      accessibilityLabel="Progress"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(target * 100) }}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[style, { width: '100%', transform: [
        { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [-width / 2, 0] }) },
        { scaleX: progress },
      ] }]}
    />
  );
}
