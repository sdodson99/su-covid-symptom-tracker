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
    await this.removeCredentials();
    await keytar.setPassword(SERVICE_NAME, username, password);
  }

  async hasCredentials(): Promise<boolean> {
    const credentials = await this.getCredentials();

    return credentials !== null;
  }

  async removeCredentials(): Promise<void> {
    const savedCredentialsList = await keytar.findCredentials(SERVICE_NAME);

    const removeCredentialsPromises = savedCredentialsList.map(async (c) => {
      await keytar.deletePassword(SERVICE_NAME, c.account);
    });

    await Promise.all(removeCredentialsPromises);
  }
}

export default KeytarCredentialsProvider;
