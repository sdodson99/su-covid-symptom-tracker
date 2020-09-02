import { Logger } from 'su-covid-daily';
import { Context } from '@azure/functions';

class ContextLogger implements Logger {
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  log(message: string): void {
    this.context.log(message);
  }

  warn(message: string): void {
    this.context.log.warn(message);
  }
}

export default ContextLogger;
