import { Container } from 'inversify';
import ContainerType from './container-type';

import CredentialsProvider from '../credentials/credentials-provider';
import KeytarCredentialsProvider from '../credentials/keytar-credentials-provider';

const container = new Container();

container
  .bind<CredentialsProvider>(ContainerType.CredentialsProvider)
  .to(KeytarCredentialsProvider);

export default container;
