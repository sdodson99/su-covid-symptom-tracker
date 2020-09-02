import { inject, injectable } from 'inversify';
import ContainerType from '../containers/container-type';
import CredentialsProvider from '../credentials/credentials-provider';

@injectable()
class SUCOVIDLogoutHandler {
  private credentialsProvider: CredentialsProvider;

  constructor(
    @inject(ContainerType.CredentialsProvider)
    credentialsProvider: CredentialsProvider
  ) {
    this.credentialsProvider = credentialsProvider;
  }

  async handleLogout() {
    const isLoggedIn = await this.credentialsProvider.hasCredentials();

    if (isLoggedIn) {
      try {
        await this.credentialsProvider.removeCredentials();
        console.log('Successfully logged out.');
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.error('You are not logged in.');
    }
  }
}

export default SUCOVIDLogoutHandler;
