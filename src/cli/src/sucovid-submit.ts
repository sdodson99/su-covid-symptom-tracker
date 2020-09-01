#!/usr/bin/env node

import { Command } from 'commander';
import submitForm from 'su-covid-daily';
import createReceiptPath from './receipts/receipt-path-creator';
import promptCredentialsIfNotProvided from './prompts/credentials-prompt';
import container from './containers/sucovid-container';
import ContainerType from './containers/container-type';
import CredentialsProvider from './credentials/credentials-provider';

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
  const credentialsProvider = container.get<CredentialsProvider>(
    ContainerType.CredentialsProvider
  );

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
