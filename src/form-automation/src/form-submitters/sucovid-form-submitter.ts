import CampusStatus from '../campus-status-inputters/campus-status';

interface SUCOVIDFormSubmitter {
  submitForm(username: string, password: string, campusStatus: CampusStatus): Promise<void>;
}

export default SUCOVIDFormSubmitter;
