const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `Tu es consultant en automatisation des processus pour cabinets d'expertise comptable. Tu analyses les réponses d'un court questionnaire et tu produis un pré-diagnostic professionnel, clair et prudent. Tu ne dois pas inventer d'informations absentes. Tu ne dois pas promettre de gains chiffrés précis. Tu ne dois pas détailler toute l'implémentation technique. Tu dois identifier les irritants principaux, le flux prioritaire et proposer quelques familles d'automatisations réalistes. Ton ton doit être sérieux, concret, orienté cabinet comptable, sans jargon excessif.

Mise en forme : aère le texte. Utilise des listes à puces (- item) pour énumérer des éléments. Utilise le gras (**mot**) pour mettre en valeur les notions clés. Évite les longs blocs de texte continus. Chaque section doit respirer.`;

function sanitizeArr(arr, maxLen = 20) {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, maxLen).map(s => String(s || '').slice(0, 200));
}

function sanitizeStr(s, maxLen = 500) {
  return String(s || '').slice(0, maxLen);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { tools, painPoints, flowCategories, priorityFlow, dynamicDetails, timeLost, desiredOutcomes } = req.body || {};

    if (!Array.isArray(tools) || tools.length === 0 ||
        !Array.isArray(painPoints) || painPoints.length === 0 ||
        !Array.isArray(flowCategories) || flowCategories.length === 0 ||
        !timeLost ||
        !Array.isArray(desiredOutcomes) || desiredOutcomes.length === 0) {
      return res.status(400).json({ error: 'Données incomplètes' });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const userPrompt = `Voici les réponses du cabinet :

Outils utilisés :
${sanitizeArr(tools).join(', ')}

Pertes de temps principales :
${sanitizeArr(painPoints).join(', ')}

Types de flux concernés :
${sanitizeArr(flowCategories).join(', ')}

Flux prioritaire :
${sanitizeStr(priorityFlow) || 'Non précisé'}

Détails du flux prioritaire :
${Array.isArray(dynamicDetails) ? sanitizeArr(dynamicDetails).join(', ') : sanitizeStr(dynamicDetails) || 'Non précisé'}

Temps perdu estimé par mois :
${sanitizeStr(timeLost)}

Résultats recherchés :
${sanitizeArr(desiredOutcomes).join(', ')}

Génère un pré-diagnostic court en français avec exactement cette structure. Commence directement par "1." sans titre général ni introduction :

1. Situation actuelle

2. Flux prioritaire identifié

3. Solutions potentielles à étudier

4. Prochaine étape recommandée

Contraintes : 200 à 350 mots maximum. Ton professionnel. Pas de promesse exagérée. Pas de détail technique complet. Ne pas mentionner que le texte est généré par IA. Ne pas utiliser de jargon inutile. Ne pas ajouter de titre, chapeau ou introduction avant le "1.". Ne pas utiliser de tirets longs (–) ni de tirets cadratins (—), utiliser des virgules ou des points à la place. Donner envie d'échanger sur un cas réel.`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 900,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const result = message.content[0].text;

    // Save to Airtable
    if (process.env.AIRTABLE_API_KEY) {
      try {
        const atRes = await fetch('https://api.airtable.com/v0/appOWv2uRJ14JI13P/tblc6EBMzNovvoZUB', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            records: [{
              fields: {
                'Outils': sanitizeArr(tools).join(', '),
                'Flux prioritaire': sanitizeStr(priorityFlow) || sanitizeArr(flowCategories).join(', '),
                'Temps perdu': sanitizeStr(timeLost),
                'Résultats recherchés': sanitizeArr(desiredOutcomes).join(', '),
                'Résumé': result
              }
            }]
          })
        });
        const atBody = await atRes.json();
        if (!atRes.ok) console.error('Airtable error:', JSON.stringify(atBody));
        else console.log('Airtable saved:', atBody.records?.[0]?.id);
      } catch (err) {
        console.error('Airtable fetch error:', err.message);
      }
    } else {
      console.warn('AIRTABLE_API_KEY non définie');
    }

    return res.status(200).json({ result });

  } catch (err) {
    console.error('Diagnostic generation error:', err.message || err);
    return res.status(500).json({ error: 'Erreur lors de la génération' });
  }
};
