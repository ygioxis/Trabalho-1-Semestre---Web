const EMAIL_ADMIN = 'admin@futnews.com';
let idParaExcluir = null;

window.addEventListener('load', function () {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuario || usuario.email !== EMAIL_ADMIN) {
        alert('Acesso restrito! Faça login como administrador.');
        window.location.href = 'login.html';
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

    let noticias = JSON.parse(localStorage.getItem('noticias')) || [];

    if (id) {
        noticias = noticias.map(n => n.id == id
            ? { id: Number(id), titulo, categoria, conteudo, imagem, data: n.data }
            : n
        );
        mostrarToast('Notícia atualizada com sucesso!');
    } else {
        noticias.unshift({ id: Date.now(), titulo, categoria, conteudo, imagem, data: new Date().toLocaleDateString('pt-BR') });
        mostrarToast('Notícia publicada com sucesso!');
    }

    localStorage.setItem('noticias', JSON.stringify(noticias));
    limparForm();
    carregarAdmin();
}

function limparForm() {
    document.getElementById('noticia-id').value = '';
    document.getElementById('noticia-titulo').value = '';
    document.getElementById('noticia-conteudo').value = '';
    document.getElementById('noticia-imagem').value = '';
    document.getElementById('titulo-form').textContent = 'Nova Notícia';
    document.getElementById('noticia-categoria').value = 'Brasileirão';
    document.getElementById('btn-salvar').textContent = '✅ Publicar';
}

function carregarAdmin() {
    const lista = document.getElementById('lista-admin');
    if (!lista) return;

    const noticias = JSON.parse(localStorage.getItem('noticias')) || [];

    if (noticias.length === 0) {
        lista.innerHTML = '<p class="text-muted">Nenhuma notícia cadastrada ainda.</p>';
        return;
    }

    lista.innerHTML = noticias.map(n => `
        <div class="card mb-3 p-3">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                    <strong>${n.titulo}</strong>
                    <span class="badge bg-success ms-2">${n.categoria}</span>
                    ${n.data ? `<small class="text-muted ms-2">${n.data}</small>` : ''}
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-warning" onclick="editarNoticia(${n.id})">✏️ Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="confirmarExclusao(${n.id})">🗑️ Excluir</button>
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
    document.getElementById('titulo-form').textContent = '✏️ Editando Notícia';
    document.getElementById('btn-salvar').textContent = '💾 Salvar alterações';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function confirmarExclusao(id) {
    idParaExcluir = id;
    const modal = new bootstrap.Modal(document.getElementById('modalExcluir'));
    modal.show();
}

function mostrarToast(msg) {
    const div = document.getElementById('toast-msg');
    if (!div) return;
    div.textContent = msg;
    div.style.display = 'block';
    div.style.opacity = '1';
    setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.style.display = 'none', 400); }, 2500);
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnConfirmarExcluir').addEventListener('click', function () {
        let noticias = JSON.parse(localStorage.getItem('noticias')) || [];
        noticias = noticias.filter(n => n.id !== idParaExcluir);
        localStorage.setItem('noticias', JSON.stringify(noticias));
        bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();
        carregarAdmin();
        mostrarToast('Notícia excluída.');
    });

    carregarAdmin();
});
