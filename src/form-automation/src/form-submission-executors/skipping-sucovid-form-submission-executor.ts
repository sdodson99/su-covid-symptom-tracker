import SUCOVIDFormSubmissionExecutor from './sucovid-form-submission-executor';
import Logger from '../loggers/logger';

class SkippingSUCOVIDFormSubmissionExecutor implements SUCOVIDFormSubmissionExecutor {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async executeSubmit(): Promise<void> {
    this.logger.warn('Skipping form submission.');
  }
}

export default SkippingSUCOVIDFormSubmissionExecutor;
