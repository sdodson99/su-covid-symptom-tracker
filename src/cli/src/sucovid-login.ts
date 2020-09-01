#!/usr/bin/env node

import { Command } from 'commander';
import container from './containers/sucovid-container';
import ContainerType from './containers/container-type';
import SUCOVIDLoginHandler from './command-handlers/su-covid-login-handler';

const program = new Command();

program
  .option('-u, --username <username>', 'Username for Stevenson Univeristy')
  .option('-p, --password <password>', 'Password for Stevenson Univeristy');

program.parse();

const { username, password } = program;

const handler = container.get<SUCOVIDLoginHandler>(
  ContainerType.SUCOVIDLoginHandler
);

handler.handleLogin(username, password);
