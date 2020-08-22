import submitForm from './submit-form';
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.USERNAME || '';
const password = process.env.PASSWORD || '';
const receiptPath = 'dist/receipt.png';

submitForm(username, password, receiptPath);
