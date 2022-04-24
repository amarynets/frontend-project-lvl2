import stylish from './stylish.js';

const formatters = { stylish };

export default (diff, format) => formatters[format](diff);
