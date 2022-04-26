import stylish from './stylish.js';
import plain from './plain.js';

const formatters = { stylish, plain };

export default (diff, formater) => formatters[formater](diff);
