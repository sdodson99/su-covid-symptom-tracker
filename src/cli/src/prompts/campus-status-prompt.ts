import inquirer from 'inquirer';
import { CampusStatus } from 'su-covid-daily';

async function promptCampusStatus(): Promise<CampusStatus> {
  const campusStatusInput = await inquirer.prompt([
    {
      name: 'campusStatus',
      message: 'Are you currently living on campus?',
      type: 'list',
      choices: ['Yes', 'No', 'No Answer'],
    },
  ]);

  const campusStatus = getCampusStatusFromInput(campusStatusInput.campusStatus);

  return campusStatus;
}

function getCampusStatusFromInput(input: string): CampusStatus {
  if (input === 'Yes') {
    return CampusStatus.ON_CAMPUS;
  } else if (input === 'No') {
    return CampusStatus.NOT_ON_CAMPUS;
  } else {
    return CampusStatus.NO_ANSWER;
  }
}

export default promptCampusStatus;
