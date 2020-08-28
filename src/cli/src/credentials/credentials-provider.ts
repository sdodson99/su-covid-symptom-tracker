import Credentials from './credentials';

export default interface CredentialsProvider {
  getCredentials(): Promise<Credentials | null>;
  saveCredentials(username: string, password: string): Promise<void>;
}
