// Cadastrar usuário
function fazerCadastro() {
    const nome = document.getElementById('cad-nome').value.trim();
    const email = document.getElementById('cad-email').value.trim();
    const senha = document.getElementById('cad-senha').value.trim();
    const msg = document.getElementById('msg-cadastro');

    // Verifica se os campos estão preenchidos
    if (!nome || !email || !senha) {
        msg.textContent = 'Preencha todos os campos.';
        msg.className = 'text-danger mt-2';
        return;
    }

    // Pega os usuários já salvos
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verifica se o email já existe
    const jaExiste = usuarios.find(u => u.email === email);
    if (jaExiste) {
        msg.textContent = 'Email já cadastrado.';
        msg.className = 'text-danger mt-2';
        return;
    }

    // Salva o novo usuário
    usuarios.push({ nome, email, senha });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    msg.textContent = 'Cadastro realizado! Faça login.';
    msg.className = 'text-success mt-2';
}

// Fazer login
function fazerLogin() {
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value.trim();
    const msg = document.getElementById('msg-login');

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Procura usuário com email e senha corretos
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuario) {
        msg.textContent = 'Email ou senha incorretos.';
        return;
    }

    // Salva quem está logado
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

    // Vai para a home
    window.location.href = 'index.html';
}

// Abre a aba de cadastro se a URL tiver #cadastro
window.addEventListener('load', function () {
    const params = new URLSearchParams(window.location.search);
    if (params.get('aba') === 'cadastro') {
        const abrirCadastro = document.getElementById('aba-cadastro-btn');
        if (abrirCadastro) abrirCadastro.click();
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fazerCadastro, fazerLogin };
}
