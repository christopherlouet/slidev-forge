import { validateHexColor } from './utils.js';
import type { ThemeDefinition } from './types.js';

export const THEMES: Record<string, ThemeDefinition> = {
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Neon magenta and cyan on dark slides - ideal for tech and futuristic talks',
    h1Colors: ['#FF00FF', '#00FFFF'],
    titleStyle: {
      h1Color: '#FFFFFF',
      textColor: '#FF00FF',
    },
    accentColor: '#00FFFF',
    linkColor: '#FF00FF',
    codeBlockBg: '#1A0A2E',
    backgroundColor: '#0A0A1A',
    textColor: '#E0E0FF',
  },
  matrix: {
    name: 'Matrix',
    description: 'Terminal green on black - perfect for developer and hacking-themed presentations',
    h1Colors: ['#00FF41', '#00D9FF'],
    titleStyle: {
      h1Color: '#00FF41',
      textColor: '#00FF41',
    },
    accentColor: '#00D9FF',
    linkColor: '#39FF14',
    codeBlockBg: '#0D0D0D',
    backgroundColor: '#0A0A0A',
    textColor: '#A0FFA0',
    font: 'Fira Code',
    defaultTransition: 'fade',
    extraCSS: `h1 {
    text-shadow: 0 0 10px #00FF41, 0 0 20px #00FF41, 0 0 40px #00FF4180;
}
.slidev-code-wrapper pre {
    border: 1px solid #00FF4140;
    border-left: 3px solid #00FF41;
}
strong, b {
    color: #00D9FF;
}
blockquote {
    border-left-color: #00FF41;
}`,
  },
  dracula: {
    name: 'Dracula',
    description: 'Purple and pink accents on dark background - elegant slides with high contrast',
    h1Colors: ['#BD93F9', '#FF79C6'],
    titleStyle: {
      h1Color: '#FFFFFF',
      textColor: '#BD93F9',
    },
    accentColor: '#FF79C6',
    linkColor: '#8BE9FD',
    codeBlockBg: '#1E1F29',
    backgroundColor: '#282A36',
    textColor: '#F8F8F2',
  },
  catppuccin: {
    name: 'Catppuccin',
    description: 'Soft pastel tones on dark slides - comfortable for long workshops and tutorials',
    h1Colors: ['#CBA6F7', '#89B4FA'],
    titleStyle: {
      h1Color: '#FFFFFF',
      textColor: '#CBA6F7',
    },
    accentColor: '#F5C2E7',
    linkColor: '#89B4FA',
    codeBlockBg: '#1E1E2E',
    backgroundColor: '#24273A',
    textColor: '#CDD6F4',
  },
  nord: {
    name: 'Nord',
    description: 'Cool arctic blues and muted tones - clean and professional slides',
    h1Colors: ['#88C0D0', '#5E81AC'],
    titleStyle: {
      h1Color: '#ECEFF4',
      textColor: '#88C0D0',
    },
    accentColor: '#EBCB8B',
    linkColor: '#88C0D0',
    codeBlockBg: '#2E3440',
    backgroundColor: '#3B4252',
    textColor: '#D8DEE9',
  },
  gruvbox: {
    name: 'Gruvbox',
    description: 'Warm amber and orange on dark background - retro and readable slides',
    h1Colors: ['#FABD2F', '#FE8019'],
    titleStyle: {
      h1Color: '#FBF1C7',
      textColor: '#FABD2F',
    },
    accentColor: '#FE8019',
    linkColor: '#83A598',
    codeBlockBg: '#1D2021',
    backgroundColor: '#282828',
    textColor: '#EBDBB2',
  },
  'tokyo-night': {
    name: 'Tokyo Night',
    description: 'Soft blue and purple highlights on dark slides - modern and polished',
    h1Colors: ['#7AA2F7', '#BB9AF7'],
    titleStyle: {
      h1Color: '#FFFFFF',
      textColor: '#7AA2F7',
    },
    accentColor: '#FF9E64',
    linkColor: '#7AA2F7',
    codeBlockBg: '#1A1B26',
    backgroundColor: '#24283B',
    textColor: '#A9B1D6',
  },
  'github-light': {
    name: 'GitHub Light',
    description: 'Blue accents on white background - minimal and clear for daytime presentations',
    h1Colors: ['#0969DA', '#1F6FEB'],
    titleStyle: {
      h1Color: '#1F2328',
      textColor: '#0969DA',
    },
    accentColor: '#0969DA',
    linkColor: '#0969DA',
    codeBlockBg: '#F6F8FA',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2328',
  },
  'rose-pine': {
    name: 'Rose Pine',
    description: 'Rose and teal on muted dark slides - warm and inviting for creative talks',
    h1Colors: ['#EA9A97', '#C4A7E7'],
    titleStyle: {
      h1Color: '#E0DEF4',
      textColor: '#EA9A97',
    },
    accentColor: '#F6C177',
    linkColor: '#9CCFD8',
    codeBlockBg: '#1F1D2E',
    backgroundColor: '#191724',
    textColor: '#E0DEF4',
  },
  'one-dark-pro': {
    name: 'One Dark Pro',
    description: 'Blue and purple on balanced dark slides - familiar and versatile for any talk',
    h1Colors: ['#61AFEF', '#C678DD'],
    titleStyle: {
      h1Color: '#FFFFFF',
      textColor: '#61AFEF',
    },
    accentColor: '#E5C07B',
    linkColor: '#61AFEF',
    codeBlockBg: '#21252B',
    backgroundColor: '#282C34',
    textColor: '#ABB2BF',
  },
};

export const DEFAULT_THEME: string = 'cyberpunk';

export const TRANSITIONS: string[] = ['slide-left', 'slide-up', 'fade', 'zoom', 'none'];

export const DEFAULT_TRANSITION: string = 'slide-left';

export function getTheme(name: string | undefined | null): ThemeDefinition {
  if (!name || !THEMES[name]) {
    return THEMES[DEFAULT_THEME];
  }
  return THEMES[name];
}

export function buildCustomTheme(colors: { primary: string; secondary: string } | undefined | null): ThemeDefinition {
  if (!colors || typeof colors !== 'object') {
    throw new Error('Custom theme requires colors: { primary, secondary }');
  }
  if (!colors.primary) {
    throw new Error('Custom theme requires colors.primary');
  }
  if (!colors.secondary) {
    throw new Error('Custom theme requires colors.secondary');
  }
  if (!validateHexColor(colors.primary)) {
    throw new Error('Custom theme requires colors.primary to be a valid hex color (#RRGGBB)');
  }
  if (!validateHexColor(colors.secondary)) {
    throw new Error('Custom theme requires colors.secondary to be a valid hex color (#RRGGBB)');
  }
  return {
    name: 'Custom',
    description: 'User-defined custom theme',
    h1Colors: [colors.primary, colors.secondary],
    titleStyle: {
      h1Color: '#FFFFFF',
      textColor: colors.primary,
    },
    accentColor: colors.secondary,
    linkColor: colors.primary,
    codeBlockBg: '#1E1E2E',
    backgroundColor: '#1A1A2E',
    textColor: '#E0E0E0',
  };
}
