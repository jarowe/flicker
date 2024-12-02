import { type ThemeConfig } from '@/types/theme'

export const darkTheme: ThemeConfig = {
  name: 'dark',
  colors: {
    background: '#000000',
    foreground: '#E7E9EA',
    card: '#16181C',
    'card-foreground': '#E7E9EA',
    popover: '#16181C',
    'popover-foreground': '#E7E9EA',
    primary: '#1D9BF0',
    'primary-foreground': '#FFFFFF',
    secondary: '#1E1E1E',
    'secondary-foreground': '#E7E9EA',
    muted: '#16181C',
    'muted-foreground': '#71767B',
    accent: '#2C2C2C',
    'accent-foreground': '#E7E9EA',
    destructive: '#F4212E',
    'destructive-foreground': '#FFFFFF',
    border: '#2F3336',
    input: '#202327',
    ring: '#1D9BF0',
  },
  borderRadius: {
    lg: '1rem',
    md: '0.5rem',
    sm: '0.25rem',
  },
}
