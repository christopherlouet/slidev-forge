import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/yaml-configuration',
        'guides/presets',
        'guides/multi-file-mode',
        'guides/deployment',
        'guides/global-configuration',
      ],
    },
    {
      type: 'category',
      label: 'CLI Reference',
      items: [
        'cli/generate',
        'cli/validate',
        'cli/add',
        'cli/theme',
        'cli/config',
        'cli/regenerate',
        'cli/conference',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/configuration',
        'reference/section-types',
        'reference/visual-themes',
        'reference/transitions',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'examples/conference',
        'examples/workshop',
        'examples/lightning',
        'examples/pitch',
      ],
    },
  ],
};

export default sidebars;
