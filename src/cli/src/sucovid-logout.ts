#!/usr/bin/env node

import { Command } from 'commander';
import KeytarCredentialsProvider from './credentials/keytar-credentials-provider';

const credentialsProvider = new KeytarCredentialsProvider();

const program = new Command();

program.action(async () => {
  try {
    await credentialsProvider.removeCredentials();
    console.log('Successfully removed credentials.');
  } catch (error) {
    console.error(error.message);
  }
});

program.parse();
