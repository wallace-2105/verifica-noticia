const OpenAI = require('openai');

const axios = require('axios');
 
const openai = new OpenAI({

  apiKey: process.env.OPENAI_API_KEY

});
 
// Busca fontes no Google Custom Search

const searchSources = async (query) => {

  try {

    if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_CSE_ID) {

      return [];

    }
 
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {

      params: {

        key: process.env.GOOGLE_API_KEY,

        cx: process.env.GOOGLE_CSE_ID,

        q: query,

        num: 5,

        lr: 'lang_pt'

      }

    });
 
    return (response.data.items || []).map(item => ({

      title: item.title,

      url: item.link,

      snippet: item.snippet

    }));

  } catch (error) {

    console.error('Erro na busca Google:', error.message);

    return [];

  }

};
 
// Verifica a notícia usando IA

const checkWithAI = async (content, inputType) => {

  const systemPrompt = `Você é um verificador de fatos especialista e jornalista investigativo brasileiro.

Sua função é analisar textos ou notícias e determinar se são verdadeiros, falsos, parcialmente verdadeiros ou inconclusivos.

Você deve:

1. Analisar o conteúdo cuidadosamente

2. Identificar afirmações verificáveis

3. Basear-se em fatos conhecidos, dados científicos e fontes confiáveis

4. Explicar DETALHADAMENTE por que é verdadeiro ou falso

5. Sempre responder em JSON válido no formato especificado

6. Ser imparcial e baseado em evidências

7. Responder em português brasileiro`;
 
  const userPrompt = `Analise o seguinte ${inputType === 'url' ? 'artigo/notícia' : 'texto/afirmação'} e verifique se é verdadeiro ou falso:
 
"${content}"
 
Responda EXATAMENTE neste formato JSON:

{

  "verdict": "VERDADEIRO" | "FALSO" | "PARCIALMENTE VERDADEIRO" | "INCONCLUSIVO",

  "confidenceScore": <número de 0 a 100 indicando confiança na análise>,

  "summary": "<resumo da notícia em 1-2 frases>",

  "explanation": "<explicação detalhada de por que é verdadeiro ou falso, com pelo menos 3 parágrafos>",

  "keyPoints": [

    "<ponto importante 1>",

    "<ponto importante 2>",

    "<ponto importante 3>"

  ],

  "searchQuery": "<termos de busca para encontrar fontes sobre este assunto em português>"

}`;
 
  try {

    const response = await openai.chat.completions.create({

      model: 'gpt-4o-mini',

      messages: [

        { role: 'system', content: systemPrompt },

        { role: 'user', content: userPrompt }

      ],

      temperature: 0.3,

      response_format: { type: 'json_object' }

    });
 
    const result = JSON.parse(response.choices[0].message.content);

    return result;

  } catch (error) {

    throw new Error(`Erro na análise de IA: ${error.message}`);

  }

};
 
module.exports = { checkWithAI, searchSources };
 