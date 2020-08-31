#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import cron from 'node-cron';
import moment from 'moment';
import submitForm from 'su-covid-daily';
import createReceiptPath from './receipts/receipt-path-creator';
import promptCredentialsIfNotProvided from './prompts/credentials-prompt';
import KeytarCredentialsProvider from './credentials/keytar-credentials-provider';

const credentialsProvider = new KeytarCredentialsProvider();

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

(async () => {
  const { username, password, output } = program;

  const receiptPath = createReceiptPath(output);
  const credentials = await promptCredentialsIfNotProvided(
    username,
    password,
    credentialsProvider
  );
  const hour = await promptHourIfNotProvided(program.hour);

  const isValidHour = !Number.isNaN(hour) && hour >= 0 && hour <= 23;

  if (isValidHour) {
    const cronExpression = `0 0 ${hour} * * *`;

    const validCronExpression = cron.validate(cronExpression);
    if (validCronExpression) {
      cron.schedule(cronExpression, async () => {
        try {
          await submitForm(
            credentials.username,
            credentials.password,
            receiptPath,
            console
          );
        } catch (error) {
          console.error(error.message);
        }
      });

      const time = moment().hour(hour).minute(0).format('h:mm a');
      console.log(
        `Successfully scheduled submission for ${time}. Closing the application will cancel the scheduled submission.`
      );
    } else {
      console.error('Error: Invalid CRON expresson.');
    }
  } else {
    console.error('Error: Invalid hour input. Hour must be between 0 and 23.');
  }
})();

async function promptHourIfNotProvided(providedHour: string): Promise<number> {
  let hour = providedHour;

  if (!hour) {
    const hourInput = await inquirer.prompt([
      {
        message:
          'What hour of the day would you like the submission to run? (0-23)',
        type: 'number',
        name: 'hour',
        validate: (hour) =>
          (hour >= 0 && hour <= 23) ||
          'Hour must be between 0 and 23. Please try again.',
      },
    ]);

    hour = hourInput.hour;
  }

  return Number(hour);
}
