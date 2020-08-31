#!/usr/bin/env node

import { Command } from 'commander';
import pkg from '../package.json';

const program = new Command();

program
  .name('sucovid')
  .version(pkg.version, '-v, --version', 'output the current version')
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
