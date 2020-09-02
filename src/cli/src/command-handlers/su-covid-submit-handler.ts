import { inject, injectable } from 'inversify';
import ContainerType from '../containers/container-type';
import { SUCOVIDFormSubmitter } from 'su-covid-daily';
import createReceiptPath from '../receipts/receipt-path-creator';
import promptCredentialsIfNotProvided from '../prompts/credentials-prompt';
import CredentialsProvider from '../credentials/credentials-provider';

@injectable()
class SUCOVIDSubmitHandler {
  private formSubmitter: SUCOVIDFormSubmitter;
  private credentialsProvider: CredentialsProvider;

  constructor(
    @inject(ContainerType.SUCOVIDFormSubmitter)
    formSubmitter: SUCOVIDFormSubmitter,
    @inject(ContainerType.CredentialsProvider)
    credentialsProvider: CredentialsProvider
  ) {
    this.formSubmitter = formSubmitter;
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
      await this.formSubmitter.submitForm(
        credentials.username,
        credentials.password,
        receiptPath
      );
    } catch (error) {
      console.error(error.message);
    }
  }
}

export default SUCOVIDSubmitHandler;
