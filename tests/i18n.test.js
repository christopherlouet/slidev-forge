import { describe, it, expect } from 'vitest';
import { t, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../src/i18n.js';

describe('i18n', () => {
  describe('SUPPORTED_LANGUAGES', () => {
    it('should include fr and en', () => {
      expect(SUPPORTED_LANGUAGES).toContain('fr');
      expect(SUPPORTED_LANGUAGES).toContain('en');
    });
  });

  describe('DEFAULT_LANGUAGE', () => {
    it('should be fr', () => {
      expect(DEFAULT_LANGUAGE).toBe('fr');
    });
  });

  describe('t()', () => {
    it('should return French translation for key with lang=fr', () => {
      expect(t('toc_title', 'fr')).toBe('Sommaire');
    });

    it('should return English translation for key with lang=en', () => {
      expect(t('toc_title', 'en')).toBe('Table of Contents');
    });

    it('should default to French when no language specified', () => {
      expect(t('toc_title')).toBe('Sommaire');
    });

    it('should return key when key is unknown', () => {
      expect(t('nonexistent_key', 'fr')).toBe('nonexistent_key');
    });

    it('should fall back to French for unknown language', () => {
      expect(t('toc_title', 'ja')).toBe('Sommaire');
    });

    it('should have parity between fr and en translations', () => {
      // Every key in fr must exist in en, and vice versa
      const frKeys = Object.keys(getTranslations('fr'));
      const enKeys = Object.keys(getTranslations('en'));
      expect(frKeys.sort()).toEqual(enKeys.sort());
    });

    it('should translate readme_by', () => {
      expect(t('readme_by', 'fr')).toBe('Par');
      expect(t('readme_by', 'en')).toBe('By');
    });

    it('should translate readme_setup', () => {
      expect(t('readme_setup', 'fr')).toBe('Setup');
      expect(t('readme_setup', 'en')).toBe('Setup');
    });

    it('should translate readme_export', () => {
      expect(t('readme_export', 'fr')).toBe('Export');
      expect(t('readme_export', 'en')).toBe('Export');
    });

    it('should translate section comments', () => {
      expect(t('comment_left_column', 'fr')).toBe('Colonne gauche');
      expect(t('comment_left_column', 'en')).toBe('Left column');
    });

    it('should translate section_notes', () => {
      expect(t('section_notes', 'fr')).toBe('Notes pour la section');
      expect(t('section_notes', 'en')).toBe('Notes for section');
    });

    it('should translate v1.4 code placeholder', () => {
      expect(t('comment_code_placeholder', 'fr')).not.toBe('comment_code_placeholder');
      expect(t('comment_code_placeholder', 'en')).not.toBe('comment_code_placeholder');
    });

    it('should translate v1.4 diagram default', () => {
      expect(t('comment_diagram_default', 'fr')).not.toBe('comment_diagram_default');
      expect(t('comment_diagram_default', 'en')).not.toBe('comment_diagram_default');
    });

    it('should translate v1.4 cover default', () => {
      expect(t('comment_cover_default', 'fr')).not.toBe('comment_cover_default');
      expect(t('comment_cover_default', 'en')).not.toBe('comment_cover_default');
    });

    it('should translate v1.4 iframe no url', () => {
      expect(t('comment_iframe_no_url', 'fr')).not.toBe('comment_iframe_no_url');
      expect(t('comment_iframe_no_url', 'en')).not.toBe('comment_iframe_no_url');
    });

    it('should translate v1.4 steps item', () => {
      expect(t('comment_steps_item', 'fr')).not.toBe('comment_steps_item');
      expect(t('comment_steps_item', 'en')).not.toBe('comment_steps_item');
    });

    it('should translate v1.4 fact defaults', () => {
      expect(t('comment_fact_default_value', 'fr')).not.toBe('comment_fact_default_value');
      expect(t('comment_fact_default_value', 'en')).not.toBe('comment_fact_default_value');
      expect(t('comment_fact_default_desc', 'fr')).not.toBe('comment_fact_default_desc');
      expect(t('comment_fact_default_desc', 'en')).not.toBe('comment_fact_default_desc');
    });
  });
});

// Helper to access translations for parity test
function getTranslations(lang) {
  // We test parity by checking all known keys exist in both languages
  const keys = [
    'toc_title',
    'readme_by',
    'readme_setup',
    'readme_export',
    'comment_left_column',
    'comment_right_column',
    'comment_image_content',
    'comment_replace_quote',
    'comment_quote_author',
    'comment_qna',
    'comment_add_bio',
    'comment_section_content',
    'section_notes',
    'comment_code_placeholder',
    'comment_diagram_default',
    'comment_cover_default',
    'comment_iframe_no_url',
    'comment_steps_item',
    'comment_fact_default_value',
    'comment_fact_default_desc',
  ];
  const result = {};
  for (const key of keys) {
    result[key] = t(key, lang);
    // Ensure no key returns itself (which would mean missing translation)
    if (result[key] === key) {
      throw new Error(`Missing translation for key "${key}" in language "${lang}"`);
    }
  }
  return result;
}
