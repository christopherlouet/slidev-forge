export interface Section {
  name: string;
  type: string;
  lang?: string;
  url?: string;
  image?: string;
  code?: string;
  diagram?: string;
  items?: string[];
  value?: string;
  description?: string;
  // v3.0 - Pro speaker features
  notes?: string;
  clicks?: boolean;
  highlights?: string;
  file?: string;
  transition?: string;
  content?: string[];
}

export interface ExportConfig {
  format: string;
  dark: boolean;
  with_clicks: boolean;
}

export interface OptionsConfig {
  snippets: boolean;
  components: boolean;
}

export interface SocialConfig {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  youtube?: string;
  mastodon?: string;
  bluesky?: string;
  instagram?: string;
  email?: string;
}

export interface FontsConfig {
  [key: string]: string;
}

export interface UserConfig {
  title: string;
  author: string;
  subtitle?: string;
  event_name?: string;
  github?: string;
  project_name?: string;
  slidev_theme?: string;
  visual_theme?: string;
  transition?: string;
  language?: string;
  sections?: (string | Section)[];
  deploy?: string[];
  export?: Partial<ExportConfig>;
  options?: Partial<OptionsConfig>;
  fonts?: FontsConfig;
  line_numbers?: boolean;
  aspect_ratio?: string;
  color_schema?: string;
  addons?: string[];
  favicon?: string;
  download?: boolean;
  preset?: string;
  logo?: string;
  conference?: string;
  social?: SocialConfig;
  footer?: string;
  slide_numbers?: boolean;
  colors?: { primary: string; secondary: string };
  multi_file?: boolean;
}

export interface ResolvedConfig {
  title: string;
  author: string;
  subtitle?: string;
  event_name?: string;
  github?: string;
  project_name: string;
  slidev_theme: string;
  visual_theme: string;
  transition: string;
  language: string;
  sections: Section[];
  deploy: string[];
  export: ExportConfig;
  options: OptionsConfig;
  fonts?: FontsConfig;
  line_numbers?: boolean;
  aspect_ratio?: string;
  color_schema?: string;
  addons?: string[];
  favicon?: string;
  download?: boolean;
  preset?: string;
  logo?: string;
  conference?: string;
  social?: SocialConfig;
  footer?: string;
  slide_numbers?: boolean;
  colors?: { primary: string; secondary: string };
  multi_file?: boolean;
}

export interface ThemeDefinition {
  name: string;
  description: string;
  h1Colors: [string, string];
  titleStyle: {
    h1Color: string;
    textColor: string;
  };
  accentColor: string;
  linkColor: string;
  codeBlockBg: string;
  backgroundColor: string;
  textColor: string;
  // v3.1 - Optional extended properties
  font?: string;
  extraCSS?: string;
  defaultTransition?: string;
}

export interface GenerateResult {
  files: string[];
  destDir: string;
}

export interface GenerateOptions {
  noGit?: boolean;
}

export interface ParsedArgs {
  mode: 'help' | 'version' | 'yaml' | 'interactive' | 'subcommand';
  yamlPath?: string;
  destDir?: string;
  dryRun?: boolean;
  noGit?: boolean;
  subcommand?: string;
  subcommandArgs?: string[];
}

export interface ParsedSlide {
  id: string | null;
  rawContent: string;
  isFrontmatter: boolean;
}

export interface DiffAction {
  type: 'add' | 'remove' | 'keep' | 'update-meta';
  sectionId: string;
  sectionName: string;
  detail?: string;
}

export interface RegenerateResult {
  actions: DiffAction[];
  backupPath?: string;
  filesUpdated: string[];
}
