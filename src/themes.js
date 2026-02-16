export const THEMES = {
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Neon lights in the rain - Night City aesthetic',
    h1Colors: ['#FF00FF', '#00FFFF'],
    titleStyle: {
      h1Color: '#FFFFFF',
      textColor: '#FF00FF',
    },
  },
  matrix: {
    name: 'Matrix',
    description: 'Digital rain - Classic green terminal',
    h1Colors: ['#00FF41', '#008F11'],
    titleStyle: {
      h1Color: '#00FF41',
      textColor: '#00FF41',
    },
  },
  dracula: {
    name: 'Dracula',
    description: 'Dark theme with vibrant colors',
    h1Colors: ['#BD93F9', '#FF79C6'],
    titleStyle: {
      h1Color: '#FFFFFF',
      textColor: '#BD93F9',
    },
  },
  catppuccin: {
    name: 'Catppuccin',
    description: 'Soothing pastel theme',
    h1Colors: ['#CBA6F7', '#89B4FA'],
    titleStyle: {
      h1Color: '#FFFFFF',
      textColor: '#CBA6F7',
    },
  },
  nord: {
    name: 'Nord',
    description: 'Arctic, north-bluish color palette',
    h1Colors: ['#88C0D0', '#5E81AC'],
    titleStyle: {
      h1Color: '#ECEFF4',
      textColor: '#88C0D0',
    },
  },
  gruvbox: {
    name: 'Gruvbox',
    description: 'Retro groove color scheme',
    h1Colors: ['#FABD2F', '#FE8019'],
    titleStyle: {
      h1Color: '#FBF1C7',
      textColor: '#FABD2F',
    },
  },
  'tokyo-night': {
    name: 'Tokyo Night',
    description: 'Clean dark theme inspired by Tokyo at night',
    h1Colors: ['#7AA2F7', '#BB9AF7'],
    titleStyle: {
      h1Color: '#FFFFFF',
      textColor: '#7AA2F7',
    },
  },
};

export const DEFAULT_THEME = 'cyberpunk';

export function getTheme(name) {
  if (!name || !THEMES[name]) {
    return THEMES[DEFAULT_THEME];
  }
  return THEMES[name];
}
