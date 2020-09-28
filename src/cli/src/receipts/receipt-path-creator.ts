import path from 'path';
import moment from 'moment';

function createReceiptPath(directory: string): string {
  const timeStamp = moment().format('MM-DD-YYYY-h-mm-ss');
  const receiptPath = path.join(directory, `receipt-${timeStamp}.png`);

  return receiptPath;
}

export default createReceiptPath;
