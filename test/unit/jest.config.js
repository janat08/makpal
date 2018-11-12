module.exports = {
  rootDir: '../../',
  // preset: 'ts-jest',
  setupTestFrameworkScriptFile: './test/unit/jest.unit-test.init.js',
  testPathIgnorePatterns:[
    '/config/', //skip the test.js config file
    '/node_modules/'
  ],
  "reporters": [ "default", "jest-junit" ]
};