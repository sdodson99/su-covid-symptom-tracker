import promptUsername from './username-prompt';
import promptPassword from './password-prompt';
import CredentialsProvider from '../credentials/credentials-provider';
import Credentials from '../credentials/credentials';

async function promptCredentialsIfNotProvided(
  username: string,
  password: string,
  credentialsProvider: CredentialsProvider
): Promise<Credentials> {
  const noCredentialsProvided = !username && !password;

  if (noCredentialsProvided) {
    const saveCredentials = await credentialsProvider.getCredentials();

    if (saveCredentials) {
      username = saveCredentials.username;
      password = saveCredentials.password;
    }
  }

  if (!username) {
    username = await promptUsername();
  }

  if (!password) {
    password = await promptPassword();
  }

  return {
    username,
    password,
  };
}

export default promptCredentialsIfNotProvided;
