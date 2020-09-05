import 'reflect-metadata';
import { Container } from 'inversify';
import ContainerType from './container-type';
import CredentialsProvider from '../credentials/credentials-provider';
import KeytarCredentialsProvider from '../credentials/keytar-credentials-provider';
import SUCOVIDLoginHandler from '../command-handlers/su-covid-login-handler';
import SUCOVIDLogoutHandler from '../command-handlers/su-covid-logout-handler';
import SUCOVIDSubmitHandler from '../command-handlers/su-covid-submit-handler';
import SUCOVIDScheduleHandler from '../command-handlers/su-covid-schedule-handler';
import {
  SUCOVIDFormSubmitter,
  SUCOVIDFormSubmitterBuilder,
} from 'su-covid-daily';

const container = new Container();

container
  .bind<CredentialsProvider>(ContainerType.CredentialsProvider)
  .to(KeytarCredentialsProvider);

container
  .bind<SUCOVIDLoginHandler>(ContainerType.SUCOVIDLoginHandler)
  .to(SUCOVIDLoginHandler);

container
  .bind<SUCOVIDLogoutHandler>(ContainerType.SUCOVIDLogoutHandler)
  .to(SUCOVIDLogoutHandler);

container
  .bind<SUCOVIDSubmitHandler>(ContainerType.SUCOVIDSubmitHandler)
  .to(SUCOVIDSubmitHandler);

container
  .bind<SUCOVIDScheduleHandler>(ContainerType.SUCOVIDScheduleHandler)
  .to(SUCOVIDScheduleHandler);

const skipSubmission = process.env.NODE_ENV === 'development';
const formSubmitterBuilder = new SUCOVIDFormSubmitterBuilder();
const formSubmitter = formSubmitterBuilder
  .withLogger(console)
  .withoutSubmission(skipSubmission)
  .build();

container
  .bind<SUCOVIDFormSubmitter>(ContainerType.SUCOVIDFormSubmitter)
  .toConstantValue(formSubmitter);

export default container;
