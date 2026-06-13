let salvarNoticia, limparForm, carregarAdmin, editarNoticia, confirmarExclusao;
let mockLocalStore;

function buildDOM() {
  document.body.innerHTML = `
    <input id="noticia-id" />
    <input id="noticia-titulo" />
    <select id="noticia-categoria">
      <option value="Brasileirão">Brasileirão</option>
      <option value="Champions League">Champions League</option>
    </select>
    <textarea id="noticia-conteudo"></textarea>
    <input id="noticia-imagem" />
    <h4 id="titulo-form">Nova Notícia</h4>
    <div id="lista-admin"></div>
    <div id="modalExcluir" class="modal">
      <button id="btnConfirmarExcluir"></button>
    </div>
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

  jest.spyOn(window, 'alert').mockImplementation(() => {});
  delete window.location;
  window.location = { href: '' };
  window.scrollTo = jest.fn();

  buildDOM();

  // Pre-set admin user
  mockLocalStore['usuarioLogado'] = JSON.stringify({
    nome: 'Admin',
    email: 'admin@futnews.com',
    senha: 'admin123'
  });

  jest.isolateModules(() => {
    const mod = require('../script/admin.js');
    salvarNoticia = mod.salvarNoticia;
    limparForm = mod.limparForm;
    carregarAdmin = mod.carregarAdmin;
    editarNoticia = mod.editarNoticia;
    confirmarExclusao = mod.confirmarExclusao;
  });

  // Wire up the delete confirmation listener
  document.dispatchEvent(new Event('DOMContentLoaded'));
});

afterEach(() => {
  jest.restoreAllMocks();
  Object.keys(modalInstances).forEach(k => delete modalInstances[k]);
});

// ---------------------------------------------------------------------------
// Access control
// ---------------------------------------------------------------------------
describe('admin access control', () => {
  test('redirects non-admin users', () => {
    mockLocalStore['usuarioLogado'] = JSON.stringify({
      nome: 'Regular',
      email: 'user@test.com',
      senha: '123'
    });
    window.dispatchEvent(new Event('load'));
    expect(window.alert).toHaveBeenCalledWith('Acesso restrito!');
    expect(window.location.href).toBe('index.html');
  });

  test('redirects when no user is logged in', () => {
    delete mockLocalStore['usuarioLogado'];
    window.dispatchEvent(new Event('load'));
    expect(window.alert).toHaveBeenCalledWith('Acesso restrito!');
  });
});

// ---------------------------------------------------------------------------
// salvarNoticia — create
// ---------------------------------------------------------------------------
describe('salvarNoticia — create', () => {
  test('alerts when titulo is empty', () => {
    document.getElementById('noticia-titulo').value = '';
    document.getElementById('noticia-conteudo').value = 'Content';
    salvarNoticia();
    expect(window.alert).toHaveBeenCalledWith('Preencha o título e o conteúdo.');
  });

  test('alerts when conteudo is empty', () => {
    document.getElementById('noticia-titulo').value = 'Title';
    document.getElementById('noticia-conteudo').value = '';
    salvarNoticia();
    expect(window.alert).toHaveBeenCalledWith('Preencha o título e o conteúdo.');
  });

  test('creates a new noticia', () => {
    document.getElementById('noticia-titulo').value = 'Novo jogo';
    document.getElementById('noticia-categoria').value = 'Brasileirão';
    document.getElementById('noticia-conteudo').value = 'Conteúdo do jogo';
    document.getElementById('noticia-imagem').value = 'https://img.jpg';

    salvarNoticia();

    const saved = JSON.parse(mockLocalStore['noticias']);
    expect(saved).toHaveLength(1);
    expect(saved[0].titulo).toBe('Novo jogo');
    expect(saved[0].categoria).toBe('Brasileirão');
    expect(saved[0].conteudo).toBe('Conteúdo do jogo');
    expect(saved[0].imagem).toBe('https://img.jpg');
    expect(saved[0].id).toBeGreaterThan(0);
  });

  test('clears form after saving', () => {
    document.getElementById('noticia-titulo').value = 'Title';
    document.getElementById('noticia-conteudo').value = 'Content';
    salvarNoticia();

    expect(document.getElementById('noticia-id').value).toBe('');
    expect(document.getElementById('noticia-titulo').value).toBe('');
    expect(document.getElementById('titulo-form').textContent).toBe('Nova Notícia');
  });
});

// ---------------------------------------------------------------------------
// salvarNoticia — edit
// ---------------------------------------------------------------------------
describe('salvarNoticia — edit', () => {
  test('updates existing noticia when id is set', () => {
    mockLocalStore['noticias'] = JSON.stringify([
      { id: 100, titulo: 'Old', categoria: 'Brasileirão', conteudo: 'Old content', imagem: '' }
    ]);

    document.getElementById('noticia-id').value = '100';
    document.getElementById('noticia-titulo').value = 'Updated';
    document.getElementById('noticia-categoria').value = 'Champions League';
    document.getElementById('noticia-conteudo').value = 'New content';
    document.getElementById('noticia-imagem').value = '';

    salvarNoticia();

    const saved = JSON.parse(mockLocalStore['noticias']);
    expect(saved).toHaveLength(1);
    expect(saved[0].titulo).toBe('Updated');
    expect(saved[0].categoria).toBe('Champions League');
    expect(saved[0].id).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// carregarAdmin
// ---------------------------------------------------------------------------
describe('carregarAdmin', () => {
  test('shows empty message when no noticias', () => {
    carregarAdmin();
    expect(document.getElementById('lista-admin').innerHTML).toContain(
      'Nenhuma notícia cadastrada.'
    );
  });

  test('renders list of noticias', () => {
    mockLocalStore['noticias'] = JSON.stringify([
      { id: 1, titulo: 'Test News', categoria: 'Brasileirão', conteudo: 'Content', imagem: '' }
    ]);
    carregarAdmin();
    const lista = document.getElementById('lista-admin');
    expect(lista.innerHTML).toContain('Test News');
    expect(lista.innerHTML).toContain('Brasileirão');
    expect(lista.innerHTML).toContain('Editar');
    expect(lista.innerHTML).toContain('Excluir');
  });
});

// ---------------------------------------------------------------------------
// editarNoticia
// ---------------------------------------------------------------------------
describe('editarNoticia', () => {
  test('fills form with noticia data', () => {
    mockLocalStore['noticias'] = JSON.stringify([
      { id: 42, titulo: 'My Title', categoria: 'Brasileirão', conteudo: 'My Content', imagem: 'https://img.jpg' }
    ]);

    editarNoticia(42);

    expect(document.getElementById('noticia-id').value).toBe('42');
    expect(document.getElementById('noticia-titulo').value).toBe('My Title');
    expect(document.getElementById('noticia-conteudo').value).toBe('My Content');
    expect(document.getElementById('noticia-imagem').value).toBe('https://img.jpg');
    expect(document.getElementById('titulo-form').textContent).toBe('Editando Notícia');
  });

  test('does nothing when noticia id not found', () => {
    mockLocalStore['noticias'] = JSON.stringify([]);
    editarNoticia(999);
    expect(document.getElementById('noticia-id').value).toBe('');
  });
});

// ---------------------------------------------------------------------------
// confirmarExclusao + delete flow
// ---------------------------------------------------------------------------
describe('exclusão flow', () => {
  test('confirmarExclusao opens modal', () => {
    confirmarExclusao(42);
    const modal = modalInstances['modalExcluir'];
    expect(modal).toBeDefined();
    expect(modal._visible).toBe(true);
  });

  test('clicking confirm deletes the noticia', () => {
    mockLocalStore['noticias'] = JSON.stringify([
      { id: 1, titulo: 'A', categoria: 'B', conteudo: 'C', imagem: '' },
      { id: 2, titulo: 'D', categoria: 'E', conteudo: 'F', imagem: '' }
    ]);

    new bootstrap.Modal(document.getElementById('modalExcluir'));

    confirmarExclusao(1);
    document.getElementById('btnConfirmarExcluir').click();

    const saved = JSON.parse(mockLocalStore['noticias']);
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// limparForm
// ---------------------------------------------------------------------------
describe('limparForm', () => {
  test('resets all form fields', () => {
    document.getElementById('noticia-id').value = '10';
    document.getElementById('noticia-titulo').value = 'Title';
    document.getElementById('noticia-conteudo').value = 'Content';
    document.getElementById('noticia-imagem').value = 'img.jpg';
    document.getElementById('titulo-form').textContent = 'Editando';

    limparForm();

    expect(document.getElementById('noticia-id').value).toBe('');
    expect(document.getElementById('noticia-titulo').value).toBe('');
    expect(document.getElementById('noticia-conteudo').value).toBe('');
    expect(document.getElementById('noticia-imagem').value).toBe('');
    expect(document.getElementById('titulo-form').textContent).toBe('Nova Notícia');
  });
});
