/* eslint-disable */
// Karoot! Theme Configuration

export const theme = {
  colors: {
    // Primary colors
    primary: {
      DEFAULT: '#FF7A00', // Vibrant orange (carrot)
      light: '#FFA64D',
      dark: '#E56C00',
    },
    // Secondary colors (carrot leaves)
    secondary: {
      DEFAULT: '#4CAF50', // Green
      light: '#7BC67E',
      dark: '#3B873E',
    },
    // Earthy tones
    earth: {
      DEFAULT: '#8D6E63', // Brown
      light: '#A18879',
      dark: '#6D4C41',
      pale: '#EFEBE9', // Very light brown for backgrounds
    },
    // Feedback colors
    success: '#4CAF50', // Green
    error: '#F44336', // Red
    warning: '#FFC107', // Amber
    info: '#2196F3', // Blue
    // Background colors
    background: {
      DEFAULT: '#FFFAF5', // Very light orange/cream
      card: '#FFFFFF',
      muted: '#F5F5F5',
    },
    // Text colors
    text: {
      DEFAULT: '#333333',
      muted: '#666666',
      light: '#999999',
    },
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  fontFamily: {
    DEFAULT: '"Comic Neue", system-ui, sans-serif', // Rounded, friendly font
  },
  animation: {
    DEFAULT: '0.2s ease-in-out',
    fast: '0.1s ease-in-out',
    slow: '0.3s ease-in-out',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
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