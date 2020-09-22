import { inject, injectable } from 'inversify';
import ContainerType from '../containers/container-type';
import { SUCOVIDFormSubmitterBuilder } from 'su-covid-daily';
import createReceiptPath from '../receipts/receipt-path-creator';
import promptCredentialsIfNotProvided from '../prompts/credentials-prompt';
import CredentialsProvider from '../credentials/credentials-provider';

@injectable()
class SUCOVIDSubmitHandler {
  private formSubmitterBuilder: SUCOVIDFormSubmitterBuilder;
  private credentialsProvider: CredentialsProvider;

  constructor(
    @inject(ContainerType.SUCOVIDFormSubmitterBuilder)
    formSubmitterBuilder: SUCOVIDFormSubmitterBuilder,
    @inject(ContainerType.CredentialsProvider)
    credentialsProvider: CredentialsProvider
  ) {
    this.formSubmitterBuilder = formSubmitterBuilder;
    this.credentialsProvider = credentialsProvider;
  }

  async handleSubmit(
    username: string,
    password: string,
    outputDirectory: string,
    skipSubmission = false,
    skipReceipt = false
  ) {
    const receiptPath = createReceiptPath(outputDirectory);
    const credentials = await promptCredentialsIfNotProvided(
      username,
      password,
      this.credentialsProvider
    );

    if (!skipReceipt) {
      this.formSubmitterBuilder.withReceipt(receiptPath);
    }

    const formSubmitter = this.formSubmitterBuilder
      .withoutSubmission(skipSubmission)
      .build();

    try {
      await formSubmitter.submitForm(
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
