window.addEventListener('load', function () {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuario) {
        window.location.href = 'index.html';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('aba') === 'cadastro') {
        const abrirCadastro = document.getElementById('aba-cadastro-btn');
        if (abrirCadastro) abrirCadastro.click();
    }
});

function fazerLogin() {
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value.trim();
    const msg = document.getElementById('msg-login');

    if (!email || !senha) {
        msg.textContent = 'Preencha email e senha.';
        msg.className = 'text-danger mt-2';
        return;
    }

    const EMAIL_ADMIN = 'admin@futnews.com';
    const SENHA_ADMIN = 'admin123';

    if (email === EMAIL_ADMIN && senha === SENHA_ADMIN) {
        localStorage.setItem('usuarioLogado', JSON.stringify({ nome: 'Admin', email: EMAIL_ADMIN, senha: SENHA_ADMIN }));
        window.location.href = 'index.html';
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuario) {
        msg.textContent = 'Email ou senha incorretos.';
        msg.className = 'text-danger mt-2';
        return;
    }

    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    window.location.href = 'index.html';
}

function fazerCadastro() {
    const nome = document.getElementById('cad-nome').value.trim();
    const email = document.getElementById('cad-email').value.trim();
    const senha = document.getElementById('cad-senha').value.trim();
    const msg = document.getElementById('msg-cadastro');

    if (!nome || !email || !senha) {
        msg.textContent = 'Preencha todos os campos.';
        msg.className = 'text-danger mt-2';
        return;
    }

    if (senha.length < 4) {
        msg.textContent = 'A senha deve ter ao menos 4 caracteres.';
        msg.className = 'text-danger mt-2';
        return;
    }

    if (email === 'admin@futnews.com') {
        msg.textContent = 'Este email não pode ser utilizado.';
        msg.className = 'text-danger mt-2';
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (usuarios.find(u => u.email === email)) {
        msg.textContent = 'Email já cadastrado.';
        msg.className = 'text-danger mt-2';
        return;
    }

    usuarios.push({ nome, email, senha });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    msg.textContent = '✅ Cadastro realizado! Faça login.';
    msg.className = 'text-success mt-2';

    document.getElementById('cad-nome').value = '';
    document.getElementById('cad-email').value = '';
    document.getElementById('cad-senha').value = '';

    setTimeout(() => {
        document.querySelector('[data-bs-target="#aba-login"]').click();
    }, 1200);
}

document.addEventListener('DOMContentLoaded', function () {
    const loginSenha = document.getElementById('login-senha');
    if (loginSenha) loginSenha.addEventListener('keydown', e => { if (e.key === 'Enter') fazerLogin(); });

    const loginEmail = document.getElementById('login-email');
    if (loginEmail) loginEmail.addEventListener('keydown', e => { if (e.key === 'Enter') fazerLogin(); });

    const cadSenha = document.getElementById('cad-senha');
    if (cadSenha) cadSenha.addEventListener('keydown', e => { if (e.key === 'Enter') fazerCadastro(); });
});
