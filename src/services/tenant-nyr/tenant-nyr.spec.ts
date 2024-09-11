import { PlatformTest } from '@tsed/common';
import { TenantNyrService } from './tenant-nyr';

xdescribe('teacher data service', () => {
    beforeEach(PlatformTest.create);
    afterEach(PlatformTest.reset);

    const dummyOrganizationId = '8a97b1cf5891d2b60158db757c61304d';

    it(
        'should throw error if userId parameters are not provided',
        PlatformTest.inject([TenantNyrService], async (tenantNyrService: TenantNyrService) => {
            try {
                await tenantNyrService.getTenantDetails('mockOrgid', '');
            } catch (error) {
                expect(error.message).toBe('Invalid value passed for userId');
            }
        })
    );

    it(
        'should throw error if userId parameters are not provided',
        PlatformTest.inject([TenantNyrService], async (tenantNyrService: TenantNyrService) => {
            try {
                await tenantNyrService.getTenantDetails('', 'mockUserId');
            } catch (error) {
                expect(error.message).toBe('Invalid value passed for organizationId');
            }
        })
    );

    describe('organizationService response', () => {
        it(
            'should throw error if organization three sixty id is not defined',
            PlatformTest.inject(
                [TenantNyrService],
                async (tenantNyrService: TenantNyrService) => {
                    jest.spyOn(tenantNyrService['organizationService'], 'getThreeSixtyId')
                        .mockResolvedValue('');
                    try {
                        await tenantNyrService.getTenantDetails('mockOrgId', 'mockUserId');
                    } catch (error) {
                        expect(error.message).toBe('Invalid value passed for ThreeSixty Id');
                    }
                }
            )
        );
    });
});
