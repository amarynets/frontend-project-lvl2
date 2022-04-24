import _ from 'lodash';

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

export default (diff, indent = 4, depth = 1) => {
  const formattedStr = [
    '{',
    ...buildFormattedArray(diff, indent, depth),
    '}',
  ].join('\n');
  return formattedStr;
};
