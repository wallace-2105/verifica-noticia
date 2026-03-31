require('dotenv').config();
const axios = require('axios');

// ─────────────────────────────────────────────
// CONFIGURAÇÕES
// ─────────────────────────────────────────────

/**
 * Fontes confiáveis brasileiras com peso de credibilidade (0–1).
 * Quanto maior o peso, mais a fonte contribui para o score.
 */
const TRUSTED_SOURCES = {
  // Grandes portais de notícia
  'G1':             1.0,
  'Folha de S.Paulo': 1.0,
  'UOL':            0.9,
  'O Globo':        1.0,
  'Estadão':        1.0,
  'R7':             0.85,
  'CNN Brasil':     0.95,
  'Band':           0.85,
  'SBT News':       0.8,
  'Terra':          0.75,
  'Metrópoles':     0.8,
  'Correio Braziliense': 0.9,
  'Agência Brasil': 1.0,   // fonte oficial
  'Valor Econômico':1.0,
  'Exame':          0.85,
  'InfoMoney':      0.85,
  // Agências internacionais (PT)
  'Reuters':        1.0,
  'AFP':            1.0,
  'Associated Press': 1.0,
  // Fact-checkers
  'Lupa':           1.0,
  'Aos Fatos':      1.0,
  'E-farsas':       0.9,
  'Boatos.org':     0.85,
};

/** Domínios de baixa confiabilidade — penalizam o score */
const UNTRUSTED_DOMAINS = [
  'blogspot', 'wordpress', 'medium.com', 'tumblr',
  'reddit', 'twitter', 'facebook', 'instagram', 'tiktok',
  'whatsapp', 'telegram',
];

// Janelas de tempo para avaliar recência
const RECENCY_WINDOWS = {
  VERY_RECENT:  7,   // ≤ 7 dias  → boost +15
  RECENT:       30,  // ≤ 30 dias → boost +5
  OLD:          180, // > 180 dias → penalidade -10
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Retorna o peso de confiança de uma fonte (0.3 a 1.0) */
const getSourceWeight = (sourceName = '', articleUrl = '') => {
  // Verifica fontes conhecidas
  for (const [name, weight] of Object.entries(TRUSTED_SOURCES)) {
    if (sourceName.toLowerCase().includes(name.toLowerCase())) return weight;
  }
  // Penaliza domínios de baixa confiança
  const url = articleUrl.toLowerCase();
  if (UNTRUSTED_DOMAINS.some(d => url.includes(d))) return 0.2;
  // Fonte desconhecida — peso neutro baixo
  return 0.4;
};

/** Calcula recência de um artigo em dias. Retorna Infinity se inválido. */
const getArticleAgeDays = (publishedAt) => {
  if (!publishedAt) return Infinity;
  const diff = Date.now() - new Date(publishedAt).getTime();
  return diff / (1000 * 60 * 60 * 24);
};

/** Extrai palavras-chave relevantes de um texto (remove stopwords comuns) */
const STOPWORDS = new Set([
  'de','a','o','e','do','da','em','para','com','que','não','um','uma',
  'os','as','se','na','no','por','mais','foi','ao','mas','ou','já',
  'this','the','is','are','was','were','be','been','being','have',
  'has','had','do','does','did','will','would','could','should',
]);

const extractKeywords = (text, maxWords = 8) => {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, '')      // remove URLs
    .replace(/[^a-záàâãéêíóôõúüç\s]/gi, ' ') // só letras
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOPWORDS.has(w))
    .slice(0, maxWords)
    .join(' ');
};

/**
 * Gera variações de query para aumentar recall.
 * Injeta contexto BR em todas as queries para simular filtro country=br,
 * já que o endpoint /v2/everything não suporta o parâmetro country diretamente.
 */
const BR_CONTEXT = '(brasil OR brazil)';

