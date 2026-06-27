let categoriaAtiva = '';

function imagemNoticia(noticia) {
    if (noticia.imagem) return noticia.imagem;
    const imagens = {
        'Brasileirão': 'https://placehold.co/600x200/1a3a5c/white?text=Brasileirao+2025',
        'Champions League': 'https://placehold.co/600x200/1a1a5c/white?text=Champions+League',
        'Seleção': 'https://placehold.co/600x200/1a5c2a/white?text=Selecao+Brasileira'
    };
    return imagens[noticia.categoria] || 'https://placehold.co/600x200/c0392b/white?text=FutNews';
}

function montarCard(n) {
    return `
        <div class="col-12 col-md-4 mb-4">
            <div class="card h-100">
                <img src="${imagemNoticia(n)}" class="card-img-top" alt="${n.categoria}" style="height:160px;object-fit:cover;" onerror="this.src='https://placehold.co/600x200/c0392b/white?text=FutNews'">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-success mb-2" style="width:fit-content">${n.categoria}</span>
                    <h5 class="card-title">${n.titulo}</h5>
                    <p class="card-text">${n.conteudo.substring(0, 100)}...</p>
                    <a href="noticia.html?id=${n.id}" class="btn btn-success btn-sm mt-auto">Ler mais</a>
                </div>
            </div>
        </div>
    `;
}

function carregarNoticias(termoBusca = '', categoria = '') {
    const lista = document.getElementById('lista-noticias');
    if (!lista) return;

    let noticias = JSON.parse(localStorage.getItem('noticias')) || [];

    if (categoria) {
        noticias = noticias.filter(n => n.categoria === categoria);
    }

    if (termoBusca) {
        const t = termoBusca.toLowerCase();
        noticias = noticias.filter(n =>
            n.titulo.toLowerCase().includes(t) ||
            n.conteudo.toLowerCase().includes(t) ||
            n.categoria.toLowerCase().includes(t)
        );
    }

    if (noticias.length === 0) {
        lista.innerHTML = '<p class="text-muted col-12">Nenhuma notícia encontrada.</p>';
    } else {
        lista.innerHTML = noticias.map(n => montarCard(n)).join('');
    }

    document.querySelectorAll('.cat-item').forEach(el => {
        el.classList.toggle('ativo', el.dataset.cat === categoria);
    });
}

function buscarNoticias() {
    const termo = document.getElementById('campoBusca').value.trim();
    categoriaAtiva = '';
    carregarNoticias(termo, '');
    document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('ativo'));
}

function filtrarCategoria(categoria) {
    categoriaAtiva = categoria;
    document.getElementById('campoBusca').value = '';
    carregarNoticias('', categoria);
}

function carregarHome() {
    const noticias = JSON.parse(localStorage.getItem('noticias')) || [];

    const barra = document.getElementById('barra-noticias');
    if (barra) {
        if (noticias.length === 0) {
            barra.textContent = '⚽ Seja bem-vindo ao FutNews! Cadastre notícias no painel Admin.';
        } else {
            barra.textContent = noticias.map(n => `⚽ ${n.titulo}`).join('   •   ');
        }
    }

    const destaque = document.getElementById('noticia-destaque');
    if (destaque) {
        if (noticias.length === 0) {
            destaque.innerHTML = '<p class="text-muted">Nenhuma notícia cadastrada ainda. <a href="admin.html" class="text-danger">Clique aqui</a> para adicionar.</p>';
        } else {
            const n = noticias[0];
            destaque.innerHTML = `
                <div class="destaque-card">
                    <img src="${imagemNoticia(n)}" alt="destaque" onerror="this.src='https://placehold.co/600x400/c0392b/white?text=FutNews'">
                    <div class="destaque-info">
                        <span class="badge bg-success mb-3" style="width:fit-content">${n.categoria}</span>
                        <h3>${n.titulo}</h3>
                        <p>${n.conteudo.substring(0, 180)}...</p>
                        <a href="noticia.html?id=${n.id}" class="btn btn-success">Ler notícia completa</a>
                    </div>
                </div>
            `;
        }
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
            div.innerHTML = filtradas.slice(0, 3).map(n => montarCard(n)).join('');
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const campoBusca = document.getElementById('campoBusca');
    if (campoBusca) {
        campoBusca.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') buscarNoticias();
        });
    }

    carregarNoticias();
    carregarHome();
});
