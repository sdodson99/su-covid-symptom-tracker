import { Page } from 'playwright-chromium';
import SUCOVIDFormSubmissionExecutor from './sucovid-form-submission-executor';
import Logger from '../loggers/logger';

class ReceiptSUCOVIDFormSubmissionExecutor implements SUCOVIDFormSubmissionExecutor {
  private receiptPath: string;
  private formSubmissionExecutor: SUCOVIDFormSubmissionExecutor;
  private logger: Logger;

  constructor(receiptPath: string, formSubmissionExecutor: SUCOVIDFormSubmissionExecutor, logger: Logger) {
    this.receiptPath = receiptPath;
    this.formSubmissionExecutor = formSubmissionExecutor;
    this.logger = logger;
  }

  async executeSubmit(page: Page): Promise<void> {
    await this.formSubmissionExecutor.executeSubmit(page);

    this.logger.log('Screenshotting receipt...');
    await page.screenshot({ path: this.receiptPath });
    this.logger.log(`Receipt saved to ${this.receiptPath}.`);
  }
}

export default ReceiptSUCOVIDFormSubmissionExecutor;
