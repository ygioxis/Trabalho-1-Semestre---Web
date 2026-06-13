function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    if (!validarEmail(email)) {
        msg.textContent = 'Email inválido.';
        msg.className = 'text-danger mt-2';
        return;
    }

    if (senha.length < 6) {
        msg.textContent = 'A senha deve ter pelo menos 6 caracteres.';
        msg.className = 'text-danger mt-2';
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const jaExiste = usuarios.find(u => u.email === email);
    if (jaExiste) {
        msg.textContent = 'Email já cadastrado.';
        msg.className = 'text-danger mt-2';
        return;
    }

    usuarios.push({ nome, email, senha });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    msg.textContent = 'Cadastro realizado! Faça login.';
    msg.className = 'text-success mt-2';
}

function fazerLogin() {
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value.trim();
    const msg = document.getElementById('msg-login');

    if (!email || !senha) {
        msg.textContent = 'Preencha todos os campos.';
        msg.className = 'text-danger mt-2';
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

window.addEventListener('load', function () {
    const params = new URLSearchParams(window.location.search);
    if (params.get('aba') === 'cadastro') {
        const abrirCadastro = document.getElementById('aba-cadastro-btn');
        if (abrirCadastro) abrirCadastro.click();
    }
});
