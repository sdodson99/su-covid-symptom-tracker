#!/usr/bin/env node

import { Command } from 'commander';
import KeytarCredentialsProvider from './credentials/keytar-credentials-provider';

const credentialsProvider = new KeytarCredentialsProvider();

const program = new Command();

program.parse();

(async () => {
  const isLoggedIn = await credentialsProvider.hasCredentials();

  if (isLoggedIn) {
    try {
      await credentialsProvider.removeCredentials();
      console.log('Successfully logged out.');
    } catch (error) {
      console.error(error.message);
    }
  } else {
    console.error('You are not logged in.');
  }
})();
