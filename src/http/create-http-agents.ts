import Agent from 'agentkeepalive';

export const createHttpAgent = (options: any) => new Agent({
    maxSockets: options.get('maxSockets'),
    maxFreeSockets: options.get('maxFreeSockets'),
    timeout: options.get('timeout'),
    freeSocketTimeout: options.get('freeSocketTimeout'),
    keepAlive: true
});

export const createHttpsAgent = (options: any) => new Agent.HttpsAgent({
    maxSockets: options.get('maxSockets'),
    maxFreeSockets: options.get('maxFreeSockets'),
    timeout: options.get('timeout'),
    freeSocketTimeout: options.get('freeSocketTimeout'),
    keepAlive: true
});

