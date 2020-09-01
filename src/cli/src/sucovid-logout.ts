#!/usr/bin/env node

import { Command } from 'commander';
import container from './containers/sucovid-container';
import ContainerType from './containers/container-type';
import CredentialsProvider from './credentials/credentials-provider';

const program = new Command();

program.parse();

(async () => {
  const credentialsProvider = container.get<CredentialsProvider>(
    ContainerType.CredentialsProvider
  );

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
