window.addEventListener('load', function () {
    const usuario = getUsuarioLogado();

    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('perfil-nome').value = usuario.nome;
    document.getElementById('perfil-email').value = usuario.email;
    document.getElementById('perfil-nome-exibido').textContent = usuario.nome;
    document.getElementById('perfil-email-exibido').textContent = usuario.email;
    document.getElementById('avatar-inicial').textContent = usuario.nome.charAt(0).toUpperCase();
});

function confirmarSalvar() {
    const nome = document.getElementById('perfil-nome').value.trim();
    const email = document.getElementById('perfil-email').value.trim();
    const senha = document.getElementById('perfil-senha').value.trim();

    if (!nome || !email) {
        bootstrap.Modal.getInstance(document.getElementById('modalConfirmar')).hide();
        mostrarMensagem('msg-perfil', 'Nome e email sao obrigatorios.', 'error');
        return;
    }

    const usuarioLogado = getUsuarioLogado();
    let usuarios = getUsuarios();

    usuarios = usuarios.map(u => {
        if (u.email === usuarioLogado.email) {
            return { nome, email, senha: senha || u.senha };
        }
        return u;
    });

    const atualizado = { nome, email, senha: senha || usuarioLogado.senha };
    saveUsuarios(usuarios);
    saveUsuarioLogado(atualizado);

    document.getElementById('perfil-nome-exibido').textContent = nome;
    document.getElementById('perfil-email-exibido').textContent = email;
    document.getElementById('avatar-inicial').textContent = nome.charAt(0).toUpperCase();

    bootstrap.Modal.getInstance(document.getElementById('modalConfirmar')).hide();

    mostrarMensagem('msg-perfil', 'Dados atualizados com sucesso!', 'success');
}

function excluirConta() {
    const usuarioLogado = getUsuarioLogado();
    let usuarios = getUsuarios();

    usuarios = usuarios.filter(u => u.email !== usuarioLogado.email);
    saveUsuarios(usuarios);
    localStorage.removeItem('usuarioLogado');

    window.location.href = 'login.html';
}
