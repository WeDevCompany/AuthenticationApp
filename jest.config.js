module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/test/**/*.(spec|test).{js,jsx,ts,tsx}',
    '<rootDir>/test/**/?(*.)(spec|test).{js,jsx,ts,tsx}',
    '<rootDir>**/__test__/**/?(*.)(spec|test).{js,jsx,ts,tsx}',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/data/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/*',
    '<rootDir>/data/*',
    '<rootDir>/node_modules/*',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/data/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/*',
    '<rootDir>/data/*',
    '<rootDir>/node_modules/*',
  ],
};
