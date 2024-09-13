import { Logger } from '@tsed/logger';
import { GraphQLError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { AuthChecker } from 'type-graphql';

import { AuthScope } from '../services/auth/auth.typings';

type CONTEXT = AuthScope & { logger: Logger } & { userId: string; orgId: string };

export const customAuthChecker: AuthChecker<CONTEXT> = ({ context }, roles) => {
    const { userScope, isAuthenticated, error, userId, orgId } = context;
    if (error) {
        throw error;
    }

    context.logger.info('AUTH CHECKER: ', {
        roles,
        userScope
    });

    const tokenUserId = userScope?.userId;

    if (
        !isAuthenticated ||
        !userScope ||
        userId !== tokenUserId ||
        !userScope.accessInfo.organizations.includes(orgId)
    ) {
        const extensions: Record<string, number> = { 'status': StatusCodes.UNAUTHORIZED };
        throw new GraphQLError('Not authenticated.', extensions);
    }

    if (roles && roles.length) {
        const {
            accessInfo: { role: userRoles }
        } = userScope;
        const authorized = roles.some((role) => userRoles.includes(role));
        context.logger.error('AUTH CHECKER: Roles not available', {
            roles,
            userRoles
        });
        if (!authorized) {
            return false;
        }
    }
    return true;
};
