import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { test, expect } from '@jest/globals';

import { genDiff } from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
const expectedFlat = readFile('expected_file.txt');

let firstFilePath = getFixturePath('json/first.json');
let secondFilePath = getFixturePath('json/second.json');

test('Json Flat Test', () => {
  expect(genDiff(firstFilePath, secondFilePath, 'plain')).toBe(expectedFlat);
});

firstFilePath = getFixturePath('yaml/first.yml');
secondFilePath = getFixturePath('yaml/second.yaml');

test('YAML Flat Test', () => {
  expect(genDiff(firstFilePath, secondFilePath, 'plain')).toBe(expectedFlat);
});

