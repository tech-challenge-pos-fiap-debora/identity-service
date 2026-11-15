const domainCriticalGlobs = [
  'src/identity/domain/value-objects/email.vo.ts',
  'src/shared/domain/value-objects/document.vo.ts',
  'src/shared/domain/value-objects/plate.vo.ts',
];

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'src/.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: domainCriticalGlobs,
  coveragePathIgnorePatterns: ['\\.spec\\.ts$'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 78,
      functions: 80,
      lines: 80,
    },
  },
};
