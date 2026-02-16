import { getTheme } from '../themes.js';
import type { ResolvedConfig } from '../types.js';

export function generateStyles(config: ResolvedConfig): string {
  const theme = getTheme(config.visual_theme);
  const [color1, color2] = theme.h1Colors;

  let css = `h1 {
    background-color: ${color1};
    background-image: linear-gradient(45deg, ${color1} 10%, ${color2} 20%);
    background-size: 100%;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
}

a {
    color: ${theme.linkColor};
    text-decoration: none;
}

a:hover {
    color: ${theme.accentColor};
    text-decoration: underline;
}

.slidev-code-wrapper pre {
    background: ${theme.codeBlockBg} !important;
}

li::marker {
    color: ${theme.accentColor};
}
`;

  if (config.logo) {
    css += `
.slidev-layout::after {
    content: '';
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 48px;
    height: 48px;
    background: url('/${config.logo}') no-repeat center / contain;
    pointer-events: none;
}
`;
  }

  return css;
}
