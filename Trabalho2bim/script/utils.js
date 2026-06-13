// ===== SHARED UTILITIES =====

// --- localStorage helpers ---
function getFromStorage(key, fallback) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : (fallback !== undefined ? fallback : null);
    } catch (e) {
        console.error('Erro ao ler localStorage:', e);
        return fallback !== undefined ? fallback : null;
    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// --- User helpers ---
function getUsuarios() {
    return getFromStorage('usuarios', []);
}

function saveUsuarios(usuarios) {
    saveToStorage('usuarios', usuarios);
}

function getUsuarioLogado() {
    return getFromStorage('usuarioLogado', null);
}

function saveUsuarioLogado(usuario) {
    saveToStorage('usuarioLogado', usuario);
}

// --- Admin helpers ---
const ADMIN_EMAIL = 'admin@futnews.com';
const ADMIN_SENHA = 'admin123';

function isAdmin(usuario) {
    return usuario && usuario.email === ADMIN_EMAIL && usuario.senha === ADMIN_SENHA;
}

// --- Noticias helpers ---
function getNoticias() {
    return getFromStorage('noticias', []);
}

function saveNoticias(noticias) {
    saveToStorage('noticias', noticias);
}

// --- UI helpers ---
function mostrarMensagem(elementId, texto, tipo) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = texto;
    el.className = tipo === 'success' ? 'text-success mt-2' : 'text-danger mt-2';
}

function mensagemVazia(texto) {
    return '<p class="text-muted">' + (texto || 'Nenhuma noticia encontrada.') + '</p>';
}
