
(function () {
    if (localStorage.getItem('tema') === 'claro') {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
})();

window.addEventListener('load', function () {
    const btn = document.getElementById('btnTema');
    if (btn) {
        const temaAtual = localStorage.getItem('tema') || 'escuro';
        btn.textContent = temaAtual === 'escuro' ? '☀️ Tema Claro' : '🌙 Tema Escuro';

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
    }
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
    } else {
        if (nomeUsuario) nomeUsuario.textContent = '';
        if (btnPerfil) btnPerfil.style.display = 'none';
        if (btnLogout) btnLogout.style.display = 'none';
        if (btnLogin) btnLogin.style.display = 'inline-block';
    }

    // Mostra link Admin apenas para o admin
    const EMAIL_ADMIN = 'admin@futnews.com';
    const linkAdmin = document.querySelector('a[href="admin.html"], a[href="../html/admin.html"]');
    if (linkAdmin) {
        if (usuario && usuario.email === EMAIL_ADMIN) {
            linkAdmin.style.display = 'inline-block';
        } else {
            linkAdmin.style.display = 'none';
        }
    }
});

function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}
