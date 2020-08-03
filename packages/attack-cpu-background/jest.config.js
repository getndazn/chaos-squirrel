module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  coverageReporters: ['text', 'html', 'lcov'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '.test.[tj]s$',
  moduleFileExtensions: ['js', 'ts'],
};
