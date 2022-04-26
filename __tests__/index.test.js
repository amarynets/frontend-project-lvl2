import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { test, expect } from '@jest/globals';

import genDiff from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('Test JSON nested', () => {
  const firstFilePath = getFixturePath('json/first.json');
  const secondFilePath = getFixturePath('json/second.json');
  const expectedFlat = readFile('expected_file_stylish.txt');
  expect(genDiff(firstFilePath, secondFilePath, 'stylish')).toBe(expectedFlat);
});

test('Test YAML nested', () => {
  const expectedFlat = readFile('expected_file_stylish.txt');
  const firstFilePath = getFixturePath('yaml/first.yml');
  const secondFilePath = getFixturePath('yaml/second.yaml');
  expect(genDiff(firstFilePath, secondFilePath, 'stylish')).toBe(expectedFlat);
});

test('Test PLAIN formatter', () => {
  const expectedFlat = readFile('expected_file_plain.txt');
  const firstFilePath = getFixturePath('json/first.json');
  const secondFilePath = getFixturePath('json/second.json');
  expect(genDiff(firstFilePath, secondFilePath, 'plain')).toBe(expectedFlat);
});

test('Test JSON formatter', () => {
  const expectedFlat = readFile('expected_file_json.txt');
  const firstFilePath = getFixturePath('json/first.json');
  const secondFilePath = getFixturePath('json/second.json');
  expect(genDiff(firstFilePath, secondFilePath, 'json')).toBe(expectedFlat);
});
