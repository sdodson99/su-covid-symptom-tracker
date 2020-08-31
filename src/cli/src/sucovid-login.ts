#!/usr/bin/env node

import { Command } from 'commander';
import promptUsername from './prompts/username-prompt';
import promptPassword from './prompts/password-prompt';
import KeytarCredentialsProvider from './credentials/keytar-credentials-provider';

const credentialsProvider = new KeytarCredentialsProvider();

const program = new Command();

program
  .option('-u, --username <username>', 'Username for Stevenson Univeristy')
  .option('-p, --password <password>', 'Password for Stevenson Univeristy');

program.parse();

(async () => {
  let username = program.username;
  let password = program.password;

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
})();
