import { ResolverController } from '@tsed/typegraphql';
import { StudentSessionUsageService } from 'src/services/students-session-usage-this-week/students-session-usage-this-week.service';
import { Arg, Authorized, Ctx, Query } from 'type-graphql';

import { CustomApolloContext } from '../../model/common/context';
import { StudentSessionUsageThisWeek } from './get-student-session-usage-this-week.schema';

export enum ROLES {
    TEACHER = 'Teacher',
    PEARSON_ADMIN = 'Pearson Admin',
    CUSTOMER_ADMIN = 'Customer Admin',
    STUDENT = 'Student'
}

@ResolverController(StudentSessionUsageThisWeek)
export class StudentSessionUsageThisWeekResolver {

    constructor() {  }

    @Query(() => [StudentSessionUsageThisWeek])
    @Authorized(ROLES.STUDENT)
    public async getStudentSessionUsageThisWeek(
        @Arg('orgId') organizationId: string,
        @Arg('userId') userId: string,
        @Ctx() ctx: CustomApolloContext
    ): Promise<StudentSessionUsageThisWeek[]> {
        try {
            if (!organizationId) {
                console.log('organizationId not Exists');
            }
            if (!userId) {
                console.log('userId Not Exists');
            }
            const studentAssignments: StudentSessionUsageThisWeek[] =
                await (ctx.dataSources.studentSessionUsageService as StudentSessionUsageService)
                    .getStudentSessionUsage();
            return studentAssignments;
        } catch (error) {
            return error;
        }
    }
}
