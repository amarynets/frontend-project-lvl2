import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { test, expect, describe } from '@jest/globals';

import genDiff from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const testTable = [
  ['json/first.json', 'json/second.json', 'stylish', 'expected_file_stylish.txt'],
  ['yaml/first.yml', 'yaml/second.yaml', 'stylish', 'expected_file_stylish.txt'],
  ['json/first.json', 'json/second.json', 'plain', 'expected_file_plain.txt'],
  ['json/first.json', 'json/second.json', 'json', 'expected_file_json.txt'],
];

describe.each(testTable)('Test diff', (first, second, formatter, expectedResultFile) => {
  test('Formatter result comparising', () => {
    const firstFilePath = getFixturePath(first);
    const secondFilePath = getFixturePath(second);
    const expected = readFile(expectedResultFile);
    expect(genDiff(firstFilePath, secondFilePath, formatter)).toBe(expected);
  });
});
