let buscarNoticiasAPI, carregarNoticiasAPI;

function buildDOM() {
  document.body.innerHTML = `
    <div id="lista-noticias-api"></div>
  `;
}

beforeEach(() => {
  buildDOM();
  global.fetch = jest.fn();

  jest.isolateModules(() => {
    const mod = require('../script/api.js');
    buscarNoticiasAPI = mod.buscarNoticiasAPI;
    carregarNoticiasAPI = mod.carregarNoticiasAPI;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  delete global.fetch;
});

// ---------------------------------------------------------------------------
// buscarNoticiasAPI
// ---------------------------------------------------------------------------
describe('buscarNoticiasAPI', () => {
  test('returns articles on success', async () => {
    const mockArticles = [
      { title: 'Article 1', description: 'Desc 1', link: 'http://a.com', image_url: null },
      { title: 'Article 2', description: 'Desc 2', link: 'http://b.com', image_url: 'http://img.com/2.jpg' }
    ];

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ results: mockArticles })
    });

    const result = await buscarNoticiasAPI();
    expect(result).toEqual(mockArticles);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toContain('newsdata.io');
  });

  test('returns empty array when API returns no results', async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ results: null })
    });

    const result = await buscarNoticiasAPI();
    expect(result).toEqual([]);
  });

  test('returns empty array on fetch error', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = await buscarNoticiasAPI();
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// carregarNoticiasAPI
// ---------------------------------------------------------------------------
describe('carregarNoticiasAPI', () => {
  test('renders articles into the DOM', async () => {
    const mockArticles = [
      { title: 'Gol bonito', description: 'Descrição longa do artigo sobre futebol.', link: 'http://a.com', image_url: 'http://img.com/1.jpg' }
    ];

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ results: mockArticles })
    });

    await carregarNoticiasAPI();

    const lista = document.getElementById('lista-noticias-api');
    expect(lista.innerHTML).toContain('Gol bonito');
    expect(lista.innerHTML).toContain('http://a.com');
    expect(lista.innerHTML).toContain('http://img.com/1.jpg');
  });

  test('shows empty message when no articles returned', async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ results: [] })
    });

    await carregarNoticiasAPI();

    const lista = document.getElementById('lista-noticias-api');
    expect(lista.innerHTML).toContain('Nenhuma notícia encontrada.');
  });

  test('renders article without image when image_url is null', async () => {
    const mockArticles = [
      { title: 'No Image', description: 'Desc', link: 'http://a.com', image_url: null }
    ];

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ results: mockArticles })
    });

    await carregarNoticiasAPI();

    const lista = document.getElementById('lista-noticias-api');
    expect(lista.innerHTML).toContain('No Image');
    expect(lista.innerHTML).not.toContain('<img');
  });

  test('renders article with empty description gracefully', async () => {
    const mockArticles = [
      { title: 'Title', description: null, link: 'http://a.com', image_url: null }
    ];

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ results: mockArticles })
    });

    await carregarNoticiasAPI();

    const lista = document.getElementById('lista-noticias-api');
    expect(lista.innerHTML).toContain('Title');
  });

  test('does nothing when lista element does not exist', async () => {
    document.body.innerHTML = '';

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ results: [{ title: 'X' }] })
    });

    await carregarNoticiasAPI();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
