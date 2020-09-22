import { mock, MockProxy, Matcher } from 'jest-mock-extended';
import PortalSUCOVIDFormSubmitter, { Constants } from './portal-sucovid-form-submitter';
import SUCOVIDFormSubmissionExecutor from '../form-submission-executors/sucovid-form-submission-executor';
import BrowserFactory from '../browsers/browser-factory';
import Logger from '../loggers/logger';
import { Browser, Page, ElementHandle } from 'playwright-chromium';
import CampusStatus from '../campus-status-inputters/campus-status';
import CampusStatusInputter, { CampusStatusInputSelector } from '../campus-status-inputters/campus-status-inputter';

let formSubmitter: PortalSUCOVIDFormSubmitter;
let browserFactory: MockProxy<BrowserFactory>;
let browser: MockProxy<Browser>;
let page: MockProxy<Page>;
let defaultPageElement: MockProxy<ElementHandle<SVGElement | HTMLElement>>;
let submissionExecutor: MockProxy<SUCOVIDFormSubmissionExecutor>;
let logger: MockProxy<Logger>;

beforeEach(() => {
  browserFactory = mock<BrowserFactory>();
  browser = mock<Browser>();
  page = mock<Page>();
  defaultPageElement = mock<ElementHandle<SVGElement | HTMLElement>>();
  submissionExecutor = mock<SUCOVIDFormSubmissionExecutor>();
  logger = mock<Logger>();

  browserFactory.createBrowser.mockResolvedValue(browser);
  browser.newPage.mockResolvedValue(page);
  defaultPageElement.$.mockResolvedValue(defaultPageElement);

  formSubmitter = new PortalSUCOVIDFormSubmitter(
    browserFactory,
    submissionExecutor,
    new CampusStatusInputter(),
    logger
  );
});

test('submit form, executes submission', async () => {
  mockSuccessfulSubmission();

  await formSubmitter.submitForm('username', 'password', CampusStatus.NO_ANSWER);

  expect(submissionExecutor.executeSubmit).toBeCalled();
});

test('submit form, closes browser', async () => {
  mockSuccessfulSubmission();

  await formSubmitter.submitForm('username', 'password', CampusStatus.NO_ANSWER);

  expect(browser.close).toBeCalled();
});

test('submit form, with exception, closes browser', async () => {
  await expect(() => formSubmitter.submitForm('username', 'password', CampusStatus.NO_ANSWER)).rejects.toThrow();
  expect(browser.close).toBeCalled();
});

test('submit form, with username input not found, throws exception', async () => {
  page.$.calledWith(new Matcher<string>((value) => value !== Constants.USERNAME_INPUT_SELECTOR)).mockResolvedValue(
    defaultPageElement
  );

  await expect(() => formSubmitter.submitForm('username', 'password', CampusStatus.NO_ANSWER)).rejects.toThrow(
    'Username input not found.'
  );
});

test('submit form, with password input not found, throws exception', async () => {
  page.$.calledWith(new Matcher<string>((value) => value !== Constants.PASSWORD_INPUT_SELECTOR)).mockResolvedValue(
    defaultPageElement
  );

  await expect(() => formSubmitter.submitForm('username', 'password', CampusStatus.NO_ANSWER)).rejects.toThrow(
    'Password input not found.'
  );
});

test('submit form, with login button not found, throws exception', async () => {
  page.$.calledWith(new Matcher<string>((value) => value !== Constants.LOGIN_BUTTON_SELECTOR)).mockResolvedValue(
    defaultPageElement
  );

  await expect(() => formSubmitter.submitForm('username', 'password', CampusStatus.NO_ANSWER)).rejects.toThrow(
    'Login button not found.'
  );
});

test('submit form, with login failure, throws exception', async () => {
  page.$.mockResolvedValue(defaultPageElement);
  page.url.mockReturnValueOnce('login');

  await expect(() => formSubmitter.submitForm('username', 'password', CampusStatus.NO_ANSWER)).rejects.toThrow(
    'Login failed.'
  );
});

test('submit form, with COVID navigation link not found, throws exception', async () => {
  page.$.calledWith(new Matcher<string>((value) => value !== Constants.COVID_NAV_LINK_SELECTOR)).mockResolvedValue(
    defaultPageElement
  );
  mockSuccessfulLogin();

  await expect(() => formSubmitter.submitForm('username', 'password', CampusStatus.NO_ANSWER)).rejects.toThrow(
    'Coronavirus navigation link not found.'
  );
});

test('submit form, with COVID form start link not found, throws exception', async () => {
  page.$.calledWith(new Matcher<string>((value) => value !== Constants.COVID_FORM_START_SELECTOR)).mockResolvedValue(
    defaultPageElement
  );
  mockSuccessfulLogin();

  await expect(() => formSubmitter.submitForm('username', 'password', CampusStatus.NO_ANSWER)).rejects.toThrow(
    'Coronavirus form start link not found.'
  );
});

test('submit form, with not on campus input not found, throws exception', async () => {
  page.$.calledWith(new Matcher<string>((value) => value !== CampusStatusInputSelector.NO_ANSWER)).mockResolvedValue(
    defaultPageElement
  );
  mockSuccessfulLogin();

  await expect(() => formSubmitter.submitForm('username', 'password', CampusStatus.NO_ANSWER)).rejects.toThrow(
    'Campus status input not found for NO_ANSWER.'
  );
});

test('submit form, with no COVID contact question input not found, throws exception', async () => {
  page.$.calledWith(
    new Matcher<string>((value) => value !== Constants.NO_COVID_CONTACT_INPUT_SELECTOR)
  ).mockResolvedValue(defaultPageElement);
  mockSuccessfulLogin();

  await expect(() => formSubmitter.submitForm('username', 'password', CampusStatus.NO_ANSWER)).rejects.toThrow(
    'No coronavirus contact input not found.'
  );
});

test('submit form, with no COVID symptoms question input not found, throws exception', async () => {
  page.$.calledWith(
    new Matcher<string>((value) => value !== Constants.NO_COVID_SYMPTOMS_INPUT_SELECTOR)
  ).mockResolvedValue(defaultPageElement);
  mockSuccessfulLogin();

  await expect(() => formSubmitter.submitForm('username', 'password', CampusStatus.NO_ANSWER)).rejects.toThrow(
    'No coronavirus symptoms input not found.'
  );
});

function mockSuccessfulSubmission() {
  page.$.mockResolvedValue(defaultPageElement);
  mockSuccessfulLogin();
}

function mockSuccessfulLogin() {
  page.url.mockReturnValueOnce('logged in');
}
