#!/usr/bin/env node

import { Command } from 'commander';

const version = '1.0.10';

const program = new Command();

console.log(process.env.NODE_ENV);

program
  .name('sucovid')
  .version(version, '-v, --version', 'output the current version')
  .description(
    'quickly submit daily COVID symptoms to the Stevenson University Wellness Center'
  )
  .command(
    'submit',
    'submit daily COVID symptoms to the Stevenson University Wellness Center'
  )
  .command(
    'schedule',
    'schedule the submission command to repeatedly run at a daily time'
  )
  .command(
    'login',
    'save credentials for the Stevenson University Wellness Center'
  )
  .command(
    'logout',
    'remove credentials for the Stevenson University Wellness Center'
  );

program.parse();
