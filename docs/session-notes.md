# Notes de session — 23 mars 2026

## Contexte de départ

Le site Centurio Stratégie existait sous la forme d'un **fichier unique monolithique** (`centurio-v2.html`, ~155 KB) contenant tout le HTML, le CSS et le JavaScript inline, ainsi qu'un logo encodé en base64 directement dans le HTML (~126 KB à lui seul).

---

## Ce qui a été accompli

### 1. Refactorisation en projet Vercel propre

Le fichier monolithique a été découpé en fichiers séparés :

| Fichier | Contenu | Taille |
|---|---|---|
| `index.html` | Structure HTML uniquement | ~20 KB |
| `style.css` | CSS custom (animations, nav, cards, shimmer…) | ~3 KB |
| `main.js` | JavaScript (particles, tiles button, scroll reveal, formulaire) | ~9 KB |
| `logo.png` | Logo extrait du base64 et sauvegardé en fichier PNG | ~95 KB |
| `vercel.json` | Config Vercel (cleanUrls, security headers, cache) | ~490 B |

Le logo base64 (~126 KB de texte dans le HTML) a été extrait et décodé en vrai fichier PNG, réduisant le HTML de 80 %.

### 2. Création du dépôt GitHub

- Dépôt public créé : **https://github.com/smdnbuk/site-centurio**
- `centurio-v2.html` et `.claude/` exclus via `.gitignore`
- Branch principale : `master`
- Connecté à Vercel pour les redéploiements automatiques à chaque `git push`

### 3. Logo cliquable → scroll top

Le logo et le nom "Centurio Stratégie" dans la navbar sont désormais enveloppés dans un `<a href="#">` pour remonter en haut de page au clic.

### 4. Formulaire de contact — envoi email

Parcours de la solution :

- **Tentative 1 — API Vercel + Resend** : fonction serverless `api/contact.js` créée, mais abandon car nécessitait une clé API Resend non configurée → causait l'erreur affichée.
- **Tentative 2 — Formsubmit.co** : solution sans compte, mais abandon au profit de Formspree.
- **Solution finale — Formspree** (`https://formspree.io/f/mgonjyal`) :
  - `action` et `method="POST"` ajoutés sur le `<form>`
  - Attributs `name` ajoutés sur tous les champs (`prenom`, `societe`, `email`, `message`)
  - Handler JS mis à jour pour POSTer en AJAX vers Formspree et afficher un feedback visuel (succès / erreur)
  - Appliqué dans `index.html` (site déployé) **et** dans `centurio-v2.html` (fichier source original)

### 5. SEO — balises meta

Ajout dans le `<head>` :

```html
<title>Automatisation des processus à Chartres | Centurio Stratégie</title>
<meta name="description" content="Cabinet spécialisé en automatisation des processus métier à Chartres (28). Développement logiciel sur mesure pour TPE/PME."/>
```

---

## État actuel du dépôt

```
site-centurio/
├── index.html        ← site déployé sur Vercel
├── style.css
├── main.js
├── logo.png
├── vercel.json
├── package.json
├── api/
│   └── contact.js    ← ancienne route Resend (non utilisée, peut être supprimée)
├── docs/
│   └── session-notes.md
├── .gitignore
└── centurio-v2.html  ← fichier source original (ignoré par git)
```

---

## Ce qui reste à faire

### Prioritaire

- [ ] **Activer Formspree** : la première soumission du formulaire déclenchera un email de confirmation à `guyonloic89@gmail.com`. Il faut cliquer sur le lien de confirmation reçu pour activer la réception des soumissions.
- [ ] **Connecter le domaine `centuriostrategie.com`** sur Vercel :
  - Dans Vercel → Settings → Domains → ajouter `centuriostrategie.com`
  - Configurer les DNS chez le registrar :
    - `A` → `76.76.21.21`
    - `CNAME www` → `cname.vercel-dns.com`

### Améliorations souhaitables

- [ ] **Supprimer `api/contact.js`** : la route Resend n'est plus utilisée depuis la migration vers Formspree. Le fichier peut être supprimé pour garder le projet propre.
- [ ] **SEO complémentaire** : ajouter balises Open Graph (`og:title`, `og:description`, `og:image`) et données structurées JSON-LD (LocalBusiness avec adresse Chartres).
- [ ] **Favicon** : aucun favicon n'est configuré actuellement.
- [ ] **Mentions légales / Politique de confidentialité** : les liens en footer pointent vers `#` — pages à créer.
- [ ] **Lien LinkedIn** : le lien en footer pointe vers `#` — à renseigner avec l'URL du profil/page LinkedIn Centurio.
- [ ] **Domaine expéditeur Formspree** : une fois `centuriostrategie.com` actif, configurer un expéditeur `contact@centuriostrategie.com` dans Formspree pour plus de professionnalisme.
- [ ] **Google Analytics / Search Console** : aucun tracking n'est en place.

