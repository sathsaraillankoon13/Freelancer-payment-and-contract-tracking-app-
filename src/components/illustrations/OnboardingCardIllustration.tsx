import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 48, 340);
const CARD_HEIGHT = Math.round((CARD_WIDTH * 220) / 340);

export const OnboardingCardIllustration: React.FC = () => {
  return (
    <View style={styles.container}>
      <Svg
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        viewBox="0 0 340 220"
        fill="none"
      >
        <Defs>
          {/* Card background gradient */}
          <LinearGradient
            id="cardBg"
            x1="170"
            y1="0"
            x2="170"
            y2="220"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="#F6F1FE" />
            <Stop offset="1" stopColor="#EDE5FB" />
          </LinearGradient>

          {/* Folder Gradient */}
          <LinearGradient
            id="folderGrad"
            x1="60"
            y1="60"
            x2="210"
            y2="170"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="#7B52E8" />
            <Stop offset="1" stopColor="#673FCB" />
          </LinearGradient>

          {/* Speech bubble gradient */}
          <LinearGradient
            id="chatGrad"
            x1="170"
            y1="120"
            x2="250"
            y2="180"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="#3B82F6" />
            <Stop offset="1" stopColor="#2563EB" />
          </LinearGradient>
        </Defs>

        {/* Outer Rounded Container Card */}
        <Rect
          x="0"
          y="0"
          width="340"
          height="220"
          rx="28"
          fill="url(#cardBg)"
        />

        {/* Sparkles / Stars in background */}
        {/* Star 1 - top left */}
        <Path
          d="M75 58 C75 54 77 52 81 52 C77 52 75 50 75 46 C75 50 73 52 69 52 C73 52 75 54 75 58 Z"
          fill="#60A5FA"
          opacity="0.8"
        />
        {/* Dot near star 1 */}
        <Circle cx="102" cy="46" r="2.5" fill="#A78BFA" opacity="0.7" />

        {/* Star 2 - top right */}
        <Path
          d="M246 62 C246 58 248 56 252 56 C248 56 246 54 246 50 C246 54 244 56 240 56 C244 56 246 58 246 62 Z"
          fill="#A78BFA"
          opacity="0.8"
        />

        {/* Star 3 - middle right */}
        <Path
          d="M256 122 C256 119 257 118 260 118 C257 118 256 117 256 114 C256 117 255 118 252 118 C255 118 256 119 256 122 Z"
          fill="#C4B5FD"
          opacity="0.8"
        />

        {/* Dot far left */}
        <Circle cx="66" cy="120" r="2.5" fill="#C4B5FD" opacity="0.8" />

        {/* Background Document / Sheet */}
        <G>
          <Rect
            x="114"
            y="52"
            width="106"
            height="86"
            rx="14"
            fill="#FFFFFF"
            opacity="0.95"
          />
          {/* Header bar on sheet */}
          <Rect
            x="125"
            y="64"
            width="42"
            height="4"
            rx="2"
            fill="#6D4BCB"
            opacity="0.8"
          />
          <Circle cx="206" cy="66" r="2.5" fill="#93C5FD" />
        </G>

        {/* Foreground Purple Folder */}
        <G>
          {/* Back tab */}
          <Path
            d="M72 82 C72 73 78 68 87 68 L108 68 C115 68 119 72 123 78 L126 82 Z"
            fill="#5630B5"
          />
          {/* Main Folder Body */}
          <Rect
            x="71"
            y="80"
            width="137"
            height="84"
            rx="18"
            fill="url(#folderGrad)"
          />

          {/* Folder inner highlight curve */}
          <Path
            d="M71 96 C110 88 160 88 208 96"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeOpacity="0.2"
          />

          {/* Status pill on folder (bottom left) */}
          <Rect
            x="86"
            y="136"
            width="42"
            height="14"
            rx="7"
            fill="#1E1342"
            opacity="0.45"
          />
          <Circle cx="94" cy="143" r="3" fill="#10B981" />
          <Rect
            x="102"
            y="141"
            width="18"
            height="4"
            rx="2"
            fill="#FFFFFF"
            opacity="0.9"
          />

          {/* Avatar badges on folder top-left */}
          {/* Avatar 1 (Yellow) */}
          <Circle
            cx="96"
            cy="82"
            r="13"
            fill="#FBBF24"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          {/* Face on Avatar 1 */}
          <Circle cx="92" cy="80" r="1.5" fill="#78350F" />
          <Circle cx="100" cy="80" r="1.5" fill="#78350F" />
          <Path
            d="M93 85 C95 87 97 87 99 85"
            stroke="#78350F"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Avatar 2 (Teal) */}
          <Circle
            cx="116"
            cy="82"
            r="13"
            fill="#6EE7B7"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          {/* Face on Avatar 2 */}
          <Circle cx="112" cy="80" r="1.5" fill="#065F46" />
          <Circle cx="120" cy="80" r="1.5" fill="#065F46" />
          <Path
            d="M113 85 C115 87 117 87 119 85"
            stroke="#065F46"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </G>

        {/* Foreground Blue Chat Bubble */}
        <G>
          {/* Bubble body and pointer */}
          <Path
            d="M178 106 C178 97 186 90 196 90 L233 90 C243 90 251 97 251 106 L251 126 C251 135 243 142 233 142 L192 142 L185 152 L185 139 C181 136 178 131 178 126 Z"
            fill="url(#chatGrad)"
          />

          {/* Three dots inside speech bubble */}
          <Circle cx="204" cy="116" r="3.2" fill="#FFFFFF" />
          <Circle cx="215" cy="116" r="3.2" fill="#FFFFFF" />
          <Circle cx="226" cy="116" r="3.2" fill="#FFFFFF" />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
  },
});

export default OnboardingCardIllustration;
