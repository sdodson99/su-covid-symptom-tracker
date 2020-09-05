import { Page, Response, Browser } from 'playwright-chromium';
import SUCOVIDFormSubmitter from './sucovid-form-submitter';
import Logger from '../loggers/logger';
import BrowserFactory from '../browsers/browser-factory';

const Constants = {
  PATIENT_PORTAL_URL: 'https://stevenson.medicatconnect.com/',
  USERNAME_INPUT_SELECTOR: '#ctl00_loginBar_txtUserName',
  PASSWORD_INPUT_SELECTOR: '#ctl00_loginBar_txtPassword',
  LOGIN_BUTTON_SELECTOR: '#ctl00_loginBar_lbtnLogin',
  COVID_NAV_LINK_SELECTOR: '#ctl00_navBar_liStatus a',
  COVID_FORM_START_SELECTOR: '#ctl00_ContentPlaceHolder1_lblStatusForm a',
  NOT_ON_CAMPUS_INPUT_SELECTOR: '#ctl00_ContentPlaceHolder1_44954No',
  COVID_CONTACT_QUESTION_SELECTOR: 'xpath=//span[contains(text(), "1.")]',
  NO_COVID_CONTACT_INPUT_SELECTOR: '23894',
  COVID_SYMPTOMS_QUESTION_SELECTOR: 'xpath=//span[contains(text(), "2.")]',
  NO_COVID_SYMPTOMS_INPUT_SELECTOR: '23896',
  SUBMIT_BUTTON_SELECTOR: '#ctl00_ContentPlaceHolder1_lbtnSubmit',
};

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

    await page.goto(Constants.PATIENT_PORTAL_URL);

    return page;
  }

  async inputUsername(page: Page, username: string): Promise<void> {
    const usernameInput = await page.$(Constants.USERNAME_INPUT_SELECTOR);

    if (!usernameInput) {
      throw new Error('Username input not found.');
    }

    await usernameInput.type(username);
  }

  async inputPassword(page: Page, password: string): Promise<void> {
    const passwordInput = await page.$(Constants.PASSWORD_INPUT_SELECTOR);

    if (!passwordInput) {
      throw new Error('Password input not found.');
    }

    await passwordInput.type(password);
  }

  async executeLogin(page: Page): Promise<void> {
    const loginButton = await page.$(Constants.LOGIN_BUTTON_SELECTOR);

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
    const covidNavLink = await page.$(Constants.COVID_NAV_LINK_SELECTOR);

    if (!covidNavLink) {
      throw new Error('Coronavirus navigation link not found.');
    }

    await Promise.all([
      covidNavLink.click(),
      this.waitForNavigationWithTimeout(page),
    ]);

    const formStartLink = await page.$(Constants.COVID_FORM_START_SELECTOR);

    if (!formStartLink) {
      throw new Error('Coronavirus form start link not found.');
    }

    await Promise.all([
      formStartLink.click(),
      this.waitForNavigationWithTimeout(page),
    ]);
  }

  async inputNotOnCampus(page: Page): Promise<void> {
    const notOnCampusInput = await page.$(
      Constants.NOT_ON_CAMPUS_INPUT_SELECTOR
    );

    if (!notOnCampusInput) {
      throw new Error('Not on campus input not found.');
    }

    await notOnCampusInput.click();
  }

  async inputNoCoronavirusContact(page: Page): Promise<void> {
    const coronavirusContactQuestion = await page.$(
      Constants.COVID_CONTACT_QUESTION_SELECTOR
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

    await noCoronavirusContactInput.selectOption(
      Constants.NO_COVID_CONTACT_INPUT_SELECTOR
    );
  }

  async inputNoCoronavirusSymptoms(page: Page): Promise<void> {
    const coronavirusSymptomsQuestion = await page.$(
      Constants.COVID_SYMPTOMS_QUESTION_SELECTOR
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

    await noCoronavirusSymptomsInput.selectOption(
      Constants.NO_COVID_SYMPTOMS_INPUT_SELECTOR
    );
  }

  async executeSubmit(page: Page): Promise<void> {
    const submitButton = await page.$(Constants.SUBMIT_BUTTON_SELECTOR);

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

export { Constants };
