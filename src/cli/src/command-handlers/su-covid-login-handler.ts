import { injectable, inject } from 'inversify';
import ContainerType from '../containers/container-type';
import CredentialsProvider from '../credentials/credentials-provider';
import promptUsername from '../prompts/username-prompt';
import promptPassword from '../prompts/password-prompt';

@injectable()
class SUCOVIDLoginHandler {
  private credentialsProvider: CredentialsProvider;

  constructor(
    @inject(ContainerType.CredentialsProvider)
    credentialsProvider: CredentialsProvider
  ) {
    this.credentialsProvider = credentialsProvider;
  }

  async handleLogin(username: string, password: string): Promise<void> {
    const isLoggedIn = await this.credentialsProvider.hasCredentials();

    if (!isLoggedIn) {
      if (!username) {
        username = await promptUsername();
      }

      if (!password) {
        password = await promptPassword();
      }

      try {
        await this.credentialsProvider.saveCredentials(username, password);
        console.log('Successfully logged in.');
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.error('You are already logged in.');
    }
  }
}

export default SUCOVIDLoginHandler;
