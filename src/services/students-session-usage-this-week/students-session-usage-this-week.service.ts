import { DataSource } from "@tsed/apollo";
import { Inject, InjectContext } from '@tsed/di';

import { StudentSessionUsageThisWeek } from '../../schema/get-student-session-usage-this-week/get-student-session-usage-this-week.schema';
import { BearerRestDataSource } from '../datasource/bearer-rest-datasource';

import { PlatformContext } from "@tsed/common";

@DataSource()
export class StudentSessionUsageService extends BearerRestDataSource {
    @InjectContext()
    context: PlatformContext;


    public async getStudentSessionUsage(): Promise<StudentSessionUsageThisWeek[]> {
        return [{
            assignmentUserID: '123',
            thisWeekSessionUsage: {
                sessions: [{
                    sessionDate: '123',
                    sessionCorrect: '2',
                    sessionAttempt: '5'
                }],
                usage: '1'
            }
        }]
    }
}
