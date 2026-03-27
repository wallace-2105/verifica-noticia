document.addEventListener('DOMContentLoaded', async () => {
  auth.updateNavbar();
 
  const urlParams = new URLSearchParams(window.location.search);
  const shareId = urlParams.get('id');
  const cached = sessionStorage.getItem('vn_result');
 
  let result = null;
 
  if (cached) {
    result = JSON.parse(cached);
    sessionStorage.removeItem('vn_result');
  } else if (shareId) {
    try {
      const data = await api.getByShareId(shareId);
      result = data.check;
    } catch (e) {
      document.getElementById('resultPage').innerHTML =
        `<div class="empty-state"><div class="empty-icon">😕</div><h3>Resultado não encontrado</h3><p>O link pode ter expirado.</p><a href="index.html" class="btn btn-primary">Verificar nova notícia</a></div>`;
      return;
    }
  }
 
  if (!result) {
    window.location.href = 'index.html';
    return;
  }
 
  renderResult(result);
});
 
function getVerdictClass(verdict) {
  if (verdict === 'VERDADEIRO') return 'verdict-true';
  if (verdict === 'FALSO') return 'verdict-false';
  if (verdict === 'PARCIALMENTE VERDADEIRO') return 'verdict-partial';
  return 'verdict-inconclusive';
}
 
function getVerdictIcon(verdict) {
  if (verdict === 'VERDADEIRO') return '✅';
  if (verdict === 'FALSO') return '❌';
  if (verdict === 'PARCIALMENTE VERDADEIRO') return '⚠️';
  return '❓';
}
 
function renderResult(result) {
  const verdictClass = getVerdictClass(result.verdict);
  const icon = getVerdictIcon(result.verdict);
  const shareUrl = `${window.location.origin}/result.html?id=${result.shareId}`;
  const date = new Date(result.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });}