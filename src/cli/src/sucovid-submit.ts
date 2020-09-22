#!/usr/bin/env node

import { Command } from 'commander';
import container from './containers/sucovid-container';
import ContainerType from './containers/container-type';
import SUCOVIDSubmitHandler from './command-handlers/su-covid-submit-handler';

const program = new Command();

program
  .option('-u, --username <username>', 'username for Stevenson University')
  .option('-p, --password <password>', 'password for Stevenson University')
  .option(
    '-o, --output <directory>',
    'output directory for submission receipt',
    process.cwd()
  )
  .option('-s, --no-submit', 'skip form submission');

program.parse();

const { username, password, output, submit } = program;

let skipSubmission = !submit;
if (process.env.NODE_ENV === 'development') {
  skipSubmission = true;
}

const submitHandler = container.get<SUCOVIDSubmitHandler>(
  ContainerType.SUCOVIDSubmitHandler
);

submitHandler.handleSubmit(username, password, output, skipSubmission);
