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