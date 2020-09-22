#!/usr/bin/env node

import { Command } from 'commander';
import UpdateNotifier from 'update-notifier';

const version = '1.2.0';

(async () => {
  const notifier = UpdateNotifier({
    shouldNotifyInNpmScript: true,
    updateCheckInterval: 1,
    pkg: {
      name: 'su-covid-daily-cli',
      version: version,
    },
  });

  await notifier.fetchInfo();

  notifier.notify({ isGlobal: true });

  const program = new Command();

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
})();
