import { AzureFunction, Context } from '@azure/functions';
import submitForm from 'su-covid-daily';
import os from 'os';
import path from 'path';

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
  context.log('Starting daily form submission...', new Date().toISOString());

  const username = process.env.SU_USERNAME;
  const password = process.env.SU_PASSWORD;
  const receiptPath = path.join(os.homedir(), 'receipt.png');

  await submitForm(username, password, receiptPath, context);

  context.log('Finished daily form submission.', new Date().toISOString());
};

export default timerTrigger;
