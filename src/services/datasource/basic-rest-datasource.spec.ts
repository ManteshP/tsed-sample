import { AugmentedRequest, RequestWithoutBody } from '@apollo/datasource-rest';
// import { DataSourceConfig } from 'apollo-datasource';
// import { Headers, URLSearchParams } from 'apollo-server-env';
import { CacheTest } from '../../utils/cache';
import { BasicRestDataSource } from './basic-rest-datasource';

xdescribe('BasicRestDataSource', () => {
    class TestBasicDataSource extends BasicRestDataSource { }

    let service: BasicRestDataSource;
    let parent;

    beforeEach(() => {
        service = new TestBasicDataSource('user', 'pass', 30000);
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
        const token = Buffer.from('user:pass').toString('base64');
        const path = '/api'
        const request: any = {
            path: '/api',
            headers: new Headers(),
            params: new URLSearchParams()
        };
        
        request.method = 'GET';
        service['willSendRequest'](path, request);

        expect(request.headers['authorization']).toEqual(`Basic ${token}`);
        expect(request.params).toBeDefined();
    });

    it('should not add time with the params when the request method is POST', async () => {
        const token = Buffer.from('user:pass').toString('base64');
        const path = '/api'
        const request: any = {
            path: '/api',
            params: new URLSearchParams(),
            headers: new Headers()
        };
        request.method = 'POST';
        service['willSendRequest'](path, request);

        expect(request.headers['authorization']).toEqual(`Basic ${token}`);
        expect(request.params).toBeDefined();
    });
});
