import { Page } from 'playwright-chromium';
import SUCOVIDFormSubmissionExecutor from './sucovid-form-submission-executor';
import Logger from '../loggers/logger';

const Constants = {
  SUBMIT_BUTTON_SELECTOR: '#ctl00_ContentPlaceHolder1_lbtnSubmit',
};

class DefaultSUCOVIDFormSubmissionExecutor implements SUCOVIDFormSubmissionExecutor {
  private logger: Logger;
  private submitTimeoutMilliseconds: number;

  constructor(logger: Logger) {
    this.logger = logger;

    const timeoutMinutes = 10;
    const timeoutMilliseconds = timeoutMinutes * 60 * 1000;
    this.submitTimeoutMilliseconds = timeoutMilliseconds;
  }

  async executeSubmit(page: Page): Promise<void> {
    this.logger.log('Submitting form...');

    const submitButton = await page.$(Constants.SUBMIT_BUTTON_SELECTOR);

    if (!submitButton) {
      throw new Error('Submit button not found.');
    }

    await Promise.all([submitButton.click(), page.waitForNavigation({ timeout: this.submitTimeoutMilliseconds })]);

    this.logger.log('Form submission successful.');
  }
}

export default DefaultSUCOVIDFormSubmissionExecutor;

export { Constants };
