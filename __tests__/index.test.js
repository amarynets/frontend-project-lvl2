import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { test, expect, beforeEach } from '@jest/globals';

import { genDiff } from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
let expectedFlat;

beforeEach(() => {
  expectedFlat = readFile('expected_file.txt');
});

test('Json Flat Test', () => {
  const firstFilePath = getFixturePath('json/first.json');
  const secondFilePath = getFixturePath('json/second.json');
  expect(genDiff(firstFilePath, secondFilePath, 'stylish')).toBe(expectedFlat);
});

test('YAML Flat Test', () => {
  const firstFilePath = getFixturePath('yaml/first.yml');
  const secondFilePath = getFixturePath('yaml/second.yaml');
  expect(genDiff(firstFilePath, secondFilePath, 'stylish')).toBe(expectedFlat);
});
