interface SUCOVIDFormSubmitter {
  submitForm(username: string, password: string, receiptPath: string): Promise<void>;
}

export default SUCOVIDFormSubmitter;