const buildQueries = (rawContent, inputType) => {
  let base = rawContent;

  if (inputType === 'url' && rawContent.includes('Título:')) {
    base = rawContent.split('\n')[0].replace('Título:', '').trim();
  }

  const cleaned  = base.substring(0, 100).trim();
  const keywords = extractKeywords(cleaned);

  // Query principal: texto original + contexto BR
  const q1 = `${cleaned} ${BR_CONTEXT}`;

  // Query alternativa: só palavras-chave + contexto BR
  const q2 = keywords ? `${keywords} ${BR_CONTEXT}` : null;

  const queries = [q1];
  if (q2 && q2 !== q1) queries.push(q2);

  console.log('[Checker] Queries com contexto BR:', queries);
  return queries;
};

// ─────────────────────────────────────────────
// NEWS API
// ─────────────────────────────────────────────

/**
 * Faz uma única chamada à News API com filtros PT/BR
 */
const fetchFromNewsAPI = async (query) => {
  const response = await axios.get('https://newsapi.org/v2/everything', {
    params: {
      q:        query,
      language: 'pt',          // 🇧🇷 apenas português
      sortBy:   'relevancy',
      pageSize: 30,            // mais resultados para avaliar melhor
      apiKey:   process.env.NEWS_API,
    },
  });

  return response.data;
};

/**
 * Busca com múltiplas queries e desduplicação por URL
 */
const searchSources = async (queries) => {
  if (!process.env.NEWS_API) {
    console.error('[News API] Chave NEWS_API não configurada no .env');
    return { articles: [], totalResults: 0 };
  }

  const seen    = new Set();
  const articles = [];
  let maxTotal  = 0;

  for (const query of queries) {
    try {
      const data = await fetchFromNewsAPI(query);
      maxTotal = Math.max(maxTotal, data.totalResults || 0);
      console.log(`[News API] Query: "${query}" → ${data.totalResults} resultados`);

      for (const a of (data.articles || [])) {
        if (!seen.has(a.url)) {
          seen.add(a.url);
          articles.push(a);
        }
      }
    } catch (err) {
      console.error(`[News API] Erro na query "${query}":`, err.response?.status, err.message);
    }
  }

  return { articles, totalResults: maxTotal };
};

// ─────────────────────────────────────────────
// SCORING
// ─────────────────────────────────────────────

/**
 * Calcula um score de credibilidade (0–100) baseado em:
 *  - Quantidade de artigos
 *  - Peso/confiança de cada fonte
 *  - Recência dos artigos
 *  - Diversidade de veículos distintos
 */
const calculateCredibilityScore = (articles) => {
  if (articles.length === 0) return 0;

  let rawScore = 0;
  const uniqueSources = new Set();

  for (const article of articles) {
    const weight  = getSourceWeight(article.source?.name, article.url);
    const ageDays = getArticleAgeDays(article.publishedAt);

    // Contribuição base do artigo
    let contribution = weight * 10;

    // Bônus de recência
    if (ageDays <= RECENCY_WINDOWS.VERY_RECENT) contribution += 15;
    else if (ageDays <= RECENCY_WINDOWS.RECENT)  contribution += 5;
    else if (ageDays >  RECENCY_WINDOWS.OLD)     contribution -= 10;

    rawScore += contribution;
    uniqueSources.add(article.source?.name || article.url);
  }

  // Bônus pela diversidade de fontes (evita que um portal repita 20 artigos)
  const diversityBonus = Math.min(uniqueSources.size * 3, 20);
  rawScore += diversityBonus;

  // Normaliza para 0–100
  return Math.min(100, Math.round(rawScore));
};

// ─────────────────────────────────────────────
// VEREDITO
// ─────────────────────────────────────────────

/**
 * Converte o score em veredito + explicação detalhada
 */
