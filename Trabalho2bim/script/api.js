async function buscarNoticiasAPI() {
    const API_KEY = 'pub_84dd4091276b41a980903198b50d5238';
    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=futebol&language=pt`;

    try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => null);
            console.error('Erro da API:', resposta.status, erro);
            return { erro: true, status: resposta.status, mensagem: erro?.results?.message || 'Erro desconhecido' };
        }

        const dados = await resposta.json();
        return { erro: false, artigos: dados.results || [] };
    } catch (erro) {
        console.error('Erro ao buscar notícias:', erro);
        return { erro: true, status: 0, mensagem: erro.message };
    }
}

async function carregarNoticiasAPI() {
    const lista = document.getElementById('lista-noticias-api');
    if (!lista) return;

    lista.innerHTML = '<p class="text-muted">Carregando notícias...</p>';

    const resultado = await buscarNoticiasAPI();

    if (resultado.erro) {
        let mensagemAmigavel = 'Não foi possível carregar as notícias ao vivo agora.';

        if (resultado.status === 429) {
            mensagemAmigavel = 'Limite diário de requisições da API foi atingido. Tente novamente mais tarde.';
        } else if (resultado.status === 401 || resultado.status === 403) {
            mensagemAmigavel = 'Chave da API inválida ou sem permissão.';
        } else if (resultado.status === 0) {
            mensagemAmigavel = 'Erro de conexão. Verifique sua internet.';
        }

        lista.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning">
                    <strong>⚠️ ${mensagemAmigavel}</strong>
                    <p class="mb-0 small text-muted mt-2">Detalhe técnico: ${resultado.mensagem} (status ${resultado.status})</p>
                </div>
            </div>
        `;
        return;
    }

    const artigos = resultado.artigos;

    if (artigos.length === 0) {
        lista.innerHTML = '<p class="text-muted">Nenhuma notícia encontrada.</p>';
        return;
    }

    lista.innerHTML = artigos.map(a => `
        <div class="col-12 col-md-4 mb-4">
            <div class="card h-100">
                ${a.image_url ? `<img src="${a.image_url}" class="card-img-top" style="height:180px;object-fit:cover" alt="noticia" onerror="this.style.display='none'">` : ''}
                <div class="card-body">
                    <span class="badge bg-success mb-2">Futebol</span>
                    <h6 class="card-title">${a.title}</h6>
                    <p class="card-text small">${a.description ? a.description.substring(0, 80) + '...' : ''}</p>
                    <a href="${a.link}" target="_blank" class="btn btn-success btn-sm">Ler mais</a>
                </div>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', carregarNoticiasAPI);