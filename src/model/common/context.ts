import { Logger } from '@tsed/logger';
import { UserScope } from '../../services/auth/auth.typings';
import { StudentSessionUsageService } from '../../services/students-session-usage-this-week/students-session-usage-this-week.service';

export interface DataSources {
    studentSessionUsageService: StudentSessionUsageService;
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
