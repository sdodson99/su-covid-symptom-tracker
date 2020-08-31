import keytar from 'keytar';
import Credentials from './credentials';
import CredentialsProvider from './credentials-provider';

const SERVICE_NAME = 'SU_COVID';

class KeytarCredentialsProvider implements CredentialsProvider {
  async getCredentials(): Promise<Credentials | null> {
    const savedCredentialsList = await keytar.findCredentials(SERVICE_NAME);

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
    await keytar.setPassword(SERVICE_NAME, username, password);
  }

  async removeCredentials(): Promise<void> {
    const credentials = await this.getCredentials();

    if (credentials) {
      await keytar.deletePassword(SERVICE_NAME, credentials.username);
    }
  }
}

export default KeytarCredentialsProvider;
