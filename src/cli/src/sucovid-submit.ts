#!/usr/bin/env node

import { Command } from 'commander';
import moment from 'moment';
import path from 'path';
import submitForm from 'su-covid-daily';
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
  )
  .action(async (options) => {
    const timeStamp = moment().format();
    const receiptPath = path.join(options.output, `receipt-${timeStamp}.png`);

    const { username, password } = options;
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
  });

program.parse();
