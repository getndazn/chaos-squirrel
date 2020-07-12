module.exports = {
  collectCoverage: true,
  coverageReporters: ['text', 'html', 'lcov'],
  testEnvironment: 'node',
  projects: ['packages/*'],
  clearMocks: true,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '.test.[tj]s$',
  moduleFileExtensions: ['js', 'ts'],
};
