import { inject, injectable } from 'inversify';
import ContainerType from '../containers/container-type';
import inquirer from 'inquirer';
import cron from 'node-cron';
import moment from 'moment';
import submitForm from 'su-covid-daily';
import createReceiptPath from '../receipts/receipt-path-creator';
import promptCredentialsIfNotProvided from '../prompts/credentials-prompt';
import CredentialsProvider from '../credentials/credentials-provider';

@injectable()
class SUCOVIDScheduleHandler {
  private credentialsProvider: CredentialsProvider;

  constructor(
    @inject(ContainerType.CredentialsProvider)
    credentialsProvider: CredentialsProvider
  ) {
    this.credentialsProvider = credentialsProvider;
  }

  async handleSchedule(
    hourInput: string,
    username: string,
    password: string,
    outputDirectory: string
  ) {
    const receiptPath = createReceiptPath(outputDirectory);
    const credentials = await promptCredentialsIfNotProvided(
      username,
      password,
      this.credentialsProvider
    );
    const hour = await this.promptHourIfNotProvided(hourInput);

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
      console.error(
        'Error: Invalid hour input. Hour must be between 0 and 23.'
      );
    }
  }

  async promptHourIfNotProvided(providedHour: string): Promise<number> {
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
}

export default SUCOVIDScheduleHandler;
