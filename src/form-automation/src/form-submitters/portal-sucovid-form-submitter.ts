import { Page, Response, Browser } from 'playwright-chromium';
import SUCOVIDFormSubmitter from './sucovid-form-submitter';
import Logger from '../loggers/logger';
import BrowserFactory from '../browsers/browser-factory';
import SUCOVIDFormSubmissionExecutor from '../form-submission-executors/sucovid-form-submission-executor';
import CampusStatus from '../campus-status-inputters/campus-status';
import CampusStatusInputter from '../campus-status-inputters/campus-status-inputter';

const Constants = {
  PATIENT_PORTAL_URL: 'https://stevenson.medicatconnect.com/',
  USERNAME_INPUT_SELECTOR: '#ctl00_loginBar_txtUserName',
  PASSWORD_INPUT_SELECTOR: '#ctl00_loginBar_txtPassword',
  LOGIN_BUTTON_SELECTOR: '#ctl00_loginBar_lbtnLogin',
  COVID_NAV_LINK_SELECTOR: '#ctl00_navBar_liStatus a',
  COVID_FORM_START_SELECTOR: '#ctl00_ContentPlaceHolder1_divForms a',
  NO_COVID_CONTACT_INPUT_SELECTOR: '#ctl00_ContentPlaceHolder1_RadioGroup44789_1',
  NO_COVID_SYMPTOMS_INPUT_SELECTOR: '#ctl00_ContentPlaceHolder1_RadioGroup45054_1',
  SUBMIT_BUTTON_SELECTOR: '#ctl00_ContentPlaceHolder1_lbtnSubmit',
};

class PortalSUCOVIDFormSubmitter implements SUCOVIDFormSubmitter {
  private browserFactory: BrowserFactory;
  private submissionExecutor: SUCOVIDFormSubmissionExecutor;
  private campusStatusInputter: CampusStatusInputter;
  private logger: Logger;

  constructor(
    browserFactory: BrowserFactory,
    submissionExecutor: SUCOVIDFormSubmissionExecutor,
    campusStatusInputter: CampusStatusInputter,
    logger: Logger
  ) {
    this.browserFactory = browserFactory;
    this.submissionExecutor = submissionExecutor;
    this.campusStatusInputter = campusStatusInputter;
    this.logger = logger;
  }

  async submitForm(username: string, password: string, campusStatus: CampusStatus): Promise<void> {
    this.logger.log('Running automated COVID student symptom tracker form submission.');

    this.logger.log('Opening patient portal...');

    const browser = await this.browserFactory.createBrowser();
    const page = await this.createPatientPortalPage(browser);

    try {
      this.logger.log('Logging in...');
      await this.inputUsername(page, username);
      await this.inputPassword(page, password);
      await this.executeLogin(page);
      this.logger.log('Login successful.');

      this.logger.log('Navigating to COVID form...');
      await this.goToCoronavirusForm(page);

      this.logger.log('Filling out form...');
      await this.campusStatusInputter.inputCampusStatus(campusStatus, page);
      await this.inputNoCoronavirusContact(page);
      await this.inputNoCoronavirusSymptoms(page);

      await this.submissionExecutor.executeSubmit(page);

      this.logger.log('All done!');
    } finally {
      await browser.close();
    }
  }

  private async createPatientPortalPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage();

    await page.goto(Constants.PATIENT_PORTAL_URL);

    return page;
  }

  private async inputUsername(page: Page, username: string): Promise<void> {
    const usernameInput = await page.$(Constants.USERNAME_INPUT_SELECTOR);

    if (!usernameInput) {
      throw new Error('Username input not found.');
    }

    await usernameInput.type(username);
  }

  private async inputPassword(page: Page, password: string): Promise<void> {
    const passwordInput = await page.$(Constants.PASSWORD_INPUT_SELECTOR);

    if (!passwordInput) {
      throw new Error('Password input not found.');
    }

    await passwordInput.type(password);
  }

  private async executeLogin(page: Page): Promise<void> {
    const loginButton = await page.$(Constants.LOGIN_BUTTON_SELECTOR);

    if (!loginButton) {
      throw new Error('Login button not found.');
    }

    await Promise.all([loginButton.click(), this.waitForNavigationWithTimeout(page)]);

    const stillOnLoginPage = page.url().includes('login');
    if (stillOnLoginPage) {
      throw new Error('Login failed.');
    }
  }

  private async goToCoronavirusForm(page: Page): Promise<void> {
    const covidNavLink = await page.$(Constants.COVID_NAV_LINK_SELECTOR);

    if (!covidNavLink) {
      throw new Error('Coronavirus navigation link not found.');
    }

    await Promise.all([covidNavLink.click(), this.waitForNavigationWithTimeout(page)]);

    const formStartLink = await page.$(Constants.COVID_FORM_START_SELECTOR);

    if (!formStartLink) {
      throw new Error('Coronavirus form start link not found.');
    }

    await Promise.all([formStartLink.click(), this.waitForNavigationWithTimeout(page)]);
  }

  private async inputNoCoronavirusContact(page: Page): Promise<void> {
    const noCoronavirusContactInput = await page.$(Constants.NO_COVID_CONTACT_INPUT_SELECTOR);

    if (!noCoronavirusContactInput) {
      throw new Error('No coronavirus contact input not found.');
    }

    await noCoronavirusContactInput.click();
  }

  private async inputNoCoronavirusSymptoms(page: Page): Promise<void> {
    const noCoronavirusSymptomsInput = await page.$(Constants.NO_COVID_SYMPTOMS_INPUT_SELECTOR);

    if (!noCoronavirusSymptomsInput) {
      throw new Error('No coronavirus symptoms input not found.');
    }

    await noCoronavirusSymptomsInput.click();
  }

  private async waitForNavigationWithTimeout(page: Page): Promise<Response | null> {
    const timeoutMinutes = 10;
    const timeoutMilliseconds = timeoutMinutes * 60 * 1000;

    return page.waitForNavigation({ timeout: timeoutMilliseconds });
  }
}

export default PortalSUCOVIDFormSubmitter;

export { Constants };
