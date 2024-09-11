import { Middleware, Req } from '@tsed/common';
import { UserScope } from '../services/auth/auth.typings';
import { RbsAuthService } from '../services/auth/rbs-auth.service';

type Request = {
    userScope?: UserScope;
    isAuthenticated?: boolean;
    error: any;
};

@Middleware()
export class GlobalRbsAuthMiddleware {
    constructor(private readonly rbsAuthService: RbsAuthService) { }

    public async use(@Req() request: Req & Request): Promise<void> {
        if (!request.isAuthenticated) {
            request.isAuthenticated = false;
        }

        try {
            const authScope = await this.rbsAuthService.validateToken(request.headers);
            request.userScope = authScope.userScope;
            request.error = authScope.error;
            request.isAuthenticated = authScope.userScope ? true : false;
        } catch (err) {
            const { statusCode, statusMessage } = err;
            console.log('error getting user scope', {
                statusCode,
                statusMessage
            });
        }
    }
}
