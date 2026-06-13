async function buscarNoticiasAPI() {
    const url = `https://newsdata.io/api/1/news?apikey=${encodeURIComponent(CONFIG.API_KEY)}&q=futebol&language=pt`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        return dados.results || [];
    } catch (erro) {
        console.error('Erro ao buscar notícias:', erro);
        return [];
    }
}

async function carregarNoticiasAPI() {
    const lista = document.getElementById('lista-noticias-api');
    if (!lista) return;

    lista.innerHTML = '<p class="text-muted">Carregando notícias...</p>';

    const artigos = await buscarNoticiasAPI();

    if (artigos.length === 0) {
        lista.innerHTML = '<p class="text-muted">Nenhuma notícia encontrada.</p>';
        return;
    }

    lista.innerHTML = artigos.map(a => {
        const imgUrl = sanitizeURL(a.image_url);
        const linkUrl = sanitizeURL(a.link);
        const title = escapeHTML(a.title);
        const desc = escapeHTML(a.description ? a.description.substring(0, 80) + '...' : '');

        return `
        <div class="col-12 col-md-4 mb-4">
            <div class="card h-100">
                ${imgUrl ? `<img src="${imgUrl}" class="card-img-top" style="height:180px;object-fit:cover" alt="noticia">` : ''}
                <div class="card-body">
                    <span class="badge bg-success mb-2">Futebol</span>
                    <h6 class="card-title">${title}</h6>
                    <p class="card-text small">${desc}</p>
                    ${linkUrl ? `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-success btn-sm">Ler mais</a>` : ''}
                </div>
            </div>
        </div>
    `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', carregarNoticiasAPI);
