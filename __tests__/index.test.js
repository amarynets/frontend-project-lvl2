import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { test, expect } from '@jest/globals';

import { genDiff } from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const firstFilePath = getFixturePath('first.json');
const secondFilePath = getFixturePath('second.json')

test('Base test', () => {
  const expected = readFile('expected_file.txt');
  expect(genDiff(firstFilePath, secondFilePath, 'plain')).toBe(expected);
})