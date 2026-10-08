export const typography = {
  fonts: {
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    bold: 'DMSans_700Bold',
  },
  sizes: {
    title: 29,
    subtitle: 16,
    tagline: 14,
    body: 14,
    caption: 12,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
  letterSpacing: {
    tight: -0.4,
    normal: 0,
    title: 0.6,
    tagline: 0.2,
  },
} as const;

export type Typography = typeof typography;
