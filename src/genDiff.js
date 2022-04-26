import path from 'path';
import _ from 'lodash';
import { readFileSync } from 'fs';
import parse from './parsers.js';
import format from './formaters/index.js';

const readFile = (filePath) => readFileSync(filePath);

const getFileFormat = (filePath) => path.extname(filePath).slice(1);

const buildDiff = (left, right) => {
  const leftKeys = _.keys(left);
  const rightKeys = _.keys(right);
  const keys = _.sortBy(_.union(leftKeys, rightKeys));
  const diff = keys.map((key) => {
    if (!_.has(left, key)) {
      return {
        name: key,
        value: right[key],
        action: 'added',
      };
    }
    if (!_.has(right, key)) {
      return {
        name: key,
        value: left[key],
        action: 'deleted',
      };
    }
    if (_.isObject(left[key]) && _.isObject(right[key])) {
      return {
        name: key,
        children: buildDiff(left[key], right[key]),
        action: 'nested',
      };
    }
    if (_.isEqual(left[key], right[key])) {
      return {
        name: key,
        value: left[key],
        action: 'not-changed',
      };
    }
    return {
      name: key,
      prev: left[key],
      current: right[key],
      action: 'changed',
    };
  });
  return diff;
};

const genDiff = (filepath1, filepath2, formater = 'stylish') => {
  const leftFile = readFile(filepath1);
  const rightFile = readFile(filepath2);
  const left = parse(leftFile, getFileFormat(filepath1));
  const right = parse(rightFile, getFileFormat(filepath2));
  const diffRes = buildDiff(left, right);
  const diff = format(diffRes, formater);
  return diff;
};

export default genDiff;
