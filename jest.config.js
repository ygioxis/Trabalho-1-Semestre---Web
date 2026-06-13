module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/Trabalho2bim'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'Trabalho2bim/script/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov'],
  coverageProvider: 'v8'
};
