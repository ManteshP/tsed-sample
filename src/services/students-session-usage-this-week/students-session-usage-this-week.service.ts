import { DataSource } from "@tsed/apollo";
import { Inject, InjectContext } from '@tsed/di';
import { Logger } from '@tsed/logger';
import { INVALID_THREE_SIXTY_ID, SM_SERVICE } from '../../model/common/const';
import { DataSources } from '../../model/common/context';
import { ErrorMessage, Result } from '../../model/common/result';
import { LMS_API_ROUTE, STUDENT_USAGE_THIS_WEEK } from '../../model/common/routes';
import {
    SessionUsageThisWeekModel,
    StudentRecentSessionsModel,
    StudentSessionUsageThisWeekAPIResponse
} from '../../model/session/session-usage';
import {
    SessionUsageThisWeek,
    StudentSessionDetails,
    StudentSessionUsageThisWeek
} from '../../schema/get-student-session-usage-this-week/get-student-session-usage-this-week.schema';
import { DateConverterUtil } from '../../utils/DateConverterUtil';
import { ErrorUtils } from '../../utils/error';
import { LOGGER } from '../../utils/logger';
import { CONFIG } from '../config/config.provider';
import { BearerRestDataSource } from '../datasource/bearer-rest-datasource';
import { OrganizationService } from '../organization/organization.service';

import { PlatformContext } from "@tsed/common";
import axios from 'axios';

@DataSource()
export class StudentSessionUsageService extends BearerRestDataSource {
    @InjectContext()
    context: PlatformContext;

    readonly logger: Logger;
    private readonly errorUtils: ErrorUtils;

    constructor(
        @Inject(CONFIG) config: any,
        @Inject(LOGGER) logger: Logger,
        @Inject() errorUtils: ErrorUtils,
        private organizationService: OrganizationService
    ) {
        const { timeout } = config.get(SM_SERVICE);
        super(timeout);
        this.logger = logger;
        this.errorUtils = errorUtils;
    }

    public async getStudentSessionUsage(
        organizationId: string,
        userId: string,
    ): Promise<StudentSessionUsageThisWeek[]> {
        try {
            const tenantTimeZone = await (
                this.context.dataSources as DataSources
            ).tenantNyrService.getTimeZoneForOrg(organizationId, userId);
            const threeSixtyId = await this.getThreeSixtyId(organizationId);
            if (!threeSixtyId) {
                this.errorUtils.throwInvalidValueError(INVALID_THREE_SIXTY_ID);
            }
            const url = threeSixtyId + LMS_API_ROUTE + STUDENT_USAGE_THIS_WEEK + userId;
            const { authorization } = this.context;
            const headers = {
                'user-id': userId,
                'org-id': organizationId,
                'authorization': authorization
            };
            const response = await axios.post(url, {}, {
                headers
            });
            const result: Result<StudentSessionUsageThisWeekAPIResponse> = response.data;
            if (result.success && result.messages) {
                const studentSessionUsageThisWeekData: any = result.data;
                if (!studentSessionUsageThisWeekData) {
                    this.errorUtils.throwDataNotFoundError(result.messages[0]);
                } else {
                    return this.convertResponseToArray(studentSessionUsageThisWeekData, tenantTimeZone);
                }
            } else {
                const error: ErrorMessage[] = result.messages;
                this.errorUtils.throwInvalidValueError(error[0].message);
            }
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    private getThreeSixtyId(organizationId: string): Promise<string> {
        return this.organizationService.getThreeSixtyId(organizationId);
    }

    private convertResponseToArray(data: any, tenantTimeZone?: string | null): StudentSessionUsageThisWeek[] {
        const studentSessionUsageThisWeek = [];
        for (const assignmentUserID in data) {
            studentSessionUsageThisWeek.push({
                assignmentUserID: assignmentUserID,
                thisWeekSessionUsage: this.formatResponse(data[assignmentUserID], tenantTimeZone)
            });
        }
        return studentSessionUsageThisWeek;
    }

    private formatResponse(data: SessionUsageThisWeekModel, tenantTimeZone?: string | null): SessionUsageThisWeek {
        const sessionUsageThisWeek: SessionUsageThisWeek = {
            usage: data.usageThisWeek || '0',
            sessions: this.convertSessionAttemptCorrect(data.recentSessions, tenantTimeZone)
        };
        return sessionUsageThisWeek;
    }

    private convertSessionAttemptCorrect(
        sessionDetails: StudentRecentSessionsModel[],
        tenantTimeZone?: string | null
    ): StudentSessionDetails[] {
        const studentSessionDetails: StudentSessionDetails[] = [];
        sessionDetails.forEach((studentSessionDetail) => {
            studentSessionDetails.push({
                sessionDate: DateConverterUtil.getZonedDateTime(
                    new Date(studentSessionDetail.sessionDate * 1000),
                    tenantTimeZone
                ),
                sessionCorrect: studentSessionDetail.sessionCorrect.toString(),
                sessionAttempt:
                    studentSessionDetail.sessionAttempt == null ||
                        studentSessionDetail.sessionAttempt == 0
                        ? 'NA'
                        : studentSessionDetail.sessionAttempt.toString(),
            });
        });
        return studentSessionDetails;
    }
}
