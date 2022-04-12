import _ from 'lodash';
import { readFileSync } from 'fs';

const readFile = (path) => readFileSync(path);

const jsonParse = (data) => JSON.parse(data);

const parseFileData = (fileData, parser) => parser(fileData);

const buildFlatDiff = (left, right) => {
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
    } if (!_.has(right, key)) {
      return {
        name: key,
        value: left[key],
        action: 'deleted',
      };
    } if (_.isEqual(left[key], right[key])) {
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

const formatDiff = (diff, options) => {
  const formattedArray = diff.map((item) => {
    switch (item.action) {
      case 'added':
        return `+ ${item.name}: ${item.value}`;
      case 'not-changed':
        return `  ${item.name}: '${item.value}`;
      case 'deleted':
        return `- ${item.name}: ${item.value}`;
      case 'changed':
        return [`- ${item.name}: ${item.prev}`, `+ ${item.name}: ${item.current}`].join('\n');
      default:
        break;
    }
  });
  const formattedStr = [
    '{',
    ...formattedArray,
    '}',
  ].join('\n');
  return formattedStr;
};

const genDiff = (filepath1, filepath2, options) => {
  console.log(filepath1, filepath2, options);
  const leftFile = readFile(filepath1);
  const rightFile = readFile(filepath2);
  const left = parseFileData(leftFile, jsonParse);
  const right = parseFileData(rightFile, jsonParse);
  const diffRes = buildFlatDiff(left, right);
  const diff = formatDiff(diffRes);
  return diff;
};

export { genDiff };
