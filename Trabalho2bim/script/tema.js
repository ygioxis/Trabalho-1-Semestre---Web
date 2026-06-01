const temaSalvo = localStorage.getItem('tema');
if (temaSalvo === 'escuro') {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
}

window.addEventListener('load', function () {
    const btn = document.getElementById('btnTema');

    if (localStorage.getItem('tema') === 'escuro') {
        btn.textContent = '☀️ Tema Claro';
    }

    btn.addEventListener('click', function () {
        const html = document.documentElement;
        if (html.getAttribute('data-bs-theme') === 'dark') {
            html.setAttribute('data-bs-theme', 'light');
            localStorage.setItem('tema', 'claro');
            btn.textContent = '🌙 Tema Escuro';
        } else {
            html.setAttribute('data-bs-theme', 'dark');
            localStorage.setItem('tema', 'escuro');
            btn.textContent = '☀️ Tema Claro';
        }
    });
});
// Mostra nome do usuário logado na navbar
window.addEventListener('load', function () {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const nomeUsuario = document.getElementById('nomeUsuario');
    const btnPerfil = document.getElementById('btnPerfil');
    const btnLogout = document.getElementById('btnLogout');
    const btnLogin = document.getElementById('btnLogin');

    if (usuario) {
        if (nomeUsuario) nomeUsuario.textContent = '👤 ' + usuario.nome;
        if (btnPerfil) btnPerfil.style.display = 'inline-block';
        if (btnLogout) btnLogout.style.display = 'inline-block';
        if (btnLogin) btnLogin.style.display = 'none';
    }
});

function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}