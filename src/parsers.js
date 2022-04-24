import * as YAML from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yaml: YAML.load,
  yml: YAML.load,
};

export default (fileData, ext) => parsers[ext](fileData);
