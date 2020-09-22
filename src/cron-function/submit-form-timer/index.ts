import { AzureFunction, Context } from '@azure/functions';
import { SUCOVIDFormSubmitterBuilder } from 'su-covid-daily';
import moment from 'moment';
import os from 'os';
import path from 'path';
import ContextLogger from '../src/loggers/context-logger';

const timerTrigger: AzureFunction = async function (
  context: Context
): Promise<void> {
  context.log('Starting daily form submission...', new Date().toISOString());

  const skipSubmission = process.env.SU_SKIPSUBMISSION == 'true';
  const username = process.env.SU_USERNAME;
  const password = process.env.SU_PASSWORD;
  const timeStamp = moment().format();
  const receiptPath = path.join(os.homedir(), `receipt-${timeStamp}.png`);

  const contextLogger = new ContextLogger(context);
  const formSubmitterBuilder = new SUCOVIDFormSubmitterBuilder();
  const formSubmitter = formSubmitterBuilder
    .withLogger(contextLogger)
    .withReceipt(receiptPath)
    .withoutSubmission(skipSubmission)
    .build();

  await formSubmitter.submitForm(username, password, receiptPath);

  context.log('Finished daily form submission.', new Date().toISOString());
};

export default timerTrigger;
