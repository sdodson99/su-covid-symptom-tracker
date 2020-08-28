#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import submitForm from 'su-covid-daily';

const program = new Command();

program.name('sucovid');
program.version('0.0.1', '-v, --version', 'Output the current version');

const submitCommand = program
  .command('submit')
  .description('Submit daily COVID symptoms to the Stevenson Wellness Center')
  .option('-u, --username <username>', 'Username for Stevenson Univeristy')
  .option('-p, --password <password>', 'Password for Stevenson Univeristy')
  .option('-o, --output <directory>', 'Output directory for submission receipt.', process.cwd())
  .action(async (options) => {
    const username = options.username;
    const password = options.password;
    const receiptPath = path.join(options.output, 'receipt.png');

    if (!username) {
      console.log(submitCommand.helpInformation());
      console.error('Error: Please provide a username. See usage information above.\n');
    } else if (!password) {
      console.log(submitCommand.helpInformation());
      console.error('Error: Please provide a password. See usage information above.\n');
    } else {
      try {
        await submitForm(username, password, receiptPath, console);
      } catch (error) {
        console.error(error);
      }
    }
  });

program.parse();
