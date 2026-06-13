// Cadastrar usuario
function fazerCadastro() {
    const nome = document.getElementById('cad-nome').value.trim();
    const email = document.getElementById('cad-email').value.trim();
    const senha = document.getElementById('cad-senha').value.trim();

    if (!nome || !email || !senha) {
        mostrarMensagem('msg-cadastro', 'Preencha todos os campos.', 'error');
        return;
    }

    const usuarios = getUsuarios();

    if (usuarios.find(u => u.email === email)) {
        mostrarMensagem('msg-cadastro', 'Email ja cadastrado.', 'error');
        return;
    }

    usuarios.push({ nome, email, senha });
    saveUsuarios(usuarios);

    mostrarMensagem('msg-cadastro', 'Cadastro realizado! Faca login.', 'success');
}

// Fazer login
function fazerLogin() {
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value.trim();

    const usuarios = getUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuario) {
        mostrarMensagem('msg-login', 'Email ou senha incorretos.', 'error');
        return;
    }

    saveUsuarioLogado(usuario);
    window.location.href = 'index.html';
}

// Abre a aba de cadastro se a URL tiver ?aba=cadastro
window.addEventListener('load', function () {
    const params = new URLSearchParams(window.location.search);
    if (params.get('aba') === 'cadastro') {
        const abrirCadastro = document.getElementById('aba-cadastro-btn');
        if (abrirCadastro) abrirCadastro.click();
    }
});
