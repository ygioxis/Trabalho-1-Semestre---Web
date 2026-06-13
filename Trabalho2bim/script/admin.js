let idParaExcluir = null;

function lerJSON(chave) {
    try {
        const dados = localStorage.getItem(chave);
        return dados ? JSON.parse(dados) : null;
    } catch (erro) {
        console.error(`Erro ao ler "${chave}" do localStorage:`, erro);
        return null;
    }
}

// Bloqueia acesso de nao admins
window.addEventListener('load', function () {
    const usuario = lerJSON('usuarioLogado');
    const emailAdmin = 'admin@futnews.com';
    const senhaAdmin = 'admin123';

    if (!usuario || usuario.email !== emailAdmin || usuario.senha !== senhaAdmin) {
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
        alert('Preencha o título e o conteúdo.');
        return;
    }

    let noticias = lerJSON('noticias') || [];

    if (id) {
        noticias = noticias.map(n => n.id == id ? { id: Number(id), titulo, categoria, conteudo, imagem } : n);
    } else {
        noticias.push({ id: Date.now(), titulo, categoria, conteudo, imagem });
    }

    try {
        localStorage.setItem('noticias', JSON.stringify(noticias));
    } catch (erro) {
        console.error('Erro ao salvar notícia:', erro);
        alert('Erro ao salvar notícia. Verifique o armazenamento do navegador.');
        return;
    }

    limparForm();
    carregarAdmin();
}

// Limpa o formulario
function limparForm() {
    document.getElementById('noticia-id').value = '';
    document.getElementById('noticia-titulo').value = '';
    document.getElementById('noticia-conteudo').value = '';
    document.getElementById('titulo-form').textContent = 'Nova Notícia';
    document.getElementById('noticia-imagem').value = '';
}

// Carrega lista de noticias no admin
function carregarAdmin() {
    const lista = document.getElementById('lista-admin');
    if (!lista) return;

    const noticias = lerJSON('noticias') || [];

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

// Preenche formulario para editar
function editarNoticia(id) {
    const noticias = lerJSON('noticias') || [];
    const noticia = noticias.find(n => n.id === id);
    if (!noticia) {
        alert('Notícia não encontrada.');
        return;
    }

    document.getElementById('noticia-id').value = noticia.id;
    document.getElementById('noticia-titulo').value = noticia.titulo;
    document.getElementById('noticia-categoria').value = noticia.categoria;
    document.getElementById('noticia-conteudo').value = noticia.conteudo;
    document.getElementById('noticia-imagem').value = noticia.imagem || '';
    document.getElementById('titulo-form').textContent = 'Editando Notícia';

    window.scrollTo(0, 0);
}

// Abre modal de confirmacao
function confirmarExclusao(id) {
    idParaExcluir = id;
    const modalEl = document.getElementById('modalExcluir');
    if (!modalEl) {
        console.error('Modal de exclusão não encontrado.');
        return;
    }
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

// Executa a exclusao
document.addEventListener('DOMContentLoaded', function () {
    const btnConfirmar = document.getElementById('btnConfirmarExcluir');
    if (!btnConfirmar) {
        console.error('Botão de confirmar exclusão não encontrado.');
        return;
    }

    btnConfirmar.addEventListener('click', function () {
        let noticias = lerJSON('noticias') || [];
        noticias = noticias.filter(n => n.id !== idParaExcluir);

        try {
            localStorage.setItem('noticias', JSON.stringify(noticias));
        } catch (erro) {
            console.error('Erro ao excluir notícia:', erro);
            alert('Erro ao excluir notícia. Tente novamente.');
            return;
        }

        const modalEl = document.getElementById('modalExcluir');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }
        carregarAdmin();
    });

    carregarAdmin();
});
