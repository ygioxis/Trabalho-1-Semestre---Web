let idParaExcluir = null;

// Salvar ou editar notícia
function salvarNoticia() {
    const id = document.getElementById('noticia-id').value;
    const titulo = document.getElementById('noticia-titulo').value.trim();
    const categoria = document.getElementById('noticia-categoria').value;
    const conteudo = document.getElementById('noticia-conteudo').value.trim();

    if (!titulo || !conteudo) {
        alert('Preencha o título e o conteúdo.');
        return;
    }

    let noticias = JSON.parse(localStorage.getItem('noticias')) || [];

    if (id) {
        // Editar notícia existente
        noticias = noticias.map(n => n.id == id ? { id: Number(id), titulo, categoria, conteudo } : n);
    } else {
        // Nova notícia
        noticias.push({ id: Date.now(), titulo, categoria, conteudo });
    }

    localStorage.setItem('noticias', JSON.stringify(noticias));
    limparForm();
    carregarAdmin();
}

// Limpa o formulário
function limparForm() {
    document.getElementById('noticia-id').value = '';
    document.getElementById('noticia-titulo').value = '';
    document.getElementById('noticia-conteudo').value = '';
    document.getElementById('titulo-form').textContent = 'Nova Notícia';
}

// Carrega lista de notícias no admin
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
                    <strong>${n.titulo}</strong>
                    <span class="badge bg-success ms-2">${n.categoria}</span>
                </div>
                <div>
                    <button class="btn btn-sm btn-warning me-2" onclick="editarNoticia(${n.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="confirmarExclusao(${n.id})">Excluir</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Preenche formulário para editar
function editarNoticia(id) {
    const noticias = JSON.parse(localStorage.getItem('noticias')) || [];
    const noticia = noticias.find(n => n.id === id);
    if (!noticia) return;

    document.getElementById('noticia-id').value = noticia.id;
    document.getElementById('noticia-titulo').value = noticia.titulo;
    document.getElementById('noticia-categoria').value = noticia.categoria;
    document.getElementById('noticia-conteudo').value = noticia.conteudo;
    document.getElementById('titulo-form').textContent = 'Editando Notícia';

    window.scrollTo(0, 0);
}

// Abre modal de confirmação
function confirmarExclusao(id) {
    idParaExcluir = id;
    const modal = new bootstrap.Modal(document.getElementById('modalExcluir'));
    modal.show();
}

// Executa a exclusão
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