import { PlatformTest } from '@tsed/common';
import { StudentAssignmentService } from '../../services/student-assignments/student-assignments.service';
import { StudentSessionUsageService } from '../../services/students-session-usage-this-week/students-session-usage-this-week.service';
import { ErrorUtils } from '../../utils/error';
import { StudentSessionUsageThisWeekResolver } from './get-student-session-usage-this-week.resolver';

xdescribe('getStudentSessionUsage', () => {
    jest.useFakeTimers();
    beforeEach(PlatformTest.create);
    afterEach(PlatformTest.reset);
    let studentSessionUsageService: StudentSessionUsageService | null = null;
    let studentSessionUsageThisWeekResolver: StudentSessionUsageThisWeekResolver | null = null;
    let errorUtils: ErrorUtils | null = null;
    let throwInvalidValueErrorSpy: jest.SpyInstance | null = null;

    beforeAll(
        PlatformTest.inject(
            [StudentAssignmentService, ErrorUtils, StudentSessionUsageThisWeekResolver],
            async (
                studentAssignmentServiceObject: StudentSessionUsageService,
                utils: ErrorUtils,
                resolver: StudentSessionUsageThisWeekResolver
            ) => {
                studentSessionUsageThisWeekResolver = resolver;
                errorUtils = utils;
                studentSessionUsageService = studentAssignmentServiceObject;

                throwInvalidValueErrorSpy = jest.spyOn(errorUtils, 'throwInvalidValueError');
            }
        )
    );

    it('should throws error if orgIds are not provided', async () => {
        const dataSources = { studentSessionUsageService };
        const ctx = { dataSources } as any;
        await studentSessionUsageThisWeekResolver?.
            getStudentSessionUsageThisWeek('', 'userId', ctx);
        expect(throwInvalidValueErrorSpy).toHaveBeenCalledWith('organizationId');
    });

    it('should throws error if userId is not provided', async () => {
        const dataSources = { studentSessionUsageService };
        const ctx = { dataSources } as any;
        await studentSessionUsageThisWeekResolver?.
            getStudentSessionUsageThisWeek('organizationId', '', ctx);
        expect(throwInvalidValueErrorSpy).toHaveBeenCalledWith('userId');
    });
});
