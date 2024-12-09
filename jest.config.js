/** @type {import('ts-jest').JestConfigWithTsJest} * */

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.(t|j)sx?$': ['ts-jest', {}],
  },
  testPathIgnorePatterns: ['./node_modules/', './dist/'],
  modulePathIgnorePatterns: ['./dist/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/p-map.ts',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'json', 'text'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
