import { AzureFunction, Context } from '@azure/functions';
import { PlaywrightSUCOVIDFormSubmitter } from 'su-covid-daily';
import moment from 'moment';
import os from 'os';
import path from 'path';
import ContextLogger from '../src/loggers/context-logger';

const timerTrigger: AzureFunction = async function (
  context: Context
): Promise<void> {
  context.log('Starting daily form submission...', new Date().toISOString());

  const contextLogger = new ContextLogger(context);
  const skipSubmission = process.env.SU_SKIPSUBMISSION == 'true';
  const formSubmitter = new PlaywrightSUCOVIDFormSubmitter(
    contextLogger,
    skipSubmission
  );

  const username = process.env.SU_USERNAME;
  const password = process.env.SU_PASSWORD;
  const timeStamp = moment().format();
  const receiptPath = path.join(os.homedir(), `receipt-${timeStamp}.png`);

  await formSubmitter.submitForm(username, password, receiptPath);

  context.log('Finished daily form submission.', new Date().toISOString());
};

export default timerTrigger;
