import path from 'path';
import _ from 'lodash';
import { readFileSync } from 'fs';
import parse from './parsers.js';

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

const addIndent = (indent, depth) => ' '.repeat(indent * depth - 2);

const stringify = (value, indent, depth) => {
  if (!_.isObject(value)) {
    return value;
  }
  const stringifiedValue = [
    '{',
    ...Object.entries(value).map(([k, v]) => `${addIndent(indent, depth + 1)}  ${k}: ${stringify(v, indent, depth + 1)}`),
    `${addIndent(indent, depth)}  }`,
  ].join('\n');
  return stringifiedValue;
};

const buildFormattedArray = (diff, indent, depth) => {
  const formattedArray = diff.map((item) => {
    switch (item.action) {
      case 'added':
        return `${addIndent(indent, depth)}+ ${item.name}: ${stringify(item.value, indent, depth)}`;
      case 'not-changed':
        return `${addIndent(indent, depth)}  ${item.name}: ${stringify(item.value, indent, depth)}`;
      case 'deleted':
        return `${addIndent(indent, depth)}- ${item.name}: ${stringify(item.value, indent, depth)}`;
      case 'changed':
        return [
          `${addIndent(indent, depth)}- ${item.name}: ${stringify(item.prev, indent, depth)}`,
          `${addIndent(indent, depth)}+ ${item.name}: ${stringify(item.current, indent, depth)}`,
        ].join('\n');
      case 'nested':
        return [
          `${addIndent(indent, depth)}  ${item.name}: {`,
          ...buildFormattedArray(item.children, indent, depth + 1),
          `${addIndent(indent, depth)}  }`,
        ].join('\n');
      default:
        throw new Error('Unexpected action');
    }
  });
  return formattedArray;
};

const formatDiff = (diff, indent = 4, depth = 1) => {
  const formattedStr = [
    '{',
    ...buildFormattedArray(diff, indent, depth),
    '}',
  ].join('\n');
  return formattedStr;
};

const genDiff = (filepath1, filepath2, options) => {
  console.log(options);
  const leftFile = readFile(filepath1);
  const rightFile = readFile(filepath2);
  const left = parse(leftFile, getFileFormat(filepath1));
  const right = parse(rightFile, getFileFormat(filepath2));
  const diffRes = buildDiff(left, right);
  const diff = formatDiff(diffRes);
  return diff;
};

export { genDiff, readFile };
