window.addEventListener('load', function () {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

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
    const msg = document.getElementById('msg-perfil');

    if (!nome || !email) {
        bootstrap.Modal.getInstance(document.getElementById('modalConfirmar')).hide();
        msg.textContent = 'Nome e email são obrigatórios.';
        msg.className = 'text-danger mt-2';
        return;
    }

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    usuarios = usuarios.map(u => {
        if (u.email === usuarioLogado.email) {
            return { nome, email, senha: senha || u.senha };
        }
        return u;
    });

    const atualizado = { nome, email, senha: senha || usuarioLogado.senha };
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('usuarioLogado', JSON.stringify(atualizado));

    document.getElementById('perfil-nome-exibido').textContent = nome;
    document.getElementById('perfil-email-exibido').textContent = email;
    document.getElementById('avatar-inicial').textContent = nome.charAt(0).toUpperCase();

    bootstrap.Modal.getInstance(document.getElementById('modalConfirmar')).hide();

    msg.textContent = 'Dados atualizados com sucesso!';
    msg.className = 'text-success mt-2';
}

function excluirConta() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    usuarios = usuarios.filter(u => u.email !== usuarioLogado.email);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.removeItem('usuarioLogado');

    window.location.href = 'login.html';
}