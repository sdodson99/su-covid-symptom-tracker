const ContainerType = {
  CredentialsProvider: Symbol.for('CredentialsProvider'),
  SUCOVIDLoginHandler: Symbol.for('SUCOVIDLoginHandler'),
  SUCOVIDLogoutHandler: Symbol.for('SUCOVIDLogoutHandler'),
  SUCOVIDSubmitHandler: Symbol.for('SUCOVIDSubmitHandler'),
  SUCOVIDScheduleHandler: Symbol.for('SUCOVIDScheduleHandler'),
  SUCOVIDFormSubmitterBuilder: Symbol.for('SUCOVIDFormSubmitterBuilder'),
};

export default ContainerType;
