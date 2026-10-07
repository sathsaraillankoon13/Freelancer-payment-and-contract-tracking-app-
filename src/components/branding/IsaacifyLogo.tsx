import React from 'react';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  SvgProps,
} from 'react-native-svg';
import { colors } from '@/theme/colors';

interface IsaacifyLogoProps extends SvgProps {
  size?: number;
  width?: number;
  height?: number;
}

export const IsaacifyLogo: React.FC<IsaacifyLogoProps> = ({
  size,
  width = 60,
  height = 70,
  ...props
}) => {
  // If size is provided, scale proportionally based on 60:70 aspect ratio
  const logoWidth = size ? size : width;
  const logoHeight = size ? Math.round((size * 70) / 60) : height;

  return (
    <Svg
      width={logoWidth}
      height={logoHeight}
      viewBox="0 0 60 70"
      fill="none"
      {...props}
    >
      <Defs>
        <LinearGradient
          id="topFaceGrad"
          x1="30"
          y1="1"
          x2="30"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor={colors.primaryTopTip} />
          <Stop offset="1" stopColor={colors.primaryLight} />
        </LinearGradient>
      </Defs>

      {/* Top Diamond Face */}
      <Path
        d="M 30 1 L 59 17 L 30 34 L 1 17 Z"
        fill="url(#topFaceGrad)"
      />

      {/* Left Face Base */}
      <Path
        d="M 1 17 L 30 34 L 30 69 L 1 52 Z"
        fill={colors.primaryMedium}
      />

      {/* Left Face Inner Geometric Facet / Shadow */}
      <Path
        d="M 17 26.5 L 30 34 L 30 52 L 17 44.5 Z"
        fill={colors.primaryLeftFacet}
      />

      {/* Right Face */}
      <Path
        d="M 30 34 L 59 17 L 59 52 L 30 69 Z"
        fill={colors.primaryDark}
      />

      {/* Center Vertex Dot */}
      <Circle
        cx="30"
        cy="34"
        r="1.8"
        fill={colors.white}
      />
    </Svg>
  );
};

export default IsaacifyLogo;
