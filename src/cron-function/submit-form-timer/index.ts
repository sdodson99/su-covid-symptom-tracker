import { AzureFunction, Context } from '@azure/functions';
import submitForm from 'su-covid-daily/submit-form';

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
  context.log('Starting daily form submission...', new Date().toISOString());

  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const receiptPath = 'dist/receipt.png';

  submitForm(username, password, receiptPath);

  context.log('Finished daily form submission.', new Date().toISOString());
};

export default timerTrigger;
