import { AlterApolloContext, ApolloContext } from '@tsed/apollo';
import { PlatformContext } from '@tsed/common';
import { Injectable } from '@tsed/di';
import { Logger } from '@tsed/logger';
import { UserScope } from 'src/services/auth/auth.typings';

export interface CustomApolloContext extends ApolloContext{
    userScope: UserScope;
    authorization: string;
    logger: Logger;
    error: any;
    isAuthenticated: boolean;
    userId: string;
    orgId: string;
}

@Injectable()
export class CustomContext implements AlterApolloContext {

  async $alterApolloContext(context: ApolloContext, $ctx: PlatformContext): Promise<CustomApolloContext> {
    return {
      ...context,
      authorization: $ctx.getRequest().headers['authorization'],
      userId: $ctx.getRequest().headers['user-id'],
      orgId: $ctx.getRequest().headers['org-id'],
      isAuthenticated: $ctx.getRequest().headers.isAuthenticated,
      userScope: $ctx.getRequest().userScope,
      logger: $ctx.getRequest().logger,
      error: $ctx.error
    };
  }
}
