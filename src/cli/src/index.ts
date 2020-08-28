#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import submitForm from 'su-covid-daily';
import KeytarCredentialsProvider from './credentials/keytar-credentials-provider';

const credentialsProvider = new KeytarCredentialsProvider();
const program = new Command();

program.name('sucovid');
program.version('0.0.1', '-v, --version', 'Output the current version');
program.description('Quickly submit daily COVID symptoms to the Stevenson University Wellness Center');

program
  .command('submit')
  .description('Submit daily COVID symptoms to the Stevenson University Wellness Center')
  .option('-u, --username <username>', 'Username for Stevenson Univeristy')
  .option('-p, --password <password>', 'Password for Stevenson Univeristy')
  .option('-o, --output <directory>', 'Output directory for submission receipt.', process.cwd())
  .action(async (options) => {
    let username = options.username;
    let password = options.password;
    const receiptPath = path.join(options.output, 'receipt.png');

    const noCredentialsProvided = !username && !password;
    if (noCredentialsProvided) {
      const credentials = await credentialsProvider.getCredentials();

      if (credentials) {
        username = credentials.username;
        password = credentials.password;
      }
    }

    if (!username) {
      username = await promptUsername();
    }

    if (!password) {
      password = await promptPassword();
    }

    try {
      await submitForm(username, password, receiptPath, console);
    } catch (error) {
      console.error(error.message);
    }
  });

program
  .command('login')
  .description('Save credentials for the Stevenson University Wellness Center')
  .option('-u, --username <username>', 'Username for Stevenson Univeristy')
  .option('-p, --password <password>', 'Password for Stevenson Univeristy')
  .action(async (options) => {
    let username = options.username;
    let password = options.password;

    if (!username) {
      username = await promptUsername();
    }

    if (!password) {
      password = await promptPassword();
    }

    try {
      await credentialsProvider.saveCredentials(username, password);
      console.log('Successfully saved credentials.');
    } catch (error) {
      console.error(error.message);
    }
  });

program
  .command('logout')
  .description('Remove credentials for the Stevenson University Wellness Center')
  .action(async () => {
    try {
      await credentialsProvider.removeCredentials();
      console.log('Successfully removed credentials.');
    } catch (error) {
      console.error(error.message);
    }
  });

program.parse();

async function promptUsername() {
  const usernameInput = await inquirer.prompt([
    {
      name: 'username',
      message: 'Enter your username for Stevenson University:',
      type: 'input',
    },
  ]);

  return usernameInput.username;
}

async function promptPassword() {
  const passwordInput = await inquirer.prompt([
    {
      name: 'password',
      message: 'Enter your password for Stevenson University:',
      type: 'password',
    },
  ]);

  return passwordInput.password;
}
