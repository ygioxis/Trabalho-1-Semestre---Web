let idParaExcluir = null;

// Bloqueia acesso de nao admins
window.addEventListener('load', function () {
    const usuario = getUsuarioLogado();

    if (!isAdmin(usuario)) {
        alert('Acesso restrito!');
        window.location.href = 'index.html';
    }
});

// Salvar ou editar noticia
function salvarNoticia() {
    const id = document.getElementById('noticia-id').value;
    const titulo = document.getElementById('noticia-titulo').value.trim();
    const categoria = document.getElementById('noticia-categoria').value;
    const conteudo = document.getElementById('noticia-conteudo').value.trim();
    const imagem = document.getElementById('noticia-imagem').value.trim();

    if (!titulo || !conteudo) {
        alert('Preencha o titulo e o conteudo.');
        return;
    }

    let noticias = getNoticias();

    if (id) {
        noticias = noticias.map(n => n.id == id ? { id: Number(id), titulo, categoria, conteudo, imagem } : n);
    } else {
        noticias.push({ id: Date.now(), titulo, categoria, conteudo, imagem });
    }

    saveNoticias(noticias);
    limparForm();
    carregarAdmin();
}

// Limpa o formulario
function limparForm() {
    document.getElementById('noticia-id').value = '';
    document.getElementById('noticia-titulo').value = '';
    document.getElementById('noticia-conteudo').value = '';
    document.getElementById('titulo-form').textContent = 'Nova Noticia';
    document.getElementById('noticia-imagem').value = '';
}

// Carrega lista de noticias no admin
function carregarAdmin() {
    const lista = document.getElementById('lista-admin');
    if (!lista) return;

    const noticias = getNoticias();

    if (noticias.length === 0) {
        lista.innerHTML = mensagemVazia('Nenhuma noticia cadastrada.');
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

// Preenche formulario para editar
function editarNoticia(id) {
    const noticias = getNoticias();
    const noticia = noticias.find(n => n.id === id);
    if (!noticia) return;

    document.getElementById('noticia-id').value = noticia.id;
    document.getElementById('noticia-titulo').value = noticia.titulo;
    document.getElementById('noticia-categoria').value = noticia.categoria;
    document.getElementById('noticia-conteudo').value = noticia.conteudo;
    document.getElementById('noticia-imagem').value = noticia.imagem || '';
    document.getElementById('titulo-form').textContent = 'Editando Noticia';

    window.scrollTo(0, 0);
}

// Abre modal de confirmacao
function confirmarExclusao(id) {
    idParaExcluir = id;
    const modal = new bootstrap.Modal(document.getElementById('modalExcluir'));
    modal.show();
}

// Executa a exclusao
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnConfirmarExcluir').addEventListener('click', function () {
        let noticias = getNoticias();
        noticias = noticias.filter(n => n.id !== idParaExcluir);
        saveNoticias(noticias);
        bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();
        carregarAdmin();
    });

    carregarAdmin();
});
