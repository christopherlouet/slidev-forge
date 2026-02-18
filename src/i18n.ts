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
  | 'comment_image_right_content'
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
  | 'preset_ask'
  | 'preset_hook'
  | 'preset_context'
  | 'preset_impact'
  | 'preset_illustration'
  | 'preset_journey'
  | 'preset_steps'
  | 'preset_architecture'
  | 'preset_vision'
  | 'preset_comparison'
  | 'preset_result'
  | 'preset_takeaways'
  | 'preset_checkpoint'
  | 'note_default'
  | 'note_two_cols'
  | 'note_image_right'
  | 'note_quote'
  | 'note_qna'
  | 'note_thanks'
  | 'note_about'
  | 'note_code'
  | 'note_diagram'
  | 'note_cover'
  | 'note_iframe'
  | 'note_steps'
  | 'note_fact'
  | 'note_section_divider'
  | 'note_statement'
  | 'note_image_left'
  | 'note_image';

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
    comment_image_right_content: "Contenu a droite de l'image",
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
    preset_hook: 'Accroche',
    preset_context: 'Contexte',
    preset_impact: 'Impact',
    preset_illustration: 'Illustration',
    preset_journey: 'Le Parcours',
    preset_steps: 'Étapes',
    preset_architecture: 'Architecture',
    preset_vision: 'La Vision',
    preset_comparison: 'Avant / Après',
    preset_result: 'Résultat',
    preset_takeaways: 'Points clés',
    preset_checkpoint: 'Checkpoint',
    note_default: 'Presentez les points cles de cette section.\n- Gardez un rythme soutenu\n- Interagissez avec le public',
    note_two_cols: 'Comparez les deux colonnes.\n- Commencez par la gauche\n- Mettez en avant les differences',
    note_image_right: "Decrivez l'image et son lien avec le contenu.\n- Pointez les elements importants de l'image",
    note_quote: 'Contextualisez cette citation.\n- Pourquoi est-elle pertinente ?\n- Qui est l\'auteur ?',
    note_qna: 'Preparez 2-3 questions frequentes et leurs reponses.\n- Gardez les reponses courtes\n- Si pas de questions, relancez avec une question preparee',
    note_thanks: 'Remerciez le public.\n- Rappelez vos coordonnees\n- Mentionnez ou retrouver les slides',
    note_about: 'Presentez-vous en 30 secondes.\n- Mentionnez votre experience cle\n- Restez concis',
    note_code: 'Expliquez le code ligne par ligne.\n- Mettez en avant le pattern principal\n- Preparez un plan B si la demo echoue',
    note_diagram: 'Parcourez le diagramme etape par etape.\n- Commencez par la vue d\'ensemble\n- Zoomez sur les parties importantes',
    note_cover: 'Marquez la transition vers le prochain chapitre.\n- Annoncez ce qui va suivre\n- Faites une courte pause',
    note_iframe: 'Faites une demo live.\n- Ayez un plan B si le reseau ne fonctionne pas\n- Preparez des captures d\'ecran en secours',
    note_steps: 'Revelez chaque etape au clic.\n- Expliquez chaque point avant de passer au suivant\n- Laissez le temps au public de lire',
    note_fact: 'Laissez le chiffre parler.\n- Pause de 3 secondes avant d\'expliquer\n- Donnez du contexte pour rendre le chiffre memorable',
    note_section_divider: 'Marquez la transition.\n- Annoncez la prochaine partie\n- Resumez brievement ce qui precede',
    note_statement: 'Laissez le public lire.\n- Pause de 5 secondes\n- Appuyez votre propos ensuite',
    note_image_left: "Decrivez l'image et reliez-la au contenu.\n- Guidez le regard du public",
    note_image: "Laissez l'image parler.\n- Pause de quelques secondes\n- Commentez les elements cles",
  },
  en: {
    toc_title: 'Table of Contents',
    readme_by: 'By',
    readme_setup: 'Setup',
    readme_export: 'Export',
    comment_left_column: 'Left column',
    comment_right_column: 'Right column',
    comment_image_content: 'Content to the left of the image',
    comment_image_right_content: 'Content to the right of the image',
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
    preset_hook: 'Hook',
    preset_context: 'Context',
    preset_impact: 'Impact',
    preset_illustration: 'Illustration',
    preset_journey: 'The Journey',
    preset_steps: 'Steps',
    preset_architecture: 'Architecture',
    preset_vision: 'The Vision',
    preset_comparison: 'Before / After',
    preset_result: 'Result',
    preset_takeaways: 'Key Takeaways',
    preset_checkpoint: 'Checkpoint',
    note_default: 'Present the key points of this section.\n- Keep a steady pace\n- Engage with the audience',
    note_two_cols: 'Compare both columns.\n- Start with the left side\n- Highlight the differences',
    note_image_right: 'Describe the image and how it relates to the content.\n- Point out the key visual elements',
    note_quote: 'Provide context for this quote.\n- Why is it relevant?\n- Who is the author?',
    note_qna: 'Prepare 2-3 common questions and answers.\n- Keep answers short\n- If no questions, prompt with a prepared one',
    note_thanks: 'Thank the audience.\n- Share your contact info\n- Mention where to find the slides',
    note_about: 'Introduce yourself in 30 seconds.\n- Mention your key experience\n- Keep it concise',
    note_code: 'Walk through the code line by line.\n- Highlight the main pattern\n- Have a backup plan if the demo fails',
    note_diagram: 'Walk through the diagram step by step.\n- Start with the big picture\n- Zoom into the important parts',
    note_cover: 'Mark the transition to the next chapter.\n- Announce what comes next\n- Take a short pause',
    note_iframe: 'Do a live demo.\n- Have a backup plan if the network fails\n- Prepare screenshots as fallback',
    note_steps: 'Reveal each step on click.\n- Explain each point before moving on\n- Give the audience time to read',
    note_fact: 'Let the number speak.\n- Pause 3 seconds before explaining\n- Give context to make the number memorable',
    note_section_divider: 'Mark the transition.\n- Announce the next part\n- Briefly summarize what came before',
    note_statement: 'Let the audience read.\n- Pause 5 seconds\n- Then reinforce your point',
    note_image_left: 'Describe the image and connect it to the content.\n- Guide the audience\'s gaze',
    note_image: 'Let the image speak.\n- Pause for a few seconds\n- Comment on the key elements',
  },
};

export function t(key: string, lang: string = DEFAULT_LANGUAGE): string {
  const effectiveLang = SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage) ? lang as SupportedLanguage : DEFAULT_LANGUAGE as SupportedLanguage;
  const dict = translations[effectiveLang];
  return dict[key as TranslationKey] ?? key;
}
