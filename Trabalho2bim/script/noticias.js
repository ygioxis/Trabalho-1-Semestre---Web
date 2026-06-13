function imagemNoticia(noticia) {
    if (noticia.imagem) return sanitizeURL(noticia.imagem);
    const imagens = {
        'Brasileirão': 'https://placehold.co/600x200/1a3a5c/white?text=Brasileirao+2025',
        'Champions League': 'https://placehold.co/600x200/1a1a5c/white?text=Champions+League',
        'Seleção': 'https://placehold.co/600x200/1a5c2a/white?text=Selecao+Brasileira'
    };
    return imagens[noticia.categoria] || 'https://placehold.co/600x200/1a73e8/white?text=FutNews';
}

function montarCard(n) {
    const imgSrc = imagemNoticia(n);
    return `
        <div class="col-12 col-md-4 mb-4">
            <div class="card h-100">
                ${imgSrc ? `<img src="${imgSrc}" class="card-img-top" alt="${escapeHTML(n.categoria)}" style="height:160px;object-fit:cover;">` : ''}
                <div class="card-body">
                    <span class="badge bg-success mb-2">${escapeHTML(n.categoria)}</span>
                    <h5 class="card-title">${escapeHTML(n.titulo)}</h5>
                    <p class="card-text">${escapeHTML(n.conteudo.substring(0, 100))}...</p>
                    <a href="noticia.html?id=${Number(n.id)}" class="btn btn-success btn-sm mt-2">Ler mais</a>
                </div>
            </div>
        </div>
    `;
}

function carregarNoticias(filtro = '') {
    const lista = document.getElementById('lista-noticias');
    if (!lista) return;

    let noticias = JSON.parse(localStorage.getItem('noticias')) || [];

    if (filtro) {
        noticias = noticias.filter(n =>
            n.categoria === filtro ||
            n.titulo.toLowerCase().includes(filtro.toLowerCase())
        );
    }

    if (noticias.length === 0) {
        lista.innerHTML = '<p class="text-muted">Nenhuma notícia encontrada.</p>';
        return;
    }

    lista.innerHTML = noticias.map(n => montarCard(n)).join('');
}

function buscarNoticias() {
    const termo = document.getElementById('campoBusca').value;
    carregarNoticias(termo);
}

function filtrarCategoria(categoria) {
    carregarNoticias(categoria);
}

function carregarHome() {
    const noticias = JSON.parse(localStorage.getItem('noticias')) || [];
    if (noticias.length === 0) return;

    const barra = document.getElementById('barra-noticias');
    if (barra) {
        barra.textContent = noticias.map(n => `⚽ ${n.titulo}`).join('   •   ');
    }

    const destaque = document.getElementById('noticia-destaque');
    if (destaque) {
        const n = noticias[0];
        const imgSrc = imagemNoticia(n);
        destaque.innerHTML = `
            <div class="destaque-card">
                ${imgSrc ? `<img src="${imgSrc}" alt="destaque" style="background:#1a1a1a;">` : ''}
                <div class="destaque-info">
                    <span class="badge bg-success mb-3" style="width:fit-content">${escapeHTML(n.categoria)}</span>
                    <h3>${escapeHTML(n.titulo)}</h3>
                    <p>${escapeHTML(n.conteudo.substring(0, 150))}...</p>
                    <a href="noticia.html?id=${Number(n.id)}" class="btn btn-success">Ler notícia completa</a>
                </div>
            </div>
        `;
    }

    const categorias = {
        'Brasileirão': 'noticias-brasileirao',
        'Champions League': 'noticias-champions',
        'Seleção': 'noticias-selecao'
    };

    for (const [cat, id] of Object.entries(categorias)) {
        const div = document.getElementById(id);
        if (!div) continue;
        const filtradas = noticias.filter(n => n.categoria === cat);
        if (filtradas.length === 0) {
            div.innerHTML = '<p class="text-muted col-12">Nenhuma notícia nessa categoria.</p>';
        } else {
            div.innerHTML = filtradas.map(n => montarCard(n)).join('');
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    carregarNoticias();
    carregarHome();
});
