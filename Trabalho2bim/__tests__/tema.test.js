let logout, verificarAdmin;
let mockLocalStore;

function buildDOM() {
  document.body.innerHTML = `
    <button id="btnTema">🌙 Tema Escuro</button>
    <span id="nomeUsuario"></span>
    <a id="btnPerfil" style="display:none">Perfil</a>
    <a id="btnLogout" style="display:none">Logout</a>
    <a id="btnLogin" style="display:inline-block">Login</a>
    <a href="admin.html" style="display:none">Admin</a>
  `;
}

beforeEach(() => {
  mockLocalStore = {};
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(
    (key) => mockLocalStore[key] ?? null
  );
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(
    (key, val) => { mockLocalStore[key] = String(val); }
  );
  jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(
    (key) => { delete mockLocalStore[key]; }
  );

  delete window.location;
  window.location = { href: '' };

  document.documentElement.removeAttribute('data-bs-theme');
  buildDOM();

  jest.isolateModules(() => {
    const mod = require('../script/tema.js');
    logout = mod.logout;
    verificarAdmin = mod.verificarAdmin;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Theme initialisation (top-level code runs on require)
// ---------------------------------------------------------------------------
describe('theme initialisation', () => {
  test('applies dark theme when saved as escuro', () => {
    document.documentElement.removeAttribute('data-bs-theme');
    mockLocalStore['tema'] = 'escuro';

    jest.isolateModules(() => {
      require('../script/tema.js');
    });

    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
  });

  test('does not apply dark theme when tema is claro', () => {
    document.documentElement.removeAttribute('data-bs-theme');
    mockLocalStore['tema'] = 'claro';

    jest.isolateModules(() => {
      require('../script/tema.js');
    });

    expect(document.documentElement.getAttribute('data-bs-theme')).not.toBe('dark');
  });

  test('does not apply dark theme when no tema saved', () => {
    document.documentElement.removeAttribute('data-bs-theme');

    jest.isolateModules(() => {
      require('../script/tema.js');
    });

    expect(document.documentElement.getAttribute('data-bs-theme')).not.toBe('dark');
  });
});

// ---------------------------------------------------------------------------
// Theme toggle
// ---------------------------------------------------------------------------
describe('theme toggle', () => {
  test('toggles from light to dark', () => {
    window.dispatchEvent(new Event('load'));

    const btn = document.getElementById('btnTema');
    btn.click();

    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
    expect(mockLocalStore['tema']).toBe('escuro');
    expect(btn.textContent).toContain('Claro');
  });

  test('toggles from dark to light', () => {
    document.documentElement.removeAttribute('data-bs-theme');
    mockLocalStore['tema'] = 'escuro';

    jest.isolateModules(() => {
      require('../script/tema.js');
    });

    window.dispatchEvent(new Event('load'));

    const btn = document.getElementById('btnTema');
    btn.click();

    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
    expect(mockLocalStore['tema']).toBe('claro');
    expect(btn.textContent).toContain('Escuro');
  });

  test('sets button text on load when theme is dark', () => {
    document.documentElement.removeAttribute('data-bs-theme');
    mockLocalStore['tema'] = 'escuro';

    jest.isolateModules(() => {
      require('../script/tema.js');
    });

    window.dispatchEvent(new Event('load'));

    const btn = document.getElementById('btnTema');
    expect(btn.textContent).toContain('Claro');
  });
});

// ---------------------------------------------------------------------------
// Navbar user display
// ---------------------------------------------------------------------------
describe('navbar user display', () => {
  test('shows user name and profile/logout buttons when logged in', () => {
    mockLocalStore['usuarioLogado'] = JSON.stringify({
      nome: 'Alice',
      email: 'alice@test.com',
      senha: '123'
    });

    window.dispatchEvent(new Event('load'));

    expect(document.getElementById('nomeUsuario').textContent).toContain('Alice');
    expect(document.getElementById('btnPerfil').style.display).toBe('inline-block');
    expect(document.getElementById('btnLogout').style.display).toBe('inline-block');
    expect(document.getElementById('btnLogin').style.display).toBe('none');
  });

  test('does not change navbar when not logged in', () => {
    window.dispatchEvent(new Event('load'));

    expect(document.getElementById('nomeUsuario').textContent).toBe('');
  });
});

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------
describe('logout', () => {
  test('removes user from localStorage and redirects', () => {
    mockLocalStore['usuarioLogado'] = JSON.stringify({ nome: 'Alice' });

    logout();

    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('usuarioLogado');
    expect(window.location.href).toBe('index.html');
  });
});

// ---------------------------------------------------------------------------
// verificarAdmin
// ---------------------------------------------------------------------------
describe('verificarAdmin', () => {
  test('shows admin link for admin user', () => {
    mockLocalStore['usuarioLogado'] = JSON.stringify({
      nome: 'Admin',
      email: 'admin@futnews.com',
      senha: 'admin123'
    });

    window.dispatchEvent(new Event('load'));

    const link = document.querySelector('a[href="admin.html"]');
    expect(link.style.display).toBe('inline-block');
  });

  test('hides admin link for non-admin user', () => {
    mockLocalStore['usuarioLogado'] = JSON.stringify({
      nome: 'Alice',
      email: 'alice@test.com',
      senha: '123'
    });

    window.dispatchEvent(new Event('load'));

    const link = document.querySelector('a[href="admin.html"]');
    expect(link.style.display).toBe('none');
  });

  test('hides admin link when no user is logged in', () => {
    window.dispatchEvent(new Event('load'));

    const link = document.querySelector('a[href="admin.html"]');
    expect(link.style.display).toBe('none');
  });
});
