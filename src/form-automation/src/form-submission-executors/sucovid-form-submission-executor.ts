import { Page } from 'playwright-chromium';

interface SUCOVIDFormSubmissionExecutor {
  executeSubmit(page: Page): Promise<void>;
}

export default SUCOVIDFormSubmissionExecutor;
