import { RuleTester } from '@typescript-eslint/rule-tester';
import * as vitest from 'vitest';
import * as fs from 'fs';
import lints from './lints';
import { ESLint, Linter, SourceCode } from '@typescript-eslint/utils/ts-eslint';
import { createProgram } from 'typescript';
import { ESLintUtils } from '@typescript-eslint/utils';

for (const file of fs.readdirSync('./src/tests')) {
  const text = fs.readFileSync('./src/tests/' + file, { encoding: 'utf-8' });

  for (const lint of lints) {
  }
}
