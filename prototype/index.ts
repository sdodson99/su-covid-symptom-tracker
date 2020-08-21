import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

const patientPortalUrl = 'https://stevenson.medicatconnect.com/';

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      height: 500,
      width: 1400,
    },
  });
  const page = await browser.newPage();

  await page.goto(patientPortalUrl);

  const usernameInput = await page.$('#ctl00_loginBar_txtUserName');
  const username = process.env.USERNAME || '';
  await usernameInput?.type(username);

  const passwordInput = await page.$('#ctl00_loginBar_txtPassword');
  const password = process.env.PASSWORD || '';
  await passwordInput?.type(password);

  const loginButton = await page.$('#ctl00_loginBar_lbtnLogin');
  await Promise.all([loginButton?.click(), page.waitForNavigation()]);

  const covidNavLink = await page.$('#ctl00_navBar_liStatus a');
  await Promise.all([covidNavLink?.click(), page.waitForNavigation()]);

  const formStartLink = await page.$('#ctl00_ContentPlaceHolder1_lblStatusForm a');
  await Promise.all([formStartLink?.click(), page.waitForNavigation()]);

  const onCampusNoInput = await page.$('#ctl00_ContentPlaceHolder1_44954No');
  await onCampusNoInput?.click();

  const covidContactNoInput = await page.$('#ctl00_ContentPlaceHolder1_ComboBox44789-1');
  await covidContactNoInput?.select('23894');

  const covidNoSymptomsInput = await page.$('#ctl00_ContentPlaceHolder1_ComboBox4490622053');
  await covidNoSymptomsInput?.select('23896');

  const submitButton = await page.$('#ctl00_ContentPlaceHolder1_lbtnSubmit');
  await Promise.all([submitButton?.click(), page.waitForNavigation()]);

  await page.screenshot({ path: 'dist/example.png' });

  await browser.close();
})();
