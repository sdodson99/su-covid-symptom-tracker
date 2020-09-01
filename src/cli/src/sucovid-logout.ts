#!/usr/bin/env node

import { Command } from 'commander';
import container from './containers/sucovid-container';
import ContainerType from './containers/container-type';
import SUCOVIDLogoutHandler from './command-handlers/su-covid-logout-handler';

const program = new Command();

program.parse();

const logoutHandler = container.get<SUCOVIDLogoutHandler>(
  ContainerType.SUCOVIDLogoutHandler
);

logoutHandler.handleLogout();
