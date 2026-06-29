const CATEGORIAS_API = {
    'Todos': 'futebol',
    'Brasileirão': 'brasileirao',
    'Champions League': 'champions league',
    'Seleção': 'seleção brasileira'
};

let categoriaAPIAtiva = 'Todos';

async function buscarNoticiasAPI(query) {
    const API_KEY = 'pub_84dd4091276b41a980903198b50d5238';
    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=football OR futebol OR "liga" OR "campeonato"&language=pt&category=sports`;
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => null);
            return { erro: true, status: resposta.status, mensagem: erro?.results?.message || 'Erro desconhecido' };
        }
        const dados = await resposta.json();
        return { erro: false, artigos: dados.results || [] };
    } catch (erro) {
        return { erro: true, status: 0, mensagem: erro.message };
    }
}

async function carregarNoticiasAPI(categoria = 'Todos') {
    categoriaAPIAtiva = categoria;
    const lista = document.getElementById('lista-noticias-api');
    if (!lista) return;

    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.classList.toggle('ativo', btn.dataset.cat === categoria);
    });

    lista.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-danger" role="status"></div>
            <p class="mt-3 text-muted">Carregando notícias...</p>
        </div>
    `;

    const query = CATEGORIAS_API[categoria] || 'futebol';
    const resultado = await buscarNoticiasAPI(query);

    if (resultado.erro) {
        let msg = 'Não foi possível carregar as notícias ao vivo.';
        if (resultado.status === 429) msg = 'Limite diário da API atingido. Tente novamente amanhã.';
        else if (resultado.status === 401 || resultado.status === 403) msg = 'Chave da API inválida.';
        else if (resultado.status === 0) msg = 'Erro de conexão. Verifique sua internet.';

        lista.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning d-flex gap-3 align-items-start">
                    <span style="font-size:1.5rem">⚠️</span>
                    <div>
                        <strong>${msg}</strong>
                        <p class="mb-0 small text-muted mt-1">Detalhe: ${resultado.mensagem} (status ${resultado.status})</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    const artigos = resultado.artigos.filter(a => a.title && a.link);

    if (artigos.length === 0) {
        lista.innerHTML = '<p class="text-muted col-12">Nenhuma notícia encontrada para esta categoria.</p>';
        return;
    }

    lista.innerHTML = artigos.map(a => `
        <div class="col-12 col-md-4 mb-4">
            <div class="card h-100">
                ${a.image_url
                    ? `<img src="${a.image_url}" class="card-img-top" style="height:180px;object-fit:cover" alt="noticia" onerror="this.style.display='none'">`
                    : `<div style="height:180px;background:linear-gradient(135deg,#1a1a1a,#2a0000);display:flex;align-items:center;justify-content:center;font-size:2.5rem;">⚽</div>`
                }
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-success mb-2" style="width:fit-content">${categoria !== 'Todos' ? categoria : 'Futebol'}</span>
                    <h6 class="card-title flex-grow-1">${a.title}</h6>
                    <p class="card-text small">${a.description ? a.description.substring(0, 100) + '...' : 'Clique para ler a notícia completa.'}</p>
                    <a href="${a.link}" target="_blank" rel="noopener noreferrer" class="btn btn-success btn-sm mt-auto">Ler mais ↗</a>
                </div>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', function () {
    const containerFiltros = document.getElementById('filtros-api');
    if (containerFiltros) {
        containerFiltros.innerHTML = Object.keys(CATEGORIAS_API).map(cat => `
            <button class="filtro-btn ${cat === 'Todos' ? 'ativo' : ''}" data-cat="${cat}" onclick="carregarNoticiasAPI('${cat}')">
                ${cat === 'Todos' ? '⚽ Todos' : cat === 'Brasileirão' ? '🇧🇷 Brasileirão' : cat === 'Champions League' ? '🏆 Champions' : '🌍 Seleção'}
            </button>
        `).join('');
    }

    carregarNoticiasAPI('Todos');
});
