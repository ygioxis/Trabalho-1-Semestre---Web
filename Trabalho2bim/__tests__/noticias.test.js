let imagemNoticia, montarCard, carregarNoticias, buscarNoticias, filtrarCategoria, carregarHome;
let mockLocalStore;

function buildDOM() {
  document.body.innerHTML = `
    <div id="lista-noticias"></div>
    <div id="barra-noticias"></div>
    <div id="noticia-destaque"></div>
    <div id="noticias-brasileirao"></div>
    <div id="noticias-champions"></div>
    <div id="noticias-selecao"></div>
    <input id="campoBusca" />
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

  buildDOM();

  jest.isolateModules(() => {
    const mod = require('../script/noticias.js');
    imagemNoticia = mod.imagemNoticia;
    montarCard = mod.montarCard;
    carregarNoticias = mod.carregarNoticias;
    buscarNoticias = mod.buscarNoticias;
    filtrarCategoria = mod.filtrarCategoria;
    carregarHome = mod.carregarHome;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

const sampleNoticias = [
  {
    id: 1,
    titulo: 'Flamengo vence',
    categoria: 'Brasileirão',
    conteudo: 'O Flamengo venceu o jogo de ontem com um gol no final. A torcida comemorou muito nas ruas do Rio de Janeiro.',
    imagem: ''
  },
  {
    id: 2,
    titulo: 'Champions final',
    categoria: 'Champions League',
    conteudo: 'A final da Champions League foi disputada entre dois grandes clubes europeus neste sábado.',
    imagem: 'https://example.com/img.jpg'
  },
  {
    id: 3,
    titulo: 'Brasil convocado',
    categoria: 'Seleção',
    conteudo: 'A seleção brasileira convocou os jogadores para as eliminatórias da Copa do Mundo.',
    imagem: ''
  }
];

// ---------------------------------------------------------------------------
// imagemNoticia
// ---------------------------------------------------------------------------
describe('imagemNoticia', () => {
  test('returns custom image when noticia has one', () => {
    const result = imagemNoticia({ imagem: 'https://example.com/img.jpg', categoria: 'Brasileirão' });
    expect(result).toBe('https://example.com/img.jpg');
  });

  test('returns Brasileirão placeholder when no image', () => {
    const result = imagemNoticia({ imagem: '', categoria: 'Brasileirão' });
    expect(result).toContain('Brasileirao');
  });

  test('returns Champions League placeholder when no image', () => {
    const result = imagemNoticia({ imagem: '', categoria: 'Champions League' });
    expect(result).toContain('Champions');
  });

  test('returns Seleção placeholder when no image', () => {
    const result = imagemNoticia({ imagem: '', categoria: 'Seleção' });
    expect(result).toContain('Selecao');
  });

  test('returns default placeholder for unknown category', () => {
    const result = imagemNoticia({ imagem: '', categoria: 'Outro' });
    expect(result).toContain('FutNews');
  });

  test('returns category placeholder when image is null', () => {
    const result = imagemNoticia({ imagem: null, categoria: 'Brasileirão' });
    expect(result).toContain('Brasileirao');
  });
});

// ---------------------------------------------------------------------------
// montarCard
// ---------------------------------------------------------------------------
describe('montarCard', () => {
  test('generates card HTML with correct title and category', () => {
    const html = montarCard(sampleNoticias[0]);
    expect(html).toContain('Flamengo vence');
    expect(html).toContain('Brasileirão');
    expect(html).toContain('btn-success');
  });

  test('truncates content to 100 chars', () => {
    const longContent = 'A'.repeat(200);
    const html = montarCard({ ...sampleNoticias[0], conteudo: longContent });
    expect(html).toContain('A'.repeat(100) + '...');
    expect(html).not.toContain('A'.repeat(101));
  });

  test('includes link to noticia.html with correct id', () => {
    const html = montarCard(sampleNoticias[0]);
    expect(html).toContain('noticia.html?id=1');
  });

  test('uses custom image when available', () => {
    const html = montarCard(sampleNoticias[1]);
    expect(html).toContain('https://example.com/img.jpg');
  });
});

// ---------------------------------------------------------------------------
// carregarNoticias
// ---------------------------------------------------------------------------
describe('carregarNoticias', () => {
  test('shows empty message when no noticias', () => {
    carregarNoticias();
    const lista = document.getElementById('lista-noticias');
    expect(lista.innerHTML).toContain('Nenhuma notícia encontrada.');
  });

  test('renders all noticias when no filter', () => {
    mockLocalStore['noticias'] = JSON.stringify(sampleNoticias);
    carregarNoticias();
    const lista = document.getElementById('lista-noticias');
    expect(lista.innerHTML).toContain('Flamengo vence');
    expect(lista.innerHTML).toContain('Champions final');
    expect(lista.innerHTML).toContain('Brasil convocado');
  });

  test('filters by category', () => {
    mockLocalStore['noticias'] = JSON.stringify(sampleNoticias);
    carregarNoticias('Brasileirão');
    const lista = document.getElementById('lista-noticias');
    expect(lista.innerHTML).toContain('Flamengo vence');
    expect(lista.innerHTML).not.toContain('Champions final');
  });

  test('filters by title search (case-insensitive)', () => {
    mockLocalStore['noticias'] = JSON.stringify(sampleNoticias);
    carregarNoticias('champions');
    const lista = document.getElementById('lista-noticias');
    expect(lista.innerHTML).toContain('Champions final');
  });

  test('shows empty message when filter matches nothing', () => {
    mockLocalStore['noticias'] = JSON.stringify(sampleNoticias);
    carregarNoticias('xyz-nonexistent');
    const lista = document.getElementById('lista-noticias');
    expect(lista.innerHTML).toContain('Nenhuma notícia encontrada.');
  });
});

// ---------------------------------------------------------------------------
// buscarNoticias
// ---------------------------------------------------------------------------
describe('buscarNoticias', () => {
  test('reads from campoBusca input and filters', () => {
    mockLocalStore['noticias'] = JSON.stringify(sampleNoticias);
    document.getElementById('campoBusca').value = 'flamengo';
    buscarNoticias();
    const lista = document.getElementById('lista-noticias');
    expect(lista.innerHTML).toContain('Flamengo vence');
    expect(lista.innerHTML).not.toContain('Brasil convocado');
  });
});

// ---------------------------------------------------------------------------
// filtrarCategoria
// ---------------------------------------------------------------------------
describe('filtrarCategoria', () => {
  test('filters noticias by exact category', () => {
    mockLocalStore['noticias'] = JSON.stringify(sampleNoticias);
    filtrarCategoria('Seleção');
    const lista = document.getElementById('lista-noticias');
    expect(lista.innerHTML).toContain('Brasil convocado');
    expect(lista.innerHTML).not.toContain('Flamengo vence');
  });
});

// ---------------------------------------------------------------------------
// carregarHome
// ---------------------------------------------------------------------------
describe('carregarHome', () => {
  test('does nothing when no noticias exist', () => {
    carregarHome();
    expect(document.getElementById('barra-noticias').textContent).toBe('');
  });

  test('populates news ticker bar', () => {
    mockLocalStore['noticias'] = JSON.stringify(sampleNoticias);
    carregarHome();
    const barra = document.getElementById('barra-noticias');
    expect(barra.textContent).toContain('Flamengo vence');
    expect(barra.textContent).toContain('⚽');
  });

  test('renders destaque with first noticia', () => {
    mockLocalStore['noticias'] = JSON.stringify(sampleNoticias);
    carregarHome();
    const destaque = document.getElementById('noticia-destaque');
    expect(destaque.innerHTML).toContain('Flamengo vence');
    expect(destaque.innerHTML).toContain('destaque-card');
  });

  test('renders noticias by category sections', () => {
    mockLocalStore['noticias'] = JSON.stringify(sampleNoticias);
    carregarHome();

    expect(document.getElementById('noticias-brasileirao').innerHTML).toContain('Flamengo vence');
    expect(document.getElementById('noticias-champions').innerHTML).toContain('Champions final');
    expect(document.getElementById('noticias-selecao').innerHTML).toContain('Brasil convocado');
  });

  test('shows empty message for category with no noticias', () => {
    mockLocalStore['noticias'] = JSON.stringify([sampleNoticias[0]]);
    carregarHome();
    expect(document.getElementById('noticias-champions').innerHTML).toContain(
      'Nenhuma notícia nessa categoria.'
    );
  });
});
