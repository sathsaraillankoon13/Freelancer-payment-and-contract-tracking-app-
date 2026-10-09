import React from 'react';
import { Image, ImageProps, StyleProp, ImageStyle } from 'react-native';

const OFFICIAL_LOGO = require('../../logo.png');

// Actual dimensions of src/logo.png: 175 x 154
const LOGO_ASPECT_RATIO = 175 / 154; // ~1.13636

export interface IsaacifyLogoProps extends Partial<ImageProps> {
  size?: number;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
}

/**
 * Official ISAACIFY Logo Component
 * Renders the official asset from src/logo.png with correct aspect ratio and no distortion.
 */
export const IsaacifyLogo: React.FC<IsaacifyLogoProps> = ({
  size,
  width,
  height,
  style,
  ...props
}) => {
  let finalWidth = 80;
  let finalHeight = Math.round(80 / LOGO_ASPECT_RATIO); // ~70

  if (size) {
    finalWidth = size;
    finalHeight = Math.round(size / LOGO_ASPECT_RATIO);
  } else if (width && !height) {
    finalWidth = width;
    finalHeight = Math.round(width / LOGO_ASPECT_RATIO);
  } else if (height && !width) {
    finalHeight = height;
    finalWidth = Math.round(height * LOGO_ASPECT_RATIO);
  } else if (width && height) {
    finalWidth = width;
    finalHeight = height;
  }

  return (
    <Image
      source={OFFICIAL_LOGO}
      style={[
        {
          width: finalWidth,
          height: finalHeight,
        },
        style,
      ]}
      resizeMode="contain"
      fadeDuration={0}
      {...props}
    />
  );
};

export default IsaacifyLogo;
