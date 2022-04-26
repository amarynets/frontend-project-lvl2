#!/usr/bin/env node

import { Command } from 'commander';
import genDiff from '../src/genDiff.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.8.0')
  .option('-f, --format <type>', 'output format', 'stylish')
  .argument('filepath1')
  .argument('filepath2')
  .action(
    (filepath1, filepath2, options) => console.log(genDiff(filepath1, filepath2, options.opts().format)),
  )
  .parse();
