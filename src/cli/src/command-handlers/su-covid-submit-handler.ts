import { inject, injectable } from 'inversify';
import ContainerType from '../containers/container-type';
import submitForm from 'su-covid-daily';
import createReceiptPath from '../receipts/receipt-path-creator';
import promptCredentialsIfNotProvided from '../prompts/credentials-prompt';
import CredentialsProvider from '../credentials/credentials-provider';

@injectable()
class SUCOVIDSubmitHandler {
  private credentialsProvider: CredentialsProvider;

  constructor(
    @inject(ContainerType.CredentialsProvider)
    credentialsProvider: CredentialsProvider
  ) {
    this.credentialsProvider = credentialsProvider;
  }

  async handleSubmit(
    username: string,
    password: string,
    outputDirectory: string
  ) {
    const receiptPath = createReceiptPath(outputDirectory);
    const credentials = await promptCredentialsIfNotProvided(
      username,
      password,
      this.credentialsProvider
    );

    try {
      await submitForm(
        credentials.username,
        credentials.password,
        receiptPath,
        console
      );
    } catch (error) {
      console.error(error.message);
    }
  }
}

export default SUCOVIDSubmitHandler;
