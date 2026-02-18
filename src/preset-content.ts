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
        ? ['- Separation des responsabilites avec Clean Architecture', '- Les 4 couches : Domain, Application, Infrastructure, Presentation', '- Inversion de dependances et injection via interfaces']
        : ['- Separation of concerns with Clean Architecture', '- The 4 layers: Domain, Application, Infrastructure, Presentation', '- Dependency inversion and injection via interfaces'],
    }),
    demo: (lang) => ({
      content: lang === 'fr'
        ? ['Exemple de code illustrant le concept :']
        : ['Code example illustrating the concept:'],
      code: lang === 'fr'
        ? '// Architecture Plugin avec middleware\nclass App {\n  private middleware: Function[] = [];\n  // Enregistrer un middleware\n  use(fn: Function) {\n    this.middleware.push(fn);\n    return this; // chainage fluide\n  }\n  // Executer la chaine\n  async execute(ctx: Record<string, unknown>) {\n    for (const fn of this.middleware) {\n      await fn(ctx);\n    }\n    return ctx;\n  }\n}'
        : '// Plugin Architecture with middleware\nclass App {\n  private middleware: Function[] = [];\n  // Register a middleware\n  use(fn: Function) {\n    this.middleware.push(fn);\n    return this; // fluent chaining\n  }\n  // Execute the chain\n  async execute(ctx: Record<string, unknown>) {\n    for (const fn of this.middleware) {\n      await fn(ctx);\n    }\n    return ctx;\n  }\n}',
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
        ? ['Isoler la logique metier dans le Domain Layer', 'Utiliser l\'injection de dependances pour decouple les couches', 'Tester chaque couche independamment avec des doubles de test']
        : ['Isolate business logic in the Domain Layer', 'Use dependency injection to decouple layers', 'Test each layer independently with test doubles'],
    }),
    diagram: (lang) => ({
      content: lang === 'fr'
        ? ['Vue d\'ensemble de l\'architecture :']
        : ['Architecture overview:'],
      diagram: lang === 'fr'
        ? 'flowchart TD\n  Client[Client Web] --> API[API Gateway]\n  API --> Auth[Service Auth]\n  API --> Core[Service Metier]\n  Core --> DB[(Base de Donnees)]\n  Core --> Cache[Cache Redis]\n  Auth --> DB'
        : 'flowchart TD\n  Client[Web Client] --> API[API Gateway]\n  API --> Auth[Auth Service]\n  API --> Core[Business Service]\n  Core --> DB[(Database)]\n  Core --> Cache[Redis Cache]\n  Auth --> DB',
    }),
    impact: (lang) => ({
      content: lang === 'fr'
        ? ['Resultat mesure apres adoption']
        : ['Measured result after adoption'],
      value: '-60%',
      description: lang === 'fr' ? 'de temps de correction des bugs grace a l\'isolation des couches' : 'bug fix time reduction thanks to layer isolation',
    }),
  },

  workshop: {
    intro: (lang) => ({
      content: lang === 'fr'
        ? ['- Construire un pipeline CI/CD complet de zero', '- Duree : 2h - theorie + exercices pratiques', '- Deployer une application conteneurisee sur un cluster']
        : ['- Build a complete CI/CD pipeline from scratch', '- Duration: 2h - theory + hands-on exercises', '- Deploy a containerized application to a cluster'],
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
        ? ['- Dockerfile multi-stage et optimisation des layers', '- Pipeline CI avec GitHub Actions : lint, test, build', '- Deploiement continu avec rollback automatique']
        : ['- Multi-stage Dockerfile and layer optimization', '- CI pipeline with GitHub Actions: lint, test, build', '- Continuous deployment with automatic rollback'],
    }),
    exercise: (lang) => ({
      content: lang === 'fr'
        ? ['Implementez la fonctionnalite suivante :']
        : ['Implement the following feature:'],
      code: lang === 'fr'
        ? '// Exercice : API REST avec validation Zod\nimport { z } from "zod";\nconst UserSchema = z.object({\n  name: z.string().min(2),\n  email: z.string().email(),\n  role: z.enum(["admin", "user"]),\n});\n// POST /api/users - Creer un utilisateur\nrouter.post("/api/users", async (req, res) => {\n  const result = UserSchema.safeParse(req.body);\n  if (!result.success)\n    return res.status(400).json(result.error.flatten());\n  const user = await db.users.create(result.data);\n  res.status(201).json(user);\n});'
        : '// Exercise: REST API with Zod validation\nimport { z } from "zod";\nconst UserSchema = z.object({\n  name: z.string().min(2),\n  email: z.string().email(),\n  role: z.enum(["admin", "user"]),\n});\n// POST /api/users - Create a user\nrouter.post("/api/users", async (req, res) => {\n  const result = UserSchema.safeParse(req.body);\n  if (!result.success)\n    return res.status(400).json(result.error.flatten());\n  const user = await db.users.create(result.data);\n  res.status(201).json(user);\n});',
    }),
    recap: (lang) => ({
      content: lang === 'fr'
        ? ['Points cles a retenir :']
        : ['Key takeaways:'],
      items: lang === 'fr'
        ? ['Conteneuriser avec des images Docker optimisees (< 100 Mo)', 'Automatiser les tests et le build dans le pipeline CI', 'Deployer en staging avant la production avec validation automatique']
        : ['Containerize with optimized Docker images (< 100 MB)', 'Automate tests and build in the CI pipeline', 'Deploy to staging before production with automatic validation'],
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
        ? ['Construire une image Docker multi-stage fonctionnelle', 'Configurer un workflow GitHub Actions avec cache des dependances', 'Declencher un deploiement automatique sur push vers main']
        : ['Build a working multi-stage Docker image', 'Configure a GitHub Actions workflow with dependency caching', 'Trigger an automatic deployment on push to main'],
    }),
    diagram: (lang) => ({
      content: lang === 'fr'
        ? ['Architecture du module :']
        : ['Module architecture:'],
      diagram: lang === 'fr'
        ? 'flowchart TD\n  Dev[Developpeur] --> Commit[Git Commit]\n  Commit --> CI[Pipeline CI]\n  CI --> Test[Tests Automatises]\n  CI --> Lint[Analyse de Code]\n  Test --> Build[Build Docker]\n  Lint --> Build\n  Build --> Deploy[Deploiement Staging]\n  Deploy --> Prod[Production]'
        : 'flowchart TD\n  Dev[Developer] --> Commit[Git Commit]\n  Commit --> CI[CI Pipeline]\n  CI --> Test[Automated Tests]\n  CI --> Lint[Code Analysis]\n  Test --> Build[Docker Build]\n  Lint --> Build\n  Build --> Deploy[Staging Deploy]\n  Deploy --> Prod[Production]',
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
        ? ['- Les appels API sequentiels bloquent l\'interface utilisateur', '- Temps de reponse moyen > 3 secondes par page', '- Taux d\'abandon de 40% quand le chargement depasse 2s']
        : ['- Sequential API calls block the user interface', '- Average response time > 3 seconds per page', '- 40% bounce rate when loading exceeds 2s'],
    }),
    solution: (lang) => ({
      content: lang === 'fr'
        ? ['- Requetes paralleles avec Promise.all et batching', '- Reduction de 10x du temps de chargement', '- Pattern reutilisable en 20 lignes de code']
        : ['- Parallel requests with Promise.all and batching', '- 10x reduction in loading time', '- Reusable pattern in 20 lines of code'],
    }),
    demo: (lang) => ({
      content: lang === 'fr'
        ? ['Voici comment ca fonctionne :']
        : ['Here is how it works:'],
      code: lang === 'fr'
        ? '// Avant : requetes sequentielles (lent)\nasync function fetchAll(ids: string[]) {\n  const results = [];\n  for (const id of ids) {\n    results.push(await fetch(`/api/${id}`).then(r => r.json()));\n  }\n  return results; // ~3s pour 10 items\n}\n\n// Apres : requetes paralleles (10x plus rapide)\nasync function fetchAllFast(ids: string[]) {\n  const promises = ids.map(id =>\n    fetch(`/api/${id}`).then(r => r.json())\n  );\n  return Promise.all(promises); // ~0.3s pour 10 items\n}'
        : '// Before: sequential requests (slow)\nasync function fetchAll(ids: string[]) {\n  const results = [];\n  for (const id of ids) {\n    results.push(await fetch(`/api/${id}`).then(r => r.json()));\n  }\n  return results; // ~3s for 10 items\n}\n\n// After: parallel requests (10x faster)\nasync function fetchAllFast(ids: string[]) {\n  const promises = ids.map(id =>\n    fetch(`/api/${id}`).then(r => r.json())\n  );\n  return Promise.all(promises); // ~0.3s for 10 items\n}',
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
        ? ['- 72% des equipes perdent plus de 10h/semaine sur les incidents de production', '- Les outils de monitoring actuels generent trop d\'alertes non pertinentes', '- Cout moyen d\'une panne : 5 600 $/minute (Gartner 2024)']
        : ['- 72% of teams lose 10+ hours/week on production incidents', '- Current monitoring tools generate too many irrelevant alerts', '- Average cost of downtime: $5,600/minute (Gartner 2024)'],
    }),
    solution: (lang) => ({
      content: lang === 'fr'
        ? ['- Plateforme d\'observabilite alimentee par l\'IA pour le triage automatique', '- Correlation intelligente des alertes : -85% de bruit', '- De l\'incident a la resolution en 3 clics au lieu de 30 minutes']
        : ['- AI-powered observability platform for automatic triage', '- Intelligent alert correlation: -85% noise reduction', '- From incident to resolution in 3 clicks instead of 30 minutes'],
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
        ? ['- Detection d\'anomalies en temps reel avec auto-remediation', '- Intégration native avec Kubernetes, AWS, GCP et Datadog', '- Dashboard unifie avec SLA tracking et rapports d\'incidents']
        : ['- Real-time anomaly detection with auto-remediation', '- Native integration with Kubernetes, AWS, GCP and Datadog', '- Unified dashboard with SLA tracking and incident reports'],
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
      value: '+200%',
      description: lang === 'fr' ? 'de croissance mensuelle du nombre d\'utilisateurs actifs' : 'monthly growth in active users since launch',
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
        ? ['- 85% des entreprises migrent vers le cloud d\'ici 2026', '- Le monolithe ne scale plus : latence, equipes bloquees, deploys risques', '- L\'architecture microservices comme reponse a la complexite croissante']
        : ['- 85% of companies migrating to cloud by 2026', '- Monoliths no longer scale: latency, blocked teams, risky deploys', '- Microservices architecture as the answer to growing complexity'],
    }),
    impact: (lang) => ({
      content: lang === 'fr'
        ? ['Le cout reel du monolithe']
        : ['The real cost of the monolith'],
      value: '73%',
      description: lang === 'fr' ? 'des deployments echouent a cause du couplage fort entre les modules' : 'of deployments fail due to tight coupling between modules',
    }),
    illustration: (lang) => ({
      content: lang === 'fr'
        ? ['La realite sur le terrain']
        : ['The reality on the ground'],
    }),
    steps: (lang) => ({
      content: lang === 'fr'
        ? ['La migration vers les microservices en 5 etapes :']
        : ['The migration to microservices in 5 steps:'],
      items: lang === 'fr'
        ? ['Cartographier les domaines metier avec le Domain-Driven Design', 'Extraire le premier service autonome (Strangler Fig Pattern)', 'Mettre en place l\'API Gateway et le service mesh', 'Implementer l\'observabilite distribuee (traces, logs, metriques)', 'Automatiser le deploiement avec GitOps et Kubernetes']
        : ['Map business domains with Domain-Driven Design', 'Extract the first autonomous service (Strangler Fig Pattern)', 'Set up API Gateway and service mesh', 'Implement distributed observability (traces, logs, metrics)', 'Automate deployment with GitOps and Kubernetes'],
    }),
    demo: (lang) => ({
      content: lang === 'fr'
        ? ['La solution en action :']
        : ['The solution in action:'],
      code: lang === 'fr'
        ? '// Pipeline de deploiement automatise\nclass DeployPipeline {\n  private stages: Stage[] = [];\n  addStage(name: string, fn: RunFn) {\n    this.stages.push({ name, fn });\n    return this;\n  }\n  async execute(env: string) {\n    for (const s of this.stages) {\n      console.log(`[${env}] ${s.name}...`);\n      await s.fn(env);\n    }\n  }\n}\nconst pipeline = new DeployPipeline()\n  .addStage("Tests", runTests)\n  .addStage("Build", buildImage)\n  .addStage("Deploy", deployK8s);'
        : '// Automated deployment pipeline\nclass DeployPipeline {\n  private stages: Stage[] = [];\n  addStage(name: string, fn: RunFn) {\n    this.stages.push({ name, fn });\n    return this;\n  }\n  async execute(env: string) {\n    for (const s of this.stages) {\n      console.log(`[${env}] ${s.name}...`);\n      await s.fn(env);\n    }\n  }\n}\nconst pipeline = new DeployPipeline()\n  .addStage("Tests", runTests)\n  .addStage("Build", buildImage)\n  .addStage("Deploy", deployK8s);',
    }),
    architecture: (lang) => ({
      content: lang === 'fr'
        ? ['Architecture de la solution :']
        : ['Solution architecture:'],
      diagram: lang === 'fr'
        ? 'flowchart LR\n  Gateway[API Gateway] --> UserSvc[Service Utilisateurs]\n  Gateway --> OrderSvc[Service Commandes]\n  Gateway --> NotifSvc[Service Notifications]\n  UserSvc --> DB1[(Base Users)]\n  OrderSvc --> DB2[(Base Commandes)]\n  OrderSvc --> Queue[File de Messages]\n  Queue --> NotifSvc'
        : 'flowchart LR\n  Gateway[API Gateway] --> UserSvc[Users Service]\n  Gateway --> OrderSvc[Orders Service]\n  Gateway --> NotifSvc[Notifications Service]\n  UserSvc --> DB1[(Users DB)]\n  OrderSvc --> DB2[(Orders DB)]\n  OrderSvc --> Queue[Message Queue]\n  Queue --> NotifSvc',
    }),
    comparison: (lang) => ({
      content: lang === 'fr'
        ? ['**Avant** : monolithe, 1 deploy/mois, rollback en 4h', '', '**Apres** : microservices, 50 deploys/jour, rollback en 30s']
        : ['**Before**: monolith, 1 deploy/month, 4h rollback', '', '**After**: microservices, 50 deploys/day, 30s rollback'],
    }),
    result: (lang) => ({
      content: lang === 'fr'
        ? ['Resultat apres 12 mois de migration']
        : ['Result after 12 months of migration'],
      value: '50x',
      description: lang === 'fr' ? 'plus de deployments par mois avec zero downtime' : 'more deployments per month with zero downtime',
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
