import { PlatformTest } from '@tsed/common';
import axios from 'axios';
import { mockOrganizationDetailsServiceData, result } from '../../mock/organization.mock';
import { OrganizationService } from './organization.service';

xdescribe('organizationService', () => {
    beforeEach(PlatformTest.create);
    afterEach(PlatformTest.reset);

    it(
        'should extract threeSixtyId',
        PlatformTest.inject([OrganizationService], async (service: OrganizationService) => {
            expect(service.introduceThreeSixtyIdentifier({ ...mockOrganizationDetailsServiceData })).toEqual(result);
        })
    );

    it(
        'should return organization details with threeSixtyId',
        PlatformTest.inject([OrganizationService], async (service: any) => {
            jest.spyOn(axios, 'get').mockResolvedValue({ data: mockOrganizationDetailsServiceData });
            expect(await service.getOrganizationDetails('organizationId')).toMatchObject(result);
        })
    );
});
