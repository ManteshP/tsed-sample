import { ResolverController } from '@tsed/typegraphql';
import { Arg, Authorized, Ctx, Query } from 'type-graphql';
import { ROLES } from '../../model/common/const';
import { Context } from '../../model/common/context';
import { StudentSessionUsageThisWeek } from './get-student-session-usage-this-week.schema';

@ResolverController(StudentSessionUsageThisWeek)
export class StudentSessionUsageThisWeekResolver {

    constructor() {  }

    @Query(() => [StudentSessionUsageThisWeek])
    @Authorized(ROLES.STUDENT)
    public async getStudentSessionUsageThisWeek(
        @Arg('orgId') organizationId: string,
        @Arg('userId') userId: string,
        @Ctx() ctx: Context
    ): Promise<StudentSessionUsageThisWeek[]> {
        try {
            if (!organizationId) {
                console.log('organizationId not Exists');
            }
            if (!userId) {
                console.log('userId Not Exists');
            }
            const studentAssignments: StudentSessionUsageThisWeek[] =
                await ctx.dataSources.studentSessionUsageService
                    .getStudentSessionUsage(
                        organizationId,
                        userId
                    );
            return studentAssignments;
        } catch (error) {
            return error;
        }
    }
}
