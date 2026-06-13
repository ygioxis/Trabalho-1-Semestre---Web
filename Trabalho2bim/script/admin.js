let idParaExcluir = null;

window.addEventListener('load', function () {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuario || usuario.role !== 'admin') {
        alert('Acesso restrito!');
        window.location.href = 'index.html';
    }
});

function salvarNoticia() {
    const id = document.getElementById('noticia-id').value;
    const titulo = document.getElementById('noticia-titulo').value.trim();
    const categoria = document.getElementById('noticia-categoria').value;
    const conteudo = document.getElementById('noticia-conteudo').value.trim();
    const imagem = document.getElementById('noticia-imagem').value.trim();

    if (!titulo || !conteudo) {
        alert('Preencha o título e o conteúdo.');
        return;
    }

    if (imagem && !sanitizeURL(imagem)) {
        alert('URL da imagem inválida. Use uma URL http ou https.');
        return;
    }

    let noticias = JSON.parse(localStorage.getItem('noticias')) || [];

    if (id) {
        noticias = noticias.map(n => n.id == id ? { id: Number(id), titulo, categoria, conteudo, imagem } : n);
    } else {
        noticias.push({ id: Date.now(), titulo, categoria, conteudo, imagem });
    }

    localStorage.setItem('noticias', JSON.stringify(noticias));
    limparForm();
    carregarAdmin();
}

function limparForm() {
    document.getElementById('noticia-id').value = '';
    document.getElementById('noticia-titulo').value = '';
    document.getElementById('noticia-conteudo').value = '';
    document.getElementById('titulo-form').textContent = 'Nova Notícia';
    document.getElementById('noticia-imagem').value = '';
}

function carregarAdmin() {
    const lista = document.getElementById('lista-admin');
    if (!lista) return;

    const noticias = JSON.parse(localStorage.getItem('noticias')) || [];

    if (noticias.length === 0) {
        lista.innerHTML = '<p class="text-muted">Nenhuma notícia cadastrada.</p>';
        return;
    }

    lista.innerHTML = noticias.map(n => `
        <div class="card mb-3 p-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${escapeHTML(n.titulo)}</strong>
                    <span class="badge bg-success ms-2">${escapeHTML(n.categoria)}</span>
                </div>
                <div>
                    <button class="btn btn-sm btn-warning me-2" onclick="editarNoticia(${Number(n.id)})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="confirmarExclusao(${Number(n.id)})">Excluir</button>
                </div>
            </div>
        </div>
    `).join('');
}

function editarNoticia(id) {
    const noticias = JSON.parse(localStorage.getItem('noticias')) || [];
    const noticia = noticias.find(n => n.id === id);
    if (!noticia) return;

    document.getElementById('noticia-id').value = noticia.id;
    document.getElementById('noticia-titulo').value = noticia.titulo;
    document.getElementById('noticia-categoria').value = noticia.categoria;
    document.getElementById('noticia-conteudo').value = noticia.conteudo;
    document.getElementById('noticia-imagem').value = noticia.imagem || '';
    document.getElementById('titulo-form').textContent = 'Editando Notícia';

    window.scrollTo(0, 0);
}

function confirmarExclusao(id) {
    idParaExcluir = id;
    const modal = new bootstrap.Modal(document.getElementById('modalExcluir'));
    modal.show();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnConfirmarExcluir').addEventListener('click', function () {
        let noticias = JSON.parse(localStorage.getItem('noticias')) || [];
        noticias = noticias.filter(n => n.id !== idParaExcluir);
        localStorage.setItem('noticias', JSON.stringify(noticias));
        bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();
        carregarAdmin();
    });

    carregarAdmin();
});