---

## Commits de la session

| Hash | Message |
|---|---|
| `ffec94c` | Initial commit — refactoring site Centurio Stratégie |
| `cfe5d27` | Logo cliquable + envoi email via API Resend |
| `b624a63` | Formulaire contact : migration vers Formsubmit (zéro config) |
| `00bf74c` | SEO : title et meta description géolocalisés Chartres |
| `005c6b7` | Formulaire contact : migration vers Formspree (mgonjyal) |
| `49565a7` | docs : ajout notes de session du 23 mars 2026 |

---

# Notes de session — 25 mai 2026

## Ce qui a été accompli

### 1. Refonte complète de l'index.html

Remplacement du contenu de `index.html` par la nouvelle version `indexcenturio.html`. Structure entièrement revue, orientée audit et automatisation des process TPE/PME.

**Nouvelles sections :**
- **Hero** — accroche directe ("Vous dépensez du temps sans le savoir. On vous le rend.")
- **Douleur** — liste des problèmes concrets (ressaisie, Excel, relances oubliées…)
- **Méthode** — 4 étapes (Audit → Diagnostic → Implémentation → Formation)
- **Livrables** — détail de ce que le client reçoit avec l'audit gratuit
- **Exemple de livrable** — faux document d'audit anonymisé (KPIs, sommaire, 17 pages)
- **Pourquoi Centurio** — positionnement (expérience terrain, aucun outil imposé, ROI)
- **Produits** — 4 solutions sectorielles (Not'Air, Propulse, Cursus, Tell Me Hall)
- **Formulaire CTA** — reformulé avec 3 garanties (48h, NDA, zéro engagement)

Le logo et son chemin (`logo.png`) ont été conservés à l'identique.

Les styles et le JavaScript sont désormais inline (remplacement de `style.css` et `main.js` externes).

### 2. Fix formulaire contact

Le `handleSubmit` faisait `e.preventDefault()` sans envoyer les données — le formulaire n'arrivait jamais chez Formspree. Corrigé avec un `fetch()` réel vers `https://formspree.io/f/mgonjyal`, avec feedback visuel succès/erreur.

### 3. SEO — indexation Google

- **robots.txt** créé : `Allow: /` + référence au sitemap
- **sitemap.xml** créé : liste `https://centuriostrategie.com/`
- **Balise canonical** ajoutée dans le `<head>` : `<link rel="canonical" href="https://centuriostrategie.com/"/>`
- **Vérifié** : aucune balise `<meta name="robots" content="noindex">` présente
- **Title et meta description** mis à jour pour le nouveau positionnement

---

## État actuel du dépôt

```
site-centurio/
├── index.html           ← site refait (inline CSS + JS)
├── style.css            ← ancien fichier CSS (plus référencé)
├── main.js              ← ancien fichier JS (plus référencé)
├── logo.png
├── robots.txt           ← NEW
├── sitemap.xml          ← NEW
├── indexcenturio.html   ← source de la refonte (non suivi par git)
├── vercel.json
├── package.json
├── api/
│   └── contact.js       ← ancienne route Resend (non utilisée)
├── docs/
│   └── session-notes.md
└── .gitignore
```

---

## Commits de la session

| Hash | Message |
|---|---|
| `490b331` | Refonte complète index.html : nouvelle structure orientée audit et automatisation |
| `432485f` | Fix formulaire contact : envoi réel vers Formspree via fetch |
| `f54da81` | SEO : robots.txt, sitemap.xml et balise canonical pour indexation Google |

---

## Ce qui reste à faire

### Prioritaire

- [ ] **Soumettre le sitemap** dans Google Search Console (`https://centuriostrategie.com/sitemap.xml`)
- [ ] **Configurer Google Search Console** si pas encore fait

### Améliorations souhaitables

- [ ] **Supprimer `style.css` et `api/contact.js`** : plus utilisés depuis la refonte inline
- [ ] **Favicon** : aucun favicon configuré
- [ ] **Google Analytics** : aucun tracking en place

---

# Notes de session — 26 mai 2026

## Ce qui a été accompli

### 1. Audit SEO complet (`/seo audit`)

Audit lancé avec 5 agents parallèles sur https://centuriostrategie.com :
- Technical SEO : **54/100**
- Content Quality (E-E-A-T) : **35/100**
- Schema / Structured Data : **10/100**
- AI Search Readiness (GEO) : **31/100**
- Search Experience (SXO) : **41/100**

**Score global SEO Health : 38/100**

Problèmes critiques identifiés : aucun schema, pages légales manquantes, Tailwind CDN render-blocking, animation particules non optimisée, aucune personne nommée sur le site, lien LinkedIn mort.

### 2. Sprint 1 — Signaux SEO fondamentaux (FAIT)

- **6 blocs JSON-LD** ajoutés : ProfessionalService, WebSite, WebPage, Service (Audit Gratuit), Service (Implémentation), ItemList (4 produits)
- **Meta Open Graph + Twitter Card** : og:title, og:description, og:image, og:locale, og:site_name, twitter:card, twitter:title, twitter:description, twitter:image
- **Preconnect Google Fonts** : `fonts.googleapis.com` + `fonts.gstatic.com`
- **Lien LinkedIn fixé** : `href="#"` remplacé par `https://www.linkedin.com/company/centurio-strategie` avec target="_blank" rel="noopener noreferrer"
- **`llms.txt` créé** : fichier structuré pour crawlers IA (ChatGPT, Claude, Perplexity)

### 3. Sprint 2 — Performance (FAIT)

- **Tailwind CDN supprimé** : remplacé par build Tailwind v3 purgé+minifié (`static/styles.css`, 21KB vs ~358KB)
- `tailwind.config.js` créé, `src/input.css` créé, script `npm run build:css` ajouté
- Bloc `<script id="tailwind-config">` inline supprimé
- **Animation particules optimisée** :
  - `prefers-reduced-motion` respecté (animation désactivée si activé)
  - Throttle à 30fps (au lieu de 60fps)
  - Pause via IntersectionObserver quand hero hors viewport
  - Particules réduites : 100 desktop / 60 mobile (vs 140 avant)
  - maxDist réduit : 200px (vs 220px)
- `node_modules/` ajouté au `.gitignore`

### 4. Sprint 3 — En attente d'informations

En attente des infos utilisateur pour :
- **Mentions Légales** : forme juridique, SIRET, adresse siège, directeur publication, hébergeur
- **Politique de Confidentialité** : même infos
- **Bio fondateur** : nom, parcours, expérience

---

## État actuel du dépôt

```
site-centurio/
├── index.html              ← site (inline JS, schema JSON-LD, OG tags)
├── static/
│   └── styles.css          ← Tailwind purgé+minifié (21KB)
├── src/
│   └── input.css           ← source Tailwind
├── tailwind.config.js      ← config Tailwind v3
├── llms.txt                ← NEW — pour crawlers IA
├── logo.png
├── robots.txt
├── sitemap.xml
├── vercel.json
├── package.json            ← avec script build:css
├── style.css               ← ancien (non référencé)
├── main.js                 ← ancien (non référencé, doublon du inline)
├── indexcenturio.html      ← source de la refonte (non suivi)
├── api/
│   └── contact.js          ← ancienne route Resend (non utilisée)
├── docs/
│   └── session-notes.md
├── node_modules/           ← ignoré par git
└── .gitignore
```

---

## Ce qui reste à faire

### Sprint 3 — En attente (infos légales + bio)

- [ ] **Mentions Légales** : créer la page (besoin SIRET, adresse, forme juridique)
- [ ] **Politique de Confidentialité** : créer la page
- [ ] **Bio fondateur** : ajouter section avec nom, parcours, photo
- [ ] **Mettre à jour les liens footer** Mentions Légales / Politique de Confidentialité une fois pages créées
- [ ] **Ajouter les nouvelles pages au sitemap.xml**

### Améliorations post-Sprint 3

- [ ] **og-image.jpg** : créer l'image 1200x630px référencée dans les meta OG
- [ ] **Favicon** : aucun favicon configuré
- [ ] **Supprimer fichiers obsolètes** : `style.css`, `main.js`, `api/contact.js`
- [ ] **FAQ section** : 6-8 questions ciblant les PAA Google
- [ ] **Pages produits dédiées** : Not'Air, Propulse, Cursus (800+ mots chacune)
- [ ] **Google Search Console** : soumettre sitemap, configurer
- [ ] **Google Analytics** : aucun tracking en place
- [ ] **IndexNow** : implémenter pour Bing/Yandex
- [ ] **CSP + Permissions-Policy** : ajouter dans vercel.json
- [ ] **Contenu pilier** : 2-3 articles long-format (awareness-stage)
