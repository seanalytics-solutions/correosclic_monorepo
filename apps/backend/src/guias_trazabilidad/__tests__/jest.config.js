module.exports = {
  displayName: 'GuiasTrazabilidad',
  testMatch: [
    '<rootDir>/../guias_trazabilidad/__tests__/**/*.spec.ts'
  ],
  collectCoverageFrom: [
    '../guias_trazabilidad/**/*.ts',
    '!../guias_trazabilidad/**/*.spec.ts',
    '!../guias_trazabilidad/**/*.interface.ts',
    '!../guias_trazabilidad/**/*.dto.ts',
    '!../guias_trazabilidad/__tests__/**/*'
  ],
  coverageDirectory: 'coverage/guias_trazabilidad',
  coverageReporters: ['text', 'lcov', 'html'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../../..',
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>/..'],
  moduleNameMapper: {
    '^../(.*)$': '<rootDir>/../$1'
  },
  setupFilesAfterEnv: ['<rootDir>/../guias_trazabilidad/__tests__/setup/jest.setup.ts'],
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};