const determineVerdict = (score, articles, totalResults) => {
  const uniqueSources   = [...new Set(articles.map(a => a.source?.name || 'Desconhecido'))];
  const trustedPresent  = uniqueSources.filter(s => TRUSTED_SOURCES[s]);
  const sourceList      = uniqueSources.slice(0, 5).join(', ') || 'nenhuma';

  let verdict, confidenceScore, explanation;

  if (score >= 70) {
    verdict         = 'VERDADEIRO';
    confidenceScore = Math.min(95, score);
    explanation     = `A informação tem alta credibilidade. Foram encontrados ${articles.length} artigo(s) `
      + `em ${uniqueSources.length} veículo(s) distintos, incluindo fontes confiáveis como ${trustedPresent.slice(0, 3).join(', ') || sourceList}. `
      + (totalResults > 20 ? `O volume total de ${totalResults} resultados reforça a ampla cobertura midiática.` : '');
  } else if (score >= 40) {
    verdict         = 'PARCIALMENTE VERDADEIRO';
    confidenceScore = score;
    explanation     = `A informação tem cobertura moderada (score ${score}/100). `
      + `Encontrado em ${articles.length} artigo(s) de ${uniqueSources.length} veículo(s): ${sourceList}. `
      + `Recomenda-se verificar os detalhes em fontes primárias antes de compartilhar.`;
  } else if (score >= 15) {
    verdict         = 'INCONCLUSIVO';
    confidenceScore = score;
    explanation     = `Cobertura insuficiente para um veredito definitivo (score ${score}/100). `
      + (articles.length > 0
        ? `Apenas ${articles.length} artigo(s) encontrado(s) em fontes de baixa relevância.`
        : 'Nenhum artigo encontrado nas fontes consultadas.')
      + ' Busque informação adicional antes de repassar.';
  } else {
    verdict         = 'FALSO / NÃO VERIFICADO';
    confidenceScore = Math.max(5, score);
    explanation     = `Nenhuma fonte jornalística confiável registrou esta informação (score ${score}/100). `
      + `A ausência de cobertura em veículos reconhecidos é forte indicador de desinformação. `
      + `Não compartilhe sem verificação independente.`;
  }

  return { verdict, confidenceScore, explanation, uniqueSources, trustedPresent };
};

// ─────────────────────────────────────────────
// ENTRY POINT
// ─────────────────────────────────────────────

/**
 * Verifica uma notícia/texto usando a News API com lógica aprimorada.
 * @param {string} content   - Texto ou URL já processada
 * @param {string} inputType - 'text' | 'url'
 */
const checkWithAI = async (content, inputType) => {
  // 1. Monta queries
  const queries = buildQueries(content, inputType);
  console.log('[Checker] Queries geradas:', queries);

  // 2. Busca artigos
  const { articles, totalResults } = await searchSources(queries);

  // 3. Calcula score de credibilidade
  const score = calculateCredibilityScore(articles);
  console.log(`[Checker] Score de credibilidade: ${score}/100 (${articles.length} artigos únicos)`);

  // 4. Determina veredito
  const { verdict, confidenceScore, explanation, uniqueSources, trustedPresent } =
    determineVerdict(score, articles, totalResults);

  // 5. Monta pontos-chave
  const keyPoints = [
    `${articles.length} artigo(s) único(s) encontrado(s) de ${uniqueSources.length} veículo(s)`,
    trustedPresent.length > 0
      ? `Fontes confiáveis presentes: ${trustedPresent.slice(0, 4).join(', ')}`
      : 'Nenhuma fonte de alta confiabilidade identificada',
    `Score de credibilidade: ${score}/100`,
  ];

  if (totalResults > articles.length) {
    keyPoints.push(`Total estimado de resultados na API: ${totalResults}`);
  }

  // 6. Formata sources para o controller (compatível com o formato anterior)
  const sources = articles.map(a => ({
    title:       a.title,
    url:         a.url,
    snippet:     a.description || '',
    source:      a.source?.name || 'Desconhecido',
    publishedAt: a.publishedAt,
    weight:      getSourceWeight(a.source?.name, a.url), // novo campo
  }));

  return {
    verdict,
    confidenceScore,
    summary:     `Verificação baseada em ${articles.length} artigo(s) de ${uniqueSources.length} fonte(s). Score: ${score}/100.`,
    explanation,
    keyPoints,
    searchQuery: queries[0],
    sources,
  };
};

module.exports = { checkWithAI, searchSources };