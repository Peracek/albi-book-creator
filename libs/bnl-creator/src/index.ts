import { program } from '@commander-js/extra-typings';

program.command('list').action(async () => {
  const things = ['one', 'two', 'three'];
  things.forEach((thing) => console.log(thing));
});

program.parse();
