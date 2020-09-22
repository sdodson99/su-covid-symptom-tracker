#!/usr/bin/env node

import { Command } from 'commander';
import container from './containers/sucovid-container';
import ContainerType from './containers/container-type';
import SUCOVIDScheduleHandler from './command-handlers/su-covid-schedule-handler';

const program = new Command();

program
  .option('-u, --username <username>', 'username for Stevenson University')
  .option('-p, --password <password>', 'password for Stevenson University')
  .option(
    '-o, --output <directory>',
    'output directory for submission receipt',
    process.cwd()
  )
  .option(
    '-h, --hour <number>',
    'hour of the day to execute the submission (0-23)'
  )
  .option('-s, --no-submit', 'skip form submission')
  .option('-r, --no-receipt', 'skip receipt output');

program.parse();

const { hour, username, password, output, submit, receipt } = program;

let skipSubmission = !submit;
if (process.env.NODE_ENV === 'development') {
  skipSubmission = true;
}

const scheduleHandler = container.get<SUCOVIDScheduleHandler>(
  ContainerType.SUCOVIDScheduleHandler
);

scheduleHandler.handleSchedule(
  hour,
  username,
  password,
  output,
  skipSubmission,
  !receipt
);
