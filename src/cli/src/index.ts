#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import submitForm from 'su-covid-daily';

const program = new Command();

program.name('sucovid');
program.version('0.0.1', '-v, --version', 'Output the current version');

program
  .command('submit')
  .description('Submit daily COVID symptoms to the Stevenson Wellness Center')
  .option('-u, --username <username>', 'Username for Stevenson Univeristy')
  .option('-p, --password <password>', 'Password for Stevenson Univeristy')
  .option('-o, --output <directory>', 'Output directory for submission receipt.', process.cwd())
  .action(async (options) => {
    let username = options.username;
    let password = options.password;
    const receiptPath = path.join(options.output, 'receipt.png');

    if (!username) {
      username = await inquirer.prompt<string>([
        {
          name: 'username',
          message: 'Enter your username for Stevenson University:',
          type: 'input',
        },
      ]);
    }

    if (!password) {
      const passwordInput = await inquirer.prompt([
        {
          name: 'password',
          message: 'Enter your password for Stevenson University:',
          type: 'password',
        },
      ]);

      password = passwordInput.password;
    }

    try {
      await submitForm(username, password, receiptPath, console);
    } catch (error) {
      console.error(error);
    }
  });

program.parse();
