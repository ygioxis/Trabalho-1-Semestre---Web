function lerJSON(chave) {
    try {
        const dados = localStorage.getItem(chave);
        return dados ? JSON.parse(dados) : null;
    } catch (erro) {
        console.error(`Erro ao ler "${chave}" do localStorage:`, erro);
        return null;
    }
}

// Cadastrar usuario
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

    const usuarios = lerJSON('usuarios') || [];

    const jaExiste = usuarios.find(u => u.email === email);
    if (jaExiste) {
        msg.textContent = 'Email já cadastrado.';
        msg.className = 'text-danger mt-2';
        return;
    }

    usuarios.push({ nome, email, senha });

    try {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    } catch (erro) {
        console.error('Erro ao salvar usuário:', erro);
        msg.textContent = 'Erro ao salvar cadastro. Verifique o armazenamento do navegador.';
        msg.className = 'text-danger mt-2';
        return;
    }

    msg.textContent = 'Cadastro realizado! Faça login.';
    msg.className = 'text-success mt-2';
}

// Fazer login
function fazerLogin() {
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value.trim();
    const msg = document.getElementById('msg-login');

    if (!email || !senha) {
        msg.textContent = 'Preencha email e senha.';
        msg.className = 'text-danger mt-2';
        return;
    }

    const usuarios = lerJSON('usuarios') || [];

    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuario) {
        msg.textContent = 'Email ou senha incorretos.';
        msg.className = 'text-danger mt-2';
        return;
    }

    try {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    } catch (erro) {
        console.error('Erro ao salvar sessão:', erro);
        msg.textContent = 'Erro ao iniciar sessão. Tente novamente.';
        msg.className = 'text-danger mt-2';
        return;
    }

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
