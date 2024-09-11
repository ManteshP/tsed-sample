import { Logger } from '@tsed/logger';
import { UserScope } from '../../services/auth/auth.typings';
import { OrganizationService } from '../../services/organization/organization.service';
import { StudentSessionUsageService } from '../../services/students-session-usage-this-week/students-session-usage-this-week.service';
import { TenantNyrService } from '../../services/tenant-nyr/tenant-nyr';

export interface DataSources {
    organizationService: OrganizationService;
    studentSessionUsageService: StudentSessionUsageService;
    tenantNyrService: TenantNyrService;
}

export interface Context {
    dataSources: DataSources;
    userScope: UserScope;
    authorization: string;
    logger: Logger;
    error: any;
    isAuthenticated: boolean;
    userId: string;
    orgId: string;
}
