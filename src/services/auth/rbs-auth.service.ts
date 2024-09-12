import { Inject, Service } from '@tsed/common';
import axios from 'axios';
import { GraphQLError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { CONFIG } from '../config/config.provider';
import { AuthHeaders, AuthScope, UserScope } from './auth.typings';

export const RBS_AUTH_SCOPE_ROUTE = '/oauth/token/auth_scope';
export interface UserAssignmentLanguage {
    userAssignmentId: string;
    itemUuid: string;
    itemVersion: number;
    isSelected: boolean;
    languageLocale: string;
    isdefault: boolean;
}
export interface UserAssignmentData {
    userAssignmentId: string;
    createDate?: number;
    score?: number;
    correctAnswers: number;
    totalQuestions?: number;
    completionStatus: string;
    totalTime?: number;
    successStatus: string;
    scoreSource?: string;
    scoreSent: boolean;
    manualScore?: boolean;
    needsManualScoring?: boolean;
}
export interface UserAssignment {
    assignmentId: string;
    itemType: string;
    classUuid: string;
    studentUuid: string;
    id: string;
    lastOpenDate: number;
    attachmentUrl: string;
    markCompleted: boolean;
    autoCompleteEnabled: boolean;
    autoCompleted: boolean;
    createdDate: number;
    userAssignmentStatus: string;
    attachmentTitle: string;
    userAssignmentDataList: UserAssignmentData[];
    userAssignmentLanguageList: UserAssignmentLanguage[];
    studentGoogleDocAssignmentId: string;
    deleted: boolean;
    correctTasks: number;
    totalTasks: number;
}
export enum UserRole {
    CUSTOMER_ADMIN = 'Customer Admin',
    TEACHER = 'Teacher',
    STUDENT = 'Student',
}

@Service()
export class RbsAuthService {
    public static readonly tokenTypeBearer = 'Bearer';

    constructor( @Inject(CONFIG) private readonly config: any ) { }

    public async validateToken(authHeaders: AuthHeaders): Promise<AuthScope> {
        let userScope;
        try {
            console.log('RbsAuthService: Inside validateToken');
            const { authorization } = authHeaders;
            if (!authorization) {
                throw new Error('Missing Authorization token');
            }
            const [tokenType, tokenValue] = authorization.split(' ');
            if (tokenType.toLowerCase() !== 'bearer') {
                throw new Error('Invalid Auth Token');
            }
            const {
                baseUrl,
                auth: { user, pass },
            } = this.config.get('RBS');

            const scopeUrl = `${baseUrl}${RBS_AUTH_SCOPE_ROUTE}/?includeStateCode=true`;

            const headers = { access_token: tokenValue };

            const { data } = await axios.get(scopeUrl, {
                headers,
                auth: {
                    username: user,
                    password: pass,
                },
            });
            userScope = data;
            return {
                userScope: {
                    ...userScope,
                    token: tokenValue,
                },
            };
        } catch (err) {
            console.log('Error in getting authScope:', err);
            return {
                error: new GraphQLError('UNAUTHORIZED', {
                    extensions: { code: StatusCodes.UNAUTHORIZED },
                })
            };
        }
    }

    public isUserAuthenticated(userScope: UserScope, userAssignment: UserAssignment): boolean {
        const role = userScope.accessInfo.role[0];
        if (role === UserRole.TEACHER || role === UserRole.CUSTOMER_ADMIN) {
            if (userScope.classes && userScope.classes[userAssignment.classUuid]) {
                return true;
            }
        }
        return false;
    }
}
