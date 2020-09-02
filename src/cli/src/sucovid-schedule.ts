#!/usr/bin/env node

import { Command } from 'commander';
import container from './containers/sucovid-container';
import ContainerType from './containers/container-type';
import SUCOVIDScheduleHandler from './command-handlers/su-covid-schedule-handler';

const program = new Command();

program
  .option('-u, --username <username>', 'username for Stevenson Univeristy')
  .option('-p, --password <password>', 'password for Stevenson Univeristy')
  .option(
    '-o, --output <directory>',
    'output directory for submission receipt',
    process.cwd()
  )
  .option(
    '-h, --hour <number>',
    'hour of the day to execute the submission (0-23)'
  );

program.parse();

const { hour, username, password, output } = program;

const scheduleHandler = container.get<SUCOVIDScheduleHandler>(
  ContainerType.SUCOVIDScheduleHandler
);

scheduleHandler.handleSchedule(hour, username, password, output);
