import { Page, Response, Browser } from 'playwright-chromium';
import SUCOVIDFormSubmitter from './sucovid-form-submitter';
import Logger from '../loggers/logger';
import BrowserFactory from '../browsers/browser-factory';

class PortalSUCOVIDFormSubmitter implements SUCOVIDFormSubmitter {
  private logger: Logger;
  private skipSubmission: boolean;
  private browserFactory: BrowserFactory;

  constructor(
    browserFactory: BrowserFactory,
    logger: Logger,
    skipSubmission = false
  ) {
    this.browserFactory = browserFactory;
    this.logger = logger;
    this.skipSubmission = skipSubmission;
  }

  async submitForm(
    username: string,
    password: string,
    receiptPath: string
  ): Promise<void> {
    this.logger.log(
      'Running automated COVID student symptom tracker form submission.'
    );

    this.logger.log('Opening patient portal...');

    const browser = await this.browserFactory.createBrowser();

    try {
      const page = await this.createPatientPortalPage(browser);

      this.logger.log('Logging in...');
      await this.inputUsername(page, username);
      await this.inputPassword(page, password);
      await this.executeLogin(page);
      this.logger.log('Login successful.');

      this.logger.log('Navigating to COVID form...');
      await this.goToCoronavirusForm(page);

      this.logger.log('Filling out form...');
      await this.inputNotOnCampus(page);
      await this.inputNoCoronavirusContact(page);
      await this.inputNoCoronavirusSymptoms(page);

      // TBD: Convert to polymorphic solution.
      if (!this.skipSubmission) {
        this.logger.log('Submitting form...');
        await this.executeSubmit(page);
        this.logger.log('Form submission successful.');
      } else {
        this.logger.warn('Skipping form submission.');
      }

      this.logger.log('Screenshotting receipt...');
      await page.screenshot({ path: receiptPath });

      this.logger.log(`All done! View your receipt at '${receiptPath}'.`);
    } finally {
      await browser.close();
    }
  }

  async createPatientPortalPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage();

    const patientPortalUrl = 'https://stevenson.medicatconnect.com/';
    await page.goto(patientPortalUrl);

    return page;
  }

  async inputUsername(page: Page, username: string): Promise<void> {
    const usernameInputSelector = '#ctl00_loginBar_txtUserName';
    const usernameInput = await page.$(usernameInputSelector);

    if (!usernameInput) {
      throw new Error('Username input not found.');
    }

    await usernameInput.type(username);
  }

  async inputPassword(page: Page, password: string): Promise<void> {
    const passwordInputSelector = '#ctl00_loginBar_txtPassword';
    const passwordInput = await page.$(passwordInputSelector);

    if (!passwordInput) {
      throw new Error('Password input not found.');
    }

    await passwordInput.type(password);
  }

  async executeLogin(page: Page): Promise<void> {
    const loginButtonSelector = '#ctl00_loginBar_lbtnLogin';
    const loginButton = await page.$(loginButtonSelector);

    if (!loginButton) {
      throw new Error('Login button not found.');
    }

    await Promise.all([
      loginButton.click(),
      this.waitForNavigationWithTimeout(page),
    ]);

    const stillOnLoginPage = page.url().includes('login');
    if (stillOnLoginPage) {
      throw new Error('Login failed.');
    }
  }

  async goToCoronavirusForm(page: Page): Promise<void> {
    const covidNavLinkSelector = '#ctl00_navBar_liStatus a';
    const covidNavLink = await page.$(covidNavLinkSelector);

    if (!covidNavLink) {
      throw new Error('Coronavirus navigation link not found.');
    }

    await Promise.all([
      covidNavLink.click(),
      this.waitForNavigationWithTimeout(page),
    ]);

    const formStartLinkSelector = '#ctl00_ContentPlaceHolder1_lblStatusForm a';
    const formStartLink = await page.$(formStartLinkSelector);

    if (!formStartLink) {
      throw new Error('Coronavirus form start link not found.');
    }

    await Promise.all([
      formStartLink.click(),
      this.waitForNavigationWithTimeout(page),
    ]);
  }

  async inputNotOnCampus(page: Page): Promise<void> {
    const notOnCampusInputSelector = '#ctl00_ContentPlaceHolder1_44954No';
    const notOnCampusInput = await page.$(notOnCampusInputSelector);

    if (!notOnCampusInput) {
      throw new Error('Not on campus input not found.');
    }

    await notOnCampusInput.click();
  }

  async inputNoCoronavirusContact(page: Page): Promise<void> {
    const coronavirusContactQuestionSelector =
      'xpath=//span[contains(text(), "1.")]';
    const coronavirusContactQuestion = await page.$(
      coronavirusContactQuestionSelector
    );

    if (!coronavirusContactQuestion) {
      throw new Error('No coronavirus contact question not found.');
    }

    const coronavirusContactQuestionParent = await coronavirusContactQuestion.$(
      '..'
    );
    if (!coronavirusContactQuestionParent) {
      throw new Error('No coronavirus contact question parent not found.');
    }

    const noCoronavirusContactInputSelector = 'select';
    const noCoronavirusContactInput = await coronavirusContactQuestionParent.$(
      noCoronavirusContactInputSelector
    );

    if (!noCoronavirusContactInput) {
      throw new Error('No coronavirus contact input not found.');
    }

    const noOptionValue = '23894';
    await noCoronavirusContactInput.selectOption(noOptionValue);
  }

  async inputNoCoronavirusSymptoms(page: Page): Promise<void> {
    const coronavirusSymptomsQuestionSelector =
      'xpath=//span[contains(text(), "2.")]';
    const coronavirusSymptomsQuestion = await page.$(
      coronavirusSymptomsQuestionSelector
    );

    if (!coronavirusSymptomsQuestion) {
      throw new Error('No coronavirus symptoms question not found.');
    }

    const coronavirusSymptomsQuestionParent = await coronavirusSymptomsQuestion.$(
      '..'
    );
    if (!coronavirusSymptomsQuestionParent) {
      throw new Error('No coronavirus symptoms question parent not found.');
    }

    const noCoronavirusSymptomsInputSelector = 'select';
    const noCoronavirusSymptomsInput = await coronavirusSymptomsQuestionParent.$(
      noCoronavirusSymptomsInputSelector
    );

    if (!noCoronavirusSymptomsInput) {
      throw new Error('No coronavirus symptoms input not found.');
    }

    const noOptionValue = '23896';
    await noCoronavirusSymptomsInput.selectOption(noOptionValue);
  }

  async executeSubmit(page: Page): Promise<void> {
    const submitButtonSelector = '#ctl00_ContentPlaceHolder1_lbtnSubmit';
    const submitButton = await page.$(submitButtonSelector);

    if (!submitButton) {
      throw new Error('Submit button not found.');
    }

    await Promise.all([
      submitButton.click(),
      this.waitForNavigationWithTimeout(page),
    ]);
  }

  async waitForNavigationWithTimeout(page: Page): Promise<Response | null> {
    const timeoutMinutes = 5;
    const timeoutMilliseconds = timeoutMinutes * 60 * 1000;

    return page.waitForNavigation({ timeout: timeoutMilliseconds });
  }
}

export default PortalSUCOVIDFormSubmitter;
