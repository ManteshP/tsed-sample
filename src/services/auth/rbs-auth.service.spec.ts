import { PlatformTest } from '@tsed/common';
import axios from 'axios';
import { UserAssignment } from '../../model/assignment/assignment';
import { UserScope } from './auth.typings';
import { RbsAuthService } from './rbs-auth.service';

xdescribe('validateToken', () => {
    beforeEach(PlatformTest.create);
    afterEach(PlatformTest.reset);

    it('should return an invalid token apollo-error',
        PlatformTest.inject([RbsAuthService], async (service: RbsAuthService) => {
            const { error } = await service.validateToken({
                authorization: 'foo',
            });
            expect(error === undefined).toBeFalsy();
        })
    );

    it('should return missing authorization header apollo-error',
        PlatformTest.inject([RbsAuthService], async (service: RbsAuthService) => {
            const { error } = await service.validateToken({});
            expect(error === undefined).toBeFalsy();
        })
    );

    it('should return fetch User_scope apollo error',
        PlatformTest.inject([RbsAuthService], async (service: RbsAuthService) => {
            jest.spyOn(axios, 'get').mockImplementation(() => {
                throw new Error('error');
            });
            const { error } = await service.validateToken({
                authorization: 'Bearer 1234',
            });
            expect(error === undefined).toBeFalsy();
        })
    );

    it('should return user scope with token value',
        PlatformTest.inject([RbsAuthService], async (service: RbsAuthService) => {
            const userScope = {};
            jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: userScope }));
            const response = await service.validateToken({
                authorization: 'Bearer 1234',
            });
            expect(response).toMatchObject({
                userScope: { token: '1234' },
            });
        })
    );
});

xdescribe('isUserAuthenticated', () => {
    beforeEach(PlatformTest.create);
    afterEach(PlatformTest.reset);

    it('should return true for authenticated teacher user',
        PlatformTest.inject([RbsAuthService], async (service: RbsAuthService) => {
            const userScope: UserScope = generateTeacherUserScope('classId');
            const userAssignment: UserAssignment = getUserAssignmentMockData();
            const response = service.isUserAuthenticated(userScope, userAssignment);
            expect(response).toBeTruthy();
        })
    );

    it('should return false for unauthenticated teacher user',
        PlatformTest.inject([RbsAuthService], async (service: RbsAuthService) => {
            const userScope: UserScope = generateTeacherUserScope('classId1');
            const userAssignment: UserAssignment = getUserAssignmentMockData();
            const response = service.isUserAuthenticated(userScope, userAssignment);
            expect(response).toBeFalsy();
        })
    );

    it('should return true for authenticated admin user',
        PlatformTest.inject([RbsAuthService], async (service: RbsAuthService) => {
            const userScope: UserScope = generateAdminUserScope('classId');
            const userAssignment: UserAssignment = getUserAssignmentMockData();
            const response = service.isUserAuthenticated(userScope, userAssignment);
            expect(response).toBeTruthy();
        })
    );

    it('should return false for authenticated student user',
        PlatformTest.inject([RbsAuthService], async (service: RbsAuthService) => {
            const userScope: UserScope = generateStudentUserScope();
            const userAssignment: UserAssignment = getUserAssignmentMockData();
            const response = service.isUserAuthenticated(userScope, userAssignment);
            expect(response).toBeFalsy();
        })
    );
});

const generateTeacherUserScope = (classId: string): UserScope => ({
    userId: 'id',
    scope: 'scope',
    accessInfo: {
        username: '',
        organizations: [],
        role: ['Teacher'],
    },
    token: 'token',
    classes: {
        [classId]: {},
    },
    stateCode: 'CC',
});

const generateAdminUserScope = (classId: string): UserScope => ({
    userId: 'studentUuid',
    scope: 'scope',
    accessInfo: {
        username: '',
        organizations: [],
        role: ['Customer Admin'],
    },
    classes: {
        [classId]: {},
    },
    stateCode: 'CC',
    token: 'token',
});

const generateStudentUserScope = (): UserScope => ({
    userId: 'studentUuid',
    scope: 'scope',
    accessInfo: {
        username: '',
        organizations: [],
        role: ['Student'],
    },
    stateCode: 'CC',
    token: 'token',
});

const getUserAssignmentMockData = (studentUuid?: string): UserAssignment => ({
    studentUuid: studentUuid || 'studentUuid',
    assignmentId: 'assignmentId',
    id: 'id',
    itemType: 'TEST',
    classUuid: 'classId',
    lastOpenDate: 0,
    attachmentUrl: 'url',
    markCompleted: false,
    autoCompleteEnabled: false,
    autoCompleted: false,
    createdDate: 0,
    userAssignmentStatus: '',
    attachmentTitle: '',
    userAssignmentDataList: [],
    userAssignmentLanguageList: [],
    studentGoogleDocAssignmentId: '',
    deleted: true,
    correctTasks: 0,
    totalTasks: 0,
});
