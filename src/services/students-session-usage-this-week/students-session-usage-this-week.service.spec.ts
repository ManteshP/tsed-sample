import { PlatformTest } from '@tsed/common';
import { ErrorUtils } from '../../utils/error';
import { TenantNyrService } from '../tenant-nyr/tenant-nyr';
import { StudentSessionUsageService } from './students-session-usage-this-week.service';

xdescribe('StudentSessionUsageService', () => {
    beforeEach(PlatformTest.create);
    afterEach(PlatformTest.reset);

    let throwInvalidValueError: jest.SpyInstance | null = null;
    let errorUtils: ErrorUtils | null = null;
    const tenantNyrService: TenantNyrService | null = null;

    beforeAll(
        PlatformTest.inject([ErrorUtils], async (utils: ErrorUtils) => {
            errorUtils = utils;
            throwInvalidValueError = jest.spyOn(errorUtils, 'throwInvalidValueError');
        })
    );

    it(
        'should throw error if there is no valid threeSixtyId',
        PlatformTest.inject(
            [StudentSessionUsageService, TenantNyrService],
            async (
                studentSessionUsageService: StudentSessionUsageService,
                tenantNyrService: TenantNyrService
            ) => {
                jest.spyOn(studentSessionUsageService['organizationService'], 'getThreeSixtyId')
                    .mockResolvedValue(Promise.resolve(''));
                const dataSources = {
                    tenantNyrService
                };
                const ctx = { dataSources } as any;
                studentSessionUsageService.context = { ...ctx, orgId: '3' };
                jest.spyOn(tenantNyrService!, 'getTimeZoneForOrg').mockResolvedValue('UTC');
                try {
                    await studentSessionUsageService.getStudentSessionUsage('7', '3');
                } catch (error) {
                    expect(error.message).toBe('Invalid value passed for Three Sixty Id');
                }
            })
    );
});
