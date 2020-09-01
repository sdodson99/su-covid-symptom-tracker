#!/usr/bin/env node

import { Command } from 'commander';
import container from './containers/sucovid-container';
import ContainerType from './containers/container-type';
import SUCOVIDSubmitHandler from './command-handlers/su-covid-submit-handler';

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

const { username, password, output } = program;

const submitHandler = container.get<SUCOVIDSubmitHandler>(
  ContainerType.SUCOVIDSubmitHandler
);

submitHandler.handleSubmit(username, password, output);
