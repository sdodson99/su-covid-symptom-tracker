import SUCOVIDFormSubmitter from './sucovid-form-submitter';
import PortalSUCOVIDFormSubmitter from './portal-sucovid-form-submitter';
import BrowserFactory from '../browsers/browser-factory';
import Logger from '../loggers/logger';
import PlaywrightChromiumBrowserFactory from '../browsers/playwright-chromium-browser-factory';

class SUCOVIDFormSubmitterBuilder {
  private browserFactory: BrowserFactory;
  private logger: Logger;
  private skipSubmission: boolean;

  constructor() {
    this.browserFactory = new PlaywrightChromiumBrowserFactory();
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

  build(): SUCOVIDFormSubmitter {
    return new PortalSUCOVIDFormSubmitter(
      this.browserFactory,
      this.logger,
      this.skipSubmission
    );
  }
}

export default SUCOVIDFormSubmitterBuilder;
