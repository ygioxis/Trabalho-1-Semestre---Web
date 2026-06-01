// Imagem por categoria
function imagemCategoria(categoria) {
    const imagens = {
        'Brasileirão': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Brasileirao_Serie_A_logo.png/250px-Brasileirao_Serie_A_logo.png',
        'Champions League': 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/UEFA_Champions_League_logo_2.svg/250px-UEFA_Champions_League_logo_2.svg.png',
        'Seleção': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_Brazil.svg/320px-Flag_of_Brazil.svg.png'
    };
    return imagens[categoria] || 'https://placehold.co/400x200/1a73e8/white?text=FutNews';
}
// Monta um card simples
function montarCard(n) {
    return `
        <div class="col-12 col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <span class="badge bg-success mb-2">${n.categoria}</span>
                    <h5 class="card-title">${n.titulo}</h5>
                    <p class="card-text">${n.conteudo.substring(0, 100)}...</p>
                    <a href="noticia.html?id=${n.id}" class="btn btn-success btn-sm mt-2">Ler mais</a>
                </div>
            </div>
        </div>
    `;
}

// Carrega notícias na página de notícias
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

// Busca por palavra-chave
function buscarNoticias() {
    const termo = document.getElementById('campoBusca').value;
    carregarNoticias(termo);
}

// Filtra por categoria
function filtrarCategoria(categoria) {
    carregarNoticias(categoria);
}

// Carrega a home com destaque, categorias e barra rolante
function carregarHome() {
    const noticias = JSON.parse(localStorage.getItem('noticias')) || [];
    if (noticias.length === 0) return;

    // Barra rolante
    const barra = document.getElementById('barra-noticias');
    if (barra) {
        barra.textContent = noticias.map(n => `⚽ ${n.titulo}`).join('   •   ');
    }

    // Notícia destaque (primeira)
    const destaque = document.getElementById('noticia-destaque');
    if (destaque) {
        const n = noticias[0];
        destaque.innerHTML = `
    <div class="destaque-card">
        <img src="${imagemCategoria(n.categoria)}" alt="destaque" style="background:#1a1a1a;padding:20px;">
                <div class="destaque-info">
                    <span class="badge bg-success mb-3" style="width:fit-content">${n.categoria}</span>
                    <h3>${n.titulo}</h3>
                    <p>${n.conteudo.substring(0, 150)}...</p>
                    <a href="noticia.html?id=${n.id}" class="btn btn-success">Ler notícia completa</a>
                </div>
            </div>
        `;
    }

    // Notícias por categoria
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