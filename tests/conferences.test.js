import { describe, it, expect } from 'vitest';
import { getConference, listConferences, CONFERENCE_REGISTRY } from '../src/conferences.js';
import { mergeDefaults } from '../src/config.js';
import { generateSlides } from '../src/templates/slides.js';
import { generateStyles } from '../src/templates/styles.js';
import { buildConfigFromArgs } from '../src/cli.js';

function makeConfig(overrides = {}) {
  return mergeDefaults({ title: 'My Talk', author: 'Speaker', ...overrides });
}

// ─────────────────────────────────────────────────────
// T001 - Conference registry
// ─────────────────────────────────────────────────────
describe('Conference registry', () => {
  it('should have at least 10 conferences', () => {
    const list = listConferences();
    expect(list.length).toBeGreaterThanOrEqual(10);
  });

  it('should return a known conference by id', () => {
    const conf = getConference('breizhcamp');
    expect(conf).not.toBeNull();
    expect(conf.name).toBe('BreizhCamp');
  });

  it('should return null for unknown conference', () => {
    const conf = getConference('unknown-conf');
    expect(conf).toBeNull();
  });

  it('should return null for empty string', () => {
    const conf = getConference('');
    expect(conf).toBeNull();
  });

  it('each conference should have name, logo, website', () => {
    const list = listConferences();
    for (const conf of list) {
      expect(conf.name).toBeDefined();
      expect(typeof conf.name).toBe('string');
      expect(conf.name.length).toBeGreaterThan(0);
      expect(conf.logo).toBeDefined();
      expect(conf.logo).toMatch(/\.svg$/);
      expect(conf.website).toBeDefined();
      expect(conf.website).toMatch(/^https:\/\//);
    }
  });

  const expectedConferences = [
    'breizhcamp', 'devoxx-fr', 'bdx-io', 'alpescraft', 'mixit',
    'volcamp', 'sunny-tech', 'devfest-nantes', 'riviera-dev', 'snowcamp',
  ];

  for (const id of expectedConferences) {
    it(`should contain conference: ${id}`, () => {
      const conf = getConference(id);
      expect(conf).not.toBeNull();
      expect(conf.name.length).toBeGreaterThan(0);
    });
  }
});

// ─────────────────────────────────────────────────────
// T003 - Conference enrichment in mergeDefaults
// ─────────────────────────────────────────────────────
describe('Conference enrichment in config', () => {
  it('should set event_name from conference registry', () => {
    const config = makeConfig({ conference: 'breizhcamp' });
    expect(config.event_name).toBe('BreizhCamp');
  });

  it('should set logo from conference registry', () => {
    const config = makeConfig({ conference: 'breizhcamp' });
    expect(config.logo).toBeDefined();
    expect(config.logo).toBe('breizhcamp.svg');
  });

  it('should preserve explicit event_name over conference', () => {
    const config = makeConfig({ conference: 'breizhcamp', event_name: 'BreizhCamp 2026' });
    expect(config.event_name).toBe('BreizhCamp 2026');
  });

  it('should still set logo when event_name is explicit', () => {
    const config = makeConfig({ conference: 'breizhcamp', event_name: 'BZH 2026' });
    expect(config.logo).toBe('breizhcamp.svg');
  });

  it('should preserve explicit logo over conference logo', () => {
    const config = makeConfig({ conference: 'breizhcamp', logo: 'my-logo.png' });
    expect(config.logo).toBe('my-logo.png');
  });

  it('should still set event_name when logo is explicit', () => {
    const config = makeConfig({ conference: 'breizhcamp', logo: 'my-logo.png' });
    expect(config.event_name).toBe('BreizhCamp');
  });

  it('should ignore empty conference string', () => {
    const config = makeConfig({ conference: '' });
    expect(config.event_name).toBeUndefined();
    expect(config.logo).toBeUndefined();
  });

  it('should warn but not crash on unknown conference', () => {
    const config = makeConfig({ conference: 'unknown-conf' });
    // Should not throw, just warn
    expect(config).toBeDefined();
    expect(config.event_name).toBeUndefined();
  });

  it('should not set conference fields when no conference specified', () => {
    const config = makeConfig({});
    expect(config.conference).toBeUndefined();
    expect(config.event_name).toBeUndefined();
  });

  it('should pass conference field through to resolved config', () => {
    const config = makeConfig({ conference: 'devoxx-fr' });
    expect(config.conference).toBe('devoxx-fr');
    expect(config.event_name).toBe('Devoxx France');
  });
});

// ─────────────────────────────────────────────────────
// T004 - CSS logo rendering
// ─────────────────────────────────────────────────────
describe('CSS logo rendering', () => {
  it('should generate local path for conference logo', () => {
    const config = makeConfig({ conference: 'breizhcamp' });
    const css = generateStyles(config);
    expect(css).toContain("url('/breizhcamp.svg')");
    expect(css).toContain('.slidev-layout::after');
  });

  it('should still use relative path for local logos', () => {
    const config = makeConfig({ logo: 'images/logo.png' });
    const css = generateStyles(config);
    expect(css).toContain("url('/images/logo.png')");
  });

  it('should use explicit local logo over conference logo', () => {
    const config = makeConfig({ conference: 'breizhcamp', logo: 'my-logo.png' });
    const css = generateStyles(config);
    expect(css).toContain("url('/my-logo.png')");
    expect(css).not.toContain('breizhcamp.svg');
  });

  it('should support absolute https URLs in logo field', () => {
    const config = makeConfig({ logo: 'https://example.com/logo.svg' });
    const css = generateStyles(config);
    expect(css).toContain("url('https://example.com/logo.svg')");
    expect(css).not.toContain("url('/https://");
  });
});

// ─────────────────────────────────────────────────────
// T005 - Integration: slides and styles with conference
// ─────────────────────────────────────────────────────
describe('Integration: slides with conference', () => {
  it('should show conference name in title slide', () => {
    const config = makeConfig({ conference: 'devoxx-fr' });
    const slides = generateSlides(config);
    expect(slides).toContain('# Devoxx France');
    expect(slides).toContain('My Talk');
  });

  it('should show explicit event_name over conference name', () => {
    const config = makeConfig({ conference: 'devoxx-fr', event_name: 'Devoxx France 2026' });
    const slides = generateSlides(config);
    expect(slides).toContain('# Devoxx France 2026');
  });

  it('should generate logo CSS for conference', () => {
    const config = makeConfig({ conference: 'mixit' });
    const css = generateStyles(config);
    expect(css).toContain('.slidev-layout::after');
    expect(css).toContain("url('/mixit.svg')");
  });

  it('should have no logo CSS when no conference and no logo', () => {
    const config = makeConfig({});
    const css = generateStyles(config);
    expect(css).not.toContain('.slidev-layout::after');
  });
});

// ─────────────────────────────────────────────────────
// T006/T008 - Conference command
// ─────────────────────────────────────────────────────
describe('Conference command helpers', () => {
  it('listConferences should return entries with id field', () => {
    const list = listConferences();
    for (const conf of list) {
      expect(conf.id).toBeDefined();
      expect(typeof conf.id).toBe('string');
      expect(conf.id.length).toBeGreaterThan(0);
    }
  });

  it('listConferences ids should match CONFERENCE_REGISTRY keys', () => {
    const list = listConferences();
    const ids = list.map(c => c.id);
    const keys = Object.keys(CONFERENCE_REGISTRY);
    expect(ids).toEqual(keys);
  });

  it('getConference should return full details for show command', () => {
    const conf = getConference('bdx-io');
    expect(conf).not.toBeNull();
    expect(conf.name).toBe('BDX I/O');
    expect(conf.website).toContain('bdxio');
    expect(conf.description).toBeDefined();
    expect(conf.description.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────
// T007 - conference in ALLOWED_CONFIG_KEYS
// ─────────────────────────────────────────────────────
describe('Conference in config command', () => {
  it('conference field should be in resolved config', () => {
    const config = makeConfig({ conference: 'breizhcamp' });
    expect(config).toHaveProperty('conference');
    expect(config.conference).toBe('breizhcamp');
  });
});

// ─────────────────────────────────────────────────────
// T009 - Conference in interactive mode (buildConfigFromArgs)
// ─────────────────────────────────────────────────────
describe('Conference in interactive mode', () => {
  it('should include conference in config when provided', () => {
    const config = buildConfigFromArgs({
      title: 'My Talk', author: 'Speaker', visual_theme: 'cyberpunk',
      preset: 'conference', dest_dir: '/tmp/test',
      subtitle: '', event_name: '', github: '', sections: '',
      conference: 'breizhcamp',
    });
    expect(config.conference).toBe('breizhcamp');
  });

  it('should not set conference when empty', () => {
    const config = buildConfigFromArgs({
      title: 'My Talk', author: 'Speaker', visual_theme: 'cyberpunk',
      preset: 'conference', dest_dir: '/tmp/test',
      subtitle: '', event_name: '', github: '', sections: '',
      conference: '',
    });
    expect(config.conference).toBeUndefined();
  });

  it('should not set conference when not provided', () => {
    const config = buildConfigFromArgs({
      title: 'My Talk', author: 'Speaker', visual_theme: 'cyberpunk',
      preset: 'conference', dest_dir: '/tmp/test',
      subtitle: '', event_name: '', github: '', sections: '',
    });
    expect(config.conference).toBeUndefined();
  });
});
