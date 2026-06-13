describe('CONFIG', () => {
  test('defines CONFIG with API_KEY', () => {
    const { CONFIG } = require('../script/config.js');
    expect(typeof CONFIG).toBe('object');
    expect(CONFIG).toHaveProperty('API_KEY');
    expect(typeof CONFIG.API_KEY).toBe('string');
    expect(CONFIG.API_KEY.length).toBeGreaterThan(0);
  });
});
