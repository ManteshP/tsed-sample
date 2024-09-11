import { registerProvider } from '@tsed/di';
import config from 'config';

export const CONFIG = Symbol.for('CONFIG');

registerProvider({ provide: CONFIG, useValue: config });
