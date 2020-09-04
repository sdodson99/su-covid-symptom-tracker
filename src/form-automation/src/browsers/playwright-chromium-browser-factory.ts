import { chromium, Browser } from 'playwright-chromium';
import BrowserFactory from './browser-factory';

class PlaywrightChromiumBrowserFactory implements BrowserFactory {
  createBrowser(): Promise<Browser> {
    return chromium.launch();
  }
}

export default PlaywrightChromiumBrowserFactory;
