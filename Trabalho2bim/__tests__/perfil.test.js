let confirmarSalvar, excluirConta;
let mockLocalStore;

function buildDOM() {
  document.body.innerHTML = `
    <input id="perfil-nome" />
    <input id="perfil-email" />
    <input id="perfil-senha" />
    <span id="perfil-nome-exibido"></span>
    <span id="perfil-email-exibido"></span>
    <span id="avatar-inicial"></span>
    <div id="msg-perfil"></div>
    <div id="modalConfirmar" class="modal"></div>
  `;
}

// Minimal bootstrap.Modal mock
const modalInstances = {};
global.bootstrap = {
  Modal: class MockModal {
    constructor(el) {
      this._el = el;
      this._visible = false;
      modalInstances[el.id] = this;
    }
    show() { this._visible = true; }
    hide() { this._visible = false; }
    static getInstance(el) {
      return modalInstances[el.id] || null;
    }
  }
};

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

  buildDOM();

  mockLocalStore['usuarioLogado'] = JSON.stringify({
    nome: 'Alice',
    email: 'alice@test.com',
    senha: '123'
  });
  mockLocalStore['usuarios'] = JSON.stringify([
    { nome: 'Alice', email: 'alice@test.com', senha: '123' }
  ]);

  jest.isolateModules(() => {
    const mod = require('../script/perfil.js');
    confirmarSalvar = mod.confirmarSalvar;
    excluirConta = mod.excluirConta;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  Object.keys(modalInstances).forEach(k => delete modalInstances[k]);
});

// ---------------------------------------------------------------------------
// Page load — populate profile fields
// ---------------------------------------------------------------------------
describe('profile page load', () => {
  test('populates profile fields on load', () => {
    window.dispatchEvent(new Event('load'));

    expect(document.getElementById('perfil-nome').value).toBe('Alice');
    expect(document.getElementById('perfil-email').value).toBe('alice@test.com');
    expect(document.getElementById('perfil-nome-exibido').textContent).toBe('Alice');
    expect(document.getElementById('perfil-email-exibido').textContent).toBe('alice@test.com');
    expect(document.getElementById('avatar-inicial').textContent).toBe('A');
  });

  test('redirects to login when not logged in', () => {
    delete mockLocalStore['usuarioLogado'];
    window.dispatchEvent(new Event('load'));
    expect(window.location.href).toBe('login.html');
  });
});

// ---------------------------------------------------------------------------
// confirmarSalvar
// ---------------------------------------------------------------------------
describe('confirmarSalvar', () => {
  beforeEach(() => {
    new bootstrap.Modal(document.getElementById('modalConfirmar'));
  });

  test('shows error when nome is empty', () => {
    document.getElementById('perfil-nome').value = '';
    document.getElementById('perfil-email').value = 'alice@test.com';

    confirmarSalvar();

    const msg = document.getElementById('msg-perfil');
    expect(msg.textContent).toBe('Nome e email são obrigatórios.');
    expect(msg.className).toContain('text-danger');
  });

  test('shows error when email is empty', () => {
    document.getElementById('perfil-nome').value = 'Alice';
    document.getElementById('perfil-email').value = '';

    confirmarSalvar();

    expect(document.getElementById('msg-perfil').textContent).toBe(
      'Nome e email são obrigatórios.'
    );
  });

  test('updates profile successfully', () => {
    document.getElementById('perfil-nome').value = 'Alice Updated';
    document.getElementById('perfil-email').value = 'newalice@test.com';
    document.getElementById('perfil-senha').value = 'newpass';

    confirmarSalvar();

    const updated = JSON.parse(mockLocalStore['usuarioLogado']);
    expect(updated.nome).toBe('Alice Updated');
    expect(updated.email).toBe('newalice@test.com');
    expect(updated.senha).toBe('newpass');

    const users = JSON.parse(mockLocalStore['usuarios']);
    expect(users[0].nome).toBe('Alice Updated');
    expect(users[0].email).toBe('newalice@test.com');

    expect(document.getElementById('perfil-nome-exibido').textContent).toBe('Alice Updated');
    expect(document.getElementById('perfil-email-exibido').textContent).toBe('newalice@test.com');
    expect(document.getElementById('avatar-inicial').textContent).toBe('A');

    const msg = document.getElementById('msg-perfil');
    expect(msg.textContent).toBe('Dados atualizados com sucesso!');
    expect(msg.className).toContain('text-success');
  });

  test('keeps old password when senha field is empty', () => {
    document.getElementById('perfil-nome').value = 'Alice';
    document.getElementById('perfil-email').value = 'alice@test.com';
    document.getElementById('perfil-senha').value = '';

    confirmarSalvar();

    const updated = JSON.parse(mockLocalStore['usuarioLogado']);
    expect(updated.senha).toBe('123');
  });
});

// ---------------------------------------------------------------------------
// excluirConta
// ---------------------------------------------------------------------------
describe('excluirConta', () => {
  test('removes user from usuarios and clears login', () => {
    excluirConta();

    const users = JSON.parse(mockLocalStore['usuarios']);
    expect(users).toHaveLength(0);
    expect(mockLocalStore['usuarioLogado']).toBeUndefined();
    expect(window.location.href).toBe('login.html');
  });

  test('only removes current user, keeps others', () => {
    mockLocalStore['usuarios'] = JSON.stringify([
      { nome: 'Alice', email: 'alice@test.com', senha: '123' },
      { nome: 'Bob', email: 'bob@test.com', senha: '456' }
    ]);

    excluirConta();

    const users = JSON.parse(mockLocalStore['usuarios']);
    expect(users).toHaveLength(1);
    expect(users[0].nome).toBe('Bob');
  });
});
