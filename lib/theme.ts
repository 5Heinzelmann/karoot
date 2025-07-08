/* eslint-disable */
// Karoot! Theme Configuration

export const theme = {
  colors: {
    // Primary carrot colors
    carrot: {
      orange: '#FF7A00',
      light: '#FFA64D',
      dark: '#E56C00',
      pale: '#FFEAD1',
      bright: '#FF9124',
    },
    // Secondary leaf colors
    leaf: {
      green: '#4CAF50',
      light: '#7BC67E',
      dark: '#3B873E',
      bright: '#66BB6A',
      pale: '#E8F5E9',
    },
    // Accent soil colors
    soil: {
      brown: '#8D6E63',
      light: '#A18879',
      dark: '#6D4C41',
      pale: '#EFEBE9',
    },
    // Feedback colors
    feedback: {
      success: '#66BB6A',
      error: '#FF5252',
      warning: '#FFD740',
      info: '#29B6F6',
    },
    // Background colors
    background: {
      primary: '#FFFAF5',
      secondary: '#FFF3E0',
      card: '#FFFFFF',
      dark: '#F5EEE6',
    },
    // Legacy colors for backward compatibility
    primary: {
      DEFAULT: '#FF7A00',
      light: '#FFA64D',
      dark: '#E56C00',
    },
    secondary: {
      DEFAULT: '#4CAF50',
      light: '#7BC67E',
      dark: '#3B873E',
    },
    earth: {
      DEFAULT: '#8D6E63',
      light: '#A18879',
      dark: '#6D4C41',
      pale: '#EFEBE9',
    },
    success: '#66BB6A',
    error: '#FF5252',
    warning: '#FFD740',
    info: '#29B6F6',
    text: {
      DEFAULT: '#333333',
      muted: '#666666',
      light: '#999999',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  fontFamily: {
    heading: 'var(--font-fredoka)',
    body: 'var(--font-baloo-2)',
    ui: 'var(--font-quicksand)',
    mono: 'var(--font-geist-sans)',
    DEFAULT: 'var(--font-baloo-2)',
  },
  animation: {
    DEFAULT: '0.2s ease-in-out',
    fast: '0.1s ease-in-out',
    slow: '0.3s ease-in-out',
  },
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.18)',
    '2xl': '0 16px 32px rgba(0, 0, 0, 0.2)',
  },
};

// Helper function to get theme values
export function getThemeValue(path: string): any {
  const keys = path.split('.');
  let value: any = theme;
  
  for (const key of keys) {
    if (value[key] === undefined) {
      return undefined;
    }
    value = value[key];
  }
  
  return value;
}