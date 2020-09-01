import 'reflect-metadata';
import { Container } from 'inversify';
import ContainerType from './container-type';

import CredentialsProvider from '../credentials/credentials-provider';
import KeytarCredentialsProvider from '../credentials/keytar-credentials-provider';
import SUCOVIDLoginHandler from '../command-handlers/su-covid-login-handler';

const container = new Container();

container
  .bind<CredentialsProvider>(ContainerType.CredentialsProvider)
  .to(KeytarCredentialsProvider);

container
  .bind<SUCOVIDLoginHandler>(ContainerType.SUCOVIDLoginHandler)
  .to(SUCOVIDLoginHandler);

export default container;
