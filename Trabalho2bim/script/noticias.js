// Carrega notícias na tela
function carregarNoticias(filtro = '') {
    const lista = document.getElementById('lista-noticias');
    if (!lista) return;

    let noticias = JSON.parse(localStorage.getItem('noticias')) || [];

    // Filtra se tiver filtro
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

    // Monta os cards
    lista.innerHTML = noticias.map(n => `
    <div class="col-12 col-md-6 mb-4">
        <div class="card h-100">
            <div class="card-body">
                <span class="badge bg-success mb-2">${n.categoria}</span>
                <h5 class="card-title">${n.titulo}</h5>
                <p class="card-text">${n.conteudo.substring(0, 100)}...</p>
                <a href="noticia.html?id=${n.id}" class="btn btn-success btn-sm mt-2">Ler mais</a>
            </div>
        </div>
    </div>
`).join('');
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

// Carrega ao abrir a página
document.addEventListener('DOMContentLoaded', function () {
    carregarNoticias();
});