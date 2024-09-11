import axios from 'axios';
import { createHttpAgent, createHttpsAgent } from './create-http-agents';

export const configureHttp = (options: any): void => {
    axios.defaults.httpAgent = createHttpAgent(options);
    axios.defaults.httpsAgent = createHttpsAgent(options);
};

export const logAgentDetails = (): void => {
    setTimeout(() => {
        if (axios.defaults.httpAgent.statusChanged) {
            console.log('[%s] agent status changed: %j', Date(), axios.defaults.httpAgent.getCurrentStatus());
        }
    }, 2000);

    setTimeout(() => {
        if (axios.defaults.httpsAgent.statusChanged) {
            console.log('[%s] agent status changed: %j', Date(), axios.defaults.httpsAgent.getCurrentStatus());
        }
    }, 2000);
};

