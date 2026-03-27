const axios = require('axios');

const cheerio = require('cheerio');
 
const scrapeArticle = async (url) => {

  try {

    const response = await axios.get(url, {

      timeout: 10000,

      headers: {

        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

      }

    });
 
    const $ = cheerio.load(response.data);
 
    // Remove scripts, styles, nav, footer

    $('script, style, nav, footer, header, aside, .ad, .advertisement').remove();
 
    // Tenta pegar o título

    const title = 

      $('meta[property="og:title"]').attr('content') ||

      $('h1').first().text() ||

      $('title').text() ||

      'Título não encontrado';
 
    // Tenta pegar o conteúdo principal

    let content = '';

    const contentSelectors = [

      'article', '.article-body', '.post-content', 

      '.entry-content', '.content', 'main', '.noticia'

    ];
 
    for (const selector of contentSelectors) {

      const el = $(selector);

      if (el.length) {

        content = el.text();

        break;

      }

    }
 
    if (!content) {

      content = $('body').text();

    }
 
    // Limpa o texto

    content = content

      .replace(/\s+/g, ' ')

      .trim()

      .substring(0, 3000); // Limita para não exceder token limit
 
    return {

      success: true,

      title: title.trim(),

      content,

      url

    };

  } catch (error) {

    throw new Error(`Não foi possível acessar a URL: ${error.message}`);

  }

};
 
module.exports = { scrapeArticle };
 