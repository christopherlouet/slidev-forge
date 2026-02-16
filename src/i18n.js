export const SUPPORTED_LANGUAGES = ['fr', 'en'];
export const DEFAULT_LANGUAGE = 'fr';

const translations = {
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
  },
};

export function t(key, lang = DEFAULT_LANGUAGE) {
  const effectiveLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
  const dict = translations[effectiveLang];
  return dict[key] ?? key;
}
