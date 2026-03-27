markdown
<div align="center">

<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/b3ba486a-3903-4957-a786-b1ac2cc0e86d" />


# Verifica Notícia

### Plataforma inteligente de verificação de fake news com IA

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

[🚀 Demo](#-demo) •
[📋 Funcionalidades](#-funcionalidades) •
[⚙️ Instalação](#️-instalação) •
[📡 API](#-documentação-da-api) •
[🤝 Contribuição](#-contribuição)

</div>

---

## 📌 Sobre o Projeto

O **Verifica Notícia** é uma plataforma web desenvolvida como projeto de conclusão de curso (PCC)
que utiliza **Inteligência Artificial (GPT-4o)** para verificar a veracidade de notícias e informações
circulantes na internet.

O usuário pode inserir uma **URL de uma notícia** ou **digitar um texto/afirmação** e receber
uma análise detalhada com:

- ✅ Veredicto claro (Verdadeiro / Falso / Parcialmente Verdadeiro / Inconclusivo)
- 📊 Nível de confiança da análise (0–100%)
- 📝 Explicação detalhada com argumentos
- 🔗 Fontes reais para embasar a conclusão
- 📤 Opção de compartilhamento do resultado

> **Projeto acadêmico** desenvolvido para a disciplina de [Análise e projeto de sistemas] — [Cruzeiro do sul] — [2026].

---

## 🎯 Funcionalidades

| Funcionalidade | Descrição | Status ||---|---|---|| 🔍 Verificar por texto | Digita uma afirmação e verifica | ✅ || 🌐 Verificar por URL | Cola um link de notícia e analisa | ✅ || 🤖 Análise com IA | GPT-4o explica o resultado | ✅ || 📊 Score de confiança | Percentual de certeza da análise | ✅ || 🔗 Fontes de referência | Links reais via Google Search | ✅ || 👤 Cadastro/Login | Autenticação JWT segura | ✅ || 🕓 Histórico | Consultas salvas por usuário | ✅ || 📤 Compartilhamento | Link único, WhatsApp, Twitter | ✅ || 🔒 Uso sem cadastro | Verificação livre sem login | ✅ || 📱 Responsivo | Funciona em mobile e desktop | ✅ |
---

## 🛠️ Tecnologias Utilizadas

### Backend
| Tecnologia | Versão | Uso ||---|---|---|| Node.js | 18+ | Runtime JavaScript || Express.js | 4.x | Framework HTTP || MongoDB | 7.x | Banco de dados || Mongoose | 8.x | ODM para MongoDB || OpenAI API | 4.x | Análise com IA (GPT-4o) || JSON Web Token | 9.x | Autenticação || bcryptjs | 2.x | Criptografia de senhas || Axios | 1.x | Requisições HTTP || Cheerio | 1.x | Web scraping || Helmet | 7.x | Segurança HTTP || express-rate-limit | 7.x | Limite de requisições |
### Frontend
| Tecnologia | Uso ||---|---|| HTML5 | Estrutura das páginas || CSS3 | Estilização moderna || JavaScript (ES6+) | Lógica do client-side || Font Awesome | Ícones || Google Fonts (Inter) | Tipografia |
### Serviços Externos
| Serviço | Uso | Obrigatório ||---|---|---|| OpenAI API | Análise de fake news | ✅ Sim || Google Custom Search API | Busca de fontes | ⚠️ Opcional || MongoDB Atlas | Banco na nuvem | ⚠️ Opcional (pode usar local) |
---

## 📁 Estrutura do Projeto
verifica-noticia/
│
├── 📁 backend/
│ ├── 📁 src/
│ │ ├── 📁 controllers/ # Lógica de cada rota
│ │ │ ├── authController.js # Login, cadastro, perfil
│ │ │ ├── checkController.js # Verificação de notícias
│ │ │ └── historyController.js # Histórico do usuário
│ │ │
│ │ ├── 📁 models/ # Schemas do MongoDB
│ │ │ ├── User.js # Modelo de usuário
│ │ │ └── Check.js # Modelo de verificação
│ │ │
│ │ ├── 📁 routes/ # Definição das rotas
│ │ │ ├── auth.js # /api/auth/*
│ │ │ ├── check.js # /api/check/*
│ │ │ └── history.js # /api/history/*
│ │ │
│ │ ├── 📁 middleware/
│ │ │ └── auth.js # Proteção de rotas JWT
│ │ │
│ │ ├── 📁 services/ # Lógica de negócio
│ │ │ ├── aiService.js # Integração OpenAI + Google
│ │ │ └── scraperService.js # Extração de conteúdo de URL
│ │ │
│ │ └── app.js # Entry point do servidor
│ │
│ ├── .env # Variáveis de ambiente (não versionar!)
│ ├── .env.example # Exemplo das variáveis
│ ├── .gitignore
│ └── package.json
│
├── 📁 frontend/
│ ├── 📁 assets/
│ │ ├── logo.png # Logo colorida
│ │ └── logo-white.png # Logo branca (para fundo escuro)
│ │
│ ├── 📁 css/
│ │ └── style.css # Todos os estilos
│ │
│ ├── 📁 js/
│ │ ├── api.js # Funções de requisição ao backend
│ │ ├── auth.js # Login, logout, verificação de token
│ │ ├── main.js # Página principal (index)
│ │ ├── result.js # Página de resultado
│ │ └── history.js # Página de histórico
│ │
│ ├── index.html # Página principal
│ ├── login.html # Tela de login
│ ├── register.html # Tela de cadastro
│ ├── result.html # Resultado da verificação
│ └── history.html # Histórico do usuário
│
├── 📄 README.md # Este arquivo
├── 📄 DOCUMENTATION.md # Documentação técnica detalhada
└── 📄 LICENSE # Licença MIT
text

---

## ⚙️ Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js 18+](https://nodejs.org/en/download) — Runtime JavaScript
- [MongoDB](https://www.mongodb.com/try/download/community) — Banco de dados *(ou use o Atlas)*
- [Git](https://git-scm.com/downloads) — Controle de versão
- Uma chave de API da [OpenAI](https://platform.openai.com/api-keys)

---

### Passo 1 — Clone o repositório

```bash
git clone https://github.com/seu-usuario/verifica-noticia.git
cd verifica-noticia
________________________________________
Passo 2 — Configure o Backend
bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install
________________________________________
Passo 3 — Configure as variáveis de ambiente
bash
# Copie o arquivo de exemplo
cp .env.example .env
Abra o arquivo .env e preencha:
env
# ─── Servidor ────────────────────────────────────
PORT=5000

# ─── Banco de Dados ──────────────────────────────
# Local:
MONGODB_URI=mongodb://localhost:27017/verifica-noticia
# MongoDB Atlas (nuvem):
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/verifica-noticia

# ─── Autenticação ────────────────────────────────
JWT_SECRET=coloque_uma_chave_secreta_longa_e_aleatoria_aqui_2024

# ─── OpenAI ──────────────────────────────────────
OPENAI_API_KEY=sk-sua-chave-aqui

# ─── Google Custom Search (Opcional) ─────────────
GOOGLE_API_KEY=sua-chave-google-aqui
GOOGLE_CSE_ID=seu-cse-id-aqui

# ─── CORS ────────────────────────────────────────
FRONTEND_URL=http://localhost:3000
________________________________________
Passo 4 — Inicie o Backend
bash
# Modo desenvolvimento (com hot-reload)
npm run dev

# Modo produção
npm start
Você verá:
text
✅ MongoDB conectado!
🚀 Servidor rodando na porta 5000
________________________________________
Passo 5 — Configure o Frontend
Em outro terminal:
bash
# Volte para a raiz
cd ..

# Entre na pasta do frontend
cd frontend
Abra o arquivo js/api.js e verifique a URL base:
javascript
const API_BASE_URL = 'http://localhost:5000/api';
________________________________________
Passo 6 — Sirva o Frontend
Opção A — VS Code (Live Server):
•	Instale a extensão Live Server
•	Clique com botão direito no index.html → Open with Live Server
Opção B — http-server (Node.js):
bash
npx http-server frontend -p 3000 -o
Opção C — Python (se tiver instalado):
bash
cd frontend
python -m http.server 3000
________________________________________
✅ Pronto!
Acesse: http://localhost:3000
________________________________________
🔑 Como obter as APIs
OpenAI API (Obrigatório)
1.	Acesse platform.openai.com
2.	Crie uma conta ou faça login
3.	Vá em API Keys → Create new secret key
4.	Copie a chave e cole no .env
💡 O modelo usado é o gpt-4o-mini (mais barato). Custo médio: ~$0.01 por verificação.
________________________________________
Google Custom Search API (Opcional)
Sem essa API, o sistema funciona normalmente, mas não exibe fontes externas.
1.	Acesse console.cloud.google.com
2.	Crie um projeto → Ative a Custom Search API
3.	Gere uma API Key em "Credenciais"
4.	Acesse cse.google.com → Crie um mecanismo de busca
5.	Copie o Search Engine ID (cx)
________________________________________
MongoDB Atlas (Opcional — banco na nuvem)
1.	Acesse mongodb.com/atlas
2.	Crie uma conta gratuita (Free Tier — M0)
3.	Crie um cluster → Database Access → crie usuário/senha
4.	Network Access → Add IP → 0.0.0.0/0 (permite qualquer IP)
5.	Connect → Drivers → copie a connection string
6.	Cole no .env substituindo usuario e senha
________________________________________
📡 Documentação da API
Base URL
text
http://localhost:5000/api
________________________________________
🔐 Autenticação
POST /auth/register
Cadastra um novo usuário.
Body:
json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "minhasenha123"
}
Resposta (201):
json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64abc123...",
    "name": "João Silva",
    "email": "joao@email.com",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
________________________________________
POST /auth/login
Autentica um usuário existente.
Body:
json
{
  "email": "joao@email.com",
  "password": "minhasenha123"
}
Resposta (200):
json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64abc123...",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
________________________________________
GET /auth/me
Retorna os dados do usuário autenticado.
Header:
text
Authorization: Bearer <token>
Resposta (200):
json
{
  "success": true,
  "user": {
    "id": "64abc123...",
    "name": "João Silva",
    "email": "joao@email.com",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
________________________________________
🔍 Verificação
POST /check/text
Verifica um texto ou afirmação.
🔓 Não requer autenticação. Se autenticado, salva no histórico.
Header (opcional):
text
Authorization: Bearer <token>
Body:
json
{
  "text": "Luísa Sonza morreu em um acidente de carro"
}
Resposta (200):
json
{
  "success": true,
  "checkId": "64abc456...",
  "shareId": "k7x2m9p",
  "verdict": "FALSO",
  "confidenceScore": 95,
  "summary": "Afirmação sobre morte de Luísa Sonza é falsa.",
  "explanation": "Não há nenhum registro ou evidência...",
  "keyPoints": [
    "Nenhum veículo jornalístico confiável reportou tal evento",
    "A artista tem atividade ativa em redes sociais",
    "Trata-se de um boato sem fundamento"
  ],
  "sources": [
    {
      "title": "Luísa Sonza — Wikipedia",
      "url": "https://pt.wikipedia.org/wiki/Lu%C3%ADsa_Sonza",
      "snippet": "Luísa Sonza é uma cantora e compositora brasileira..."
    }
  ],
  "inputType": "text",
  "inputContent": "Luísa Sonza morreu em um acidente de carro",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
________________________________________
POST /check/url
Verifica uma notícia a partir de uma URL.
🔓 Não requer autenticação. Se autenticado, salva no histórico.
Body:
json
{
  "url": "https://g1.globo.com/noticia-exemplo"
}
Resposta (200):
json
{
  "success": true,
  "checkId": "64abc789...",
  "shareId": "a3b6c9d",
  "verdict": "VERDADEIRO",
  "confidenceScore": 88,
  "summary": "Notícia sobre...",
  "explanation": "A notícia é verdadeira pois...",
  "keyPoints": ["...", "...", "..."],
  "sources": [...],
  "articleTitle": "Título da notícia original",
  "inputType": "url",
  "inputContent": "https://g1.globo.com/noticia-exemplo",
  "createdAt": "2024-01-15T10:35:00.000Z"
}
________________________________________
GET /check/share/:shareId
Busca um resultado pelo ID de compartilhamento.
Exemplo:
text
GET /api/check/share/k7x2m9p
Resposta (200):
json
{
  "success": true,
  "check": {
    "_id": "64abc456...",
    "shareId": "k7x2m9p",
    "verdict": "FALSO",
    "confidenceScore": 95,
    "explanation": "...",
    "sources": [...],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
________________________________________
📋 Histórico
🔒 Todas as rotas abaixo requerem autenticação.
GET /history
Retorna o histórico de verificações do usuário.
Header:
text
Authorization: Bearer <token>
Query Params:
Parâmetro	Tipo	Padrão	Descrição
page	number	1	Página atual
limit	number	10	Itens por página
Exemplo:
text
GET /api/history?page=1&limit=10
Resposta (200):
json
{
  "success": true,
  "checks": [
    {
      "_id": "64abc456...",
      "shareId": "k7x2m9p",
      "inputType": "text",
      "inputContent": "Luísa Sonza morreu...",
      "verdict": "FALSO",
      "confidenceScore": 95,
      "articleTitle": "Afirmação sobre morte de Luísa Sonza é falsa.",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
________________________________________
DELETE /history/:id
Remove um item do histórico.
Header:
text
Authorization: Bearer <token>
Resposta (200):
json
{
  "success": true,
  "message": "Removido do histórico."
}
________________________________________
❌ Erros Comuns
Código	Mensagem	Causa
400	Texto muito curto para análise	Texto com menos de 5 chars
400	URL inválida	URL malformada
401	Token inválido ou expirado	JWT inválido
404	Verificação não encontrada	shareId inexistente
429	Muitas requisições	Rate limit atingido (50/15min)
500	Erro ao verificar texto	Erro na API OpenAI
________________________________________
🖥️ Telas do Sistema
Tela	Arquivo	Descrição
🏠 Home	index.html	Pesquisa principal + features
🔍 Resultado	result.html	Exibe análise completa
🕓 Histórico	history.html	Lista de verificações do usuário
🔑 Login	login.html	Autenticação do usuário
📝 Cadastro	register.html	Criação de nova conta
________________________________________
🔒 Segurança
•	✅ Senhas com bcrypt (salt 12)
•	✅ Autenticação via JWT (expira em 7 dias)
•	✅ Helmet.js para headers HTTP seguros
•	✅ Rate limiting para evitar abuso (50 req/15min)
•	✅ CORS configurado por domínio
•	✅ Variáveis sensíveis em .env
•	✅ Validação de inputs no backend
•	✅ Middleware de autenticação opcional nas rotas públicas
________________________________________
🧪 Testando a API
Com Thunder Client (VS Code)
1.	Instale a extensão Thunder Client
2.	Importe a collection em /docs/thunder-collection.json
Com cURL
bash
# Testar saúde do servidor
curl http://localhost:5000/api/health

# Verificar um texto
curl -X POST http://localhost:5000/api/check/text \
  -H "Content-Type: application/json" \
  -d '{"text": "A terra é plana"}'

# Registrar usuário
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@email.com","password":"123456"}'
________________________________________
🚀 Deploy
Backend — Railway / Render
1.	Crie conta em railway.app ou render.com
2.	Conecte seu repositório GitHub
3.	Configure as variáveis de ambiente (mesmo conteúdo do .env)
4.	Deploy automático ao fazer push na main
Frontend — Vercel / Netlify
1.	Crie conta em vercel.com ou netlify.com
2.	Faça upload da pasta frontend/
3.	Atualize js/api.js com a URL do backend em produção:
javascript
const API_BASE_URL = 'https://seu-backend.railway.app/api';
________________________________________
📝 Variáveis de Ambiente — Referência Completa
Variável	Obrigatório	Descrição	Exemplo
PORT	✅	Porta do servidor	5000
MONGODB_URI	✅	String de conexão MongoDB	mongodb://localhost:27017/...
JWT_SECRET	✅	Chave secreta para tokens	minha_chave_secreta_2024
OPENAI_API_KEY	✅	Chave da API OpenAI	sk-...
GOOGLE_API_KEY	⚠️	Chave da API Google Search	AIza...
GOOGLE_CSE_ID	⚠️	ID do mecanismo de busca	abc123...
FRONTEND_URL	✅	URL do frontend (CORS)	http://localhost:3000
________________________________________
🤝 Contribuição
1.	Fork o projeto
2.	Crie sua branch: git checkout -b feature/minha-feature
3.	Commit suas mudanças: git commit -m 'feat: adiciona minha feature'
4.	Push para a branch: git push origin feature/minha-feature
5.	Abra um Pull Request
Padrão de commits
text
feat:     nova funcionalidade
fix:      correção de bug
docs:     alteração na documentação
style:    formatação (sem mudança de lógica)
refactor: refatoração de código
test:     adição de testes
chore:    tarefas de manutenção
________________________________________
👥 Equipe
Nome	RGM	Função
[Wallace Coimbra]	[42289238]	Fullstack Developer
[Mateus Sepulvida ]	[44709170]	Fullstack Developer
[Javier Penalver ]	[45879885]	FRONT END Developer
________________________________________
📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
________________________________________
🙏 Agradecimentos
•	OpenAI pela API de IA
•	MongoDB pelo banco de dados
•	Google pela Custom Search API
•	Professores e orientadores do curso
