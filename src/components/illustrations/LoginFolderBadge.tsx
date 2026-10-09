import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  Defs,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';

export const LoginFolderBadge: React.FC = () => {
  return (
    <View style={styles.container}>
      <Svg width={140} height={100} viewBox="0 0 140 100" fill="none">
        <Defs>
          {/* Lavender background glow */}
          <RadialGradient
            id="loginGlow"
            cx="70"
            cy="50"
            rx="55"
            ry="40"
            fx="70"
            fy="50"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="#E9DFFB" stopOpacity="0.9" />
            <Stop offset="50" stopColor="#F3EEFD" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#FAF9FD" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Glow */}
        <Circle cx="70" cy="50" r="45" fill="url(#loginGlow)" />

        {/* Floating white rounded card */}
        <G>
          {/* Subtle card shadow */}
          <Rect
            x="45"
            y="26"
            width="52"
            height="48"
            rx="16"
            fill="#DDD5F8"
            opacity="0.5"
          />
          {/* White card */}
          <Rect
            x="44"
            y="24"
            width="52"
            height="48"
            rx="16"
            fill="#FFFFFF"
          />

          {/* Purple folder icon inside */}
          {/* Folder back tab */}
          <Path
            d="M53 38 C53 36.5 54.2 35.5 55.7 35.5 L60 35.5 C61.2 35.5 62 36.2 62.6 37 L63.6 38 Z"
            fill="#5B38B9"
          />
          {/* Folder body */}
          <Rect
            x="53"
            y="37"
            width="34"
            height="23"
            rx="6"
            fill="#6D4BCB"
          />
          {/* Folder front flap slit */}
          <Path
            d="M58 44 L68 44 C69 44 69.8 44.6 70.3 45.4 L71 47 L82 47"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />
        </G>

        {/* Blue checkmark badge at top-right */}
        <G>
          <Circle
            cx="94"
            cy="24"
            r="8"
            fill="#93C5FD"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          {/* Checkmark icon */}
          <Path
            d="M91 24.5 L93 26.5 L97 22.5"
            stroke="#1D4ED8"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Small purple dot at bottom-left */}
        <Circle cx="39" cy="67" r="4" fill="#9381D5" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
});

export default LoginFolderBadge;
