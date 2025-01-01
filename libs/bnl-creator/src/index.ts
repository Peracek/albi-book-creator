import { program } from '@commander-js/extra-typings';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';

program
  .command('load <path>')
  .description('Load a YAML file from the specified path')
  .action(async (path) => {
    try {
      const fileContents = await fs.readFile(path, 'utf8');
      const yamlData = yaml.loadAll(fileContents);
      const [header, quiz, oids] = yamlData;
      console.log({ header, quiz, oids });
    } catch (error) {
      // @ts-expect-error
      console.error(`Error loading YAML file: ${error.message}`);
    }
  });

program.parse();
