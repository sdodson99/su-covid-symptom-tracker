#!/usr/bin/env node

import submitForm from 'su-covid-daily';

(async () => {
  const username = process.env.USERNAME || '';
  const password = process.env.PASSWORD || '';
  const receiptPath = 'dist/receipt.png';

  try {
    await submitForm(username, password, receiptPath, console);
  } catch (error) {
    console.log(error);
  }
})();
