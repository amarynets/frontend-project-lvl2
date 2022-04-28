import _ from 'lodash';

const genDiff = (left, right) => {
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
        children: genDiff(left[key], right[key]),
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

export default genDiff;
