export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
export const DEFAULT_LANGUAGE = 'fr';

type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

type TranslationKey =
  | 'toc_title'
  | 'readme_by'
  | 'readme_setup'
  | 'readme_export'
  | 'comment_left_column'
  | 'comment_right_column'
  | 'comment_image_content'
  | 'comment_replace_quote'
  | 'comment_quote_author'
  | 'comment_qna'
  | 'comment_add_bio'
  | 'comment_section_content'
  | 'section_notes'
  | 'comment_code_placeholder'
  | 'comment_diagram_default'
  | 'comment_cover_default'
  | 'comment_iframe_no_url'
  | 'comment_steps_item'
  | 'comment_fact_default_value'
  | 'comment_fact_default_desc'
  | 'preset_intro'
  | 'preset_about'
  | 'preset_topic'
  | 'preset_demo'
  | 'preset_qna'
  | 'preset_thanks'
  | 'preset_prereq'
  | 'preset_module'
  | 'preset_exercise'
  | 'preset_recap'
  | 'preset_resources'
  | 'preset_problem'
  | 'preset_solution'
  | 'preset_cta'
  | 'preset_market'
  | 'preset_product'
  | 'preset_business'
  | 'preset_team'
  | 'preset_ask';

type TranslationDictionary = Record<TranslationKey, string>;
type Translations = Record<SupportedLanguage, TranslationDictionary>;

const translations: Translations = {
  fr: {
    toc_title: 'Sommaire',
    readme_by: 'Par',
    readme_setup: 'Setup',
    readme_export: 'Export',
    comment_left_column: 'Colonne gauche',
    comment_right_column: 'Colonne droite',
    comment_image_content: "Contenu a gauche de l'image",
    comment_replace_quote: 'Citation a remplacer',
    comment_quote_author: 'Auteur',
    comment_qna: 'Questions & réponses',
    comment_add_bio: 'Ajoutez votre bio ici',
    comment_section_content: 'Contenu de la section',
    section_notes: 'Notes pour la section',
    comment_code_placeholder: 'Votre code ici',
    comment_diagram_default: 'Modifiez ce diagramme',
    comment_cover_default: 'Image de couverture',
    comment_iframe_no_url: 'Ajoutez l\'URL de votre contenu embarqué ici',
    comment_steps_item: 'Étape',
    comment_fact_default_value: '10x',
    comment_fact_default_desc: 'plus rapide',
    preset_intro: 'Introduction',
    preset_about: 'À propos',
    preset_topic: 'Sujet',
    preset_demo: 'Démo',
    preset_qna: 'Questions & Réponses',
    preset_thanks: 'Merci',
    preset_prereq: 'Prérequis',
    preset_module: 'Module',
    preset_exercise: 'Exercice',
    preset_recap: 'Récapitulatif',
    preset_resources: 'Ressources',
    preset_problem: 'Problème',
    preset_solution: 'Solution',
    preset_cta: 'Appel à l\'action',
    preset_market: 'Marché',
    preset_product: 'Produit',
    preset_business: 'Modèle économique',
    preset_team: 'Équipe',
    preset_ask: 'Demande',
  },
  en: {
    toc_title: 'Table of Contents',
    readme_by: 'By',
    readme_setup: 'Setup',
    readme_export: 'Export',
    comment_left_column: 'Left column',
    comment_right_column: 'Right column',
    comment_image_content: 'Content to the left of the image',
    comment_replace_quote: 'Replace this quote',
    comment_quote_author: 'Author',
    comment_qna: 'Questions & answers',
    comment_add_bio: 'Add your bio here',
    comment_section_content: 'Section content',
    section_notes: 'Notes for section',
    comment_code_placeholder: 'Your code here',
    comment_diagram_default: 'Edit this diagram',
    comment_cover_default: 'Cover image',
    comment_iframe_no_url: 'Add your embedded content URL here',
    comment_steps_item: 'Step',
    comment_fact_default_value: '10x',
    comment_fact_default_desc: 'faster',
    preset_intro: 'Introduction',
    preset_about: 'About',
    preset_topic: 'Topic',
    preset_demo: 'Demo',
    preset_qna: 'Q&A',
    preset_thanks: 'Thank you',
    preset_prereq: 'Prerequisites',
    preset_module: 'Module',
    preset_exercise: 'Exercise',
    preset_recap: 'Recap',
    preset_resources: 'Resources',
    preset_problem: 'Problem',
    preset_solution: 'Solution',
    preset_cta: 'Call to action',
    preset_market: 'Market',
    preset_product: 'Product',
    preset_business: 'Business model',
    preset_team: 'Team',
    preset_ask: 'The ask',
  },
};

export function t(key: string, lang: string = DEFAULT_LANGUAGE): string {
  const effectiveLang = SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage) ? lang as SupportedLanguage : DEFAULT_LANGUAGE as SupportedLanguage;
  const dict = translations[effectiveLang];
  return dict[key as TranslationKey] ?? key;
}
