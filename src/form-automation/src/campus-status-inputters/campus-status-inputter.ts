import { Page } from 'playwright-chromium';
import CampusStatus from './campus-status';

const CampusStatusInputSelector = {
  ON_CAMPUS: '#ctl00_ContentPlaceHolder1_44954Yes',
  NOT_ON_CAMPUS: '#ctl00_ContentPlaceHolder1_44954No',
  NO_ANSWER: '#ctl00_ContentPlaceHolder1_44954NoAnswer',
};

class CampusStatusInputter {
  async inputCampusStatus(campusStatus: CampusStatus, page: Page): Promise<void> {
    const campusStatusInputSelector = this.getCampusStatusInputSelector(campusStatus);
    const campusStatusInput = await page.$(campusStatusInputSelector);

    if (!campusStatusInput) {
      throw new Error(`Campus status input not found for ${CampusStatus[campusStatus]}.`);
    }

    await campusStatusInput.click();
  }

  private getCampusStatusInputSelector(status: CampusStatus) {
    if (status === CampusStatus.ON_CAMPUS) {
      return CampusStatusInputSelector.ON_CAMPUS;
    } else if (status === CampusStatus.NOT_ON_CAMPUS) {
      return CampusStatusInputSelector.NOT_ON_CAMPUS;
    } else {
      return CampusStatusInputSelector.NO_ANSWER;
    }
  }
}

export default CampusStatusInputter;

export { CampusStatusInputSelector };
