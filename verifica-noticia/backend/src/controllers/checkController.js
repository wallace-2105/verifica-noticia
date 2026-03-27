const Check = require('../models/Check');

const { checkWithAI, searchSources } = require('../services/aiService');

const { scrapeArticle } = require('../services/scraperService');
 
// Verifica texto

const checkText = async (req, res) => {

  try {

    const { text } = req.body;
 
    if (!text || text.trim().length < 5) {

      return res.status(400).json({ error: 'Texto muito curto para análise.' });

    }
 
    if (text.length > 2000) {

      return res.status(400).json({ error: 'Texto muito longo. Máximo 2000 caracteres.' });

    }
 
    // Analisa com IA

    const aiResult = await checkWithAI(text, 'text');

    // Busca fontes

    const sources = await searchSources(aiResult.searchQuery || text.substring(0, 100));
 
    // Salva no banco

    const check = await Check.create({

      userId: req.user?._id || null,

      inputType: 'text',

      inputContent: text,

      verdict: aiResult.verdict,

      confidenceScore: aiResult.confidenceScore,

      explanation: aiResult.explanation,

      sources,

      articleTitle: aiResult.summary

    });
 
    res.json({

      success: true,

      checkId: check._id,

      shareId: check.shareId,

      verdict: aiResult.verdict,

      confidenceScore: aiResult.confidenceScore,

      summary: aiResult.summary,

      explanation: aiResult.explanation,

      keyPoints: aiResult.keyPoints,

      sources,

      inputType: 'text',

      inputContent: text,

      createdAt: check.createdAt

    });
 
  } catch (error) {

    console.error('Erro checkText:', error);

    res.status(500).json({ error: error.message || 'Erro ao verificar texto.' });

  }

};
 
// Verifica URL

const checkUrl = async (req, res) => {

  try {

    const { url } = req.body;
 
    if (!url) {

      return res.status(400).json({ error: 'URL é obrigatória.' });

    }
 
    // Valida URL

    try {

      new URL(url);

    } catch {

      return res.status(400).json({ error: 'URL inválida.' });

    }
 
    // Faz scraping

    const article = await scrapeArticle(url);

    if (!article.content || article.content.length < 50) {

      return res.status(400).json({ error: 'Não foi possível extrair conteúdo da URL.' });

    }
 
    // Analisa com IA

    const contentToAnalyze = `Título: ${article.title}\n\nConteúdo: ${article.content}`;

    const aiResult = await checkWithAI(contentToAnalyze, 'url');

    // Busca fontes

    const sources = await searchSources(aiResult.searchQuery || article.title.substring(0, 100));
 
    // Salva no banco

    const check = await Check.create({

      userId: req.user?._id || null,

      inputType: 'url',

      inputContent: url,

      verdict: aiResult.verdict,

      confidenceScore: aiResult.confidenceScore,

      explanation: aiResult.explanation,

      sources,

      articleTitle: article.title,

      articleContent: article.content.substring(0, 500)

    });
 
    res.json({

      success: true,

      checkId: check._id,

      shareId: check.shareId,

      verdict: aiResult.verdict,

      confidenceScore: aiResult.confidenceScore,

      summary: aiResult.summary,

      explanation: aiResult.explanation,

      keyPoints: aiResult.keyPoints,

      sources,

      inputType: 'url',

      inputContent: url,

      articleTitle: article.title,

      createdAt: check.createdAt

    });
 
  } catch (error) {

    console.error('Erro checkUrl:', error);

    res.status(500).json({ error: error.message || 'Erro ao verificar URL.' });

  }

};
 
// Busca resultado por shareId

const getByShareId = async (req, res) => {

  try {

    const check = await Check.findOne({ shareId: req.params.shareId });

    if (!check) {

      return res.status(404).json({ error: 'Verificação não encontrada.' });

    }
 
    res.json({ success: true, check });

  } catch (error) {

    res.status(500).json({ error: 'Erro ao buscar verificação.' });

  }

};
 
module.exports = { checkText, checkUrl, getByShareId };
 