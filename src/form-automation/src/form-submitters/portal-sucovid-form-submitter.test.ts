import { mock, MockProxy } from 'jest-mock-extended';
import PortalSUCOVIDFormSubmitter, { Constants } from './portal-sucovid-form-submitter';
import SUCOVIDFormSubmissionExecutor from '../form-submission-executors/sucovid-form-submission-executor';
import BrowserFactory from '../browsers/browser-factory';
import Logger from '../loggers/logger';
import { Browser, Page, ElementHandle } from 'playwright-chromium';

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
  page.url.mockReturnValue('logged in');
  defaultPageElement.$.mockResolvedValue(defaultPageElement);

  formSubmitter = new PortalSUCOVIDFormSubmitter(browserFactory, submissionExecutor, logger);
});

test('submit form, executes submission', async () => {
  page.$.mockResolvedValue(defaultPageElement);

  await formSubmitter.submitForm('username', 'password');

  expect(submissionExecutor.executeSubmit).toBeCalled();
});

test('submit form, closes browser', async () => {
  page.$.mockResolvedValue(defaultPageElement);

  await formSubmitter.submitForm('username', 'password');

  expect(browser.close).toBeCalled();
});

test('submit form, with exception, closes browser', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(null);

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow();
  expect(browser.close).toBeCalled();
});

test('submit form, with username input not found, throws exception', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(null);

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow('Username input not found.');
});

test('submit form, with password input not found, throws exception', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.PASSWORD_INPUT_SELECTOR).mockResolvedValue(null);

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow('Password input not found.');
});

test('submit form, with login button not found, throws exception', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.PASSWORD_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.LOGIN_BUTTON_SELECTOR).mockResolvedValue(null);

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow('Login button not found.');
});

test('submit form, with login failure, throws exception', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.PASSWORD_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.LOGIN_BUTTON_SELECTOR).mockResolvedValue(defaultPageElement);
  page.url.mockReturnValue('login');

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow('Login failed.');
});

test('submit form, with COVID navigation link not found, throws exception', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.PASSWORD_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.LOGIN_BUTTON_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_NAV_LINK_SELECTOR).mockResolvedValue(null);

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow(
    'Coronavirus navigation link not found.'
  );
});

test('submit form, with COVID form start link not found, throws exception', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.PASSWORD_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.LOGIN_BUTTON_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_NAV_LINK_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_FORM_START_SELECTOR).mockResolvedValue(null);

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow(
    'Coronavirus form start link not found.'
  );
});

test('submit form, with not on campus input not found, throws exception', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.PASSWORD_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.LOGIN_BUTTON_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_NAV_LINK_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_FORM_START_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.NOT_ON_CAMPUS_INPUT_SELECTOR).mockResolvedValue(null);

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow(
    'Not on campus input not found.'
  );
});

test('submit form, with COVID contact question not found, throws exception', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.PASSWORD_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.LOGIN_BUTTON_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_NAV_LINK_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_FORM_START_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.NOT_ON_CAMPUS_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_CONTACT_QUESTION_SELECTOR).mockResolvedValue(null);

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow(
    'No coronavirus contact question not found.'
  );
});

test('submit form, with COVID contact question parent not found, throws exception', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.PASSWORD_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.LOGIN_BUTTON_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_NAV_LINK_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_FORM_START_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.NOT_ON_CAMPUS_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  const coronavirusContactQuestion = mock<ElementHandle<SVGElement | HTMLElement>>();
  page.$.calledWith(Constants.COVID_CONTACT_QUESTION_SELECTOR).mockResolvedValue(coronavirusContactQuestion);
  coronavirusContactQuestion.$.calledWith('..').mockResolvedValueOnce(null);

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow(
    'No coronavirus contact question parent not found.'
  );
});

