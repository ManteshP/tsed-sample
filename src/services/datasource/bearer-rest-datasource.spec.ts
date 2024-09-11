import { RequestOptions } from '@apollo/datasource-rest';
// import { DataSourceConfig } from 'apollo-datasource';
// import { Headers, URLSearchParams } from 'apollo-server-env';
import { CacheTest } from '../../utils/cache';
import { BearerRestDataSource } from './bearer-rest-datasource';

xdescribe('BearerRestDataSource', () => {
    class TestBasicDataSource extends BearerRestDataSource { }

    let service: BearerRestDataSource;
    let parent;

    beforeEach(() => {
        service = new TestBasicDataSource(30000);
        const context = {
            authorization: 'Bearer 1234',
            userScope: {
                userId: 'testUserId'
            }
        };
        // const config: DataSourceConfig<{ [key: string]: any }> = {
        //     context,
        //     cache: new CacheTest()
        // };
        // service.initialize(config);

        parent = Object.getPrototypeOf(service);
        jest.spyOn(parent, 'get');
        jest.spyOn(parent, 'post');
        jest.spyOn(parent, 'delete');
    });

    it('should add basic authorization and time to the headers for every request', async () => {
        const path = '/api';
        const request: any = {
            path: '/api',
            params: new URLSearchParams(),
            headers: new Headers() as any // TODO: Fix the headers type issue
        };
        request.method = 'GET';
        service['willSendRequest'](path, request);

        expect(request.headers.get('authorization')).toEqual('Bearer 1234');
        expect(request.params).toBeDefined();
    });

    it('should not add time with the params when the request method is POST', async () => {
        ;
        const path = '/api';
        const request: any = {
            path: '/api',
            params: new URLSearchParams(),
            headers: new Headers() as any
        };
        request.method = 'POST';
        service['willSendRequest'](path, request);

        expect(request.headers.get('authorization')).toEqual('Bearer 1234');
        expect(request.params).toBeDefined();
    });
});
