import path from 'path';
import { readFileSync } from 'fs';
import parse from './parsers.js';
import format from './formaters/index.js';
import genDiff from './genDiff.js';

const readFile = (filePath) => readFileSync(path.resolve(filePath));

const getFileFormat = (filePath) => path.extname(filePath).slice(1);

export default (filepath1, filepath2, formater = 'stylish') => {
  const leftFile = readFile(filepath1);
  const rightFile = readFile(filepath2);
  console.log(filepath1, filepath2, formater);
  const left = parse(leftFile, getFileFormat(filepath1));
  const right = parse(rightFile, getFileFormat(filepath2));
  console.log(left, right);
  const diffRes = genDiff(left, right);
  const diff = format(diffRes, formater);
  return diff;
};
