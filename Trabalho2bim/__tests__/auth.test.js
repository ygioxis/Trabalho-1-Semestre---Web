let fazerCadastro, fazerLogin;
let mockLocalStore;

function buildDOM() {
  document.body.innerHTML = `
    <input id="cad-nome" />
    <input id="cad-email" />
    <input id="cad-senha" />
    <div id="msg-cadastro"></div>
    <input id="login-email" />
    <input id="login-senha" />
    <div id="msg-login"></div>
    <button id="aba-cadastro-btn"></button>
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

  buildDOM();

  jest.isolateModules(() => {
    const mod = require('../script/auth.js');
    fazerCadastro = mod.fazerCadastro;
    fazerLogin = mod.fazerLogin;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// fazerCadastro
// ---------------------------------------------------------------------------
describe('fazerCadastro', () => {
  test('shows error when fields are empty', () => {
    fazerCadastro();
    const msg = document.getElementById('msg-cadastro');
    expect(msg.textContent).toBe('Preencha todos os campos.');
    expect(msg.className).toContain('text-danger');
  });

  test('shows error when only some fields are filled', () => {
    document.getElementById('cad-nome').value = 'Alice';
    fazerCadastro();
    expect(document.getElementById('msg-cadastro').textContent).toBe(
      'Preencha todos os campos.'
    );
  });

  test('registers a new user successfully', () => {
    document.getElementById('cad-nome').value = 'Alice';
    document.getElementById('cad-email').value = 'alice@test.com';
    document.getElementById('cad-senha').value = '123';

    fazerCadastro();

    const msg = document.getElementById('msg-cadastro');
    expect(msg.textContent).toBe('Cadastro realizado! Faça login.');
    expect(msg.className).toContain('text-success');

    const saved = JSON.parse(mockLocalStore['usuarios']);
    expect(saved).toHaveLength(1);
    expect(saved[0]).toEqual({
      nome: 'Alice',
      email: 'alice@test.com',
      senha: '123'
    });
  });

  test('rejects duplicate email', () => {
    mockLocalStore['usuarios'] = JSON.stringify([
      { nome: 'Bob', email: 'bob@test.com', senha: '456' }
    ]);

    document.getElementById('cad-nome').value = 'Bob2';
    document.getElementById('cad-email').value = 'bob@test.com';
    document.getElementById('cad-senha').value = '789';

    fazerCadastro();

    const msg = document.getElementById('msg-cadastro');
    expect(msg.textContent).toBe('Email já cadastrado.');
    expect(msg.className).toContain('text-danger');
  });

  test('appends to existing users array', () => {
    mockLocalStore['usuarios'] = JSON.stringify([
      { nome: 'Bob', email: 'bob@test.com', senha: '456' }
    ]);

    document.getElementById('cad-nome').value = 'Alice';
    document.getElementById('cad-email').value = 'alice@test.com';
    document.getElementById('cad-senha').value = '123';

    fazerCadastro();

    const saved = JSON.parse(mockLocalStore['usuarios']);
    expect(saved).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// fazerLogin
// ---------------------------------------------------------------------------
describe('fazerLogin', () => {
  beforeEach(() => {
    mockLocalStore['usuarios'] = JSON.stringify([
      { nome: 'Alice', email: 'alice@test.com', senha: '123' }
    ]);
  });

  test('shows error for wrong credentials', () => {
    document.getElementById('login-email').value = 'wrong@test.com';
    document.getElementById('login-senha').value = 'wrong';

    fazerLogin();

    expect(document.getElementById('msg-login').textContent).toBe(
      'Email ou senha incorretos.'
    );
  });

  test('shows error when password is wrong', () => {
    document.getElementById('login-email').value = 'alice@test.com';
    document.getElementById('login-senha').value = 'wrongpass';

    fazerLogin();

    expect(document.getElementById('msg-login').textContent).toBe(
      'Email ou senha incorretos.'
    );
  });

  test('logs in successfully and saves to localStorage', () => {
    delete window.location;
    window.location = { href: '' };

    document.getElementById('login-email').value = 'alice@test.com';
    document.getElementById('login-senha').value = '123';

    fazerLogin();

    const logado = JSON.parse(mockLocalStore['usuarioLogado']);
    expect(logado.nome).toBe('Alice');
    expect(logado.email).toBe('alice@test.com');
    expect(window.location.href).toBe('index.html');
  });

  test('works when no users exist', () => {
    delete mockLocalStore['usuarios'];

    document.getElementById('login-email').value = 'any@test.com';
    document.getElementById('login-senha').value = '123';

    fazerLogin();

    expect(document.getElementById('msg-login').textContent).toBe(
      'Email ou senha incorretos.'
    );
  });
});
