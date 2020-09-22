import { Browser } from 'playwright-chromium';

interface BrowserFactory {
  createBrowser(): Promise<Browser>;
}

export default BrowserFactory;
