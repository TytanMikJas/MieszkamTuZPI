import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePaths: ['.'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/modules/**/*.ts', '!src/modules/**/*.module.ts', '!src/modules/**/*.dto.ts', '!src/modules/**/*-dto.ts', 
    '!src/modules/**/dto/*.ts', '!src/modules/**/*.strings.ts', '!src/modules/**/*.util.ts','!src/modules/**/*.utils.ts', '!src/modules/**/*.exception.ts'
  ],
  coveragePathIgnorePatterns: ['src/server/console', 'src/server/migration'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
};

export default config;