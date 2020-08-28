import { chromium, ChromiumBrowser, Page, Response } from 'playwright-chromium';
import ILogger from './loggers/logger';

export default async function submitForm(username: string, password: string, receiptPath: string, logger: ILogger) {
  logger.log('Running automated COVID student symptom tracker form submission.');

  logger.log('Opening patient portal...');

  const browser = await createDesktopBrowser();

  try {
    const page = await createPatientPortalPage(browser);

    logger.log('Logging in...');
    await inputUsername(page, username);
    await inputPassword(page, password);
    await executeLogin(page);
    logger.log('Login successful.');

    logger.log('Navigating to COVID form...');
    await goToCoronavirusForm(page);

    logger.log('Filling out form...');
    await inputNotOnCampus(page);
    await inputNoCoronavirusContact(page);
    await inputNoCoronavirusSymptoms(page);

    logger.log('Submitting form...');
    await executeSubmit(page);
    logger.log('Form submission successful.');

    logger.log('Screenshotting receipt...');
    await page.screenshot({ path: receiptPath });

    logger.log(`All done! View your receipt at '${receiptPath}'.`);
  } finally {
    await browser.close();
  }
}

async function createDesktopBrowser() {
  return await chromium.launch();
}

async function createPatientPortalPage(browser: ChromiumBrowser) {
  const page = await browser.newPage();

  const patientPortalUrl = 'https://stevenson.medicatconnect.com/';
  await page.goto(patientPortalUrl);

  return page;
}

async function inputUsername(page: Page, username: string) {
  const usernameInputSelector = '#ctl00_loginBar_txtUserName';
  const usernameInput = await page.$(usernameInputSelector);

  if (!usernameInput) {
    throw new Error('Username input not found.');
  }

  await usernameInput.type(username);
}

async function inputPassword(page: Page, password: string) {
  const passwordInputSelector = '#ctl00_loginBar_txtPassword';
  const passwordInput = await page.$(passwordInputSelector);

  if (!passwordInput) {
    throw new Error('Password input not found.');
  }

  await passwordInput.type(password);
}

async function executeLogin(page: Page) {
  const loginButtonSelector = '#ctl00_loginBar_lbtnLogin';
  const loginButton = await page.$(loginButtonSelector);

  if (!loginButton) {
    throw new Error('Login button not found.');
  }

  await Promise.all([loginButton.click(), waitForNavigationWithTimeout(page)]);

  const stillOnLoginPage = page.url().includes('login');
  if (stillOnLoginPage) {
    throw new Error('Login failed.');
  }
}

async function goToCoronavirusForm(page: Page) {
  const covidNavLinkSelector = '#ctl00_navBar_liStatus a';
  const covidNavLink = await page.$(covidNavLinkSelector);

  if (!covidNavLink) {
    throw new Error('Coronavirus navigation link not found.');
  }

  await Promise.all([covidNavLink.click(), waitForNavigationWithTimeout(page)]);

  const formStartLinkSelector = '#ctl00_ContentPlaceHolder1_lblStatusForm a';
  const formStartLink = await page.$(formStartLinkSelector);

  if (!formStartLink) {
    throw new Error('Coronavirus form start link not found.');
  }

  await Promise.all([formStartLink.click(), waitForNavigationWithTimeout(page)]);
}

async function inputNotOnCampus(page: Page) {
  const notOnCampusInputSelector = '#ctl00_ContentPlaceHolder1_44954No';
  const notOnCampusInput = await page.$(notOnCampusInputSelector);

  if (!notOnCampusInput) {
    throw new Error('Not on campus input not found.');
  }

  await notOnCampusInput.click();
}

async function inputNoCoronavirusContact(page: Page) {
  const coronavirusContactQuestionSelector = "xpath=//span[contains(text(), '1.')]";
  const coronavirusContactQuestion = await page.$(coronavirusContactQuestionSelector);

  if (!coronavirusContactQuestion) {
    throw new Error('No coronavirus contact question not found.');
  }

  const coronavirusContactQuestionParent = await coronavirusContactQuestion.$('..');
  if (!coronavirusContactQuestionParent) {
    throw new Error('No coronavirus contact question parent not found.');
  }

  const noCoronavirusContactInputSelector = 'select';
  const noCoronavirusContactInput = await coronavirusContactQuestionParent.$(noCoronavirusContactInputSelector);

  if (!noCoronavirusContactInput) {
    throw new Error('No coronavirus contact input not found.');
  }

  const noOptionValue = '23894';
  await noCoronavirusContactInput.selectOption(noOptionValue);
}

async function inputNoCoronavirusSymptoms(page: Page) {
  const coronavirusSymptomsQuestionSelector = "xpath=//span[contains(text(), '2.')]";
  const coronavirusSymptomsQuestion = await page.$(coronavirusSymptomsQuestionSelector);

  if (!coronavirusSymptomsQuestion) {
    throw new Error('No coronavirus symptoms question not found.');
  }

  const coronavirusSymptomsQuestionParent = await coronavirusSymptomsQuestion.$('..');
  if (!coronavirusSymptomsQuestionParent) {
    throw new Error('No coronavirus symptoms question parent not found.');
  }

  const noCoronavirusSymptomsInputSelector = 'select';
  const noCoronavirusSymptomsInput = await coronavirusSymptomsQuestionParent.$(noCoronavirusSymptomsInputSelector);

  if (!noCoronavirusSymptomsInput) {
    throw new Error('No coronavirus symptoms input not found.');
  }

  const noOptionValue = '23896';
  await noCoronavirusSymptomsInput.selectOption(noOptionValue);
}

async function executeSubmit(page: Page) {
  const submitButtonSelector = '#ctl00_ContentPlaceHolder1_lbtnSubmit';
  const submitButton = await page.$(submitButtonSelector);

  if (!submitButton) {
    throw new Error('Submit button not found.');
  }

  await Promise.all([submitButton.click(), waitForNavigationWithTimeout(page)]);
}

async function waitForNavigationWithTimeout(page: Page): Promise<Response | null> {
  const timeoutMinutes = 5;
  const timeoutMilliseconds = timeoutMinutes * 60 * 1000;

  return page.waitForNavigation({ timeout: timeoutMilliseconds });
}
