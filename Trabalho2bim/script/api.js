async function buscarNoticiasAPI() {
    const API_KEY = 'pub_84dd4091276b41a980903198b50d5238';
    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=futebol&language=pt`;

    try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status}: ${resposta.statusText}`);
        }

        const dados = await resposta.json();
        return dados.results || [];
    } catch (erro) {
        console.error('Erro ao buscar notícias:', erro);
        throw erro;
    }
}

async function carregarNoticiasAPI() {
    const lista = document.getElementById('lista-noticias-api');
    if (!lista) return;

    lista.innerHTML = '<p class="text-muted">Carregando notícias...</p>';

    try {
        const artigos = await buscarNoticiasAPI();

        if (artigos.length === 0) {
            lista.innerHTML = '<p class="text-muted">Nenhuma notícia encontrada.</p>';
            return;
        }

        lista.innerHTML = artigos.map(a => `
            <div class="col-12 col-md-4 mb-4">
                <div class="card h-100">
                    ${a.image_url ? `<img src="${a.image_url}" class="card-img-top" style="height:180px;object-fit:cover" alt="noticia">` : ''}
                    <div class="card-body">
                        <span class="badge bg-success mb-2">Futebol</span>
                        <h6 class="card-title">${a.title}</h6>
                        <p class="card-text small">${a.description ? a.description.substring(0, 80) + '...' : ''}</p>
                        <a href="${a.link}" target="_blank" class="btn btn-success btn-sm">Ler mais</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (erro) {
        lista.innerHTML = '<p class="text-danger">Erro ao carregar notícias. Tente novamente mais tarde.</p>';
    }
}

document.addEventListener('DOMContentLoaded', carregarNoticiasAPI);
