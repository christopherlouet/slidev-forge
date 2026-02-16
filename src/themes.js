export const THEMES = {
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Neon lights in the rain - Night City aesthetic',
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
    description: 'Digital rain - Enhanced terminal green with cyan accents',
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
  },
  dracula: {
    name: 'Dracula',
    description: 'Dark theme with vibrant colors',
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
    description: 'Soothing pastel theme',
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
    description: 'Arctic, north-bluish color palette',
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
    description: 'Retro groove color scheme',
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
    description: 'Clean dark theme inspired by Tokyo at night',
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
    description: 'Clean light theme based on GitHub palette',
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
    description: 'Warm dark theme with rose and pine tones',
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
    description: 'Classic VS Code dark theme',
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

export const DEFAULT_THEME = 'cyberpunk';

export const TRANSITIONS = ['slide-left', 'slide-up', 'fade', 'zoom', 'none'];

export const DEFAULT_TRANSITION = 'slide-left';

export function getTheme(name) {
  if (!name || !THEMES[name]) {
    return THEMES[DEFAULT_THEME];
  }
  return THEMES[name];
}

export function buildCustomTheme(colors) {
  if (!colors || typeof colors !== 'object') {
    throw new Error('Custom theme requires colors: { primary, secondary }');
  }
  if (!colors.primary) {
    throw new Error('Custom theme requires colors.primary');
  }
  if (!colors.secondary) {
    throw new Error('Custom theme requires colors.secondary');
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
