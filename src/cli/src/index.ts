#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import submitForm from 'su-covid-daily';
import cron from 'node-cron';
import moment from 'moment';
import KeytarCredentialsProvider from './credentials/keytar-credentials-provider';
import Credentials from './credentials/credentials';

const credentialsProvider = new KeytarCredentialsProvider();
const program = new Command();

program.name('sucovid');
program.version('0.0.1', '-v, --version', 'Output the current version');
program.description(
  'Quickly submit daily COVID symptoms to the Stevenson University Wellness Center'
);

program
  .command('submit')
  .description(
    'Submit daily COVID symptoms to the Stevenson University Wellness Center'
  )
  .option('-u, --username <username>', 'Username for Stevenson Univeristy')
  .option('-p, --password <password>', 'Password for Stevenson Univeristy')
  .option(
    '-o, --output <directory>',
    'Output directory for submission receipt',
    process.cwd()
  )
  .action(async (options) => {
    const timeStamp = moment().format();
    const receiptPath = path.join(options.output, `receipt-${timeStamp}.png`);
    const credentials = await getCredentialsFromOptions(options);

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

program
  .command('schedule')
  .description(
    'Schedule the submission command to repeatedly run at a daily time'
  )
  .option('-u, --username <username>', 'Username for Stevenson Univeristy')
  .option('-p, --password <password>', 'Password for Stevenson Univeristy')
  .option(
    '-o, --output <directory>',
    'Output directory for submission receipt',
    process.cwd()
  )
  .option(
    '-h, --hour <number>',
    'The hour of the day to execute the submission (0-23)'
  )
  .action(async (options) => {
    const receiptPath = path.join(options.output, 'receipt.png');
    const credentials = await getCredentialsFromOptions(options);
    let hour = options.hour;

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

    const numericHour = Number(hour);
    const isValidHour =
      !Number.isNaN(numericHour) && numericHour >= 0 && numericHour <= 23;

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
      console.error(
        'Error: Invalid hour input. Hour must be between 0 and 23.'
      );
    }
  });

program
  .command('login')
  .description('Save credentials for the Stevenson University Wellness Center')
  .option('-u, --username <username>', 'Username for Stevenson Univeristy')
  .option('-p, --password <password>', 'Password for Stevenson Univeristy')
  .action(async (options) => {
    let username = options.username;
    let password = options.password;

    if (!username) {
      username = await promptUsername();
    }

    if (!password) {
      password = await promptPassword();
    }

    try {
      await credentialsProvider.saveCredentials(username, password);
      console.log('Successfully saved credentials.');
    } catch (error) {
      console.error(error.message);
    }
  });

program
  .command('logout')
  .description(
    'Remove credentials for the Stevenson University Wellness Center'
  )
  .action(async () => {
    try {
      await credentialsProvider.removeCredentials();
      console.log('Successfully removed credentials.');
    } catch (error) {
      console.error(error.message);
    }
  });

program.parse();

async function getCredentialsFromOptions(options: any): Promise<Credentials> {
  let { username, password } = options;

  const noCredentialsProvided = !username && !password;
  if (noCredentialsProvided) {
    const saveCredentials = await credentialsProvider.getCredentials();

    if (saveCredentials) {
      username = saveCredentials.username;
      password = saveCredentials.password;
    }
  }

  if (!username) {
    username = await promptUsername();
  }

  if (!password) {
    password = await promptPassword();
  }

  return {
    username,
    password,
  };
}

async function promptUsername() {
  const usernameInput = await inquirer.prompt([
    {
      name: 'username',
      message: 'Enter your username for Stevenson University:',
      type: 'input',
    },
  ]);

  return usernameInput.username;
}

async function promptPassword() {
  const passwordInput = await inquirer.prompt([
    {
      name: 'password',
      message: 'Enter your password for Stevenson University:',
      type: 'password',
    },
  ]);

  return passwordInput.password;
}
