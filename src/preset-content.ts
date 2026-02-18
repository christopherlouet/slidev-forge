/**
 * Enriched example content for preset sections.
 * Each preset maps section keys to content generators per language.
 */

export interface PresetSectionContent {
  content: string[];
  code?: string;
  diagram?: string;
  items?: string[];
  value?: string;
  description?: string;
}

type ContentFn = (lang: string) => PresetSectionContent;
type PresetContentMap = Record<string, ContentFn>;

export const PRESET_CONTENT_REGISTRY: Record<string, PresetContentMap> = {
  conference: {
    intro: (lang) => ({
      content: lang === 'fr'
        ? ['- Contexte et motivation du sujet', '- Ce que vous allez apprendre', '- Plan de la presentation']
        : ['- Context and motivation for this topic', '- What you will learn', '- Presentation outline'],
    }),
    about: (lang) => ({
      content: lang === 'fr'
        ? ['- Developpeur senior / Architecte', '- Speaker et contributeur open source', '- Passionné par les bonnes pratiques']
        : ['- Senior developer / Architect', '- Speaker and open source contributor', '- Passionate about best practices'],
    }),
    topic: (lang) => ({
      content: lang === 'fr'
        ? ['- Concept principal et definition', '- Pourquoi c\'est important aujourd\'hui', '- Cas d\'usage concrets']
        : ['- Main concept and definition', '- Why it matters today', '- Concrete use cases'],
    }),
    demo: (lang) => ({
      content: lang === 'fr'
        ? ['Exemple de code illustrant le concept :']
        : ['Code example illustrating the concept:'],
      code: lang === 'fr'
        ? '// Exemple : pattern Observer\nclass EventEmitter {\n  listeners = new Map();\n  on(event, fn) { this.listeners.set(event, fn); }\n  emit(event, data) { this.listeners.get(event)?.(data); }\n}'
        : '// Example: Observer pattern\nclass EventEmitter {\n  listeners = new Map();\n  on(event, fn) { this.listeners.set(event, fn); }\n  emit(event, data) { this.listeners.get(event)?.(data); }\n}',
    }),
    qna: (lang) => ({
      content: lang === 'fr'
        ? ['Posez vos questions !', '', '_Retrouvez les slides en ligne_']
        : ['Ask your questions!', '', '_Find the slides online_'],
    }),
    thanks: (lang) => ({
      content: lang === 'fr'
        ? ['Merci pour votre attention !']
        : ['Thank you for your attention!'],
    }),
    takeaways: (lang) => ({
      content: lang === 'fr'
        ? ['Ce qu\'il faut retenir :']
        : ['Key takeaways:'],
      items: lang === 'fr'
        ? ['Concept principal et son application', 'Bonnes pratiques a adopter', 'Erreurs courantes a eviter']
        : ['Main concept and its application', 'Best practices to adopt', 'Common mistakes to avoid'],
    }),
    diagram: (lang) => ({
      content: lang === 'fr'
        ? ['Vue d\'ensemble de l\'architecture :']
        : ['Architecture overview:'],
      diagram: 'flowchart LR',
    }),
    impact: (lang) => ({
      content: lang === 'fr'
        ? ['Resultat mesurable']
        : ['Measurable result'],
      value: lang === 'fr' ? '3x' : '3x',
      description: lang === 'fr' ? 'amelioration des performances' : 'performance improvement',
    }),
  },

  workshop: {
    intro: (lang) => ({
      content: lang === 'fr'
        ? ['- Objectifs du workshop', '- Duree estimee : 2h', '- Format : theorie + pratique']
        : ['- Workshop objectives', '- Estimated duration: 2h', '- Format: theory + hands-on'],
    }),
    prerequis: (lang) => ({
      content: lang === 'fr'
        ? ['Assurez-vous d\'avoir installe les outils suivants :']
        : ['Make sure you have installed the following tools:'],
      items: lang === 'fr'
        ? ['Node.js >= 18', 'Un editeur de code (VS Code recommande)', 'Git installe et configure', 'Compte GitHub']
        : ['Node.js >= 18', 'A code editor (VS Code recommended)', 'Git installed and configured', 'GitHub account'],
    }),
    prerequisites: (lang) => ({
      content: lang === 'fr'
        ? ['Assurez-vous d\'avoir installe les outils suivants :']
        : ['Make sure you have installed the following tools:'],
      items: lang === 'fr'
        ? ['Node.js >= 18', 'Un editeur de code (VS Code recommande)', 'Git installe et configure', 'Compte GitHub']
        : ['Node.js >= 18', 'A code editor (VS Code recommended)', 'Git installed and configured', 'GitHub account'],
    }),
    module: (lang) => ({
      content: lang === 'fr'
        ? ['- Concepts theoriques cles', '- Schema d\'architecture', '- Points d\'attention et pieges courants']
        : ['- Key theoretical concepts', '- Architecture overview', '- Pitfalls and common mistakes'],
    }),
    exercise: (lang) => ({
      content: lang === 'fr'
        ? ['Implementez la fonctionnalite suivante :']
        : ['Implement the following feature:'],
      code: lang === 'fr'
        ? '// TODO: Implementer la fonction\nexport function transform(input: string): string {\n  // Votre code ici\n  return input;\n}'
        : '// TODO: Implement the function\nexport function transform(input: string): string {\n  // Your code here\n  return input;\n}',
    }),
    recap: (lang) => ({
      content: lang === 'fr'
        ? ['Points cles a retenir :']
        : ['Key takeaways:'],
      items: lang === 'fr'
        ? ['Concept 1 : separation des responsabilites', 'Concept 2 : tests avant le code', 'Concept 3 : refactoring continu']
        : ['Concept 1: separation of concerns', 'Concept 2: test before code', 'Concept 3: continuous refactoring'],
    }),
    resources: (lang) => ({
      content: lang === 'fr'
        ? ['- Documentation officielle : [lien]', '- Repository du workshop : [lien]', '- Lectures recommandees']
        : ['- Official documentation: [link]', '- Workshop repository: [link]', '- Recommended reading'],
    }),
    checkpoint: (lang) => ({
      content: lang === 'fr'
        ? ['Verification des acquis :']
        : ['Knowledge check:'],
      items: lang === 'fr'
        ? ['Comprendre le concept principal', 'Savoir l\'appliquer en pratique', 'Identifier les cas limites']
        : ['Understand the main concept', 'Know how to apply it in practice', 'Identify edge cases'],
    }),
    diagram: (lang) => ({
      content: lang === 'fr'
        ? ['Architecture du module :']
        : ['Module architecture:'],
      diagram: 'flowchart TD',
    }),
  },

  lightning: {
    hook: (lang) => ({
      content: lang === 'fr'
        ? ['Et si on pouvait faire 10x mieux ?']
        : ['What if we could do 10x better?'],
    }),
    problem: (lang) => ({
      content: lang === 'fr'
        ? ['- Le probleme que nous resolvons', '- Impact sur les equipes de dev', '- Cout du statu quo']
        : ['- The problem we are solving', '- Impact on dev teams', '- Cost of the status quo'],
    }),
    solution: (lang) => ({
      content: lang === 'fr'
        ? ['- Notre approche en une phrase', '- Avantage cle par rapport aux alternatives', '- Preuve de concept validee']
        : ['- Our approach in one sentence', '- Key advantage over alternatives', '- Validated proof of concept'],
    }),
    demo: (lang) => ({
      content: lang === 'fr'
        ? ['Voici comment ca fonctionne :']
        : ['Here is how it works:'],
      code: lang === 'fr'
        ? '// Avant\nconst result = oldWay(data); // lent, fragile\n\n// Apres\nconst result = newWay(data); // 10x plus rapide'
        : '// Before\nconst result = oldWay(data); // slow, fragile\n\n// After\nconst result = newWay(data); // 10x faster',
    }),
    cta: (lang) => ({
      content: lang === 'fr'
        ? ['Essayez-le maintenant !']
        : ['Try it now!'],
      value: lang === 'fr' ? '10x' : '10x',
      description: lang === 'fr' ? 'plus rapide que la solution actuelle' : 'faster than the current solution',
    }),
    thanks: (lang) => ({
      content: lang === 'fr'
        ? ['Merci ! Essayez-le sur github.com/...']
        : ['Thanks! Try it at github.com/...'],
    }),
  },

  pitch: {
    hook: (lang) => ({
      content: lang === 'fr'
        ? ['Le probleme de demain se resout aujourd\'hui']
        : ['Tomorrow\'s problem is solved today'],
    }),
    problem: (lang) => ({
      content: lang === 'fr'
        ? ['- Douleur identifiee sur le marche', '- Qui est touche et pourquoi', '- Ampleur du probleme']
        : ['- Identified market pain', '- Who is affected and why', '- Scale of the problem'],
    }),
    solution: (lang) => ({
      content: lang === 'fr'
        ? ['- Notre solution en une phrase', '- Proposition de valeur unique', '- Comment ca marche (en 3 etapes)']
        : ['- Our solution in one sentence', '- Unique value proposition', '- How it works (in 3 steps)'],
    }),
    market: (lang) => ({
      content: lang === 'fr'
        ? ['Opportunite de marche significative']
        : ['Significant market opportunity'],
      value: lang === 'fr' ? '$2.5B' : '$2.5B',
      description: lang === 'fr' ? 'marche adressable d\'ici 2027' : 'addressable market by 2027',
    }),
    product: (lang) => ({
      content: lang === 'fr'
        ? ['- Fonctionnalite cle 1 : gain de temps', '- Fonctionnalite cle 2 : fiabilite', '- Fonctionnalite cle 3 : integration facile']
        : ['- Key feature 1: time savings', '- Key feature 2: reliability', '- Key feature 3: easy integration'],
    }),
    business: (lang) => ({
      content: lang === 'fr'
        ? ['- SaaS avec abonnement mensuel', '- Freemium pour l\'adoption', '- Upsell vers l\'offre entreprise']
        : ['- SaaS with monthly subscription', '- Freemium for adoption', '- Upsell to enterprise plan'],
    }),
    team: (lang) => ({
      content: lang === 'fr'
        ? ['- CTO : 15 ans d\'experience tech', '- CEO : ex-consultant McKinsey', '- Lead Dev : contributeur open source']
        : ['- CTO: 15 years tech experience', '- CEO: ex-McKinsey consultant', '- Lead Dev: open source contributor'],
    }),
    ask: (lang) => ({
      content: lang === 'fr'
        ? ['Ce que nous recherchons']
        : ['What we are looking for'],
      value: lang === 'fr' ? '500K€' : '€500K',
      description: lang === 'fr' ? 'pour accelerer la croissance' : 'to accelerate growth',
    }),
    impact: (lang) => ({
      content: lang === 'fr'
        ? ['Traction actuelle']
        : ['Current traction'],
      value: lang === 'fr' ? '+200%' : '+200%',
      description: lang === 'fr' ? 'croissance MoM' : 'MoM growth',
    }),
    thanks: (lang) => ({
      content: lang === 'fr'
        ? ['Merci pour votre attention !']
        : ['Thank you for your attention!'],
    }),
  },

  keynote: {
    hook: (lang) => ({
      content: lang === 'fr'
        ? ['Le futur appartient a ceux qui osent']
        : ['The future belongs to those who dare'],
    }),
    about: (lang) => ({
      content: lang === 'fr'
        ? ['- Speaker et leader technique', '- 10+ ans d\'experience', '- Passionné par l\'innovation']
        : ['- Speaker and tech leader', '- 10+ years experience', '- Passionate about innovation'],
    }),
    context: (lang) => ({
      content: lang === 'fr'
        ? ['- Etat des lieux du secteur', '- Les defis actuels', '- Pourquoi le changement est necessaire']
        : ['- Current state of the industry', '- Today\'s challenges', '- Why change is necessary'],
    }),
    impact: (lang) => ({
      content: lang === 'fr'
        ? ['Un chiffre qui parle']
        : ['A number that speaks'],
      value: lang === 'fr' ? '73%' : '73%',
      description: lang === 'fr' ? 'des equipes font face a ce defi' : 'of teams face this challenge',
    }),
    illustration: (lang) => ({
      content: lang === 'fr'
        ? ['La realite sur le terrain']
        : ['The reality on the ground'],
    }),
    steps: (lang) => ({
      content: lang === 'fr'
        ? ['Les etapes du parcours :']
        : ['The journey steps:'],
      items: lang === 'fr'
        ? ['Identifier le probleme', 'Explorer les solutions', 'Prototyper rapidement', 'Valider avec les utilisateurs', 'Deployer a grande echelle']
        : ['Identify the problem', 'Explore solutions', 'Prototype quickly', 'Validate with users', 'Deploy at scale'],
    }),
    demo: (lang) => ({
      content: lang === 'fr'
        ? ['La solution en action :']
        : ['The solution in action:'],
      code: lang === 'fr'
        ? '// La solution elegante\nconst result = await solve({\n  approach: "innovative",\n  scale: "global"\n});\nconsole.log(result); // Succes!'
        : '// The elegant solution\nconst result = await solve({\n  approach: "innovative",\n  scale: "global"\n});\nconsole.log(result); // Success!',
    }),
    architecture: (lang) => ({
      content: lang === 'fr'
        ? ['Architecture de la solution :']
        : ['Solution architecture:'],
      diagram: 'flowchart LR',
    }),
    comparison: (lang) => ({
      content: lang === 'fr'
        ? ['**Avant** : processus lent et fragile', '', '**Apres** : rapide et fiable']
        : ['**Before**: slow and fragile process', '', '**After**: fast and reliable'],
    }),
    result: (lang) => ({
      content: lang === 'fr'
        ? ['Resultat mesurable']
        : ['Measurable result'],
      value: lang === 'fr' ? '10x' : '10x',
      description: lang === 'fr' ? 'amelioration de la productivite' : 'productivity improvement',
    }),
    cta: (lang) => ({
      content: lang === 'fr'
        ? ['Rejoignez le mouvement']
        : ['Join the movement'],
    }),
    qna: (lang) => ({
      content: lang === 'fr'
        ? ['Vos questions sont les bienvenues']
        : ['Your questions are welcome'],
    }),
    thanks: (lang) => ({
      content: lang === 'fr'
        ? ['Merci pour votre attention !']
        : ['Thank you for your attention!'],
    }),
  },
};

export function getPresetContent(
  preset: string,
  sectionKey: string,
  lang: string,
): PresetSectionContent | null {
  const presetMap = PRESET_CONTENT_REGISTRY[preset];
  if (!presetMap) return null;
  const contentFn = presetMap[sectionKey];
  if (!contentFn) return null;
  return contentFn(lang);
}