test('submit form, with COVID contact question input not found, throws exception', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.PASSWORD_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.LOGIN_BUTTON_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_NAV_LINK_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_FORM_START_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.NOT_ON_CAMPUS_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  const contactQuestionElement = mock<ElementHandle<SVGElement | HTMLElement>>();
  page.$.calledWith(Constants.COVID_CONTACT_QUESTION_SELECTOR).mockResolvedValue(contactQuestionElement);
  contactQuestionElement.$.calledWith('..').mockResolvedValueOnce(contactQuestionElement);
  contactQuestionElement.$.calledWith('select').mockResolvedValueOnce(null);

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow(
    'No coronavirus contact input not found.'
  );
});

test('submit form, with COVID symptoms question not found, throws exception', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.PASSWORD_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.LOGIN_BUTTON_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_NAV_LINK_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_FORM_START_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.NOT_ON_CAMPUS_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  const contactQuestionElement = mock<ElementHandle<SVGElement | HTMLElement>>();
  page.$.calledWith(Constants.COVID_CONTACT_QUESTION_SELECTOR).mockResolvedValue(contactQuestionElement);
  contactQuestionElement.$.calledWith('..').mockResolvedValueOnce(contactQuestionElement);
  contactQuestionElement.$.calledWith('select').mockResolvedValueOnce(contactQuestionElement);
  page.$.calledWith(Constants.COVID_SYMPTOMS_QUESTION_SELECTOR).mockResolvedValue(null);

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow(
    'No coronavirus symptoms question not found.'
  );
});

test('submit form, with COVID symptoms question parent not found, throws exception', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.PASSWORD_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.LOGIN_BUTTON_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_NAV_LINK_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_FORM_START_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.NOT_ON_CAMPUS_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  const contactQuestionElement = mock<ElementHandle<SVGElement | HTMLElement>>();
  page.$.calledWith(Constants.COVID_CONTACT_QUESTION_SELECTOR).mockResolvedValue(contactQuestionElement);
  contactQuestionElement.$.calledWith('..').mockResolvedValueOnce(contactQuestionElement);
  contactQuestionElement.$.calledWith('select').mockResolvedValueOnce(contactQuestionElement);
  const symptomsQuestionElement = mock<ElementHandle<SVGElement | HTMLElement>>();
  page.$.calledWith(Constants.COVID_SYMPTOMS_QUESTION_SELECTOR).mockResolvedValue(symptomsQuestionElement);
  symptomsQuestionElement.$.calledWith('..').mockResolvedValueOnce(null);

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow(
    'No coronavirus symptoms question parent not found.'
  );
});

test('submit form, with COVID symptoms question input not found, throws exception', async () => {
  page.$.calledWith(Constants.USERNAME_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.PASSWORD_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.LOGIN_BUTTON_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_NAV_LINK_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.COVID_FORM_START_SELECTOR).mockResolvedValue(defaultPageElement);
  page.$.calledWith(Constants.NOT_ON_CAMPUS_INPUT_SELECTOR).mockResolvedValue(defaultPageElement);
  const contactQuestionElement = mock<ElementHandle<SVGElement | HTMLElement>>();
  page.$.calledWith(Constants.COVID_CONTACT_QUESTION_SELECTOR).mockResolvedValue(contactQuestionElement);
  contactQuestionElement.$.calledWith('..').mockResolvedValueOnce(contactQuestionElement);
  contactQuestionElement.$.calledWith('select').mockResolvedValueOnce(contactQuestionElement);
  const symptomsQuestionElement = mock<ElementHandle<SVGElement | HTMLElement>>();
  page.$.calledWith(Constants.COVID_SYMPTOMS_QUESTION_SELECTOR).mockResolvedValue(symptomsQuestionElement);
  symptomsQuestionElement.$.calledWith('..').mockResolvedValueOnce(symptomsQuestionElement);
  symptomsQuestionElement.$.calledWith('select').mockResolvedValueOnce(null);

  await expect(() => formSubmitter.submitForm('username', 'password')).rejects.toThrow(
    'No coronavirus symptoms input not found.'
  );
});
