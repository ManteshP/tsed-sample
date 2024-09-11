import { DataSource } from "@tsed/apollo";
import { Inject } from '@tsed/di';
import { Logger } from '@tsed/logger';
import { ERROR_NOT_FOUND, SM_SERVICE, THREE_SIXTY_ID } from '../../model/common/const';
import { GET_TENANT_DETAILS, LMS_NYR_ROUTE } from '../../model/common/routes';
import { TenantDetailsData } from '../../model/tenant-nyr/tenant-nyr-model';
import { ErrorUtils } from '../../utils/error';
import { LOGGER } from '../../utils/logger';
import { CONFIG } from '../config/config.provider';
import { BearerRestDataSource } from '../datasource/bearer-rest-datasource';
import { OrganizationService } from '../organization/organization.service';

@DataSource()
export class TenantNyrService extends BearerRestDataSource {
    readonly logger: Logger;
    private readonly errorUtils: ErrorUtils;

    constructor(
        @Inject(CONFIG) config: any,
        @Inject(LOGGER) logger: Logger,
        @Inject() errorUtils: ErrorUtils,
        @Inject()
        private organizationService: OrganizationService,
    ) {
        const { timeout } = config.get(SM_SERVICE);
        super(timeout);
        this.logger = logger;
        this.errorUtils = errorUtils;
    }

    public async getTenantDetails(organizationId: string, userId: string): Promise<TenantDetailsData | null> {
        try {
            if (!userId) {
                this.errorUtils.throwInvalidValueError('userId');
            }
            if (!organizationId) {
                this.errorUtils.throwInvalidValueError('organizationId');
            }
            const orgId = organizationId.split(',')[0];
            const threeSixtyId = await this.organizationService.getThreeSixtyId(orgId);

            if (!threeSixtyId) {
                this.errorUtils.throwInvalidValueError(THREE_SIXTY_ID);
            }

            const tenantDetails: TenantDetailsData = await this.getTenanatDetailsClient(threeSixtyId, orgId, userId);

            return tenantDetails;
        } catch (error) {
            this.logger.error(error);
            if (error?.extensions?.response?.status !== ERROR_NOT_FOUND) {
                throw error;
            }
            return null;
        }
    }

    private getTenanatDetailsClient(
        threeSixtyId: string,
        organizationId: string,
        userId: string
    ): Promise<TenantDetailsData> {
        try {
            const config = {
                headers: {
                    'user-id': userId,
                    'org-id': organizationId
                },
            };
            const url = threeSixtyId + LMS_NYR_ROUTE + GET_TENANT_DETAILS;
            return this.get(url, config);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public async getTimeZoneForOrg(orgId: string, userId: string) {
        const tenantDetails = await this.getTenantDetails(orgId, userId);
        const tenantTimeZone = tenantDetails?.data?.timeZone ? tenantDetails.data.timeZone : null;
        return tenantTimeZone;
    }
}
