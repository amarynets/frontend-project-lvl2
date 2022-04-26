import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const buildFormattedArray = (diff, parents = []) => {
  const diffWithoutUnchangedItems = diff.filter((item) => item.action !== 'not-changed');
  const formattedArray = diffWithoutUnchangedItems.map((item) => {
    switch (item.action) {
      case 'added':
        return `Property '${[...parents, item.name].join('.')}' was added with value: ${stringify(item.value)}`;
      case 'deleted':
        return `Property '${[...parents, item.name].join('.')}' was removed`;
      case 'changed':
        return `Property '${[...parents, item.name].join('.')}' was updated. From ${stringify(item.prev)} to ${stringify(item.current)}`;
      case 'nested':
        return buildFormattedArray(item.children, [...parents, item.name]).join('\n');
      default:
        throw new Error('Unexpected action');
    }
  });
  return formattedArray;
};

export default (diff) => buildFormattedArray(diff).join('\n');
