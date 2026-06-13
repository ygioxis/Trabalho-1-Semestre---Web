function lerJSON(chave) {
    try {
        const dados = localStorage.getItem(chave);
        return dados ? JSON.parse(dados) : null;
    } catch (erro) {
        console.error(`Erro ao ler "${chave}" do localStorage:`, erro);
        return null;
    }
}

window.addEventListener('load', function () {
    const usuario = lerJSON('usuarioLogado');

    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('perfil-nome').value = usuario.nome || '';
    document.getElementById('perfil-email').value = usuario.email || '';
    document.getElementById('perfil-nome-exibido').textContent = usuario.nome || '';
    document.getElementById('perfil-email-exibido').textContent = usuario.email || '';
    document.getElementById('avatar-inicial').textContent = usuario.nome ? usuario.nome.charAt(0).toUpperCase() : '?';
});

function confirmarSalvar() {
    const nome = document.getElementById('perfil-nome').value.trim();
    const email = document.getElementById('perfil-email').value.trim();
    const senha = document.getElementById('perfil-senha').value.trim();
    const msg = document.getElementById('msg-perfil');

    const modalEl = document.getElementById('modalConfirmar');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);

    if (!nome || !email) {
        if (modalInstance) modalInstance.hide();
        msg.textContent = 'Nome e email são obrigatórios.';
        msg.className = 'text-danger mt-2';
        return;
    }

    const usuarioLogado = lerJSON('usuarioLogado');
    if (!usuarioLogado) {
        if (modalInstance) modalInstance.hide();
        msg.textContent = 'Sessão expirada. Faça login novamente.';
        msg.className = 'text-danger mt-2';
        return;
    }

    let usuarios = lerJSON('usuarios') || [];

    usuarios = usuarios.map(u => {
        if (u.email === usuarioLogado.email) {
            return { nome, email, senha: senha || u.senha };
        }
        return u;
    });

    const atualizado = { nome, email, senha: senha || usuarioLogado.senha };

    try {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('usuarioLogado', JSON.stringify(atualizado));
    } catch (erro) {
        console.error('Erro ao salvar perfil:', erro);
        if (modalInstance) modalInstance.hide();
        msg.textContent = 'Erro ao salvar alterações. Verifique o armazenamento do navegador.';
        msg.className = 'text-danger mt-2';
        return;
    }

    document.getElementById('perfil-nome-exibido').textContent = nome;
    document.getElementById('perfil-email-exibido').textContent = email;
    document.getElementById('avatar-inicial').textContent = nome.charAt(0).toUpperCase();

    if (modalInstance) modalInstance.hide();

    msg.textContent = 'Dados atualizados com sucesso!';
    msg.className = 'text-success mt-2';
}

function excluirConta() {
    const usuarioLogado = lerJSON('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    let usuarios = lerJSON('usuarios') || [];
    usuarios = usuarios.filter(u => u.email !== usuarioLogado.email);

    try {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.removeItem('usuarioLogado');
    } catch (erro) {
        console.error('Erro ao excluir conta:', erro);
        alert('Erro ao excluir conta. Tente novamente.');
        return;
    }

    window.location.href = 'login.html';
}
