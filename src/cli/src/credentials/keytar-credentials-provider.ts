import keytar from 'keytar';
import Credentials from './credentials';
import CredentialsProvider from './credentials-provider';

const serviceName = 'SU_COVID';

export default class KeytarCredentialsProvider implements CredentialsProvider {
  async getCredentials(): Promise<Credentials | null> {
    const savedCredentialsList = await keytar.findCredentials(serviceName);

    let credentials;
    if (savedCredentialsList.length > 0) {
      const savedCredentials = savedCredentialsList[0];

      credentials = {
        username: savedCredentials.account,
        password: savedCredentials.password,
      };
    } else {
      credentials = null;
    }

    return credentials;
  }

  async saveCredentials(username: string, password: string): Promise<void> {
    await keytar.setPassword(serviceName, username, password);
  }
}
