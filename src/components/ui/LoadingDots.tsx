import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';

interface LoadingDotsProps {
  color?: string;
  size?: number;
  gap?: number;
  style?: ViewStyle;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  color = colors.loadingDots,
  size = 7,
  gap = 7,
  style,
}) => {
  const [opacity1] = useState(() => new Animated.Value(0.35));
  const [opacity2] = useState(() => new Animated.Value(0.35));
  const [opacity3] = useState(() => new Animated.Value(0.35));

  useEffect(() => {
    const createPulse = (animatedValue: Animated.Value) => {
      return Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.35,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.delay(350),
      ]);
    };

    const animation = Animated.loop(
      Animated.stagger(180, [
        createPulse(opacity1),
        createPulse(opacity2),
        createPulse(opacity3),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity1, opacity2, opacity3]);

  const dotStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[dotStyle, { opacity: opacity1 }]} />
      <View style={{ width: gap }} />
      <Animated.View style={[dotStyle, { opacity: opacity2 }]} />
      <View style={{ width: gap }} />
      <Animated.View style={[dotStyle, { opacity: opacity3 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingDots;
