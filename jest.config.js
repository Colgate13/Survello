/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov', 'html', 'json', 'text', 'clover'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/I*.ts',
    '!src/**/**/**/Errors/*.ts',
    '!src/**/repositories/**/*.ts',
    '!src/**/**/useCases/**/infra/**/Controllers/*.ts',
    '!src/**/mappers/*.ts',
    '!src/**/@types/*.ts',
    '!src/**/config/*.ts',
    '!src/infra/**/*.ts',
    '!src/core/**/*.ts',
    '!src/shared/Error/*',
    '!src/shared/Config/**',
    '!src/server.ts',
    '!src/app.ts',
  ],
};
// modules / User / useCases / AuthenticateUser / infra / http / Controllers;
