#!/usr/bin/env node

import { Command } from 'commander';
import submitForm from 'su-covid-daily';
import createReceiptPath from './receipts/receipt-path-creator';
import KeytarCredentialsProvider from './credentials/keytar-credentials-provider';
import promptCredentialsIfNotProvided from './prompts/credentials-prompt';

const credentialsProvider = new KeytarCredentialsProvider();

const program = new Command();

program
  .option('-u, --username <username>', 'username for Stevenson Univeristy')
  .option('-p, --password <password>', 'password for Stevenson Univeristy')
  .option(
    '-o, --output <directory>',
    'output directory for submission receipt',
    process.cwd()
  );

program.parse();

(async () => {
  const { username, password, output } = program;

  const receiptPath = createReceiptPath(output);
  const credentials = await promptCredentialsIfNotProvided(
    username,
    password,
    credentialsProvider
  );

  try {
    await submitForm(
      credentials.username,
      credentials.password,
      receiptPath,
      console
    );
  } catch (error) {
    console.error(error.message);
  }
})();