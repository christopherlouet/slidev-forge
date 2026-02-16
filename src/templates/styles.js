import { getTheme } from '../themes.js';

export function generateStyles(config) {
  const theme = getTheme(config.visual_theme);
  const [color1, color2] = theme.h1Colors;

  return `h1 {
    background-color: ${color1};
    background-image: linear-gradient(45deg, ${color1} 10%, ${color2} 20%);
    background-size: 100%;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
}
`;
}
