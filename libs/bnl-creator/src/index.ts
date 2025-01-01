import { program } from '@commander-js/extra-typings';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import { BnlYamlFile } from './typings';
import { bnlCreator } from './lib/bnl-creator';

program
  .command('load <path>')
  .description('Load a YAML file from the specified path')
  .action(async (path) => {
    try {
      const fileContents = await fs.readFile(path, 'utf8');
      const yamlData = yaml.loadAll(fileContents) as BnlYamlFile;
      const outputFilePath = path.replace('.yaml', '.bnl');
      bnlCreator(yamlData, outputFilePath);
    } catch (error) {
      // @ts-expect-error
      console.error(`Error loading YAML file: ${error.message}`);
    }
  });

program.parse();
