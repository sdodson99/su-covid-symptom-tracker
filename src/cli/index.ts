import submitForm from 'su-covid-daily';
import dotenv from 'dotenv';

(async () => {
  dotenv.config();

  const username = process.env.USERNAME || '';
  const password = process.env.PASSWORD || '';
  const receiptPath = 'dist/receipt.png';

  try {
    await submitForm(username, password, receiptPath);
  } catch (error) {
    console.log(error);
  }
})();
