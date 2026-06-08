export const typography = {
  fontFamily: 'var(--font-sans)',
  fontSize: {
    sm: 'var(--font-size-sm)',     // 12px
    base: 'var(--font-size-base)', // 14px
    md: 'var(--font-size-md)',     // 18px
    lg: 'var(--font-size-lg)',     // 24px
    xl: 'var(--font-size-xl)',     // 36px
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
  },
  lineHeight: {
    tight: '1.2',
    snug: '1.3',
    normal: '1.4',
    relaxed: '1.5',
  }
} as const;
