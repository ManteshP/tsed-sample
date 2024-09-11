import { Inject, Service } from '@tsed/common';
import { Logger } from '@tsed/logger';
import axios from 'axios';
import { GraphQLError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { UserAssignment } from '../../model/assignment/assignment';
import { RBS_AUTH_SCOPE_ROUTE } from '../../model/common/routes';
import { UserRole } from '../../model/user/role';
import { ErrorUtils } from '../../utils/error';
import { LOGGER } from '../../utils/logger';
import { CONFIG } from '../config/config.provider';
import { AuthHeaders, AuthScope, UserScope } from './auth.typings';

@Service()
export class RbsAuthService {
    public static readonly tokenTypeBearer = 'Bearer';

    constructor(
        private readonly errorUtils: ErrorUtils,
        @Inject(LOGGER) private readonly logger: Logger,
        @Inject(CONFIG) private readonly config: any
    ) { }

    public async validateToken(authHeaders: AuthHeaders): Promise<AuthScope> {
        let userScope;
        try {
            this.logger.info('RbsAuthService: Inside validateToken');
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
            this.logger.error('Error in getting authScope:', err);
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
