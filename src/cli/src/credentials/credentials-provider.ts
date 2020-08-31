import Credentials from './credentials';

interface CredentialsProvider {
  getCredentials(): Promise<Credentials | null>;
  saveCredentials(username: string, password: string): Promise<void>;
  hasCredentials(): Promise<boolean>;
  removeCredentials(): Promise<void>;
}

export default CredentialsProvider;
