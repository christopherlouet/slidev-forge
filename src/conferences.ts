/**
 * Conference registry for known tech conferences.
 * Provides automatic event_name and logo enrichment via `conference: xxx` in YAML.
 */

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface ConferenceDefinition {
  name: string;
  emoji: string;
  logo: string;
  website: string;
  description: string;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Absolute path to the assets/conferences directory in the package */
export const CONFERENCE_ASSETS_DIR = resolve(__dirname, '../assets/conferences');

export const CONFERENCE_REGISTRY: Record<string, ConferenceDefinition> = {
  breizhcamp: {
    name: 'BreizhCamp',
    emoji: '🌊',
    logo: `breizhcamp.svg`,
    website: 'https://www.breizhcamp.org',
    description: 'Conference tech a Rennes - Juin',
  },
  'devoxx-fr': {
    name: 'Devoxx France',
    emoji: '🗼',
    logo: `devoxx-fr.svg`,
    website: 'https://www.devoxx.fr',
    description: 'Conference developpeurs a Paris - Avril',
  },
  'bdx-io': {
    name: 'BDX I/O',
    emoji: '🏰',
    logo: `bdx-io.svg`,
    website: 'https://www.bdxio.fr',
    description: 'Conference tech a Bordeaux - Novembre',
  },
  alpescraft: {
    name: 'AlpesCraft',
    emoji: '⛰️',
    logo: `alpescraft.svg`,
    website: 'https://www.alpescraft.fr',
    description: 'Conference Software Craftsmanship a Grenoble - Juin',
  },
  mixit: {
    name: 'MiXiT',
    emoji: '🎨',
    logo: `mixit.svg`,
    website: 'https://mixitconf.org',
    description: 'Conference tech et diversite a Lyon - Avril',
  },
  volcamp: {
    name: 'Volcamp',
    emoji: '🌋',
    logo: `volcamp.svg`,
    website: 'https://www.volcamp.io',
    description: 'Conference tech a Clermont-Ferrand - Octobre',
  },
  'sunny-tech': {
    name: 'Sunny Tech',
    emoji: '☀️',
    logo: `sunny-tech.svg`,
    website: 'https://sunny-tech.io',
    description: 'Conference tech a Montpellier - Juin',
  },
  'devfest-nantes': {
    name: 'DevFest Nantes',
    emoji: '🎯',
    logo: `devfest-nantes.svg`,
    website: 'https://devfest.gdgnantes.com',
    description: 'Conference Google tech a Nantes - Octobre',
  },
  'riviera-dev': {
    name: 'Riviera DEV',
    emoji: '🌴',
    logo: `riviera-dev.svg`,
    website: 'https://rivieradev.fr',
    description: 'Conference tech a Sophia-Antipolis - Juillet',
  },
  snowcamp: {
    name: 'SnowCamp',
    emoji: '❄️',
    logo: `snowcamp.svg`,
    website: 'https://snowcamp.io',
    description: 'Conference tech a Grenoble - Janvier',
  },
};

export function getConference(name: string): ConferenceDefinition | null {
  if (!name) return null;
  return CONFERENCE_REGISTRY[name] || null;
}

export function listConferences(): (ConferenceDefinition & { id: string })[] {
  return Object.entries(CONFERENCE_REGISTRY).map(([id, conf]) => ({ id, ...conf }));
}
