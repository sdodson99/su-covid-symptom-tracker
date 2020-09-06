import SUCOVIDFormSubmitter from './sucovid-form-submitter';
import PortalSUCOVIDFormSubmitter from './portal-sucovid-form-submitter';
import BrowserFactory from '../browsers/browser-factory';
import Logger from '../loggers/logger';
import PlaywrightChromiumBrowserFactory from '../browsers/playwright-chromium-browser-factory';
import SUCOVIDFormSubmissionExecutor from '../form-submission-executors/sucovid-form-submission-executor';
import DefaultSUCOVIDFormSubmissionExecutor from '../form-submission-executors/default-sucovid-form-submission-executor';
import SkippingSUCOVIDFormSubmissionExecutor from '../form-submission-executors/skipping-sucovid-form-submission-executor';
import ReceiptSUCOVIDFormSubmissionExecutor from '../form-submission-executors/receipt-sucovid-form-submission-executor';

class SUCOVIDFormSubmitterBuilder {
  private browserFactory: BrowserFactory;
  private logger: Logger;
  private skipSubmission: boolean;
  private receiptPath?: string;

  constructor(browserFactory?: PlaywrightChromiumBrowserFactory) {
    this.browserFactory = browserFactory || new PlaywrightChromiumBrowserFactory();
    this.logger = console;
    this.skipSubmission = false;
  }

  withLogger(logger: Logger): SUCOVIDFormSubmitterBuilder {
    this.logger = logger;
    return this;
  }

  withoutSubmission(skipSubmission: boolean): SUCOVIDFormSubmitterBuilder {
    this.skipSubmission = skipSubmission;
    return this;
  }

  withReceipt(receiptPath: string): SUCOVIDFormSubmitterBuilder {
    this.receiptPath = receiptPath;
    return this;
  }

  build(): SUCOVIDFormSubmitter {
    const submissionExecutor = this.buildSubmissionExecutor();

    return new PortalSUCOVIDFormSubmitter(this.browserFactory, submissionExecutor, this.logger);
  }

  buildSubmissionExecutor(): SUCOVIDFormSubmissionExecutor {
    let submissionExecutor: SUCOVIDFormSubmissionExecutor;

    if (this.skipSubmission) {
      submissionExecutor = new SkippingSUCOVIDFormSubmissionExecutor(this.logger);
    } else {
      submissionExecutor = new DefaultSUCOVIDFormSubmissionExecutor(this.logger);
    }

    if (this.receiptPath) {
      submissionExecutor = new ReceiptSUCOVIDFormSubmissionExecutor(this.receiptPath, submissionExecutor, this.logger);
    }

    return submissionExecutor;
  }
}

export default SUCOVIDFormSubmitterBuilder;
