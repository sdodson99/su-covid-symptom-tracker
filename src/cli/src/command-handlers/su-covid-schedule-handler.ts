import { inject, injectable } from 'inversify';
import ContainerType from '../containers/container-type';
import inquirer from 'inquirer';
import cron from 'node-cron';
import moment from 'moment';
import { SUCOVIDFormSubmitterBuilder } from 'su-covid-daily';
import createReceiptPath from '../receipts/receipt-path-creator';
import promptCredentialsIfNotProvided from '../prompts/credentials-prompt';
import promptCampusStatus from '../prompts/campus-status-prompt';
import CredentialsProvider from '../credentials/credentials-provider';

@injectable()
class SUCOVIDScheduleHandler {
  private formSubmitterBuilder: SUCOVIDFormSubmitterBuilder;
  private credentialsProvider: CredentialsProvider;

  constructor(
    @inject(ContainerType.SUCOVIDFormSubmitterBuilder)
    formSubmitterBuilder: SUCOVIDFormSubmitterBuilder,
    @inject(ContainerType.CredentialsProvider)
    credentialsProvider: CredentialsProvider
  ) {
    this.formSubmitterBuilder = formSubmitterBuilder;
    this.credentialsProvider = credentialsProvider;
  }

  async handleSchedule(
    hourInput: string,
    username: string,
    password: string,
    outputDirectory: string,
    skipSubmission = false,
    skipReceipt = false
  ) {
    const receiptPath = createReceiptPath(outputDirectory);
    const credentials = await promptCredentialsIfNotProvided(
      username,
      password,
      this.credentialsProvider
    );
    const campusStatus = await promptCampusStatus();
    const hour = await this.promptHourIfNotProvided(hourInput);

    const isValidHour = !Number.isNaN(hour) && hour >= 0 && hour <= 23;

    if (isValidHour) {
      const cronExpression = `0 0 ${hour} * * *`;

      const validCronExpression = cron.validate(cronExpression);
      if (validCronExpression) {
        cron.schedule(cronExpression, async () => {
          if (!skipReceipt) {
            this.formSubmitterBuilder.withReceipt(receiptPath);
          }

          const formSubmitter = this.formSubmitterBuilder
            .withoutSubmission(skipSubmission)
            .build();

          try {
            await formSubmitter.submitForm(
              credentials.username,
              credentials.password,
              campusStatus
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
