import puppeteer from 'puppeteer';

export default async function submitForm(username: string, password: string, receiptPath: string) {
  try {
    console.log('Running automated COVID student symptom tracker form submission.');

    console.log('Opening patient portal...');
    const browser = await createDesktopBrowser();
    const page = await createPatientPortalPage(browser);

    console.log('Logging in...');
    await inputUsername(page, username);
    await inputPassword(page, password);
    await executeLogin(page);
    console.log('Login successful.');

    console.log('Navigating to COVID form...');
    await goToCoronavirusForm(page);

    console.log('Filling out form...');
    await inputNotOnCampus(page);
    await inputNoCoronavirusContact(page);
    await inputNoCoronavirusSymptoms(page);

    console.log('Submitting form...');
    await executeSubmit(page);
    console.log('Form submission successful.');

    console.log('Screenshotting receipt...');
    await page.screenshot({ path: receiptPath });

    console.log(`All done! View your receipt at '${receiptPath}'.`);

    await browser.close();
  } catch (error) {
    console.error(error.message);
    console.log(error);
  }
}

async function createDesktopBrowser() {
  return await puppeteer.launch({
    defaultViewport: {
      height: 500,
      width: 1400,
    },
  });
}

async function createPatientPortalPage(browser: puppeteer.Browser) {
  const page = await browser.newPage();

  const patientPortalUrl = 'https://stevenson.medicatconnect.com/';
  await page.goto(patientPortalUrl);

  return page;
}

async function inputUsername(page: puppeteer.Page, username: string) {
  const usernameInputSelector = '#ctl00_loginBar_txtUserName';
  const usernameInput = await page.$(usernameInputSelector);

  if (!usernameInput) {
    throw new Error('Username input not found.');
  }

  await usernameInput.type(username);
}

async function inputPassword(page: puppeteer.Page, password: string) {
  const passwordInputSelector = '#ctl00_loginBar_txtPassword';
  const passwordInput = await page.$(passwordInputSelector);

  if (!passwordInput) {
    throw new Error('Password input not found.');
  }

  await passwordInput.type(password);
}

async function executeLogin(page: puppeteer.Page) {
  const loginButtonSelector = '#ctl00_loginBar_lbtnLogin';
  const loginButton = await page.$(loginButtonSelector);

  if (!loginButton) {
    throw new Error('Login button not found.');
  }

  await Promise.all([loginButton.click(), page.waitForNavigation()]);
}

async function goToCoronavirusForm(page: puppeteer.Page) {
  const covidNavLinkSelector = '#ctl00_navBar_liStatus a';
  const covidNavLink = await page.$(covidNavLinkSelector);

  if (!covidNavLink) {
    throw new Error('Coronavirus navigation link not found.');
  }

  await Promise.all([covidNavLink.click(), page.waitForNavigation()]);

  const formStartLinkSelector = '#ctl00_ContentPlaceHolder1_lblStatusForm a';
  const formStartLink = await page.$(formStartLinkSelector);

  if (!formStartLink) {
    throw new Error('Coronavirus form start link not found.');
  }

  await Promise.all([formStartLink.click(), page.waitForNavigation()]);
}

async function inputNotOnCampus(page: puppeteer.Page) {
  const notOnCampusInputSelector = '#ctl00_ContentPlaceHolder1_44954No';
  const notOnCampusInput = await page.$(notOnCampusInputSelector);

  if (!notOnCampusInput) {
    throw new Error('Not on campus input not found.');
  }

  await notOnCampusInput.click();
}

async function inputNoCoronavirusContact(page: puppeteer.Page) {
  const noCoronavirusContactInputSelector = '#ctl00_ContentPlaceHolder1_ComboBox44789-1';
  const noCoronavirusContactInput = await page.$(noCoronavirusContactInputSelector);

  if (!noCoronavirusContactInput) {
    throw new Error('No coronavirus contact input not found.');
  }

  const noOptionValue = '23894';
  await noCoronavirusContactInput.select(noOptionValue);
}

async function inputNoCoronavirusSymptoms(page: puppeteer.Page) {
  const noCoronavirusSymptomsInputSelector = '#ctl00_ContentPlaceHolder1_ComboBox4490622053';
  const noCoronavirusSymptomsInput = await page.$(noCoronavirusSymptomsInputSelector);

  if (!noCoronavirusSymptomsInput) {
    throw new Error('No coronavirus symptoms input not found.');
  }

  const noOptionValue = '23896';
  await noCoronavirusSymptomsInput.select(noOptionValue);
}

async function executeSubmit(page: puppeteer.Page) {
  const submitButtonSelector = '#ctl00_ContentPlaceHolder1_lbtnSubmit';
  const submitButton = await page.$(submitButtonSelector);

  if (!submitButton) {
    throw new Error('Submit button not found.');
  }

  await Promise.all([submitButton.click(), page.waitForNavigation()]);
}
